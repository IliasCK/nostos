import { computeGreekNet } from './computeGreekNet';
import { ParamReader, positiveInt } from './params';
import type { AgeBand, GreekNetBreakdown, ParamsProblem } from './types';

export interface TimelineInput {
  grossAnnual: number;
  children: number;
  /** Held constant across all years (limitation: someone aged 24 now moves band during the period). */
  ageBand: AgeBand;
  params: unknown;
}

export interface TimelineYear {
  /** 1-based tax year after the move. */
  year: number;
  /** True for the last entry: this year and every year after it. */
  onwards: boolean;
  art5c: boolean;
  breakdown: GreekNetBreakdown;
}

export interface Timeline {
  ok: true;
  /** art5c.durationYears */
  durationYears: number;
  /** First year without 5C (durationYears + 1). */
  cliffYear: number;
  /** Years 1..durationYears with 5C, then cliffYear (onwards) without. */
  years: TimelineYear[];
  /** Change in annual net pay at the cliff (negative = drop). */
  annualNetChangeAtCliff: number;
}

export type TimelineResult = Timeline | ParamsProblem;

/** Net pay per year after moving: with 5C for art5c.durationYears years, then without. */
export function computeTimeline(input: TimelineInput): TimelineResult {
  const reader = new ParamReader(input.params);
  const duration = reader.read<number>('art5c.durationYears', positiveInt);
  const with5C = computeGreekNet({ ...input, apply5C: true });
  const without5C = computeGreekNet({ ...input, apply5C: false });

  if (duration === undefined || !with5C.ok || !without5C.ok) {
    const problems = [reader.problem(), with5C, without5C].filter((r): r is ParamsProblem => !r.ok);
    return {
      ok: false,
      missingParams: [...new Set(problems.flatMap((p) => p.missingParams))],
      invalidParams: problems
        .flatMap((p) => p.invalidParams)
        .filter((p, i, all) => all.findIndex((q) => q.path === p.path) === i),
    };
  }

  const years: TimelineYear[] = [];
  for (let year = 1; year <= duration; year++) {
    years.push({ year, onwards: false, art5c: with5C.breakdown.art5cApplied, breakdown: with5C.breakdown });
  }
  years.push({ year: duration + 1, onwards: true, art5c: false, breakdown: without5C.breakdown });

  return {
    ok: true,
    durationYears: duration,
    cliffYear: duration + 1,
    years,
    annualNetChangeAtCliff: Math.round((without5C.breakdown.annualNet - with5C.breakdown.annualNet) * 100) / 100,
  };
}
