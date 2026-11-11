import { describe, expect, it } from "vitest";
import { defineMove, type Time } from "@gerak/moves";
import {
  dragNumberValue,
  moveSourceFrom,
  rangeForLiteral,
  stepForLiteral,
} from "../src/live/code-panel";

describe("stepForLiteral", () => {
  it("uses step 1 for integer values and step 0.01 for decimal values", () => {
    expect(stepForLiteral("700", 700)).toBe(1);
    expect(stepForLiteral("0.18", 0.18)).toBe(0.01);
    expect(stepForLiteral("-1300", -1300)).toBe(1);
    expect(stepForLiteral("0", 0)).toBe(1);
    expect(stepForLiteral(".5", 0.5)).toBe(0.01);
  });
});

describe("rangeForLiteral", () => {
  it("resolves option bounds for known moves and empty bounds otherwise", () => {
    expect(rangeForLiteral("drop", "distance")).toEqual({ min: 0 });
    expect(rangeForLiteral("drop", "squash")).toEqual({ min: 0, max: 1 });
    expect(rangeForLiteral(undefined, undefined)).toEqual({});
    expect(rangeForLiteral("drop", "unknownProp")).toEqual({});
    expect(rangeForLiteral("unknownMove", "distance")).toEqual({});
  });

  it("reads the bounds of a move the scene exports, before a built-in move of that name", () => {
    expect(rangeForLiteral("drop", "distance", { drop: 1 })).toEqual({});
    const slide = defineMove({
      id: "slide",
      role: "enter",
      example: { options: { from: 40 } },
      description: "Slides in from the side.",
      options: { from: { kind: "number", min: -50, max: 50, description: "Start offset." } },
      moments: () => ({}),
      run: (options, time: Time) => ({ x: options.from * (1 - time.progress) }),
    });
    expect(rangeForLiteral("slide", "from")).toEqual({});
    expect(rangeForLiteral("slide", "from", { slide })).toEqual({ min: -50, max: 50 });
    expect(dragNumberValue(40, "40", 30, "slide", "from", { slide })).toBe("50");
    expect(rangeForLiteral("span", "from")).toEqual({});
  });
});

describe("moveSourceFrom", () => {
  it("puts app moves after the scene's exports and before the built-ins", () => {
    const own = { a: "scene", b: "scene" };
    const merged = moveSourceFrom(own, [
      { a: "app", c: "app" },
      { c: "later", d: "app" },
    ]);
    expect(merged["a"]).toBe("scene");
    expect(merged["b"]).toBe("scene");
    expect(merged["c"]).toBe("app");
    expect(merged["d"]).toBe("app");
  });

  it("clamps a drag on a move that came only from an imported module", () => {
    const slide = defineMove({
      id: "slide",
      role: "enter",
      example: { options: { from: 40 } },
      description: "Slides in from the side.",
      options: { from: { kind: "number", min: -50, max: 50, description: "Start offset." } },
      moments: () => ({}),
      run: (options, time: Time) => ({ x: options.from * (1 - time.progress) }),
    });
    const merged = moveSourceFrom({}, [{ slide }]);
    expect(rangeForLiteral("slide", "from", merged)).toEqual({ min: -50, max: 50 });
    expect(dragNumberValue(40, "40", 30, "slide", "from", merged)).toBe("50");
    const shadow = moveSourceFrom({}, [{ drop: 1 }]);
    expect(rangeForLiteral("drop", "distance", shadow)).toEqual({});
  });
});

describe("dragNumberValue", () => {
  it("drags integer and decimal values by pixel deltas with range clamping", () => {
    // 700 dragged by +60 -> "760"
    expect(dragNumberValue(700, "700", 60, "drop", "distance")).toBe("760");

    // 0.18 dragged by +10 inside drop.squash -> "0.28"
    expect(dragNumberValue(0.18, "0.18", 10, "drop", "squash")).toBe("0.28");

    // clamped at 1 when dragged by +200 inside drop.squash
    expect(dragNumberValue(0.18, "0.18", 200, "drop", "squash")).toBe("1");

    // clamped at 0 when dragged negatively below min
    expect(dragNumberValue(0.18, "0.18", -50, "drop", "squash")).toBe("0");

    // negative numbers dragged without bounds
    expect(dragNumberValue(-1300, "-1300", 100)).toBe("-1200");
  });
});
