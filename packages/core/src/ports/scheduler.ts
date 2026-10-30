export interface Cancel {
  cancel(): void;
}

/**
 * Books a job; its handle cancels it. Job must not run before `schedule` returns → re-enters the deferral → recurses. Cancel after run: no-op, stale handle inert.
 */
export interface Scheduler<Job = () => void, Options = unknown> {
  schedule(job: Job, options?: Options): Cancel;
}

/** Refusal text for a port that runs the job inline; defined here once. */
export const INLINE_JOB_MESSAGE =
  "Scheduler must not run a job before schedule() returns; the job was refused.";

/**
 * Refuses a job the wrapped port runs before `schedule` returns; latch then refuses every later one. Never ran it → own error; else the refusal, its error as `cause`.
 */
export function deferredScheduler<Options = unknown>(
  scheduler: Scheduler<() => void, Options>,
): Scheduler<() => void, Options> {
  let refused = false;
  return {
    schedule(job: () => void, options?: Options): Cancel {
      if (refused) throw new TypeError(INLINE_JOB_MESSAGE);
      // Per call: `inFlight` = not yet returned, `live` = callback may still run, `inlineRefusal` =
      // its own throw. `refused` alone is shared: one inline run disqualifies the port.
      let inFlight = true;
      let live = true;
      let inlineRefusal: TypeError | undefined;
      try {
        const handle = scheduler.schedule(() => {
          if (inFlight) {
            refused = true;
            live = false;
            inlineRefusal = new TypeError(INLINE_JOB_MESSAGE);
            throw inlineRefusal;
          }
          if (!live) return;
          job();
        }, options);
        if (inlineRefusal === undefined) return handle;
        // Job ran inline, refusal swallowed: cancel the handle offered, throw this call's refusal,
        // not the latch — a nested call can set it without this call running anything.
        live = false;
        cancelQuietly(handle);
        throw inlineRefusal;
      } catch (error) {
        // Port failed after taking the callback: what it retained must not drain for a caller told
        // the booking failed.
        live = false;
        // Never ran the callback → its own error leaves; ran it inline → the refusal, that error as
        // `cause`. One condition, one identity; nothing dropped.
        if (inlineRefusal === undefined || error === inlineRefusal) throw error;
        throw new TypeError(INLINE_JOB_MESSAGE, { cause: error });
      } finally {
        inFlight = false;
      }
    },
  };
}

/** Cancels a handle a refused call must not hand back; swallows a failing cancel. */
function cancelQuietly(handle: Cancel): void {
  try {
    handle.cancel();
  } catch {
    // Out of contract twice: the refusal is what this call reports, so a failing cancel cannot replace it.
  }
}

export function assertScheduler(
  scheduler: unknown,
  context = "Scheduler",
): asserts scheduler is Scheduler {
  if (!scheduler || typeof (scheduler as { schedule?: unknown }).schedule !== "function") {
    throw new TypeError(`${context} requires schedule(job, options).`);
  }
}
