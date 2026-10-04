# Data sources

Every external data source the site uses. Each entry was checked against the live API before use (SPEC §7). Tax parameter sources live in `src/config/greece-tax-2026.json`; candidate tax sources are in `docs/tax-research.md`.

| Data | Provider | Dataset / endpoint | Cadence (ours) | Output | Confirmed on |
|---|---|---|---|---|---|
| FX rates | ECB | `EXR` · `D.{GBP,USD,AUD,SEK}.EUR.SP00.A` | Daily, weekdays (`data-daily.yml`) | `src/data/fx.json` | 2026-10-04 |
| Price levels (calculator) | OECD | `OECD.SDD.TPS,DSD_PPP@DF_PPP_CPL,1.1` · measure `PL`, category `A01` (AIC), base `USA` | Monthly check (`data-monthly.yml`) | `src/data/price-levels.json` | 2026-10-04 |
| GDP per capita in PPS | Eurostat | `nama_10_pc` · `unit=CP_PPS_EU27_2020_HAB`, `na_item=B1GQ` | Monthly check | `src/data/peers.json` | 2026-10-04 |
| AIC per capita in PPS | Eurostat | `prc_ppp_ind` · `na_item=EXP_PPS_EU27_2020_HAB`, `ppp_cat=A01` | Monthly check | `peers.json` | 2026-10-04 |
| Net earnings in PPS | Eurostat | `earn_nt_net` · `currency=PPS`, `estruct=NET`, `ecase=P1_NCH_AW100` | Monthly check | `peers.json` | 2026-10-04 |
| Price level index | Eurostat | `prc_ppp_ind` · `na_item=PLI_EU27_2020`, `ppp_cat=A01` | Monthly check | `peers.json` | 2026-10-04 |
| Housing cost overburden rate | Eurostat | `ilc_lvho07a` · `unit=PC`, `age=TOTAL`, `sex=T`, `rskpovth=TOTAL` | Monthly check | `peers.json` | 2026-10-04 |
| Minimum wage in PPS | Eurostat | `earn_mw_cur` · `currency=PPS` (half-yearly) | Monthly check | `peers.json` | 2026-10-04 |
| Greek rent €/m² | Spitogatos SPI (published figures) | Manual entry, no scraping | Quarterly, by hand | `src/data/manual/rent.json` | not yet entered |

## Details

### ECB euro reference rates
- **URL:** `https://data-api.ecb.europa.eu/service/data/EXR/D.GBP+USD+AUD+SEK.EUR.SP00.A?lastNObservations=1&format=csvdata`
- **Content:** daily reference rates, published around 16:00 CET on TARGET working days. Values are units of currency per 1 EUR.
- **Licence:** ECB statistics may be reused with attribution ("Source: ECB").

### OECD price level indices
- **Dataflow:** "PPP detailed results, 2022 onwards: Price level indices" (OECD-Eurostat PPP programme).
- **Query:** `https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_PPP@DF_PPP_CPL,1.1/GRC+DEU+GBR+NLD+AUS+USA+BEL+SWE+CYP.A.PL.A01.IX.USA?startPeriod=…&format=csv`
- **Coverage:** **all 9 countries, Cyprus included** (not an OECD member, but part of the joint programme), for 2022–2024.
- **Base and year:** USA=100 is used because it is published with one decimal place; OECD=100 is rounded to 3 significant figures. Only the ratios are used, so the base doesn't change results. The fetcher takes the latest year with all 9 countries (currently 2024).
- **No published "excluding housing" index (SPEC §6.4).** The categories are A01 (AIC) and its COICOP components, with housing in A0104 "Housing, water, electricity, gas and other fuels". There is no published aggregate excluding housing or rent, so the calculator uses AIC. See `docs/open-items.md`.
- **Licence:** OECD data are free to reuse with attribution (OECD terms and conditions).

### Eurostat (peers page, SPEC §8)
- **API:** `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{code}?format=JSON&lang=EN&geo=EL&geo=BG&geo=RO&geo=PT&geo=ES&geo=IT&geo=EU27_2020&…filters`. Eurostat codes Greece as `EL`; we store it as `GR`.
- **Period:** for each indicator the fetcher uses the latest period in which every required country has a value. Indicators can therefore have different years; each one's year is stored next to it.
- **Minimum wage:** **Italy has no statutory minimum wage, and Eurostat publishes no EU27 aggregate**. Both are recorded in `notAvailable` instead of a value.
- **Licence:** Eurostat data are free to reuse with attribution ("Source: Eurostat"), under the Commission's reuse policy (CC BY 4.0).

### Spitogatos SPI (rent)
- Average **asking** rents, EUR per m² per month, for Athens, Thessaloniki, Heraklion and Patras. Entered by hand from published figures (press releases / Spitogatos Insights); never scraped.
- `pipeline/validate.py` warns, without failing, when the quarter ended more than about 4 months ago.

## Template for a new source

- **Data:** what it is and where it is used on the site
- **Provider:**
- **Dataset code / endpoint:**
- **URL:**
- **Update cadence (provider):**
- **Refresh cadence (ours):** which workflow fetches it
- **Licence / attribution required:**
- **Confirmed on:** YYYY-MM-DD, by whom
- **Notes / known limitations:**
