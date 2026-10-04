// SYNTHETIC config only (tests/fixtures/synthetic-params.json, marked verified by
// the helper): lookback 8, required non-resident 7 (so at most 1 resident year),
// minimum stay 2, EU/EEA qualifies, all four work types qualify, GB/US/AU true.
import { describe, expect, it } from 'vitest';
import realConfig from '../../src/config/greece-tax-2026.json';
import {
  NOTE_KEYS,
  ORIGINS,
  RULE_KEYS,
  WORK_TYPES,
  combine,
  evaluateEligibility,
  questionNumbers,
  type Answers,
  type QuestionId,
  type RuleResult,
} from '../../src/lib/eligibility';
import { unverify, verifiedConfig } from './helpers';

const ALL_PASS: Required<Answers> = { priorResidence: 0, origin: 'DE', work: 'greek_employer', stay: 'yes' };

function ruleFor(question: QuestionId, answers: Answers, config: unknown = verifiedConfig()): RuleResult {
  return evaluateEligibility({ ...ALL_PASS, ...answers }, config).rules.find((r) => r.question === question)!;
}

const verdict = (r: RuleResult) => [r.verdict, r.reason];

describe('combination rule (SPEC §5.1)', () => {
  it.each([
    [['pass', 'pass', 'pass', 'pass'], 'likely_eligible'],
    [['pass', 'borderline', 'pass', 'pass'], 'borderline'],
    [['borderline', 'borderline', 'borderline', 'borderline'], 'borderline'],
    [['pass', 'pass', 'fail', 'pass'], 'likely_not_eligible'],
    [['borderline', 'fail', 'borderline', 'pass'], 'likely_not_eligible'],
  ] as const)('%j → %s', (verdicts, outcome) => {
    expect(combine(verdicts)).toBe(outcome);
  });

  it('end to end: all pass → likely_eligible; one fail → likely_not_eligible', () => {
    expect(evaluateEligibility(ALL_PASS, verifiedConfig()).outcome).toBe('likely_eligible');
    expect(evaluateEligibility({ ...ALL_PASS, stay: 'no' }, verifiedConfig()).outcome).toBe('likely_not_eligible');
    expect(evaluateEligibility({ ...ALL_PASS, origin: 'other' }, verifiedConfig()).outcome).toBe('borderline');
  });

  it('returns one rule per question, in order', () => {
    expect(evaluateEligibility(ALL_PASS, verifiedConfig()).rules.map((r) => r.question)).toEqual([
      'priorResidence',
      'origin',
      'work',
      'stay',
    ]);
  });
});

describe('Q1 prior Greek tax residence', () => {
  it.each([
    [0, 'pass'],
    [1, 'pass'], // 1 ≤ 8 − 7
    [2, 'fail'],
    [8, 'fail'],
  ])('%d resident years → %s', (years, expected) => {
    expect(verdict(ruleFor('priorResidence', { priorResidence: years }))).toEqual([expected, 'ok']);
  });

  it('"not sure" → borderline', () => {
    expect(verdict(ruleFor('priorResidence', { priorResidence: 'not_sure' }))).toEqual(['borderline', 'not_sure']);
  });

  it('uses the window from config, with the numbers in the rule text', () => {
    const config = verifiedConfig({ 'art5c.lookbackYears': 6, 'art5c.requiredNonResidentYears': 5 });
    const r = ruleFor('priorResidence', { priorResidence: 1 }, config);
    expect(verdict(r)).toEqual(['pass', 'ok']);
    expect(r.ruleKey).toBe(RULE_KEYS.priorResidence);
    expect(r.ruleValues).toEqual({ lookbackYears: 6, requiredNonResidentYears: 5 });
    expect(r.sourceUrls).toEqual(['https://example.org/synthetic']);
    expect(ruleFor('priorResidence', { priorResidence: 2 }, config).verdict).toBe('fail');
  });

  it('rejects answers outside 0..lookbackYears', () => {
    expect(() => ruleFor('priorResidence', { priorResidence: 9 })).toThrow(RangeError);
    expect(() => ruleFor('priorResidence', { priorResidence: -1 })).toThrow(RangeError);
  });

  it('unanswered → borderline', () => {
    const r = evaluateEligibility({ origin: 'DE', work: 'greek_employer', stay: 'yes' }, verifiedConfig()).rules[0]!;
    expect(verdict(r)).toEqual(['borderline', 'not_answered']);
  });

  it('invalid window (required > lookback) → borderline', () => {
    const config = verifiedConfig({ 'art5c.requiredNonResidentYears': 9 });
    expect(verdict(ruleFor('priorResidence', { priorResidence: 0 }, config))).toEqual(['borderline', 'invalid_config']);
  });
});

