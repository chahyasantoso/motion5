import { describe, expect, it } from "vitest";
import { gsap } from "gsap";
import { createGsapOneTweenInterpolator } from "../../src/adapters/interpolator/gsap";

describe("One-Tween GSAP Interpolator Contract Tests", () => {
  const interpolator = createGsapOneTweenInterpolator(gsap);

  it("preserves proxy-owned mutable state", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 1, v: 100 },
        ],
      },
    });
    const ref = tl.state;
    tl.progress(0.5);
    expect(tl.state).toBe(ref);
    expect((ref as { x: number }).x).toBeCloseTo(50, 4);
    tl.kill();
  });

  it("preserves exact progress values and getter/setter", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 1, v: 100 },
        ],
      },
    });
    tl.progress(0.33);
    expect(tl.progress()).toBeCloseTo(0.33, 4);
    tl.progress(0.77);
    expect(tl.progress()).toBeCloseTo(0.77, 4);
    tl.kill();
  });

  it("preserves per-stop easing on single property", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 0.5, v: 50, ease: "power2.in" },
          { p: 1, v: 100 },
        ],
      },
    });

    tl.progress(0);
    expect((tl.state as { x: number }).x).toBeCloseTo(0, 4);
    tl.progress(1);
    expect((tl.state as { x: number }).x).toBeCloseTo(100, 4);
    tl.progress(0.5);
    expect((tl.state as { x: number }).x).toBeCloseTo(50, 4);
    tl.progress(0.25);
    // with power2.in, midpoint of 0..0.5 is lower than 25
    expect((tl.state as { x: number }).x).toBeLessThan(25);
    tl.kill();
  });

  it("handles zero-duration correctly", () => {
    const tl = interpolator.create({
      duration: 0,
      keyframes: {
        x: [
          { p: 0, v: 42 },
          { p: 1, v: 42 },
        ],
      },
    });
    expect(tl.duration).toBe(0);
    tl.progress(0);
    expect((tl.state as { x: number }).x).toBeCloseTo(42, 4);
    tl.progress(1);
    expect((tl.state as { x: number }).x).toBeCloseTo(42, 4);
    tl.kill();
  });

  it("kill is idempotent", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 1, v: 10 },
        ],
      },
    });
    expect(() => {
      tl.kill();
      tl.kill();
    }).not.toThrow();
  });

  it("handles multi-property with independent stops", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 0.5, v: 50 },
          { p: 1, v: 100 },
        ],
        y: [
          { p: 0.2, v: 20 },
          { p: 0.25, v: 25 },
          { p: 1, v: 100 },
        ],
      },
    });

    tl.progress(0);
    expect((tl.state as { x: number }).x).toBeCloseTo(0, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(20, 4);

    tl.progress(0.2);
    expect((tl.state as { x: number }).x).toBeCloseTo(20, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(20, 4);

    tl.progress(0.25);
    expect((tl.state as { x: number }).x).toBeCloseTo(25, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(25, 4);

    tl.progress(0.5);
    expect((tl.state as { x: number }).x).toBeCloseTo(50, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(50, 4);

    tl.progress(1);
    expect((tl.state as { x: number }).x).toBeCloseTo(100, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(100, 4);

    tl.kill();
  });

  it("preserves authored easing without resampling a linear sibling", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 0.5, v: 100, ease: "power2.out" },
          { p: 1, v: 100 },
        ],
        y: [
          { p: 0, v: 0 },
          { p: 0.25, v: 25 },
          { p: 1, v: 100 },
        ],
      },
    });

    tl.progress(0.25);
    expect((tl.state as { x: number }).x).toBeCloseTo(87.5, 3);
    expect((tl.state as { y: number }).y).toBeCloseTo(25, 3);
    tl.progress(0.5);
    expect((tl.state as { x: number }).x).toBeCloseTo(100, 3);
    expect((tl.state as { y: number }).y).toBeCloseTo(50, 3);
    tl.kill();
  });

  it("holds value when stops end before duration", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 0.5, v: 100 },
        ],
      },
    });

    tl.progress(0.25);
    expect((tl.state as { x: number }).x).toBeCloseTo(50, 4);
    tl.progress(0.5);
    expect((tl.state as { x: number }).x).toBeCloseTo(100, 4);
    tl.progress(0.9);
    expect((tl.state as { x: number }).x).toBeCloseTo(100, 4);
    tl.progress(1);
    expect((tl.state as { x: number }).x).toBeCloseTo(100, 4);
    tl.kill();
  });

  it("holds every property independently when grids end at different positions", () => {
    const tl = interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 0.4, v: 40 },
        ],
        y: [
          { p: 0, v: 0 },
          { p: 0.75, v: 75 },
        ],
      },
    });

    tl.progress(0.375);
    expect((tl.state as { x: number }).x).toBeCloseTo(37.5, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(37.5, 4);

    tl.progress(0.9);
    expect((tl.state as { x: number }).x).toBeCloseTo(40, 4);
    expect((tl.state as { y: number }).y).toBeCloseTo(75, 4);

    tl.kill();
  });

  it("uses tweenVars ease when a stop does not override it", () => {
    const tl = interpolator.create({
      duration: 1,
      tweenVars: { ease: "power1.in" },
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 1, v: 100 },
        ],
      },
    });

    tl.progress(0.5);
    expect((tl.state as { x: number }).x).toBeCloseTo(25, 3);
    tl.kill();
  });

  it("handles empty keyframes with authored duration", () => {
    const tl = interpolator.create({ duration: 3, keyframes: {} });
    expect(tl.duration).toBe(3);
    tl.progress(0.5);
    tl.kill();
  });
});
