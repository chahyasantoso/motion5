import { describe, expect, it } from "vitest";
import { dragNumberValue, stepForLiteral } from "../src/pages/live/code-panel";

describe("stepForLiteral", () => {
  it("uses step 1 for integer values and step 0.01 for decimal values", () => {
    expect(stepForLiteral("700", 700)).toBe(1);
    expect(stepForLiteral("0.18", 0.18)).toBe(0.01);
    expect(stepForLiteral("-1300", -1300)).toBe(1);
    expect(stepForLiteral("0", 0)).toBe(1);
    expect(stepForLiteral(".5", 0.5)).toBe(0.01);
  });
});

describe("dragNumberValue", () => {
  it("drags integer and decimal values by pixel deltas, with no range", () => {
    expect(dragNumberValue(700, "700", 60)).toBe("760");
    expect(dragNumberValue(0.18, "0.18", 10)).toBe("0.28");
    expect(dragNumberValue(0.18, "0.18", 200)).toBe("2.18");
    expect(dragNumberValue(0.18, "0.18", -50)).toBe("-0.32");
    expect(dragNumberValue(-1300, "-1300", 100)).toBe("-1200");
  });
});
