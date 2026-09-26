import { describe, expect, it } from "vitest";
import { validateKeyframes } from "../../src/contract/validate-v5";
import type { Diagnostic } from "../../src/contract/v5";

describe("S4 single authored-stop validator", () => {
  it("exports the shared validator and reports authored missing-boundary warnings", () => {
    const diagnostics: Diagnostic[] = [];
    validateKeyframes(
      { style: { values: { opacity: [{ p: 0.5, v: 1 }] } } },
      "track.keyframes",
      diagnostics,
    );
    expect(diagnostics.map(({ ruleId, severity }) => ({ ruleId, severity }))).toEqual([
      { ruleId: "stop-missing-start", severity: "warning" },
      { ruleId: "stop-missing-end", severity: "warning" },
    ]);
  });

  // The reporter, named. This case used to pass `ruleIdPrefix` on its own and then expect
  // `plugin-contribution-stop-position-order`, which the run time never emits and `RuleId` does not
  // carry: the one production caller always passed the four entry alias map alongside the prefix, so
  // a case setting one option without the other described a reporter that did not exist. The scope
  // makes that combination unrepresentable, so the expectation below is the aliased id the
  // contribution reporter actually reports.
  it("reports the contribution scope's own aliased ids for a contributed property", () => {
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
      { scope: "contribution" },
    );
    expect(diagnostics.map(({ ruleId, severity }) => ({ ruleId, severity }))).toEqual([
      { ruleId: "plugin-contribution-stop-order", severity: "error" },
      { ruleId: "plugin-contribution-stop-missing-start", severity: "warning" },
      { ruleId: "plugin-contribution-stop-missing-end", severity: "warning" },
    ]);
  });
});
