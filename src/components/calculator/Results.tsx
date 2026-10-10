import type { ComponentChildren } from 'preact';
import type { CalculatorInputs } from '../../lib/calculator/inputs';
import type { Comparison, Results as ResultsModel } from '../../lib/calculator/results';
import type { ChangeDirection } from '../../lib/compare';
import { currencyOf, type FxFile, type Lookup, type PriceLevelsFile } from '../../lib/data';
import { getParam } from '../../lib/params/verification';
import type { GreekNetBreakdown, ParamsProblem, Timeline } from '../../lib/tax';
import TimelineChart from './TimelineChart';
import { dataLabel, paramLabel, type Format, type Text } from './text';

interface Props {
  t: Text;
  format: Format;
  results: ResultsModel;
  inputs: CalculatorInputs;
  params: unknown;
  fx: Lookup<FxFile>;
  priceLevels: Lookup<PriceLevelsFile>;
  methodologyHref: string;
}

const ICON: Record<ChangeDirection, string> = { more: '▲', less: '▼', same: '≈' };

export default function Results({ t, format, results, inputs, params, fx, priceLevels, methodologyHref }: Props) {
  const { mode, without5C, timeline } = results;
  const cityIn = t(`calc.city.${inputs.city}.in`);
  const country = t(`quiz.origin.${inputs.origin}`);
  const change = (c: { direction: ChangeDirection; pct: number }) => t(`calc.change.${c.direction}`, { pct: c.pct });
  const year1With5C = timeline.ok ? timeline.years[0]!.with5C : null;

  // What the primary display needs; if it is unavailable, show the unverified panel.
  const primaryProblem: ParamsProblem | null =
    mode === 'without5C_only' ? (without5C.ok ? null : without5C) : !without5C.ok ? without5C : null;
  const fiveCProblem: ParamsProblem | null = timeline.ok ? null : timeline;

  return (
    <div class="space-y-10">
      {results.headline && (
        <section aria-label={t('calc.results.title')} class="rounded-lg border-l-4 border-accent bg-accent-soft p-5 sm:p-6" data-testid="headline">
          {results.headline.kind === 'with5C' ? (
            <>
              <p class="font-serif text-2xl leading-snug sm:text-3xl">
                <span aria-hidden="true" class="mr-2 text-accent">{ICON[results.headline.during.direction]}</span>
                {t(results.headline.averaged ? 'calc.headline.with5c.averaged' : 'calc.headline.with5c', {
                  cityIn,
                  change: change(results.headline.during),
                  duration: results.headline.durationYears,
                })}
              </p>
              <p class="mt-3 font-serif text-xl sm:text-2xl">
                <span aria-hidden="true" class="mr-2 text-accent">{ICON[results.headline.after.direction]}</span>
                {t('calc.headline.cliff', { cliffYear: results.headline.cliffYear, change: change(results.headline.after) })}
              </p>
            </>
          ) : (
            <p class="font-serif text-2xl leading-snug sm:text-3xl">
              <span aria-hidden="true" class="mr-2 text-accent">{ICON[results.headline.change.direction]}</span>
              {t('calc.headline.without5c', { cityIn, change: change(results.headline.change) })}
            </p>
          )}
        </section>
      )}

      {mode === 'side_by_side' && <p class="rounded-md border-l-4 border-caution bg-caution-soft p-3 text-caution">{t('calc.borderlineNote')}</p>}

      <Section title={t('calc.net.title')}>
        {primaryProblem ? (
          <Unverified t={t} problem={primaryProblem} />
        ) : (
          <>
            {mode === 'with5C_primary' && (
              <>
                {year1With5C ? (
                  <Figure t={t} format={format} label={t('calc.net.with5c')} breakdown={year1With5C} big />
                ) : (
                  <Unverified t={t} problem={fiveCProblem!} compact />
                )}
                {without5C.ok && <Figure t={t} format={format} label={t('calc.net.without5c')} breakdown={without5C.breakdown} />}
              </>
            )}
            {mode === 'side_by_side' && (
              <div class="grid gap-4 sm:grid-cols-2">
                {year1With5C ? (
                  <Figure t={t} format={format} label={t('calc.net.with5c')} breakdown={year1With5C} big card />
                ) : (
                  <Unverified t={t} problem={fiveCProblem!} compact />
                )}
                {without5C.ok && <Figure t={t} format={format} label={t('calc.net.without5c')} breakdown={without5C.breakdown} big card />}
              </div>
            )}
            {mode === 'without5C_only' && without5C.ok && (
              <Figure t={t} format={format} label={t('calc.net.without5c')} breakdown={without5C.breakdown} big />
            )}
            {without5C.ok && (
              <p class="text-sm text-muted">
                {t('calc.net.basisNote', {
                  payments: without5C.breakdown.paymentsPerYear,
                  perPayment: format.money((mode !== 'without5C_only' && year1With5C ? year1With5C : without5C.breakdown).perPaymentNet),
                })}
              </p>
            )}
            {without5C.ok && (
              <Breakdown t={t} format={format} b={mode !== 'without5C_only' && year1With5C ? year1With5C : without5C.breakdown} />
            )}
          </>
        )}
      </Section>

      {mode !== 'without5C_only' && timeline.ok && <TimelineChart t={t} format={format} timeline={timeline} />}

      {mode === 'without5C_only' && (
        <details class="rounded-lg border border-line bg-surface p-4" data-testid="what-if">
          <summary class="cursor-pointer font-serif text-lg font-semibold">{t('calc.net.whatIf')}</summary>
          <div class="mt-4 space-y-6">
            {timeline.ok && year1With5C ? (
              <>
                <Figure t={t} format={format} label={t('calc.net.with5c')} breakdown={year1With5C} />
                <TimelineChart t={t} format={format} timeline={timeline} />
              </>
            ) : (
              <Unverified t={t} problem={fiveCProblem!} compact />
            )}
          </div>
        </details>
      )}

      <Section title={t('calc.rent.title')}>
        {results.rent.status === 'ok' ? (
          <div>
            <p class="text-figure font-serif font-semibold">
              {format.money(results.rent.value.monthly)} <span class="font-sans text-base font-normal text-muted">{t('calc.net.perMonth')}</span>
            </p>
            <p class="mt-1 text-sm text-muted">
              {format.money(results.rent.value.eurPerM2, 'EUR', 2)}/m² × {results.rent.value.m2} m², {t('calc.rent.label', { quarter: results.rent.value.quarter })}
            </p>
            <p class="mt-2 text-sm">{t('calc.rent.disclaimer')}</p>
          </div>
        ) : (
          <Unavailable t={t} missing={results.rent.missing} />
        )}
      </Section>

      <Section title={t('calc.compare.title', { country })}>
        {results.comparisonData.status !== 'ok' ? (
          <Unavailable t={t} missing={results.comparisonData.missing} />
        ) : (
          <div class="space-y-6">
            {mode !== 'without5C_only' && results.comparisonWith5C && timeline.ok && (
              <CompareTable
                t={t}
                format={format}
                inputs={inputs}
                country={country}
                title={t(results.headline?.kind === 'with5C' && results.headline.averaged ? 'calc.compare.scenario.with5c.averaged' : 'calc.compare.scenario.with5c', {
                  duration: (timeline as Timeline).durationYears,
                })}
                comparison={results.comparisonWith5C}
              />
            )}
            {mode !== 'without5C_only' && results.comparisonCliff && timeline.ok && (
              <CompareTable
                t={t}
                format={format}
                inputs={inputs}
                country={country}
                title={t('calc.compare.scenario.cliff', { cliffYear: (timeline as Timeline).cliffYear })}
                comparison={results.comparisonCliff}
              />
            )}
            {(mode === 'without5C_only' || !timeline.ok) && results.comparisonWithout5C && (
              <CompareTable
                t={t}
                format={format}
                inputs={inputs}
                country={country}
                title={t('calc.compare.scenario.without5c')}
                comparison={results.comparisonWithout5C}
              />
            )}
            {!results.comparisonWithout5C && !results.comparisonWith5C && <Unverified t={t} problem={primaryProblem ?? fiveCProblem!} compact />}
            <p class="text-sm text-muted">{t('calc.compare.pppNote')}</p>
          </div>
        )}
      </Section>

      <Assumptions t={t} format={format} results={results} inputs={inputs} params={params} fx={fx} priceLevels={priceLevels} methodologyHref={methodologyHref} />

      <p class="text-sm text-muted">{t('calc.disclaimer')}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <section class="space-y-4">
      <h3 class="text-2xl">{title}</h3>
      {children}
    </section>
  );
}

