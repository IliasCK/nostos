import {
  ParamReader,
  amountsByChildren,
  boolean,
  brackets as bracketsCheck,
  bracketsByChildren,
  fraction,
  listOf,
  nonNegative,
  oneOf,
  positiveInt,
  rateOverrides,
} from './params';
import { scaleTax } from './scale';
import {
  AGE_BANDS,
  EXEMPTION_BASES,
  EXEMPTION_METHODS,
  EXEMPT_ITEMS,
  MAX_CHILDREN,
  PHASE_OUT_METHODS,
  REDUCTION_ORDERS,
  REDUCTION_PHASE_OUT_INCOMES,
  YOUTH_5C_INTERACTIONS,
  YOUTH_CHILDREN_INTERACTIONS,
  type AgeBand,
  type Bracket,
  type ExemptItem,
  type GreekNetBreakdown,
  type GreekNetInput,
  type GreekNetResult,
  type RateOverride,
} from './types';

type ChildrenKey = '0' | '1' | '2' | '3' | '4';
type Of<T extends readonly string[]> = T[number];

/** All parameter values one calculation needs, after validation. */
interface Resolved {
  scales: Record<ChildrenKey, Bracket[]>;
  youth?: { overrides: RateOverride[]; childrenInteraction?: Of<typeof YOUTH_CHILDREN_INTERACTIONS> };
  reduction: {
    base: Record<ChildrenKey, number>;
    threshold: number;
    rate: number;
    method: Of<typeof PHASE_OUT_METHODS>;
  };
  efka: { rate: number; monthlyCeiling: number };
  solidarity: Bracket[] | null;
  payments: number;
  art5c?: {
    rate: number;
    appliesTo: ExemptItem[];
    method: Of<typeof EXEMPTION_METHODS>;
    base?: Of<typeof EXEMPTION_BASES>;
    phaseOutIncome?: Of<typeof REDUCTION_PHASE_OUT_INCOMES>;
    order?: Of<typeof REDUCTION_ORDERS>;
    youthInteraction?: Of<typeof YOUTH_5C_INTERACTIONS>;
  };
}

/**
 * Greek net salary for one tax year (SPEC §6.3). Pure: everything comes from `params`.
 * If any parameter the calculation needs is null or malformed, returns
 * { ok: false, missingParams, invalidParams } and no numbers.
 */
export function computeGreekNet(input: GreekNetInput): GreekNetResult {
  validateInput(input);
  const reader = new ParamReader(input.params);
  const resolved = resolveParams(reader, input);
  if (reader.hasProblems || !resolved) return reader.problem();

  const youthEligible = input.ageBand !== '31plus';
  if (!input.apply5C) {
    return { ok: true, breakdown: calculate(input, resolved, false, youthEligible) };
  }
  const interaction = youthEligible ? resolved.art5c!.youthInteraction! : 'no_youth_relief_with_5c';
  if (interaction === 'stack') return { ok: true, breakdown: calculate(input, resolved, true, true) };
  if (interaction === 'no_youth_relief_with_5c') return { ok: true, breakdown: calculate(input, resolved, true, false) };
  // lower_of_two: whichever leaves more net pay.
  const with5C = calculate(input, resolved, true, false);
  const withYouth = calculate(input, resolved, false, true);
  return { ok: true, breakdown: withYouth.annualNet > with5C.annualNet ? withYouth : with5C };
}

function validateInput({ grossAnnual, children, ageBand }: GreekNetInput): void {
  if (!Number.isFinite(grossAnnual) || grossAnnual < 0) throw new RangeError('grossAnnual must be a number ≥ 0');
  if (!Number.isInteger(children) || children < 0 || children > MAX_CHILDREN) {
    throw new RangeError(`children must be an integer from 0 to ${MAX_CHILDREN}`);
  }
  if (!AGE_BANDS.includes(ageBand)) throw new RangeError(`ageBand must be one of ${AGE_BANDS.join(', ')}`);
}

/**
 * Reads exactly the parameters this input needs. Where a switch is itself
 * missing, every parameter it could require is read too, so the missing list
 * is as complete as possible.
 */
