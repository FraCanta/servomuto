"""Public-only, resumable SERVOMUTO content and asset importer (stdlib only)."""
from html.parser import HTMLParser
from html import unescape
from urllib.request import Request, urlopen
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote
from pathlib import Path
import hashlib
import json
import re
import time
import xml.etree.ElementTree as ET
import sys

ORIGIN = 'https://www.servomuto.it'
ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.migration'
CACHE.mkdir(exist_ok=True)
DATA = ROOT / 'src/data'


class Element:
    def __init__(self, tag='', attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []

    def text(self):
        return unescape(re.sub(r'\s+', ' ', ''.join(c.text() if isinstance(c, Element) else c for c in self.children)).strip())

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.walk()


class Parser(HTMLParser):
    def __init__(self, content):
        super().__init__(convert_charrefs=True)
        self.root = Element('root')
        self.stack = [self.root]
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs)
        self.stack[-1].children.append(node)
        if tag == 'br':
            self.stack[-1].children.append(' ')
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, value):
        if self.stack[-1].tag not in {'script', 'style'}:
            self.stack[-1].children.append(value)


def fetch(url):
    time.sleep(.22)
    with urlopen(Request(url, headers={'User-Agent': 'SERVOMUTO public content migration/1.0'}), timeout=35) as response:
        return response.read()


def page_url(url):
    parsed = urlsplit(url)
    if parsed.hostname not in {'www.servomuto.it', 'servomuto.it'}:
        return None
    if parsed.path.startswith(('/assets/', '/api/', '/config/', '/universal/')) or re.search(r'\.[a-z0-9]{2,5}$', parsed.path, re.I):
        return None
    if parsed.path in {'/cart', '/search', '/checkout', '/account'}:
        return None
    return ORIGIN + (parsed.path.rstrip('/') or '/')


def safe(value):
    return re.sub(r'[^a-z0-9.-]+', '-', value.lower()).strip('-') or 'asset'


def image_url(node, url):
    candidates = [node.attrs.get(k, '') for k in ('data-src', 'data-image', 'src')]
    candidates += [v.strip().split(' ')[0] for v in node.attrs.get('srcset', '').split(',')]
    for value in candidates:
        absolute = urljoin(url, value)
        parsed = urlsplit(absolute)
        if parsed.hostname in {'images.squarespace-cdn.com', 'static1.squarespace.com', 'static.squarespace.com'} and re.search(r'\.(jpg|jpeg|png|webp|gif)$', parsed.path, re.I):
            return urlunsplit(('https', parsed.netloc, parsed.path, '', ''))
    return None


def extract(body, url):
    tree = Parser(body).root
    nodes = list(tree.walk())
    main = next((n for n in nodes if n.tag == 'main'), tree)
    title = next((n.text() for n in nodes if n.tag == 'title'), urlsplit(url).path)
    title = re.sub(r'\s*[—–|]\s*SERVOMUTO.*$', '', title).strip()
    blocks, pictures, links = [], [], []
    seen_images = set()
    def visit(node):
        if node.tag in {'script', 'style', 'noscript', 'nav', 'header', 'footer'}:
            return
        if node.tag in {'h1', 'h2', 'h3', 'h4', 'p', 'li'}:
            value = node.text()
            if value:
                blocks.append({'kind': 'heading' if node.tag.startswith('h') else 'text', 'text': value})
        if node.tag == 'img':
            source = image_url(node, url)
            if source and source not in seen_images:
                seen_images.add(source)
                item = {'originalUrl': source, 'alt': node.attrs.get('alt', ''), 'sourcePage': url}
                pictures.append(item)
                blocks.append({'kind': 'image', 'originalUrl': source, 'text': item['alt']})
        if node.tag == 'a' and node.attrs.get('href'):
            href = urljoin(url, node.attrs['href'])
            if href.startswith(('https:', 'http:', 'mailto:', 'tel:')):
                title_text = node.text() or next((c.attrs.get('alt', '') for c in node.walk() if c.tag == 'img'), '')
                links.append({'href': href, 'label': title_text})
        for child in node.children:
            if isinstance(child, Element):
                # Avoid duplicate text paragraphs nested inside list items.
                if node.tag == 'li' and child.tag == 'p':
                    for nested in child.children:
                        if isinstance(nested, Element):
                            visit(nested)
                else:
                    visit(child)
    visit(main)
    all_links = [urljoin(url, n.attrs['href']) for n in nodes if n.tag == 'a' and n.attrs.get('href')]
    return {'sourceUrl': url, 'path': urlsplit(url).path, 'title': title, 'blocks': blocks, 'images': pictures, 'links': links}, all_links


