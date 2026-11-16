import { describe, expect, it } from "vitest";
import {
  arcPath,
  circlePath,
  clamp,
  ellipsePath,
  isClosedPath,
  linePath,
  pathArea,
  pathBounds,
  pathFrom,
  pathLength,
  polygonPath,
  rectPath,
  resamplePath,
  reversePath,
  transformPath,
} from "../src/index";

describe("pathFrom", () => {
  it("reads nothing from empty data", () => {
    expect(pathFrom("")).toEqual({ outlines: [] });
  });

  it("reads a lone move as no outline and names where bad data stops", () => {
    expect(pathFrom("M 5 5").outlines).toEqual([]);
    const bad = pathFrom("M 0 0 L 10 0 X");
    expect(bad.error).toContain("unknown command");
    expect(bad.outlines[0]).toHaveLength(1);
  });

  it("closes a triangle with an explicit line and keeps each subpath apart", () => {
    const read = pathFrom("M 0 0 L 10 0 L 10 10 Z M 20 20 L 30 20");
    expect(read.outlines.map((outline) => outline.length)).toEqual([3, 1]);
    expect(isClosedPath(read.outlines[0] ?? [])).toBe(true);
    expect(isClosedPath(read.outlines[1] ?? [])).toBe(false);
  });

  it("names every cubic once across the path", () => {
    const ids = pathFrom("M 0 0 L 1 0 M 5 5 L 6 5")
      .outlines.flat()
      .map((cubic) => cubic.id);
    expect(ids).toEqual(["p0", "p1"]);
  });
});

describe("arcPath", () => {
  it("draws nothing between a point and itself", () => {
    expect(arcPath({ x0: 3, y0: 3, x1: 3, y1: 3, rx: 5, ry: 5 })).toEqual([]);
  });

  it("falls back to a line when a radius is zero", () => {
    const [only, ...rest] = arcPath({ x0: 0, y0: 0, x1: 9, y1: 0, rx: 0, ry: 4 });
    expect(rest).toEqual([]);
    expect(only?.x3).toBe(9);
  });

  it("draws a full circle as two half arcs of four quarter cubics that close", () => {
    const first = arcPath({ x0: 10, y0: 0, x1: -10, y1: 0, rx: 10, ry: 10, sweep: true });
    const second = arcPath({ x0: -10, y0: 0, x1: 10, y1: 0, rx: 10, ry: 10, sweep: true });
    expect([...first, ...second]).toHaveLength(4);
    expect(isClosedPath([...first, ...second])).toBe(true);
    expect(pathArea([...first, ...second])).toBeGreaterThan(250);
  });
});

describe("shape paths", () => {
  it("gives a rectangle four sides and a rounded one eight cubics", () => {
    expect(rectPath({ x: 0, y: 0, width: 10, height: 5 })).toHaveLength(4);
    expect(rectPath({ x: 0, y: 0, width: 10, height: 5, rx: 2 })).toHaveLength(8);
  });

  it("gives a zero-size rectangle, circle or ellipse no path", () => {
    expect(rectPath({ x: 0, y: 0, width: 0, height: 5 })).toEqual([]);
    expect(circlePath({ cx: 0, cy: 0, r: 0 })).toEqual([]);
    expect(ellipsePath({ cx: 0, cy: 0, rx: 3, ry: 0 })).toEqual([]);
  });

  it("closes a circle on its first point", () => {
    const circle = circlePath({ cx: 5, cy: 5, r: 5 });
    expect(circle).toHaveLength(4);
    expect(circle[0]?.x0).toBe(10);
    expect(isClosedPath(circle)).toBe(true);
  });

  it("leaves a polygon open or closes it, and ignores a stray number", () => {
    expect(polygonPath({ points: [], closed: true })).toEqual([]);
    expect(polygonPath({ points: [1, 2], closed: false })).toEqual([]);
    const open = polygonPath({ points: [0, 0, 10, 0, 10, 10], closed: false });
    const shut = polygonPath({ points: [0, 0, 10, 0, 10, 10], closed: true });
    expect([open.length, isClosedPath(open)]).toEqual([2, false]);
    expect([shut.length, isClosedPath(shut)]).toEqual([3, true]);
  });

  it("gives a line one cubic that starts and ends where it was told", () => {
    const [only] = linePath({ x1: 1, y1: 2, x2: 7, y2: 8 });
    expect([only?.x0, only?.y0, only?.x3, only?.y3]).toEqual([1, 2, 7, 8]);
  });
});

