import { describe, expect, it } from "vitest";
import { squashed } from "@gerak/moves";

const weights = Array.from({ length: 20 }, (_, i) => i / 19);

describe("squashed", () => {
  it("squashes against the floor by default, as before", () => {
    for (const weight of weights)
      expect(squashed(0.4, weight)).toEqual({
        scaleX: 1 + 0.9 * 0.4 * weight,
        scaleY: 1 - 0.4 * weight,
        anchor: "bottom",
      });
  });

  it("shortens y against a ceiling or about the centre, and x against a wall", () => {
    expect(squashed(0.5, 1, "top")).toEqual({ scaleX: 1.45, scaleY: 0.5, anchor: "top" });
    expect(squashed(0.5, 1, "center")).toEqual({ scaleX: 1.45, scaleY: 0.5, anchor: "center" });
    expect(squashed(0.5, 1, "left")).toEqual({ scaleX: 0.5, scaleY: 1.45, anchor: "left" });
    expect(squashed(0.5, 1, "right")).toEqual({ scaleX: 0.5, scaleY: 1.45, anchor: "right" });
  });
});