describe('Q2 origin country', () => {
  it.each(['DE', 'NL', 'BE', 'SE', 'CY', 'other_eu_eea'] as const)('EU/EEA %s → pass', (origin) => {
    expect(verdict(ruleFor('origin', { origin }))).toEqual(['pass', 'ok']);
  });

  it('EU/EEA → fail if config says EU/EEA does not qualify', () => {
    const config = verifiedConfig({ 'art5c.euEeaQualifies': false });
    expect(verdict(ruleFor('origin', { origin: 'DE' }, config))).toEqual(['fail', 'ok']);
  });

  it.each(['GB', 'US', 'AU'] as const)('%s → pass only if cooperation is verified true', (origin) => {
    expect(verdict(ruleFor('origin', { origin }))).toEqual(['pass', 'ok']);

    const no = ruleFor('origin', { origin }, verifiedConfig({ [`art5c.cooperationCountries.${origin}`]: false }));
    expect(verdict(no)).toEqual(['borderline', 'grey_area']);
    expect(no.noteKeys).toEqual([NOTE_KEYS.cooperationUnconfirmed]);

    const unverified = ruleFor(
      'origin',
      { origin },
      unverify(verifiedConfig(), `art5c.cooperationCountries.${origin}`, 'verifiedBy'),
    );
    expect(verdict(unverified)).toEqual(['borderline', 'rule_not_verified']);
  });

  it('uses the source of the country it judged', () => {
    const config = verifiedConfig();
    (config.art5c as any).cooperationCountries.US.sourceUrl = 'https://example.org/us';
    expect(ruleFor('origin', { origin: 'US' }, config).sourceUrls).toEqual(['https://example.org/us']);
  });

  it('"other country" → always borderline, with a note', () => {
    const r = ruleFor('origin', { origin: 'other' });
    expect(verdict(r)).toEqual(['borderline', 'grey_area']);
    expect(r.noteKeys).toEqual([NOTE_KEYS.otherCountry]);
  });

  it('covers every option', () => {
    for (const origin of ORIGINS) expect(['pass', 'borderline']).toContain(ruleFor('origin', { origin }).verdict);
  });
});

describe('Q3 work in Greece', () => {
  it.each(['greek_employer', 'greek_branch', 'public_sector', 'self_employed'] as const)('%s → pass', (work) => {
    expect(verdict(ruleFor('work', { work }))).toEqual(['pass', 'ok']);
  });

  it('a qualifying type missing from the verified list → fail', () => {
    const config = verifiedConfig({ 'art5c.qualifyingWorkTypes': ['greek_employer', 'greek_branch', 'self_employed'] });
    expect(verdict(ruleFor('work', { work: 'public_sector' }, config))).toEqual(['fail', 'ok']);
  });

  it('remote employee of a foreign company → borderline with the grey-area explanation', () => {
    const r = ruleFor('work', { work: 'remote_foreign' });
    expect(verdict(r)).toEqual(['borderline', 'grey_area']);
    expect(r.noteKeys).toEqual([NOTE_KEYS.remote]);
  });

  it('not working / retired → fail with the other-regimes note', () => {
    const r = ruleFor('work', { work: 'not_working' });
    expect(verdict(r)).toEqual(['fail', 'ok']);
    expect(r.noteKeys).toEqual([NOTE_KEYS.notWorking]);
  });

  it('invalid work-type list → borderline', () => {
    const config = verifiedConfig({ 'art5c.qualifyingWorkTypes': ['greek_employer', 'pensioner'] });
    expect(verdict(ruleFor('work', { work: 'greek_employer' }, config))).toEqual(['borderline', 'invalid_config']);
  });
});

