# Open items

Things Elias must verify or decide. Items 1–10 are copied from SPEC §13. They block launch, not development.

## From SPEC §13

1. [ ] Verify all Greek 2026 tax parameters (§6.3) against AADE; fill config with sources.
2. [ ] Resolve the 5C prior-residence window (7-of-8 vs 5 years).
3. [ ] Confirm UK / US / Australia meet the 5C cooperation condition.
4. [ ] Confirm 5C mechanics: what the 50% applies to; interaction with the tax reduction.
5. [ ] Pick two Greek net-salary calculators as the test oracle; build the 5C test cases.
6. [ ] Enter Spitogatos rent €/m² for the 4 cities (latest quarter).
7. [ ] Confirm apartment-size m² assumptions.
8. [ ] Choose email provider (Brevo vs Buttondown).
9. [ ] Review all Greek copy (`docs/greek-copy-review.md`).
10. [ ] Set up accounts: GitHub (public repo), Cloudflare (Workers, Web Analytics).

## Added during development

11. [ ] **Launch switch for `check:params`.** The build fails on unverified tax parameters only when `NOSTOS_ENV=production`. Before launch (M8), set `NOSTOS_ENV=production` as a build variable in Workers Builds. Until then, deploys build with a warning.
12. [ ] **Solidarity contribution brackets.** The config has both `solidarityContribution.appliesToEmploymentIncome` and `solidarityContribution.brackets`. If it doesn't apply, set `brackets` to `[]` with source and verification so `check:params` passes.

## Decisions made without SPEC guidance (M1)

Simplest option picked; change any of these if you disagree.

- **Node 24** (current LTS) pinned in `.nvmrc`; CI reads it.
- **TypeScript 5.9.x** (latest 5.x supported by `@astrojs/check`); **Preact 10.x** (required by `@astrojs/preact`); **Tailwind v4** via its Vite plugin (no `tailwind.config`).
- **`npm run build` also runs `astro check`** (type errors fail the build).
- **`check:params` treats a parameter as verified only when `value`, `sourceUrl`, `verifiedBy` and `verifiedOn` are all set** (CLAUDE.md originally named only `value` and `verifiedBy`).
- **Config parameters carry a `description` field** (documentation only) so each entry says what to verify and in what shape.
- **5C cooperation countries** are config parameters keyed by ISO code (`art5c.cooperationCountries.GB` etc.) whose `value` is `true`/`false`. SPEC §5.2's `.verified === true` check becomes: `value === true` and the parameter is verified.
- **Quiz Q4's 2-year minimum stay** is a config parameter too (`art5c.minimumStayYears`), since SPEC §5.1 says no thresholds are hardcoded.
- **English 404 lives at `/en/404.html`** (moved there by a small build hook) so Cloudflare's 404-page handling serves English 404s under `/en/`.
- **Language switch** goes to the other language's home page by default; pages can pass the equivalent URL (needed once Greek and English slugs differ).
- **`SITE_URL`** is read from an environment variable in `astro.config.mjs`; unset for now.
- **`wrangler` is a devDependency** so Workers Builds' `npx wrangler deploy` uses the version in the lockfile.
- **`data-daily.yml` / `data-monthly.yml` not created yet** (would run on a schedule with nothing to do); they arrive in M5.
