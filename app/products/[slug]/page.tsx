import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/src/data/catalog";
import { getSourcePage, pageDownloads, pageImages, textBlocks } from "@/src/data/content";
import { Gallery } from "@/src/components/Editorial";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(product => product.slug === slug);
  if (!product) return {};
  return { title: product.name, description: product.description.slice(0,160), alternates: { canonical: `/products/${slug}` }, openGraph: { title: product.name, description: product.description.slice(0,160), images: product.images.slice(0,1) } };
}
export default async function Product({ params }: Props) {
  const { slug } = await params;
  const product = products.find(product => product.slug === slug);
  if (!product) notFound();
  const page = getSourcePage(product.sourcePath);
  if (!page) notFound();
  const blocks = textBlocks(page);
  const technicalStart = blocks.findIndex(block => /^materials?\s*:/i.test(block.text));
  const story = blocks.slice(0, technicalStart < 0 ? blocks.length : technicalStart).filter(block => block.kind === "text");
  const specifications = blocks.slice(technicalStart < 0 ? blocks.length : technicalStart).filter(block => !/^(Download|Specification:?)$/i.test(block.text));
  const downloads = pageDownloads(page);
  return <main className="detail">
    <section className="detail-hero"><div className="detail-image">{product.images[0] && <Image src={product.images[0]} alt={product.name} fill priority sizes="(max-width:700px) 100vw, 60vw" className="cover" />}</div><article><p className="index">{product.types.join(" / ")}</p><h1>{product.name}</h1>{product.leadTime && <p className="availability">{product.leadTime}</p>}<Link className="button" href={`/contact?product=${product.slug}`}>Request a quote ↗</Link><a className="text-link product-story-link" href="#product-story">Discover the piece ↓</a></article></section>
    <section className="product-story" id="product-story"><p className="index">THE STORY</p><h2>{product.name}</h2>{story.map((block, index) => <p key={index}>{block.text}</p>)}</section>
    <section className="product-gallery-section"><p className="index">GALLERY · COLOURS & SHAPES</p><Gallery images={pageImages(page)} label={product.name} /></section>
    <section className="technical"><p className="index">TECHNICAL INFORMATION</p>{specifications.length > 0 && <details open><summary>Materials & specifications</summary>{specifications.map((block, index) => <p key={index}>{block.text}</p>)}</details>}{downloads.length > 0 && <details><summary>Downloads</summary><ul className="resource-list">{downloads.map((link, index) => <li key={index}><a href={link.href}>{link.label || "Download document"} ↗</a></li>)}</ul></details>}<Link className="text-link" href="/faq">Care, custom orders & FAQ →</Link></section>
  </main>;
}
