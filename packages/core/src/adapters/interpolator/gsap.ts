import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTimelineLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTimelineLike;
  kill(): void;
}

export interface GsapLike {
  timeline(config?: unknown): GsapTimelineLike;
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const proxy: Record<string, unknown> = {};
      const timeline = gsap.timeline({ ...(config as object), targets: proxy });
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
