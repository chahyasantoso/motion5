import { describe, expect, it } from "vitest";
import { defineStyle, isStyleCard, type StyleCard } from "@gerak/moves";

const good: StyleCard = {
  name: "reel",
  description: "A reel.",
  qualities: { arrive: { overshoot: [0.1, 0.5] } },
  defaults: { y: "reel/arrive", x: "calm" },
  tokens: { "--ink": "black" },
  habits: ["Land with a bounce."],
};

describe("defineStyle", () => {
  it("refuses a default for an unknown field", () => {
    expect(() => defineStyle({ ...good, defaults: { nope: "calm" } as never })).toThrow(/nope/);
  });
  it("refuses an unknown default quality", () => {
    expect(() => defineStyle({ ...good, defaults: { y: "reel/missing" } })).toThrow(
      /reel\/missing/,
    );
  });
  it("refuses a reversed range", () => {
    expect(() => defineStyle({ ...good, qualities: { arrive: { peak: [0.9, 0.1] } } })).toThrow(
      /arrive.*peak/,
    );
  });
  it("refuses a token without dashes", () => {
    expect(() => defineStyle({ ...good, tokens: { ink: "black" } })).toThrow(/ink/);
  });
  it("freezes a good card and knows only its own", () => {
    const card = defineStyle(good);
    expect(Object.isFrozen(card.qualities["arrive"])).toBe(true);
    expect(Object.isFrozen(card)).toBe(true);
    expect(isStyleCard(card)).toBe(true);
    expect(isStyleCard({ ...card })).toBe(false);
  });
});
