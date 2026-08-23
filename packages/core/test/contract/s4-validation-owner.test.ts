import { describe, expect, it } from "vitest";
import { validateKeyframes } from "../../src/contract/validate-v5";
import type { Diagnostic } from "../../src/contract/v5";

describe("S4 single authored-stop validator", () => {
  it("exports the shared validator and reports authored missing-boundary warnings", () => {
    const diagnostics: Diagnostic[] = [];
    validateKeyframes({ opacity: [{ p: 0.5, v: 1 }] }, "track.keyframes", diagnostics);
    expect(diagnostics.map(({ ruleId, severity }) => ({ ruleId, severity }))).toEqual([
      { ruleId: "stop-missing-start", severity: "warning" },
      { ruleId: "stop-missing-end", severity: "warning" },
    ]);
  });

  it("uses the same validation rules for contributed properties with a namespaced prefix", () => {
    const diagnostics: Diagnostic[] = [];
    validateKeyframes(
      {
        derived: [
          { p: 0.8, v: 1 },
          { p: 0.2, v: 2 },
        ],
      },
      "track.keyframes",
      diagnostics,
      { ruleIdPrefix: "plugin-contribution-" },
    );
    expect(diagnostics.map(({ ruleId, severity }) => ({ ruleId, severity }))).toEqual([
      { ruleId: "plugin-contribution-stop-position-order", severity: "error" },
      { ruleId: "plugin-contribution-stop-missing-start", severity: "warning" },
      { ruleId: "plugin-contribution-stop-missing-end", severity: "warning" },
    ]);
  });
});
