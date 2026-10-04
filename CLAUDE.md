# CLAUDE.md: Nostos

Read this file and `SPEC.md` before doing anything. `SPEC.md` is the product spec; this file is how you work on it.

## What this is

**Nostos** (νόστος, "homecoming") is a bilingual (Greek/English) static website that helps people decide whether moving to Greece makes financial sense. It is aimed at Greeks who emigrated during the crisis years and at foreigners considering the move.

Its core is a **move-to-Greece calculator** with three parts:
- an Article 5C (50% tax break) eligibility quiz;
- a Greek net-salary engine;
- a purchasing-power comparison against the user's current country.

A secondary page compares Greece with peer countries (Bulgaria, Romania, Portugal, Spain, Italy, EU average).

- Owner: Elias (product owner, Greek copy reviewer, verifier of all tax rules)
- Hosting: Cloudflare Workers with static assets, Worker name `comeback` → `comeback.<account-subdomain>.workers.dev`
- No custom domain yet. Do not hardcode any domain; use relative URLs and a single `SITE_URL` config value.

## Non-negotiable rules

1. **Never invent tax numbers.** Every Greek tax parameter lives in `src/config/greece-tax-2026.json` with `value`, `sourceUrl`, `verifiedBy`, `verifiedOn`. If you don't have a verified value, set `value: null` and `verifiedBy: null`, and add the item to `docs/open-items.md`. Do not "fill in a reasonable estimate".
2. **The production build must fail if any tax parameter is unverified.** `npm run check:params` runs as part of every `npm run build`. It fails the build only when the environment variable `NOSTOS_ENV=production` is set; without it, it prints a warning listing the unverified parameters and the build continues (so pre-launch deploys still build while parameters are `null`). Set `NOSTOS_ENV=production` in Workers Builds at launch. Dev builds show a visible red "UNVERIFIED PARAMETERS" banner.
3. **Never tell a user they ARE eligible.** Eligibility outcomes are exactly three: `likely_eligible`, `borderline`, `likely_not_eligible`. Every answer shows the rule it was judged against and a source link.
4. **No backend, no database, no cookies, no storing user input.** All calculation runs client-side. User inputs never leave the browser (the only exception is the email signup form, which posts directly to the email provider).
5. **No scraping** of Spitogatos, XE or any listing site. Rent data is entered by hand from published Spitogatos SPI figures (see SPEC §7).
6. **Greek copy is reviewed by Elias.** Any Greek string you write goes into `src/i18n/el.json` and also gets listed in `docs/greek-copy-review.md` with its key, so he can review it. Don't treat machine-drafted Greek as final.
7. Keep tax/eligibility logic in **pure TypeScript modules with no UI dependencies**, fully unit-tested.

## Stack

- **Astro** (static output) + **TypeScript** (strict)
- Interactive parts (quiz, calculator) as Astro islands; use **Preact** for small bundles
- **Charts:** Chart.js for the calculator's timeline chart (lazy-loaded inside the calculator island); server-rendered HTML/CSS bar charts (no JavaScript) for the Greece vs peers page. Every chart has a table alternative.
- **Tailwind CSS** for styling, mobile-first (most traffic will arrive from Facebook on phones). All colours, fonts and the type scale are tokens in `src/styles/tokens.css` (Tailwind's default palette is disabled); never hardcode a colour. Better/worse must never rely on colour alone.
- **Vitest** for unit tests
- **Python 3.12** for the data pipeline (`/pipeline`): standard library only (urllib, json, csv), raw SDMX/JSON calls. Unit tests: `python -m unittest discover -s pipeline/tests -p 'test_*.py'`
- **GitHub Actions** for scheduled data refresh + CI
- **Cloudflare Workers with static assets**, configured in `wrangler.jsonc` (`"assets": { "directory": "./dist", "not_found_handling": "404-page" }`). **Asset-only in v1: no Worker script**, so page requests never count against Worker quotas. Deployed via **Workers Builds** connected to the GitHub repo: build `npm run build`, deploy `npx wrangler deploy`. Do NOT use Cloudflare Pages; Cloudflare recommends Workers for new projects.
- **Cloudflare Web Analytics** (cookieless). No Google Analytics.

## Repo layout

```
/src
  /config/greece-tax-2026.json   # all tax parameters, each with source + verification
  /data/                         # generated JSON from the pipeline (committed)
  /data/manual/rent.json         # hand-entered Spitogatos figures
  /lib/tax/                      # Greek net-salary engine (pure TS)
  /lib/eligibility/              # 5C quiz logic (pure TS)
  /lib/compare/                  # purchasing-power comparison (pure TS)
  /i18n/el.json, en.json
  /components/  /pages/  /layouts/
/pipeline
  fetch_fx.py  fetch_oecd.py  fetch_eurostat.py  validate.py
/tests                           # Vitest: tax engine, eligibility, compare
/docs
  open-items.md                  # things Elias must verify or decide
  greek-copy-review.md           # Greek strings awaiting review
  sources.md                     # every data source, URL, cadence, licence
/.github/workflows
  ci.yml  data-daily.yml  data-monthly.yml
wrangler.jsonc                   # Cloudflare Workers config (static assets only)
```

## Commands

- `npm run dev`: local dev server. The calculator page has a **demo mode** toggle (synthetic params + fake data, watermarked) that exists only here; `?demo=likely_eligible&view=results` opens it directly.
- `npm run build`: build (runs `check:params`, then `astro check`, then `astro build`, then `scripts/check-no-demo.ts`, which fails if demo content reached `dist/`)
- `npm run test`: Vitest
- `npm run check:params`: lists every tax parameter with a null `value`, `sourceUrl`, `verifiedBy` or `verifiedOn`. Exits non-zero (failing the build) only when `NOSTOS_ENV=production`; otherwise it only warns.
- `python pipeline/<script>.py`: run a fetch locally; every script writes to `src/data/` only after `validate.py` passes

## i18n

- Greek is the default locale at `/`; English at `/en/`. Use Astro's built-in i18n with `prefixDefaultLocale: false`.
- No browser-language redirects. Put a visible language switch in the header.
- Every user-facing string lives in the i18n JSON files. No hardcoded copy in components.

## Data pipeline rules

- Scripts write JSON with a `fetchedAt` timestamp and `source` URL.
- `validate.py` sanity-checks every dataset before it's written (ranges, no missing countries, change vs previous value within a sane band). If validation fails, the workflow fails and nothing is committed.
- Scheduled workflows commit only when the data actually changed (every commit triggers a Workers Build; don't burn the free build allowance on no-op commits).

## Working style

- Work milestone by milestone (SPEC §12). Finish one, show Elias, then move on.
- When a decision isn't covered by SPEC.md, pick the simplest option, note it in `docs/open-items.md`, and keep going. Don't stall.
- Small commits with clear messages.
- If a rule in this file conflicts with something Elias asks for directly, ask him before proceeding.
