// Checks that every tax parameter in src/config/greece-tax-2026.json is verified.
// A parameter is any object with a "value" key; it is verified only when value,
// sourceUrl, verifiedBy and verifiedOn are all non-null.
//
// NOSTOS_ENV=production -> exit 1 if anything is unverified (blocks the build).
// Otherwise               -> print a warning and exit 0 (pre-launch builds continue).
import { readFileSync } from 'node:fs';

const CONFIG = new URL('../src/config/greece-tax-2026.json', import.meta.url);
const FIELDS = ['value', 'sourceUrl', 'verifiedBy', 'verifiedOn'];

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const params = [];

(function walk(node, path) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return;
  if ('value' in node) {
    params.push({ path, missing: FIELDS.filter((f) => node[f] === null || node[f] === undefined) });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith('_')) walk(child, path ? `${path}.${key}` : key);
  }
})(config, '');

const unverified = params.filter((p) => p.missing.length > 0);
const production = process.env.NOSTOS_ENV === 'production';

if (params.length === 0) {
  console.error('check:params: no parameters found in greece-tax-2026.json');
  process.exit(1);
}

if (unverified.length === 0) {
  console.log(`check:params: all ${params.length} tax parameters verified.`);
  process.exit(0);
}

const list = unverified.map((p) => `  - ${p.path} (missing: ${p.missing.join(', ')})`).join('\n');
if (production) {
  console.error(
    `check:params: ERROR ${unverified.length} of ${params.length} tax parameters unverified. ` +
      `Production build blocked (NOSTOS_ENV=production).\n${list}`,
  );
  process.exit(1);
}
console.warn(
  `check:params: WARNING ${unverified.length} of ${params.length} tax parameters unverified. ` +
    `Continuing because NOSTOS_ENV is not "production".\n${list}`,
);
