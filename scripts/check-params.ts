// Checks that every tax parameter in src/config/greece-tax-2026.json is verified
// (value, sourceUrl, verifiedBy and verifiedOn all set), and that the launch
// placeholders in src/config/site.json are filled in.
//
// NOSTOS_ENV=production -> exit 1 if anything is unverified or unset (blocks the build).
// Otherwise               -> print a warning and exit 0 (pre-launch builds continue).
import { readFileSync } from 'node:fs';
import { isProduction, listParams } from '../src/lib/params/verification.ts';
import { missingSiteValues } from '../src/lib/site-config.ts';

const CONFIG = new URL('../src/config/greece-tax-2026.json', import.meta.url);
const SITE = new URL('../src/config/site.json', import.meta.url);
const params = listParams(JSON.parse(readFileSync(CONFIG, 'utf8')));
const unverified = params.filter((p) => p.missing.length > 0);
const siteMissing = missingSiteValues(JSON.parse(readFileSync(SITE, 'utf8')));
const production = isProduction(process.env.NOSTOS_ENV);
const level = production ? 'ERROR' : 'WARNING';
const report = production ? console.error : console.warn;

if (params.length === 0) {
  console.error('check:params: no parameters found in greece-tax-2026.json');
  process.exit(1);
}

if (unverified.length === 0) {
  console.log(`check:params: all ${params.length} tax parameters verified.`);
} else {
  const list = unverified.map((p) => `  - ${p.path} (missing: ${p.missing.join(', ')})`).join('\n');
  report(`check:params: ${level} ${unverified.length} of ${params.length} tax parameters unverified.\n${list}`);
}

if (siteMissing.length > 0) {
  report(`check:params: ${level} site.json values not filled in:\n${siteMissing.map((k) => `  - ${k}`).join('\n')}`);
}

if (unverified.length === 0 && siteMissing.length === 0) process.exit(0);
if (production) {
  console.error('check:params: production build blocked (NOSTOS_ENV=production).');
  process.exit(1);
}
console.warn('check:params: continuing because NOSTOS_ENV is not "production".');
