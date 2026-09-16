import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/src/data/catalog";
export const metadata: Metadata = { title: "Products", description: "Explore the SERVOMUTO lighting collections: pendant, table, wall and floor lamps.", alternates: { canonical: "/products" } };
export default async function Products({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const categories = ["All", "Pendant", "Table", "Wall", "Floor"];
  const selected = categories.find(category => category.toLowerCase() === type?.toLowerCase()) || "All";
  const visible = selected === "All" ? products : products.filter(product => product.types.includes(selected as "Pendant" | "Table" | "Wall" | "Floor"));
  return <main className="listing"><header><p className="index">ALL PRODUCTS · {visible.length} PIECES</p><h1>Objects of <em>light.</em></h1></header><nav className="filters" aria-label="Product categories">{categories.map(category => <Link key={category} aria-current={selected === category ? "page" : undefined} href={category === "All" ? "/products" : `/products?type=${category.toLowerCase()}`}>{category}</Link>)}</nav><div className="listing-grid">{visible.map(product => <Link key={product.slug} href={`/products/${product.slug}`} className="listing-card"><div>{product.images[0] && <Image src={product.images[0]} alt={product.name} fill sizes="(max-width:700px) 90vw, 30vw" className="cover" />}</div><p>{product.types.join(" / ")}</p><h2>{product.name}</h2><span>View product →</span></Link>)}</div>{!visible.length && <p>No products in this category.</p>}</main>;
}
