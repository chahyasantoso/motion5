import { describe, expect, it } from "vitest";
import { parsePointsArgs, resample, toRows } from "../src/page/points";

describe("motion:points", () => {
  it("places points every spacing along the polyline, across corners, keeping both ends", () => {
    const out = resample(
      [
        { x: 0, y: 0 },
        { x: 25, y: 0 },
        { x: 25, y: 25 },
      ],
      10,
    );
    expect(out).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 0 },
      { x: 25, y: 5 },
      { x: 25, y: 15 },
      { x: 25, y: 25 },
    ]);
  });

  it("writes rows a rope can take as values", () => {
    expect(toRows([{ x: 1.234, y: 2 }], "q")).toEqual([{ id: "q0", cells: { x: 1.23, y: 2 } }]);
  });

  it("reads its arguments and refuses bad ones", () => {
    expect(parsePointsArgs(["a.json", "--spacing", "12"])).toEqual({
      kind: "ok",
      file: "a.json",
      spacing: 12,
      prefix: "p",
    });
    expect(parsePointsArgs(["a.json"]).kind).toBe("usage");
    expect(parsePointsArgs(["a.json", "--spacing", "0"]).kind).toBe("usage");
    expect(parsePointsArgs(["a.json", "--spacing", "5", "--prefix", "9x"]).kind).toBe("usage");
  });
});
