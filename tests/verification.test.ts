import { describe, expect, it } from 'vitest';
import config from '../src/config/greece-tax-2026.json';
import { isProduction, listParams, unverifiedParams } from '../src/lib/params/verification';
import { format } from '../src/i18n';

const verified = { value: 1, sourceUrl: 'https://example.org', verifiedBy: 'Elias', verifiedOn: '2026-10-01' };

describe('parameter verification (check:params and the dev banner)', () => {
  it('finds nested parameters and skips "_" keys', () => {
    const cfg = { _meta: { value: null }, a: { b: verified, c: { d: { ...verified, verifiedOn: null } } } };
    expect(listParams(cfg)).toEqual([
      { path: 'a.b', missing: [] },
      { path: 'a.c.d', missing: ['verifiedOn'] },
    ]);
    expect(unverifiedParams(cfg).map((p) => p.path)).toEqual(['a.c.d']);
  });

  it('a value of false or 0 still counts as set', () => {
    expect(listParams({ x: { ...verified, value: false }, y: { ...verified, value: 0 } }).every((p) => p.missing.length === 0)).toBe(true);
  });

  it('the real config is currently all unverified', () => {
    expect(unverifiedParams(config).length).toBe(listParams(config).length);
  });

  it('only NOSTOS_ENV=production counts as production', () => {
    expect(isProduction('production')).toBe(true);
    expect(isProduction(undefined)).toBe(false);
    expect(isProduction('preview')).toBe(false);
  });
});

describe('format', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(format('{count} of {total} {x}', { count: 3, total: 27 })).toBe('3 of 27 {x}');
  });
});