describe("path edits", () => {
  const square = rectPath({ x: 0, y: 0, width: 10, height: 10 });

  it("moves every point through a matrix and keeps the ids", () => {
    const moved = transformPath(square, [2, 0, 0, 2, 5, 1]);
    expect(moved.map((cubic) => cubic.id)).toEqual(square.map((cubic) => cubic.id));
    expect(pathBounds(moved)).toEqual({ x: 5, y: 1, width: 20, height: 20 });
    expect(transformPath([], [1, 0, 0, 1, 3, 3])).toEqual([]);
  });

  it("reverses a path so it starts at its old end and runs the other way", () => {
    const back = reversePath(square);
    expect(back[0]?.x0).toBe(square[3]?.x3);
    expect(pathArea(back)).toBeCloseTo(-pathArea(square));
    expect(reversePath([])).toEqual([]);
  });

  it("splits the longest cubic until it has the count, and leaves a long path alone", () => {
    const line = linePath({ x1: 0, y1: 0, x2: 8, y2: 0 });
    const six = resamplePath(line, 6);
    expect(six).toHaveLength(6);
    expect(six.at(-1)?.x3).toBe(8);
    expect(resamplePath(square, 2)).toEqual(square);
    expect(resamplePath([], 3)).toEqual([]);
  });
});

describe("path measures", () => {
  it("bounds an empty path as nothing and a point as no size", () => {
    expect(pathBounds([])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    const point = pathFrom("M 4 5 L 4 5").outlines.flat();
    expect(pathBounds(point)).toEqual({ x: 4, y: 5, width: 0, height: 0 });
  });

  it("bounds a zero-size rectangle as nothing", () => {
    expect(pathBounds(rectPath({ x: 3, y: 3, width: 0, height: 0 }))).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it("measures the curve tighter than its control points", () => {
    const bump = pathFrom("M 0 0 C 0 10 10 10 10 0").outlines.flat();
    expect(pathBounds(bump).height).toBe(10);
    expect(pathBounds(bump, "curve").height).toBeCloseTo(7.5, 5);
  });

  it("signs the area by the way round and finds none in an open line", () => {
    const square = rectPath({ x: 0, y: 0, width: 10, height: 10 });
    expect(Math.abs(pathArea(square))).toBeGreaterThan(50);
    expect(pathArea(reversePath(square)) * pathArea(square)).toBeLessThan(0);
    expect(pathArea([])).toBe(0);
    expect(pathArea(linePath({ x1: 0, y1: 0, x2: 5, y2: 0 }))).toBe(0);
  });

  it("calls an empty path open and a rectangle closed", () => {
    expect(isClosedPath([])).toBe(false);
    expect(isClosedPath(rectPath({ x: 0, y: 0, width: 4, height: 4 }))).toBe(true);
    expect(isClosedPath(linePath({ x1: 0, y1: 0, x2: 4, y2: 4 }))).toBe(false);
  });

  it("reads a straight table's length and clamps a distance past it", () => {
    const table = pathLength(1, (_, t) => [10 * t, 0]);
    expect(table.total).toBeCloseTo(10);
    expect(table.locate(99).t).toBeCloseTo(1);
    expect(pathLength(0, () => [0]).total).toBe(0);
  });
});

describe("clamp", () => {
  it("holds a value in its range and passes NaN through", () => {
    expect([clamp(5, 0, 1), clamp(-5, 0, 1), clamp(0.5, 0, 1)]).toEqual([1, 0, 0.5]);
    expect(Number.isNaN(clamp(Number.NaN, 0, 1))).toBe(true);
  });
});
