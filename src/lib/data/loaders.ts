// Pure validators for the data files. Nothing is ever filled in: a missing file,
// a null value or a missing country gives "unavailable" with the missing items,
// and the UI shows "data not yet available" for that part.
import {
  CURRENCY_OF,
  type ApartmentSize,
  type City,
  type Currency,
  type FxFile,
  type OriginCountry,
  type PriceLevelsFile,
  type RentFile,
} from './types';

export type Available<T> = { status: 'ok'; value: T };
export type Unavailable = { status: 'unavailable'; missing: string[] };
export type Lookup<T> = Available<T> | Unavailable;

const unavailable = (...missing: string[]): Unavailable => ({ status: 'unavailable', missing });
const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const isPositive = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** File-level check: is it there and does it have its metadata? */
export function loadFx(raw: unknown): Lookup<FxFile> {
  if (!isObject(raw)) return unavailable('fx');
  if (!isText(raw.date) || !isText(raw.source) || !isObject(raw.rates)) return unavailable('fx');
  return { status: 'ok', value: raw as unknown as FxFile };
}

export function loadPriceLevels(raw: unknown): Lookup<PriceLevelsFile> {
  if (!isObject(raw)) return unavailable('priceLevels');
  if (!isText(raw.source) || !Number.isInteger(raw.year) || !isText(raw.basis) || !isObject(raw.indices)) {
    return unavailable('priceLevels');
  }
  return { status: 'ok', value: raw as unknown as PriceLevelsFile };
}

export function loadRent(raw: unknown): Lookup<RentFile> {
  if (!isObject(raw) || !isObject(raw.cities) || !isObject(raw.sizes)) return unavailable('rent');
  const missing = [...(isText(raw.quarter) ? [] : ['rent.quarter']), ...(isText(raw.sourceUrl) ? [] : ['rent.sourceUrl'])];
  if (missing.length > 0) return unavailable(...missing);
  return { status: 'ok', value: raw as unknown as RentFile };
}

/** Units of `currency` per 1 EUR (1 for EUR). */
export function fxRate(fx: Lookup<FxFile>, currency: Currency): Lookup<number> {
  if (currency === 'EUR') return { status: 'ok', value: 1 };
  if (fx.status !== 'ok') return fx;
  const rate = fx.value.rates[currency];
  return isPositive(rate) ? { status: 'ok', value: rate } : unavailable(`fx.${currency}`);
}

export function priceLevel(levels: Lookup<PriceLevelsFile>, country: 'GR' | OriginCountry): Lookup<number> {
  if (levels.status !== 'ok') return levels;
  const index = levels.value.indices[country];
  return isPositive(index) ? { status: 'ok', value: index } : unavailable(`priceLevels.${country}`);
}

export interface RentEstimate {
  eurPerM2: number;
  m2: number;
  /** eurPerM2 × m2, EUR per month. */
  monthly: number;
  quarter: string;
  sourceUrl: string;
}

export function rentEstimate(rent: Lookup<RentFile>, city: City, size: ApartmentSize): Lookup<RentEstimate> {
  if (rent.status !== 'ok') return rent;
  const eurPerM2 = rent.value.cities[city];
  const m2 = rent.value.sizes[size];
  const missing = [...(isPositive(eurPerM2) ? [] : [`rent.cities.${city}`]), ...(isPositive(m2) ? [] : [`rent.sizes.${size}`])];
  if (missing.length > 0) return unavailable(...missing);
  return {
    status: 'ok',
    value: {
      eurPerM2: eurPerM2 as number,
      m2: m2 as number,
      monthly: (eurPerM2 as number) * (m2 as number),
      quarter: rent.value.quarter!,
      sourceUrl: rent.value.sourceUrl!,
    },
  };
}

export function currencyOf(country: OriginCountry): Currency {
  return CURRENCY_OF[country];
}

export type { City };
