import { describe, expect, it } from 'vitest';
import rentFile from '../../src/data/manual/rent.json';
import { fxRate, loadFx, loadPriceLevels, loadRent, priceLevel, rentEstimate } from '../../src/lib/data';

const fx = { source: 'https://example.org/ecb', fetchedAt: '2026-01-01T00:00:00Z', date: '2026-01-01', base: 'EUR', rates: { GBP: 0.8, USD: null } };
const levels = { source: 'https://example.org/oecd', fetchedAt: '2026-01-01T00:00:00Z', year: 2024, basis: 'SYNTHETIC', indices: { GR: 80, DE: 100 } };
const rent = { quarter: '2026-Q2', sourceUrl: 'https://example.org/spi', basis: 'x', cities: { athens: 15, patras: null }, sizes: { one_bed: 60, studio: null } };

describe('data loaders', () => {
  it('a missing file is unavailable, never a default', () => {
    expect(loadFx(undefined)).toEqual({ status: 'unavailable', missing: ['fx'] });
    expect(loadPriceLevels(undefined)).toEqual({ status: 'unavailable', missing: ['priceLevels'] });
    expect(loadRent(undefined)).toEqual({ status: 'unavailable', missing: ['rent'] });
  });

  it('malformed files are unavailable', () => {
    expect(loadFx({ rates: {} }).status).toBe('unavailable');
    expect(loadPriceLevels({ ...levels, year: '2024' }).status).toBe('unavailable');
    expect(loadRent({ quarter: '2026-Q2' }).status).toBe('unavailable');
  });

  it('FX: EUR is 1; a present rate is used; null or absent rates are unavailable', () => {
    const f = loadFx(fx);
    expect(fxRate(f, 'EUR')).toEqual({ status: 'ok', value: 1 });
    expect(fxRate(loadFx(undefined), 'EUR')).toEqual({ status: 'ok', value: 1 });
    expect(fxRate(f, 'GBP')).toEqual({ status: 'ok', value: 0.8 });
    expect(fxRate(f, 'USD')).toEqual({ status: 'unavailable', missing: ['fx.USD'] });
    expect(fxRate(f, 'SEK')).toEqual({ status: 'unavailable', missing: ['fx.SEK'] });
    expect(fxRate(loadFx(undefined), 'GBP')).toEqual({ status: 'unavailable', missing: ['fx'] });
  });

  it('price levels per country', () => {
    const l = loadPriceLevels(levels);
    expect(priceLevel(l, 'GR')).toEqual({ status: 'ok', value: 80 });
    expect(priceLevel(l, 'SE')).toEqual({ status: 'unavailable', missing: ['priceLevels.SE'] });
  });

  it('rent: city €/m² × size m², with every missing item listed', () => {
    const r = loadRent(rent);
    expect(rentEstimate(r, 'athens', 'one_bed')).toEqual({
      status: 'ok',
      value: { eurPerM2: 15, m2: 60, monthly: 900, quarter: '2026-Q2', sourceUrl: 'https://example.org/spi' },
    });
    expect(rentEstimate(r, 'patras', 'studio')).toEqual({
      status: 'unavailable',
      missing: ['rent.cities.patras', 'rent.sizes.studio'],
    });
  });

  it('the committed rent.json (all null) is unavailable', () => {
    expect(loadRent(rentFile)).toEqual({ status: 'unavailable', missing: ['rent.quarter', 'rent.sourceUrl'] });
  });
});
