import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectPages } from "@/src/data/content";
import { SourceArticle } from "@/src/components/SourceArticle";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projectPages.map(page => ({ slug: page.path.slice(1) })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = projectPages.find(page => page.path === `/${slug}`);
  return { title: page?.title, description: `${page?.title || "Projects"} — SERVOMUTO installations and custom lighting.`, alternates: { canonical: `/projects/${slug}` } };
}
export default async function Project({ params }: Props) {
  const { slug } = await params;
  const page = projectPages.find(page => page.path === `/${slug}`);
  if (!page) notFound();
  return <SourceArticle page={page} kicker="PROJECTS / INSTALLATIONS" />;
}
