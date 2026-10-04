// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import { rename, rm } from 'node:fs/promises';
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

export default defineConfig({
  site,
  output: 'static',
  integrations: [preact(), localized404],
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
