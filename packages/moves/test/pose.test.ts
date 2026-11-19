import { describe, expect, it } from "vitest";
import { squashed } from "@gerak/moves";

const weights = Array.from({ length: 20 }, (_, i) => i / 19);

describe("squashed", () => {
  it("squashes against the floor by default, as before", () => {
    for (const weight of weights)
      expect(squashed({ squash: 0.4 })(weight)).toEqual({
        scaleX: 1 + 0.9 * 0.4 * weight,
        scaleY: 1 - 0.4 * weight,
        anchor: "bottom",
      });
  });

  it("shortens y against a ceiling or about the centre, and x against a wall", () => {
    expect(squashed({ squash: 0.5, anchor: "top" })(1)).toEqual({
      scaleX: 1.45,
      scaleY: 0.5,
      anchor: "top",
    });
    expect(squashed({ squash: 0.5, anchor: "center" })(1)).toEqual({
      scaleX: 1.45,
      scaleY: 0.5,
      anchor: "center",
    });
    expect(squashed({ squash: 0.5, anchor: "left" })(1)).toEqual({
      scaleX: 0.5,
      scaleY: 1.45,
      anchor: "left",
    });
    expect(squashed({ squash: 0.5, anchor: "right" })(1)).toEqual({
      scaleX: 0.5,
      scaleY: 1.45,
      anchor: "right",
    });
  });
});
