// Unit tests against SYNTHETIC parameters (tests/fixtures/synthetic-params.json).
// The numbers are made up so results can be worked out by hand; they say nothing
// about real Greek tax. Real-world checks live in oracle.test.ts.
import { describe, expect, it } from 'vitest';
import realConfig from '../../src/config/greece-tax-2026.json';
import { computeGreekNet, type GreekNetBreakdown, type GreekNetInput } from '../../src/lib/tax';
import { scaleTax } from '../../src/lib/tax/scale';
import { listParams } from '../../src/lib/params/verification';
import synthetic from '../fixtures/synthetic-params.json';
import { params } from './helpers';

function net(input: Partial<GreekNetInput> & { overrides?: Record<string, unknown> }): GreekNetBreakdown {
  const { overrides, ...rest } = input;
  const result = computeGreekNet({
    grossAnnual: 28_000,
    children: 0,
    ageBand: '31plus',
    apply5C: false,
    params: params(overrides),
    ...rest,
  });
  if (!result.ok) throw new Error(`unexpected params problem: ${JSON.stringify(result)}`);
  return result.breakdown;
}

const NO_EFKA = { 'efka.employeeRate': 0 };

describe('synthetic fixture', () => {
  it('is labelled as synthetic', () => {
    expect(synthetic._note).toMatch(/SYNTHETIC/);
    expect(synthetic._note).toMatch(/NOT Greek tax law/);
  });

  it('has exactly the same parameters as the real config', () => {
    expect(listParams(synthetic).map((p) => p.path)).toEqual(listParams(realConfig).map((p) => p.path));
  });
});

describe('scaleTax: bracket boundaries', () => {
  const scale = synthetic.incomeTax.brackets.value['0'];

  it.each([
    [0, 0],
    [-5, 0],
    [10_000, 1_000],
    [10_000.01, 1_000.002],
    [20_000, 3_000],
    [30_000, 6_000],
    [40_000, 10_000],
  ])('income %d → tax %d', (income, tax) => {
    expect(scaleTax(income, scale)).toBeCloseTo(tax, 6);
  });

  it('applies range overrides ("replace" and "min")', () => {
    const overrides = [{ from: 10_000, upTo: 20_000, rate: 0.12 }];
    expect(scaleTax(25_000, scale, overrides, 'replace')).toBeCloseTo(1_000 + 1_200 + 1_500, 6);
    const childScale = synthetic.incomeTax.brackets.value['3']; // 5% in the second bracket
    expect(scaleTax(25_000, childScale, overrides, 'min')).toBeCloseTo(1_000 + 500 + 750, 6);
  });
});

describe('computeGreekNet: base case (no 5C)', () => {
  it('produces the full breakdown', () => {
    const b = net({ grossAnnual: 28_000 });
    expect(b).toMatchObject({
      employeeContributions: 2_800,
      taxableIncome: 25_200,
      incomeTaxBase: 25_200,
      incomeTaxBeforeReduction: 4_560, // 1,000 + 2,000 + 5,200 × 30%
      taxReduction: 696, // 1,000 − 2% × 15,200
      finalIncomeTax: 3_864,
      otherLeviesTotal: 0,
      annualNet: 21_336,
      monthlyNet: 1_778,
      perPaymentNet: 1_524,
      paymentsPerYear: 14,
      art5cApplied: false,
      youthReliefApplied: false,
    });
  });
});

describe('EFKA monthly insurable ceiling', () => {
  it.each([
    [56_000, 5_600], // 4,000 per payment, below the 5,000 ceiling
    [70_000, 7_000], // exactly at the ceiling
    [84_000, 7_000], // 6,000 per payment, capped at 5,000
  ])('gross %d → contributions %d', (grossAnnual, contributions) => {
    expect(net({ grossAnnual }).employeeContributions).toBe(contributions);
  });
});

