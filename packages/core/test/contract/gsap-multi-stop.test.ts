import { describe, expect, it } from "vitest";
import { gsap } from "gsap";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

describe("GSAP multi-stop compilation (B2)", () => {
  it("interpolates authored stops at 0, 0.5, and 1 using real GSAP state", () => {
    const interpolator = createGsapInterpolator({
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

    const timeline = interpolator.create({
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
    timeline.progress(0.5);
    expect(timeline.state).toMatchObject({ x: 50 });
    timeline.progress(1);
    expect(timeline.state).toMatchObject({ x: 100 });
    timeline.kill();
  });
});
