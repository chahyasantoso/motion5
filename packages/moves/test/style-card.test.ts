import { describe, expect, it } from "vitest";
import { defineStyle, isLively, isStyleCard, type Descriptors, type StyleCard } from "@gerak/moves";

const good: StyleCard = {
  name: "reel",
  description: "A reel.",
  qualities: { arrive: { overshoot: [0.1, 0.5] } },
  lively: { y: [0.5, 1] },
  tokens: { "--ink": "black" },
  habits: ["Land with a bounce."],
};

describe("defineStyle", () => {
  it("refuses a lively range that is reversed, past 1, or for an unknown field", () => {
    const refuse = (lively: unknown, pattern: RegExp): void => {
      const bad = { ...good, lively };
      expect(() => Reflect.apply(defineStyle, undefined, [bad])).toThrow(pattern);
    };
    refuse({ y: [0.6, 0.2] }, /y/);
    refuse({ y: [0, 1.5] }, /y/);
    refuse({ nope: [0, 1] }, /nope/);
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

describe("isLively", () => {
  const still: Descriptors = {
    travelling: true,
    peak: 0.5,
    overshoot: 0,
    rings: 0,
    windup: 0,
    settle: 0.1,
  };
  it("is true for overshoot, rings or windup past their floors", () => {
    expect(isLively({ ...still, overshoot: 0.05 })).toBe(true);
    expect(isLively({ ...still, rings: 1 })).toBe(true);
    expect(isLively({ ...still, windup: 0.05 })).toBe(true);
  });
  it("is false for none and for overshoot 0.02", () => {
    expect(isLively(still)).toBe(false);
    expect(isLively({ ...still, overshoot: 0.02 })).toBe(false);
  });
});