describe('Q4 minimum stay', () => {
  it.each([
    ['yes', 'pass', 'ok'],
    ['no', 'fail', 'ok'],
    ['not_sure', 'borderline', 'not_sure'],
  ] as const)('%s → %s', (stay, v, reason) => {
    const r = ruleFor('stay', { stay });
    expect(verdict(r)).toEqual([v, reason]);
    expect(r.ruleValues).toEqual({ minimumStayYears: 2 });
  });
});

describe('unverified or missing config', () => {
  it('the real (all-null) config: every rule borderline, "rule not yet verified", never pass', () => {
    for (const work of WORK_TYPES.filter((w) => w !== 'not_working')) {
      for (const origin of ORIGINS) {
        const result = evaluateEligibility({ ...ALL_PASS, origin, work }, realConfig);
        expect(result.outcome).toBe('borderline');
        for (const r of result.rules) {
          // "Other country" is borderline by SPEC regardless of config.
          const reason = r.question === 'origin' && origin === 'other' ? 'grey_area' : 'rule_not_verified';
          expect(verdict(r)).toEqual(['borderline', reason]);
        }
      }
    }
  });

  it('even "not working" is borderline (not fail) while the work rule is unverified, but keeps its note', () => {
    const r = ruleFor('work', { work: 'not_working' }, realConfig);
    expect(verdict(r)).toEqual(['borderline', 'rule_not_verified']);
    expect(r.noteKeys).toEqual([NOTE_KEYS.notWorking]);
  });

  it('generic rule text when the numbers are not verified', () => {
    const rules = evaluateEligibility(ALL_PASS, realConfig).rules;
    expect(rules[0]!.ruleKey).toBe(RULE_KEYS.priorResidenceGeneric);
    expect(rules[3]!.ruleKey).toBe(RULE_KEYS.stayGeneric);
    expect(rules.every((r) => Object.keys(r.ruleValues).length === 0)).toBe(true);
  });

  const cases: [QuestionId, string][] = [
    ['priorResidence', 'art5c.lookbackYears'],
    ['priorResidence', 'art5c.requiredNonResidentYears'],
    ['origin', 'art5c.euEeaQualifies'],
    ['work', 'art5c.qualifyingWorkTypes'],
    ['stay', 'art5c.minimumStayYears'],
  ];
  for (const [question, path] of cases) {
    for (const field of ['value', 'sourceUrl', 'verifiedBy', 'verifiedOn'] as const) {
      it(`${question}: ${path}.${field} null → borderline, never pass`, () => {
        const r = ruleFor(question, {}, unverify(verifiedConfig(), path, field));
        expect(verdict(r)).toEqual(['borderline', 'rule_not_verified']);
      });
    }
  }

  it('a source URL is still shown for a rule whose verification is incomplete', () => {
    const r = ruleFor('stay', {}, unverify(verifiedConfig(), 'art5c.minimumStayYears', 'verifiedBy'));
    expect(r.sourceUrls).toEqual(['https://example.org/synthetic']);
  });
});

describe('questionNumbers (for phrasing Q1 and Q4)', () => {
  it('null when the value is null, so the UI can skip the question', () => {
    expect(questionNumbers(realConfig)).toEqual({ lookbackYears: null, minimumStayYears: null });
  });

  it('present when the value is set, verified or not', () => {
    const config = unverify(verifiedConfig({ 'art5c.lookbackYears': 6 }), 'art5c.lookbackYears', 'verifiedBy');
    expect(questionNumbers(config)).toEqual({ lookbackYears: 6, minimumStayYears: 2 });
  });
});
