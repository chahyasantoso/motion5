/**
 * Attempts every ordered step, retaining thrown values without flattening or sentinel tests.
 *
 * Domain edits, composition cleanup and runtime settlement share this mechanism, not their
 * ordering or rollback policy. A single failure keeps its identity, including thrown undefined.
 */
export function collect(steps: readonly (() => void)[]): readonly unknown[] {
  const failures: unknown[] = [];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      failures.push(error);
    }
  }
  return failures;
}

export function report(failures: readonly unknown[], summary: string): void {
  if (failures.length === 0) return;
  if (failures.length === 1) throw failures[0];
  throw new AggregateError(failures, summary);
}
