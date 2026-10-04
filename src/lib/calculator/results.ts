// Builds everything the results screen shows from inputs, quiz outcome, tax
// config and data. Pure: no UI, no fetching. Each part reports its own
// availability so one missing dataset never blanks the whole page.
import { comparePurchasingPower, describeChange, type ChangeDirection, type CompareResult } from '../compare';
import {
  currencyOf,
  fxRate,
  priceLevel,
  rentEstimate,
  type FxFile,
  type Lookup,
  type PriceLevelsFile,
  type RentEstimate,
  type RentFile,
} from '../data';
import type { Outcome } from '../eligibility/types';
import { ageBandForYear, computeGreekNet, computeTimeline, configTaxYear, type GreekNetResult, type TimelineResult } from '../tax';
import type { CalculatorInputs } from './inputs';

/** SPEC §5.3 */
export type DisplayMode = 'with5C_primary' | 'side_by_side' | 'without5C_only';

export function displayModeFor(outcome: Outcome): DisplayMode {
  if (outcome === 'likely_eligible') return 'with5C_primary';
  if (outcome === 'borderline') return 'side_by_side';
  return 'without5C_only';
}

export interface CalculatorData {
  fx: Lookup<FxFile>;
  priceLevels: Lookup<PriceLevelsFile>;
  rent: Lookup<RentFile>;
}

export interface Comparison {
  /** Greek net pay used, EUR per month (12-month basis). */
  greekNetMonthly: number;
  result: CompareResult;
}

export type Headline =
  | {
      kind: 'with5C';
      durationYears: number;
      cliffYear: number;
      during: { direction: ChangeDirection; pct: number };
      after: { direction: ChangeDirection; pct: number };
      /** True when net pay differs between years 1..duration (age bands), so "during" is an average. */
      averaged: boolean;
    }
  | { kind: 'without5C'; change: { direction: ChangeDirection; pct: number } };

export interface Results {
  mode: DisplayMode;
  firstTaxYear: number;
  /** Year-1 net pay without 5C. */
  without5C: GreekNetResult;
  /** Per-year figures with and without 5C (needs the 5C parameters). */
  timeline: TimelineResult;
  rent: Lookup<RentEstimate>;
  /** Comparison inputs that are available, or the missing data items. */
  comparisonData: Lookup<{ fxPerEur: number; pliGreece: number; pliOrigin: number; rent: RentEstimate }>;
  /** Without 5C, year 1. */
  comparisonWithout5C: Comparison | null;
  /** With 5C, average monthly net over years 1..duration. */
  comparisonWith5C: Comparison | null;
  /** From the cliff year on (without 5C, that year's age band). */
  comparisonCliff: Comparison | null;
  headline: Headline | null;
}

export function buildResults(
  inputs: CalculatorInputs,
  outcome: Outcome,
  params: unknown,
  data: CalculatorData,
): Results {
  const mode = displayModeFor(outcome);
  const firstTaxYear = configTaxYear(params);
  const net = { grossAnnual: inputs.grossAnnualEur, children: inputs.children, params };

  const band = ageBandForYear(inputs.birthYear, firstTaxYear, params);
  const without5C: GreekNetResult = band.ok ? computeGreekNet({ ...net, ageBand: band.band, apply5C: false }) : { ok: false, ...problemOf(band) };
  const timeline = computeTimeline({ ...net, birthYear: inputs.birthYear });

  const rent = rentEstimate(data.rent, inputs.city, inputs.size);
  const fx = fxRate(data.fx, currencyOf(inputs.origin));
  const pliGreece = priceLevel(data.priceLevels, 'GR');
  const pliOrigin = priceLevel(data.priceLevels, inputs.origin);
  const missing = [rent, fx, pliGreece, pliOrigin].flatMap((l) => (l.status === 'unavailable' ? l.missing : []));
  const comparisonData: Results['comparisonData'] =
    missing.length > 0
      ? { status: 'unavailable', missing: [...new Set(missing)] }
      : {
          status: 'ok',
          value: {
            fxPerEur: (fx as { value: number }).value,
            pliGreece: (pliGreece as { value: number }).value,
            pliOrigin: (pliOrigin as { value: number }).value,
            rent: (rent as { value: RentEstimate }).value,
          },
        };

  const compare = (greekNetMonthly: number): Comparison | null => {
    if (comparisonData.status !== 'ok') return null;
    const d = comparisonData.value;
    return {
      greekNetMonthly,
      result: comparePurchasingPower({
        greece: { netMonthlyEur: greekNetMonthly, rentMonthlyEur: d.rent.monthly, priceLevel: d.pliGreece },
        origin: {
          netMonthlyLocal: inputs.netMonthlyLocal,
          rentMonthlyLocal: inputs.rentMonthlyLocal,
          fxPerEur: d.fxPerEur,
          priceLevel: d.pliOrigin,
        },
      }),
    };
  };

  const comparisonWithout5C = without5C.ok ? compare(without5C.breakdown.monthlyNet) : null;
  let comparisonWith5C: Comparison | null = null;
  let comparisonCliff: Comparison | null = null;
  let averaged = false;
  if (timeline.ok) {
    const fiveCYears = timeline.years.filter((y) => !y.onwards).map((y) => y.with5C!.monthlyNet);
    averaged = new Set(fiveCYears).size > 1;
    comparisonWith5C = compare(fiveCYears.reduce((a, b) => a + b, 0) / fiveCYears.length);
    comparisonCliff = compare(timeline.years[timeline.years.length - 1]!.without5C.monthlyNet);
  }

  let headline: Headline | null = null;
  if (mode === 'without5C_only') {
    if (comparisonWithout5C?.result.changePct != null) {
      headline = { kind: 'without5C', change: describeChange(comparisonWithout5C.result.changePct) };
    }
  } else if (timeline.ok && comparisonWith5C?.result.changePct != null && comparisonCliff?.result.changePct != null) {
    headline = {
      kind: 'with5C',
      durationYears: timeline.durationYears,
      cliffYear: timeline.cliffYear,
      during: describeChange(comparisonWith5C.result.changePct),
      after: describeChange(comparisonCliff.result.changePct),
      averaged,
    };
  }

  return {
    mode,
    firstTaxYear,
    without5C,
    timeline,
    rent,
    comparisonData,
    comparisonWithout5C,
    comparisonWith5C,
    comparisonCliff,
    headline,
  };
}

function problemOf(band: { ok: false; missingParams: string[]; invalidParams: { path: string; reason: string }[] }) {
  return { missingParams: band.missingParams, invalidParams: band.invalidParams };
}
