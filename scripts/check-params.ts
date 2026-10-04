// Checks that every tax parameter in src/config/greece-tax-2026.json is verified
// (value, sourceUrl, verifiedBy and verifiedOn all set).
//
// NOSTOS_ENV=production -> exit 1 if anything is unverified (blocks the build).
// Otherwise               -> print a warning and exit 0 (pre-launch builds continue).
import { readFileSync } from 'node:fs';
import { isProduction, listParams } from '../src/lib/params/verification.ts';

const CONFIG = new URL('../src/config/greece-tax-2026.json', import.meta.url);
const params = listParams(JSON.parse(readFileSync(CONFIG, 'utf8')));
const unverified = params.filter((p) => p.missing.length > 0);

if (params.length === 0) {
  console.error('check:params: no parameters found in greece-tax-2026.json');
  process.exit(1);
}

if (unverified.length === 0) {
  console.log(`check:params: all ${params.length} tax parameters verified.`);
  process.exit(0);
}

const list = unverified.map((p) => `  - ${p.path} (missing: ${p.missing.join(', ')})`).join('\n');
if (isProduction(process.env.NOSTOS_ENV)) {
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
