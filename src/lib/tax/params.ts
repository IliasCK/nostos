import type { Bracket, InvalidParam, ParamsProblem, RateOverride } from './types';
import { MAX_CHILDREN } from './types';

/** A validator returns an error message, or null if the value is acceptable. */
export type Check = (value: unknown) => string | null;

/**
 * Reads parameter values from the config by dotted path, recording every
 * parameter that is null/absent (missing) or malformed (invalid).
 */
export class ParamReader {
  readonly missing: string[] = [];
  readonly invalid: InvalidParam[] = [];

  constructor(private readonly config: unknown) {}

  read<T>(path: string, check: Check): T | undefined {
    let node: unknown = this.config;
    for (const key of path.split('.')) {
      node = node !== null && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined;
    }
    const value = node !== null && typeof node === 'object' && 'value' in node ? node.value : undefined;
    if (value === null || value === undefined) {
      if (!this.missing.includes(path)) this.missing.push(path);
      return undefined;
    }
    const error = check(value);
    if (error !== null) {
      if (!this.invalid.some((i) => i.path === path)) this.invalid.push({ path, reason: error });
      return undefined;
    }
    return value as T;
  }

  get hasProblems(): boolean {
    return this.missing.length > 0 || this.invalid.length > 0;
  }

  problem(): ParamsProblem {
    return { ok: false, missingParams: [...this.missing], invalidParams: [...this.invalid] };
  }
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isRate = (v: unknown): v is number => isNum(v) && v >= 0 && v <= 1;

export const nonNegative: Check = (v) => (isNum(v) && v >= 0 ? null : 'expected a number ≥ 0');
export const fraction: Check = (v) => (isRate(v) ? null : 'expected a fraction between 0 and 1');
export const positiveInt: Check = (v) =>
  Number.isInteger(v) && (v as number) > 0 ? null : 'expected a positive integer';
export const boolean: Check = (v) => (typeof v === 'boolean' ? null : 'expected true or false');

export function oneOf(allowed: readonly string[]): Check {
  return (v) => (typeof v === 'string' && allowed.includes(v) ? null : `expected one of: ${allowed.join(', ')}`);
}

export function listOf(allowed: readonly string[]): Check {
  return (v) =>
    Array.isArray(v) && v.every((x) => typeof x === 'string' && allowed.includes(x))
      ? null
      : `expected a list drawn from: ${allowed.join(', ')}`;
}

export const brackets: Check = (v) => {
  if (!Array.isArray(v) || v.length === 0) return 'expected a non-empty list of { upTo, rate }';
  let prev = 0;
  for (const [i, b] of v.entries()) {
    if (b === null || typeof b !== 'object') return `bracket ${i}: expected { upTo, rate }`;
    const { upTo, rate } = b as Record<string, unknown>;
    if (!isRate(rate)) return `bracket ${i}: rate must be a fraction between 0 and 1`;
    const last = i === v.length - 1;
    if (last && upTo !== null) return `bracket ${i}: the last bracket must have upTo null`;
    if (!last && !(isNum(upTo) && upTo > prev)) return `bracket ${i}: upTo must be a number above the previous one`;
    if (!last) prev = upTo as number;
  }
  return null;
};

function byChildren(inner: Check, what: string): Check {
  return (v) => {
    if (v === null || typeof v !== 'object' || Array.isArray(v)) return `expected { "0": …, …, "${MAX_CHILDREN}": … }`;
    for (let c = 0; c <= MAX_CHILDREN; c++) {
      const entry = (v as Record<string, unknown>)[String(c)];
      if (entry === undefined) return `missing key "${c}" (${what} for ${c} children)`;
      const error = inner(entry);
      if (error !== null) return `key "${c}": ${error}`;
    }
    return null;
  };
}

export const bracketsByChildren = byChildren(brackets, 'scale');
export const amountsByChildren = byChildren(nonNegative, 'amount');

export const rateOverrides: Check = (v) => {
  if (!Array.isArray(v)) return 'expected a list of { from, upTo, rate } (may be empty)';
  for (const [i, o] of v.entries()) {
    if (o === null || typeof o !== 'object') return `override ${i}: expected { from, upTo, rate }`;
    const { from, upTo, rate } = o as Record<string, unknown>;
    if (!(isNum(from) && from >= 0)) return `override ${i}: from must be a number ≥ 0`;
    if (!(upTo === null || (isNum(upTo) && upTo > from))) return `override ${i}: upTo must be null or above from`;
    if (!isRate(rate)) return `override ${i}: rate must be a fraction between 0 and 1`;
  }
  return null;
};

export type { Bracket, RateOverride };
