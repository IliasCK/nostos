// Real-world checks against the REAL config (src/config/greece-tax-2026.json).
// Cases stay todo until their expected values are filled in and the config has
// every parameter they need; then they run automatically.
import { describe, expect, it } from 'vitest';
import config from '../../src/config/greece-tax-2026.json';
import { computeGreekNet, type AgeBand, type GreekNetBreakdown } from '../../src/lib/tax';
import art5c from '../fixtures/art5c.json';
import oracle from '../fixtures/oracle.json';

type ExpectedNumbers = Partial<Record<keyof GreekNetBreakdown, number | null>>;

function engine(c: { grossAnnual: number; children: number; ageBand: string }, apply5C: boolean) {
  return computeGreekNet({ ...c, ageBand: c.ageBand as AgeBand, apply5C, params: config });
}

describe('oracle: Greek net-salary calculators', () => {
  for (const c of oracle.cases) {
    for (const calc of oracle.calculators) {
      const expected = (c.expected as Record<string, { netPerPayment: number | null; annualNet: number | null }>)[calc.id];
      const name = `${c.id} vs ${calc.name ?? calc.id}`;
      const result = engine(c, false);
      if (!expected || (expected.netPerPayment === null && expected.annualNet === null)) {
        it.todo(`${name} (expected values not entered)`);
      } else if (!result.ok) {
        it.todo(`${name} (config incomplete: ${result.missingParams.length + result.invalidParams.length} parameters)`);
      } else {
        it(name, () => {
          const b = result.breakdown;
          if (expected.netPerPayment !== null) {
            expect(Math.abs(b.perPaymentNet - expected.netPerPayment)).toBeLessThanOrEqual(oracle.toleranceEurPerMonth);
          }
          if (expected.annualNet !== null) {
            expect(Math.abs(b.annualNet - expected.annualNet) / 12).toBeLessThanOrEqual(oracle.toleranceEurPerMonth);
          }
        });
      }
    }
  }
});

describe('oracle: hand-built Article 5C cases', () => {
  if (art5c.cases.length === 0) it.todo('no 5C cases entered yet (tests/fixtures/art5c.json)');

  for (const c of art5c.cases as (typeof art5c._exampleCase)[]) {
    const checks = Object.entries(c.expected as ExpectedNumbers).filter(([, v]) => v !== null) as [
      keyof GreekNetBreakdown,
      number,
    ][];
    const result = engine(c, true);
    if (checks.length === 0) {
      it.todo(`${c.id} (expected values not entered)`);
    } else if (!result.ok) {
      it.todo(`${c.id} (config incomplete: ${result.missingParams.length + result.invalidParams.length} parameters)`);
    } else {
      it(`${c.id}: ${c.description}`, () => {
        for (const [field, value] of checks) {
          expect(Math.abs((result.breakdown[field] as number) - value), field).toBeLessThanOrEqual(art5c.toleranceEur);
        }
      });
    }
  }
});

describe('oracle fixtures', () => {
  it('have the SPEC §6.3 cases', () => {
    expect(oracle.cases).toHaveLength(18);
    expect(new Set(oracle.cases.map((c) => c.id)).size).toBe(18);
    expect(oracle.calculators).toHaveLength(2);
  });
});
