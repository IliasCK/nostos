# Open items

Things Elias must verify or decide. Items 1–10 are copied from SPEC §13. They block launch, not development.

## From SPEC §13

1. [ ] Verify all Greek 2026 tax parameters (§6.3) against AADE; fill config with sources.
2. [ ] Resolve the 5C prior-residence window (7-of-8 vs 5 years). See item 14: AADE says 5 of 6.
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

13. [ ] **Open tax-mechanics switches** (all `null` in config; candidates and sources in `docs/tax-research.md`):
    - `art5c.exemptionMethod`: is 50% of the *income* exempt, or is the *tax* halved?
    - `art5c.exemptionBase`: 50% of gross, or of gross minus employee EFKA?
    - `art5c.reductionPhaseOutIncome`: is the art. 16 phase-out measured on income after or before the 5C exemption?
    - `art5c.reductionOrder`: only if the tax is halved; is the reduction applied before or after halving?
    - `art5c.youthReliefInteraction`: do youth rates stack with 5C, not apply, or apply only if they're the better option?
    - `incomeTax.youthChildrenInteraction`: lowest rate per range, or lower total tax?
    - `taxReduction.phaseOutMethod`: pro rata, or per complete €1,000?
14. [ ] **5C prior-residence window.** AADE's 5Γ FAQ (02-10-2025) and circular Ε.2224/2021 say *5 of the previous 6 years*, not 7-of-8 or 5 (see `docs/tax-research.md` §8). This would also change SPEC §5.2.
15. [ ] **How age is counted** for the age band (year of birth vs exact age). This decides the wording of the age question in M4.
16. [ ] **EFKA ceiling on bonus payments** (Christmas/Easter/holiday). Not modelled: the engine applies the monthly ceiling to 14 equal payments. Only matters above about €108k gross.

17. [ ] **Two new quiz parameters** (null): `art5c.euEeaQualifies` (the source for the EU/EEA pass in Q2) and `art5c.qualifyingWorkTypes` (Q3). Until `qualifyingWorkTypes` is verified, every Q3 answer is borderline, including "not working".
18. [ ] **Quiz entry point.** Nothing links to `/ypologistis/` yet; the home page CTA is planned for M7.

## Decisions made without SPEC guidance (M3)

- **"Verified" in the quiz means all four fields are set** (the same rule as `check:params` and the banner). A rule that isn't fully verified is borderline with "rule not yet verified", never pass. The tax engine is looser on purpose: it needs only `value`, so M4 can show placeholder figures in dev.
- **Q1 and Q4 are skipped in the UI while `lookbackYears` / `minimumStayYears` is null.** Their wording needs the number, and I won't hardcode a fallback. Their result cards say "Not asked" and "Rule not yet verified". Once a value is entered (even unverified), the question is asked; it stays borderline until verified.
- **Q2:**
  - The EU/EEA membership of the listed countries is in code (geography).
  - Whether EU/EEA origin qualifies is the config parameter `art5c.euEeaQualifies`. If it is verified as false, the result is fail.
  - UK/US/AU set to verified false give borderline (SPEC: "otherwise borderline"), with a note.
- **Q3:**
  - A work type left out of the verified `qualifyingWorkTypes` list fails.
  - The remote-work and not-working notes are shown even while the rule is unverified.
- **Quiz answers out of range throw** (a programming error, since the UI only offers valid answers).
- **For M4:** the island takes `onComplete(result, answers)`. M4's calculator island will embed `<EligibilityQuiz>` and receive the outcome directly, with no global state.
- **Only the `art5c` parameters (without descriptions) and the `quiz.*` strings are sent to the browser** as island props.
- **Calculator page routes are `/ypologistis/` and `/en/calculator/`**, with the language switch linking the two.
- **UI tests use happy-dom + @testing-library/preact** (devDependencies).

## Decisions made without SPEC guidance (M2)

- **Config schema changes:**
  - `incomeTax.brackets` is one scale per number of children (0–4).
  - `art5c.taxReductionInteraction` was replaced by two switches, `art5c.reductionPhaseOutIncome` and `art5c.reductionOrder`, because the question depends on the 5C method.
  - `taxReduction.phaseOutRate` is now euros per euro (€20 per €1,000 = 0.02).
- **New config switch `art5c.exemptionMethod`.** Sources disagree on whether 5C halves the income or the tax.
- **Settled assumptions in the engine:**
  - taxable income = gross − employee EFKA;
  - final tax = max(0, tax − reduction);
  - the EFKA ceiling applies to each of `salaryPaymentsPerYear` equal payments;
  - amounts are rounded to cents only in the output.
- **The engine computes the annual tax liability, not the monthly withholding (ΦΜΥ).**
- **The engine only requires the parameters a calculation uses.** For example, it doesn't need 5C parameters when 5C is off, or solidarity brackets when solidarity doesn't apply. If a switch is null, it lists every parameter that switch could require.
- **Age band is constant across the timeline.** Someone aged 24 at the move is treated as up to 25 for all 8 years. M4 could ask for the birth year instead.
- **Youth oracle cases** (all 0 children):
  - 26–30 at €15k, €20k, €25k and €35k (these straddle the €10–20k relief range);
  - up to 25 at €15k and €25k.
- **`check:params` is TypeScript** (`scripts/check-params.ts`, run natively by Node 24). It shares its rule with the dev banner via `src/lib/params/verification.ts`.
- **The banner counts *all* unverified parameters** (including quiz-only ones such as `minimumStayYears`), the same as `check:params`.

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
