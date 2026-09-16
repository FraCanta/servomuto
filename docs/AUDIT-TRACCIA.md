# Verifica della traccia SERVOMUTO

Data: 16 settembre 2026. Ambito: audit del repository attuale e inserimento del logo esistente, non completamento dell'intero redesign.

## Esito

Il progetto è un prototipo editoriale funzionante, NON una migrazione completa né un sito pronto alla pubblicazione. La presenza di una route o di un documento non implica che i relativi contenuti o flussi siano completati.

## Fotografia tecnica prima dell'inserimento del logo

- Next.js 16.1.6, React 19.2.3, TypeScript strict, Tailwind CSS 4 configurato; gli stili effettivi sono principalmente CSS globale.
- App Router; pagine server, Header client per apertura menu; nessun CMS, provider ecommerce o Framer Motion.
- Font DM Sans e Playfair Display tramite next/font/google.
- Due componenti condivisi: Header e Footer. Homepage, listing e dettaglio sono ancora monolitici; molte righe sono minificate, con manutenzione poco agevole.
- Un file dati, src/data/catalog.ts: 4 prodotti (Materia, Venus, Otto, Huf), 4 eventi. Navigazione duplicata e contenuti delle pagine dentro i componenti.
- Sei fotografie locali in public/images (tre home e tre prodotti), oltre a public/logo.webp (500 × 751). Non è presente src/data/imported-assets.json.
- Controlli iniziali: lint, tsc --noEmit e build conclusi senza errori segnalati. Lo script npm run type-check NON esiste; è stato usato npx tsc --noEmit.
- La build richiede accesso a Google Fonts. Nessun report prestazioni o suite QA responsive presente.
- La versione Next.js non soddisfa la richiesta di ultima stabile: il blog ufficiale documenta già la release 16.3.3. Aggiornamento da pianificare separatamente, non eseguito durante questo audit.

## Verifica dei 40 punti

