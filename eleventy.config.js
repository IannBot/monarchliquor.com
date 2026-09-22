import * as hoursLib from "./lib/hours.js";
import photos from "./src/_data/photos.js";
import delivery from "./src/_data/delivery.js";
import siteData from "./src/_data/site.js";
import { faqAnswer } from "./lib/schema.js";

export default function (eleventyConfig) {
  // Hours engine is shared with the browser.
  eleventyConfig.addPassthroughCopy({ "lib/hours.js": "js/hours-core.js" });
  eleventyConfig.addGlobalData("hoursLib", hoursLib);

  // Every BottleCapps link goes through this shortcode so placement is tracked.
  eleventyConfig.addShortcode("order", (placement, label = "Order Delivery", cls = "btn btn--primary", category = null) =>
    `<a href="${(category && siteData.bottlecapps.categories[category]) || siteData.bottlecapps.home}" target="_blank" rel="noopener" class="${cls} shop-link" data-cta="${placement}">${label}</a>`);

  eleventyConfig.addFilter("faqAnswer", (f, d) => faqAnswer(f, d));

  eleventyConfig.on("eleventy.before", () => {
    const unconfirmed = Object.entries(delivery.terms).filter(([, t]) => !t.confirmed).map(([k]) => k);
    const zones = delivery.zones.filter((z) => !z.confirmed).map((z) => z.storeId);
    if (unconfirmed.length) console.log(`[delivery] WARN unconfirmed delivery term(s), rendering fallbacks: ${unconfirmed.join(", ")}`);
    if (zones.length) console.log(`[delivery] WARN unconfirmed delivery zone(s): ${zones.join(", ")}`);
    if (process.env.STRICT_TERMS === "1" && (unconfirmed.length || zones.length)) throw new Error("STRICT_TERMS: unconfirmed delivery terms");
  });

  eleventyConfig.on("eleventy.after", () => {
    const pending = Object.entries(photos).filter(([, p]) => p.placeholder).map(([k]) => k);
    if (pending.length) console.log(`[photos] ${pending.length} placeholder photo(s) awaiting owner: ${pending.join(", ")}`);
  });

  // Static assets copied as-is.
  for (const p of ["src/css", "src/js", "src/images", "src/fonts", "src/site.webmanifest", "src/CNAME", "src/.nojekyll"]) {
    eleventyConfig.addPassthroughCopy(p);
  }

  // Store lookups (Nunjucks' selectattr cannot compare values).
  eleventyConfig.addFilter("storeById", (stores, id) => {
    const s = stores.find((x) => x.id === id);
    if (!s) throw new Error(`storeById: unknown store "${id}"`);
    return s;
  });
  eleventyConfig.addFilter("otherStore", (stores, id) => stores.find((x) => x.id !== id));
  eleventyConfig.addFilter("zoneFor", (zones, id) => zones.find((z) => z.storeId === id));

  eleventyConfig.addFilter("uniquePhones", (stores) => [...new Set(stores.map((s) => s.phone.href))]);

  // Pretty JSON for the JSON-LD script tag.
  eleventyConfig.addFilter("jsonld", (value) => JSON.stringify(value, null, 2));

  // ISO date (YYYY-MM-DD) for sitemap lastmod.
  eleventyConfig.addFilter("date", (d) => {
    if (typeof d === "string") return d.slice(0, 10);
    return new Date(d).toISOString().slice(0, 10);
  });

  // "Sept 2026" style month label for article bylines.
  eleventyConfig.addFilter("monthYear", (d) => new Date(typeof d === "string" ? d + "T12:00:00Z" : d).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }));

  // Absolute URL helper for sitemap/OG.
  eleventyConfig.addFilter("abs", (path, site) => site.url.replace(/\/$/, "") + path);

  // Guides, newest first.
  eleventyConfig.addCollection("guides", (api) =>
    api.getFilteredByTag("guides").sort((a, b) => new Date(b.data.datePublished) - new Date(a.data.datePublished) || a.inputPath.localeCompare(b.inputPath))
  );

  // Sitemap entries: HTML pages ordered by priority (desc), then by source order.
  eleventyConfig.addCollection("sitemap", (api) =>
    api.getAll()
      .filter((p) => p.outputPath && p.outputPath.endsWith(".html") && !p.data.noindex)
      .map((p, i) => ({ p, i, pr: parseFloat((p.data.sitemap && p.data.sitemap.priority) || "0.5") }))
      .sort((a, b) => b.pr - a.pr || a.i - b.i)
      .map((x) => x.p)
  );

  eleventyConfig.setServerOptions({ port: 8080, showAllHosts: false });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
