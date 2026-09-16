import Image from "next/image";
import Link from "next/link";
import { localImage, type ContentBlock, type LocalImage } from "@/src/data/content";

export function Gallery({ images, label }: { images: LocalImage[]; label: string }) {
  if (!images.length) return null;
  return <div className="editorial-gallery" aria-label={label}>{images.map((image, index) =>
    <a href={image.src} className="gallery-photo" key={`${image.src}-${index}`} aria-label={`${label} — image ${index + 1}, open full size`}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 700px) 90vw, 44vw" />
    </a>
  )}</div>;
}

export function EditorialBlocks({ blocks, title }: { blocks: ContentBlock[]; title: string }) {
  const groups: { images: LocalImage[]; texts: ContentBlock[] }[] = [];
  for (const block of blocks) {
    const isImage = block.kind === "image";
    let group = groups.at(-1);
    if (!group || (isImage ? group.texts.length > 0 : group.images.length > 0)) {
      group = { images: [], texts: [] }; groups.push(group);
    }
    if (isImage && block.originalUrl) {
      const image = localImage(block.originalUrl, block.text || title);
      if (image) group.images.push(image);
    } else if (!isImage) group.texts.push(block);
  }
  return <div className="editorial-body">{groups.map((group, index) => group.images.length
    ? <Gallery key={index} images={group.images} label={title} />
    : <div className="editorial-prose" key={index}>{group.texts.map((block, j) => block.kind === "heading"
      ? <h2 key={j}>{block.text}</h2> : <p key={j}>{block.text}</p>)}</div>)}</div>;
}

export function EditorialCard({ href, title, image, label }: { href: string; title: string; image?: LocalImage; label?: string }) {
  return <Link href={href} className="editorial-card">{image && <div className="editorial-card-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 90vw, 44vw" className="cover" /></div>}<p className="index">{label}</p><h2>{title}</h2><span className="text-link">Explore →</span></Link>;
}
