/** Public, rate-limited Squarespace asset importer for SERVOMUTO. */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://www.servomuto.it";
const output = path.resolve("public/images");
const manifestPath = path.resolve("src/data/imported-assets.json");
const maxPages = 60;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const html = (value) => value.replace(/&amp;/g, "&");
const normal = (url) => new URL(url).origin + new URL(url).pathname;
const safe = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9.]+/g, "-").replace(/(^-|-$)/g, "") || "asset";
const bucket = (page, filename) => /venus/i.test(page + filename) ? "products/venus" : /materia/i.test(page + filename) ? "products/materia" : /otto/i.test(page + filename) ? "products/otto" : /huf/i.test(page + filename) ? "products/huf" : /easy-wall/i.test(page + filename) ? "products/easy-wall" : /journal/i.test(page) ? "journal" : page === "/" ? "home" : "miscellaneous";

const queue = [origin + "/"]; const pages = new Set(); const assets = new Map();
while (queue.length && pages.size < maxPages) {
  const page = queue.shift(); if (!page || pages.has(page)) continue;
  const response = await fetch(page, { headers: { "user-agent": "SERVOMUTO migration asset importer (public resources only)" } });
  if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) continue;
  const body = await response.text(); pages.add(page);
  for (const href of body.matchAll(/href=["']([^"'#?]+)["']/gi)) { const candidate = new URL(html(href[1]), origin); if (candidate.origin === origin && !/\.(pdf|jpg|jpeg|png|webp)$/i.test(candidate.pathname) && !pages.has(candidate.href)) queue.push(candidate.href); }
  for (const found of body.matchAll(/(?:src|data-src|data-image|srcset)=["']([^"']+)["']/gi)) {
    const urls = found[1].split(",").map((entry) => entry.trim().split(/\s+/)[0]);
    for (const candidate of urls) { if (!/images\.squarespace-cdn\.com/i.test(candidate)) continue; const absolute = html(new URL(candidate, origin).href); const key = normal(absolute); if (!assets.has(key)) assets.set(key, { originalUrl:absolute, sourcePage:new URL(page).pathname, alt:"" }); }
  }
  await wait(350);
}
const manifest = []; const hashes = new Set();
for (const asset of assets.values()) {
  try { const response = await fetch(asset.originalUrl); if (!response.ok) throw new Error(String(response.status)); const bytes = Buffer.from(await response.arrayBuffer()); const hash = createHash("sha256").update(bytes).digest("hex"); if (hashes.has(hash)) continue; hashes.add(hash);
    const originalFilename = decodeURIComponent(new URL(asset.originalUrl).pathname.split("/").pop() || "asset"); const ext = path.extname(originalFilename) || ".jpg"; const filename = `${safe(path.basename(originalFilename, ext))}-${hash.slice(0,8)}${ext.toLowerCase()}`; const folder = bucket(asset.sourcePage, originalFilename); const localPath = `/images/${folder}/${filename}`; await mkdir(path.join(output, folder), { recursive:true }); await writeFile(path.join(output, folder, filename), bytes); manifest.push({ ...asset, localPath, originalFilename, width:null, height:null }); await wait(150);
  } catch (error) { manifest.push({ ...asset, localPath:null, originalFilename:null, width:null, height:null, error:String(error) }); }
}
await mkdir(path.dirname(manifestPath), { recursive:true }); await writeFile(manifestPath, JSON.stringify({ pages:[...pages], assets:manifest }, null, 2));
console.log(`Pages: ${pages.size}; assets saved: ${manifest.filter((a)=>a.localPath).length}; duplicates removed: ${assets.size - hashes.size}`);