def crawl():
    sitemap = CACHE / 'sitemap.xml'
    if not sitemap.exists():
        sitemap.write_bytes(fetch(ORIGIN + '/sitemap.xml'))
    tree = ET.fromstring(sitemap.read_bytes())
    locations = [n.text for n in tree.findall('{*}url/{*}loc')]
    # Main content first, then historical press articles; everything is retained.
    seeds = [ORIGIN+'/', ORIGIN+'/allproducts', ORIGIN+'/customs', ORIGIN+'/about', ORIGIN+'/journal', ORIGIN+'/contact']
    seeds += sorted(locations, key=lambda x: '/press/' in x)
    queue = list(dict.fromkeys(seeds))
    visited, pages, errors = set(), [], []
    while queue:
        url = queue.pop(0)
        url = page_url(url)
        if not url or url in visited:
            continue
        visited.add(url)
        key = hashlib.sha256(url.encode()).hexdigest()[:16]
        cached = CACHE / (key + '.html')
        try:
            if not cached.exists():
                cached.write_bytes(fetch(url))
            page, links = extract(cached.read_text(encoding='utf-8'), url)
            pages.append(page)
            for link in links:
                candidate = page_url(link)
                if candidate and candidate not in visited and candidate not in queue:
                    queue.append(candidate)
        except Exception as error:
            errors.append({'url': url, 'error': str(error)})
        if len(visited) % 10 == 0:
            print(f'Pages: {len(pages)}; remaining: {len(queue)}; errors: {len(errors)}', flush=True)
            (DATA/'source-content.json').write_text(json.dumps({'pages': pages, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
    (DATA/'source-content.json').write_text(json.dumps({'pages': pages, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
    return pages


def assets(pages):
    previous_file = DATA/'imported-assets.json'
    previous = json.loads(previous_file.read_text(encoding='utf-8')) if previous_file.exists() else {'assets': []}
    old = {a['originalUrl']: a for a in previous['assets'] if a.get('localPath') and (ROOT/'public'/a['localPath'].lstrip('/')).exists()}
    found, manifest, hashes = {}, [], {}
    product_paths = {urlsplit(link['href']).path.strip('/') for p in pages if p['path'] == '/allproducts' for link in p['links']}
    project_paths = {urlsplit(link['href']).path.strip('/') for p in pages if p['path'] == '/customs' for link in p['links']}
    for page in pages:
        for item in page['images']:
            if item['originalUrl'] not in found:
                found[item['originalUrl']] = {**item, 'sourcePages': []}
            found[item['originalUrl']]['sourcePages'].append(page['sourceUrl'])
        for link in page['links']:
            if re.search(r'\.(pdf|zip)(?:\?|$)', link['href'], re.I) and urlsplit(link['href']).hostname in {'www.servomuto.it', 'servomuto.it', 'static1.squarespace.com', 'images.squarespace-cdn.com'}:
                found.setdefault(link['href'], {'originalUrl': link['href'], 'sourcePage': page['sourceUrl'], 'sourcePages': [page['sourceUrl']], 'alt': link['label'], 'document': True})
    for index, item in enumerate(found.values()):
        url = item['originalUrl']
        if url in old:
            manifest.append({**old[url], 'sourcePages': item['sourcePages']})
            if old[url].get('hash'):
                hashes[old[url]['hash']] = old[url]['localPath']
            continue
        filename = unquote(urlsplit(url).path.split('/')[-1])
        record = {**item, 'originalFilename': filename, 'width': None, 'height': None, 'localPath': None, 'licenseReview': 'Client website asset; review third-party credits where applicable.'}
        try:
            # Original CDN URL without format query requests the original file.
            content = fetch(url)
            digest = hashlib.sha256(content).hexdigest()
            record['hash'] = digest
            if digest in hashes:
                record['localPath'] = hashes[digest]
                record['duplicate'] = True
            else:
                source = urlsplit(item['sourcePage']).path.strip('/') or 'home'
                category = 'products' if source in product_paths else 'projects' if source in project_paths else 'press' if source.startswith('press') else 'journal' if source == 'journal' else 'about' if source == 'about' else 'studio' if source == 'contact' else 'home' if source == 'home' else 'pages'
                folder = f'downloads/{safe(source)}' if item.get('document') else f'images/{category}/{safe(source)}'
                local = f'/{folder}/{safe(Path(filename).stem)}-{digest[:10]}{Path(filename).suffix.lower()}'
                destination = ROOT/'public'/local.lstrip('/')
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(content)
                record['localPath'] = local
                hashes[digest] = local
        except Exception as error:
            record['error'] = str(error)
        manifest.append(record)
        if (index+1) % 10 == 0:
            print(f'Assets: {index+1}/{len(found)}', flush=True)
            previous_file.write_text(json.dumps({'assets': manifest}, ensure_ascii=False, indent=2), encoding='utf-8')
    previous_file.write_text(json.dumps({'assets': manifest}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Completed: {len(pages)} pages, {len(manifest)} asset URLs.', flush=True)


if __name__ == '__main__':
    pages = json.loads((DATA/'source-content.json').read_text(encoding='utf-8'))['pages'] if '--assets-only' in sys.argv else crawl()
    if '--pages-only' not in sys.argv:
        assets(pages)
