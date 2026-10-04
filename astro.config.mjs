// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import { rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// SITE_URL is the single place the public origin is configured (no hardcoded domain).
// Unset until a domain is chosen; all internal links are relative.
const site = process.env.SITE_URL || undefined;

// Cloudflare's "404-page" handling serves the nearest 404.html up the path, so the
// English 404 must be at dist/en/404.html. Astro emits it as en/404/index.html.
/** @type {import('astro').AstroIntegration} */
const localized404 = {
  name: 'localized-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const out = fileURLToPath(dir);
      await rename(`${out}en/404/index.html`, `${out}en/404.html`);
      await rm(`${out}en/404`, { recursive: true });
    },
  },
};

// Unless SITE_INDEXABLE is exactly "true", also send X-Robots-Tag: noindex on every
// response (Workers static assets read dist/_headers). Pages carry a noindex meta tag
// and robots.txt disallows everything too (src/lib/seo.ts).
/** @type {import('astro').AstroIntegration} */
const noindexHeaders = {
  name: 'noindex-headers',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (process.env.SITE_INDEXABLE === 'true') return;
      await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

export default defineConfig({
  site,
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [preact(), localized404, noindexHeaders],
  i18n: {
    locales: ['el', 'en'],
    defaultLocale: 'el',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
