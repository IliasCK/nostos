// Fails the build if any demo-mode content (synthetic tax params, fake data,
// demo labels) reached the build output. Demo mode exists only in `npm run dev`.
import { findDemoMarkers } from './demo-guard.ts';

const dir = process.argv[2] ?? 'dist';
const hits = findDemoMarkers(dir);
if (hits.length > 0) {
  console.error(`check-no-demo: ERROR demo content found in ${dir}:`);
  for (const h of hits) console.error(`  - ${h.file}: "${h.marker}"`);
  process.exit(1);
}
console.log(`check-no-demo: no demo content in ${dir}.`);
