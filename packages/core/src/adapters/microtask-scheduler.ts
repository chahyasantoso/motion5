import type { Cancel, Scheduler } from "../ports/scheduler";

/**
 * The host queue a scheduler drains on: one enqueue gives one drain and one pass; the host owns
 * when, not how many jobs. */
export interface SchedulerHost {
  enqueue(drain: () => void): void;
}

export interface MicrotaskSchedulerOptions {
  /** Defaults to a promise microtask. Inject one to bind the queue to a different host. */
  readonly host?: SchedulerHost;
  /**
   * Receives the single failure a pass reports; without it the failure throws from the host
   * callback, an unhandled rejection on the default host. */
  readonly onError?: (failure: unknown) => void;
}

interface QueuedJob {
  readonly job: () => void;
  cancelled: boolean;
}

/**
 * `Promise` is an intrinsic, not a host global: browser, Node and worker all work unchanged.
 * Inject a `SchedulerHost` to bind a different queue. */
const promiseMicrotaskHost: SchedulerHost = {
  enqueue: (drain) => void Promise.resolve().then(drain),
};

/**
 * The production `Scheduler`. Microtask-paced: `Clock` owns frame pacing, so a pass ends the turn
 * that queued it — same frame, before paint, not a frame later. */
export function createMicrotaskScheduler(
  options: MicrotaskSchedulerOptions = {},
): Scheduler<() => void> {
  const host = options.host ?? promiseMicrotaskHost;
  const onError = options.onError;
  let queue: QueuedJob[] = [];
  let scheduled = false;

  const report = (failure: unknown): void => {
    // Rethrown verbatim when unhandled, never wrapped: callers assert on identity and message; same rule as Engine.runAllAndReportOnce.
    if (onError === undefined) throw failure;
    onError(failure);
  };

  const drain = (): void => {
    // Cleared before the pass, so a job scheduling during it gets a fresh enqueue; GraphRuntime.#scheduleDrain and createFakeScheduler.flush() assume that boundary.
    scheduled = false;
    const pass = queue;
    queue = [];
    const failures: unknown[] = [];
    for (const entry of pass) {
      // Read when the job runs, so a job may cancel one behind it in the same pass.
      if (entry.cancelled) continue;
      try {
        entry.job();
      } catch (error) {
        failures.push(error);
      }
    }
    // Every job in the pass runs before one failure is reported; a throw never skips the jobs behind it.
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
          // Left unscheduled and rethrown, job still queued: GraphRuntime retries on the next invalidation.
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
