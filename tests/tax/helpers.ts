import synthetic from '../fixtures/synthetic-params.json';

/** Deep copy of the synthetic params with some values replaced, by dotted path. */
export function params(overrides: Record<string, unknown> = {}): unknown {
  const copy = structuredClone(synthetic) as Record<string, unknown>;
  for (const [path, value] of Object.entries(overrides)) {
    let node: Record<string, unknown> = copy;
    for (const key of path.split('.')) node = node[key] as Record<string, unknown>;
    if (!node || !('value' in node)) throw new Error(`no parameter at ${path}`);
    node.value = value;
  }
  return copy;
}
