import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTimelineLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTimelineLike;
  to?(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTimelineLike;
  kill(): void;
}

export interface GsapLike { timeline(config?: unknown): GsapTimelineLike; }

function compileVars(config: unknown): Record<string, unknown> {
  if (!config || typeof config !== "object" || !("keyframes" in config)) return {};
  const keyframes = (config as { keyframes?: unknown }).keyframes;
  if (!keyframes || typeof keyframes !== "object" || Array.isArray(keyframes)) return {};
  const vars: Record<string, unknown> = {};
  for (const [key, property] of Object.entries(keyframes)) {
    if (!property || typeof property !== "object" || !("stops" in property)) continue;
    const stops = (property as { stops?: unknown }).stops;
    if (!Array.isArray(stops)) continue;
    const last = stops[stops.length - 1];
    if (last && typeof last === "object" && "v" in last) vars[key] = (last as { v: unknown }).v;
  }
  return vars;
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const proxy: Record<string, unknown> = {};
      const timeline = gsap.timeline();
      const vars = compileVars(config);
      for (const [key, value] of Object.entries(vars)) proxy[key] = value;
      timeline.to?.(proxy, { ...vars, paused: true });
      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return timeline.progress();
        timeline.progress(value);
      }
      return { get duration() { return timeline.duration(); }, state: proxy, progress, kill(): void { timeline.kill(); } };
    },
  };
}
