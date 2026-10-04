import { describe, expect, it } from 'vitest';
import el from '../src/i18n/el.json';
import en from '../src/i18n/en.json';

describe('i18n dictionaries', () => {
  it('el.json and en.json define the same keys', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(el).sort());
  });

  it('has no empty strings', () => {
    for (const value of [...Object.values(el), ...Object.values(en)]) {
      expect(value.trim()).not.toBe('');
    }
  });
});

describe('Greek terminology', () => {
  it('calls the 5C break "απαλλαγή", never "έκπτωση"', () => {
    for (const [key, value] of Object.entries(el)) expect(value, key).not.toMatch(/[έΈε]κπτωσ/);
  });
});
