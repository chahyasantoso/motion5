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
 * A violation leaves through `schedule`, so the caller's existing boundary for a port that refuses
 * work handles it: nothing new is branched on, the booking is released there, and the deferred work
 * stays queued for the next publication, which is exactly the no-scheduler behaviour this project
 * already supports and tests. The job is refused rather than run, because running it is the
 * recursion. Recursion is bounded at one nested call: every later `schedule` is refused too, so a
 * port that swallows the first refusal cannot buy a second inline pass with it.
 *
 * Issue #377, and see ADR-086.
 */
export function deferredScheduler<Options = unknown>(
  scheduler: Scheduler<() => void, Options>,
): Scheduler<() => void, Options> {
  let scheduling = false;
  let refused = false;
  return {
    schedule(job: () => void, options?: Options): Cancel {
      if (refused) throw new TypeError(INLINE_JOB_MESSAGE);
      scheduling = true;
      try {
        return scheduler.schedule(() => {
          if (scheduling) {
            refused = true;
            throw new TypeError(INLINE_JOB_MESSAGE);
          }
          job();
        }, options);
      } finally {
        scheduling = false;
      }
    },
  };
}

export function assertScheduler(
  scheduler: unknown,
  context = "Scheduler",
): asserts scheduler is Scheduler {
  if (!scheduler || typeof (scheduler as { schedule?: unknown }).schedule !== "function") {
    throw new TypeError(`${context} requires schedule(job, options).`);
  }
}
