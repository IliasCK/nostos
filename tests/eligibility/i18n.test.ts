import { describe, expect, it } from 'vitest';
import el from '../../src/i18n/el.json';
import en from '../../src/i18n/en.json';
import { NOTE_KEYS, ORIGINS, OUTCOMES, QUESTION_IDS, RULE_KEYS, WORK_TYPES } from '../../src/lib/eligibility';

const keysUsedByQuiz = [
  ...Object.values(RULE_KEYS),
  ...Object.values(NOTE_KEYS),
  ...OUTCOMES.flatMap((o) => [`quiz.outcome.${o}`, `quiz.outcome.${o}.body`]),
  ...QUESTION_IDS.flatMap((q) => [`quiz.q.${q}`, `quiz.card.${q}`]),
  ...ORIGINS.map((o) => `quiz.origin.${o}`),
  ...WORK_TYPES.map((w) => `quiz.work.${w}`),
  ...['pass', 'borderline', 'fail'].map((v) => `quiz.verdict.${v}`),
  ...['rule_not_verified', 'not_sure', 'invalid_config', 'not_answered'].map((r) => `quiz.reason.${r}`),
];

describe('quiz strings', () => {
  it.each(keysUsedByQuiz)('%s exists in el.json and en.json', (key) => {
    expect(el).toHaveProperty([key]);
    expect(en).toHaveProperty([key]);
  });

  it('includes the SPEC §11 quiz disclaimer and §5.2 notes in English', () => {
    expect(en['quiz.disclaimer']).toBe('This checks the main published conditions. It is not a ruling. Only AADE decides eligibility.');
    expect(en['quiz.note.remote']).toContain('most common grey area');
    expect(en['quiz.note.notWorking']).toContain('Other regimes exist for pensioners and investors');
  });

  it('never calls anyone "eligible" without "likely" (CLAUDE.md rule 3)', () => {
    for (const [key, value] of Object.entries(en)) {
      const bare = value.replace(/\blikely (not )?eligible\b/gi, '');
      expect(bare, key).not.toMatch(/\beligible\b/i);
    }
  });
});
