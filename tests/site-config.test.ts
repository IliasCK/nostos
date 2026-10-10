import { describe, expect, it } from 'vitest';
import site from '../src/config/site.json';
import { missingSiteValues, type SiteConfig } from '../src/lib/site-config';
import { isIndexable, robotsTxt } from '../src/lib/seo';

const filled: SiteConfig = {
  contactEmail: 'a@example.org',
  analytics: { provider: 'Cloudflare Web Analytics', privacyUrl: 'https://example.org/privacy' },
  emailProvider: { name: 'Provider', privacyUrl: 'https://example.org/p' },
};

describe('missingSiteValues', () => {
  it('lists every unset launch value in the committed site.json', () => {
    expect(missingSiteValues(site as SiteConfig)).toEqual([
      'contactEmail',
      'analytics.provider',
      'analytics.privacyUrl',
      'emailProvider.name',
      'emailProvider.privacyUrl',
    ]);
  });

  it('is empty when everything is filled in', () => {
    expect(missingSiteValues(filled)).toEqual([]);
  });

  it('needs no analytics privacy URL when analytics is "none"', () => {
    expect(missingSiteValues({ ...filled, analytics: { provider: 'none', privacyUrl: null } })).toEqual([]);
  });
});

describe('indexing switch', () => {
  it('is indexable only when SITE_INDEXABLE is exactly "true"', () => {
    expect(isIndexable({})).toBe(false);
    expect(isIndexable({ SITE_INDEXABLE: '1' })).toBe(false);
    expect(isIndexable({ SITE_INDEXABLE: 'TRUE' })).toBe(false);
    expect(isIndexable({ SITE_INDEXABLE: 'true' })).toBe(true);
  });

  it('robots.txt disallows everything unless indexable', () => {
    expect(robotsTxt(false, 'https://x.example')).toBe('User-agent: *\nDisallow: /\n');
    expect(robotsTxt(true, 'https://x.example')).toContain('Sitemap: https://x.example/sitemap.xml');
  });
});
