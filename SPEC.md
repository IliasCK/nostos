# SPEC.md: Nostos v1

## 1. Purpose and audience

Help people answer one question: **"Would I be better or worse off financially if I moved to Greece?"**

The site serves two audiences:

- **Greeks abroad** (mainly crisis-era emigrants) considering a move back. Greek-first.
- **Foreigners** considering a move to Greece. English.

The site must feel **trustworthy, not promotional and not doom-mongering**. Every number is sourced, every estimate is labelled as one, and the downsides (e.g. the year-8 tax cliff) are shown as clearly as the upsides.

## 2. Scope

### In v1
- Article 5C eligibility quiz (three-tier outcome)
- Move-to-Greece calculator (Greek net salary with/without 5C, rent, purchasing-power comparison, 7-year + cliff view)
- "Greece vs peers" comparison page
- Methodology & Sources page, Privacy page, About/Disclaimer page
- Email signup (no other lead capture)
- Greek (default) + English
- Deployed on `comeback.<account-subdomain>.workers.dev` (Cloudflare Workers, static assets only)

### Explicitly out of v1
- Tax engines for origin countries (users enter their own current net figures)
- Accountant/adviser matching or referral
- Scraping any listing site
- Personalised share images / any Worker script code (v1 is static assets only; use one static OG image per page)
- Salary-by-role data
- Custom domain
- The "remote-worker base" comparison (Greece vs Bulgaria vs Cyprus vs Portugal), parked for v2

## 3. Countries and cities

**Origin countries (calculator dropdown):** Germany, United Kingdom, Netherlands, Australia, United States, Belgium, Sweden, Cyprus.

**Greek destination cities:** Athens, Thessaloniki, Heraklion, Patras.

**Peers page countries:** Greece, Bulgaria, Romania, Portugal, Spain, Italy, EU-27 average.

## 4. Pages

| Route (EL / EN) | Page |
|---|---|
| `/` · `/en/` | Home: hook, one-line pitch, CTA to calculator, 2–3 headline peer stats |
| `/ypologistis/` · `/en/calculator/` | Quiz → inputs → results (single page, stepped) |
| `/sygkrisi/` · `/en/compare/` | Greece vs peers |
| `/methodologia/` · `/en/methodology/` | Every formula, every source, every assumption, known limitations |
| `/aporrito/` · `/en/privacy/` | Privacy: nothing stored, cookieless analytics, email provider details |
| `/sxetika/` · `/en/about/` | Who made it, disclaimer, "not tax advice" |

Slugs are suggestions. Elias may rename the Greek slugs during copy review.

## 5. Eligibility quiz (Article 5C)

### 5.1 Principles
- Outcomes: `likely_eligible`, `borderline`, `likely_not_eligible`. **Never "eligible".**
- Combination rule: any `fail` → `likely_not_eligible`; else any `borderline` → `borderline`; else `likely_eligible`.
- Each question's result card shows: the rule in plain language, the user's answer, the verdict for that rule, and a source link.
- All thresholds come from `src/config/greece-tax-2026.json` (section `art5c`). None are hardcoded.

### 5.2 Questions

**Q1. Prior Greek tax residence**
"In how many of the last [lookbackYears] years were you a tax resident of Greece?" (0 to lookbackYears, plus "not sure")
- Rule: Greek-resident years ≤ `lookbackYears − requiredNonResidentYears` → pass; otherwise fail. "Not sure" → borderline.
- ⚠️ **OPEN ITEM:** sources conflict on the window (7 of the previous 8 years vs previous 5 years). Both `lookbackYears` and `requiredNonResidentYears` are `null` until Elias verifies them against AADE.

**Q2. Country you'd move your tax residence from**
Dropdown: the 8 origin countries + "Other EU/EEA country" + "Other country".
- EU/EEA (Germany, Netherlands, Belgium, Sweden, Cyprus, Other EU/EEA) → pass.
- UK, US, Australia → pass only if `art5c.cooperationCountries.<ISO>.verified === true`, otherwise borderline.
- "Other country" → borderline.
- ⚠️ **OPEN ITEM:** confirm that the UK, US and Australia meet the administrative-cooperation condition.

**Q3. How will you earn income in Greece?**
- Employee of a Greek company → pass
- Employee of a foreign company's Greek branch / permanent establishment → pass
- Greek public sector employee → pass (expanded May 2026; verify)
- Self-employed / own business in Greece → pass
- Remote employee of a foreign company with no Greek presence → **borderline**, with a dedicated explanation: "This is the most common grey area. Get confirmation from a Greek tax adviser before relying on the 50% break."
- Not working / retired / other → fail, with note: "Article 5C covers income from work. Other regimes exist for pensioners and investors; they're not covered by this tool."

**Q4. Will you stay in Greece for at least 2 years?** Yes → pass · No → fail · Not sure → borderline.

