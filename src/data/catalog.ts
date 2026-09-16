import { getSourcePage, localHref, pageImages, productLinks, sourcePath, textBlocks } from "./content";
export { archiveEntries } from "./content";

export type ProductType = "Pendant" | "Table" | "Wall" | "Floor";
export type Product = {
  slug: string; name: string; type?: ProductType; types: ProductType[];
  collection: string; description: string; materials: string[]; leadTime?: string;
  images: string[]; sourcePath: string;
};
const categoryPages: [ProductType, string][] = [["Pendant", "/pendantproducts"], ["Table", "/tableproducts"], ["Wall", "/wallproducts"], ["Floor", "/floorproducts"]];
export const products: Product[] = productLinks.map(link => {
  const path = sourcePath(link.href);
  const page = getSourcePage(path);
  const texts = textBlocks(page).filter(block => block.kind === "text").map(block => block.text);
  const types = categoryPages.filter(([, category]) => getSourcePage(category)?.links.some(item => sourcePath(item.href) === path)).map(([type]) => type);
  const card = getSourcePage("/allproducts")?.images.find(image => image.alt.replace(/&amp;/g, "&") === link.label.replace(/&amp;/g, "&"));
  const cardPath = card ? localHref(card.originalUrl) : undefined;
  const images = [...(cardPath?.startsWith("/") ? [cardPath] : []), ...pageImages(page).map(image => image.src)];
  return {
    slug: path.slice(1), name: link.label.replace(/&amp;/g, "&"), type: types[0], types,
    collection: link.label.replace(/&amp;/g, "&"),
    description: texts.find(text => text.length > 90) ?? "",
    materials: texts.filter(text => /^materials?\s*:/i.test(text)),
    leadTime: texts.find(text => /^lead\s*time\s*:/i.test(text))?.replace(/^lead\s*time\s*:\s*/i, ""),
    images: [...new Set(images)], sourcePath: path,
  };
});
