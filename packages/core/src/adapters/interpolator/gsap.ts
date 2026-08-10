import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTimelineLike {
  readonly duration: () => number;
  progress(value?: number): number | GsapTimelineLike;
  kill(): void;
}

export interface GsapLike {
  timeline(config?: unknown): GsapTimelineLike;
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const timeline = gsap.timeline(config);
      return {
        get duration() {
          return timeline.duration();
        },
        progress(value?: number): number | void {
          if (value === undefined) return timeline.progress() as number;
          timeline.progress(value);
        },
        kill(): void {
          timeline.kill();
        },
      };
    },
  };
}
