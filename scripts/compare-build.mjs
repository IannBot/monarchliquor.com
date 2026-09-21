// Compares _site output against a snapshot directory of the pre-migration HTML.
// Usage: node scripts/compare-build.mjs <snapshotDir>
// HTML is compared with whitespace and comments normalized; JSON-LD blocks are
// parsed and deep-compared so formatting differences don't count.
import fs from "node:fs";
import path from "node:path";

const snap = process.argv[2];
if (!snap) throw new Error("snapshot dir required");
const pages = [
  "index.html", "about.html", "delivery.html", "contact.html", "bars-restaurants.html",
  "careers.html", "privacy-policy.html", "guides/index.html",
  "guides/best-bourbon-whiskey-austin.html", "guides/texas-spirits-guide.html",
  "guides/classic-cocktails-at-home.html", "sitemap.xml", "robots.txt",
];

const jsonldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
function split(html) {
  const blocks = [];
  const rest = html.replace(jsonldRe, (m, j) => { blocks.push(JSON.parse(j)); return "<script type=\"application/ld+json\">JSONLD</script>"; });
  return { blocks, rest };
}
function norm(html) {
  return html
    .replace(/\r\n/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
}
function tokens(s) { return s.split(/(?=<)/); }
function firstDiff(a, b) {
  const ta = tokens(a), tb = tokens(b);
  for (let i = 0; i < Math.max(ta.length, tb.length); i++) {
    if (ta[i] !== tb[i]) return { i, a: ta.slice(i, i + 3).join(""), b: tb.slice(i, i + 3).join("") };
  }
  return null;
}
function unwrap(b) { return (b["@graph"] && b["@graph"].length === 1 && Object.keys(b).length === 2) ? { "@context": b["@context"], ...b["@graph"][0] } : b; }
function stable(v) { if (Array.isArray(v)) v = v.map(unwrap); return JSON.stringify(v, (k, x) => (x && typeof x === "object" && !Array.isArray(x)) ? Object.keys(x).sort().reduce((o, key) => (o[key] = x[key], o), {}) : x); }

let failures = 0;
for (const p of pages) {
  const before = fs.readFileSync(path.join(snap, p), "utf8");
  const after = fs.readFileSync(path.join("_site", p), "utf8");
  const b = split(before), a = split(after);
  const d = firstDiff(norm(b.rest), norm(a.rest));
  const jd = stable(b.blocks) !== stable(a.blocks);
  if (!d && !jd) { console.log("OK   ", p); continue; }
  failures++;
  console.log("DIFF ", p);
  if (d) console.log("  html @token", d.i, "\n   before:", d.a.slice(0, 300), "\n   after: ", d.b.slice(0, 300));
  if (jd) console.log("  jsonld differs\n   before:", stable(b.blocks).slice(0, 400), "\n   after: ", stable(a.blocks).slice(0, 400));
}
process.exit(failures ? 1 : 0);
