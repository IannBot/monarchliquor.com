// QA helper: verifies root-relative internal links, #anchors, and asset paths
// resolve inside the built site (_site). External hosts are never fetched.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = '_site';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const htmlFiles = walk(OUT).filter((f) => f.endsWith('.html'));
const pages = {};
for (const f of htmlFiles) {
  const url = '/' + relative(OUT, f).split(sep).join('/');
  const html = readFileSync(f, 'utf8');
  pages[url] = html;
  if (url.endsWith('/index.html')) pages[url.replace(/index\.html$/, '')] = html;
}

let bad = 0;
for (const [url, html] of Object.entries(pages)) {
  if (url.endsWith('/')) continue; // alias of index.html
  const re = /(?:href|src)="(\/[^"#]*)?(#[^"]+)?"/g;
  let m;
  while ((m = re.exec(html))) {
    let [, target, anchor] = m;
    if (!target && !anchor) continue;
    if (!target) target = url;
    if (target in pages) {
      if (anchor) {
        const id = anchor.slice(1);
        if (!pages[target].includes(`id="${id}"`)) {
          console.log(`${url}: missing anchor ${target}${anchor}`);
          bad++;
        }
      }
      continue;
    }
    // Not a page: must exist as a file in the build output.
    if (!existsSync(join(OUT, target))) {
      console.log(`${url}: broken link ${m[0]}`);
      bad++;
    }
  }
}

console.log(bad === 0 ? `all internal links + anchors OK (${htmlFiles.length} pages)` : `broken: ${bad}`);
process.exit(bad === 0 ? 0 : 1);
