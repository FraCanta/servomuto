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
