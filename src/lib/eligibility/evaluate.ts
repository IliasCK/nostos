import { getParam, isVerified, type ParamEntry } from '../params/verification';
import {
  COOPERATION_ORIGINS,
  EU_EEA_ORIGINS,
  QUALIFYING_WORK_TYPES,
  type Answers,
  type EligibilityResult,
  type Outcome,
  type Reason,
  type RuleResult,
  type Verdict,
} from './types';

/** i18n keys the logic can return. Kept here so tests can check they all exist. */
export const RULE_KEYS = {
  priorResidence: 'quiz.rule.priorResidence',
  priorResidenceGeneric: 'quiz.rule.priorResidence.generic',
  origin: 'quiz.rule.origin',
  work: 'quiz.rule.work',
  stay: 'quiz.rule.stay',
  stayGeneric: 'quiz.rule.stay.generic',
} as const;

export const NOTE_KEYS = {
  remote: 'quiz.note.remote',
  notWorking: 'quiz.note.notWorking',
  otherCountry: 'quiz.note.otherCountry',
  cooperationUnconfirmed: 'quiz.note.cooperationUnconfirmed',
} as const;

const PATHS = {
  lookbackYears: 'art5c.lookbackYears',
  requiredNonResidentYears: 'art5c.requiredNonResidentYears',
  minimumStayYears: 'art5c.minimumStayYears',
  euEeaQualifies: 'art5c.euEeaQualifies',
  qualifyingWorkTypes: 'art5c.qualifyingWorkTypes',
  cooperation: (iso: string) => `art5c.cooperationCountries.${iso}`,
} as const;

/**
 * Article 5C eligibility (SPEC §5). Pure: every threshold comes from `config`
 * (src/config/greece-tax-2026.json shape). A rule whose config is not fully
 * verified is never a pass.
 */
export function evaluateEligibility(answers: Answers, config: unknown): EligibilityResult {
  const rules = [priorResidence(answers, config), origin(answers, config), work(answers, config), stay(answers, config)];
  return { outcome: combine(rules.map((r) => r.verdict)), rules };
}

/** SPEC §5.1: any fail → likely_not_eligible; else any borderline → borderline; else likely_eligible. */
export function combine(verdicts: readonly Verdict[]): Outcome {
  if (verdicts.includes('fail')) return 'likely_not_eligible';
  if (verdicts.includes('borderline')) return 'borderline';
  return 'likely_eligible';
}

/**
 * Numbers the UI needs to phrase Q1 and Q4. A number is present whenever its
 * value is set, verified or not; when it is null the UI skips that question.
 */
export function questionNumbers(config: unknown): { lookbackYears: number | null; minimumStayYears: number | null } {
  const int = (p: ParamEntry | undefined) => (Number.isInteger(p?.value) && (p!.value as number) > 0 ? (p!.value as number) : null);
  return {
    lookbackYears: int(getParam(config, PATHS.lookbackYears)),
    minimumStayYears: int(getParam(config, PATHS.minimumStayYears)),
  };
}

function rule(
  partial: Pick<RuleResult, 'question' | 'ruleKey' | 'answer'> & Partial<RuleResult>,
  verdict: Verdict,
  reason: Reason,
): RuleResult {
  return { ruleValues: {}, noteKeys: [], sourceUrls: [], ...partial, verdict, reason };
}

function sources(...params: (ParamEntry | undefined)[]): string[] {
  return [...new Set(params.map((p) => p?.sourceUrl).filter((u): u is string => typeof u === 'string' && u !== ''))];
}

const isPositiveInt = (v: unknown): v is number => Number.isInteger(v) && (v as number) > 0;

function priorResidence(answers: Answers, config: unknown): RuleResult {
  const lookback = getParam(config, PATHS.lookbackYears);
  const required = getParam(config, PATHS.requiredNonResidentYears);
  const answer = answers.priorResidence;
  const base = { question: 'priorResidence' as const, answer, sourceUrls: sources(lookback, required) };

  if (!isVerified(lookback) || !isVerified(required)) {
    return rule({ ...base, ruleKey: RULE_KEYS.priorResidenceGeneric }, 'borderline', 'rule_not_verified');
  }
  const L = lookback!.value;
  const R = required!.value;
  if (!isPositiveInt(L) || !isPositiveInt(R) || R > L) {
    return rule({ ...base, ruleKey: RULE_KEYS.priorResidenceGeneric }, 'borderline', 'invalid_config');
  }
  const withRule = { ...base, ruleKey: RULE_KEYS.priorResidence, ruleValues: { lookbackYears: L, requiredNonResidentYears: R } };

  if (answer === undefined) return rule(withRule, 'borderline', 'not_answered');
  if (answer === 'not_sure') return rule(withRule, 'borderline', 'not_sure');
  if (!Number.isInteger(answer) || answer < 0 || answer > L) {
    throw new RangeError(`priorResidence must be an integer from 0 to ${L} or "not_sure"`);
  }
  return rule(withRule, answer <= L - R ? 'pass' : 'fail', 'ok');
}

