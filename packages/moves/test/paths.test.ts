import { describe, expect, it } from "vitest";
import { atProgress, combine, lane, lanes, rope, trace, wipe, type Time } from "@gerak/moves";

describe("wipe", () => {
  it("grows its reveal from nothing to the radius, easing in and out", () => {
    const options = { radius: 200, x: 10, y: 20 };
    expect(wipe(options, atProgress(0))).toEqual({ x: 10, y: 20, radius: 0 });
    expect(wipe(options, atProgress(0.5))).toEqual({ x: 10, y: 20, radius: 100 });
    expect(wipe(options, atProgress(1))).toEqual({ x: 10, y: 20, radius: 200 });
    expect(wipe(options, atProgress(0.25)).radius).toBeCloseTo(200 * 0.15625, 12);
  });
});

describe("trace", () => {
  it("draws the share of its path that progress has reached", () => {
    expect(trace({}, atProgress(0.3))).toEqual({ drawn: 0.3 });
  });
});

describe("rope", () => {
  const points = [
    { id: "a", x: 0, y: 0 },
    { id: "b", x: 0, y: 100 },
    { id: "c", x: 100, y: 100 },
  ];

  it("starts straight along its angle from the pinned end, keeping every link's length", () => {
    const start = rope({ angle: 0 }, atProgress(0), { points });
    expect(start.map(({ id }) => id)).toEqual(["a", "b", "c"]);
    expect(start[0]).toMatchObject({ x: 0, y: 0 });
    expect(start[1]?.x).toBeCloseTo(100, 9);
    expect(start[1]?.y).toBeCloseTo(0, 9);
    expect(start[2]?.x).toBeCloseTo(200, 9);
  });

  it("reaches its shape at the end", () => {
    const end = rope({}, atProgress(1), { points });
    end.forEach((anchor, index) => {
      expect(anchor.x).toBeCloseTo(points[index]!.x, 9);
      expect(anchor.y).toBeCloseTo(points[index]!.y, 9);
    });
  });

  it("keeps the other end on its point when pinned at the end", () => {
    const start = rope({ pin: "end" }, atProgress(0), { points });
    expect(start[2]).toMatchObject({ x: 100, y: 100 });
  });

  it("refuses fewer points than a chain needs", () => {
    expect(() => rope({}, atProgress(0), { points: [{ id: "a", x: 0, y: 0 }] })).toThrow(
      /rope: input "points" needs at least 2 rows/,
    );
  });

  it("types its inputs from the declaration", () => {
    // @ts-expect-error `points` is a declared input.
    expect(() => rope({}, atProgress(0))).toThrow(/rope: input "points" is required/);
  });
});

describe("combine", () => {
  it("adds offsets and turns, multiplies scales and opacity, and keeps the first anchor", () => {
    expect(
      combine([
        { x: 10, y: 5, scaleY: 0.5, anchor: "bottom" },
        { x: 3, rotation: 20, scaleY: 0.5, opacity: 0.5, anchor: "top" },
      ]),
    ).toEqual({ x: 13, y: 5, rotation: 20, scaleY: 0.25, opacity: 0.5, anchor: "bottom" });
  });

  it("leaves a field no pose names absent", () => {
    expect(combine([{ x: 1 }, {}])).toEqual({ x: 1 });
  });
});

describe("lane", () => {
  it("runs a lane inside a time, splitting a timed clock among the lanes", () => {
    const time: Time = { progress: 1 / 6, clock: { kind: "timed", elapsed: 100, length: 600 } };
    expect(lane(time, 0, lanes([1, 1, 1], 0.25))).toEqual({
      progress: expect.closeTo(0.25, 12),
      clock: { kind: "timed", elapsed: expect.closeTo(100, 9), length: expect.closeTo(400, 9) },
    });
    expect(lane(atProgress(0.5), 1, lanes([1, 1], 0))).toEqual(atProgress(0.5));
  });
});
