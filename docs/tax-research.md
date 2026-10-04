# Tax research: candidate values for 2026

Research aid for Elias. **Nothing here is in the config.** Each row is a *candidate* for you to check against the primary source and then enter in `src/config/greece-tax-2026.json` with `sourceUrl`, `verifiedBy` and `verifiedOn`.

Compiled by Claude Code on 2026-10-04.

**How to read the source labels**
- **Primary:** law text / ΦΕΚ, AADE, e-ΕΦΚΑ, Ministry of Finance.
- **Primary (mirror):** an official text (law article, AADE circular) as reproduced on taxheaven.gr. aade.gr and several publisher sites returned *HTTP 403* to automated fetching, so I could not read the original PDFs myself. Please open the original.
- **Secondary:** press, accounting firms, calculator sites. Treat as leads, not sources.
- **From memory:** I could not find a source in this session; listed only so you know what to check.

**Confidence** is my confidence that the candidate is right for tax year 2026, *not* a verification.

---

## 1. Income tax scale (`incomeTax.brackets`)

Law **5246/2025** (ΦΕΚ Α' 198/2025), article 3, amending art. 15 par. 1 ΚΦΕ. Applies to income earned from tax year 2026.

Candidate (rates as fractions, `upTo` in EUR of taxable income per year):

| Taxable income | 0 children | 1 child | 2 children | 3 children | 4 children |
|---|---|---|---|---|---|
| 0 – 10,000 | 0.09 | 0.09 | 0.09 | 0.09 | **0** |
| 10,000.01 – 20,000 | 0.20 | 0.18 | 0.16 | 0.09 | **0** |
| 20,000.01 – 30,000 | 0.26 | 0.24 | 0.22 | 0.20 | 0.18 |
| 30,000.01 – 40,000 | 0.34 | 0.34 | 0.34 | 0.34 | 0.34 |
| 40,000.01 – 60,000 | 0.39 | 0.39 | 0.39 | 0.39 | 0.39 |
| over 60,000 | 0.44 | 0.44 | 0.44 | 0.44 | 0.44 |

- **Confidence:** high for the 0-children scale and the second-bracket child rates. Medium for the third-bracket child rates and the 4-children row: summaries differ on whether "4+" zeroes the *first two* brackets or only the second.
- **Sources:**
  - Law text, art. 3 ν. 5246/2025 (Primary (mirror)): https://www.taxheaven.gr/law/5246/2025/article/3/view. Quoted wording: «γ) Ο φορολογικός συντελεστής των δύο πρώτων κλιμακίων της περ. α) για φορολογούμενους με τέσσερα (4) ή περισσότερα εξαρτώμενα τέκνα είναι μηδέν (0).»
  - AADE circular Ε.3068/18-11-2025 (Primary (mirror)): https://www.taxheaven.gr/circulars/51509/o-3068-2025
  - ΦΕΚ on AADE (Primary, blocked to me): https://www.aade.gr/sites/default/files/2025-11/%CE%91%CE%A0%CE%9F%CE%A3%CE%A0%CE%91%CE%A3%CE%9C%CE%91%20%CE%A6%CE%95%CE%9A%20%CE%91%20198_2025%20%CE%9D%205246_2025.pdf
  - OECD *Taxing Wages 2026*, Greece (Secondary): https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en/full-report/greece_027f4efa.html
- **Conflicts:**
  - One automated summary of Ε.3068/2025 said "3+ children: 0% on both first and second brackets". The law text quoted above says that applies to **4+**, and 3 children get 9% in the second bracket. Go with the law text.
  - The law adds −2 percentage points per child above 4 in the third bracket. That's out of scope here, because the calculator allows 0–4 children.

## 2. Youth relief (`incomeTax.youthRelief.upTo25`, `incomeTax.youthRelief.26to30`)

Same article (art. 15 par. 1 περ. ε ΚΦΕ as amended):

> «ε) Ο φορολογικός συντελεστής των δύο πρώτων κλιμακίων της περ. α), για φορολογητέο εισόδημα έως είκοσι χιλιάδες (20.000) ευρώ για νέους σε ηλικία φορολογούμενους είναι: εα) μηδέν (0) για φορολογούμενους έως είκοσι πέντε (25) ετών και εβ) εννέα τοις εκατό (9%) για φορολογούμενους από είκοσι έξι (26) έως τριάντα (30) ετών»

