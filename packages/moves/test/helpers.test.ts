import { describe, expect, it } from "vitest";
import {
  atProgress,
  ease,
  hop,
  keyframes,
  seeded,
  mix,
  mixAngle,
  mixPoint,
  mixPose,
  span,
  type Time,
} from "@motion5/moves";

const timed = (elapsed: number): Time => ({
  progress: elapsed / 4000,
  clock: { kind: "timed", elapsed, length: 4000 },
});

describe("ease", () => {
  it("starts every curve at 0 and ends it at 1", () => {
    for (const [name, curve] of Object.entries(ease)) {
      expect(curve(0), name).toBeCloseTo(0, 9);
      expect(curve(1), name).toBeCloseTo(1, 9);
    }
  });

  it("passes the middle of every in-out curve at one half", () => {
    for (const [name, curve] of Object.entries(ease))
      if (name.endsWith("InOut")) expect(curve(0.5), name).toBeCloseTo(0.5, 9);
  });

  it("overshoots on back out and starts slow on cubic in", () => {
    expect(Math.max(...[0.6, 0.7, 0.8].map(ease.backOut))).toBeGreaterThan(1);
    expect(ease.cubicIn(0.2)).toBeLessThan(0.2);
    expect(ease.cubicOut(0.2)).toBeGreaterThan(0.2);
  });
});

describe("mix", () => {
  it("blends numbers, points and angles the short way round", () => {
    expect(mix(10, 20, 0.25)).toBe(12.5);
    expect(mixPoint({ x: 0, y: 10 }, { x: 10, y: 0 }, 0.5)).toEqual({ x: 5, y: 5 });
    expect(mixAngle(350, 10, 0.5)).toBeCloseTo(360, 9);
    expect(mixAngle(10, 350, 0.5)).toBeCloseTo(0, 9);
  });

  it("blends poses with a missing field at its rest", () => {
    expect(mixPose({ x: 10, opacity: 0 }, { y: 20, anchor: "left" }, 0.5)).toEqual({
      x: 5,
      y: 10,
      opacity: 0.5,
      anchor: "left",
    });
  });
});

describe("span", () => {
  const flight = span(400, 2400, 4000);

  it("gives a move its time inside the span, with an optional ease", () => {
    const inside = flight.of(timed(1400));
    expect(inside.progress).toBeCloseTo(0.5, 9);
    expect(inside.clock).toEqual({ kind: "timed", elapsed: 1000, length: 2000 });
    expect(flight.of(atProgress(0.1)).progress).toBe(0);
    expect(flight.of(timed(900), ease.quadIn).progress).toBeCloseTo(0.0625, 9);
  });

  it("names the scene ms a move's moment falls on", () => {
    const { lastLanding } = hop.moments({ height: 300, bounces: 2, decay: 0.35 });
    const landMs = flight.at(lastLanding);
    expect(landMs).toBeCloseTo(400 + 2000 * lastLanding, 9);
    const options = { height: 300, bounces: 2, decay: 0.35 };
    expect(hop(options, flight.of(timed(landMs - 1e-6))).y).toBeCloseTo(0, 3);
  });

  it("refuses a scene with no length", () => {
    expect(() => span(0, 100, 0)).toThrow(/span: durationMs must be above 0/);
  });
});

describe("keyframes", () => {
  const lean = keyframes(
    4000,
    0,
    [
      { at: 1000, to: 0 },
      { at: 2000, to: 10, ease: ease.quadIn },
      { at: 3000, to: -10 },
    ],
    mix,
  );

  it("holds through a repeated key, then eases into the next", () => {
    expect(lean(timed(500))).toBe(0);
    expect(lean(timed(1500))).toBeCloseTo(2.5, 9);
    expect(lean(timed(2000))).toBeCloseTo(10, 9);
  });

  it("moves linearly with no ease and holds the last value after the last key", () => {
    expect(lean(timed(2500))).toBeCloseTo(0, 9);
    expect(lean(timed(3999))).toBeCloseTo(-10, 9);
  });

  it("blends points or poses with the matching mix", () => {
    const hand = keyframes(4000, { x: 0, y: 0 }, [{ at: 2000, to: { x: 100, y: 50 } }], mixPoint);
    expect(hand(timed(1000))).toEqual({ x: 50, y: 25 });
  });

  it("refuses keys out of order", () => {
    expect(() =>
      keyframes(
        4000,
        0,
        [
          { at: 2000, to: 1 },
          { at: 1000, to: 2 },
        ],
        mix,
      ),
    ).toThrow(/keyframes: key at 1000 ms comes before 2000 ms/);
  });
});

describe("seeded", () => {
  it("repeats for a seed, differs between seeds, and stays from 0 up to 1", () => {
    const draw = (seed: number) => Array.from({ length: 50 }, seeded(seed));
    expect(draw(7)).toEqual(draw(7));
    expect(draw(7)).not.toEqual(draw(8));
    for (const value of draw(3)) expect(value >= 0 && value < 1).toBe(true);
  });
});
