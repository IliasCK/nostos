// Made-up values only (plus a structural check of the committed file).
import { describe, expect, it } from 'vitest';
import committed from '../../src/data/peers.json';
import type { PeersFile } from '../../src/lib/data';
import { buildPeerChart, buildPeerCharts, periodLabel, rankKey } from '../../src/lib/peers';

function file(values: Record<string, number>, notAvailable: string[] = []): PeersFile {
  const block = { label: 'x', dataset: 'ds', filters: {}, url: 'u', unit: 'u', year: '2025', values, notAvailable };
  return {
    source: 's',
    fetchedAt: 't',
    countries: ['GR', 'BG', 'RO', 'PT', 'ES', 'IT', 'EU27'],
    indicators: Object.fromEntries(
      ['gdpPerCapitaPps', 'aicPerCapitaPps', 'netEarningsPps', 'priceLevelIndex', 'housingCostOverburden', 'minimumWagePps'].map((k) => [k, block]),
    ),
  } as unknown as PeersFile;
}

const SIX = { GR: 80, BG: 50, RO: 60, PT: 90, ES: 100, IT: 110, EU27: 100 };

describe('buildPeerChart', () => {
  it('sorts highest first, ranks Greece and scales bars to the largest value', () => {
    const c = buildPeerChart(file(SIX), 'gdpPerCapitaPps');
    expect(c.rows.map((r) => r.country)).toEqual(['IT', 'ES', 'PT', 'GR', 'RO', 'BG']);
    expect(c.greeceRank).toBe(4);
    expect(c.countriesShown).toBe(6);
    expect(c.rows[0]!.widthPct).toBe(100);
    expect(c.eu!.positionPct).toBeCloseTo((100 / 110) * 100, 10);
    expect(c.rows.find((r) => r.isGreece)!.value).toBe(80);
  });

  it('expresses levels as a relative gap and rates in percentage points', () => {
    expect(buildPeerChart(file(SIX), 'gdpPerCapitaPps').gap).toEqual({ kind: 'relative', amount: 20, direction: 'below' });
    const rates = file({ GR: 26.4, BG: 6.9, RO: 5, PT: 6.3, ES: 7.2, IT: 5, EU27: 7.7 });
    expect(buildPeerChart(rates, 'housingCostOverburden').gap).toEqual({ kind: 'points', amount: 18.7, direction: 'above' });
    const close = file({ ...SIX, GR: 100.4 });
    expect(buildPeerChart(close, 'priceLevelIndex').gap).toEqual({ kind: 'relative', amount: 0, direction: 'same' });
  });

  it('minimum wage: no EU figure, fewer countries, absences listed', () => {
    const mw = file({ GR: 1229, BG: 993, RO: 1317, PT: 1240, ES: 1556 }, ['IT', 'EU27']);
    const c = buildPeerChart(mw, 'minimumWagePps');
    expect(c.eu).toBeNull();
    expect(c.gap).toBeNull();
    expect(c.countriesShown).toBe(5);
    expect(c.greeceRank).toBe(4);
    expect(c.notAvailable).toEqual(['IT', 'EU27']);
  });

  it('rank phrases count from the nearer end', () => {
    expect([1, 2, 3, 4, 5, 6].map((r) => rankKey(r, 6))).toEqual([
      'peers.rank.top.1', 'peers.rank.top.2', 'peers.rank.top.3', 'peers.rank.bottom.3', 'peers.rank.bottom.2', 'peers.rank.bottom.1',
    ]);
    expect([1, 2, 3, 4, 5].map((r) => rankKey(r, 5))).toEqual([
      'peers.rank.top.1', 'peers.rank.top.2', 'peers.rank.top.3', 'peers.rank.bottom.2', 'peers.rank.bottom.1',
    ]);
  });

  it('period labels', () => {
    expect(periodLabel('2025')).toEqual({ key: 'peers.plainYear', values: { year: '2025' } });
    expect(periodLabel('2026-S2')).toEqual({ key: 'peers.half.2', values: { year: '2026' } });
  });

  it('the committed file builds all six charts', () => {
    const charts = buildPeerCharts(committed as unknown as PeersFile);
    expect(charts).toHaveLength(6);
    for (const c of charts) expect(c.rows.some((r) => r.isGreece)).toBe(true);
  });
});

describe('peers strings', async () => {
  const el = (await import('../../src/i18n/el.json')).default as Record<string, string>;
  const en = (await import('../../src/i18n/en.json')).default as Record<string, string>;
  const { PEER_COUNTRIES, PEER_INDICATORS } = await import('../../src/lib/data');
  const keys = [
    ...PEER_INDICATORS.flatMap((i) => [`peers.${i}.title`, `peers.${i}.unit`, `peers.${i}.takeaway`]),
    ...PEER_COUNTRIES.map((c) => `peers.country.${c}`),
    ...[5, 6].flatMap((n) => Array.from({ length: n }, (_, i) => rankKey(i + 1, n))),
    'peers.half.1', 'peers.half.2', 'peers.plainYear', 'peers.gap.same',
    ...['relative', 'points'].flatMap((k) => [`peers.gap.${k}.above`, `peers.gap.${k}.below`]),
  ];
  it.each(keys)('%s exists in both languages', (key) => {
    expect(el).toHaveProperty([key]);
    expect(en).toHaveProperty([key]);
  });
});
