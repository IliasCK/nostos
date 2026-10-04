// Small UI helpers: string lookup with {placeholders}, number formatting, and
// plain-language labels for missing parameters and data.
import type { Locale } from '../../i18n';

export type Strings = Record<string, string>;

export function makeText(strings: Strings) {
  return (key: string, values: Record<string, string | number> = {}): string =>
    (strings[key] ?? key).replace(/\{(\w+)\}/g, (m, name: string) => (name in values ? String(values[name]) : m));
}
export type Text = ReturnType<typeof makeText>;

export function makeFormat(locale: Locale) {
  const tag = locale === 'el' ? 'el-GR' : 'en-GB';
  return {
    money: (amount: number, currency = 'EUR', digits = 0) =>
      new Intl.NumberFormat(tag, { style: 'currency', currency, maximumFractionDigits: digits, minimumFractionDigits: digits }).format(amount),
    number: (n: number, digits = 0) => new Intl.NumberFormat(tag, { maximumFractionDigits: digits }).format(n),
    percent: (fraction: number) => new Intl.NumberFormat(tag, { style: 'percent', maximumFractionDigits: 2 }).format(fraction),
  };
}
export type Format = ReturnType<typeof makeFormat>;

/** Plain-language label for a missing config path. */
export function paramLabel(t: Text, path: string): string {
  const key = `calc.param.${path}`;
  const label = t(key);
  return label === key ? path : label;
}

/** Plain-language label for a missing data item (from src/lib/data loaders). */
export function dataLabel(t: Text, item: string): string {
  const [file, a, b] = item.split('.');
  if (file === 'fx') return a ? t('calc.data.fxCurrency', { currency: a }) : t('calc.data.fx');
  if (file === 'priceLevels') return a ? t('calc.data.priceLevelCountry', { country: a === 'GR' ? t('calc.compare.greece') : t(`quiz.origin.${a}`) }) : t('calc.data.priceLevels');
  if (file === 'rent' && a === 'cities' && b) return t('calc.data.rentCity', { city: t(`calc.city.${b}`) });
  if (file === 'rent' && a === 'sizes' && b) return t('calc.data.rentSize', { size: t(`calc.size.${b}`) });
  return t('calc.data.rent');
}