describe('tax reduction and phase-out', () => {
  it('full reduction at the threshold, capped at the tax due', () => {
    expect(net({ grossAnnual: 10_000, overrides: NO_EFKA })).toMatchObject({ taxReduction: 1_000, finalIncomeTax: 0 });
    expect(net({ grossAnnual: 5_000, overrides: NO_EFKA })).toMatchObject({
      incomeTaxBeforeReduction: 500,
      taxReduction: 500,
      finalIncomeTax: 0,
    });
  });

  it('shrinks continuously above the threshold', () => {
    expect(net({ grossAnnual: 20_000, overrides: NO_EFKA }).taxReduction).toBe(800);
    expect(net({ grossAnnual: 20_500, overrides: NO_EFKA }).taxReduction).toBe(790);
  });

  it('shrinks per full 1,000 with phaseOutMethod per_full_1000', () => {
    const overrides = { ...NO_EFKA, 'taxReduction.phaseOutMethod': 'per_full_1000' };
    expect(net({ grossAnnual: 20_500, overrides }).taxReduction).toBe(800);
    expect(net({ grossAnnual: 21_000, overrides }).taxReduction).toBe(780);
  });

  it('reaches zero and never goes negative', () => {
    expect(net({ grossAnnual: 60_000, overrides: NO_EFKA })).toMatchObject({ taxReduction: 0, finalIncomeTax: 18_000 });
    expect(net({ grossAnnual: 90_000, overrides: NO_EFKA }).taxReduction).toBe(0);
  });
});

describe('children', () => {
  it('uses the per-children scale and reduction', () => {
    expect(net({ grossAnnual: 20_000, children: 2, overrides: NO_EFKA })).toMatchObject({
      incomeTaxBeforeReduction: 2_000,
      taxReduction: 1_000, // 1,200 − 200
      finalIncomeTax: 1_000,
    });
    expect(net({ grossAnnual: 20_000, children: 4, overrides: NO_EFKA })).toMatchObject({
      incomeTaxBeforeReduction: 1_000,
      finalIncomeTax: 0,
    });
  });

  it('rejects children outside 0–4', () => {
    expect(() => net({ children: 5 })).toThrow(RangeError);
    expect(() => net({ children: 1.5 })).toThrow(RangeError);
    expect(() => net({ grossAnnual: -1 })).toThrow(RangeError);
  });
});

describe('solidarity contribution', () => {
  const ON = {
    'solidarityContribution.appliesToEmploymentIncome': true,
    'solidarityContribution.brackets': [
      { upTo: 20_000, rate: 0 },
      { upTo: null, rate: 0.05 },
    ],
  };

  it('is zero when it does not apply, even with an empty scale', () => {
    expect(net({}).otherLevies.solidarityContribution).toBe(0);
  });

  it('is charged on taxable income when it applies', () => {
    expect(net({ overrides: ON })).toMatchObject({ otherLevies: { solidarityContribution: 260 }, annualNet: 21_076 });
  });

  it('is reduced by 5C when the exemption covers it', () => {
    const covers = { ...ON, 'art5c.exemptionAppliesTo': ['incomeTax', 'solidarityContribution'] };
    expect(net({ apply5C: true, overrides: covers }).otherLeviesTotal).toBe(0); // base 12,600
    expect(
      net({ apply5C: true, overrides: { ...covers, 'art5c.exemptionMethod': 'reduce_tax_by_share' } }).otherLeviesTotal,
    ).toBe(130);
    expect(net({ apply5C: true, overrides: ON }).otherLeviesTotal).toBe(260); // not covered
  });
});

