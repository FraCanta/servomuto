import Link from "next/link";
import { EditorialBlocks } from "./Editorial";
import { localHref, pageDownloads, type SourcePage } from "@/src/data/content";

export function SourceArticle({ page, kicker }: { page: SourcePage; kicker?: string }) {
  const downloads = pageDownloads(page);
  const links = page.links.filter(link => link.label && !/view fullsize|request a quote/i.test(link.label)
    && !/\.(jpg|jpeg|png|webp|gif|pdf|zip)(\?|$)/i.test(link.href)
    && !link.href.includes("overstock.com"));
  const uniqueLinks = links.filter((link, index) => links.findIndex(other => other.href === link.href) === index);
  return <main className="editorial-page">
    <header className="editorial-heading"><p className="index">{kicker || "SERVOMUTO"}</p><h1>{page.title}</h1></header>
    <EditorialBlocks blocks={page.blocks.filter(block => !(block.kind === "heading" && block.text.toLowerCase() === page.title.toLowerCase()))} title={page.title} />
    {downloads.length > 0 && <section className="editorial-prose"><h2>Downloads</h2><ul className="resource-list">{downloads.map((link, i) => <li key={`${link.href}-${i}`}><a href={link.href}>{link.label || "Download document"} ↗</a></li>)}</ul></section>}
    {uniqueLinks.length > 0 && <nav className="editorial-prose resource-list" aria-label="Related links">{uniqueLinks.map(link => <Link key={link.href} href={localHref(link.href)}>{link.label} ↗</Link>)}</nav>}
  </main>;
}
