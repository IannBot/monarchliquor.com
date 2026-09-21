// QA helper: verifies root-relative internal links and #anchors resolve.
import { readFileSync } from 'node:fs';

const files = [
  'index.html', 'about.html', 'delivery.html', 'contact.html',
  'bars-restaurants.html', 'careers.html', 'privacy-policy.html',
  'guides/index.html', 'guides/best-bourbon-whiskey-austin.html',
  'guides/texas-spirits-guide.html', 'guides/classic-cocktails-at-home.html',
];

const pages = {};
for (const f of files) pages['/' + f] = readFileSync(f, 'utf8');
pages['/'] = pages['/index.html'];
pages['/guides/'] = pages['/guides/index.html'];

const assetPrefixes = ['/css', '/js', '/images', '/site.webmanifest'];
let bad = 0;

for (const f of files) {
  const html = pages['/' + f];
  const re = /href="(\/[^"#]*)?(#[^"]+)?"/g;
  let m;
  while ((m = re.exec(html))) {
    let [, target, anchor] = m;
    if (!target && !anchor) continue;
    if (!target) target = '/' + f;
    if (!(target in pages)) {
      if (!assetPrefixes.some((p) => target.startsWith(p))) {
        console.log(`${f}: broken link ${m[0]}`);
        bad++;
      }
      continue;
    }
    if (anchor) {
      const id = anchor.slice(1);
      if (!pages[target].includes(`id="${id}"`)) {
        console.log(`${f}: missing anchor ${target}${anchor}`);
        bad++;
      }
    }
  }
}

console.log(bad === 0 ? 'all internal links + anchors OK' : `broken: ${bad}`);
process.exit(bad === 0 ? 0 : 1);