describe('Article 5C', () => {
  it('exempt_share_of_income, net base, phase-out after exemption', () => {
    expect(net({ apply5C: true })).toMatchObject({
      art5cApplied: true,
      art5cExemptIncome: 12_600,
      incomeTaxBase: 12_600,
      incomeTaxBeforeReduction: 1_520,
      taxReduction: 948,
      finalIncomeTax: 572,
      art5cTaxRelief: 0,
      annualNet: 24_628,
    });
  });

  it('phase-out measured before the exemption', () => {
    const b = net({ apply5C: true, overrides: { 'art5c.reductionPhaseOutIncome': 'before_exemption' } });
    expect(b).toMatchObject({ taxReduction: 696, finalIncomeTax: 824 });
  });

  it('exempt share taken of gross income', () => {
    const b = net({ apply5C: true, overrides: { 'art5c.exemptionBase': 'gross_employment_income' } });
    expect(b).toMatchObject({ art5cExemptIncome: 14_000, incomeTaxBase: 11_200, finalIncomeTax: 264 });
  });

  it('reduce_tax_by_share, reduction first', () => {
    const b = net({ apply5C: true, overrides: { 'art5c.exemptionMethod': 'reduce_tax_by_share' } });
    expect(b).toMatchObject({
      art5cExemptIncome: 0,
      incomeTaxBase: 25_200,
      incomeTaxBeforeReduction: 4_560,
      taxReduction: 696,
      art5cTaxRelief: 1_932,
      finalIncomeTax: 1_932,
    });
  });

  it('reduce_tax_by_share, exemption first', () => {
    const b = net({
      apply5C: true,
      overrides: { 'art5c.exemptionMethod': 'reduce_tax_by_share', 'art5c.reductionOrder': 'exempt_then_reduce' },
    });
    expect(b).toMatchObject({ art5cTaxRelief: 2_280, taxReduction: 696, finalIncomeTax: 1_584 });
  });

  it('can cover social contributions', () => {
    const b = net({ apply5C: true, overrides: { 'art5c.exemptionAppliesTo': ['incomeTax', 'socialContributions'] } });
    expect(b).toMatchObject({ employeeContributions: 1_400, taxableIncome: 26_600, finalIncomeTax: 726, annualNet: 25_874 });
  });

  it('changes nothing when it covers nothing', () => {
    expect(net({ apply5C: true, overrides: { 'art5c.exemptionAppliesTo': [] } }).finalIncomeTax).toBe(3_864);
  });

  it('off gives the base result', () => {
    expect(net({ apply5C: false }).finalIncomeTax).toBe(3_864);
  });
});

describe('youth relief', () => {
  it('up to 25: overrides on the 0-children scale', () => {
    expect(net({ ageBand: 'upTo25' })).toMatchObject({
      incomeTaxBeforeReduction: 1_560,
      finalIncomeTax: 864,
      youthReliefApplied: true,
    });
  });

  it('26 to 30', () => {
    expect(net({ ageBand: '26to30' })).toMatchObject({ incomeTaxBeforeReduction: 3_760, finalIncomeTax: 3_064 });
  });

  it('31 or over ignores youth relief, even when it is unset', () => {
    const b = net({ overrides: { 'incomeTax.youthRelief.upTo25': null, 'incomeTax.youthRelief.26to30': null } });
    expect(b).toMatchObject({ finalIncomeTax: 3_864, youthReliefApplied: false });
  });

  it('with children: lowest rate per range', () => {
    expect(net({ ageBand: '26to30', children: 1 })).toMatchObject({ incomeTaxBeforeReduction: 3_500, finalIncomeTax: 2_704 });
  });

  it('with children: lower total tax', () => {
    const b = net({
      ageBand: '26to30',
      children: 1,
      overrides: { 'incomeTax.youthChildrenInteraction': 'lower_total_tax' },
    });
    expect(b).toMatchObject({ incomeTaxBeforeReduction: 3_760, finalIncomeTax: 2_964 });
  });

  describe('with 5C', () => {
    it('no_youth_relief_with_5c', () => {
      expect(net({ ageBand: 'upTo25', apply5C: true })).toMatchObject({
        finalIncomeTax: 572,
        art5cApplied: true,
        youthReliefApplied: false,
      });
    });

    it('stack', () => {
      const b = net({ ageBand: 'upTo25', apply5C: true, overrides: { 'art5c.youthReliefInteraction': 'stack' } });
      expect(b).toMatchObject({ finalIncomeTax: 0, annualNet: 25_200, art5cApplied: true, youthReliefApplied: true });
    });

    it('lower_of_two picks 5C when it leaves more net pay', () => {
      const b = net({ ageBand: 'upTo25', apply5C: true, overrides: { 'art5c.youthReliefInteraction': 'lower_of_two' } });
      expect(b).toMatchObject({ finalIncomeTax: 572, art5cApplied: true, youthReliefApplied: false });
    });

    it('lower_of_two picks youth relief when it leaves more net pay', () => {
      const b = net({
        ageBand: 'upTo25',
        apply5C: true,
        overrides: { 'art5c.youthReliefInteraction': 'lower_of_two', 'art5c.exemptionRate': 0.1 },
      });
      expect(b).toMatchObject({ finalIncomeTax: 864, art5cApplied: false, youthReliefApplied: true });
    });
  });
});

