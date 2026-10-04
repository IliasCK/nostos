import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  ORIGINS,
  WORK_TYPES,
  evaluateEligibility,
  questionNumbers,
  type Answers,
  type EligibilityResult,
  type Outcome,
  type QuestionId,
  type RuleResult,
  type Verdict,
} from '../../lib/eligibility';

export interface EligibilityQuizProps {
  /** The current locale's "quiz.*" strings (only those, to keep the bundle small). */
  strings: Record<string, string>;
  /** Tax config, or just its { art5c } part. */
  config: unknown;
  /** Called with the outcome when the user finishes the quiz (used by the M4 calculator). */
  onComplete?: (result: EligibilityResult, answers: Answers) => void;
}

interface Option {
  value: string | number;
  label: string;
}

function fill(template: string, values: Record<string, number | string>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

const OUTCOME_STYLE: Record<Outcome, string> = {
  likely_eligible: 'border-emerald-700 bg-emerald-50',
  borderline: 'border-amber-600 bg-amber-50',
  likely_not_eligible: 'border-stone-700 bg-stone-100',
};

const VERDICT_STYLE: Record<Verdict, string> = {
  pass: 'bg-emerald-700 text-white',
  borderline: 'bg-amber-500 text-stone-950',
  fail: 'bg-stone-800 text-white',
};

const REASONS_WITH_TEXT = new Set(['rule_not_verified', 'not_sure', 'invalid_config', 'not_answered']);

export default function EligibilityQuiz({ strings, config, onComplete }: EligibilityQuizProps) {
  const s = (key: string) => strings[key] ?? key;
  const numbers = useMemo(() => questionNumbers(config), [config]);

  // Q1 and Q4 need a number from config to be asked at all; without it they are
  // skipped and judged "rule not yet verified".
  const questions = useMemo(
    () =>
      (['priorResidence', 'origin', 'work', 'stay'] as const).filter(
        (q) =>
          (q !== 'priorResidence' || numbers.lookbackYears !== null) &&
          (q !== 'stay' || numbers.minimumStayYears !== null),
      ),
    [numbers],
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // Move focus to the new question or the result, so screen-reader and keyboard users follow along.
  useEffect(() => {
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [step, result]);

  const options = (q: QuestionId): Option[] => {
    const notSure = { value: 'not_sure', label: s('quiz.notSure') };
    switch (q) {
      case 'priorResidence':
        return [
          ...Array.from({ length: (numbers.lookbackYears ?? 0) + 1 }, (_, i) => ({ value: i, label: String(i) })),
          notSure,
        ];
      case 'origin':
        return ORIGINS.map((o) => ({ value: o, label: s(`quiz.origin.${o}`) }));
      case 'work':
        return WORK_TYPES.map((w) => ({ value: w, label: s(`quiz.work.${w}`) }));
      case 'stay':
        return [{ value: 'yes', label: s('quiz.stay.yes') }, { value: 'no', label: s('quiz.stay.no') }, notSure];
    }
  };

  const questionText = (q: QuestionId) =>
    fill(s(`quiz.q.${q}`), {
      lookbackYears: numbers.lookbackYears ?? '',
      minimumStayYears: numbers.minimumStayYears ?? '',
    });

  const answerLabel = (r: RuleResult): string => {
    const a = r.answer;
    if (a === undefined) return s('quiz.answer.notAsked');
    if (a === 'not_sure') return s('quiz.notSure');
    if (typeof a === 'number') return fill(s('quiz.answer.years'), { years: a });
    if (r.question === 'origin') return s(`quiz.origin.${a}`);
    if (r.question === 'work') return s(`quiz.work.${a}`);
    return s(`quiz.stay.${a}`);
  };

  function choose(q: QuestionId, value: string | number) {
    const next = { ...answers, [q]: value } as Answers;
    setAnswers(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
      return;
    }
    const evaluated = evaluateEligibility(next, config);
    setResult(evaluated);
    onComplete?.(evaluated, next);
  }

  function back() {
    if (result) setResult(null);
    else setStep(Math.max(0, step - 1));
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setStep(0);
  }

  const skipped = questions.length < 4;
  const backButton = (
    <button
      type="button"
      onClick={back}
      class="min-h-11 rounded px-3 py-2 text-sm font-medium text-stone-700 underline hover:bg-stone-100"
    >
      ← {s('quiz.back')}
    </button>
  );

  if (result) {
    return (
      <section aria-labelledby="quiz-result-heading" class="space-y-6">
        <div class={`rounded-lg border-l-4 p-4 ${OUTCOME_STYLE[result.outcome]}`} data-outcome={result.outcome}>
          <p class="text-sm font-medium text-stone-600">{s('quiz.results.title')}</p>
          <h2 id="quiz-result-heading" ref={headingRef} tabIndex={-1} class="mt-1 text-xl font-bold outline-none">
            {s(`quiz.outcome.${result.outcome}`)}
          </h2>
          <p class="mt-2 text-stone-800">{s(`quiz.outcome.${result.outcome}.body`)}</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold">{s('quiz.ruleCards.title')}</h3>
          <ul class="mt-3 space-y-3">
            {result.rules.map((r) => (
              <li key={r.question} class="rounded-lg border border-stone-200 p-4" data-question={r.question}>
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <h4 class="font-semibold">{s(`quiz.card.${r.question}`)}</h4>
                  <span class={`rounded px-2 py-0.5 text-sm font-medium ${VERDICT_STYLE[r.verdict]}`} data-verdict={r.verdict}>
                    {s(`quiz.verdict.${r.verdict}`)}
                  </span>
                </div>
                <dl class="mt-2 space-y-2 text-sm">
                  <div>
                    <dt class="font-medium text-stone-600">{s('quiz.rule.label')}</dt>
                    <dd>{fill(s(r.ruleKey), r.ruleValues)}</dd>
                  </div>
                  <div>
                    <dt class="font-medium text-stone-600">{s('quiz.answer.label')}</dt>
                    <dd>{answerLabel(r)}</dd>
                  </div>
                  <div>
                    <dt class="font-medium text-stone-600">{s('quiz.source.label')}</dt>
                    <dd>
                      {r.sourceUrls.length === 0
                        ? s('quiz.source.none')
                        : r.sourceUrls.map((url) => (
                            <a key={url} href={url} rel="noopener noreferrer" target="_blank" class="block break-all underline">
                              {url}
                            </a>
                          ))}
                    </dd>
                  </div>
                </dl>
                {REASONS_WITH_TEXT.has(r.reason) && (
                  <p class="mt-2 text-sm font-medium text-amber-800">{s(`quiz.reason.${r.reason}`)}</p>
                )}
                {r.noteKeys.map((key) => (
                  <p key={key} class="mt-2 rounded bg-stone-100 p-2 text-sm">
                    {s(key)}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <p class="text-sm text-stone-600">{s('quiz.disclaimer')}</p>

        <div class="flex flex-wrap gap-2">
          {backButton}
          <button
            type="button"
            onClick={restart}
            class="min-h-11 rounded bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            {s('quiz.restart')}
          </button>
        </div>
      </section>
    );
  }

  const q = questions[step]!;
  const selected = answers[q];
  const isNumberGrid = q === 'priorResidence';

  return (
    <section aria-labelledby="quiz-question" class="space-y-4">
      <p class="text-sm text-stone-600" aria-live="polite">
        {fill(s('quiz.progress'), { current: step + 1, total: questions.length })}
      </p>
      <h2 id="quiz-question" ref={headingRef} tabIndex={-1} class="text-xl font-bold outline-none">
        {questionText(q)}
      </h2>
      {q === 'priorResidence' && <p class="text-sm text-stone-600">{s('quiz.q.priorResidence.hint')}</p>}

      <div class={isNumberGrid ? 'grid grid-cols-4 gap-2' : 'flex flex-col gap-2'}>
        {options(q).map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected === o.value}
            onClick={() => choose(q, o.value)}
            class={[
              'min-h-12 rounded-lg border px-4 py-3 text-left font-medium hover:border-stone-900 focus-visible:outline-2',
              isNumberGrid && typeof o.value === 'number' ? 'text-center' : '',
              isNumberGrid && o.value === 'not_sure' ? 'col-span-4' : '',
              selected === o.value ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-white',
            ].join(' ')}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div class="flex min-h-11 items-center">{step > 0 && backButton}</div>

      {skipped && <p class="text-sm text-amber-800">{s('quiz.skippedNotice')}</p>}
      <p class="text-sm text-stone-600">{s('quiz.disclaimer')}</p>
    </section>
  );
}
