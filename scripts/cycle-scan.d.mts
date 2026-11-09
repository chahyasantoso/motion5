export function cycleKey(cycle: readonly string[]): string;
export function compareCycles(
  found: readonly (readonly string[])[],
  baseline: readonly string[],
): { readonly added: readonly string[]; readonly stale: readonly string[] };
