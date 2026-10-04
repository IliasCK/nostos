import { describe, expect, it } from 'vitest';
import { EMPTY_INPUTS, parseAmount, parseCalculatorInputs, type RawInputs } from '../../src/lib/calculator/inputs';

const valid: RawInputs = {
  origin: 'GB',
  netMonthly: '3.200',
  rentMonthly: '1,450.50',
  noRent: false,
  children: '2',
  birthYear: '1990',
  city: 'athens',
  grossAnnual: '35000',
  size: 'two_bed',
};

describe('parseAmount', () => {
  it.each([
    ['2500', 2500],
    ['2.500', 2500],
    ['2,500', 2500],
    ['2.500,50', 2500.5],
    ['2,500.50', 2500.5],
    ['2 500', 2500],
    ['1.234.567', 1234567],
    ['€ 1.200', 1200],
    ['0,5', 0.5],
    ['35000.0', 35000],
  ])('%s → %d', (text, value) => expect(parseAmount(text)).toBe(value));

  it.each(['', 'abc', '-500', '12a', '..'])('%j → null', (text) => expect(parseAmount(text)).toBeNull());
});

describe('parseCalculatorInputs', () => {
  it('parses a valid form', () => {
    expect(parseCalculatorInputs(valid, 2026)).toEqual({
      ok: true,
      inputs: {
        origin: 'GB',
        netMonthlyLocal: 3200,
        rentMonthlyLocal: 1450.5,
        children: 2,
        birthYear: 1990,
        city: 'athens',
        grossAnnualEur: 35000,
        size: 'two_bed',
      },
    });
  });

  it('"no rent" means rent 0, whatever is typed', () => {
    const r = parseCalculatorInputs({ ...valid, noRent: true, rentMonthly: 'xyz' }, 2026);
    expect(r.ok && r.inputs.rentMonthlyLocal).toBe(0);
  });

  it('reports every missing field of an empty form', () => {
    const r = parseCalculatorInputs(EMPTY_INPUTS, 2026);
    expect(r).toEqual({
      ok: false,
      errors: {
        origin: 'required',
        city: 'required',
        size: 'required',
        netMonthly: 'required',
        rentMonthly: 'required',
        grossAnnual: 'required',
        birthYear: 'required',
      },
    });
  });

  it.each([
    [{ netMonthly: 'lots' }, 'netMonthly', 'notANumber'],
    [{ netMonthly: '0' }, 'netMonthly', 'tooSmall'],
    [{ netMonthly: '250.000' }, 'netMonthly', 'tooLarge'],
    [{ rentMonthly: '60.000' }, 'rentMonthly', 'tooLarge'],
    [{ grossAnnual: '2.000.000' }, 'grossAnnual', 'tooLarge'],
    [{ birthYear: '90' }, 'birthYear', 'notANumber'],
    [{ birthYear: '1940' }, 'birthYear', 'tooSmall'], // over 80 in 2026
    [{ birthYear: '2015' }, 'birthYear', 'tooLarge'], // under 16 in 2026
    [{ children: '5' }, 'children', 'invalidChoice'],
    [{ origin: 'FR' }, 'origin', 'invalidChoice'],
    [{ city: 'corfu' }, 'city', 'invalidChoice'],
    [{ size: 'villa' }, 'size', 'invalidChoice'],
  ] as const)('%j → %s: %s', (patch, field, error) => {
    const r = parseCalculatorInputs({ ...valid, ...patch }, 2026);
    expect(r).toEqual({ ok: false, errors: { [field]: error } });
  });

  it('accepts the age limits exactly', () => {
    expect(parseCalculatorInputs({ ...valid, birthYear: '1946' }, 2026).ok).toBe(true); // 80
    expect(parseCalculatorInputs({ ...valid, birthYear: '2010' }, 2026).ok).toBe(true); // 16
  });
});
