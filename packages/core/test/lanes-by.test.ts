import { describe, expect, it } from "vitest";
import { atProgress, lanes } from "@gerak/core";

const places = (of: ReturnType<typeof lanes>) => of.starts.map((start) => start / of.stagger);

describe("lanes by", () => {
  it("starts lanes in ascending order of their value", () => {
    expect(places(lanes([1, 1, 1], 0.25, { by: [30, 10, 20] }))).toEqual([2, 0, 1]);
  });

  it("lets equal values share a place", () => {
    expect(places(lanes([1, 1, 1, 1], 0.25, { by: [3, 1, 2, 1] }))).toEqual([2, 0, 1, 0]);
    const same = lanes([1, 1, 1], 0.25, { by: [5, 5, 5] });
    expect(same.starts).toEqual([0, 0, 0]);
    expect(same.span).toBe(1);
  });

  it("matches the order from gives when by holds the same order", () => {
    expect(lanes([1, 1, 1], 0.25, { by: [2, 1, 0] }).starts).toEqual(
      lanes([1, 1, 1], 0.25, { from: "end" }).starts,
    );
  });

  it("refuses by with the wrong count, a non-number, or beside from", () => {
    expect(() => lanes([1, 1, 1], 0.25, { by: [1, 2] })).toThrow(RangeError);
    expect(() => lanes([1, 1], 0.25, { by: [1, Number.NaN] })).toThrow(RangeError);
    expect(() => lanes([1, 1], 0.25, { by: [1, 2], from: "end" })).toThrow(RangeError);
  });
});

describe("lanes zero length", () => {
  it("lets a zero-length lane follow the overall position", () => {
    const set = lanes([1, 0, 1], 0.25);
    expect(set.of(atProgress(0.5), 1).progress).toBe(0.5);
    expect(set.of(atProgress(0.5), 0).progress).toBeCloseTo(0.75, 12);
  });
});
