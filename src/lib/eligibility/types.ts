export type Verdict = 'pass' | 'borderline' | 'fail';

/** The only three outcomes (CLAUDE.md rule 3). Never "eligible". */
export const OUTCOMES = ['likely_eligible', 'borderline', 'likely_not_eligible'] as const;
export type Outcome = (typeof OUTCOMES)[number];

export const QUESTION_IDS = ['priorResidence', 'origin', 'work', 'stay'] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

/** Q2 options: the 8 origin countries (SPEC §3) by ISO code, plus two catch-alls. */
export const ORIGINS = ['DE', 'GB', 'NL', 'AU', 'US', 'BE', 'SE', 'CY', 'other_eu_eea', 'other'] as const;
export type Origin = (typeof ORIGINS)[number];
/** Geography, not tax law: which Q2 options are EU/EEA states. */
export const EU_EEA_ORIGINS: readonly Origin[] = ['DE', 'NL', 'BE', 'SE', 'CY', 'other_eu_eea'];
/** Q2 options that qualify only via art5c.cooperationCountries.<ISO>. */
export const COOPERATION_ORIGINS = ['GB', 'US', 'AU'] as const;

export const QUALIFYING_WORK_TYPES = ['greek_employer', 'greek_branch', 'public_sector', 'self_employed'] as const;
export const WORK_TYPES = [...QUALIFYING_WORK_TYPES, 'remote_foreign', 'not_working'] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const STAY_ANSWERS = ['yes', 'no', 'not_sure'] as const;
export type StayAnswer = (typeof STAY_ANSWERS)[number];

/** Q1: number of the last lookbackYears years the person was a Greek tax resident. */
export type PriorResidenceAnswer = number | 'not_sure';

export interface Answers {
  priorResidence?: PriorResidenceAnswer;
  origin?: Origin;
  work?: WorkType;
  stay?: StayAnswer;
}

/**
 * Why a rule got its verdict.
 * - ok: judged against a verified rule
 * - not_sure: the user answered "not sure"
 * - grey_area: the rule itself leaves this case open (remote work, "other country", unconfirmed cooperation)
 * - rule_not_verified: a config value the rule needs is not verified yet
 * - invalid_config: a config value has the wrong shape
 * - not_answered: the question was not answered
 */
export type Reason = 'ok' | 'not_sure' | 'grey_area' | 'rule_not_verified' | 'invalid_config' | 'not_answered';

export interface RuleResult {
  question: QuestionId;
  verdict: Verdict;
  reason: Reason;
  /** i18n key for the rule in plain language. */
  ruleKey: string;
  /** Values for the {placeholders} in ruleKey. */
  ruleValues: Record<string, number>;
  /** The user's answer, as given. */
  answer: Answers[QuestionId];
  /** i18n keys of extra explanations to show with this rule. */
  noteKeys: string[];
  /** Source links from config for the rule. */
  sourceUrls: string[];
}

export interface EligibilityResult {
  outcome: Outcome;
  rules: RuleResult[];
}
