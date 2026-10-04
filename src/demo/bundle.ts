// DEV-ONLY demo bundle: SYNTHETIC tax parameters plus FAKE sample data, so the
// full results layout can be reviewed while real parameters are unverified.
// Imported only behind `import.meta.env.DEV`; scripts/check-no-demo.ts fails the
// build if any of DEMO_MARKERS reaches dist/.
import synthetic from '../../tests/fixtures/synthetic-params.json';
import { loadFx, loadPriceLevels, loadRent } from '../lib/data';
import type { RawInputs } from '../lib/calculator/inputs';

export const DEMO_SENTINEL = 'nostos-demo-bundle';

/** Strings for the demo controls; deliberately NOT in src/i18n so they never ship. */
const strings = {
  el: {
    watermark: 'ΔΟΚΙΜΗ — ΨΕΥΤΙΚΟΙ ΑΡΙΘΜΟΙ · DEMO — FAKE NUMBERS',
    toggle: 'Λειτουργία δοκιμής (μόνο npm run dev): συνθετικοί φορολογικοί παράμετροι και ψεύτικα δεδομένα',
    outcome: 'Αποτέλεσμα κουίζ (για δοκιμή)',
    fill: 'Συμπλήρωσε δείγμα στοιχείων',
  },
  en: {
    watermark: 'DEMO — FAKE NUMBERS',
    toggle: 'Demo mode (npm run dev only): synthetic tax parameters and fake data',
    outcome: 'Pretend quiz outcome',
    fill: 'Fill sample inputs',
  },
};

const sampleInputs: RawInputs = {
  origin: 'GB',
  netMonthly: '3200',
  rentMonthly: '1400',
  noRent: false,
  children: '0',
  birthYear: '1990',
  city: 'athens',
  grossAnnual: '30000',
  size: 'one_bed',
};

export const demoBundle = {
  sentinel: DEMO_SENTINEL,
  params: synthetic,
  data: {
    fx: loadFx({ source: 'DEMO — FAKE NUMBERS', fetchedAt: '2026-01-01T00:00:00Z', date: '2026-01-01', base: 'EUR', rates: { GBP: 0.8, USD: 1.1, AUD: 1.6, SEK: 11 } }),
    priceLevels: loadPriceLevels({
      source: 'DEMO — FAKE NUMBERS',
      fetchedAt: '2026-01-01T00:00:00Z',
      year: 2024,
      basis: 'DEMO — FAKE NUMBERS',
      indices: { GR: 80, DE: 105, GB: 110, NL: 110, AU: 115, US: 120, BE: 108, SE: 115, CY: 90 },
    }),
    rent: loadRent({
      quarter: 'DEMO',
      sourceUrl: 'https://example.org/demo',
      basis: 'DEMO — FAKE NUMBERS',
      cities: { athens: 15, thessaloniki: 11, heraklion: 11, patras: 9 },
      sizes: { studio: 40, one_bed: 60, two_bed: 80, three_bed: 100 },
    }),
  },
  strings,
  sampleInputs,
};

export type DemoBundle = typeof demoBundle;
