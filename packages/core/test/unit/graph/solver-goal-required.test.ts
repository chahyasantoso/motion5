import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type {
  AuthoredPluginRequires,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";

// The review of `feat/d-base` (issue #195, comment 5459619345), first finding.
//
// A solver with a root and members and no goal loaded clean and failed at composition instead.
// `solveChain` throws on an empty goal map, `ik-leaf-without-goal` is guarded by the dict having
// been used at all, and the bare `target` slot is a separate read, so the one shape that binds
// neither had no owner at load: every member published `blocked-upstream` behind an `error` on the
// solver, once per tick, for a shape the loader could name. The implementation therefore
// contradicted its own documented contract, which is the one documentation failure worse than no
// documentation. The throw stays as the invariant guard behind this rule, in the same spirit as
// `readMembers`.
//
// `MG-` rather than a new series: this is the sixth load-time goal rule, and `MG-` owns whether a
// solver's goals resolve at all. `SL-` owns whether a slot may be claimed in the first place.

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "d5",
    motions: [{ id: "walker", trigger: { type: "time" }, tracks }],
  };
}

/** Rule id and path together, so a case pins what was reported and where, in order. */
function reported(result: GraphBuildResult): readonly string[] {
  return result.diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

/**
 * The worked rig, with only the solver's bindings varying.
 *
 * Typed as `AuthoredPluginRequires` rather than as a loose record, so a fixture that could not be
 * authored at all is a type error here rather than a case asserting a shape no author can write.
 */
function rig(requires: AuthoredPluginRequires): ProjectDefinition {
  return project([
    { id: "shoulder" },
    { id: "hand-target" },
    { id: "arm-solve", keyframes: { ik: { requires } } },
    {
      id: "upper-arm",
      keyframes: {
        fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
      },
    },
    {
      id: "forearm",
      keyframes: {
        fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
      },
    },
  ]);
}

const NO_GOAL = rig({ root: "shoulder" });
const BARE_TARGET = rig({ root: "shoulder", target: "hand-target" });
const GOAL_DICT = rig({ root: "shoulder", targets: { forearm: "hand-target" } });

/**
 * Two members hanging straight off the root, with one of the two leaves named.
 *
 * `MG-6` owns this shape for `ik-leaf-without-goal`. It is here for the interaction rather than for
 * the rule: the two refusals answer for different absences and a rig may never collect both.
 */
const UNNAMED_LEAF = project([
  { id: "hip" },
  { id: "goal" },
  {
    id: "solve",
    keyframes: { ik: { requires: { root: "hip", targets: { left: "goal" } } } },
  },
  {
    id: "left",
    keyframes: { fk: { values: { length: 40 }, requires: { base: "hip", solver: "solve" } } },
  },
  {
    id: "right",
    keyframes: { fk: { values: { length: 40 }, requires: { base: "hip", solver: "solve" } } },
  },
]);

describe("a solver with nothing to reach for is refused at load", () => {
  it("MG-14 a solver binding neither target nor targets is refused by name", () => {
    const result = buildGraphIR(NO_GOAL);
    expect(reported(result)).toEqual(["ik-solver-no-goal at walker/arm-solve"]);

    const refused = result.diagnostics[0]!;
    expect(refused.severity).toBe("error");
    expect(refused.ids).toEqual(["walker/arm-solve"]);
    // The error stops the build, so no member reaches a graph whose solver cannot solve.
    expect(result.graph).toBeUndefined();

    // Both builders answer identically, because both finalize through `finalizeGraph`. The runtime
    // is the half that used to reach composition, so a rule the incremental builder missed would
    // leave the throw reachable through a live mutation.
    const incremental = new IncrementalGraphBuilder().build(NO_GOAL);
    expect(incremental.diagnostics).toEqual(result.diagnostics);
    expect(incremental.graph).toBeUndefined();
  });

  it("MG-15 either goal spelling satisfies the rule, and only absence reports", () => {
    // The rule is about absence rather than about spelling. `target` is exactly the degenerate case
    // of the dict and neither is deprecated, so a solver that bound either one is untouched and no
    // existing rig is re-authored to buy the refusal.
    expect(reported(buildGraphIR(BARE_TARGET))).toEqual([]);
    expect(reported(buildGraphIR(GOAL_DICT))).toEqual([]);

    // And it never reports beside `ik-leaf-without-goal`, which is guarded by the dict having been
    // used at all. One rule answers for a solver that addressed nothing and the other for a leaf
    // the dict skipped, so one cause is never reported twice.
    expect(reported(buildGraphIR(UNNAMED_LEAF))).toEqual(["ik-leaf-without-goal at walker/solve"]);
  });
});
