// Shapes of the data files in src/data/. The pipeline (M5) writes fx.json and
// price-levels.json; rent.json is edited by hand (SPEC §7).

export const CITIES = ['athens', 'thessaloniki', 'heraklion', 'patras'] as const;
export type City = (typeof CITIES)[number];

export const APARTMENT_SIZES = ['studio', 'one_bed', 'two_bed', 'three_bed'] as const;
export type ApartmentSize = (typeof APARTMENT_SIZES)[number];

/** Origin countries of the calculator (SPEC §3), ISO 3166-1 alpha-2. */
export const ORIGIN_COUNTRIES = ['DE', 'GB', 'NL', 'AU', 'US', 'BE', 'SE', 'CY'] as const;
export type OriginCountry = (typeof ORIGIN_COUNTRIES)[number];

export const CURRENCIES = ['EUR', 'GBP', 'USD', 'AUD', 'SEK'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Geography: each origin country's currency. */
export const CURRENCY_OF: Record<OriginCountry, Currency> = {
  DE: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  CY: 'EUR',
  GB: 'GBP',
  US: 'USD',
  AU: 'AUD',
  SE: 'SEK',
};

/** src/data/fx.json: ECB euro reference rates, units of currency per 1 EUR. */
export interface FxFile {
  source: string;
  fetchedAt: string;
  /** Reference-rate date, YYYY-MM-DD. */
  date: string;
  base: 'EUR';
  rates: Partial<Record<Exclude<Currency, 'EUR'>, number | null>>;
}

/** src/data/price-levels.json: price level index per country (only ratios are used, so the base doesn't matter). */
export interface PriceLevelsFile {
  source: string;
  fetchedAt: string;
  /** Reference year of the data. */
  year: number;
  /** What the index is, e.g. "OECD price level indices, AIC, OECD=100". */
  basis: string;
  indices: Partial<Record<'GR' | OriginCountry, number | null>>;
}

/** src/data/manual/rent.json */
export interface RentFile {
  /** e.g. "2026-Q2" */
  quarter: string | null;
  sourceUrl: string | null;
  basis: string;
  /** EUR per m² per month. */
  cities: Partial<Record<City, number | null>>;
  /** m² per apartment size. */
  sizes: Partial<Record<ApartmentSize, number | null>>;
}

export const PEER_COUNTRIES = ['GR', 'BG', 'RO', 'PT', 'ES', 'IT', 'EU27'] as const;
export type PeerCountry = (typeof PEER_COUNTRIES)[number];

export const PEER_INDICATORS = [
  'gdpPerCapitaPps',
  'aicPerCapitaPps',
  'netEarningsPps',
  'priceLevelIndex',
  'housingCostOverburden',
  'minimumWagePps',
] as const;
export type PeerIndicator = (typeof PEER_INDICATORS)[number];

/** src/data/peers.json: Eurostat indicators for the Greece vs peers page (SPEC §8). */
export interface PeersFile {
  source: string;
  fetchedAt: string;
  countries: PeerCountry[];
  indicators: Record<
    PeerIndicator,
    {
      label: string;
      dataset: string;
      filters: Record<string, string>;
      url: string;
      unit: string;
      /** Reference period, e.g. "2025" or "2026-S2". */
      year: string;
      values: Partial<Record<PeerCountry, number>>;
      /** Countries with no value in that period (e.g. no statutory minimum wage). */
      notAvailable: PeerCountry[];
    }
  >;
}
