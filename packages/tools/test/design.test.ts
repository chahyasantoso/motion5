import { describe, expect, it } from "vitest";
import { intentsOf, readDesign } from "../src/scene/design";

describe("a piece's design", () => {
  it("reads a quality per field and a quality per beat, and flattens them in order", () => {
    const design = readDesign({ ball: { y: "heavy", scaleY: { land: "loose", rise: "light" } } });
    if ("reason" in design) throw new Error(design.reason);
    expect(intentsOf(design)).toEqual([
      { target: "ball", field: "y", beat: undefined, quality: "heavy" },
      { target: "ball", field: "scaleY", beat: "land", quality: "loose" },
      { target: "ball", field: "scaleY", beat: "rise", quality: "light" },
    ]);
  });

  it("refuses what is not that shape, naming where", () => {
    expect(readDesign("heavy")).toHaveProperty("reason");
    expect(readDesign({ ball: "heavy" })).toEqual({
      reason: expect.stringContaining('"ball" is not a record of fields'),
    });
    expect(readDesign({ ball: { y: 3 } })).toEqual({
      reason: expect.stringContaining('"ball.y" is neither'),
    });
    expect(readDesign({ ball: { y: { land: 1 } } })).toHaveProperty("reason");
  });
});
