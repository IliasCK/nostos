// SYNTHETIC parameters only (see tests/fixtures/synthetic-params.json): 2026 is
// year 1, 5C lasts 7 years, youth relief up to 25 = 0% to €20k, 26–30 = 12% in
// €10–20k; 5C taxpayers get no youth relief (youthReliefInteraction).
import { describe, expect, it } from 'vitest';
import realConfig from '../../src/config/greece-tax-2026.json';
import { ageBandForYear, ageInTaxYear, bandForAge, computeTimeline } from '../../src/lib/tax';
import { params } from './helpers';

const base = { grossAnnual: 28_000, children: 0 };

describe('age bands', () => {
  it.each([
    [25, 'upTo25'],
    [26, '26to30'],
    [30, '26to30'],
    [31, '31plus'],
  ] as const)('age %d → %s', (age, band) => expect(bandForAge(age)).toBe(band));

  it('counts age by either rule', () => {
    expect(ageInTaxYear(2002, 2026, 'age_reached_in_tax_year')).toBe(24);
    expect(ageInTaxYear(2002, 2026, 'age_on_1_january')).toBe(23);
  });

  it('needs incomeTax.youthAgeRule only when the two rules disagree', () => {
    const noRule = params({ 'incomeTax.youthAgeRule': null });
    expect(ageBandForYear(1980, 2026, noRule)).toEqual({ ok: true, band: '31plus' });
    expect(ageBandForYear(2002, 2026, noRule)).toEqual({ ok: true, band: 'upTo25' }); // 24 or 23
    expect(ageBandForYear(2001, 2026, noRule)).toEqual({ ok: true, band: 'upTo25' }); // 25 or 24
    // 26 (age reached) or 25 (on 1 January): the rule decides the band
    expect(ageBandForYear(2000, 2026, noRule)).toEqual({ ok: false, missingParams: ['incomeTax.youthAgeRule'], invalidParams: [] });
    expect(ageBandForYear(2000, 2026, params())).toEqual({ ok: true, band: '26to30' });
  });
});

describe('computeTimeline', () => {
  it('shows years 1–7 with 5C, then the cliff from year 8', () => {
    const t = computeTimeline({ ...base, birthYear: 1980, params: params() });
    if (!t.ok) throw new Error(JSON.stringify(t));
    expect(t.durationYears).toBe(7);
    expect(t.cliffYear).toBe(8);
    expect(t.years.map((y) => [y.year, y.taxYear, y.onwards, y.with5C?.annualNet ?? null, y.without5C.annualNet])).toEqual([
      [1, 2026, false, 24_628, 21_336],
      [2, 2027, false, 24_628, 21_336],
      [3, 2028, false, 24_628, 21_336],
      [4, 2029, false, 24_628, 21_336],
      [5, 2030, false, 24_628, 21_336],
      [6, 2031, false, 24_628, 21_336],
      [7, 2032, false, 24_628, 21_336],
      [8, 2033, true, null, 21_336],
    ]);
  });

  it('derives the age band per year: someone aged 24 at the move ages out of the youth bands', () => {
    const t = computeTimeline({ ...base, birthYear: 2002, params: params() });
    if (!t.ok) throw new Error(JSON.stringify(t));
    // age reached in the tax year: 24, 25 | 26…30 | 31
    expect(t.years.map((y) => y.ageBand)).toEqual([
      'upTo25', 'upTo25', '26to30', '26to30', '26to30', '26to30', '26to30', '31plus',
    ]);
    expect(t.years.map((y) => y.without5C.annualNet)).toEqual([
      24_336, 24_336, 22_136, 22_136, 22_136, 22_136, 22_136, 21_336,
    ]);
  });

  it('follows the age-on-1-January rule when that is configured', () => {
    const t = computeTimeline({ ...base, birthYear: 2002, params: params({ 'incomeTax.youthAgeRule': 'age_on_1_january' }) });
    if (!t.ok) throw new Error(JSON.stringify(t));
    // age on 1 January: 23, 24, 25 | 26…30
    expect(t.years.map((y) => y.ageBand)).toEqual([
      'upTo25', 'upTo25', 'upTo25', '26to30', '26to30', '26to30', '26to30', '26to30',
    ]);
  });

  it('reports youthAgeRule as missing when it decides a band', () => {
    const t = computeTimeline({ ...base, birthYear: 2002, params: params({ 'incomeTax.youthAgeRule': null }) });
    expect(t).toEqual({ ok: false, missingParams: ['incomeTax.youthAgeRule'], invalidParams: [] });
  });

  it('takes the duration from config', () => {
    const t = computeTimeline({ ...base, birthYear: 1980, params: params({ 'art5c.durationYears': 3 }) });
    if (!t.ok) throw new Error('expected a timeline');
    expect(t.years).toHaveLength(4);
    expect(t.cliffYear).toBe(4);
  });

  it('reports missing parameters once each, and no numbers', () => {
    const t = computeTimeline({ ...base, birthYear: 1980, params: realConfig });
    expect(t.ok).toBe(false);
    expect(t).not.toHaveProperty('years');
    if (t.ok) return;
    expect(t.missingParams).toContain('art5c.durationYears');
    expect(t.missingParams).toContain('art5c.exemptionRate');
    expect(t.missingParams.filter((p) => p === 'incomeTax.brackets')).toHaveLength(1);
  });

  it('reports a null duration even when everything else is set', () => {
    const t = computeTimeline({ ...base, birthYear: 1980, params: params({ 'art5c.durationYears': null }) });
    expect(t).toEqual({ ok: false, missingParams: ['art5c.durationYears'], invalidParams: [] });
  });
});
