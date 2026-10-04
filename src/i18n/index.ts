import el from './el.json';
import en from './en.json';

export const locales = ['el', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'el';

export type StringKey = keyof typeof el;

// Typed against el.json so a key missing from en.json is a type error.
const dictionaries: Record<Locale, Record<StringKey, string>> = { el, en };

export function t(locale: Locale, key: StringKey): string {
  return dictionaries[locale][key];
}

/** The whole dictionary for a locale. */
export function dictionary(locale: Locale): Record<StringKey, string> {
  return dictionaries[locale];
}

export function toLocale(value: string | undefined): Locale {
  return value === 'en' ? 'en' : defaultLocale;
}

/** Home path for a locale: "/" for Greek, "/en/" for English. */
export function homePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

/** Replaces {name} placeholders in a string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

/** Methodology page path (page itself arrives in M7). */
export function methodologyPath(locale: Locale): string {
  return locale === 'el' ? '/methodologia/' : '/en/methodology/';
}

/** Calculator page path. */
export function calculatorPath(locale: Locale): string {
  return locale === 'el' ? '/ypologistis/' : '/en/calculator/';
}

/** Greece vs peers page path. */
export function comparePath(locale: Locale): string {
  return locale === 'el' ? '/sygkrisi/' : '/en/compare/';
}