| Punto | Stato | Evidenza / lavoro residuo |
| --- | --- | --- |
| 1 Stack | Parziale | App Router, TS, Tailwind, next/image, next/font presenti; Next da aggiornare, separazione dati/componenti incompleta. Nessun CMS introdotto. |
| 2 Audit iniziale | Parziale | Controlli tecnici eseguiti ora; non risulta un audit iniziale completo e versionato dell'intero redesign. Script type-check assente. |
| 3 Analisi sito esistente | Parziale | Documentazione campionaria; non esiste inventario completo con fonti per campo, FAQ, pagine interne e checkout verificati. |
| 4 Import immagini | Parziale | Script presente, crawl pubblico con pause e src/srcset/data-src/data-image. Non seleziona la risoluzione massima: conserva il primo URL trovato. URL relativi risolti contro origin anziché la pagina corrente; errori del crawl non gestiti per pagina. |
| 5 Organizzazione asset | Parziale | Home e prodotti separati, ma tre immagini sono direttamente in products; about, studio, journal e collections non popolati. |
| 6 Manifest | Mancante | Script predisposto a scriverlo, ma il file non esiste. Alt vuoti e dimensioni null nello script. |
| 7 Deduplicazione | Parziale | Normalizzazione origin+pathname e hash presenti; nessun rapporto di esecuzione verificabile. Il conteggio finale include anche eventuali download falliti. |
| 8 Qualità immagini | Parziale | File locali, next/image e nessun upscale rilevato; scelta automatica della migliore variante non implementata. |
| 9 Architettura | Parziale | Route principali presenti, ma 7 pagine condividono un template minimo. Privacy segnaposto, FAQ e vecchia policy non migrate. |
| 10 Direzione design | Parziale | Base editoriale/asimmetrica presente; pagine interne e contenuti fotografici non sviluppati a pari livello. Valutazione qualitativa, non certificazione. |
| 11 Palette | Presente | Ivory, ink, wine e sand definiti come variabili CSS. |
| 12 Tipografia | Presente | Sans e serif Google Fonts tramite next/font, senza font commerciali aggiunti. |
| 13 Header | Parziale | Navigazione e Trade presenti; Search assente, cart non migrato. Logo originale inserito durante questo audit; fondo solido per leggibilità. |
| 14 Menu mobile | Parziale | Fullscreen, ESC, aria e blocco scroll presenti; mancano focus trap, focus iniziale/ripristino e isolamento del contenuto sottostante. Instagram è solo testo. |
| 15 Homepage | Parziale | Hero, featured, manifesto, selected, craft, trade e preview archive presenti. Shop by type senza fotografie; Projects/Spaces assente; copy non interamente tracciato alle fonti. |
| 16 Products | Parziale | Solo 4 prodotti. Link categorie cambiano query string, ma searchParams non viene letto: nessun filtro effettivo. Niente metadati futuri o seconda foto. |
| 17 Product detail | Parziale | Immagine, descrizione, materiali, lead time e CTA presenti. Nessuna gallery, designer o verifica completa della modalità di acquisto per prodotto. |
| 18 Product story | Parziale | Stesso testo generico per tutti; mancano storia specifica, fotografia dedicata, gallery e varianti. |
| 19 Specifiche | Parziale | details/summary nativi per materiali, lighting, lead time e downloads. Lighting/downloads TODO; dimensioni e finiture assenti. |
| 20 Preventivo | Mancante | CTA porta a /contact?product=slug, ma Contact non legge il prodotto e non contiene form. Nessun campo o validazione richiesti. |
| 21 Trade | Parziale | Solo titolo, paragrafo e link Contact; mancano sezioni e flusso richiesta. Condizioni da verificare alla fonte. |
| 22 About | Parziale | Un paragrafo; mancano struttura manifesto articolata, fotografie e materiali/atelier. |
| 23 Archive | Parziale | Quattro eventi nei dati e tre link in homepage. /archive mostra solo un paragrafo, senza cronologia, dettagli o gallery. |
| 24 Contact | Parziale | Email nel testo; indirizzo e prenotazione visita sono TODO, assenti studio visuale e contatti distinti verificati. |
| 25 Animazioni | Base presente | Hover CSS e prefers-reduced-motion; nessuna libreria superflua o scroll hijacking rilevati. |
| 26 Responsive | Parziale | Regole mobile a 700px; QA completo a 375/768/1024/1440/1920 non documentato. |
| 27 Accessibilità | Parziale | Alt, skip link, focus CSS, label email e accordion nativi presenti; menu modale incompleto, touch target e contrasto da verificare sistematicamente. |
| 28 SEO | Parziale | Metadata globali, titolo listing, sitemap e robots presenti. Assenti metadata per pagine/prodotti, canonical e OG specifici; redirect non configurati. JSON-LD da valutare su dati verificati. |
| 29 Performance | Parziale | Server Components, immagini ottimizzate e font presenti; nessuna misura Lighthouse/Web Vitals o verifica CLS completa. |
| 30 Dati | Parziale | Product tipizzato e catalogo separato; immagini come stringhe, mancano fonti, dimensioni, varianti e dati separati di sito/collezioni/navigazione. |
| 31 Componenti | Parziale | Solo Header/Footer condivisi. Card duplicate tra home e listing, mancano gallery/form/componenti editoriali riutilizzabili. |
| 32 Footer | Parziale | Brand, Milano, navigazione, newsletter e Privacy presenti; Instagram assente, policy effettiva non migrata. Logo aggiunto durante questo audit. |
| 33 Newsletter | Parziale | Form senza action o handler: non iscrive. Nota tecnica esposta ai visitatori. Servizio Squarespace non identificato/documentato. |
| 34 Ecommerce | Parziale | Documento esistente ma campionario. Il sito sorgente espone Cart; prodotti acquistabili, territori e checkout non verificati completamente. Nessun provider arbitrario introdotto. |
| 35 Asset e copyright | Parziale | Foto locali provenienti dal sito del cliente; manca il manifest con provenienza e segnalazioni licenze. |
| 36 Fasi | Non attestabile | Non esiste registro delle 16 fasi completate; varie fasi contenutistiche/funzionali sono chiaramente incomplete. |
| 37 Documentazione | Parziale | Tre documenti presenti, ma mancano inventario esaustivo, pagine realmente migrate, conteggi crawl/download/duplicati/errori e tracciabilità. |
| 38 QA | Parziale | Lint, controllo TS equivalente e build passano; non equivalgono al collaudo di form, filtri, menu, immagini, link, console e cinque viewport. |
| 39 Identità | Parziale | Impostazione coerente con atelier/editoriale, ma da completare con contenuti reali e percorsi funzionanti. |
| 40 Primo output | Parziale | Appunti iniziali, sitemap implicita nelle route e tipo Product presenti; mancano pacchetto di audit/inventari esaustivi e piano verificato prima dell'implementazione. |

