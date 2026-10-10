// Email signup prompt (SPEC §9). UNUSED in v1: there is no email provider
// (site.json emailProvider: "none"). Kept for when one is chosen; it was rendered
// below the calculator results.
import type { Text } from './text';

export default function EmailSignup({ t }: { t: Text }) {
  return (
    <section class="rounded-lg border border-line bg-surface p-5" aria-labelledby="email-signup-title" data-testid="email-signup">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="email-signup-title" class="text-xl">
          {t('calc.email.title')}
        </h3>
        <span class="rounded-md bg-surface-muted px-2 py-0.5 text-sm font-medium text-muted">{t('calc.email.comingSoon')}</span>
      </div>
      <p class="mt-2 text-muted">{t('calc.email.body')}</p>
      <form class="mt-4 space-y-3" aria-disabled="true" onSubmit={(e) => e.preventDefault()}>
        <fieldset disabled class="space-y-3 opacity-60">
          <label class="block">
            <span class="block font-medium">{t('calc.email.label')}</span>
            <input type="email" class="mt-1 block w-full rounded-md border border-line-strong bg-surface px-3 py-2.5" />
          </label>
          <label class="flex items-start gap-3">
            <input type="checkbox" class="mt-1 size-5" />
            <span class="text-sm">{t('calc.email.consent')}</span>
          </label>
          <button type="submit" class="min-h-11 rounded-md bg-ink px-4 py-2 font-medium text-bg">
            {t('calc.email.submit')}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
