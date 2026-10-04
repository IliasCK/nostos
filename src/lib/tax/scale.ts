import type { Bracket, RateOverride } from './types';

/**
 * Progressive tax on `income` under `brackets`, optionally with rate overrides
 * on income ranges. mode "replace": the override rate applies in its range;
 * mode "min": the lower of the bracket rate and the override rate applies.
 */
export function scaleTax(
  income: number,
  brackets: readonly Bracket[],
  overrides: readonly RateOverride[] = [],
  mode: 'replace' | 'min' = 'replace',
): number {
  if (income <= 0 || brackets.length === 0) return 0;

  const points = new Set<number>([0]);
  for (const b of brackets) if (b.upTo !== null) points.add(b.upTo);
  for (const o of overrides) {
    points.add(o.from);
    if (o.upTo !== null) points.add(o.upTo);
  }
  const starts = [...points].sort((a, b) => a - b);

  let tax = 0;
  for (const [i, start] of starts.entries()) {
    if (start >= income) break;
    const end = Math.min(income, starts[i + 1] ?? Infinity);
    tax += (end - start) * rateAt(start, brackets, overrides, mode);
  }
  return tax;
}

function rateAt(
  x: number,
  brackets: readonly Bracket[],
  overrides: readonly RateOverride[],
  mode: 'replace' | 'min',
): number {
  const bracket = brackets.find((b) => b.upTo === null || x < b.upTo) ?? brackets[brackets.length - 1]!;
  const override = overrides.find((o) => x >= o.from && (o.upTo === null || x < o.upTo));
  if (!override) return bracket.rate;
  return mode === 'min' ? Math.min(bracket.rate, override.rate) : override.rate;
}
