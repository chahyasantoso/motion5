import type { Cancel, Scheduler } from "../ports/scheduler";

/**
 * The host queue a scheduler drains on.
 *
 * One call hands over one drain and one drain runs one pass, so the host owns when a pass happens
 * and never how many jobs it contains.
 */
export interface SchedulerHost {
  enqueue(drain: () => void): void;
}

export interface MicrotaskSchedulerOptions {
  /** Defaults to a promise microtask. Inject one to bind the queue to a different host. */
  readonly host?: SchedulerHost;
  /**
   * Receives the single failure a pass reports. Without it the failure is thrown from inside the
   * host's callback, which for the default host means an unhandled rejection.
   */
  readonly onError?: (failure: unknown) => void;
}

interface QueuedJob {
  readonly job: () => void;
  cancelled: boolean;
}

/**
 * `Promise` is an ECMAScript intrinsic rather than a host primitive, so this default reaches for no
 * global: no `queueMicrotask`, no `requestAnimationFrame`, no `globalThis`. It therefore works in a
 * browser, in Node, and in a worker without an environment check. Anything that wants a different
 * queue injects a `SchedulerHost`, exactly as `createBrowserClock` takes a `FrameSource`.
 */
const promiseMicrotaskHost: SchedulerHost = {
  enqueue: (drain) => void Promise.resolve().then(drain),
};

/**
 * The production `Scheduler`.
 *
 * Microtask-paced on purpose. `Clock` already owns frame pacing, and a trigger can emit outside any
 * tick, so an animation-frame scheduler would give pacing two owners and publish a value one frame
 * after the tick that produced it. A microtask pass instead ends the turn that produced the work:
 * inside the same frame, before paint, and after the emission that queued it. See ADR-038.
 */
export function createMicrotaskScheduler(
  options: MicrotaskSchedulerOptions = {},
): Scheduler<() => void> {
  const host = options.host ?? promiseMicrotaskHost;
  const onError = options.onError;
  let queue: QueuedJob[] = [];
  let scheduled = false;

  const report = (failure: unknown): void => {
    // Rethrown verbatim when nothing is listening, never wrapped. Callers assert on the identity
    // and message of what a job threw, so renaming a lone failure here would break them. Same rule
    // as Engine.runAllAndReportOnce. See ADR-035.
    if (onError === undefined) throw failure;
    onError(failure);
  };

  const drain = (): void => {
    // Cleared before the pass runs, so a job that schedules during the pass gets a fresh host
    // enqueue for the next one instead of extending this one. GraphRuntime.#scheduleDrain assumes
    // exactly that boundary, and createFakeScheduler.flush() already ends a pass the same way, so
    // the deterministic double and this implementation agree on where a pass stops.
    scheduled = false;
    const pass = queue;
    queue = [];
    const failures: unknown[] = [];
    for (const entry of pass) {
      // Read when the job runs rather than when the pass was taken: a job may cancel a job behind
      // it in the same pass, and honouring that is what makes cancellation a guarantee.
      if (entry.cancelled) continue;
      try {
        entry.job();
      } catch (error) {
        failures.push(error);
      }
    }
    // Every job in the pass runs, then one failure is reported. A throwing job does not get to
    // decide whether the jobs behind it happen at all.
    if (failures.length === 0) return;
    if (failures.length === 1) {
      report(failures[0]);
      return;
    }
    report(new AggregateError(failures, "Scheduled jobs failed."));
  };

  return {
    schedule(job) {
      if (typeof job !== "function") throw new TypeError("Scheduled job must be a function.");
      const entry: QueuedJob = { job, cancelled: false };
      queue.push(entry);
      if (!scheduled) {
        scheduled = true;
        try {
          host.enqueue(drain);
        } catch (error) {
          // Left unscheduled and rethrown, with the job still queued. GraphRuntime already reports
          // a throwing schedule() as scheduler-failure and retries on the next invalidation, so
          // that retry has to be able to carry the work this attempt could not hand over.
          scheduled = false;
          throw error;
        }
      }
      const cancel: Cancel = {
        cancel() {
          entry.cancelled = true;
        },
      };
      return cancel;
    },
  };
}
