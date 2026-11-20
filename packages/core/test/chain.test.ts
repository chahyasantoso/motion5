import { describe, expect, it } from "vitest";
import { chain } from "@gerak/core";

const ends = (lengths: readonly number[], options?: { gap?: number; overlap?: number }) =>
  chain(lengths, options).map((each) => [each.from, each.to]);

describe("chain", () => {
  it("starts the first at 0 and each where the last ends", () => {
    expect(ends([500, 300, 200])).toEqual([
      [0, 500],
      [500, 800],
      [800, 1000],
    ]);
  });

  it("leaves a gap between spans", () => {
    expect(ends([500, 300, 200], { gap: 100 })).toEqual([
      [0, 500],
      [600, 900],
      [1000, 1200],
    ]);
  });

  it("starts each before the last ends by an overlap", () => {
    expect(ends([500, 300, 200], { overlap: 100 })).toEqual([
      [0, 500],
      [400, 700],
      [600, 800],
    ]);
    expect(ends([500, 300], { overlap: 300 })).toEqual([
      [0, 500],
      [200, 500],
    ]);
  });

  it("holds a zero-length span and an empty list", () => {
    expect(ends([0, 300])).toEqual([
      [0, 0],
      [0, 300],
    ]);
    expect(ends([])).toEqual([]);
  });

  it("gives spans that place a move's time", () => {
    const [first, second] = chain([500, 500], { gap: 500 });
    const time = { progress: 0.75, clock: { kind: "timed", elapsed: 1125, length: 1500 } } as const;
    expect(first?.of(time).progress).toBe(1);
    expect(second?.of(time).progress).toBeCloseTo(0.25, 12);
  });

  it("refuses a negative length, both options, and an overlap longer than a length", () => {
    expect(() => chain([100, -1])).toThrow(RangeError);
    expect(() => chain([100], { gap: 10, overlap: 10 })).toThrow(RangeError);
    expect(() => chain([100, 50], { overlap: 60 })).toThrow(RangeError);
    expect(() => chain([100], { gap: -1 })).toThrow(RangeError);
  });
});
