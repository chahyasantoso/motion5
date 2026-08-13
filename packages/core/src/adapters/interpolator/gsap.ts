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

interface CompiledSegment {
  readonly key: string;
  readonly value: unknown;
  readonly start: number;
  readonly duration: number;
  readonly ease?: unknown;
}

interface CompiledKeyframes {
  readonly initial: Record<string, unknown>;
  readonly segments: readonly CompiledSegment[];
  /**
   * The latest authored stop position across every property, normalized. Read from the authored
   * `p` directly rather than summed from segment lengths, so it carries no accumulated rounding.
   */
  readonly end: number;
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

function compileKeyframes(config: unknown): CompiledKeyframes {
  if (!config || typeof config !== "object" || !("keyframes" in config))
    return { initial: {}, segments: [], end: 0 };
  const keyframes = (config as { keyframes?: unknown }).keyframes;
  if (!keyframes || typeof keyframes !== "object" || Array.isArray(keyframes))
    return { initial: {}, segments: [], end: 0 };

  const initial: Record<string, unknown> = {};
  const segments: CompiledSegment[] = [];
  let end = 0;
  for (const [key, property] of Object.entries(keyframes)) {
    const stops = readStops(property);
    const first = stops[0];
    if (first === undefined) continue;
    initial[key] = first.v;
    for (let index = 1; index < stops.length; index += 1) {
      const previous = stops[index - 1];
      const stop = stops[index];
      if (previous === undefined || stop === undefined) continue;
      segments.push({
        key,
        value: stop.v,
        start: previous.p,
        duration: Math.max(0, stop.p - previous.p),
        ...(stop.ease === undefined ? {} : { ease: stop.ease }),
      });
    }
    const last = stops[stops.length - 1];
    if (last !== undefined) end = Math.max(end, last.p);
  }
  return { initial, segments, end };
}

/**
 * Schedules the authored end so the timeline's own duration is the authored duration.
 *
 * A timeline reports its duration as the end of its latest scheduled child. Because each
 * authored interval is scheduled as its own tween, a track whose last stop sits before the end
 * leaves nothing scheduled at the authored end, and the timeline is short by exactly the unused
 * tail. That is not a tail-only bug: `progress(v)` is a fraction of the timeline's own duration,
 * so a short timeline rescales every authored position by `1 / end`, and
 * `InterpolationTimeline.duration` reports the short number to consumers as well.
 *
 * One zero-length tween at the authored end fixes both, and it is scheduled only when the
 * authored stops stop short. The target is an adapter-owned anchor, never the published proxy:
 * a key added to the proxy would flow through `Track.compose` into a published patch and reach
 * the renderer as a value nobody authored.
 *
 * An `end` beyond 1 is left alone. Authored positions outside `[0, 1]` are a validation concern
 * (P1-10), and silently trimming them here would hide the authored mistake.
 */
function pinAuthoredEnd(timeline: GsapTimelineLike, end: number, duration: number): void {
  if (duration <= 0 || end >= 1) return;
  const anchor: Record<string, unknown> = { authoredEnd: 0 };
  timeline.to(anchor, { authoredEnd: 1, duration: 0 }, duration);
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const proxy: Record<string, unknown> = {};
      const timeline = gsap.timeline({ paused: true });
      const compiled = compileKeyframes(config);
      Object.assign(proxy, compiled.initial);
      const duration = readDuration(config);
      for (const segment of compiled.segments) {
        timeline.to(
          proxy,
          {
            [segment.key]: segment.value,
            duration: segment.duration * duration,
            ease: segment.ease ?? "none",
          },
          segment.start * duration,
        );
      }
      pinAuthoredEnd(timeline, compiled.end, duration);
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
