import source from "./source-content.json";
import manifest from "./imported-assets.json";

export type ContentBlock = { kind: string; text: string; originalUrl?: string };
export type SourcePage = {
  sourceUrl: string; path: string; title: string;
  blocks: ContentBlock[];
  images: { originalUrl: string; alt: string; sourcePage: string }[];
  links: { href: string; label: string }[];
};
export type LocalImage = { src: string; alt: string; width: number; height: number };
type Asset = { originalUrl: string; localPath: string | null; width?: number | null; height?: number | null };
export const sourcePages = source.pages as SourcePage[];
const assets = new Map((manifest.assets as Asset[]).map(asset => [asset.originalUrl, asset]));
export const getSourcePage = (path: string) => sourcePages.find(page => page.path === path);
export const textBlocks = (page?: SourcePage) => page?.blocks.filter(block => block.kind !== "image") ?? [];

export function localImage(originalUrl: string, alt: string): LocalImage | undefined {
  const asset = assets.get(originalUrl);
  if (!asset?.localPath) return undefined;
  return { src: asset.localPath, alt, width: asset.width || 1200, height: asset.height || 1600 };
}
export function pageImages(page?: SourcePage): LocalImage[] {
  const images = page?.images.flatMap(image => {
    const local = localImage(image.originalUrl, image.alt || page.title);
    return local ? [local] : [];
  }) ?? [];
  return images.filter((image, index) => images.findIndex(other => other.src === image.src) === index);
}
export function sourcePath(href: string) {
  try { return new URL(href).pathname.replace(/\/$/, "") || "/"; } catch { return href; }
}
export const productLinks = (getSourcePage("/allproducts")?.links ?? [])
  .filter(link => link.label && !["All", "Floor", "Pendant", "Table", "Wall"].includes(link.label));
export const projectPages = (getSourcePage("/customs")?.links ?? [])
  .map(link => getSourcePage(sourcePath(link.href)))
  .filter((page): page is SourcePage => Boolean(page))
  .filter((page, index, pages) => pages.findIndex(other => other.path === page.path) === index);

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export type ArchiveEntry = { slug: string; title: string; year: string; location: string; blocks: ContentBlock[]; images: LocalImage[] };
export const archiveEntries: ArchiveEntry[] = [];
for (const block of getSourcePage("/journal")?.blocks ?? []) {
  if (block.kind === "heading") {
    archiveEntries.push({ slug: slugify(block.text), title: block.text, year: block.text.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? "", location: block.text.split(/\s[-–]\s/).slice(1).join(" — "), blocks: [], images: [] });
  } else {
    const entry = archiveEntries.at(-1);
    if (!entry) continue;
    entry.blocks.push(block);
    if (block.kind === "image" && block.originalUrl) {
      const image = localImage(block.originalUrl, block.text || entry.title);
      if (image) entry.images.push(image);
    }
  }
}
export function localHref(href: string): string {
  const asset = assets.get(href);
  if (asset?.localPath) return asset.localPath;
  if (!href.startsWith("https://www.servomuto.it") && !href.startsWith("http://www.servomuto.it")) return href;
  const path = sourcePath(href);
  const aliases: Record<string, string> = { "/allproducts": "/products", "/customs": "/projects", "/journal": "/archive", "/privacy-cookie-policy": "/privacy", "/request-a-quote": "/contact", "/collection": "/collections", "/homepage": "/" };
  if (aliases[path]) return aliases[path];
  if (/^\/(pendant|table|wall|floor)products$/.test(path)) return `/products?type=${path.slice(1).replace("products", "")}`;
  if (productLinks.some(link => sourcePath(link.href) === path)) return `/products/${path.slice(1)}`;
  if (projectPages.some(page => page.path === path)) return `/projects${path}`;
  return path;
}
export function pageDownloads(page: SourcePage) {
  return page.links.filter(link => /\.(pdf|zip)(\?|$)/i.test(link.href)).map(link => ({ ...link, href: localHref(link.href) }));
}
export const pressPages = sourcePages.filter(page => page.path.startsWith("/press/"));
