import type { InterpolationTimeline, Interpolator } from "./interpolator";
import type { Cancel, Scheduler } from "./scheduler";

interface FakeStop {
  readonly p: number;
  readonly v: unknown;
}

function readStops(config: unknown): Record<string, readonly FakeStop[]> {
  if (!config || typeof config !== "object" || !("keyframes" in config)) return {};
  const keyframes = (config as { keyframes?: unknown }).keyframes;
  if (!keyframes || typeof keyframes !== "object" || Array.isArray(keyframes)) return {};
  const result: Record<string, readonly FakeStop[]> = {};
  for (const [key, property] of Object.entries(keyframes)) {
    if (!property || typeof property !== "object" || !("stops" in property)) continue;
    const stops = (property as { stops?: unknown }).stops;
    if (!Array.isArray(stops) || stops.length === 0) continue;
    result[key] = stops as readonly FakeStop[];
  }
  return result;
}

function interpolate(a: unknown, b: unknown, amount: number): unknown {
  if (typeof a === "number" && typeof b === "number") return a + (b - a) * amount;
  return amount < 1 ? a : b;
}

function valueAt(stops: readonly FakeStop[], progress: number): unknown {
  const first = stops[0];
  if (!first) return undefined;
  if (progress <= first.p) return first.v;
  const last = stops[stops.length - 1];
  if (!last) return first.v;
  if (progress >= last.p) return last.v;
  for (let index = 1; index < stops.length; index += 1) {
    const next = stops[index];
    const previous = stops[index - 1];
    if (!next || !previous) continue;
    if (progress <= next.p) {
      const amount = (progress - previous.p) / (next.p - previous.p);
      return interpolate(previous.v, next.v, amount);
    }
  }
  return last.v;
}

export function createFakeInterpolator(): Interpolator {
  return {
    create(config) {
      const duration =
        typeof config === "object" &&
        config !== null &&
        "duration" in config &&
        typeof config.duration === "number"
          ? config.duration
          : 0;
      const stops = readStops(config);
      const state: Record<string, unknown> = {};
      let currentProgress = 0;
      let killed = false;
      const update = () => {
        for (const [key, propertyStops] of Object.entries(stops))
          state[key] = valueAt(propertyStops, currentProgress);
      };
      update();
      return {
        duration,
        state,
        progress(value?: number) {
          if (value === undefined) return currentProgress;
          if (killed) throw new Error("Interpolation timeline is killed.");
          if (!Number.isFinite(value) || value < 0 || value > 1)
            throw new RangeError("Progress must be between 0 and 1.");
          currentProgress = value;
          update();
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

type ActiveScheduledJob<Options> = ScheduledJob<Options> & { cancelled: boolean };

export function createFakeScheduler<Options = unknown>(): Scheduler<() => void, Options> & {
  readonly pending: readonly ScheduledJob<Options>[];
  flush(): void;
} {
  const jobs: ActiveScheduledJob<Options>[] = [];
  return {
    schedule(job, options) {
      if (typeof job !== "function") throw new TypeError("Scheduled job must be a function.");
      const entry: ActiveScheduledJob<Options> = {
        job,
        options,
        cancelled: false,
        cancel: {
          cancel() {
            entry.cancelled = true;
          },
        },
      };
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