function Figure({
  t,
  format,
  label,
  breakdown,
  big = false,
  card = false,
}: {
  t: Text;
  format: Format;
  label: string;
  breakdown: GreekNetBreakdown;
  big?: boolean;
  card?: boolean;
}) {
  return (
    <div class={card ? 'rounded-lg border border-line bg-surface p-4' : ''} data-testid="net-figure">
      <p class="text-sm font-medium text-muted">{label}</p>
      <p class={`font-serif font-semibold ${big ? 'text-figure sm:text-figure-lg' : 'text-2xl'}`}>
        {format.money(breakdown.monthlyNet)} <span class="font-sans text-base font-normal text-muted">{t('calc.net.perMonth')}</span>
      </p>
      <p class="text-sm text-muted">{t('calc.net.annual', { amount: format.money(breakdown.annualNet) })}</p>
    </div>
  );
}

function Breakdown({ t, format, b }: { t: Text; format: Format; b: GreekNetBreakdown }) {
  const rows: [string, number, boolean?][] = [
    ['calc.breakdown.gross', b.grossAnnual],
    ['calc.breakdown.contributions', -b.employeeContributions],
    ['calc.breakdown.taxable', b.taxableIncome, true],
    ...(b.art5cExemptIncome > 0 ? ([['calc.breakdown.exempt', b.art5cExemptIncome]] as [string, number][]) : []),
    ['calc.breakdown.taxBefore', b.incomeTaxBeforeReduction],
    ['calc.breakdown.reduction', -b.taxReduction],
    ...(b.art5cTaxRelief > 0 ? ([['calc.breakdown.relief', -b.art5cTaxRelief]] as [string, number][]) : []),
    ['calc.breakdown.finalTax', -b.finalIncomeTax, true],
    ...(b.otherLeviesTotal > 0 ? ([['calc.breakdown.solidarity', -b.otherLeviesTotal]] as [string, number][]) : []),
    ['calc.breakdown.net', b.annualNet, true],
  ];
  return (
    <details class="rounded-md border border-line bg-surface p-3">
      <summary class="cursor-pointer font-medium">{t('calc.breakdown.title')}</summary>
      <table class="mt-3 w-full text-sm">
        <tbody>
          {rows.map(([key, value, strong]) => (
            <tr class="border-b border-line last:border-0">
              <th scope="row" class={`py-1 pr-3 text-left ${strong ? 'font-semibold' : 'font-normal'}`}>
                {t(key)}
              </th>
              <td class={`py-1 text-right ${strong ? 'font-semibold' : ''}`}>{format.money(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

function CompareTable({
  t,
  format,
  inputs,
  country,
  title,
  comparison,
}: {
  t: Text;
  format: Format;
  inputs: CalculatorInputs;
  country: string;
  title: string;
  comparison: Comparison;
}) {
  const { result } = comparison;
  const local = currencyOf(inputs.origin);
  const pct = result.changePct;
  const direction: ChangeDirection | null = pct === null ? null : Math.round(Math.abs(pct)) < 1 ? 'same' : pct > 0 ? 'more' : 'less';
  return (
    <div class="overflow-x-auto rounded-lg border border-line bg-surface p-4" data-testid="compare-table">
      <h4 class="text-lg">{title}</h4>
      <table class="mt-2 w-full min-w-[18rem] text-sm">
        <thead>
          <tr class="border-b border-line">
            <th scope="col" class="py-1 pr-3 text-left font-normal text-muted" />
            <th scope="col" class="py-1 pr-3 text-right">{t('calc.compare.greece')}</th>
            <th scope="col" class="py-1 text-right">{country}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-line">
            <th scope="row" class="py-1 pr-3 text-left font-normal">{t('calc.compare.row.net')}</th>
            <td class="py-1 pr-3 text-right">{format.money(comparison.greekNetMonthly)}</td>
            <td class="py-1 text-right">{format.money(inputs.netMonthlyLocal, local)}</td>
          </tr>
          <tr class="border-b border-line">
            <th scope="row" class="py-1 pr-3 text-left font-normal">{t('calc.compare.row.rent')}</th>
            <td class="py-1 pr-3 text-right">{format.money(-(comparison.greekNetMonthly - result.greece.leftEur))}</td>
            <td class="py-1 text-right">{format.money(-inputs.rentMonthlyLocal, local)}</td>
          </tr>
          <tr class="border-b border-line">
            <th scope="row" class="py-1 pr-3 text-left font-semibold">{t('calc.compare.row.leftLocal')}</th>
            <td class="py-1 pr-3 text-right font-semibold">{format.money(result.greece.leftEur)}</td>
            <td class="py-1 text-right font-semibold">{format.money(result.origin.leftLocal, local)}</td>
          </tr>
          {local !== 'EUR' && (
            <tr class="border-b border-line">
              <th scope="row" class="py-1 pr-3 text-left font-normal">{t('calc.compare.row.leftEur')}</th>
              <td class="py-1 pr-3 text-right">{format.money(result.greece.leftEur)}</td>
              <td class="py-1 text-right">{format.money(result.origin.leftEur)}</td>
            </tr>
          )}
          <tr>
            <th scope="row" class="py-1 pr-3 text-left font-semibold">{t('calc.compare.row.ppp')}</th>
            <td class="py-1 pr-3 text-right font-semibold">{format.money(result.greece.leftEur)}</td>
            <td class="py-1 text-right font-semibold">{format.money(result.origin.leftInGreekPrices)}</td>
          </tr>
        </tbody>
      </table>
      <p class="mt-2 text-sm font-medium">
        {direction ? (
          <>
            <span aria-hidden="true" class="mr-1 text-accent">{ICON[direction]}</span>
            {t(`calc.change.${direction}`, { pct: Math.round(Math.abs(pct!)) })}
          </>
        ) : (
          t('calc.compare.noPct')
        )}
      </p>
    </div>
  );
}

function Unverified({ t, problem, compact = false }: { t: Text; problem: ParamsProblem; compact?: boolean }) {
  const paths = [...problem.missingParams, ...problem.invalidParams.map((p) => p.path)];
  return (
    <div class="rounded-lg border border-caution bg-caution-soft p-4 text-ink" data-testid="unverified">
      {!compact && <p class="font-serif text-xl font-semibold">{t('calc.unverified.title')}</p>}
      <p class={compact ? 'font-medium' : 'mt-1'}>{compact ? t('calc.5cUnavailable') : t('calc.unverified.body')}</p>
      <p class="mt-3 text-sm font-medium">{t('calc.unverified.listTitle')}</p>
      <ul class="mt-1 list-disc space-y-0.5 pl-5 text-sm">
        {[...new Set(paths.map((p) => paramLabel(t, p)))].map((label) => (
          <li>{label}</li>
        ))}
      </ul>
    </div>
  );
}

function Unavailable({ t, missing }: { t: Text; missing: string[] }) {
  return (
    <div class="rounded-lg border border-line bg-surface-muted p-4" data-testid="unavailable">
      <p class="font-semibold">{t('calc.unavailable.title')}</p>
      <p class="mt-1 text-sm">{t('calc.unavailable.body')}</p>
      <ul class="mt-1 list-disc space-y-0.5 pl-5 text-sm">
        {[...new Set(missing.map((m) => dataLabel(t, m)))].map((label) => (
          <li>{label}</li>
        ))}
      </ul>
    </div>
  );
}

function Assumptions({
  t,
  format,
  results,
  inputs,
  params,
  fx,
  priceLevels,
  methodologyHref,
}: Omit<Props, 'results'> & { results: ResultsModel }) {
  const value = (path: string) => getParam(params, path)?.value;
  const items: string[] = [t('calc.assume.oneEarner'), t('calc.assume.rules', { taxYear: results.firstTaxYear }), t('calc.assume.age', { birthYear: inputs.birthYear })];
  const payments = value('salaryPaymentsPerYear');
  if (typeof payments === 'number') items.push(t('calc.assume.payments', { payments }));
  const rate = value('efka.employeeRate');
  const ceiling = value('efka.monthlyInsurableCeiling');
  if (typeof rate === 'number' && typeof ceiling === 'number') {
    items.push(t('calc.assume.efka', { rate: format.percent(rate), ceiling: format.money(ceiling, 'EUR', 2) }));
  }
  const exemption = value('art5c.exemptionRate');
  const years = value('art5c.durationYears');
  if (results.mode !== 'without5C_only' && typeof exemption === 'number' && typeof years === 'number') {
    items.push(t('calc.assume.fiveC', { rate: format.percent(exemption), years }));
  }
  if (results.rent.status === 'ok') {
    const r = results.rent.value;
    items.push(t('calc.assume.rent', { eurPerM2: format.money(r.eurPerM2, 'EUR', 2), m2: r.m2, city: t(`calc.city.${inputs.city}`), quarter: r.quarter }));
  }
  const currency = currencyOf(inputs.origin);
  if (currency !== 'EUR' && results.comparisonData.status === 'ok' && fx.status === 'ok') {
    items.push(t('calc.assume.fx', { rate: format.number(results.comparisonData.value.fxPerEur, 4), currency, date: fx.value.date }));
  }
  if (results.comparisonData.status === 'ok' && priceLevels.status === 'ok') {
    items.push(t('calc.assume.priceLevels', { basis: priceLevels.value.basis, year: priceLevels.value.year }));
  }
  items.push(t('calc.assume.constant'));

  return (
    <Section title={t('calc.assume.title')}>
      <ul class="list-disc space-y-1.5 pl-5" data-testid="assumptions">
        {items.map((i) => (
          <li>{i}</li>
        ))}
      </ul>
      <p>
        <a href={methodologyHref} class="text-accent underline">
          {t('calc.assume.more')}
        </a>
      </p>
    </Section>
  );
}
