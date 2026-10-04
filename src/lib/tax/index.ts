// Greek net-salary engine (SPEC §6.3). Pure TypeScript, no UI dependencies.
// Every number comes from the tax config; nothing is hardcoded.
export { computeGreekNet } from './computeGreekNet';
export { computeTimeline, type Timeline, type TimelineInput, type TimelineResult, type TimelineYear } from './timeline';
export * from './types';
