// SYNTHETIC parameters only (see tests/fixtures/synthetic-params.json).
import { describe, expect, it } from 'vitest';
import realConfig from '../../src/config/greece-tax-2026.json';
import { computeTimeline } from '../../src/lib/tax';
import { params } from './helpers';

const base = { grossAnnual: 28_000, children: 0, ageBand: '31plus' as const };

describe('computeTimeline', () => {
  it('shows years 1–7 with 5C, then the cliff from year 8', () => {
    const t = computeTimeline({ ...base, params: params() });
    if (!t.ok) throw new Error('expected a timeline');
    expect(t.durationYears).toBe(7);
    expect(t.cliffYear).toBe(8);
    expect(t.years.map((y) => [y.year, y.art5c, y.onwards, y.breakdown.annualNet])).toEqual([
      [1, true, false, 24_628],
      [2, true, false, 24_628],
      [3, true, false, 24_628],
      [4, true, false, 24_628],
      [5, true, false, 24_628],
      [6, true, false, 24_628],
      [7, true, false, 24_628],
      [8, false, true, 21_336],
    ]);
    expect(t.annualNetChangeAtCliff).toBe(-3_292);
  });

  it('takes the duration from config', () => {
    const t = computeTimeline({ ...base, params: params({ 'art5c.durationYears': 3 }) });
    if (!t.ok) throw new Error('expected a timeline');
    expect(t.years).toHaveLength(4);
    expect(t.cliffYear).toBe(4);
  });

  it('reports missing parameters from both scenarios once each, and no numbers', () => {
    const t = computeTimeline({ ...base, params: realConfig });
    expect(t.ok).toBe(false);
    expect(t).not.toHaveProperty('years');
    if (t.ok) return;
    expect(t.missingParams).toContain('art5c.durationYears');
    expect(t.missingParams).toContain('art5c.exemptionRate');
    expect(t.missingParams.filter((p) => p === 'incomeTax.brackets')).toHaveLength(1);
  });

  it('reports a null duration even when everything else is set', () => {
    const t = computeTimeline({ ...base, params: params({ 'art5c.durationYears': null }) });
    expect(t).toEqual({ ok: false, missingParams: ['art5c.durationYears'], invalidParams: [] });
  });
});