function resolveParams(r: ParamReader, input: GreekNetInput): Resolved | undefined {
  const scales = r.read<Record<ChildrenKey, Bracket[]>>('incomeTax.brackets', bracketsByChildren);
  const reductionBase = r.read<Record<ChildrenKey, number>>('taxReduction.baseAmountByChildren', amountsByChildren);
  const threshold = r.read<number>('taxReduction.phaseOutThreshold', nonNegative);
  const phaseOutRate = r.read<number>('taxReduction.phaseOutRate', nonNegative);
  const phaseOutMethod = r.read<Of<typeof PHASE_OUT_METHODS>>('taxReduction.phaseOutMethod', oneOf(PHASE_OUT_METHODS));
  const efkaRate = r.read<number>('efka.employeeRate', fraction);
  const ceiling = r.read<number>('efka.monthlyInsurableCeiling', nonNegative);
  const payments = r.read<number>('salaryPaymentsPerYear', positiveInt);
  const solidarityApplies = r.read<boolean>('solidarityContribution.appliesToEmploymentIncome', boolean);
  const solidarity =
    solidarityApplies === false ? null : r.read<Bracket[]>('solidarityContribution.brackets', bracketsCheck);

  let art5c: Resolved['art5c'];
  let youthNeeded = input.ageBand !== '31plus';
  if (input.apply5C) {
    const rate = r.read<number>('art5c.exemptionRate', fraction);
    const appliesTo = r.read<ExemptItem[]>('art5c.exemptionAppliesTo', listOf(EXEMPT_ITEMS));
    const method = r.read<Of<typeof EXEMPTION_METHODS>>('art5c.exemptionMethod', oneOf(EXEMPTION_METHODS));
    const covers = (item: ExemptItem) => appliesTo === undefined || appliesTo.includes(item);
    const coversTax = covers('incomeTax');
    const coversIncome = coversTax || covers('solidarityContribution');

    const base =
      method !== 'reduce_tax_by_share' && coversIncome
        ? r.read<Of<typeof EXEMPTION_BASES>>('art5c.exemptionBase', oneOf(EXEMPTION_BASES))
        : undefined;
    const phaseOutIncome =
      method !== 'reduce_tax_by_share' && coversTax
        ? r.read<Of<typeof REDUCTION_PHASE_OUT_INCOMES>>(
            'art5c.reductionPhaseOutIncome',
            oneOf(REDUCTION_PHASE_OUT_INCOMES),
          )
        : undefined;
    const order =
      method !== 'exempt_share_of_income' && coversTax
        ? r.read<Of<typeof REDUCTION_ORDERS>>('art5c.reductionOrder', oneOf(REDUCTION_ORDERS))
        : undefined;
    const youthInteraction = youthNeeded
      ? r.read<Of<typeof YOUTH_5C_INTERACTIONS>>('art5c.youthReliefInteraction', oneOf(YOUTH_5C_INTERACTIONS))
      : undefined;
    if (youthInteraction === 'no_youth_relief_with_5c') youthNeeded = false;

    if (rate !== undefined && appliesTo !== undefined && method !== undefined) {
      art5c = { rate, appliesTo, method, base, phaseOutIncome, order, youthInteraction };
    }
  }

  let youth: Resolved['youth'];
  if (youthNeeded) {
    const overrides = r.read<RateOverride[]>(`incomeTax.youthRelief.${input.ageBand}`, rateOverrides);
    const childrenInteraction =
      input.children > 0
        ? r.read<Of<typeof YOUTH_CHILDREN_INTERACTIONS>>(
            'incomeTax.youthChildrenInteraction',
            oneOf(YOUTH_CHILDREN_INTERACTIONS),
          )
        : undefined;
    if (overrides !== undefined) youth = { overrides, childrenInteraction };
  }

  if (r.hasProblems) return undefined;
  return {
    scales: scales!,
    youth,
    reduction: { base: reductionBase!, threshold: threshold!, rate: phaseOutRate!, method: phaseOutMethod! },
    efka: { rate: efkaRate!, monthlyCeiling: ceiling! },
    solidarity: solidarity ?? null,
    payments: payments!,
    art5c,
  };
}

