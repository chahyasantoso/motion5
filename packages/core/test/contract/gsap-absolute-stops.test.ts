import { describe, expect, it } from "vitest";
import { createRealGsapSeam, readNumber } from "../support/real-gsap";

describe("GSAP absolute multi-property stops (P0-3)", () => {
  it("uses one shared paused timeline with independent absolute grids", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50 },
            { p: 1, v: 100 },
          ],
        },
        y: {
          stops: [
            { p: 0.2, v: 20 },
            { p: 0.25, v: 25 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    expect(seam.created).toHaveLength(1);
    expect(seam.created[0]?.paused()).toBe(true);
    expect(timeline.duration).toBeCloseTo(1, 6);
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

  it("preserves authored easing without resampling a linear sibling", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 100, ease: "power2.out" },
            { p: 1, v: 100 },
          ],
        },
        y: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.25, v: 25 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    timeline.progress(0.25);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(87.5, 3);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(25, 3);
    timeline.progress(0.5);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100, 3);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(50, 3);
    timeline.kill();
  });

  it("uses tweenVars ease when a stop does not override it", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      tweenVars: { ease: "power1.in" },
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    timeline.progress(0.5);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(25, 3);
    timeline.kill();
  });
});
