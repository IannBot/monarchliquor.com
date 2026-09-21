/**
 * Monarch Liquor image pipeline.
 * Reads originals from ../images-src, writes optimized assets to ../images.
 *
 * Usage (from repo root):
 *   cd scripts && npm install && cd ..
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'images-src');
const OUT = path.join(ROOT, 'images');

/**
 * Each entry: source file, output base name, widths, optional aspect ratio
 * (w/h), quality overrides, and crop position.
 */
const IMAGES = [
  // Page hero backgrounds (16:9-ish, keep natural ratio at 9/16 crop)
  { src: 'hero-banner.jpg', base: 'hero-banner', widths: [768, 1280, 1920], ratio: 9 / 16, jpgQ: 78, webpQ: 72 },
  { src: 'champagne-toast.jpg', base: 'champagne-toast', widths: [768, 1280, 1920], ratio: 9 / 16, jpgQ: 78, webpQ: 72 },
  // Sits under a 0.8 navy overlay — compress hard
  { src: 'wines-display.jpg', base: 'wines-display', widths: [768, 1280, 1600], ratio: 9 / 16, jpgQ: 65, webpQ: 60 },
  // Category cards, 4:3
  { src: 'gin-bottle.jpg', base: 'gin-bottle', widths: [480, 960], ratio: 3 / 4 },
  { src: 'wine-bottle.jpg', base: 'wine-bottle', widths: [480, 960], ratio: 3 / 4 },
  { src: 'beer-can.jpg', base: 'beer-can', widths: [480, 960], ratio: 3 / 4 },
  // Tab images, 4:5 portrait
  { src: 'scotch-bottles.jpg', base: 'scotch-bottles', widths: [720, 1080], ratio: 5 / 4 },
  { src: 'titos-bottles.jpg', base: 'titos-bottles', widths: [720, 1080], ratio: 5 / 4 },
  // About portrait, square (circular-cropped in CSS)
  { src: 'about-photo.png', base: 'about-photo', widths: [400, 700], ratio: 1 },
];

const DEFAULT_JPG_Q = 74;
const DEFAULT_WEBP_Q = 70;

async function processImage(cfg) {
  const srcPath = path.join(SRC, cfg.src);
  for (const w of cfg.widths) {
    const h = cfg.ratio ? Math.round(w * cfg.ratio) : null;
    const resize = { width: w, fit: 'cover', position: cfg.position || 'attention' };
    if (h) resize.height = h;

    const jpgOut = path.join(OUT, `${cfg.base}-${w}.jpg`);
    const webpOut = path.join(OUT, `${cfg.base}-${w}.webp`);

    await sharp(srcPath)
      .resize(resize)
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: cfg.jpgQ ?? DEFAULT_JPG_Q, mozjpeg: true })
      .toFile(jpgOut);

    await sharp(srcPath)
      .resize(resize)
      .webp({ quality: cfg.webpQ ?? DEFAULT_WEBP_Q })
      .toFile(webpOut);

    console.log(`  ${cfg.base}-${w} (.jpg/.webp)`);
  }
}

async function processLogo() {
  const logo = path.join(SRC, 'logo.png');

  // Transparent nav/footer logo
  await sharp(logo).resize(160, 160).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo-160.png'));
  await sharp(logo).resize(160, 160).webp({ quality: 82 }).toFile(path.join(OUT, 'logo-160.webp'));
  // Large logo for JSON-LD / manifest
  await sharp(logo).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo-512.png'));
  console.log('  logo-160.png/.webp, logo-512.png');

  // Favicons
  const fav32 = path.join(OUT, 'favicon-32.png');
  await sharp(logo).resize(32, 32).png().toFile(fav32);
  await sharp(logo).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'icon-192.png'));
  await sharp(logo).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'icon-512.png'));

  // Apple touch icon: flattened on brand navy
  await sharp(logo)
    .resize(180, 180)
    .flatten({ background: '#212f56' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'apple-touch-icon.png'));

  // Multi-size .ico
  const icoSizes = await Promise.all(
    [16, 32, 48].map((s) => sharp(logo).resize(s, s).png().toBuffer())
  );
  const ico = await pngToIco(icoSizes);
  await writeFile(path.join(OUT, 'favicon.ico'), ico);
  console.log('  favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png');
}

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const cfg of IMAGES) {
    console.log(cfg.src);
    await processImage(cfg);
  }

  console.log('logo.png');
  await processLogo();

  const manifest = {
    name: 'Monarch Liquor',
    short_name: 'Monarch',
    icons: [
      { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#212f56',
    background_color: '#ffffff',
    display: 'browser',
  };
  await writeFile(path.join(ROOT, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
  console.log('site.webmanifest');

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
