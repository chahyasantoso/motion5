import { gsap } from "gsap";
import type { Interpolator } from "../../src/ports/interpolator";
import {
  createGsapInterpolator,
  createGsapOneTweenInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

export interface CreatedTimeline {
  readonly config: unknown;
  paused(): boolean;
  duration(): number;
  tweenCount(): number;
}
export interface RealGsapSeam {
  readonly interpolator: Interpolator;
  readonly created: readonly CreatedTimeline[];
}
export function createRealGsapSeam(): RealGsapSeam {
  const created: CreatedTimeline[] = [];
  const interpolator = createGsapInterpolator({
    timeline(vars): GsapTimelineLike {
      const real = gsap.timeline(vars as Parameters<typeof gsap.timeline>[0]);
      created.push({
        config: vars,
        paused: () => real.paused(),
        duration: () => real.duration(),
        tweenCount: () => 1,
      });
      return real;
    },
  });
  return { interpolator, created };
}

export function createRealGsapOneTweenSeam(): RealGsapSeam {
  const created: CreatedTimeline[] = [];
  const interpolator = createGsapOneTweenInterpolator(gsap);
  return { interpolator, created };
}

export function readNumber(state: Readonly<Record<string, unknown>>, key: string): number {
  const value = state[key];
  return typeof value === "number" ? value : Number.NaN;
}
