import { describe, expect, it } from "vitest";
import { createRealGsapSeam, readNumber } from "../support/real-gsap";

/**
 * Phase 5 semantic equivalence tests for the GSAP interpolator.
 * These must pass before any optimization is attempted.
 * Covers the six semantic properties listed in 5A:
 *   - per-stop easing
 *   - zero-duration behavior
 *   - progress() getter (reads back set value)
 *   - kill() idempotency
 *   - sparse properties + initial values (covered by gsap-sparse-percent-map separately)
 *   - proxy-owned mutable state (state object mutates, not replaced)
 */
describe("GSAP interpolator semantic equivalence (P5 baseline)", () => {
  it("per-stop ease: applies authored ease to the correct segment only", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power2.in" },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    // At p=0 and p=1 values are exact regardless of easing
    timeline.progress(0);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(0, 4);
    timeline.progress(1);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100, 4);
    // At p=0.5 the authored stop must land exactly on its value
    timeline.progress(0.5);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(50, 4);
    // With power2.in the first segment eases in: midpoint is below linear
    timeline.progress(0.25);
    const xAt25 = readNumber(timeline.state, "x");
    // linear would give 25; power2.in curves below that
    expect(xAt25).toBeLessThan(25);

    timeline.kill();
  });

  it("zero-duration: creates timeline with duration 0 and state holds authored value", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 0,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 42 },
            { p: 1, v: 42 },
          ],
        },
      },
    });
    expect(timeline.duration).toBe(0);
    timeline.progress(0);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(42, 6);
    timeline.progress(1);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(42, 6);
    timeline.kill();
  });

  it("progress() getter reads back the last value set via progress() setter", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
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
    timeline.progress(0.33);
    expect(timeline.progress()).toBeCloseTo(0.33, 4);
    timeline.progress(0.77);
    expect(timeline.progress()).toBeCloseTo(0.77, 4);
    timeline.kill();
  });

  it("kill() is idempotent: second kill() does not throw", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 10 },
          ],
        },
      },
    });
    expect(() => {
      timeline.kill();
      timeline.kill();
    }).not.toThrow();
  });

  it("proxy-owned mutable state: same state object reference is mutated, not replaced", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
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
    const ref = timeline.state;
    timeline.progress(0.5);
    // Same reference — state is mutated in place, not replaced
    expect(timeline.state).toBe(ref);
    expect(readNumber(ref, "x")).toBeCloseTo(50, 4);
    timeline.kill();
  });

  it("multi-property: two properties reach their final values independently", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.6, v: 60 },
          ],
        },
        y: {
          stops: [
            { p: 0.4, v: 40 },
            { p: 1, v: 100 },
          ],
        },
      },
    });
    timeline.progress(0.3);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(30, 4);
    // y hasn't started yet (first stop at 0.4)
    expect(readNumber(timeline.state, "y")).toBeCloseTo(40, 4);
    timeline.progress(0.8);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(60, 4);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(80, 4);
    timeline.progress(1);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(100, 4);
    timeline.kill();
  });
});
