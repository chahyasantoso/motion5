import { describe, expect, it } from "vitest";
import { gsap } from "gsap";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

function createRealGsapInterpolator() {
  return createGsapInterpolator({
    timeline: (): GsapTimelineLike => {
      const real = gsap.timeline({ paused: true });
      const timeline: GsapTimelineLike = {
        duration: () => real.duration(),
        progress,
        to(target, vars) {
          real.to(target, vars);
          return timeline;
        },
        kill() {
          real.kill();
        },
      };
      function progress(): number;
      function progress(value: number): GsapTimelineLike;
      function progress(value?: number): number | GsapTimelineLike {
        if (value === undefined) return real.progress();
        real.progress(value);
        return timeline;
      }
      return timeline;
    },
  });
}

describe("GSAP multi-stop compilation (B2)", () => {
  it("uses linear interpolation inside authored segments by default", () => {
    const timeline = createRealGsapInterpolator().create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    expect(timeline.state).toMatchObject({ x: 0 });
    timeline.progress(0.25);
    expect(timeline.state.x).toBeCloseTo(25, 10);
    timeline.progress(0.5);
    expect(timeline.state.x).toBeCloseTo(50, 10);
    timeline.progress(0.75);
    expect(timeline.state.x).toBeCloseTo(75, 10);
    timeline.progress(1);
    expect(timeline.state.x).toBeCloseTo(100, 10);
    timeline.kill();
  });

  it("preserves authored easing when a stop specifies it", () => {
    const timeline = createRealGsapInterpolator().create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100, ease: "power2.in" },
          ],
        },
      },
    });

    timeline.progress(0.5);
    expect(timeline.state.x).toBeCloseTo(25, 10);
    timeline.kill();
  });
});
