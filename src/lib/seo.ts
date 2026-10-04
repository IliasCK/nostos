// Indexing rules. The workers.dev preview must never be indexed: unless
// SITE_INDEXABLE is exactly "true", every page gets noindex, robots.txt
// disallows everything and an X-Robots-Tag header is sent.

export function isIndexable(env: Record<string, string | undefined>): boolean {
  return env.SITE_INDEXABLE === 'true';
}

/** SITE_URL without a trailing slash, or null when unset. */
export function siteUrl(env: Record<string, string | undefined>): string | null {
  const url = env.SITE_URL?.trim();
  return url ? url.replace(/\/+$/, '') : null;
}

export function robotsTxt(indexable: boolean, site: string | null): string {
  if (!indexable) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`;
}

/** Absolute URL when SITE_URL is known, otherwise the path itself. */
export function absolute(path: string, site: string | null): string {
  return site ? `${site}${path}` : path;
}

export function sitemapXml(paths: { loc: string; alternates: { lang: string; href: string }[] }[]): string {
  const urls = paths
    .map(
      (p) =>
        `  <url>\n    <loc>${p.loc}</loc>\n${p.alternates
          .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`)
          .join('\n')}\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

/** Fails a build that asks to be indexed without a SITE_URL (hreflang, canonical and sitemap need it). */
export function assertSeoConfig(env: Record<string, string | undefined>): void {
  if (isIndexable(env) && !siteUrl(env)) throw new Error('SITE_INDEXABLE=true requires SITE_URL to be set');
}
