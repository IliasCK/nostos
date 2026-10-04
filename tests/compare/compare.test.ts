// Made-up round numbers; not real FX rates or price levels.
import { describe, expect, it } from 'vitest';
import { comparePurchasingPower, describeChange } from '../../src/lib/compare';

describe('comparePurchasingPower', () => {
  it('converts the origin to EUR and then to Greek prices', () => {
    const r = comparePurchasingPower({
      greece: { netMonthlyEur: 2_000, rentMonthlyEur: 800, priceLevel: 80 },
      origin: { netMonthlyLocal: 4_000, rentMonthlyLocal: 2_000, fxPerEur: 0.8, priceLevel: 100 },
    });
    expect(r.greece.leftEur).toBe(1_200);
    expect(r.origin.leftLocal).toBe(2_000);
    expect(r.origin.leftEur).toBe(2_500); // 2,000 / 0.8
    expect(r.origin.leftInGreekPrices).toBe(2_000); // 2,500 × 80/100
    expect(r.changePct).toBeCloseTo(-40, 10); // 1,200 vs 2,000
  });

  it('EUR origin with equal price levels compares like for like', () => {
    const r = comparePurchasingPower({
      greece: { netMonthlyEur: 1_500, rentMonthlyEur: 500, priceLevel: 100 },
      origin: { netMonthlyLocal: 1_800, rentMonthlyLocal: 1_000, fxPerEur: 1, priceLevel: 100 },
    });
    expect(r.changePct).toBeCloseTo(25, 10); // 1,000 vs 800
  });

  it('no percentage when the origin has nothing left after rent', () => {
    const r = comparePurchasingPower({
      greece: { netMonthlyEur: 1_500, rentMonthlyEur: 500, priceLevel: 100 },
      origin: { netMonthlyLocal: 1_000, rentMonthlyLocal: 1_200, fxPerEur: 1, priceLevel: 100 },
    });
    expect(r.origin.leftEur).toBe(-200);
    expect(r.changePct).toBeNull();
  });

  it('rejects non-positive price levels or rates', () => {
    expect(() =>
      comparePurchasingPower({
        greece: { netMonthlyEur: 1, rentMonthlyEur: 0, priceLevel: 0 },
        origin: { netMonthlyLocal: 1, rentMonthlyLocal: 0, fxPerEur: 1, priceLevel: 100 },
      }),
    ).toThrow(RangeError);
  });
});

describe('describeChange', () => {
  it.each([
    [18.4, 'more', 18],
    [-4.2, 'less', 4],
    [0.49, 'same', 0],
    [-0.4, 'same', 0],
    [0.5, 'more', 1],
  ] as const)('%d%% → %s %d', (pct, direction, rounded) => {
    expect(describeChange(pct)).toEqual({ direction, pct: rounded });
  });
});
