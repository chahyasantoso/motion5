import { describe, expect, it } from "vitest";
import {
  arc,
  atProgress,
  fade,
  nod,
  pop,
  pulse,
  rise,
  shake,
  slide,
  swing,
  unfold,
  wobble,
} from "@gerak/moves";

const at = atProgress;

function crossings(values: readonly number[]): number {
  let count = 0;
  for (let i = 1; i < values.length; i += 1) {
    const before = values[i - 1] ?? 0;
    const after = values[i] ?? 0;
    if (before * after < 0) count += 1;
  }
  return count;
}

function sampled(read: (progress: number) => number): number[] {
  return Array.from({ length: 401 }, (_, i) => read(i / 400));
}

describe("entrances", () => {
  it("rise starts below rest and decelerates up to it", () => {
    expect(rise({ distance: 100 }, at(0)).y).toBeCloseTo(100);
    expect(rise({ distance: 100 }, at(1)).y).toBeCloseTo(0);
    const early = rise({ distance: 100 }, at(0.25)).y ?? 0;
    const middle = rise({ distance: 100 }, at(0.5)).y ?? 0;
    expect(middle).toBeLessThan(early);
    expect(early - middle).toBeLessThan(100 - early);
  });

  it("slide starts on the named side and reaches rest", () => {
    expect(slide({ distance: 80 }, at(0)).x).toBeCloseTo(-80);
    expect(slide({ distance: 80, from: "right" }, at(0)).x).toBeCloseTo(80);
    expect(slide({ distance: 80, from: "top" }, at(0)).y).toBeCloseTo(-80);
    expect(slide({ distance: 80, from: "bottom" }, at(0)).y).toBeCloseTo(80);
    expect(slide({ distance: 80, from: "right" }, at(1)).x).toBeCloseTo(0);
  });

  it("pop grows past full size and ends at exactly 1", () => {
    const sizes = sampled((p) => pop({}, at(p)).scale ?? 0);
    expect(sizes[0]).toBe(0);
    expect(Math.max(...sizes)).toBeCloseTo(1.2, 2);
    expect(sizes[400]).toBe(1);
    const peak = pop.moments({}).peak;
    expect(pop({}, at(typeof peak === "number" ? peak : 0)).scale).toBeCloseTo(1.2);
    expect(Math.max(...sampled((p) => pop({ overshoot: 0 }, at(p)).scale ?? 0))).toBeCloseTo(1);
  });

  it("fade runs opacity from 0 to 1", () => {
    expect(fade({}, at(0)).opacity).toBe(0);
    expect(fade({}, at(0.5)).opacity).toBeGreaterThan(0);
    expect(fade({}, at(1)).opacity).toBe(1);
  });

  it("unfold grows along one axis from the edge that stays put", () => {
    expect(unfold({}, at(0))).toEqual({ scaleY: 0, anchor: "top" });
    expect(unfold({ from: "bottom" }, at(0.5)).anchor).toBe("bottom");
    expect(unfold({ from: "left" }, at(0))).toEqual({ scaleX: 0, anchor: "left" });
    expect(unfold({ from: "right" }, at(1))).toEqual({ scaleX: 1, anchor: "right" });
  });

  it("swing starts at the angle, swings across zero and settles at 0", () => {
    const turns = sampled((p) => swing({ angle: 40, swings: 2 }, at(p)).rotation ?? 0);
    expect(turns[0]).toBeCloseTo(40);
    expect(turns[400]).toBe(0);
    expect(crossings(turns)).toBeGreaterThanOrEqual(2);
    expect(Math.abs(turns[300] ?? 0)).toBeLessThan(10);
    expect(swing({ angle: 40 }, at(0)).anchor).toBe("top");
    expect(swing({ angle: 40, anchor: "left" }, at(0.5)).anchor).toBe("left");
  });
});

describe("emphases", () => {
  it("pulse grows to 1 + amount and returns", () => {
    expect(pulse({}, at(0)).scale).toBe(1);
    expect(pulse({ amount: 0.5 }, at(0.5)).scale).toBeCloseTo(1.5);
    expect(pulse({}, at(1)).scale).toBe(1);
  });

  it("shake crosses zero at least count times and is 0 at both ends", () => {
    const xs = sampled((p) => shake({ distance: 10, count: 4 }, at(p)).x ?? 0);
    expect(crossings(xs)).toBeGreaterThanOrEqual(4);
    expect(xs[0]).toBeCloseTo(0);
    expect(xs[400]).toBeCloseTo(0);
    expect(Math.max(...xs.map(Math.abs))).toBeLessThanOrEqual(10);
    expect(Math.max(...xs.map(Math.abs))).toBeGreaterThan(5);
  });

  it("wobble turns back and forth and is 0 at both ends", () => {
    const turns = sampled((p) => wobble({ angle: 8, count: 3 }, at(p)).rotation ?? 0);
    expect(crossings(turns)).toBeGreaterThanOrEqual(3);
    expect(turns[0]).toBeCloseTo(0);
    expect(turns[400]).toBeCloseTo(0);
    expect(Math.max(...turns.map(Math.abs))).toBeGreaterThan(4);
  });

  it("nod dips down to its bottom and comes back", () => {
    expect(nod({ distance: 20 }, at(0)).y).toBeCloseTo(0);
    expect(nod({ distance: 20 }, at(0.5)).y).toBeCloseTo(20);
    expect(nod({ distance: 20 }, at(1)).y).toBeCloseTo(0);
    expect(nod.moments({ distance: 20 }).bottom).toBe(0.5);
  });
});

describe("arc", () => {
  const options = { dx: -200, dy: 0, lift: 60 } as const;

  it("starts at the offset and ends at rest", () => {
    expect(arc(options, at(0)).x).toBeCloseTo(-200);
    expect(arc(options, at(0)).y).toBeCloseTo(0);
    const end = arc(options, at(1));
    expect(end.x).toBeCloseTo(0);
    expect(end.y).toBeCloseTo(0);
  });

  it("bows off the straight line at the middle, and the other way when negative", () => {
    const up = arc(options, at(0.5)).y ?? 0;
    const down = arc({ ...options, lift: -60 }, at(0.5)).y ?? 0;
    expect(Math.abs(up)).toBeGreaterThan(5);
    expect(down).toBeCloseTo(-up);
    expect(arc({ ...options, lift: 0 }, at(0.5)).y).toBeCloseTo(0);
  });

  it("stays finite when it starts at rest", () => {
    const pose = arc({ dx: 0, dy: 0, lift: 30 }, at(0.5));
    expect(pose.x).toBeCloseTo(0);
    expect(pose.y).toBeCloseTo(0);
  });
});
