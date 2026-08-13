import { describe, expect, it } from "vitest";
import { compilePercentKeyframes } from "../../src/domain/keyframe-compiler";

describe("S2 sparse percent-keyframe compilation", () => {
  it("does not inject sibling or boundary properties into authored percent entries", () => {
    const compiled = compilePercentKeyframes({
      x: {
        stops: [
          { p: 0, v: 0 },
          { p: 0.5, v: 50 },
          { p: 1, v: 100 },
        ],
      },
      y: {
        stops: [
          { p: 0.2, v: 20 },
          { p: 0.25, v: 25 },
          { p: 1, v: 100 },
        ],
      },
    });

    expect(Object.keys(compiled.map)).toEqual(["0%", "20%", "25%", "50%", "100%"]);
    expect(compiled.map["0%"]?.y).toBeUndefined();
    expect(compiled.map["20%"]?.x).toBeUndefined();
    expect(compiled.map["50%"]?.y).toBeUndefined();
    expect(compiled.initial).toEqual({ x: 0, y: 20 });
  });

  it("preserves authored ease without injecting ease none", () => {
    const compiled = compilePercentKeyframes({
      x: {
        stops: [
          { p: 0, v: 0 },
          { p: 0.5, v: 50, ease: "power2.out" },
          { p: 1, v: 100 },
        ],
      },
      y: {
        stops: [
          { p: 0, v: 0 },
          { p: 1, v: 100 },
        ],
      },
    });

    expect(compiled.map["50%"]?.ease).toBe("power2.out");
    expect(compiled.map["0%"]?.ease).toBeUndefined();
    expect(compiled.map["25%"]?.ease).toBeUndefined();
  });

  it("returns a structured ease-collision diagnostic with sorted property ids", () => {
    const compiled = compilePercentKeyframes(
      {
        y: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power2.out" },
            { p: 1, v: 100 },
          ],
        },
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power1.out" },
            { p: 1, v: 100 },
          ],
        },
      },
      "hero/arm.keyframes",
    );

    expect(compiled.diagnostics).toEqual([
      {
        ruleId: "plugin-contribution-ease-collision",
        path: 'hero/arm.keyframes["50%"].ease',
        message: "Conflicting ease values were authored at 50%.",
        severity: "error",
        ids: ["x", "y"],
      },
    ]);
  });
});
