// SYNTHETIC params (tests/fixtures/synthetic-params.json) and made-up data.
import { describe, expect, it } from 'vitest';
import realConfig from '../../src/config/greece-tax-2026.json';
import rentFile from '../../src/data/manual/rent.json';
import { buildResults, displayModeFor, type CalculatorData } from '../../src/lib/calculator/results';
import { loadFx, loadPriceLevels, loadRent } from '../../src/lib/data';
import type { CalculatorInputs } from '../../src/lib/calculator/inputs';
import { params } from '../tax/helpers';

const data: CalculatorData = {
  fx: loadFx({ source: 's', fetchedAt: 't', date: '2026-01-01', base: 'EUR', rates: { GBP: 0.8 } }),
  priceLevels: loadPriceLevels({ source: 's', fetchedAt: 't', year: 2024, basis: 'SYNTHETIC', indices: { GR: 80, GB: 100, DE: 100 } }),
  rent: loadRent({ quarter: '2026-Q2', sourceUrl: 'https://example.org', basis: 'x', cities: { athens: 10 }, sizes: { one_bed: 60 } }),
};
const noData: CalculatorData = { fx: loadFx(undefined), priceLevels: loadPriceLevels(undefined), rent: loadRent(rentFile) };

// 28,000 gross, 31+: net 21,336/yr without 5C (1,778/mo), 24,628 with (2,052.33/mo).
const inputs: CalculatorInputs = {
  origin: 'DE',
  netMonthlyLocal: 2_400,
  rentMonthlyLocal: 1_000,
  children: 0,
  birthYear: 1980,
  city: 'athens',
  grossAnnualEur: 28_000,
  size: 'one_bed',
};

describe('displayModeFor (SPEC §5.3)', () => {
  it('maps each outcome', () => {
    expect(displayModeFor('likely_eligible')).toBe('with5C_primary');
    expect(displayModeFor('borderline')).toBe('side_by_side');
    expect(displayModeFor('likely_not_eligible')).toBe('without5C_only');
  });
});

describe('buildResults', () => {
  it('with 5C: headline compares years 1–7 and from year 8', () => {
    const r = buildResults(inputs, 'likely_eligible', params(), data);
    expect(r.mode).toBe('with5C_primary');
    expect(r.without5C.ok && r.without5C.breakdown.monthlyNet).toBe(1_778);
    expect(r.rent).toMatchObject({ status: 'ok', value: { monthly: 600 } });
    // origin (DE, EUR, PLI 100): 1,400 left → 1,120 in Greek prices
    expect(r.comparisonWithout5C!.result.origin.leftInGreekPrices).toBe(1_120);
    // with 5C: 2,052.33 − 600 = 1,452.33 → +29.7%; from year 8: 1,178 → +5.2%
    expect(r.headline).toEqual({
      kind: 'with5C',
      durationYears: 7,
      cliffYear: 8,
      during: { direction: 'more', pct: 30 },
      after: { direction: 'more', pct: 5 },
      averaged: false,
    });
  });

  it('not eligible: headline without 5C only', () => {
    const r = buildResults(inputs, 'likely_not_eligible', params(), data);
    expect(r.headline).toEqual({ kind: 'without5C', change: { direction: 'more', pct: 5 } });
  });

  it('marks the 5C figure as an average when the age band changes during the 5C years', () => {
    const r = buildResults({ ...inputs, birthYear: 2002 }, 'likely_eligible', params({ 'art5c.youthReliefInteraction': 'stack' }), data);
    expect(r.headline?.kind === 'with5C' && r.headline.averaged).toBe(true);
  });

  it('converts a non-EUR origin with the FX rate', () => {
    const r = buildResults({ ...inputs, origin: 'GB' }, 'likely_not_eligible', params(), data);
    // 1,400 GBP left → 1,750 EUR → × 80/100 = 1,400 in Greek prices
    expect(r.comparisonWithout5C!.result.origin.leftInGreekPrices).toBeCloseTo(1_400, 10);
  });

  it('missing data blocks only the parts that need it, listing what is missing', () => {
    const r = buildResults({ ...inputs, origin: 'SE' }, 'likely_eligible', params(), data);
    expect(r.without5C.ok).toBe(true);
    expect(r.timeline.ok).toBe(true);
    expect(r.comparisonData).toEqual({ status: 'unavailable', missing: ['fx.SEK', 'priceLevels.SE'] });
    expect(r.comparisonWith5C).toBeNull();
    expect(r.headline).toBeNull();
  });

  it('with no data files at all: rent and comparison unavailable, net pay still computed', () => {
    const r = buildResults(inputs, 'borderline', params(), noData);
    expect(r.rent).toEqual({ status: 'unavailable', missing: ['rent.quarter', 'rent.sourceUrl'] });
    expect(r.comparisonData.status).toBe('unavailable');
    expect(r.without5C.ok).toBe(true);
  });

  it('with the real (unverified) config: no numbers anywhere, missing parameters listed', () => {
    const r = buildResults(inputs, 'borderline', realConfig, data);
    expect(r.without5C.ok).toBe(false);
    expect(r.timeline.ok).toBe(false);
    expect(r.comparisonWithout5C).toBeNull();
    expect(r.comparisonWith5C).toBeNull();
    expect(r.headline).toBeNull();
    if (!r.without5C.ok) expect(r.without5C.missingParams).toContain('incomeTax.brackets');
  });
});
