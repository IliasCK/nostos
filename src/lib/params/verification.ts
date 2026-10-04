// Shared "is every tax parameter verified?" rule, used by scripts/check-params.ts
// and the dev banner so the two can never disagree.
// Self-contained (no imports) so Node can run it directly via type stripping.

export const VERIFICATION_FIELDS = ['value', 'sourceUrl', 'verifiedBy', 'verifiedOn'] as const;

export interface ParamStatus {
  path: string;
  /** Fields that are null or absent. Empty means verified. */
  missing: string[];
}

/** Every parameter (any object with a "value" key) in the config, by dotted path. Keys starting with "_" are skipped. */
export function listParams(config: unknown): ParamStatus[] {
  const out: ParamStatus[] = [];
  (function walk(node: unknown, path: string) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) return;
    const record = node as Record<string, unknown>;
    if ('value' in record) {
      out.push({ path, missing: VERIFICATION_FIELDS.filter((f) => record[f] === null || record[f] === undefined) });
      return;
    }
    for (const [key, child] of Object.entries(record)) {
      if (!key.startsWith('_')) walk(child, path ? `${path}.${key}` : key);
    }
  })(config, '');
  return out;
}

export function unverifiedParams(config: unknown): ParamStatus[] {
  return listParams(config).filter((p) => p.missing.length > 0);
}

export function isProduction(env: string | undefined): boolean {
  return env === 'production';
}
