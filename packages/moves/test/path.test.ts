import { describe, expect, it } from "vitest";
import { toCubics } from "@gerak/moves";

describe("toCubics", () => {
  it("joins each anchor to the next through their handles, one segment per pair", () => {
    const cubics = toCubics([
      { id: "a", x: 0, y: 0, inX: 0, inY: 0, outX: 10, outY: 0 },
      { id: "b", x: 100, y: 0, inX: -10, inY: 5, outX: 0, outY: 0 },
      { id: "c", x: 100, y: 100, inX: 0, inY: 0, outX: 0, outY: 0 },
    ]);
    expect(cubics).toEqual([
      { id: "a", x0: 0, y0: 0, x1: 10, y1: 0, x2: 90, y2: 5, x3: 100, y3: 0 },
      { id: "b", x0: 100, y0: 0, x1: 100, y1: 0, x2: 100, y2: 100, x3: 100, y3: 100 },
    ]);
  });

  it("has no segment for fewer than two anchors", () => {
    expect(toCubics([{ id: "a", x: 1, y: 1, inX: 0, inY: 0, outX: 0, outY: 0 }])).toEqual([]);
  });
});
