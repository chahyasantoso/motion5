/**
 * Runs every step in order even when an earlier one throws. One failure is rethrown as is, so a
 * caller sees the original error; several are aggregated under `message`.
 */
export function disposeInOrder(steps: readonly (() => void)[], message: string): void {
  const failures: unknown[] = [];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length === 1) throw failures[0];
  if (failures.length > 1) throw new AggregateError(failures, message);
}

/**
 * Runs `cleanup` because `error` happened and answers what the caller should throw or report:
 * `error` itself, or both under `message` when the cleanup failed too. The one owner of that rule
 * for the playground's setup paths.
 */
export function afterCleanup(error: unknown, cleanup: () => void, message: string): unknown {
  try {
    cleanup();
  } catch (cleanupError) {
    return new AggregateError([error, cleanupError], message);
  }
  return error;
}
