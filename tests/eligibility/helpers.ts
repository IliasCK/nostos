import synthetic from '../fixtures/synthetic-params.json';

const VERIFIED = { sourceUrl: 'https://example.org/synthetic', verifiedBy: 'SYNTHETIC', verifiedOn: '2026-01-01' };

type Node = Record<string, unknown>;

function at(config: Node, path: string): Node {
  let node: Node = config;
  for (const key of path.split('.')) node = node[key] as Node;
  if (!node || !('value' in node)) throw new Error(`no parameter at ${path}`);
  return node;
}

/**
 * SYNTHETIC config where every parameter is fully verified (fake source and
 * verifier), with optional value overrides by dotted path.
 */
export function verifiedConfig(values: Record<string, unknown> = {}): Node {
  const config = structuredClone(synthetic) as Node;
  (function walk(node: unknown) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) return;
    if ('value' in node) Object.assign(node, VERIFIED);
    else Object.values(node).forEach(walk);
  })(config);
  for (const [path, value] of Object.entries(values)) at(config, path).value = value;
  return config;
}

/** Sets one verification field of a parameter to null. */
export function unverify(config: Node, path: string, field: 'value' | 'sourceUrl' | 'verifiedBy' | 'verifiedOn'): Node {
  at(config, path)[field] = null;
  return config;
}
