import type { MetadataRoute } from "next";
import { sourcePages, localHref, archiveEntries } from "@/src/data/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set(["/", "/collections", "/products", "/projects", "/trade", "/about", "/archive", "/contact", "/privacy", "/press", "/site-index", ...sourcePages.map(page => localHref(page.sourceUrl)), ...archiveEntries.map(entry => `/archive/${entry.slug}`)]);
  return [...paths].filter(path => path.startsWith("/") && !path.includes("?")).map(path => ({ url: `https://www.servomuto.it${path}` }));
}
