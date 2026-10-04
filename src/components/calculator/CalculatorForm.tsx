import type { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import type { Field, InputError, RawInputs } from '../../lib/calculator/inputs';
import { APARTMENT_SIZES, CITIES, ORIGIN_COUNTRIES, currencyOf, type OriginCountry, type RentFile } from '../../lib/data';
import { MAX_CHILDREN } from '../../lib/tax/types';
import type { Format, Text } from './text';

interface Props {
  t: Text;
  format: Format;
  raw: RawInputs;
  errors: Partial<Record<Field, InputError>>;
  /** Salary payments per year from config, if set (for the helper text). */
  paymentsPerYear: number | null;
  /** m² per size from rent data, if set (shown next to the size options). */
  sizes: RentFile['sizes'] | null;
  onChange: (raw: RawInputs) => void;
  onSubmit: () => void;
}

const inputClass =
  'mt-1 block w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-base text-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-accent';

export default function CalculatorForm({ t, format, raw, errors, paymentsPerYear, sizes, onChange, onSubmit }: Props) {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const set = (field: Field, value: string | boolean) => onChange({ ...raw, [field]: value });
  const currency = (ORIGIN_COUNTRIES as readonly string[]).includes(raw.origin) ? currencyOf(raw.origin as OriginCountry) : '';
  const hasErrors = Object.keys(errors).length > 0;

  const errorText = (field: Field): string | null => {
    const e = errors[field];
    if (!e) return null;
    const specific = `calc.error.${field}.${e}`;
    const s = t(specific);
    return s === specific ? t(`calc.error.${e}`) : s;
  };

  const describedBy = (field: Field, hint?: boolean) =>
    [hint ? `${field}-hint` : '', errors[field] ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined;

  const grossHint =
    paymentsPerYear !== null
      ? t('calc.field.grossAnnual.hint', {
          payments: paymentsPerYear,
          example: format.money(1500),
          annual: format.money(1500 * paymentsPerYear),
        })
      : t('calc.field.grossAnnual.hint.generic');

  return (
    <form
      noValidate
      class="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        requestAnimationFrame(() => summaryRef.current?.focus());
      }}
    >
      <p class="max-w-prose text-muted">{t('calc.form.intro')}</p>

      {hasErrors && (
        <p ref={summaryRef} tabIndex={-1} role="alert" class="rounded-md border-l-4 border-accent bg-accent-soft p-3 font-medium">
          {t('calc.errors.summary')}
        </p>
      )}

      <Fieldset legend={t('calc.section.now')}>
        <Row field="origin" label={t('calc.field.origin')} error={errorText('origin')}>
          <select
            id="origin"
            class={inputClass}
            value={raw.origin}
            aria-invalid={!!errors.origin}
            aria-describedby={describedBy('origin')}
            onChange={(e) => set('origin', e.currentTarget.value)}
          >
            <option value="">{t('calc.field.choose')}</option>
            {ORIGIN_COUNTRIES.map((c) => (
              <option value={c}>{t(`quiz.origin.${c}`)}</option>
            ))}
          </select>
        </Row>
        <Row
          field="netMonthly"
          label={t('calc.field.netMonthly')}
          hint={currency ? t('calc.field.netMonthly.hint', { currency }) : undefined}
          error={errorText('netMonthly')}
        >
          <input
            id="netMonthly"
            class={inputClass}
            inputMode="decimal"
            autoComplete="off"
            value={raw.netMonthly}
            aria-invalid={!!errors.netMonthly}
            aria-describedby={describedBy('netMonthly', !!currency)}
            onInput={(e) => set('netMonthly', e.currentTarget.value)}
          />
        </Row>
        <Row
          field="rentMonthly"
          label={t('calc.field.rentMonthly')}
          hint={currency ? t('calc.field.rentMonthly.hint', { currency }) : undefined}
          error={raw.noRent ? null : errorText('rentMonthly')}
        >
          <input
            id="rentMonthly"
            class={`${inputClass} disabled:opacity-50`}
            inputMode="decimal"
            autoComplete="off"
            disabled={raw.noRent}
            value={raw.noRent ? '' : raw.rentMonthly}
            aria-invalid={!raw.noRent && !!errors.rentMonthly}
            aria-describedby={describedBy('rentMonthly', !!currency)}
            onInput={(e) => set('rentMonthly', e.currentTarget.value)}
          />
          <label class="mt-2 flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              class="size-5 accent-[var(--nostos-accent)]"
              checked={raw.noRent}
              onChange={(e) => set('noRent', e.currentTarget.checked)}
            />
            <span>{t('calc.field.noRent')}</span>
          </label>
        </Row>
      </Fieldset>

      <Fieldset legend={t('calc.section.you')}>
        <Row field="birthYear" label={t('calc.field.birthYear')} hint={t('calc.field.birthYear.hint')} error={errorText('birthYear')}>
          <input
            id="birthYear"
            class={`${inputClass} max-w-40`}
            inputMode="numeric"
            maxLength={4}
            autoComplete="bday-year"
            value={raw.birthYear}
            aria-invalid={!!errors.birthYear}
            aria-describedby={describedBy('birthYear', true)}
            onInput={(e) => set('birthYear', e.currentTarget.value)}
          />
        </Row>
        <Row field="children" label={t('calc.field.children')} error={errorText('children')}>
          <select
            id="children"
            class={`${inputClass} max-w-40`}
            value={raw.children}
            aria-invalid={!!errors.children}
            onChange={(e) => set('children', e.currentTarget.value)}
          >
            {Array.from({ length: MAX_CHILDREN + 1 }, (_, i) => (
              <option value={String(i)}>{i}</option>
            ))}
          </select>
        </Row>
      </Fieldset>

      <Fieldset legend={t('calc.section.greece')}>
        <Row field="city" label={t('calc.field.city')} error={errorText('city')}>
          <select
            id="city"
            class={inputClass}
            value={raw.city}
            aria-invalid={!!errors.city}
            aria-describedby={describedBy('city')}
            onChange={(e) => set('city', e.currentTarget.value)}
          >
            <option value="">{t('calc.field.choose')}</option>
            {CITIES.map((c) => (
              <option value={c}>{t(`calc.city.${c}`)}</option>
            ))}
          </select>
        </Row>
        <Row field="grossAnnual" label={t('calc.field.grossAnnual')} hint={grossHint} error={errorText('grossAnnual')}>
          <input
            id="grossAnnual"
            class={inputClass}
            inputMode="decimal"
            autoComplete="off"
            value={raw.grossAnnual}
            aria-invalid={!!errors.grossAnnual}
            aria-describedby={describedBy('grossAnnual', true)}
            onInput={(e) => set('grossAnnual', e.currentTarget.value)}
          />
        </Row>
        <Row field="size" label={t('calc.field.size')} error={errorText('size')}>
          <select
            id="size"
            class={inputClass}
            value={raw.size}
            aria-invalid={!!errors.size}
            aria-describedby={describedBy('size')}
            onChange={(e) => set('size', e.currentTarget.value)}
          >
            <option value="">{t('calc.field.choose')}</option>
            {APARTMENT_SIZES.map((s) => {
              const m2 = sizes?.[s];
              return <option value={s}>{typeof m2 === 'number' ? `${t(`calc.size.${s}`)} · ${m2} m²` : t(`calc.size.${s}`)}</option>;
            })}
          </select>
        </Row>
      </Fieldset>

      <button type="submit" class="min-h-12 w-full rounded-md bg-accent px-6 py-3 text-lg font-semibold text-accent-ink hover:opacity-90 sm:w-auto">
        {t('calc.submit')}
      </button>
    </form>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ComponentChildren }) {
  return (
    <fieldset class="space-y-5">
      <legend class="mb-3 font-serif text-xl font-semibold">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Row({
  field,
  label,
  hint,
  error,
  children,
}: {
  field: Field;
  label: string;
  hint?: string;
  error: string | null;
  children: ComponentChildren;
}) {
  return (
    <div>
      <label for={field} class="block font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${field}-hint`} class="mt-1 max-w-prose text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${field}-error`} class="mt-1 text-sm font-medium text-accent">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </div>
  );
}
