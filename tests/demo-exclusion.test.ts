// Demo mode (synthetic tax params + fake data) must never reach a production build.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { DEMO_MARKERS, findDemoMarkers } from '../scripts/demo-guard';
import { DEMO_SENTINEL, demoBundle } from '../src/demo/bundle';
import synthetic from './fixtures/synthetic-params.json';

const temp: string[] = [];
const tempDir = () => {
  const d = mkdtempSync(join(tmpdir(), 'nostos-demo-'));
  temp.push(d);
  return d;
};
afterAll(() => temp.forEach((d) => rmSync(d, { recursive: true, force: true })));

describe('demo guard', () => {
  it('its markers really identify the demo bundle and the synthetic fixture', () => {
    expect(DEMO_MARKERS).toContain(DEMO_SENTINEL);
    expect(demoBundle.strings.en.watermark).toContain('DEMO — FAKE NUMBERS');
    expect(synthetic._note).toContain('SYNTHETIC TEST DATA');
  });

  it('finds a planted marker and passes a clean directory', () => {
    const dir = tempDir();
    mkdirSync(join(dir, '_astro'));
    writeFileSync(join(dir, 'index.html'), '<p>hello</p>');
    expect(findDemoMarkers(dir)).toEqual([]);
    writeFileSync(join(dir, '_astro', 'x.js'), 'const s="nostos-demo-bundle";');
    expect(findDemoMarkers(dir)).toEqual([{ file: join(dir, '_astro', 'x.js'), marker: 'nostos-demo-bundle' }]);
  });
});

describe('production build', () => {
  // NODE_ENV=development/test make import.meta.env.DEV true even in `astro build`;
  // the demo gate must still exclude the demo (found while building M4).
  it.each(['development', 'test'])('contains no demo content, even with NODE_ENV=%s', { timeout: 180_000 }, (nodeEnv) => {
    const out = tempDir();
    execFileSync('npx', ['astro', 'build', '--outDir', out], { stdio: 'pipe', env: { ...process.env, NODE_ENV: nodeEnv, NOSTOS_ENV: '' } });
    expect(findDemoMarkers(out)).toEqual([]);
    // sanity: the build really produced the calculator page with its island
    expect(execFileSync('grep', ['-l', 'CalculatorApp', join(out, 'en', 'calculator', 'index.html')]).toString()).toContain('index.html');
  });
});
