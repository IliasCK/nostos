import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Locale } from '../../i18n';
import { EMPTY_INPUTS, parseCalculatorInputs, type CalculatorInputs, type Field, type InputError, type RawInputs } from '../../lib/calculator/inputs';
import { buildResults, type CalculatorData } from '../../lib/calculator/results';
import { ORIGIN_COUNTRIES, type OriginCountry } from '../../lib/data';
import { OUTCOMES, type EligibilityResult, type Outcome } from '../../lib/eligibility';
import { getParam } from '../../lib/params/verification';
import { configTaxYear } from '../../lib/tax';
import type { DemoBundle } from '../../demo/bundle';
import EligibilityQuiz from '../quiz/EligibilityQuiz';
import CalculatorForm from './CalculatorForm';
import Results from './Results';
import { makeFormat, makeText, type Strings } from './text';

export interface CalculatorAppProps {
  locale: Locale;
  /** The locale's "quiz.*" and "calc.*" strings. */
  strings: Strings;
  /** The tax config (descriptions stripped). */
  config: unknown;
  /** Data files, already validated by the loaders at build time. */
  data: CalculatorData;
  methodologyHref: string;
  /** Only ever passed by `npm run dev` (see CalculatorPage.astro). */
  demo?: DemoBundle;
}

export default function CalculatorApp({ locale, strings, config, data, methodologyHref, demo }: CalculatorAppProps) {
  const t = useMemo(() => makeText(strings), [strings]);
  const format = useMemo(() => makeFormat(locale), [locale]);
  const [demoOn, setDemoOn] = useState(false);
  const [demoOutcome, setDemoOutcome] = useState<Outcome>('likely_eligible');
  const [resultsOnly, setResultsOnly] = useState(false);
  const [quiz, setQuiz] = useState<EligibilityResult | null>(null);
  const [raw, setRaw] = useState<RawInputs>(EMPTY_INPUTS);
  const [errors, setErrors] = useState<Partial<Record<Field, InputError>>>({});
  const [submitted, setSubmitted] = useState<CalculatorInputs | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLHeadingElement>(null);

  const demoActive = !!demo && demoOn;
  const params = demoActive ? demo.params : config;
  const activeData = demoActive ? demo.data : data;
  const outcome: Outcome | null = demoActive ? demoOutcome : (quiz?.outcome ?? null);
  const paymentsValue = getParam(params, 'salaryPaymentsPerYear')?.value;
  const payments = Number.isInteger(paymentsValue) && (paymentsValue as number) > 0 ? (paymentsValue as number) : null;

  const results = useMemo(
    () => (submitted && outcome ? buildResults(submitted, outcome, params, activeData) : null),
    [submitted, outcome, params, activeData],
  );

  // Dev-only shortcut for screenshots: ?demo=likely_eligible|borderline|likely_not_eligible
  // switches demo mode on and fills the sample inputs; &view=results hides the quiz and form.
  // Does nothing without the demo bundle (i.e. outside `npm run dev`).
  useEffect(() => {
    if (!demo) return;
    const query = new URLSearchParams(window.location.search);
    const wanted = query.get('demo');
    if (!wanted || !(OUTCOMES as readonly string[]).includes(wanted)) return;
    setDemoOn(true);
    setResultsOnly(query.get('view') === 'results');
    setDemoOutcome(wanted as Outcome);
    setRaw(demo.sampleInputs);
    const parsed = parseCalculatorInputs(demo.sampleInputs, configTaxYear(demo.params));
    if (parsed.ok) setSubmitted(parsed.inputs);
  }, [demo]);

  function submit(next: RawInputs = raw) {
    const parsed = parseCalculatorInputs(next, configTaxYear(params));
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    setSubmitted(parsed.inputs);
    requestAnimationFrame(() => resultsRef.current?.focus());
  }

  return (
    <div class="space-y-12">
      {demo && !resultsOnly && (
        <div class="space-y-3 rounded-lg border-2 border-dashed border-accent p-4" data-demo-controls>
          <label class="flex items-start gap-3 font-medium">
            <input type="checkbox" class="mt-1 size-5" checked={demoOn} onChange={(e) => setDemoOn(e.currentTarget.checked)} />
            <span>{demo.strings[locale].toggle}</span>
          </label>
          {demoOn && (
            <div class="flex flex-wrap items-end gap-3">
              <label class="block">
                <span class="block text-sm font-medium">{demo.strings[locale].outcome}</span>
                <select class="mt-1 rounded-md border border-line-strong bg-surface px-3 py-2" value={demoOutcome} onChange={(e) => setDemoOutcome(e.currentTarget.value as Outcome)}>
                  {OUTCOMES.map((o) => (
                    <option value={o}>{t(`quiz.outcome.${o}`)}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                class="min-h-11 rounded-md bg-ink px-4 py-2 font-medium text-bg"
                onClick={() => {
                  setRaw(demo.sampleInputs);
                  submit(demo.sampleInputs);
                }}
              >
                {demo.strings[locale].fill}
              </button>
            </div>
          )}
        </div>
      )}

      <section class="space-y-4" hidden={resultsOnly}>
        <p class="text-sm font-semibold tracking-wide text-accent uppercase">{t('calc.step.quiz')}</p>
        <EligibilityQuiz
          strings={strings}
          config={config}
          onComplete={(result, answers) => {
            setQuiz(result);
            if (raw.origin === '' && answers.origin && (ORIGIN_COUNTRIES as readonly string[]).includes(answers.origin)) {
              setRaw({ ...raw, origin: answers.origin as OriginCountry });
            }
          }}
          onReset={() => {
            setQuiz(null);
            setSubmitted(null);
          }}
        />
      </section>

      {outcome && (
        <section class="space-y-4 border-t border-line pt-10" aria-labelledby="calc-form-heading" hidden={resultsOnly}>
          <h2 id="calc-form-heading" ref={formRef} tabIndex={-1} class="text-sm font-semibold tracking-wide text-accent uppercase outline-none">
            {t('calc.step.form')}
          </h2>
          <CalculatorForm
            t={t}
            format={format}
            raw={raw}
            errors={errors}
            paymentsPerYear={payments}
            sizes={activeData.rent.status === 'ok' ? activeData.rent.value.sizes : null}
            onChange={setRaw}
            onSubmit={() => submit()}
          />
        </section>
      )}

      {outcome && submitted && results && (
        <section class="relative space-y-6 border-t border-line pt-10" aria-labelledby="calc-results-heading" data-testid="results">
          {demoActive && <DemoWatermark text={demo.strings[locale].watermark} />}
          <p class="text-sm font-semibold tracking-wide text-accent uppercase">{t('calc.step.results')}</p>
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="calc-results-heading" ref={resultsRef} tabIndex={-1} class="text-3xl outline-none sm:text-4xl">
              {t('calc.results.title')}
            </h2>
            <button type="button" class="text-sm text-accent underline" onClick={() => formRef.current?.focus()}>
              {t('calc.results.edit')}
            </button>
          </div>
          <Results
            t={t}
            format={format}
            results={results}
            inputs={submitted}
            params={params}
            fx={activeData.fx}
            priceLevels={activeData.priceLevels}
            methodologyHref={methodologyHref}
          />
        </section>
      )}
    </div>
  );
}

function DemoWatermark({ text }: { text: string }) {
  return (
    <>
      <p class="sticky top-0 z-20 rounded-md bg-accent px-4 py-3 text-center text-lg font-bold tracking-wide text-accent-ink" data-demo-watermark>
        {text}
      </p>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div class="flex h-full flex-col justify-around">
          {Array.from({ length: 8 }, () => (
            <p class="-rotate-12 text-center font-serif text-4xl font-bold whitespace-nowrap text-accent opacity-15 sm:text-6xl">{text}</p>
          ))}
        </div>
      </div>
    </>
  );
}
