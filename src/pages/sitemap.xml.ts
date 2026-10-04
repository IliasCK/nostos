import type { APIRoute } from 'astro';
import { ROUTES, locales, type PageId } from '../i18n';
import { absolute, isIndexable, siteUrl, sitemapXml } from '../lib/seo';

// Lists every page in both languages with hreflang alternates. Empty unless the
// site is indexable (SITE_INDEXABLE=true, which requires SITE_URL).
export const GET: APIRoute = () => {
  const site = siteUrl(process.env);
  const entries =
    isIndexable(process.env) && site
      ? (Object.keys(ROUTES) as PageId[]).flatMap((page) =>
          locales.map((l) => ({
            loc: absolute(ROUTES[page][l], site),
            alternates: [
              ...locales.map((a) => ({ lang: a, href: absolute(ROUTES[page][a], site) })),
              { lang: 'x-default', href: absolute(ROUTES[page].el, site) },
            ],
          })),
        )
      : [];
  return new Response(sitemapXml(entries), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
