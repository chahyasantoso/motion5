const DEFAULT_MAX_PASSES = 8;

/** Runs `listeners` in full passes, folding re-entrant calls into follow-up passes up to `maxPasses`. */
export function createNotifier(
  listeners: Iterable<() => void>,
  maxPasses = DEFAULT_MAX_PASSES,
): () => void {
  let notifying = false;
  let pending = false;

  return () => {
    if (notifying) {
      pending = true;
      return;
    }
    notifying = true;
    pending = true;
    let passes = 0;
    try {
      while (pending) {
        if (passes >= maxPasses) {
          throw new Error(
            `Driver notification exceeded ${maxPasses} passes; a listener is writing on every pass.`,
          );
        }
        pending = false;
        passes += 1;
        for (const listener of [...listeners]) listener();
      }
    } finally {
      pending = false;
      notifying = false;
    }
  };
}
