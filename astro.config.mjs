// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL is the single place the public origin is configured (no hardcoded domain).
// Unset until a domain is chosen; all internal links are relative.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  integrations: [preact()],
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
