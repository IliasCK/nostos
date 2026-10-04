import { ParamReader, oneOf } from './params';
import type { AgeBand } from './types';

export const YOUTH_AGE_RULES = ['age_reached_in_tax_year', 'age_on_1_january'] as const;
export type YouthAgeRule = (typeof YOUTH_AGE_RULES)[number];

/** Age used for a tax year under a given rule (birth year only; 1 January birthdays are not distinguished). */
export function ageInTaxYear(birthYear: number, taxYear: number, rule: YouthAgeRule): number {
  const reached = taxYear - birthYear;
  return rule === 'age_reached_in_tax_year' ? reached : reached - 1;
}

/** Age bands of SPEC §6.1: up to 25, 26–30, 31 or over. */
export function bandForAge(age: number): AgeBand {
  if (age <= 25) return 'upTo25';
  if (age <= 30) return '26to30';
  return '31plus';
}

export type BandResult = { ok: true; band: AgeBand } | { ok: false; missingParams: string[]; invalidParams: { path: string; reason: string }[] };

/**
 * Age band for a tax year. incomeTax.youthAgeRule is read only when the two
 * possible rules would give different bands; if it is then null, the band is
 * unknown and the parameter is reported as missing.
 */
export function ageBandForYear(birthYear: number, taxYear: number, params: unknown): BandResult {
  const byReached = bandForAge(ageInTaxYear(birthYear, taxYear, 'age_reached_in_tax_year'));
  const byJanuary = bandForAge(ageInTaxYear(birthYear, taxYear, 'age_on_1_january'));
  if (byReached === byJanuary) return { ok: true, band: byReached };
  const reader = new ParamReader(params);
  const rule = reader.read<YouthAgeRule>('incomeTax.youthAgeRule', oneOf(YOUTH_AGE_RULES));
  if (rule === undefined) return reader.problem();
  return { ok: true, band: rule === 'age_reached_in_tax_year' ? byReached : byJanuary };
}

/** The tax year the config describes (config._meta.taxYear); year 1 of the timeline. */
export function configTaxYear(params: unknown): number {
  const year = (params as { _meta?: { taxYear?: unknown } } | null)?._meta?.taxYear;
  if (!Number.isInteger(year)) throw new Error('config._meta.taxYear must be an integer');
  return year as number;
}
