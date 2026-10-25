/**
 * Replaces an active evaluator with a freshly constructed replacement.
 *
 * Invariant: the replacement is constructed before the previous evaluator is disposed. If
 * construction throws, the prior evaluator remains installed, undisposed, and active. Once
 * construction succeeds, the replacement is installed and the prior evaluator is disposed.
 */
export function replaceEvaluator<E extends { dispose(): void }>(
  previous: E,
  build: () => E,
  install: (next: E) => void,
): void {
  const next = build();
  install(next);
  previous.dispose();
}
