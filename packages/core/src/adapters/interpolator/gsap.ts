import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTweenLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTweenLike;
  kill(): void;
}

export interface GsapLike {
  to(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTweenLike;
}

interface AuthoredStop {
  readonly p: number;
  readonly v: unknown;
  readonly ease?: unknown;
}

type PercentKeyframe = Record<string, unknown>;

interface CompiledKeyframes {
  readonly keyframes: Record<string, PercentKeyframe>;
  readonly initial: Record<string, unknown>;
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

function toPercentKey(position: number): string {
  return `${position * 100}%`;
}

function compileKeyframes(config: unknown): CompiledKeyframes {
  if (!config || typeof config !== "object" || !("keyframes" in config))
    return { keyframes: {}, initial: {} };
  const authored = (config as { keyframes?: unknown }).keyframes;
  if (!authored || typeof authored !== "object" || Array.isArray(authored))
    return { keyframes: {}, initial: {} };

  const keyframes: Record<string, PercentKeyframe> = {};
  const initial: Record<string, unknown> = {};
  const ensure = (percent: string): PercentKeyframe => (keyframes[percent] ??= {});

  for (const [key, property] of Object.entries(authored)) {
    const stops = readStops(property);
    const first = stops[0];
    if (!first) continue;
    initial[key] = first.v;
    ensure("0%")[key] = first.v;
    for (const stop of stops) {
      const percent = toPercentKey(stop.p);
      const frame = ensure(percent);
      if (frame[key] !== undefined && !Object.is(frame[key], stop.v))
        throw new TypeError(`Conflicting values for "${key}" at ${percent}.`);
      frame[key] = stop.v;
      if (stop.ease !== undefined) {
        if (frame.ease !== undefined && !Object.is(frame.ease, stop.ease))
          throw new TypeError(`Ease collision at ${percent}.`);
        frame.ease = stop.ease;
      }
    }
  }
  return { keyframes, initial };
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const compiled = compileKeyframes(config);
      const proxy: Record<string, unknown> = { ...compiled.initial };
      const duration = readDuration(config);
      const tween = gsap.to(proxy, {
        keyframes: compiled.keyframes,
        duration,
        paused: true,
      });
      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return tween.progress();
        tween.progress(value);
      }
      return {
        get duration() {
          return tween.duration();
        },
        state: proxy,
        progress,
        kill(): void {
          tween.kill();
        },
      };
    },
  };
}
