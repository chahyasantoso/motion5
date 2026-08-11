import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTimelineLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTimelineLike;
  to?(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTimelineLike;
  kill(): void;
}

export interface GsapLike {
  timeline(config?: unknown): GsapTimelineLike;
}

interface AuthoredStop {
  readonly p: number;
  readonly v: unknown;
  readonly ease?: unknown;
}

function readStops(property: unknown): readonly AuthoredStop[] {
  if (!property || typeof property !== "object" || !("stops" in property)) return [];
  const stops = (property as { stops?: unknown }).stops;
  if (!Array.isArray(stops)) return [];
  return stops.filter(
    (stop): stop is AuthoredStop =>
      Boolean(
        stop &&
          typeof stop === "object" &&
          typeof (stop as { p?: unknown }).p === "number" &&
          Number.isFinite((stop as { p: number }).p) &&
          "v" in stop,
      ),
  );
}

function readDuration(config: unknown): number {
  if (!config || typeof config !== "object") return 1;
  const duration = (config as { duration?: unknown }).duration;
  return typeof duration === "number" && Number.isFinite(duration) && duration >= 0
    ? duration
    : 1;
}

function compileKeyframes(config: unknown): {
  readonly initial: Record<string, unknown>;
  readonly segments: readonly Record<string, unknown>[];
} {
  if (!config || typeof config !== "object" || !("keyframes" in config))
    return { initial: {}, segments: [] };
  const keyframes = (config as { keyframes?: unknown }).keyframes;
  if (!keyframes || typeof keyframes !== "object" || Array.isArray(keyframes))
    return { initial: {}, segments: [] };

  const initial: Record<string, unknown> = {};
  const segments: Record<string, unknown>[] = [];
  for (const [key, property] of Object.entries(keyframes)) {
    const stops = readStops(property);
    const first = stops[0];
    if (first === undefined) continue;
    initial[key] = first.v;
    for (const stop of stops.slice(1)) {
      const previous = stops[stops.indexOf(stop) - 1];
      if (previous === undefined) continue;
      const segment = segments[stops.indexOf(stop) - 1] ?? {};
      segment[key] = stop.v;
      if (stop.ease !== undefined) segment[`${key}Ease`] = stop.ease;
      segment.__position = stop.p;
      segments[stops.indexOf(stop) - 1] = segment;
    }
  }
  return { initial, segments };
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const proxy: Record<string, unknown> = {};
      const timeline = gsap.timeline();
      const compiled = compileKeyframes(config);
      Object.assign(proxy, compiled.initial);
      const duration = readDuration(config);
      for (const segment of compiled.segments) {
        const position = segment.__position;
        delete segment.__position;
        const vars = { ...segment, duration: typeof position === "number" ? position * duration : duration };
        timeline.to?.(proxy, vars);
      }
      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return timeline.progress();
        timeline.progress(value);
      }
      return {
        get duration() {
          return timeline.duration();
        },
        state: proxy,
        progress,
        kill(): void {
          timeline.kill();
        },
      };
    },
  };
}