| Parameter | Candidate | Confidence |
|---|---|---|
| `upTo25` | `[{ "from": 0, "upTo": 20000, "rate": 0 }]` | High |
| `26to30` | `[{ "from": 0, "upTo": 20000, "rate": 0.09 }]` (the first bracket is already 9%, so `from: 10000` is equivalent) | High |

- **Sources:** as section 1 (law text and Ε.3068/2025, Primary (mirror)). Ministry of Finance announcement (Primary, not read in full): https://minfin.gov.gr/foroelafrynseis-kai-metra-stirixis-tis-koinonias-fernei-to-nomoschedio-tis-deth/
- **How age is counted (affects the UI's age-band question, not the config):**
  - Secondary sources say age is judged by year of birth for the tax year. So for 2026, "up to 25" means born 2001 or later, and 26–30 means born 1996–2000.
  - Sources (Secondary): https://www.cnn.gr/oikonomia/chrima/story/494435/gia-poious-neous-ergazomenous-tha-einai-midenikos-o-foros-to-etisio-ofelos-ana-ilikia and https://www.e-forologia.gr/cms/viewContents.aspx?id=236702
  - Another secondary source says "up to 25 on 1/1/2026".
  - **Confidence: low.** I found no primary text defining it. Please check the circular.

## 3. Youth relief vs children relief (`incomeTax.youthChildrenInteraction`)

- **Candidate:** `"lowest_rate_per_range"`.
- **Why:**
  - Per the law-text mirror, the 26–30 clause gives 9% *"unless the 4+ children clause applies"* (which gives 0%). In other words, the lower rate wins within each bracket.
  - Youth relief only covers income up to €20,000. The children rates of the third bracket (24/22/20/18%) would then still apply above that, which is what per-range combining gives.
  - One automated summary of circular Ε.3068/2025 described the rule as "the taxpayer receives the most favourable rate". I could not confirm that exact sentence in the text.
- **Confidence:** medium.
- **Sources:** law art. 3 ν. 5246/2025 and Ε.3068/2025 (Primary (mirror)), links in section 1.
- **Alternative:** `"lower_total_tax"` would only differ from this when someone aged up to 30 with children earns over €20,000.

## 4. Employee tax reduction, art. 16 ΚΦΕ (`taxReduction.*`)

Art. 16 as amended by **ν. 5045/2023** art. 43, applying from tax year 2024. I found no change for 2026 in ν. 5246/2025.

| Parameter | Candidate | Confidence |
|---|---|---|
| `baseAmountByChildren` | `{ "0": 777, "1": 900, "2": 1120, "3": 1340, "4": 1580 }` | High |
| `phaseOutThreshold` | `12000` | High |
| `phaseOutRate` | `0.02` (€20 per €1,000) | High |
| `phaseOutMethod` | `"continuous"`? See below | **Low** |

- **Sources:**
  - Art. 16 ΚΦΕ consolidated text (Primary (mirror)): https://www.taxheaven.gr/law/4172/2013/arthro/16. Its wording: «το ποσό της μείωσης μειώνεται κατά είκοσι (20) ευρώ ανά χίλια (1.000) ευρώ» for employment/pension income above €12,000. It does not apply with 5+ children.
  - Draft-law article on opengov (Primary): https://www.opengov.gr/minfin/?p=8993
- **Conflict on `phaseOutMethod`:**
  - One secondary explainer says only *complete* thousands count (so €3,500 over the threshold costs €60, not €70).
  - I believe most payroll software and calculators apply it pro rata, but I couldn't find a primary text either way.
  - **Your oracle calculators will settle this:** run one case at, say, €15,500 taxable.
  - Note: older (pre-2024) amounts 777/810/900/1,120/1,340 still circulate in secondary sources. Don't use them.

## 5. EFKA employee contributions (`efka.*`)

| Parameter | Candidate | Confidence |
|---|---|---|
| `monthlyInsurableCeiling` | `7761.94` (from 1/1/2026; ΥΑ Δ.15/Δ΄/1865/23-01-2026, e-ΕΦΚΑ circular 4/2026; +2.5% on 2025's 7,572.62) | **High** |
| `employeeRate` | `0.1337` (13.37%, standard private-sector employee, main + supplementary + health + unemployment) | Medium |

- **Ceiling sources:**
  - e-ΕΦΚΑ FAQ (Primary), which states «από 01/01/2026 7.761,94 €» citing Δ.15/Δ΄/1865/23-01-2026: https://www.e-efka.gov.gr/el/sychnes-eroteseis/asphalisi-eisphores/asphalismenoi/misthotoi-0/genikes-eroteseis
  - Circular 4/2026 summary (Secondary): https://www.taxheaven.gr/news/72721/plafon-asfalistewn-apodoxwn-eisfores-gia-titloys-kthshs-kai-posa-asfalistikwn-kathgoriwn-h-nea-egkyklios-e-efka-gia-to-2026
- **Rate sources:**
  - Calculator sites agree on 13.37% in total (Secondary): https://katharosmisthos.gr/blog/eisfores-efka-2026-odigos
  - Health share from e-ΕΦΚΑ circular 38/2024 (Primary (mirror)): employee 1.65% in kind + 0.40% cash = **2.05%** from 1/1/2025 (ν. 5162/2024 art. 12): https://www.taxheaven.gr/circulars/49116/egkyklios-e-efka-38-2024
- **Conflicts on the rate:**
  - Secondary sources give *different per-branch breakdowns that both sum to 13.37%*. One gives health 2.55%; another gives supplementary 3.00% and health 2.05%.
  - The authoritative source is e-ΕΦΚΑ's ΚΠΚ rate table (Excel, "Εγκύκλιοι" section of e-efka.gov.gr), package **ΚΠΚ 101** for a standard private-sector employee. Please read the employee total there.
  - Some employee groups (e.g. heavy/unhealthy occupations) have different packages. The calculator assumes the standard one.
- **Open, not modelled (as agreed): ceiling on bonus payments.** The engine applies the ceiling to each of 14 equal payments. In practice the Christmas bonus, Easter bonus and holiday allowance may each have their own ceiling (I have seen claims of half the monthly ceiling for the Easter bonus and holiday allowance, but found no primary source). This only matters for gross pay above roughly €7,762 × 14 ≈ €108.7k a year.

## 6. Solidarity contribution (`solidarityContribution.*`)

| Parameter | Candidate | Confidence |
|---|---|---|
| `appliesToEmploymentIncome` | `false` | High |
| `brackets` | `[]` | High (follows from the above) |

- **Source:** **ν. 4972/2022** abolished the special solidarity contribution (art. 43A ΚΦΕ) for all income earned from 1/1/2023. Secondary reports:
  - https://www.cnn.gr/oikonomia/chrima/story/329358/telos-kai-me-ti-voyla-i-eisforas-allileggyis-gia-oloys-apo-to-2023
  - https://www.odigostoupoliti.eu/katargeitai-eidiki-eisfora-allilengyis-apo-01-01-2023/
  - Please cite the ΦΕΚ of ν. 4972/2022 itself.

## 7. Payments per year (`salaryPaymentsPerYear`)

- **Candidate:** `14`. This is 12 monthly salaries + Christmas bonus (1 month) + Easter bonus (½) + holiday allowance (½).
- **Confidence:** high that this is standard for private-sector monthly-paid employees.
- **Source:** from memory (ν. 4504/1966 and ΚΥΑ 19040/1981 for the bonuses). Please cite. The engine treats them as 14 equal payments, which is how most net-salary calculators present it.

## 8. Article 5C (`art5c.*`)

Article 5Γ ΚΦΕ (added by ν. 4714/2020; amended since).

| Parameter | Candidate | Confidence | Notes |
|---|---|---|---|
| `exemptionRate` | `0.5` | High | |
| `exemptionAppliesTo` | `["incomeTax", "solidarityContribution"]` | High | Law wording: exempt «από τον φόρο εισοδήματος και την ειδική εισφορά αλληλεγγύης». Solidarity is abolished anyway (section 6), so this makes no difference in 2026. Social contributions are **not** covered. |
| `exemptionMethod` | `"exempt_share_of_income"` | Medium–high | See conflict below |
| `exemptionBase` | `"net_of_employee_contributions"` | **Low** | See below |
| `reductionPhaseOutIncome` | `"after_exemption"`? | **Low** | No source found |
| `reductionOrder` | not needed if `exemptionMethod` is `exempt_share_of_income` | – | |
| `youthReliefInteraction` | **no candidate** | – | No source found; see below |
| `durationYears` | `7` | High | |
| `lookbackYears` | `6` | Medium–high | See below; this **resolves SPEC open item 2 differently** |
| `requiredNonResidentYears` | `5` | Medium–high | |
| `minimumStayYears` | `2` | High | |
| `cooperationCountries.GB/US/AU` | `true`? | Low–medium | See below |

**Sources for 5C**
- AADE FAQ on 5Γ applications, 02-10-2025 (Primary): https://www.aade.gr/sites/default/files/2025-10/FAQS_5G_KFE.pdf. Also mirrored at https://www.taxheaven.gr/circulars/51379/syxnes-erwthseis-apanthseis-ypobolh-aithshs-ypagwghs-se-eidiko-tropo-forologhshs-aroro-5g-toy-kfe. It covers:
  - not resident in Greece for **five of the six years** before the move;
  - moving from the EU/EEA or a state with an administrative-cooperation agreement in force;
  - a declaration to stay **at least two years**;
  - work for a Greek entity or a Greek permanent establishment of a foreign enterprise;
  - **50% of income** exempt.
- AADE circular **Ε.2224/03-12-2021** (Primary (mirror)): https://www.taxheaven.gr/news/57208/nea-oesh-ergasias-kai-forologhsh-logw-metaforas-forologikhs-katoikias-sthn-ellada-egkyklios-aade. It says:
  - 50% of employment income earned in Greece is exempt from income tax and the solidarity contribution;
  - **the remaining 50% is taxed on the normal art. 15 scale**;
  - the employer withholds only on the taxable 50%;
  - the regime lasts 7 years.
- AADE guide to the 5A/5B/5Γ incentives (Primary, blocked to me): https://www.aade.gr/sites/default/files/2023-09/forolologika_kinitra_pros_newn_forol_kat_kfe_new_EL.pdf

**Conflicts and open points**
- **`exemptionMethod`:**
  - The AADE FAQ and Ε.2224/2021 say 50% of the *income* is exempt and the rest is taxed on the scale (`exempt_share_of_income`).
  - At least one calculator site says "100% of the income is taxed normally but only 50% of the tax is paid" (`reduce_tax_by_share`), Secondary: https://katharosmisthos.gr/blog/arthro-5g-apalagi-forou
  - The two give very different results on a progressive scale. The AADE wording favours `exempt_share_of_income`.
- **`exemptionBase`:**
  - AADE says "50% of income from employment" (εισόδημα από μισθωτή εργασία).
  - Whether that is before or after the employee's EFKA contributions is not stated in anything I read.
  - My lead is "after", because taxable employment income in the ΚΦΕ is normally net of employee contributions. Ask an adviser or check ΔΕΑΦ rulings.
- **`reductionPhaseOutIncome`:** no source found. If the exempt 50% is outside taxable income, the art. 16 phase-out would naturally be measured on the remaining taxable 50% (`after_exemption`), but that is my inference.
- **Prior-residence window (SPEC §5.2 open item):**
  - Both AADE sources say **5 of the previous 6 years**.
  - The "7 of 8" figure in SPEC looks like it comes from **art. 5Β** (investors), not 5Γ. Worth confirming, then setting `lookbackYears: 6`, `requiredNonResidentYears: 5`.
- **Cooperation countries (UK / US / Australia):**
  - The condition is "a state with which an agreement on administrative cooperation in tax matters is in force".
  - From memory: all three are parties to the OECD/CoE Multilateral Convention on Mutual Administrative Assistance in Tax Matters (the US only to the original 1988 text). Greece also has bilateral tax treaties with the UK and the US.
  - I found no AADE statement naming these countries. Low–medium confidence; ideally get an AADE answer or adviser opinion per country.
- **Youth relief vs 5C (`art5c.youthReliefInteraction`):** no source found in either direction. Nothing I read says whether a 5C taxpayer under 31 gets the youth rates on the taxable 50%. This genuinely needs an AADE answer or adviser.
- **Remote work for a foreign employer (quiz Q3, M3):** the AADE FAQ requires employment with a Greek entity or a Greek permanent establishment. That supports SPEC's "borderline" treatment of remote work.
- **Public-sector employees (quiz Q3, M3):** e-forologia reports a ruling on 5Γ for a newly appointed civil servant (Secondary): https://www.e-forologia.gr/cms/viewContents.aspx?id=238431. Check the May 2026 change before M3.

## 9. Things the calculator does *not* model (for the methodology page)

- **Withholding vs annual tax.** The engine computes the annual tax liability. Calculators that show the monthly withholding (ΦΜΥ) can differ slightly from it, so keep this in mind when entering the oracle values.
- **Bonus-payment EFKA ceilings.** See section 5.
- **Age changes during the 7-year timeline.** Someone aged 24 at the move leaves the youth band during the period. The engine holds the age band constant (see the M2 summary).
