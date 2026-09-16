export interface Cancel {
  cancel(): void;
}

/**
 * Accepts one job and answers a handle that cancels it.
 *
 * **A job must not run before `schedule` returns.** That is this port's contract rather than an
 * implementation detail of any adapter. `GraphRuntime` books a follow-up drain from inside the
 * publication that deferred it, and the job releases that booking as its first act, so a port that
 * ran its job inline would re-enter the deferral that scheduled it, book again, and recurse to a
 * stack overflow instead of draining slowly. The booking cannot guard against it, because it is
 * lowered before the call it was passed to has returned.
 *
 * ADR-038 decided the pass boundary for the shipped adapter, where a reentrant schedule lands in
 * the next pass and there is one host enqueue per pass. Issue #377 is that the decision lived in
 * that record and in the runtime's assumptions, and nowhere a future adapter reads.
 * `deferredScheduler` enforces it here, so the rule has one owner at this boundary rather than one
 * per call site behind it.
 *
 * Cancelling a job that has already run is a no-op rather than an error, and a stale handle is
 * inert. See ADR-038 and ADR-086.
 */
export interface Scheduler<Job = () => void, Options = unknown> {
  schedule(job: Job, options?: Options): Cancel;
}

/** What a port that runs its job inline is told, and the one place that sentence lives. */
export const INLINE_JOB_MESSAGE =
  "Scheduler must not run a job before schedule() returns; the job was refused.";

/**
 * Answers a `Scheduler` that refuses a job the wrapped port runs before `schedule` returns.
 *
 * The one owner of the deferral half of the contract above, and a decorator rather than a branch
 * inside each consumer for the reason ADR-076 gives: a rule re-asked at every call site has as many
 * owners as it has callers. Code composed over this is written against a port that defers, which is
 * what `GraphRuntime` already assumed.
 *
 * A violation leaves through `schedule` in every interleaving, which is issue #402 and is more than
 * ADR-086 claimed. Refusing a job by throwing out of the callback is only visible to the caller if
 * the port propagates that throw, and a port that runs a job inline is already out of contract, so
 * assuming it also propagates cleanly is assuming the part that is broken. A port that swallows the
 * refusal and answers a handle is answered with the refusal anyway, and the handle it offered is
 * cancelled rather than returned: a caller that stored it would believe a drain was booked while
 * nothing was ever going to run it. A port that takes the callback and then throws is answered by
 * invalidating that callback, so a job it retained and runs later publishes nothing.
 *
 * The caller's existing boundary for a port that refuses work then handles all of it: nothing new is
 * branched on, the booking is released there, and the deferred work stays queued for the next
 * publication, which is exactly the no-scheduler behaviour this project already supports and tests.
 * The job is refused rather than run, because running it is the recursion, and the permanent latch
 * means every later `schedule` is refused too.
 *
 * Issues #377, #394 and #402, and see ADR-086 and ADR-089.
 */
export function deferredScheduler<Options = unknown>(
  scheduler: Scheduler<() => void, Options>,
): Scheduler<() => void, Options> {
  let scheduling = false;
  let refused = false;
  return {
    schedule(job: () => void, options?: Options): Cancel {
      if (refused) throw new TypeError(INLINE_JOB_MESSAGE);
      // One flag per wrapped callback, beside the permanent latch. The latch is read on entry and
      // therefore says nothing about the call already in flight, which is the fail-open half of
      // issue #402. This is what closes it, and it is per call because the callback it invalidates
      // is per call.
      let live = true;
      scheduling = true;
      try {
        const handle = scheduler.schedule(() => {
          if (scheduling) {
            refused = true;
            live = false;
            throw new TypeError(INLINE_JOB_MESSAGE);
          }
          if (!live) return;
          job();
        }, options);
        if (!refused) return handle;
        // The port ran the job inline and swallowed the refusal, so it may not be answered with a
        // handle for a job that has already been refused. The handle it offered is cancelled and
        // the refusal leaves through `schedule` after all.
        live = false;
        cancelQuietly(handle);
        throw new TypeError(INLINE_JOB_MESSAGE);
      } catch (error) {
        // A port that took the callback and then failed must not drain later against a caller that
        // has been told its booking failed, so what it retained is inert from here.
        live = false;
        throw error;
      } finally {
        scheduling = false;
      }
    },
  };
}

/** Cancels a handle a refused call must not hand back, and swallows a port that refuses that too. */
function cancelQuietly(handle: Cancel): void {
  try {
    handle.cancel();
  } catch {
    // Already out of contract twice. The refusal is the failure this call reports, and a port that
    // cannot cancel the job it should never have run must not replace it with its own.
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
