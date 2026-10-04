// Purchasing-power comparison (SPEC §6.4). Pure TypeScript, no UI dependencies.
//
// "Left after rent" in each country is converted to EUR at the ECB rate and then
// expressed in Greek prices using the ratio of price level indices:
//   origin in Greek prices = origin left (EUR) × PLI(Greece) / PLI(origin).
// Known limitation (methodology page): the price index includes housing, and
// rent is also handled explicitly, so there is some overlap.

export interface CompareInput {
  greece: { netMonthlyEur: number; rentMonthlyEur: number; priceLevel: number };
  origin: {
    netMonthlyLocal: number;
    rentMonthlyLocal: number;
    /** Units of the origin currency per 1 EUR (1 for EUR countries). */
    fxPerEur: number;
    priceLevel: number;
  };
}

export interface CompareResult {
  greece: { leftEur: number };
  origin: { leftLocal: number; leftEur: number; leftInGreekPrices: number };
  /**
   * Greece vs origin, in purchasing-power terms, as a percentage
   * ((greece − origin) / origin × 100). Null when the origin amount is zero or
   * negative, where a percentage would be meaningless.
   */
  changePct: number | null;
}

export function comparePurchasingPower({ greece, origin }: CompareInput): CompareResult {
  for (const v of [greece.priceLevel, origin.priceLevel, origin.fxPerEur]) {
    if (!(Number.isFinite(v) && v > 0)) throw new RangeError('price levels and FX rates must be positive');
  }
  const greeceLeft = greece.netMonthlyEur - greece.rentMonthlyEur;
  const originLeftLocal = origin.netMonthlyLocal - origin.rentMonthlyLocal;
  const originLeftEur = originLeftLocal / origin.fxPerEur;
  const originInGreekPrices = originLeftEur * (greece.priceLevel / origin.priceLevel);
  return {
    greece: { leftEur: greeceLeft },
    origin: { leftLocal: originLeftLocal, leftEur: originLeftEur, leftInGreekPrices: originInGreekPrices },
    changePct: originInGreekPrices > 0 ? ((greeceLeft - originInGreekPrices) / originInGreekPrices) * 100 : null,
  };
}

export type ChangeDirection = 'more' | 'less' | 'same';

/** Rounded whole-percent change for the headline; under 1% either way reads as "about the same". */
export function describeChange(pct: number): { direction: ChangeDirection; pct: number } {
  const rounded = Math.round(Math.abs(pct));
  if (rounded < 1) return { direction: 'same', pct: 0 };
  return { direction: pct > 0 ? 'more' : 'less', pct: rounded };
}
