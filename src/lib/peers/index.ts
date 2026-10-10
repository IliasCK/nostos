// Greece vs peers (SPEC §8): turns peers.json into chart models. Pure TypeScript.
// Takeaways are computed from the data (rank and gap to the EU-27), never hand-written
// numbers, so they stay correct when the monthly pipeline updates the file.
import { PEER_COUNTRIES, PEER_INDICATORS, type PeerCountry, type PeerIndicator, type PeersFile } from '../data/types';

/** How the gap to the EU-27 is expressed: relative % for levels, percentage points for rates. */
export const GAP_KIND: Record<PeerIndicator, 'relative' | 'points' | null> = {
  gdpPerCapitaPps: 'relative',
  aicPerCapitaPps: 'relative',
  netEarningsPps: 'relative',
  priceLevelIndex: 'relative',
  housingCostOverburden: 'points',
  minimumWagePps: null, // no EU-wide figure
};

export interface PeerRow {
  country: Exclude<PeerCountry, 'EU27'>;
  value: number;
  /** Bar length as % of the largest value shown (incl. the EU-27 reference). */
  widthPct: number;
  isGreece: boolean;
}

export interface PeerChart {
  indicator: PeerIndicator;
  year: string;
  dataset: string;
  unit: string;
  /** Countries with a value, highest first (EU-27 excluded). */
  rows: PeerRow[];
  /** EU-27 reference, if published for this indicator. */
  eu: { value: number; positionPct: number } | null;
  /** Countries without a value in this period. */
  notAvailable: PeerCountry[];
  /** Greece's position counting from the highest value (1 = highest). */
  greeceRank: number;
  countriesShown: number;
  /** Greece vs EU-27; null when there is no EU figure. */
  gap: { kind: 'relative' | 'points'; amount: number; direction: 'above' | 'below' | 'same' } | null;
}

export function buildPeerChart(file: PeersFile, indicator: PeerIndicator): PeerChart {
  const block = file.indicators[indicator];
  const countries = PEER_COUNTRIES.filter((c): c is Exclude<PeerCountry, 'EU27'> => c !== 'EU27');
  const present = countries.filter((c) => typeof block.values[c] === 'number');
  if (!present.includes('GR')) throw new Error(`${indicator}: no value for Greece`);
  const euValue = typeof block.values.EU27 === 'number' ? block.values.EU27 : null;
  const max = Math.max(...present.map((c) => block.values[c]!), euValue ?? 0);

  const rows = present
    .map((c) => ({ country: c, value: block.values[c]!, widthPct: (block.values[c]! / max) * 100, isGreece: c === 'GR' }))
    .sort((a, b) => b.value - a.value);
  const greece = block.values.GR!;

  let gap: PeerChart['gap'] = null;
  const kind = GAP_KIND[indicator];
  if (kind && euValue !== null) {
    const raw = kind === 'relative' ? ((greece - euValue) / euValue) * 100 : greece - euValue;
    const amount = kind === 'relative' ? Math.round(Math.abs(raw)) : Math.round(Math.abs(raw) * 10) / 10;
    gap = { kind, amount, direction: amount === 0 ? 'same' : raw > 0 ? 'above' : 'below' };
  }

  return {
    indicator,
    year: block.year,
    dataset: block.dataset,
    unit: block.unit,
    rows,
    eu: euValue === null ? null : { value: euValue, positionPct: (euValue / max) * 100 },
    notAvailable: block.notAvailable,
    greeceRank: rows.findIndex((r) => r.isGreece) + 1,
    countriesShown: rows.length,
    gap,
  };
}

export function buildPeerCharts(file: PeersFile): PeerChart[] {
  return PEER_INDICATORS.map((ind) => buildPeerChart(file, ind));
}

/**
 * i18n key for Greece's rank phrase, counted from the nearer end:
 * "the highest", "the second-highest", …, "the third-lowest", "the second-lowest", "the lowest".
 */
export function rankKey(rank: number, of: number): string {
  return rank <= Math.ceil(of / 2) ? `peers.rank.top.${rank}` : `peers.rank.bottom.${of - rank + 1}`;
}

/** i18n key + values for a reference period: "2025" as is, "2026-S2" as a half-year. */
export function periodLabel(period: string): { key: string; values: Record<string, string> } {
  const m = /^(\d{4})-S([12])$/.exec(period);
  return m ? { key: `peers.half.${m[2]}`, values: { year: m[1]! } } : { key: 'peers.plainYear', values: { year: period } };
}

/**
 * The headline stats on the home page (SPEC §4), read live from peers.json:
 * a welfare measure, prices and housing costs, so the mix is neither upbeat nor gloomy.
 */
export const HOME_STATS = ['aicPerCapitaPps', 'priceLevelIndex', 'housingCostOverburden'] as const satisfies readonly PeerIndicator[];

export interface HomeStat {
  indicator: PeerIndicator;
  greece: number;
  eu: number | null;
  year: string;
  dataset: string;
  gap: PeerChart['gap'];
}

export function buildHomeStats(file: PeersFile): HomeStat[] {
  return HOME_STATS.map((ind) => {
    const chart = buildPeerChart(file, ind);
    return {
      indicator: ind,
      greece: chart.rows.find((r) => r.isGreece)!.value,
      eu: chart.eu?.value ?? null,
      year: chart.year,
      dataset: chart.dataset,
      gap: chart.gap,
    };
  });
}
