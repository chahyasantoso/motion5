import { describe, expect, it } from "vitest";
import { createGsapInterpolator } from "../../src/adapters/interpolator/gsap";
import { createRealGsapSeam, readNumber } from "../support/real-gsap";

describe("GSAP absolute multi-property stops (P0-3)", () => {
  it("uses one shared percent-keyframe tween with independent absolute grids", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50 }, { p: 1, v: 100 }] },
        y: { stops: [{ p: 0.2, v: 20 }, { p: 0.25, v: 25 }, { p: 1, v: 100 }] },
      },
    });

    expect(seam.created).toHaveLength(1);
    timeline.progress(0);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(0, 6);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(20, 6);
    timeline.progress(0.2);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(20, 6);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(20, 6);
    timeline.progress(0.25);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(25, 6);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(25, 6);
    timeline.progress(0.5);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(50, 6);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(50, 6);
    timeline.progress(1);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100, 6);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(100, 6);
    timeline.kill();
  });

  it("uses the authored duration directly", () => {
    const seam = createRealGsapSeam();
    const timeline = createGsapInterpolator({ to: (target, vars) => {
      const real = seam.interpolator.create({ duration: 1, keyframes: {} });
      void target;
      void vars;
      return {
        duration: () => real.duration,
        progress: (value?: number) => (value === undefined ? real.progress() : (real.progress(value), real as never)),
        kill: () => real.kill(),
      };
    }}).create({ duration: 1, keyframes: {} });
    expect(timeline.duration).toBeCloseTo(1, 6);
    timeline.kill();
  });
});
