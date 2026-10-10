// Generates the static Open Graph images (SPEC §10): one 1200×630 PNG per page per
// language, public/og/<page>-<locale>.png, which Base.astro references.
// Colours come from src/styles/tokens.css (light theme), fonts from the site's own
// Fontsource packages, text from the i18n files. Run after changing a page title or
// meta description, and commit the PNGs:  npm run og
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = new URL('..', import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), 'utf8');

// Light-theme tokens: the first :root block of tokens.css.
const lightRoot = read('src/styles/tokens.css').split('@media')[0]!;
const token = (name: string): string => {
  const m = new RegExp(`--nostos-${name}:\\s*(#[0-9a-fA-F]{3,8})`).exec(lightRoot);
  if (!m) throw new Error(`token --nostos-${name} not found`);
  return m[1]!;
};
const c = { bg: token('bg'), ink: token('ink'), muted: token('muted'), accent: token('accent'), line: token('line') };

// sharp's librsvg can't read woff2, so decode the Fontsource files to TTF in a temp
// dir and point fontconfig at it (must happen before sharp is loaded).
const { decompress } = require('wawoff2') as { decompress: (b: Uint8Array) => Promise<Uint8Array> };
const fontDir = join(tmpdir(), 'nostos-og-fonts');
mkdirSync(fontDir, { recursive: true });
const fonts = [
  '@fontsource-variable/literata/files/literata-latin-wght-normal.woff2',
  '@fontsource-variable/literata/files/literata-greek-wght-normal.woff2',
  '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  '@fontsource-variable/inter/files/inter-greek-wght-normal.woff2',
];
for (const f of fonts) {
  const ttf = await decompress(readFileSync(require.resolve(f)));
  writeFileSync(join(fontDir, f.split('/').pop()!.replace('.woff2', '.ttf')), ttf);
}
writeFileSync(
  join(fontDir, 'fonts.conf'),
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${fontDir}</dir><cachedir>${fontDir}/cache</cachedir></fontconfig>`,
);
process.env.FONTCONFIG_FILE = join(fontDir, 'fonts.conf');
const { default: sharp } = await import('sharp');

type Dict = Record<string, string>;
const dicts: Record<'el' | 'en', Dict> = { el: JSON.parse(read('src/i18n/el.json')), en: JSON.parse(read('src/i18n/en.json')) };

// Heading key and description key per page (the home page uses its pitch, the others their meta description).
const PAGES: Record<string, [string, string]> = {
  home: ['home.hook', 'home.pitch'],
  calculator: ['calculatorPage.title', 'meta.calculator.description'],
  compare: ['peers.title', 'meta.compare.description'],
  methodology: ['method.title', 'meta.methodology.description'],
  privacy: ['privacy.title', 'meta.privacy.description'],
  about: ['about.title', 'meta.about.description'],
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word wrap by an approximate character budget; the last line gets an ellipsis if cut. */
function wrap(text: string, perLine: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > perLine) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1]!.replace(/[\s,.;:·]*\S*$/, '') + '…';
  }
  return lines;
}

function svg(dict: Dict, page: string): string {
  const [titleKey, descKey] = PAGES[page]!;
  const title = wrap(dict[titleKey]!, 26, 3);
  const desc = wrap(dict[descKey]!, 58, 3);
  const titleSize = 68;
  const titleLh = Math.round(titleSize * 1.12);
  const titleTop = 230 - (title.length - 1) * 15;
  const descTop = titleTop + (title.length - 1) * titleLh + 72;
  const tspans = (lines: string[], x: number, y: number, lh: number) =>
    lines.map((l, i) => `<tspan x="${x}" y="${(y + i * lh).toFixed(0)}">${esc(l)}</tspan>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${c.bg}"/>
  <rect width="1200" height="14" fill="${c.accent}"/>
  <text x="80" y="104" font-family="Literata" font-weight="600" font-size="44" fill="${c.accent}">${esc(dict['site.name']!)}</text>
  <text font-family="Literata" font-weight="600" font-size="${titleSize}" fill="${c.ink}">${tspans(title, 80, titleTop, titleLh)}</text>
  <text font-family="Inter" font-weight="400" font-size="32" fill="${c.muted}">${tspans(desc, 80, descTop, 44)}</text>
  <rect x="80" y="540" width="1040" height="2" fill="${c.line}"/>
  <text x="80" y="586" font-family="Inter" font-weight="500" font-size="24" fill="${c.muted}">${esc(dict['footer.disclaimer']!)}</text>
</svg>`;
}

const outDir = new URL('public/og/', root);
mkdirSync(outDir, { recursive: true });
for (const locale of ['el', 'en'] as const) {
  for (const page of Object.keys(PAGES)) {
    const out = new URL(`${page}-${locale}.png`, outDir);
    await sharp(Buffer.from(svg(dicts[locale], page))).png({ compressionLevel: 9, palette: true }).toFile(out.pathname);
    console.log(`og: ${out.pathname.replace(root.pathname, '')}`);
  }
}
