export const AGE_BANDS = ['upTo25', '26to30', '31plus'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

/** Children 0..MAX_CHILDREN are supported (SPEC §6.1). */
export const MAX_CHILDREN = 4;

export interface Bracket {
  /** Top of the bracket in EUR per year; null = no upper limit (last bracket only). */
  upTo: number | null;
  /** Fraction, e.g. 0.22 for 22%. */
  rate: number;
}

export interface RateOverride {
  from: number;
  upTo: number | null;
  rate: number;
}

export const EXEMPT_ITEMS = ['incomeTax', 'solidarityContribution', 'socialContributions'] as const;
export type ExemptItem = (typeof EXEMPT_ITEMS)[number];

export const YOUTH_CHILDREN_INTERACTIONS = ['lowest_rate_per_range', 'lower_total_tax'] as const;
export const PHASE_OUT_METHODS = ['continuous', 'per_full_1000'] as const;
export const EXEMPTION_METHODS = ['exempt_share_of_income', 'reduce_tax_by_share'] as const;
export const EXEMPTION_BASES = ['gross_employment_income', 'net_of_employee_contributions'] as const;
export const REDUCTION_PHASE_OUT_INCOMES = ['after_exemption', 'before_exemption'] as const;
export const REDUCTION_ORDERS = ['reduce_then_exempt', 'exempt_then_reduce'] as const;
export const YOUTH_5C_INTERACTIONS = ['stack', 'no_youth_relief_with_5c', 'lower_of_two'] as const;

export interface GreekNetInput {
  /** Gross annual salary in EUR (all payments, incl. bonuses). */
  grossAnnual: number;
  /** Dependent children, integer 0..MAX_CHILDREN. */
  children: number;
  ageBand: AgeBand;
  /** Whether to apply the Article 5C exemption. */
  apply5C: boolean;
  /** The tax config (src/config/greece-tax-2026.json shape). Validated at runtime. */
  params: unknown;
}

export interface GreekNetBreakdown {
  grossAnnual: number;
  children: number;
  ageBand: AgeBand;
  /** Whether 5C was actually applied (can differ from the input under youthReliefInteraction "lower_of_two"). */
  art5cApplied: boolean;
  youthReliefApplied: boolean;
  employeeContributions: number;
  /** Gross minus employee contributions. */
  taxableIncome: number;
  /** Income exempted under 5C (exemptionMethod "exempt_share_of_income"), otherwise 0. */
  art5cExemptIncome: number;
  /** Income the tax scale was applied to. */
  incomeTaxBase: number;
  incomeTaxBeforeReduction: number;
  /** Tax reduction actually used (never more than the tax it reduces). */
  taxReduction: number;
  /** Tax removed by 5C under exemptionMethod "reduce_tax_by_share", otherwise 0. */
  art5cTaxRelief: number;
  finalIncomeTax: number;
  otherLevies: { solidarityContribution: number };
  otherLeviesTotal: number;
  annualNet: number;
  /** annualNet / 12 */
  monthlyNet: number;
  /** annualNet / paymentsPerYear */
  perPaymentNet: number;
  paymentsPerYear: number;
}

export interface InvalidParam {
  path: string;
  reason: string;
}

/** Parameters the calculation needed but couldn't use. No numbers are returned in this case. */
export interface ParamsProblem {
  ok: false;
  /** Dotted config paths whose value is null or absent. */
  missingParams: string[];
  /** Dotted config paths whose value has the wrong shape. */
  invalidParams: InvalidParam[];
}

export type GreekNetResult = { ok: true; breakdown: GreekNetBreakdown } | ParamsProblem;
