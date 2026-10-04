// Finds dev-only demo content in a build output directory. Used by
// scripts/check-no-demo.ts (runs after every `npm run build`) and its tests.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Strings that only exist in src/demo/bundle.ts and tests/fixtures/synthetic-params.json. */
export const DEMO_MARKERS = ['DEMO — FAKE NUMBERS', 'SYNTHETIC TEST DATA', 'nostos-demo-bundle'] as const;

const TEXT = /\.(html|js|mjs|css|json|txt|xml|svg)$/;

export function findDemoMarkers(dir: string): { file: string; marker: string }[] {
  const hits: { file: string; marker: string }[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const path = join(d, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (TEXT.test(entry.name)) {
        const content = readFileSync(path, 'utf8');
        for (const marker of DEMO_MARKERS) if (content.includes(marker)) hits.push({ file: path, marker });
      }
    }
  };
  walk(dir);
  return hits;
}
