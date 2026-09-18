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
 * Every question about one call is asked of that call's own state, which is issue #416. One shared
 * in-flight flag answered whether a call had returned yet for every call at once, so a nested
 * schedule that began and ended inside an outer one lowered the outer's flag, and the outer
 * callback was then run rather than refused. The latch stays shared, because a port that has run one
 * job inline has disqualified itself from every later one, and that is a claim about the port.
 *
 * One condition answers with one identity, which is issue #436. A port that runs the callback inline,
 * swallows the refusal and then throws its own error left through this wrapper with the port's error,
 * while every other interleaving left with the refusal, so what `schedule` owed its caller depended
 * on the port's next statement and no case named either value. The refusal is what leaves, because it
 * is the fact that outlives the call: the latch refuses every later `schedule` on it. The port's error
 * is carried as the refusal's `cause` rather than discarded, which is what separates this from
 * replacing every inner scheduler error with the refusal. A port that never ran the callback still
 * leaves with its own error, because on that path it is the only thing that went wrong.
 *
 * Issues #377, #394, #402, #416 and #436, and see ADR-086, ADR-089 and ADR-096.
 */
export function deferredScheduler<Options = unknown>(
  scheduler: Scheduler<() => void, Options>,
): Scheduler<() => void, Options> {
  let refused = false;
  return {
    schedule(job: () => void, options?: Options): Cancel {
      if (refused) throw new TypeError(INLINE_JOB_MESSAGE);
      // Three answers, all of them about this call and none of them about any other, beside the one
      // permanent latch. `inFlight` is whether this call has returned, `inlineRefusal` is the refusal
      // this call's own callback threw before it did, which is also how the call knows it ran one,
      // and `live` is whether that callback may still run. Issue #416 is what a shared in-flight flag
      // cost: a nested schedule lowered it in its own `finally`, so an outer callback invoked before
      // its own `schedule` returned read a call that had returned, and the job that should have been
      // refused ran. The refusal is a value rather than a flag beside one, which is issue #436 one
      // layer on: a boolean saying the callback ran inline and a refusal saying why are two answers
      // to one question, and one value answers both without either being able to disagree.
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
        // The port ran the job inline and swallowed the refusal, so it may not be answered with a
        // handle for a job that has already been refused. The handle it offered is cancelled and the
        // refusal leaves through `schedule` after all, as the same value the callback threw. Read
        // from this call's own refusal rather than from the latch: a nested call's refusal sets the
        // latch without this call having run anything, and a call whose job was never run inline is
        // owed its port's real handle.
        live = false;
        cancelQuietly(handle);
        throw inlineRefusal;
      } catch (error) {
        // A port that took the callback and then failed must not drain later against a caller that
        // has been told its booking failed, so what it retained is inert from here.
        live = false;
        // Which value leaves is decided here rather than by which failure happened last. A port that
        // never ran the callback is answered with its own error, because replacing it would discard
        // the only thing that went wrong. A port that ran the callback inline is answered with the
        // refusal whatever it threw afterwards, and that error travels as the `cause`: the contract
        // violation is the fact that outlives this call, and one condition answering with two
        // identities depending on the port's next statement is what issue #436 found undecided.
        // Nothing is dropped either way. See ADR-096.
        if (inlineRefusal === undefined || error === inlineRefusal) throw error;
        throw new TypeError(INLINE_JOB_MESSAGE, { cause: error });
      } finally {
        inFlight = false;
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
