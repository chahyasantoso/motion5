/**
 * Test support. Reachable only through `@motion5/core/testing`, which no production consumer or
 * app may import; `scripts/boundary-scan.mjs` enforces that. These are the implementations the
 * core suite runs the port contract suite against, per TR-P-05. See ADR-048.
 */
import { readAuthoredLeaf, readCompilableStops } from "../contract/authored-leaf";
import type { AuthoredStaticValue, AuthoredStop } from "../contract/v5";
import type { InterpolationTimeline, Interpolator } from "../ports/interpolator";
import type { Cancel, Scheduler } from "../ports/scheduler";
import type { TriggerPort } from "../ports/trigger";

interface AuthoredLeaves {
  readonly animated: Record<string, readonly AuthoredStop[]>;
  readonly statics: Record<string, AuthoredStaticValue>;
}

/**
 * Which authored leaves this fake publishes, decided by the shared reader rather than by a private
 * copy of it.
 *
 * The private copy this replaced accepted any non-empty authored list, so a stop whose position did
 * not parse, or one carrying no value, published a key the real compiler drops. A fake that
 * publishes keys the production pipeline never produces makes a schema mistake look like a
 * composition bug, which is the failure `LF-3` states as an assertion. See issue #192.
 *
 * A static leaf is separated from an animated one here for the same reason the compiler separates
 * them: it enters `state` once and is never interpolated, so this double agrees with
 * `compilePercentKeyframes` about what a value that never changes costs. See ADR-050.
 */
function readLeaves(config: unknown): AuthoredLeaves {
  const animated: Record<string, readonly AuthoredStop[]> = {};
  const statics: Record<string, AuthoredStaticValue> = {};
  if (!config || typeof config !== "object" || !("keyframes" in config))
    return { animated, statics };
  const keyframes = (config as { keyframes?: unknown }).keyframes;
  if (!keyframes || typeof keyframes !== "object" || Array.isArray(keyframes))
    return { animated, statics };
  for (const [key, property] of Object.entries(keyframes)) {
    const leaf = readAuthoredLeaf(property);
    if (leaf.kind === "static") {
      statics[key] = leaf.value;
      continue;
    }
    const stops = readCompilableStops(property);
    if (stops.length === 0) continue;
    animated[key] = stops;
  }
  return { animated, statics };
}
function interpolate(a: unknown, b: unknown, amount: number): unknown {
  if (typeof a === "number" && typeof b === "number") return a + (b - a) * amount;
  return amount < 1 ? a : b;
}
function valueAt(stops: readonly AuthoredStop[], progress: number): unknown {
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
    if (progress <= next.p)
      return interpolate(previous.v, next.v, (progress - previous.p) / (next.p - previous.p));
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
      const { animated, statics } = readLeaves(config);
      // Seeded once and never touched by `update`, which is the whole of the static bypass at this
      // seam: no progress value can move a leaf that never changes.
      const state: Record<string, unknown> = { ...statics };
      let currentProgress = 0;
      let killed = false;
      const update = () => {
        for (const [key, propertyStops] of Object.entries(animated))
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

export function createFakeTriggerPort(): TriggerPort & {
  emit(progress: number): void;
  readonly subscriberCount: number;
  dispose(): void;
} {
  let count = 0;
  const listeners = new Set<(progress: number) => void>();
  let disposed = false;
  return {
    subscribe(listener: (progress: number) => void) {
      if (typeof listener !== "function")
        throw new TypeError("TriggerPort listener must be a function.");
      if (disposed) throw new Error("TriggerPort is disposed.");
      count += 1;
      listeners.add(listener);
      return () => {
        count -= 1;
        listeners.delete(listener);
      };
    },
    emit(progress: number) {
      if (disposed) return;
      for (const listener of [...listeners]) listener(progress);
    },
    get subscriberCount() {
      return count;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.clear();
    },
  };
}

/**
 * Stands in for the owner of compiled Tracks. Generic so this module keeps its ports-layer
 * independence from the domain layer; tests instantiate it as createFakeTrackRegistry<Track>().
 */
export function createFakeTrackRegistry<T>(): {
  resolveTrack: (id: string) => T | undefined;
  register(id: string, value: T): T;
  drop(id: string): void;
  readonly ids: readonly string[];
} {
  const entries = new Map<string, T>();
  return {
    resolveTrack: (id: string) => entries.get(id),
    register(id: string, value: T) {
      entries.set(id, value);
      return value;
    },
    drop(id: string) {
      entries.delete(id);
    },
    get ids() {
      return [...entries.keys()];
    },
  };
}
