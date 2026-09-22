# monarchliquor.com

Static marketing site for Monarch Liquor (East Austin and Lakeway, TX), built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages by GitHub Actions on every push to `master`.

## Local development

```bash
npm install
npm run dev        # http://localhost:8080 with live reload
npm run check      # build + link check + SEO lint + unit tests (what CI runs)
```

Other scripts: `npm run build` (writes `_site/`), `npm run images` (regenerates `src/images/` from `images-src/`), `npm test`.

## Where things live

| What | Where |
|---|---|
| Business facts: addresses, phones, hours, holidays, social links | `src/_data/business.js` |
| Delivery terms and zones (each with a `confirmed` flag) | `src/_data/delivery.js` |
| FAQ questions and answers (visible text and FAQPage schema) | `src/_data/faqs.js` |
| Site settings: nav, BottleCapps URLs, GA4 ID, announcement | `src/_data/site.js` |
| Photo shot list and placeholders | `src/_data/photos.js` |
| Shared layout and partials (header, store strip, footer, sticky bar) | `src/_includes/` |
| Pages | `src/*.njk`, `src/guides/*.njk` |
| JSON-LD builder (all structured data comes from the data files) | `lib/schema.js` |
| Open/closed logic (build and browser) | `lib/hours.js` |
| Styles (one file, no build step) | `src/css/style.css` |

### Typography

Two self-hosted families, one job each: **Libre Baskerville** for headings (italic for display moments such as page titles, section titles, and card titles; upright inside article bodies) and **Source Sans 3** for body copy, UI, labels, and buttons. Sizes come from the `--fs-*` tokens at the end of `src/css/style.css` (caption 13, small 15, body 17, lead 19, h4 20, h3 26, h2 30–40 fluid, h1 38–56 fluid). Uppercase labels use `--track-label`; hero sub-lines and kickers use `--track-kicker`. Add new components with those tokens rather than pixel sizes.

Edit a fact once in the data file and every page, the footer, the store strip, the FAQ, `llms.txt`, and the schema update together.

### Changing hours or adding holiday hours

Edit `hours.weekly` or add entries to `hours.holidays` in `src/_data/business.js`:

```js
holidays: [
  { date: "2026-11-26", label: "Thanksgiving", closed: true },
  { date: "2026-12-24", label: "Christmas Eve", open: "10:00", close: "18:00" },
],
```

Holiday notices appear on the store pages for the next 14 days and feed the `specialOpeningHoursSpecification` schema.

### Confirming delivery terms

`src/_data/delivery.js` holds every delivery claim. While a term has `confirmed: false`, the site shows its neutral `fallback` wording and the build prints `[delivery] WARN`. Review each term, correct the text, set `confirmed: true`, and set `reviewedOn`. Add ZIP codes to each zone to enable the delivery-zone checker on the delivery page. Setting `STRICT_TERMS=1` makes the build fail on any unconfirmed term; turn that on in the workflow after sign-off.

### Replacing placeholder photos

`src/_data/photos.js` lists each shot the site needs. Drop the original in `images-src/`, add it to the `IMAGES` table in `scripts/optimize-images.mjs`, run `npm run images`, then point the entry's `src`/`webp` at the generated files and set `placeholder: false`. The build logs how many placeholders remain.

### Adding a guide

Copy an existing file in `src/guides/`, set `title`, `description`, `headline`, `summary`, `datePublished`, `card`, and `tags: [guides]`. The guides index and sitemap pick it up automatically. Use `{% order "guide-callout", "SHOP X", "btn-primary" %}` for shop buttons so clicks are tracked.

## Owner setup checklist

1. **DNS (site is down until this is done).** At the registrar for monarchliquor.com, delete the Wix A records and the `www` CNAME to `cdn3.wixdns.net`, then add:
   - A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME `www` → `iannbot.github.io`
   - The TXT verification record shown under GitHub Settings → Pages → Verified domains

   After propagation, turn on "Enforce HTTPS" in Settings → Pages.
2. **Google Analytics 4.** Create a property at analytics.google.com, copy the Measurement ID (`G-…`) into `ga4Id` in `src/_data/site.js`. Events `order_click`, `call_click`, `directions_click`, and `email_click` appear in GA4 automatically; mark `order_click` as a conversion.
3. **Google Search Console.** Add the domain property, verify by DNS TXT, submit `https://monarchliquor.com/sitemap.xml`, and request indexing for `/east-austin.html`, `/lakeway.html`, `/delivery.html`, and `/faq.html`.
4. **Google Business Profile.** For each listing: set the website to that store's page (`/east-austin.html`, `/lakeway.html`), confirm hours match (Mon–Sat 10am–9pm, Sunday closed), set the "Order online" link to BottleCapps, add the new photos, and copy each listing's Place ID so the review links can use `https://search.google.com/local/writereview?placeid=…` (paste into `reviewUrl` and `gbpUrl` in `business.js`).
5. **Delivery terms.** Fee, timing, gifts, returns, special orders, and the $300 card rule are confirmed. Still open in `src/_data/delivery.js`: the delivery zones with ZIP lists.
6. **Photos.** Supply the shots in `src/_data/photos.js`.
7. **Emails.** Decide whether both stores use `Retail@monarchliquor.com`; update `email` per store and `careersEmail`.
8. **Payment methods and price range** in `business.js` (used in schema).
9. **Delivery app links.** Paste the Uber Eats, DoorDash, Grubhub, and Instacart store URLs into `marketplaces` in `src/_data/site.js` (badges on the homepage and delivery page become links). Optionally add official logo files under `src/images/marketplaces/` and set each entry's `logo`.

## Deploy

Push to `master`. The workflow in `.github/workflows/deploy.yml` builds, runs the checks, and publishes `_site/`. Watch runs at https://github.com/IannBot/monarchliquor.com/actions.