describe('missing and invalid parameters', () => {
  const run = (input: Partial<GreekNetInput>) =>
    computeGreekNet({ grossAnnual: 30_000, children: 0, ageBand: '31plus', apply5C: false, params: realConfig, ...input });

  it('returns the missing parameter names and no numbers for the real (all-null) config', () => {
    const result = run({});
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty('breakdown');
    if (result.ok) return;
    expect(result.missingParams).toEqual([
      'incomeTax.brackets',
      'taxReduction.baseAmountByChildren',
      'taxReduction.phaseOutThreshold',
      'taxReduction.phaseOutRate',
      'taxReduction.phaseOutMethod',
      'efka.employeeRate',
      'efka.monthlyInsurableCeiling',
      'salaryPaymentsPerYear',
      'solidarityContribution.appliesToEmploymentIncome',
      'solidarityContribution.brackets',
    ]);
  });

  it('lists 5C and youth parameters only when they are needed', () => {
    const result = run({ apply5C: true, ageBand: 'upTo25', children: 2 });
    if (result.ok) throw new Error('expected a problem');
    expect(result.missingParams).toEqual(
      expect.arrayContaining([
        'art5c.exemptionRate',
        'art5c.exemptionAppliesTo',
        'art5c.exemptionMethod',
        // the method is unknown, so every parameter it could need is listed
        'art5c.exemptionBase',
        'art5c.reductionPhaseOutIncome',
        'art5c.reductionOrder',
        'art5c.youthReliefInteraction',
        'incomeTax.youthRelief.upTo25',
        'incomeTax.youthChildrenInteraction',
      ]),
    );
    expect(result.missingParams).not.toContain('incomeTax.youthRelief.26to30');
    expect(result.missingParams).not.toContain('art5c.durationYears');
  });

  it('does not require switches that do not apply', () => {
    const b = net({
      apply5C: true,
      overrides: { 'art5c.exemptionMethod': 'reduce_tax_by_share', 'art5c.exemptionBase': null, 'art5c.reductionPhaseOutIncome': null },
    });
    expect(b.finalIncomeTax).toBe(1_932);
    expect(net({ overrides: { 'solidarityContribution.brackets': null } }).otherLeviesTotal).toBe(0);
  });

  it('a single null parameter blocks the result', () => {
    const result = computeGreekNet({
      grossAnnual: 30_000,
      children: 0,
      ageBand: '31plus',
      apply5C: false,
      params: params({ 'efka.monthlyInsurableCeiling': null }),
    });
    expect(result).toEqual({ ok: false, missingParams: ['efka.monthlyInsurableCeiling'], invalidParams: [] });
  });

  it.each([
    ['incomeTax.brackets', { '0': [{ upTo: null, rate: 0.1 }] }, /missing key "1"/],
    ['incomeTax.brackets', { 0: [], 1: [], 2: [], 3: [], 4: [] }, /non-empty/],
    ['efka.employeeRate', 13.87, /fraction/],
    ['salaryPaymentsPerYear', 14.5, /positive integer/],
    ['taxReduction.phaseOutMethod', 'stepwise', /one of/],
  ])('reports %s as invalid when its value is %j', (path, value, reason) => {
    const result = computeGreekNet({
      grossAnnual: 30_000,
      children: 0,
      ageBand: '31plus',
      apply5C: false,
      params: params({ [path]: value }),
    });
    if (result.ok) throw new Error('expected a problem');
    expect(result.missingParams).toEqual([]);
    expect(result.invalidParams).toEqual([{ path, reason: expect.stringMatching(reason) }]);
  });
});
