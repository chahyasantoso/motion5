import { describeError } from "./schema-refusals";
/**
 * What a failed structural commit is allowed to report, and in which order.
 *
 * Moved out of `project-runtime.ts` whole by slice 2 of issue #267, docblocks travelling with the
 * functions they constrain. These two are ADR-035's owners, and what they own is failure precedence
 * rather than anything about the class that calls them: neither reads `this`, and the rule they
 * carry is that a host whose teardown throws may not replace the diagnosis with its own unrelated
 * failure. `#apply` has one call site for each of them and had one before this file existed.
 */
export function runRollbackSteps(steps: readonly (() => void)[]): void {
  const failures: unknown[] = [];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length === 0) return;
  if (failures.length === 1) throw failures[0];
  throw new AggregateError(failures, "Track replacement rollback failed.");
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
