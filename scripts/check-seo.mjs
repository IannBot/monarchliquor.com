// SEO lint for the built site: titles, descriptions, single h1, canonical,
// parseable JSON-LD, and no placeholder leaks. Warnings never fail the build;
// errors (missing canonical, invalid JSON-LD, multiple h1s) do.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "_site";
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(OUT).filter((f) => f.endsWith(".html"));
let errors = 0, warnings = 0;
const warn = (p, m) => { warnings++; console.log(`WARN  ${p}: ${m}`); };
const err = (p, m) => { errors++; console.log(`ERROR ${p}: ${m}`); };
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&ndash;/g, "–");

for (const f of pages) {
  const p = "/" + relative(OUT, f).split(sep).join("/");
  const html = readFileSync(f, "utf8");
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  const desc = decode((html.match(/name="description" content="([^"]*)"/) || [])[1] || "");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const canonical = (html.match(/rel="canonical" href="([^"]*)"/) || [])[1];

  if (!title) err(p, "missing <title>");
  else if (title.length > 65) warn(p, `title is ${title.length} chars (aim for 60 or fewer): "${title}"`);
  if (!desc) err(p, "missing meta description");
  else if (desc.length > 165) warn(p, `description is ${desc.length} chars (aim for 160 or fewer)`);
  else if (desc.length < 70) warn(p, `description is only ${desc.length} chars`);
  if (h1s !== 1) err(p, `${h1s} <h1> elements`);
  if (!canonical) err(p, "missing canonical");
  else if (!canonical.startsWith("https://monarchliquor.com/")) err(p, `canonical is ${canonical}`);

  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  for (const block of ld) {
    try { JSON.parse(block.replace(/<script[^>]*>|<\/script>/g, "")); }
    catch (e) { err(p, "JSON-LD does not parse: " + e.message); }
  }
  if (!ld.length && p !== "/404.html" && p !== "/privacy-policy.html") warn(p, "no JSON-LD");
  if (/\$50/.test(html) && !/data-confirmed/.test(html) && p !== "/privacy-policy.html") warn(p, "mentions $50 (delivery term) outside the data-driven partials");
  if (/OWNER TODO|TODO:/.test(html)) err(p, "TODO marker leaked into output");
}

console.log(`${pages.length} pages checked: ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
