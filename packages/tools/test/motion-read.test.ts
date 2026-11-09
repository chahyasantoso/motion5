import { describe, expect, it } from "vitest";
import { ease } from "@motion5/moves";
import { NAMED_CURVES, bezier, fitCurve } from "../src/page/curves";
import { parseReadArgs, segmentsOf } from "../src/page/read";

const STEP = 16;
const times = (count: number) => Array.from({ length: count }, (_, index) => index * STEP);
const sample = (curve: (u: number) => number, count = 30) =>
  Array.from({ length: count + 1 }, (_, index) => ({ u: index / count, p: curve(index / count) }));

describe("motion:read curves", () => {
  it("name each curve as @motion5/moves names its ease", () => {
    const eases: Readonly<Record<string, (u: number) => number>> = ease;
    for (const [name, curve] of Object.entries(NAMED_CURVES))
      for (const u of [0, 0.1, 0.35, 0.5, 0.8, 1])
        expect(curve(u), `${name} at ${u}`).toBeCloseTo(eases[name]?.(u) ?? NaN, 9);
  });

  it("name a measured named curve, with no bezier", () => {
    expect(fitCurve(sample(NAMED_CURVES.cubicOut ?? Math.sqrt))).toEqual({
      name: "cubicOut",
      rms: 0,
    });
    expect(fitCurve(sample(NAMED_CURVES.backOut ?? Math.sqrt)).name).toBe("backOut");
  });

  it("fit a cubic-bezier when no named curve is close", () => {
    const fit = fitCurve(sample(bezier([0.1, 0.7, 0.3, 1])));
    expect(fit.rms).toBeGreaterThan(0.02);
    expect(fit.bezier?.rms).toBeLessThan(0.01);
  });

  it("name only the nearest curve for a move too short to fit", () => {
    expect(fitCurve(sample(bezier([0.1, 0.7, 0.3, 1]), 5)).bezier).toBeUndefined();
  });
});

describe("motion:read segments", () => {
  it("read a still channel as no move", () => {
    expect(segmentsOf("x", times(20), Array(20).fill(5))).toEqual([]);
  });

  it("read one move with its start, end and ease", () => {
    const values = [
      ...Array(5).fill(-700),
      ...sample(NAMED_CURVES.quadIn ?? Math.sqrt, 20).map(({ p }) => -700 + 700 * p),
      ...Array(10).fill(0),
    ];
    const [move, ...rest] = segmentsOf("y", times(values.length), values);
    expect(rest).toEqual([]);
    expect(move).toMatchObject({ channel: "y", from: -700, to: 0, start: 80, end: 400 });
    expect(move?.ease).toMatchObject({ name: "quadIn" });
  });

  it("split an arc at its top, where it turns all the way back", () => {
    const values = sample((u) => 4 * u * (1 - u), 40).map(({ p }) => -200 * p);
    const moves = segmentsOf("y", times(values.length), values);
    expect(moves.map(({ from, to }) => [Math.round(from) + 0, Math.round(to) + 0])).toEqual([
      [0, -200],
      [-200, 0],
    ]);
    expect(moves.map(({ ease }) => ease.name)).toEqual(["quadOut", "quadIn"]);
  });

  it("keep an overshoot that settles back a little inside one move", () => {
    const values = sample(NAMED_CURVES.backOut ?? Math.sqrt, 30).map(({ p }) => 100 * p);
    const moves = segmentsOf("x", times(values.length), values);
    expect(moves).toHaveLength(1);
    expect(moves[0]?.ease.name).toBe("backOut");
  });
});

describe("motion:read arguments", () => {
  it("need selectors and an end time", () => {
    expect(parseReadArgs(["timing.html", "--to", "3000"]).kind).toBe("usage");
    expect(parseReadArgs(["timing.html", "--select", ".a, .b", "--to", "3000"])).toMatchObject({
      kind: "ok",
      select: [".a", ".b"],
      to: 3000,
    });
  });
});

describe("page actions with a point", () => {
  it("click at a point on the element, given after the time", async () => {
    const { parseActions } = await import("../src/page/actions");
    expect(parseActions("click:.stage@300(200,150),hover:.card@400")).toEqual([
      { kind: "click", selector: ".stage", at: 300, point: { x: 200, y: 150 } },
      { kind: "hover", selector: ".card", at: 400 },
    ]);
  });
});

describe("motion:read turns", () => {
  it("reads a turn across ±180 degrees as the small turn it is", async () => {
    const { unwrapTurns } = await import("../src/page/read");
    expect(unwrapTurns([179, -179, -175, 178])).toEqual([179, 181, 185, 178]);
    const still = unwrapTurns([179.95, -179.98, 179.99, -179.97]);
    expect(segmentsOf("rotation", times(still.length), still)).toEqual([]);
  });
});
