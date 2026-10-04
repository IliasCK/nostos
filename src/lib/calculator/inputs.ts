// Calculator inputs (SPEC §6.1): parsing and validation. Pure TypeScript.
import { MAX_CHILDREN } from '../tax/types';
import {
  APARTMENT_SIZES,
  CITIES,
  ORIGIN_COUNTRIES,
  type ApartmentSize,
  type City,
  type OriginCountry,
} from '../data/types';

/** What the form holds: strings as typed, plus the "no rent" checkbox. */
export interface RawInputs {
  origin: string;
  netMonthly: string;
  rentMonthly: string;
  noRent: boolean;
  children: string;
  birthYear: string;
  city: string;
  grossAnnual: string;
  size: string;
}

export interface CalculatorInputs {
  origin: OriginCountry;
  /** Current net monthly take-home pay, origin currency. */
  netMonthlyLocal: number;
  /** Current monthly rent, origin currency (0 = own / no rent). */
  rentMonthlyLocal: number;
  children: number;
  birthYear: number;
  city: City;
  /** Expected gross annual salary in Greece, EUR. */
  grossAnnualEur: number;
  size: ApartmentSize;
}

export type Field = keyof RawInputs;
export type InputError = 'required' | 'notANumber' | 'tooSmall' | 'tooLarge' | 'invalidChoice';

export type ParseResult =
  | { ok: true; inputs: CalculatorInputs }
  | { ok: false; errors: Partial<Record<Field, InputError>> };

/** Sanity limits for typed amounts (not tax rules; they only catch typos). */
export const LIMITS = {
  netMonthly: { min: 1, max: 100_000 },
  rentMonthly: { min: 0, max: 50_000 },
  grossAnnual: { min: 1, max: 1_000_000 },
  /** Ages accepted for the birth year, relative to the first tax year. */
  age: { min: 16, max: 80 },
} as const;

/**
 * Parses an amount typed in either locale style: "2.500,50" (el), "2,500.50" (en),
 * "2500", "2 500". The last "," or "." followed by 1–2 digits is the decimal mark;
 * every other separator is a thousands separator.
 */
export function parseAmount(text: string): number | null {
  const cleaned = text.trim().replace(/[\s  €£$]/g, '');
  if (cleaned === '' || !/^[0-9.,]+$/.test(cleaned)) return null;
  const decimal = /[.,](\d{1,2})$/.exec(cleaned);
  const whole = (decimal ? cleaned.slice(0, decimal.index) : cleaned).replace(/[.,]/g, '');
  if (whole === '' && !decimal) return null;
  const value = Number(`${whole || '0'}${decimal ? `.${decimal[1]}` : ''}`);
  return Number.isFinite(value) ? value : null;
}

export function parseCalculatorInputs(raw: RawInputs, firstTaxYear: number): ParseResult {
  const errors: Partial<Record<Field, InputError>> = {};

  const choice = <T extends string>(field: Field, allowed: readonly T[]): T | undefined => {
    const v = raw[field] as string;
    if (v === '') errors[field] = 'required';
    else if (!(allowed as readonly string[]).includes(v)) errors[field] = 'invalidChoice';
    else return v as T;
    return undefined;
  };

  const amount = (field: 'netMonthly' | 'rentMonthly' | 'grossAnnual'): number | undefined => {
    if (raw[field].trim() === '') {
      errors[field] = 'required';
      return undefined;
    }
    const v = parseAmount(raw[field]);
    const { min, max } = LIMITS[field];
    if (v === null) errors[field] = 'notANumber';
    else if (v < min) errors[field] = 'tooSmall';
    else if (v > max) errors[field] = 'tooLarge';
    else return v;
    return undefined;
  };

  const origin = choice('origin', ORIGIN_COUNTRIES);
  const city = choice('city', CITIES);
  const size = choice('size', APARTMENT_SIZES);
  const netMonthly = amount('netMonthly');
  const rentMonthly = raw.noRent ? 0 : amount('rentMonthly');
  const grossAnnual = amount('grossAnnual');

  let children: number | undefined;
  if (raw.children === '') errors.children = 'required';
  else if (!/^\d+$/.test(raw.children) || Number(raw.children) > MAX_CHILDREN) errors.children = 'invalidChoice';
  else children = Number(raw.children);

  let birthYear: number | undefined;
  const year = raw.birthYear.trim();
  if (year === '') errors.birthYear = 'required';
  else if (!/^\d{4}$/.test(year)) errors.birthYear = 'notANumber';
  else if (firstTaxYear - Number(year) > LIMITS.age.max) errors.birthYear = 'tooSmall';
  else if (firstTaxYear - Number(year) < LIMITS.age.min) errors.birthYear = 'tooLarge';
  else birthYear = Number(year);

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    inputs: {
      origin: origin!,
      netMonthlyLocal: netMonthly!,
      rentMonthlyLocal: rentMonthly!,
      children: children!,
      birthYear: birthYear!,
      city: city!,
      grossAnnualEur: grossAnnual!,
      size: size!,
    },
  };
}

export const EMPTY_INPUTS: RawInputs = {
  origin: '',
  netMonthly: '',
  rentMonthly: '',
  noRent: false,
  children: '0',
  birthYear: '',
  city: '',
  grossAnnual: '',
  size: '',
};
