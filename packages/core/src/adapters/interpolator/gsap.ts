import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTimelineLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTimelineLike;
  to(
    target: Record<string, unknown>,
    vars: Record<string, unknown>,
    position?: number,
  ): GsapTimelineLike;
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

/**
 * Compile all authored properties into the oracle's single shared GSAP keyframe map.
 * Positions remain absolute, and ease belongs to the shared percent entry, so collisions
 * are visible instead of being hidden by independent per-property tweens.
 */
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

    // GSAP starts from the proxy's current value. Add an explicit 0% hold for properties whose
    // first authored stop is later, otherwise their leading hold is left undefined.
    ensure("0%")[key] = first.v;
    for (const stop of stops) {
      const frame = ensure(toPercentKey(stop.p));
      if (frame[key] !== undefined && !Object.is(frame[key], stop.v)) {
        throw new TypeError(`Conflicting values for "${key}" at ${toPercentKey(stop.p)}.`);
      }
      frame[key] = stop.v;
      if (stop.ease !== undefined) {
        if (frame.ease !== undefined && !Object.is(frame.ease, stop.ease))
          throw new TypeError(`Ease collision at ${toPercentKey(stop.p)}.`);
        frame.ease = stop.ease;
      }
    }
  }
  return { keyframes, initial };
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const proxy: Record<string, unknown> = {};
      const timeline = gsap.timeline({ paused: true });
      const compiled = compileKeyframes(config);
      Object.assign(proxy, compiled.initial);
      const duration = readDuration(config);
      timeline.to(proxy, {
        keyframes: compiled.keyframes,
        duration,
        paused: true,
      });
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
