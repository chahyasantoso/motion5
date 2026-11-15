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
  it("refuses values that are not what their types say", () => {
    const refuse = (patch: Record<string, unknown>, pattern: RegExp): void => {
      expect(() => Reflect.apply(defineStyle, undefined, [{ ...good, ...patch }])).toThrow(pattern);
    };
    refuse({ lively: { y: [Number.NaN, 1] } }, /y/);
    refuse({ lively: { y: ["a", "b"] } }, /y/);
    refuse({ lively: [] }, /lively/);
    refuse({ qualities: { arrive: { rings: [0, Number.NaN] } } }, /arrive.*rings/);
    refuse({ qualities: { arrive: { settle: [0, 2] } } }, /arrive.*settle/);
    refuse({ tokens: { "--a: red; } .x { color": "red" } }, /--a/);
    refuse({ tokens: { "--ink": 3 } }, /--ink/);
    refuse({ tokens: { "--ink": "red; color: blue" } }, /--ink/);
    refuse({ habits: ["fine", 3] }, /habit 1/);
    expect(() => defineStyle({ ...good, qualities: { arrive: { rings: [0, 4] } } })).not.toThrow();
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
