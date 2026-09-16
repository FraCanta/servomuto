import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SourceArticle } from "@/src/components/SourceArticle";
import { EditorialCard, EditorialBlocks } from "@/src/components/Editorial";
import { archiveEntries, getSourcePage, localHref, pageImages, pressPages, projectPages, sourcePages, textBlocks } from "@/src/data/content";
import { products } from "@/src/data/catalog";

type Props = { params: Promise<{ page: string }>; searchParams: Promise<{ page?: string; product?: string }> };
const titles: Record<string, string> = { collections: "Collections", projects: "Light in its setting.", about: "Light meets tailoring.", archive: "Spaces, stories and encounters.", trade: "For professionals", contact: "Visit our Milan studio", privacy: "Privacy & Cookie Policy", press: "In print. In conversation.", "site-index": "Explore SERVOMUTO" };
export function generateStaticParams() {
  const slugs = new Set([...Object.keys(titles), ...sourcePages.filter(page => /^\/[^/]+$/.test(page.path)).map(page => page.path.slice(1))]);
  return [...slugs].filter(page => page !== "products").map(page => ({ page }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const data = getSourcePage(page === "privacy" ? "/privacy-cookie-policy" : `/${page}`);
  const title = titles[page] || data?.title;
  const description = textBlocks(data).find(block => block.kind === "text")?.text.slice(0, 160);
  return { title, description, alternates: { canonical: `/${page}` }, openGraph: { title, description } };
}
export default async function Page({ params, searchParams }: Props) {
  const { page } = await params;
  const query = await searchParams;
  const mapped = localHref(`https://www.servomuto.it/${page}`);
  if (mapped !== `/${page}`) permanentRedirect(mapped);
  const heading = (label: string, title: string) => <header className="editorial-heading"><p className="index">{label}</p><h1>{title}</h1></header>;
  if (page === "projects") return <main className="editorial-page">{heading("PROJECTS / INSTALLATIONS", titles.projects)}<div className="editorial-grid">{projectPages.map(project => <EditorialCard key={project.path} href={`/projects${project.path}`} title={project.title} image={pageImages(project)[0]} label="Custom lighting" />)}</div></main>;
  if (page === "archive") return <main className="editorial-page">{heading("SERVOMUTO ARCHIVE", titles.archive)}<div className="editorial-grid">{archiveEntries.map(entry => <EditorialCard key={entry.slug} href={`/archive/${entry.slug}`} title={entry.title} label={entry.year} image={entry.images[0]} />)}</div><Link className="text-link" href="/press">Explore the press archive →</Link></main>;
  if (page === "press") {
    const requested = Number(query.page || 1);
    const total = Math.ceil(pressPages.length / 24);
    const current = Number.isFinite(requested) ? Math.max(1, Math.min(total, Math.floor(requested))) : 1;
    return <main className="editorial-page">{heading("PRESS", titles.press)}<div className="editorial-grid">{pressPages.slice((current-1)*24, current*24).map(item => <EditorialCard key={item.path} href={item.path} title={item.title} label={item.path.split("/").slice(2,5).join(" / ")} image={pageImages(item)[0]} />)}</div><nav className="pagination" aria-label="Press pages">{current > 1 && <Link href={`/press?page=${current-1}`}>← Previous</Link>}<span>Page {current} of {total}</span>{current < total && <Link href={`/press?page=${current+1}`}>Next →</Link>}</nav></main>;
  }
  if (page === "collections") return <main className="editorial-page">{heading("SERVOMUTO COLLECTIONS", "Colour, material and form.")}<div className="collection-index">{products.map((product, index) => <Link href={`/products/${product.slug}`} key={product.slug}><span className="index">{String(index+1).padStart(2,"0")}</span><h2>{product.name}</h2><span>{product.types.join(" / ")} ↗</span></Link>)}</div></main>;
  if (page === "about") {
    const data = getSourcePage("/about"); if (!data) notFound();
    return <main className="editorial-page about-page">{heading("MILAN · SINCE 2010", titles.about)}<EditorialBlocks blocks={data.blocks} title="The SERVOMUTO atelier" /><div className="editorial-prose"><Link className="text-link" href="/projects">Explore our projects →</Link></div></main>;
  }
  if (page === "contact") {
    const data = getSourcePage("/contact"); if (!data) notFound();
    const product = products.find(product => product.slug === query.product);
    const subject = product ? `Information request: ${product.name}` : "Studio visit / enquiry";
    return <main className="editorial-page">{heading("CONTACT", titles.contact)}<div className="contact-layout"><EditorialBlocks blocks={data.blocks} title="Contact SERVOMUTO" /><aside className="contact-actions">{product && <p>Enquiry about {product.name}</p>}<a className="button" href={`mailto:info@servomuto.it?subject=${encodeURIComponent(subject)}`}>Book a visit / General enquiries ↗</a><a className="text-link" href={`mailto:sales@servomuto.it?subject=${encodeURIComponent(subject)}`}>Sales & Trade ↗</a><a className="text-link" href="tel:+390291668674">+39 02 91668674</a><Link href="/faq">Frequently asked questions →</Link></aside></div></main>;
  }
  if (page === "trade") {
    const faq = getSourcePage("/faq");
    const blocks = textBlocks(faq);
    const start = blocks.findIndex(block => /Can your lighting pieces be customized/i.test(block.text));
    const end = blocks.findIndex(block => /How can I proceed/i.test(block.text));
    return <main className="editorial-page">{heading("ARCHITECTS · INTERIORS · HOSPITALITY · RETAIL", titles.trade)}<EditorialBlocks blocks={start >= 0 ? blocks.slice(start, end > start ? end : start+6) : []} title="Trade information" /><div className="editorial-prose"><a className="button" href="mailto:sales@servomuto.it?subject=Trade%20information">Request trade information ↗</a></div><div className="editorial-grid">{projectPages.slice(0,4).map(item => <EditorialCard key={item.path} href={`/projects${item.path}`} title={item.title} image={pageImages(item)[0]} />)}</div></main>;
  }
  if (page === "site-index") return <main className="editorial-page">{heading("ALL CONTENT", titles[page])}<nav className="site-index" aria-label="All migrated pages">{sourcePages.filter(item => item.path !== "/").map(item => <Link key={item.path} href={localHref(item.sourceUrl)}>{item.title} <span>{item.path}</span></Link>)}</nav></main>;
  const data = getSourcePage(page === "privacy" ? "/privacy-cookie-policy" : `/${page}`);
  if (!data) notFound();
  return <SourceArticle page={data} />;
}
