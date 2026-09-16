import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveEntries } from "@/src/data/content";
import { EditorialBlocks } from "@/src/components/Editorial";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return archiveEntries.map(entry => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = archiveEntries.find(entry => entry.slug === slug);
  return { title: entry?.title, alternates: { canonical: `/archive/${slug}` } };
}
export default async function ArchiveArticle({ params }: Props) {
  const { slug } = await params;
  const entry = archiveEntries.find(entry => entry.slug === slug);
  if (!entry) notFound();
  return <main className="editorial-page"><header className="editorial-heading"><p className="index">SERVOMUTO ARCHIVE · {entry.year}</p><h1>{entry.title}</h1></header><EditorialBlocks blocks={entry.blocks} title={entry.title} /></main>;
}
