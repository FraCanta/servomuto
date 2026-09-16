export type ProductType = "Pendant" | "Table" | "Wall" | "Floor";
export type Product = { slug: string; name: string; type: ProductType; collection: string; description: string; materials?: string[]; leadTime?: string; images: string[]; };
export const products: Product[] = [
 { slug:"materia", name:"Materia", type:"Pendant", collection:"Materia", description:"A study in linen, steel and colour-block geometry.", materials:["Dedar linen", "Painted and chromed iron", "Painted wood"], leadTime:"4–6 weeks · Made to order", images:["/images/products/materia.jpg"] },
 { slug:"venus", name:"Venus", type:"Pendant", collection:"Venus", description:"Heat-sealed Lycra, chromed iron and aluminium in a luminous sculptural form.", materials:["Heat-sealed Lycra", "Chromed iron", "Aluminium"], leadTime:"4–6 weeks · Made to order", images:["/images/products/venus.jpg"] },
 { slug:"otto", name:"Otto", type:"Pendant", collection:"Otto", description:"A finely pleated pendant in Rubelli and Dedar fabrics.", materials:["Rubelli / Dedar fabric", "Pleated pongé", "Painted iron"], leadTime:"4–6 weeks · Made to order", images:["/images/products/otto.jpg"] },
 { slug:"huf", name:"Huf", type:"Table", collection:"Huf", description:"A table lamp pairing cotton fabric, cement and chromed iron.", materials:["Cotton fabric", "Cement", "Chromed iron"], leadTime:"4–5 weeks · Made to order", images:["/images/home/servomuto-arbesser-44.jpg"] },
];
export const archiveEntries = [{year:"2023",title:"Euroluce at Salone del Mobile",location:"Milan"},{year:"2022",title:"Contemporary Cluster at Palazzo Brancaccio",location:"Rome"},{year:"2022",title:"Milan Design Week at Alcova",location:"Milan"},{year:"2020",title:"Edit Napoli",location:"Napoli"}];
