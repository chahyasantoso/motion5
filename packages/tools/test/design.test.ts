import { describe, expect, it } from "vitest";
import { intentsOf, readDesign } from "../src/scene/design";

describe("a piece's design", () => {
  it("reads a quality per field and a quality per beat, and flattens them in order", () => {
    const read = readDesign({ ball: { y: "heavy", scaleY: { land: "loose", rise: "light" } } });
    if (read.kind === "refused") throw new Error(read.reason);
    expect(intentsOf(read.design)).toEqual([
      { target: "ball", field: "y", beat: undefined, quality: "heavy" },
      { target: "ball", field: "scaleY", beat: "land", quality: "loose" },
      { target: "ball", field: "scaleY", beat: "rise", quality: "light" },
    ]);
  });

  it("refuses what is not that shape, naming where", () => {
    expect(readDesign("heavy").kind).toBe("refused");
    expect(readDesign({ ball: "heavy" })).toEqual({
      kind: "refused",
      reason: expect.stringContaining('"ball" is not a record of fields'),
    });
    expect(readDesign({ ball: { y: 3 } })).toEqual({
      kind: "refused",
      reason: expect.stringContaining('"ball.y" is neither'),
    });
    expect(readDesign({ ball: { y: { land: 1 } } }).kind).toBe("refused");
    expect(readDesign({ reason: { y: "heavy" } }).kind).toBe("design");
  });
});
