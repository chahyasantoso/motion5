import { describe, expect, it } from "vitest";
import { createRealGsapSeam, readNumber } from "../support/real-gsap";

/**
 * The surface a consumer actually sees. `rendererNeutralState` strips underscore-prefixed keys
 * before anything is published, and real GSAP stamps its own `_gsap` cache onto every target it
 * animates, so the raw proxy always carries bookkeeping that never reaches a patch. Filtering it
 * here is what makes the assertion about authored values rather than about GSAP internals; an
 * unauthored key without an underscore, such as the pin's own `authoredEnd`, still shows up.
 */
function authoredKeys(state: Readonly<Record<string, unknown>>): readonly string[] {
  return Object.keys(state).filter((key) => !key.startsWith("_"));
}

/**
 * P0-3b. A timeline's real duration must be the authored duration, whatever the authored stops
 * do at the tail.
 *
 * GSAP derives a timeline's own duration from its latest scheduled child, so when the last
 * authored stop sits before `p = 1` the real duration is short. Every subsequent `progress(v)`
 * then means "v of the shorter timeline" instead of "v of the authored animation", which
 * rescales every authored position by `1 / lastStopPosition` and reports a short `duration` on
 * the public `InterpolationTimeline` contract.
 *
 * These assertions run against real GSAP through the pass-through seam. A deterministic double
 * cannot state this invariant, because the double's `duration()` is a hardcoded constant and so
 * is exactly the thing under test.
 */
describe("GSAP authored-duration pinning (P0-3b)", () => {
  it("keeps the authored duration when the last stop ends before the end", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 100 },
          ],
        },
      },
    });
    const x = (): number => readNumber(timeline.state, "x");

    expect(timeline.duration).toBeCloseTo(1, 10);

    // Inside the authored ramp, progress still maps to the authored grid.
    timeline.progress(0);
    expect(x()).toBeCloseTo(0, 6);
    timeline.progress(0.25);
    expect(x()).toBeCloseTo(50, 6);

    // At and past the last authored stop the value holds. Without pinning, progress(0.9) is
    // read as 90% of a 0.5s timeline, lands mid-ramp, and returns 90.
    timeline.progress(0.5);
    expect(x()).toBeCloseTo(100, 6);
    timeline.progress(0.9);
    expect(x()).toBeCloseTo(100, 6);
    timeline.progress(1);
    expect(x()).toBeCloseTo(100, 6);

    timeline.kill();
  });

  it("scales the pinned duration by the configured track duration", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 2,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 100 },
          ],
        },
      },
    });

    expect(timeline.duration).toBeCloseTo(2, 10);
    expect(seam.created[0]?.duration()).toBeCloseTo(2, 10);

    timeline.progress(0.9);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100, 6);

    timeline.kill();
  });

  it("holds every property independently when the grids end at different positions", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.4, v: 40 },
          ],
        },
        y: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.75, v: 75 },
          ],
        },
      },
    });
    const x = (): number => readNumber(timeline.state, "x");
    const y = (): number => readNumber(timeline.state, "y");

    expect(timeline.duration).toBeCloseTo(1, 10);

    // Both properties are mid-ramp on their own grids at the same authored position.
    timeline.progress(0.375);
    expect(x()).toBeCloseTo(37.5, 6);
    expect(y()).toBeCloseTo(37.5, 6);

    // Past both tails, both hold. Without pinning the timeline is 0.75 long, so y is still
    // ramping here and reads 67.5.
    timeline.progress(0.9);
    expect(x()).toBeCloseTo(40, 6);
    expect(y()).toBeCloseTo(75, 6);

    timeline.kill();
  });

  it("reports the authored duration for a track with no authored stops", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 3, keyframes: {} });

    expect(timeline.duration).toBeCloseTo(3, 10);

    timeline.kill();
  });

  it("pins only when the tail is short, and never through the published proxy", () => {
    const complete = createRealGsapSeam();
    const completeTimeline = complete.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    // A grid that already reaches the end needs no help, and must not be given any.
    expect(complete.created[0]?.tweenCount()).toBe(1);
    expect(completeTimeline.duration).toBeCloseTo(1, 10);

    const short = createRealGsapSeam();
    const shortTimeline = short.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 100 },
          ],
        },
      },
    });

    expect(short.created[0]?.tweenCount()).toBe(2);

    // Whatever pins the duration must not reach the adapter-owned proxy: an extra authored key
    // here would flow through Track.compose into a published patch and on to the renderer. The
    // pinned and unpinned proxies must therefore expose the same authored surface.
    completeTimeline.progress(1);
    shortTimeline.progress(1);
    expect(authoredKeys(shortTimeline.state)).toEqual(["x"]);
    expect(authoredKeys(shortTimeline.state)).toEqual(authoredKeys(completeTimeline.state));
    expect(shortTimeline.state).not.toHaveProperty("authoredEnd");

    completeTimeline.kill();
    shortTimeline.kill();
  });
});
