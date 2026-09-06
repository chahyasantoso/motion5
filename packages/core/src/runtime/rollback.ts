import { describeError } from "./schema-refusals";
/**
 * Runs every step in order and retains exactly what each failed invocation threw.
 *
 * Rollback and post-commit settlement share collection, not inverses or sequencing. The caller
 * supplies the order; this module owns completion and reporting. Counting failures rather than
 * testing a sentinel preserves thrown undefined. Host aggregates remain intact, not flattened.
 * See ADR-035 and ADR-071.
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

/** A single failure keeps its identity; multiple failures arrive in occurrence order. */
export function report(failures: readonly unknown[], summary: string): void {
  if (failures.length === 0) return;
  if (failures.length === 1) throw failures[0];
  throw new AggregateError(failures, summary);
}

/** Runs every rollback inverse with ADR-035's existing report and precedence unchanged. */
export function runRollbackSteps(steps: readonly (() => void)[]): void {
  report(collect(steps), "Track replacement rollback failed.");
}

/**
 * Attempts all post-commit steps before reporting, with no inverse or retry.
 *
 * ProjectRuntime supplies settlement followed by its publication attempt. Including publication
 * in the collection prevents a synchronous flush failure from replacing an earlier settle error.
 * The two phase names share one mechanism without allowing a caller to choose the wrong report.
 * This is internal to the runtime, not a package entrypoint export. See ADR-071.
 */
export function runSettleSteps(steps: readonly (() => void)[]): void {
  report(collect(steps), "Commit settlement failed.");
}
/**
 * Rejects an operation whose rollback can fail on its own.
 *
 * Every structural commit rolls back through hooks that reach application code: the `destroyMotion`
 * hook disposes a `CreatedTrigger` whose `dispose` closes over a host-owned `ScrollSource`
 * unsubscribe, and `disposeTrack` disposes a compiled `Track`. A host whose teardown throws must
 * not be able to replace the diagnosis with its own unrelated failure.
 *
 * Suppress and attach, never suppress and drop. When the rollback succeeds the rejection is
 * rethrown untouched, so every existing message and error type contract holds, including the two
 * categories that have nothing to revert at all. When it fails, one error carries both, which is
 * the collect-then-report-once shape `Engine`'s clock consumer fanout already uses, so no new
 * failure shape is invented here. See ADR-035.
 */
export function rejectAfterRollback(rejection: unknown, rollback: () => void): never {
  try {
    rollback();
  } catch (rollbackFailure) {
    // The rejection's message comes first, verbatim, so a caller that anchored on it before a
    // rollback could fail still matches it. Both facts stay first-class in `errors`, in the order
    // they happened, and the rejection itself is not mutated: it is thrown from the graph layer,
    // which does not own this failure and should not look like it does.
    const errors = [rejection, rollbackFailure];
    const detail = describeError(rollbackFailure);
    throw new AggregateError(errors, `${describeError(rejection)} Rollback failed: ${detail}`);
  }
  throw rejection;
}