### 5.3 Effect on calculator
- `likely_eligible` → results show **with 5C** as primary and without 5C as secondary.
- `borderline` → results show both **side by side with equal weight**, plus "verify with an adviser" note.
- `likely_not_eligible` → results show without 5C only; a collapsed "what if you did qualify" section is allowed.

## 6. Calculator

### 6.1 Inputs
| Input | Notes |
|---|---|
| Origin country | From §3 |
| Current **net** monthly take-home pay | In local currency. User enters it themselves; we don't compute foreign tax. |
| Current monthly rent | Local currency. "I own / no rent" option = 0. |
| Household | Adults (1–2), children (0–4). Affects Greek tax credits. |
| Age band | Up to 25 / 26–30 / 31 or over. Affects Greek tax rates from 2026 (youth relief). Engine value: `upTo25` \| `26to30` \| `31plus`. |
| Greek destination city | From §3 |
| Expected **gross annual** salary in Greece | EUR. Helper text explains the 14-payment system. |
| Apartment size | Studio / 1-bed / 2-bed / 3-bed → m² from config (`rent.sizes`, default proposal: 40 / 60 / 80 / 100 m², **Elias to confirm**) |

### 6.2 Outputs
1. **Greek net pay**: monthly, expressed on a 12-month basis (annual net ÷ 12), with a note on how this maps to 14 actual payments. With and without 5C per §5.3.
2. **Estimated Greek rent**: city €/m² × apartment size. Labelled "based on average *asking* rents (Spitogatos, Q_ YYYY)".
3. **Left after rent**, Greece vs current country: both in EUR at current FX, and in **purchasing-power terms** using price level indices (§7).
4. **Headline verdict**: one sentence, e.g. "In Athens you'd have about 18% more left after rent, in purchasing-power terms, during years 1–7. From year 8: about 4% less." No adjectives like "great" or "terrible".
5. **7-year timeline chart**: net pay years 1–7 (with 5C) vs year 8+ (without). The cliff must be visually obvious.
6. **Assumptions list** under the results: every parameter used, with links to the Methodology page.
7. Email signup prompt (soft, below results).

### 6.3 Greek net-salary engine (`src/lib/tax/`)
Pure function: `computeGreekNet({ grossAnnual, children, ageBand, apply5C, params }) → breakdown`.

The breakdown returns: gross, employee social contributions, taxable income, income tax before reductions, tax reduction, final income tax, any other levies, annual net, monthly net (÷12), per-payment net (÷14).

**Parameters**, all in config, **all `null` until Elias verifies them**:
- Income tax brackets and rates for employment income (tax year 2026), per number of dependent children
- Youth relief: rate overrides for ages up to 25 and 26–30, and how they combine with the children rates and with 5C
- Employee tax reduction (μείωση φόρου), including its dependence on number of children and its phase-out above an income threshold
- EFKA employee contribution rate(s) and the monthly insurable-earnings ceiling
- Special solidarity contribution: whether it currently applies to employment income at all
- Number of salary payments per year for private-sector employees (expected 14; verify)
- **5C mechanics:**
  - which items the 50% exemption applies to (income tax ± solidarity contribution; **not** social contributions, verify);
  - whether the tax reduction applies to the reduced taxable amount or is computed some other way;
  - duration in years.

**Test oracle (instead of an accountant):**
- Elias picks **two reputable Greek online net-salary calculators**. Claude Code builds ≥ 12 test cases (gross €12k / €18k / €25k / €35k / €50k / €80k × 0 and 2 children, age 31+), plus 6 youth cases with 0 children (age 26–30: €15k / €20k / €25k / €35k; age up to 25: €15k / €25k). The engine must match both calculators within **€2/month**. Record the calculator URLs and their outputs in `tests/fixtures/oracle.json`.
- **5C cases:** 6–10 hand-built cases derived from the law text by Elias, stored in `tests/fixtures/art5c.json`.

### 6.4 Purchasing-power comparison (`src/lib/compare/`)
- FX: ECB euro reference rates (covers GBP, USD, AUD, SEK; EUR countries are 1:1).
- Price levels: **OECD** price level indices / PPPs for all 9 countries (Greece + 8 origins), so one consistent source.
- Method: convert "left after rent" in each country to a common purchasing-power basis using the price level index.
- **Known limitation** (state it on the Methodology page): the general price index includes housing, and we also handle rent explicitly, so there's some overlap. If OECD or Eurostat publishes a price level index for consumption *excluding* housing/rent for all 9 countries, use that instead. Claude Code should check this and record the finding in `docs/open-items.md`.

## 7. Data sources and cadence

Claude Code must verify every dataset code / API endpoint below before relying on it, and record the confirmed ones in `docs/sources.md`.

