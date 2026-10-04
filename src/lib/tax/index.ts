// Greek net-salary engine (SPEC §6.3). Pure TypeScript, no UI dependencies.
// Every number comes from the tax config; nothing is hardcoded.
export { computeGreekNet } from './computeGreekNet';
export { computeTimeline, mergeProblems, type Timeline, type TimelineInput, type TimelineResult, type TimelineYear } from './timeline';
export { YOUTH_AGE_RULES, ageBandForYear, ageInTaxYear, bandForAge, configTaxYear, type BandResult, type YouthAgeRule } from './age';
export * from './types';
