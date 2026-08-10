/**
 * Deterministic string comparison for every ordered graph output.
 *
 * `String.prototype.localeCompare` is collation-dependent: it can reorder or entirely
 * ignore punctuation, including the reserved `/` separator and `~` namespace character.
 * Order that reaches a diagnostic, a snapshot, or a serialized fixture must never depend
 * on the host locale or ICU build, so this comparator is the only one the graph layer uses.
 *
 * Satisfies TR-C-04 and supports TR-G-05 and TR-G-06.
 */
export function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
