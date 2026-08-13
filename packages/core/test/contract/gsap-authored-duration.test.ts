import { describe, expect, it } from "vitest";
import { createRealGsapSeam, readNumber } from "../support/real-gsap";

function authoredKeys(state: Readonly<Record<string, unknown>>): readonly string[] {
  return Object.keys(state).filter((key) => !key.startsWith("_"));
}

describe("GSAP authored-duration pinning (P0-3b)", () => {
  it("keeps the authored duration when the last stop ends before the end", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 1, keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 100 }] } } });
    const x = (): number => readNumber(timeline.state, "x");
    expect(timeline.duration).toBeCloseTo(1, 10);
    timeline.progress(0); expect(x()).toBeCloseTo(0, 6);
    timeline.progress(0.25); expect(x()).toBeCloseTo(50, 6);
    timeline.progress(0.5); expect(x()).toBeCloseTo(100, 6);
    timeline.progress(0.9); expect(x()).toBeCloseTo(100, 6);
    timeline.progress(1); expect(x()).toBeCloseTo(100, 6);
    timeline.kill();
  });

  it("scales the shared tween by the configured track duration", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 2, keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 100 }] } } });
    expect(timeline.duration).toBeCloseTo(2, 10);
    expect(seam.created[0]?.duration()).toBeCloseTo(2, 10);
    timeline.progress(0.9);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100, 6);
    timeline.kill();
  });

  it("holds every property independently when grids end at different positions", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 1, keyframes: {
      x: { stops: [{ p: 0, v: 0 }, { p: 0.4, v: 40 }] },
      y: { stops: [{ p: 0, v: 0 }, { p: 0.75, v: 75 }] },
    } });
    const x = (): number => readNumber(timeline.state, "x");
    const y = (): number => readNumber(timeline.state, "y");
    expect(timeline.duration).toBeCloseTo(1, 10);
    timeline.progress(0.375);
    expect(x()).toBeCloseTo(37.5, 6); expect(y()).toBeCloseTo(37.5, 6);
    timeline.progress(0.9);
    expect(x()).toBeCloseTo(40, 6); expect(y()).toBeCloseTo(75, 6);
    timeline.kill();
  });

  it("reports the authored duration for a track with no authored stops", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 3, keyframes: {} });
    expect(timeline.duration).toBeCloseTo(3, 10);
    timeline.kill();
  });

  it("uses one shared tween and never publishes GSAP bookkeeping", () => {
    const complete = createRealGsapSeam();
    const completeTimeline = complete.interpolator.create({ duration: 1, keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } } });
    expect(complete.created[0]?.tweenCount()).toBe(1);
    expect(completeTimeline.duration).toBeCloseTo(1, 10);

    const short = createRealGsapSeam();
    const shortTimeline = short.interpolator.create({ duration: 1, keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 100 }] } } });
    expect(short.created[0]?.tweenCount()).toBe(1);
    completeTimeline.progress(1); shortTimeline.progress(1);
    expect(authoredKeys(shortTimeline.state)).toEqual(["x"]);
    expect(authoredKeys(shortTimeline.state)).toEqual(authoredKeys(completeTimeline.state));
    expect(shortTimeline.state).not.toHaveProperty("authoredEnd");
    completeTimeline.kill(); shortTimeline.kill();
  });
});
