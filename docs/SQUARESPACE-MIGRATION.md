# Squarespace migration audit

## Public pages inventoried

- Home, All Products, Pendant, Table, About, Journal
- Sampled product pages: Materia, Venus, Otto, Otto Table, Huf and Easy Wall
- Journal entries including Euroluce 2023, Contemporary Cluster 2022, Milan Design Week 2022 at Alcova and Edit Napoli 2020

## Initial product inventory

Public All Products index currently lists Huf, Otto Table, Giardino Floor, Venus, Ambarabà, Materia, Otto Pendant, Flag Wall, Satisfaction, Haute Couture, Bikini, Chez Joséphine, Guinea Wall, Aperitivo, Portofino, Giardino Pendant, Flag Floor, Cement, Chalk, Easy Roof, Été, Meringa, Circus Chandelier, Guinea Floor, Fez, Easy Wall, Easy Floor, Easy Table, Palazzi, Birds & Butterflies, I Wanna Be Your Dog, Cime Tempestose and Alghero.

## Assets

`scripts/import-servomuto-assets.mjs` crawls only public same-domain pages, normalizes Squarespace URLs, selects one version per path, hashes downloads, creates a manifest and organizes local files by source/product. Run it only when network access is available:

```powershell
node scripts/import-servomuto-assets.mjs
```

The resulting `src/data/imported-assets.json` records source URL, page, local file and image metadata placeholders. Image dimension extraction remains TODO; assets whose provenance is unclear should be reviewed before production use.

## Outstanding migration items

- Complete crawl and verify all product descriptions, variants, technical PDFs and contact/legal pages.
- Connect the quote form and newsletter only after the client supplies the target service and privacy process.
- Implement server redirects using the final, complete URL map at deployment.

## Corrected product images (2026-09-16)

The product names and image associations were checked against https://www.servomuto.it/allproducts.
Downloaded at a maximum width of 1500 px:

- `public/images/products/materia.jpg`: https://images.squarespace-cdn.com/content/v1/57dd7503ebbd1a8e83468f60/1682525066848-V2EA02BA9QAOF5UBQB8O/_EV_0333-HDR_Modificata.jpg
- `public/images/products/venus.jpg`: https://images.squarespace-cdn.com/content/v1/57dd7503ebbd1a8e83468f60/1678208533068-EXS6ZU3PAOBSWQO8SX9D/grappolo+ON+frontale.jpg
- `public/images/products/otto.jpg` (Otto Pendant): https://images.squarespace-cdn.com/content/v1/57dd7503ebbd1a8e83468f60/1682524341053-A405L6RWUBLOZ5232708/_EV_0250_liv.jpg

The existing Huf image matches the official catalog. Original homepage photos remain available for editorial sections.
