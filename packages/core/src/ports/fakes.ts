import type { InterpolationTimeline, Interpolator } from "./interpolator";
import type { Cancel, Scheduler } from "./scheduler";

export function createFakeInterpolator(): Interpolator {
  return {
    create(config) {
      const duration = typeof config === "object" && config !== null && "duration" in config && typeof config.duration === "number" ? config.duration : 0;
      let currentProgress = 0;
      let killed = false;
      return {
        duration,
        progress(value?: number) {
          if (value === undefined) return currentProgress;
          if (killed) throw new Error("Interpolation timeline is killed.");
          if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError("Progress must be between 0 and 1.");
          currentProgress = value;
        },
        kill() {
          killed = true;
        },
      } as InterpolationTimeline;
    },
  };
}

export interface ScheduledJob<Options = unknown> {
  readonly job: () => void;
  readonly options: Options | undefined;
  readonly cancel: Cancel;
}

export function createFakeScheduler<Options = unknown>(): Scheduler<() => void, Options> & {
  readonly pending: readonly ScheduledJob<Options>[];
  flush(): void;
} {
  const jobs: Array<ScheduledJob<Options> & { cancelled: boolean }> = [];
  return {
    schedule(job, options) {
      if (typeof job !== "function") throw new TypeError("Scheduled job must be a function.");
      const entry = {
        job,
        options,
        cancelled: false,
        cancel: {
          cancel() {
            entry.cancelled = true;
          },
        },
      } satisfies ScheduledJob<Options> & { cancelled: boolean };
      jobs.push(entry);
      return entry.cancel;
    },
    get pending() {
      return jobs.filter((entry) => !entry.cancelled);
    },
    flush() {
      const pending = jobs.splice(0, jobs.length);
      for (const entry of pending) if (!entry.cancelled) entry.job();
    },
  };
}
