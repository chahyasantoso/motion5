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

interface CompiledSegment {
  readonly values: Record<string, unknown>;
  readonly duration: number;
}

function readStops(property: unknown): readonly AuthoredStop[] {
  if (!property || typeof property !== "object" || !("stops" in property)) return [];
  const stops = (property as { stops?: unknown }).stops;
  if (!Array.isArray(stops)) return [];
  return stops.filter((stop): stop is AuthoredStop =>
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
  return typeof duration === "number" && Number.isFinite(duration) && duration >= 0 ? duration : 1;
}

function compileKeyframes(config: unknown): {
  readonly initial: Record<string, unknown>;
  readonly segments: readonly CompiledSegment[];
} {
  if (!config || typeof config !== "object" || !("keyframes" in config))
    return { initial: {}, segments: [] };
  const keyframes = (config as { keyframes?: unknown }).keyframes;
  if (!keyframes || typeof keyframes !== "object" || Array.isArray(keyframes))
    return { initial: {}, segments: [] };

  const initial: Record<string, unknown> = {};
  const segmentValues: Record<string, unknown>[] = [];
  const segmentDurations: number[] = [];
  for (const [key, property] of Object.entries(keyframes)) {
    const stops = readStops(property);
    const first = stops[0];
    if (first === undefined) continue;
    initial[key] = first.v;
    for (let index = 1; index < stops.length; index += 1) {
      const previous = stops[index - 1];
      const stop = stops[index];
      if (previous === undefined || stop === undefined) continue;
      const segment = segmentValues[index - 1] ?? {};
      segment[key] = stop.v;
      if (stop.ease !== undefined) segment.ease = stop.ease;
      segmentValues[index - 1] = segment;
      segmentDurations[index - 1] = Math.max(0, stop.p - previous.p);
    }
  }
  return {
    initial,
    segments: segmentValues.map((values, index) => ({
      values,
      duration: segmentDurations[index] ?? 0,
    })),
  };
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
        timeline.to?.(proxy, {
          ...segment.values,
          duration: segment.duration * duration,
        });
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
