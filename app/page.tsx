import Image from "next/image";
import Link from "next/link";
import { archiveEntries, products } from "@/src/data/catalog";
import { pageImages, projectPages } from "@/src/data/content";
import { EditorialCard } from "@/src/components/Editorial";

const image = (path: string) => path || "/images/miscellaneous/placeholder.svg";

export default function Home() {
  const featured = ["materia", "venus", "otto", "huf"].flatMap(slug => products.filter(product => product.slug === slug));
  return <main>
    <section className="hero">
      <Image src={image("/images/home/servomuto-arbesser-44.jpg")} alt="Lampada SERVOMUTO in un interno" fill priority sizes="100vw" className="cover" />
      <div className="hero-shade" />
      <div className="hero-copy"><p className="eyebrow">Milan · Since 2010</p><h1>Light,<br /><em>tailored.</em></h1><p>Handcrafted lighting made in Milan.</p><Link className="button button-light" href="/collections">Explore collections <span>↗</span></Link></div><p className="hero-credit">Contemporary Italian lighting atelier</p>
    </section>
    <section className="section feature-grid"><div className="feature-image"><Image src={image("/images/products/materia.jpg")} alt="Dettaglio di una lampada della collezione Materia" fill sizes="(max-width: 800px) 100vw, 55vw" className="cover" /></div><div className="feature-copy"><p className="index">01 — COLLECTION</p><h2>Materia</h2><p className="lede">Linen, steel and colour. A suspension where geometry meets the tactile language of tailoring.</p><Link className="text-link" href="/products/materia">Discover Materia <span>→</span></Link></div></section>
    <section className="types section"><div className="section-intro"><p className="index">02 — DISCOVER</p><h2>Light in every<br /><em>form.</em></h2></div><div className="type-grid">{["Pendant", "Table", "Wall", "Floor"].map((type, i) => <Link href={`/products?type=${type.toLowerCase()}`} key={type} className={`type-card type-${i}`}><span>{String(i + 1).padStart(2, "0")}</span><strong>{type}</strong><i>Explore →</i></Link>)}</div></section>
    <section className="manifesto"><p className="index">03 — MANIFESTO</p><h2>Not simply lamps.<br /><em>Objects dressed in light.</em></h2><p>SERVOMUTO brings the precision of an haute couture atelier to lighting: fine textiles, curved metal, pleats and finishes shaped by Italian hands.</p><Link className="text-link" href="/about">Our story <span>→</span></Link></section>
    <section className="section selected"><div className="section-head"><div><p className="index">04 — SELECTED PIECES</p><h2>In the <em>spotlight.</em></h2></div><Link className="text-link" href="/products">View all products <span>→</span></Link></div><div className="product-grid">{featured.map((product, i) => <Link className={`product-card product-${i}`} href={`/products/${product.slug}`} key={product.slug}><div className="product-image"><Image src={image(product.images[0])} alt={product.name} fill sizes="(max-width: 700px) calc((100vw - 60px) / 2), 42vw" className="cover" /></div><p>{product.type}</p><h3>{product.name}</h3><span>View piece →</span></Link>)}</div></section>
    <section className="craft"><div><p className="index">05 — THE ATELIER</p><h2>Made by hand.<br />Made to <em>last.</em></h2><p>Each piece is entirely handmade by expert Italian craftsmen — a deliberate alternative to mass production.</p><Link className="button button-light" href="/about">Inside the atelier <span>↗</span></Link></div><div className="craft-image"><Image src={image("/images/home/servomuto-matteo-dangelo-17-anteprime.jpg")} alt="Artigianalità SERVOMUTO" fill sizes="(max-width: 800px) 100vw, 50vw" className="cover" /></div></section>
    <section className="archive-section section"><div><p className="index">06 — SERVOMUTO ARCHIVE</p><h2>Spaces, stories<br />and <em>encounters.</em></h2></div><div className="archive-list">{archiveEntries.slice(0,3).map(entry => <Link key={entry.year + entry.title} href={`/archive/${entry.slug}`}><span>{entry.year}</span><strong>{entry.title}</strong><i>{entry.location} →</i></Link>)}</div></section>
    <section className="section"><div className="section-head"><div><p className="index">PROJECTS / SPACES</p><h2>Light, <em>in context.</em></h2></div><Link className="text-link" href="/projects">All projects →</Link></div><div className="editorial-grid home-projects">{projectPages.slice(0, 2).map(project => <EditorialCard key={project.path} href={`/projects${project.path}`} title={project.title} image={pageImages(project)[0]} />)}</div></section>
    <section className="trade-banner"><p className="index">FOR PROFESSIONALS</p><h2>Bring a more<br /><em>considered light</em> to space.</h2><Link className="button button-light" href="/trade">Discover Trade <span>↗</span></Link></section>
  </main>;
}