| Data | Source | Cadence | How |
|---|---|---|---|
| FX rates | ECB reference rates | Daily | `data-daily.yml` |
| Price levels / PPP (calculator) | OECD Data Explorer (SDMX) | Check monthly; annual data | `data-monthly.yml` |
| Peers page indicators | Eurostat API (JSON) | Check monthly | `data-monthly.yml` |
| Greek rent €/m² per city | Spitogatos SPI published figures (press releases / Spitogatos Insights) | **Manual, quarterly** | Elias edits `src/data/manual/rent.json` |
| Greek tax parameters | AADE / legislation | Manual, annually | Elias edits config + sets `verifiedBy` / `verifiedOn` |

**`rent.json` shape:**
```json
{
  "quarter": "2026-Q2",
  "sourceUrl": "...",
  "basis": "average asking rent, EUR per m² per month",
  "cities": { "athens": null, "thessaloniki": null, "heraklion": null, "patras": null }
}
```
`validate.py` warns (doesn't fail) if `quarter` is more than ~4 months old. The site shows the quarter next to every rent figure.

**Validation examples:** FX rates within ±20% of the previous value; price indices present for all required countries; no nulls in generated datasets.

## 8. Greece vs peers page

Countries: GR, BG, RO, PT, ES, IT, EU-27. Charts (bar charts; Greece highlighted):
1. GDP per capita in PPS
2. Actual individual consumption per capita in PPS (with a one-line explanation of why it's the better welfare measure)
3. Net earnings (comparable household type), in PPS
4. Overall price level index
5. Housing cost overburden rate
6. Minimum wage in PPS (if a consistent Eurostat series exists)

Each chart has: a one-sentence plain-language takeaway (neutral tone), source, data year. Include at least one chart where Greece does well against the peers, if the data supports it. The page is a factual comparison, not a takedown.

## 9. Email signup

- Provider: **Brevo or Buttondown, free tier. Elias to choose** (open item).
- Double opt-in. Explicit consent checkbox (unticked by default) with text explaining what they'll receive: rule-change alerts and site updates.
- Plain HTML form posting to the provider. No third-party scripts if avoidable.
- Placement: below calculator results, footer of every page.

## 10. Non-functional

- Mobile-first; calculator fully usable at 360 px wide.
- Lighthouse ≥ 90 on performance and accessibility.
- No cookies. Cloudflare Web Analytics only.
- All charts have a text/table alternative for accessibility.
- Every page footer: "Estimates only, not tax or financial advice" + link to Methodology.
- OG image: one static image per page per language.

## 11. Disclaimers (copy requirements)

- Calculator results: "This is an estimate based on published figures and the rules as we understand them. Tax rules change, and individual circumstances differ. Confirm with a Greek tax adviser before making decisions."
- Quiz: "This checks the main published conditions. It is not a ruling. Only AADE decides eligibility."
- Rent: "Average asking rents. Actual signed rents are often lower."

Final wording goes through Elias's copy review.

## 12. Milestones

| # | Milestone | Done when |
|---|---|---|
| M1 | Scaffold | Astro + TS + Tailwind + Preact + Vitest set up; i18n routing works; `wrangler.jsonc` in place; deploys to `comeback.<account-subdomain>.workers.dev` via Workers Builds; CI runs tests |
| M2 | Tax engine | `computeGreekNet` implemented against config with null params; full test harness; `check:params` works; dev banner shows |
| M3 | Eligibility quiz | Logic + tests for every branch; UI with rule cards |
| M4 | Calculator UI | Inputs, results, timeline chart, assumptions list; works end-to-end with placeholder data in dev |
| M5 | Data pipeline | FX + OECD + Eurostat fetchers, validation, scheduled workflows committing only on change |
| M6 | Peers page | All §8 charts from live Eurostat data |
| M7 | Content | Methodology, Privacy, About; all strings in i18n; Greek copy review list complete |
| M8 | Launch check | All params verified; oracle tests pass; rent data entered; email signup live; Lighthouse targets met |

## 13. Open items for Elias (blocking launch, not development)

1. Verify all Greek 2026 tax parameters (§6.3) against AADE; fill config with sources.
2. Resolve the 5C prior-residence window (7-of-8 vs 5 years).
3. Confirm UK / US / Australia meet the 5C cooperation condition.
4. Confirm 5C mechanics: what the 50% applies to; interaction with the tax reduction.
5. Pick two Greek net-salary calculators as the test oracle; build the 5C test cases.
6. Enter Spitogatos rent €/m² for the 4 cities (latest quarter).
7. Confirm apartment-size m² assumptions.
8. Choose email provider (Brevo vs Buttondown).
9. Review all Greek copy (`docs/greek-copy-review.md`).
10. Set up accounts: GitHub (public repo), Cloudflare (Workers, Web Analytics).
