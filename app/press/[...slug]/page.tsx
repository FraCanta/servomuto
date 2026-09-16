import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pressPages } from "@/src/data/content";
import { SourceArticle } from "@/src/components/SourceArticle";
type Props = { params: Promise<{ slug: string[] }> };
export function generateStaticParams() { return pressPages.map(page => ({ slug: page.path.slice(7).split("/") })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = `/press/${slug.join("/")}`;
  const page = pressPages.find(page => page.path === path);
  return { title: page?.title, alternates: { canonical: path } };
}
export default async function PressArticle({ params }: Props) {
  const { slug } = await params;
  const page = pressPages.find(page => page.path === `/press/${slug.join("/")}`);
  if (!page) notFound();
  return <SourceArticle page={page} kicker="PRESS" />;
}
