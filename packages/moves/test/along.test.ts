import { describe, expect, it } from "vitest";
import { along, type Cubic2d } from "@gerak/moves";

const cubic = (id: string, p: number[]): Cubic2d => ({
  id,
  x0: p[0] ?? 0,
  y0: p[1] ?? 0,
  x1: p[2] ?? 0,
  y1: p[3] ?? 0,
  x2: p[4] ?? 0,
  y2: p[5] ?? 0,
  x3: p[6] ?? 0,
  y3: p[7] ?? 0,
});
const sCurve = [
  cubic("a", [0, 0, 0, 100, 100, 100, 100, 200]),
  cubic("b", [100, 200, 100, 300, 300, 300, 300, 400]),
];

describe("along", () => {
  it("hits the first and last points at share 0 and 1, and clamps outside", () => {
    expect(along(sCurve, 0)).toEqual({ x: 0, y: 0 });
    const end = along(sCurve, 1);
    expect(end.x).toBeCloseTo(300, 9);
    expect(end.y).toBeCloseTo(400, 9);
    expect(along(sCurve, 2)).toEqual(along(sCurve, 1));
    expect(along(sCurve, -1)).toEqual(along(sCurve, 0));
  });

  it("covers equal distance in equal share steps", () => {
    const points = Array.from({ length: 11 }, (_, i) => along(sCurve, i / 10));
    const lengths = points.slice(1).map((p, i) => {
      const q = points[i];
      return Math.hypot((p.x ?? 0) - (q?.x ?? 0), (p.y ?? 0) - (q?.y ?? 0));
    });
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    for (const length of lengths) expect(Math.abs(length - mean) / mean).toBeLessThan(0.02);
  });

  it("heads 0 along a horizontal segment and 90 down a vertical one", () => {
    const flat = [cubic("h", [0, 0, 10, 0, 20, 0, 30, 0])];
    const down = [cubic("v", [0, 0, 0, 10, 0, 20, 0, 30])];
    expect(along(flat, 0.5, { turn: true }).rotation).toBeCloseTo(0, 9);
    expect(along(down, 0.5, { turn: true }).rotation).toBeCloseTo(90, 9);
    expect(along(down, 0.5).rotation).toBeUndefined();
  });

  it("refuses an empty path", () => {
    expect(() => along([], 0.5)).toThrow(RangeError);
  });
});
