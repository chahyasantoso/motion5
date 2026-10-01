import { describe, expect, it } from "vitest";
import { createCvFilter, wrapAngle } from "../src/filler/kalman";

const noise = { measurementVariance: 0.001, accelerationVariance: 0.5 };

describe("constant-velocity scalar filter", () => {
  it("GF-33 wraps angular innovations rather than learning a full-turn velocity", () => {
    expect(wrapAngle(-3 * Math.PI)).toBeCloseTo(-Math.PI, 12);
    for (const sign of [-1, 1]) {
      const filter = createCvFilter({ kind: "angle" }, noise);
      filter.step(0, { value: sign * (Math.PI - 0.01), visibility: 1 });
      const next = filter.step(100, { value: -sign * (Math.PI - 0.01), visibility: 1 })!;
      expect(Math.abs(wrapAngle(next.value - sign * Math.PI))).toBeLessThan(0.02);
      expect(Math.abs(next.velocity)).toBeLessThan(1);
    }
  });

  it("GF-34 learns velocity, scales visibility noise, and keeps covariance positive semidefinite", () => {
    const filter = createCvFilter({ kind: "angle" }, noise);
    let tMs = 0;
    for (let index = 0; index < 3000; index += 1) {
      tMs += [10, 33, 70][index % 3]!;
      const state = filter.step(tMs, { value: wrapAngle(tMs / 1000), visibility: 0.8 })!;
      expect(Object.values(state).every(Number.isFinite)).toBe(true);
      expect(state.p00).toBeGreaterThanOrEqual(0);
      expect(state.p11).toBeGreaterThanOrEqual(0);
      expect(state.p00 * state.p11 - state.p01 ** 2).toBeGreaterThanOrEqual(-1e-12);
    }
    expect(filter.state!.velocity).toBeCloseTo(1, 5);
    const predicted = filter.step(tMs + 200)!;
    expect(wrapAngle(predicted.value - filter.step(tMs + 400)!.value)).toBeCloseTo(-0.2, 5);
    const correction = (visibility: number) => {
      const scalar = createCvFilter({ kind: "position" }, noise);
      scalar.step(0, { value: 0, visibility: 1 });
      return scalar.step(100, { value: 1, visibility })!.value;
    };
    expect(correction(0.1)).toBeLessThan(correction(1));
  });

  it("GF-35 refuses bad inputs and resets without inventing an unobserved state", () => {
    for (const variance of [0, -1, Infinity, NaN])
      expect(() =>
        createCvFilter({ kind: "angle" }, { ...noise, measurementVariance: variance }),
      ).toThrow(/variance/);
    const filter = createCvFilter({ kind: "position" }, noise);
    expect(filter.step(10)).toBeUndefined();
    filter.step(20, { value: 3, visibility: 1 });
    expect(() => filter.step(19)).toThrow(/timestamps/);
    expect(() => filter.step(NaN)).toThrow(/timestamps/);
    expect(() => filter.step(21, { value: Infinity, visibility: 1 })).toThrow(/measurement/);
    expect(() => filter.step(21, { value: 4, visibility: -1 })).toThrow(/measurement/);
    expect(filter.state!.tMs).toBe(20);
    const huge = createCvFilter(
      { kind: "position" },
      {
        measurementVariance: Number.MAX_VALUE,
        accelerationVariance: 1,
      },
    );
    expect(() => huge.step(0, { value: 0, visibility: 0.05 })).toThrow(/overflow/);
    expect(huge.state).toBeUndefined();
    filter.reset();
    expect(filter.step(0)).toBeUndefined();
  });
});
