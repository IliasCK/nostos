import { ageBandForYear, configTaxYear } from './age';
import { computeGreekNet } from './computeGreekNet';
import { ParamReader, positiveInt } from './params';
import type { AgeBand, GreekNetBreakdown, InvalidParam, ParamsProblem } from './types';

export interface TimelineInput {
  grossAnnual: number;
  children: number;
  birthYear: number;
  params: unknown;
}

export interface TimelineYear {
  /** 1-based year after the move. */
  year: number;
  /** Calendar tax year (year 1 = config._meta.taxYear; the same rules are applied to every year). */
  taxYear: number;
  /** True for the last entry: this year and every year after it. */
  onwards: boolean;
  ageBand: AgeBand;
  /** Net pay with the 5C exemption; null from the cliff year on. */
  with5C: GreekNetBreakdown | null;
  without5C: GreekNetBreakdown;
}

export interface Timeline {
  ok: true;
  durationYears: number;
  /** First year without 5C (durationYears + 1). */
  cliffYear: number;
  /** Years 1..durationYears, then cliffYear (onwards). */
  years: TimelineYear[];
}

export type TimelineResult = Timeline | ParamsProblem;

/**
 * Net pay per year after the move, with and without 5C, for art5c.durationYears
 * years plus the cliff year. The age band is derived per year from the birth
 * year, so someone who is 24 at the move leaves the under-25 band along the way.
 */
export function computeTimeline(input: TimelineInput): TimelineResult {
  const reader = new ParamReader(input.params);
  const duration = reader.read<number>('art5c.durationYears', positiveInt);
  const firstYear = configTaxYear(input.params);
  const problems: ParamsProblem[] = reader.hasProblems ? [reader.problem()] : [];

  // Without a duration we still compute year 1, so the missing list is complete.
  const count = duration === undefined ? 1 : duration + 1;
  const years: TimelineYear[] = [];
  for (let year = 1; year <= count; year++) {
    const taxYear = firstYear + year - 1;
    const band = ageBandForYear(input.birthYear, taxYear, input.params);
    if (!band.ok) {
      problems.push(band);
      continue;
    }
    const base = { grossAnnual: input.grossAnnual, children: input.children, ageBand: band.band, params: input.params };
    const onwards = duration !== undefined && year === duration + 1;
    const without5C = computeGreekNet({ ...base, apply5C: false });
    const with5C = onwards ? null : computeGreekNet({ ...base, apply5C: true });
    if (!without5C.ok) problems.push(without5C);
    if (with5C && !with5C.ok) problems.push(with5C);
    if (without5C.ok && (with5C === null || with5C.ok)) {
      years.push({
        year,
        taxYear,
        onwards,
        ageBand: band.band,
        with5C: with5C?.ok ? with5C.breakdown : null,
        without5C: without5C.breakdown,
      });
    }
  }

  if (problems.length > 0 || duration === undefined) return mergeProblems(problems);
  return { ok: true, durationYears: duration, cliffYear: duration + 1, years };
}

export function mergeProblems(problems: ParamsProblem[]): ParamsProblem {
  const invalid: InvalidParam[] = [];
  for (const p of problems.flatMap((x) => x.invalidParams)) {
    if (!invalid.some((q) => q.path === p.path)) invalid.push(p);
  }
  return { ok: false, missingParams: [...new Set(problems.flatMap((p) => p.missingParams))], invalidParams: invalid };
}