## Inventario delle route attuali

| Route | Implementazione effettiva |
| --- | --- |
| / | Homepage editoriale, contenuti parziali |
| /products | Quattro prodotti, filtri inerti |
| /products/materia, /products/venus, /products/otto, /products/huf | Dettaglio con una foto e specifiche incomplete |
| /collections, /projects, /about, /archive, /trade, /contact, /privacy | Template generico in app/[page]/page.tsx; nessuna migrazione completa |
| /sitemap.xml, /robots.txt | Generati da Next.js |

Il vecchio /privacy-cookie-policy non è mappato in docs/redirects.md. Non sono presenti redirect in next.config.ts. Una mappa Markdown da sola non produce redirect HTTP.

## Fonti e limiti della verifica esterna

- https://www.servomuto.it/ : presenza di Search, Cart e newsletter, link alla policy.
- https://www.servomuto.it/about : fonte dei concetti Milano, 2010, tessuti, atelier e artigianalità.
- https://www.servomuto.it/journal : archivio con molti più eventi e fotografie rispetto ai quattro record locali.
- https://www.servomuto.it/privacy-cookie-policy : policy reale da migrare.
- https://www.servomuto.it/allproducts : inventario descritto nel documento di migrazione; nuova lettura web in questo audit terminata in timeout. Non si considera un nuovo crawl completo.
- https://nextjs.org/blog : release successiva alla 16.1.6 installata.

Non sono stati verificati integralmente FAQ, Contact originale, categorie, schede tecniche, checkout e tutti i link interni durante questo audit. I documenti precedenti non costituiscono prova di migrazione. Materiali e lead time locali richiedono un controllo puntuale con la fonte, non si assumono inventati né certificati.

## Ordine consigliato per completare il lavoro

1. Terminare inventario pagine/prodotti/fonti e analisi acquisto; aggiornare Next con verifica dedicata.
2. Correggere e collaudare importer, migrare fotografie e documenti, produrre manifest e conteggi reali.
3. Completare modelli dati con provenienza e campi opzionali; lasciare TODO sui dati non disponibili.
4. Completare design system, navigazione accessibile, homepage e listing filtrabile.
5. Completare gallery, specifiche e frontend preventivi con prodotto preselezionato, senza servizi email non configurati.
6. Migrare pagine editoriali, contatti reali e policy; completare newsletter e documentazione ecommerce.
7. Metadata/redirect e QA ai cinque viewport richiesti, tastiera, form, immagini, link e performance.

## Modifiche di questa richiesta

- src/components/Header.tsx: logo locale tramite next/image, collegamento homepage e nome accessibile mantenuti.
- src/components/Footer.tsx: logo locale e Milano.
- app/globals.css: proporzioni logo, dimensioni responsive e header solido leggibile.
- docs/AUDIT-TRACCIA.md: questo rapporto.

Nessuna dipendenza aggiunta, nessun provider scelto, nessuna migrazione completa dichiarata come conclusa.

## Verifica dopo l'inserimento del logo

Lint, npx tsc --noEmit e build completati senza errori segnalati. Logo verificato visivamente nell'header e nel footer su localhost:3000 desktop. Nessun collaudo completo ai cinque viewport eseguito in questa richiesta; rimane da svolgere. Nessun comando obbligatorio per vedere il logo nell'anteprima gia attiva.