function calculate(input: GreekNetInput, p: Resolved, use5C: boolean, useYouth: boolean): GreekNetBreakdown {
  const { grossAnnual: gross, children } = input;
  const key = String(children) as ChildrenKey;
  const c = use5C ? p.art5c! : undefined;
  const covers = (item: ExemptItem) => c !== undefined && c.appliesTo.includes(item);
  const keep = c ? 1 - c.rate : 1;

  // Employee EFKA: rate × earnings up to the ceiling on each of the equal payments.
  const insurable = Math.min(gross / p.payments, p.efka.monthlyCeiling) * p.payments;
  const contributions = p.efka.rate * insurable * (covers('socialContributions') ? keep : 1);
  const taxable = gross - contributions;

  const scale = (income: number) => scaleIncomeTax(income, children, p, useYouth);
  const reduction = (income: number) => reductionAmount(income, p.reduction.base[key], p.reduction);
  const solidarityOn = (income: number) => (p.solidarity ? scaleTax(income, p.solidarity) : 0);

  let exemptIncome = 0;
  let taxBase = taxable;
  let before: number;
  let finalTax: number;
  let relief = 0;
  let solidarity: number;

  if (c?.method === 'exempt_share_of_income') {
    const exempt = c.rate * (c.base === 'gross_employment_income' ? gross : taxable);
    if (covers('incomeTax') || covers('solidarityContribution')) exemptIncome = Math.min(exempt, taxable);
    if (covers('incomeTax')) taxBase = taxable - exemptIncome;
    before = scale(taxBase);
    const phaseOutIncome = covers('incomeTax') && c.phaseOutIncome === 'before_exemption' ? taxable : taxBase;
    finalTax = Math.max(0, before - reduction(phaseOutIncome));
    solidarity = solidarityOn(covers('solidarityContribution') ? taxable - exemptIncome : taxable);
  } else if (c?.method === 'reduce_tax_by_share' && covers('incomeTax')) {
    before = scale(taxable);
    if (c.order === 'reduce_then_exempt') {
      const afterReduction = Math.max(0, before - reduction(taxable));
      finalTax = afterReduction * keep;
      relief = afterReduction - finalTax;
    } else {
      const exemptTax = before * keep;
      relief = before - exemptTax;
      finalTax = Math.max(0, exemptTax - reduction(taxable));
    }
    solidarity = solidarityOn(taxable) * (covers('solidarityContribution') ? keep : 1);
  } else {
    before = scale(taxable);
    finalTax = Math.max(0, before - reduction(taxable));
    solidarity = solidarityOn(taxable) * (covers('solidarityContribution') ? keep : 1);
  }

  const usedReduction = before - relief - finalTax;
  const annualNet = gross - contributions - finalTax - solidarity;

  return {
    grossAnnual: round(gross),
    children,
    ageBand: input.ageBand,
    art5cApplied: use5C,
    youthReliefApplied: useYouth && p.youth !== undefined,
    employeeContributions: round(contributions),
    taxableIncome: round(taxable),
    art5cExemptIncome: round(exemptIncome),
    incomeTaxBase: round(taxBase),
    incomeTaxBeforeReduction: round(before),
    taxReduction: round(usedReduction),
    art5cTaxRelief: round(relief),
    finalIncomeTax: round(finalTax),
    otherLevies: { solidarityContribution: round(solidarity) },
    otherLeviesTotal: round(solidarity),
    annualNet: round(annualNet),
    monthlyNet: round(annualNet / 12),
    perPaymentNet: round(annualNet / p.payments),
    paymentsPerYear: p.payments,
  };
}

/** Tax on the scale for this number of children, with youth relief if it applies. */
function scaleIncomeTax(income: number, children: number, p: Resolved, useYouth: boolean): number {
  const scale = p.scales[String(children) as ChildrenKey];
  if (!useYouth || !p.youth) return scaleTax(income, scale);
  const { overrides, childrenInteraction } = p.youth;
  if (children === 0) return scaleTax(income, scale, overrides, 'replace');
  if (childrenInteraction === 'lowest_rate_per_range') return scaleTax(income, scale, overrides, 'min');
  // lower_total_tax
  return Math.min(scaleTax(income, scale), scaleTax(income, p.scales['0'], overrides, 'replace'));
}

function reductionAmount(income: number, base: number, r: Resolved['reduction']): number {
  const excess = Math.max(0, income - r.threshold);
  const lost = r.method === 'continuous' ? r.rate * excess : r.rate * 1000 * Math.floor(excess / 1000);
  return Math.max(0, base - lost);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