function origin(answers: Answers, config: unknown): RuleResult {
  const answer = answers.origin;
  const euEea = getParam(config, PATHS.euEeaQualifies);
  const base = { question: 'origin' as const, answer, ruleKey: RULE_KEYS.origin };

  if (answer === undefined) return rule({ ...base, sourceUrls: sources(euEea) }, 'borderline', 'not_answered');

  if (EU_EEA_ORIGINS.includes(answer)) {
    const withSource = { ...base, sourceUrls: sources(euEea) };
    if (!isVerified(euEea)) return rule(withSource, 'borderline', 'rule_not_verified');
    if (typeof euEea!.value !== 'boolean') return rule(withSource, 'borderline', 'invalid_config');
    return rule(withSource, euEea!.value ? 'pass' : 'fail', 'ok');
  }

  if ((COOPERATION_ORIGINS as readonly string[]).includes(answer)) {
    const param = getParam(config, PATHS.cooperation(answer));
    const withSource = { ...base, sourceUrls: sources(param) };
    if (!isVerified(param)) {
      return rule({ ...withSource, noteKeys: [NOTE_KEYS.cooperationUnconfirmed] }, 'borderline', 'rule_not_verified');
    }
    if (typeof param!.value !== 'boolean') return rule(withSource, 'borderline', 'invalid_config');
    // SPEC §5.2: pass only if confirmed; otherwise borderline (not fail).
    return param!.value === true
      ? rule(withSource, 'pass', 'ok')
      : rule({ ...withSource, noteKeys: [NOTE_KEYS.cooperationUnconfirmed] }, 'borderline', 'grey_area');
  }

  // "Other country": always borderline (SPEC §5.2).
  return rule({ ...base, sourceUrls: sources(euEea), noteKeys: [NOTE_KEYS.otherCountry] }, 'borderline', 'grey_area');
}

function work(answers: Answers, config: unknown): RuleResult {
  const answer = answers.work;
  const param = getParam(config, PATHS.qualifyingWorkTypes);
  const noteKeys =
    answer === 'remote_foreign' ? [NOTE_KEYS.remote] : answer === 'not_working' ? [NOTE_KEYS.notWorking] : [];
  const base = { question: 'work' as const, answer, ruleKey: RULE_KEYS.work, noteKeys, sourceUrls: sources(param) };

  if (!isVerified(param)) return rule(base, 'borderline', 'rule_not_verified');
  const list = param!.value;
  if (!Array.isArray(list) || !list.every((t) => (QUALIFYING_WORK_TYPES as readonly unknown[]).includes(t))) {
    return rule(base, 'borderline', 'invalid_config');
  }
  if (answer === undefined) return rule(base, 'borderline', 'not_answered');
  if (answer === 'remote_foreign') return rule(base, 'borderline', 'grey_area');
  if (answer === 'not_working') return rule(base, 'fail', 'ok');
  return rule(base, list.includes(answer) ? 'pass' : 'fail', 'ok');
}

function stay(answers: Answers, config: unknown): RuleResult {
  const answer = answers.stay;
  const param = getParam(config, PATHS.minimumStayYears);
  const base = { question: 'stay' as const, answer, sourceUrls: sources(param) };

  if (!isVerified(param)) return rule({ ...base, ruleKey: RULE_KEYS.stayGeneric }, 'borderline', 'rule_not_verified');
  if (!isPositiveInt(param!.value)) return rule({ ...base, ruleKey: RULE_KEYS.stayGeneric }, 'borderline', 'invalid_config');
  const withRule = { ...base, ruleKey: RULE_KEYS.stay, ruleValues: { minimumStayYears: param!.value } };

  if (answer === undefined) return rule(withRule, 'borderline', 'not_answered');
  if (answer === 'not_sure') return rule(withRule, 'borderline', 'not_sure');
  return rule(withRule, answer === 'yes' ? 'pass' : 'fail', 'ok');
}
