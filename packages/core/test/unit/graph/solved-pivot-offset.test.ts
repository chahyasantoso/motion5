import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type {
  AuthoredProperty,
  AuthoredStop,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";

// The review of `feat/d-base` (issue #195, comment 5459619345), second finding.
//
// Neither solve accounts for a member's pivot offset. `fk` places a bone's pivot at `x`, `y` in its
// base's rotated space and then extends by `length`, while the analytic path reads `length` alone
// and the iterative one is handed lengths and a topology, so a non-zero offset moves the tip the
// solve placed and the chain misses its goal by exactly that vector, with no diagnostic and a
// `ready` patch. Both paths therefore share one convention rather than two: a solved member's pivot
// sits on its base's tip, and an authored offset is refused at load.
//
// `RS-` rather than a new series, and rather than `FO-`. `FO-` owns what an authored `x` and `y`
// mean on a bone and in whose space they are read, which is unchanged here. `RS-` owns solver
// resolution in `graph/ir.ts`, which is where this rule lives and where `RS-9` already pins the
// scope its neighbour `ik-solved-rotation-dead` reads.

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

/** An authored ramp that leaves zero, and one that never does. */
const RAMP: readonly AuthoredStop[] = [
  { p: 0, v: 0 },
  { p: 1, v: 6 },
];
const ZERO_RAMP: readonly AuthoredStop[] = [
  { p: 0, v: 0 },
  { p: 1, v: 0 },
];

const BASE_RIG: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
  },
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
];

/** The worked rig with the named tracks replaced, plus any extra track a case needs to exist. */
function rig(
  replacements: readonly TrackDefinition[],
  extra: readonly TrackDefinition[] = [],
): ProjectDefinition {
  const byId = new Map(replacements.map((track) => [track.id, track] as const));
  return project([...BASE_RIG.map((track) => byId.get(track.id) ?? track), ...extra]);
}

/** `upper-arm`, with its authored `fk` values varying and its bindings fixed. */
function solved(values: Readonly<Record<string, AuthoredProperty>>): TrackDefinition {
  return {
    id: "upper-arm",
    keyframes: { fk: { values, requires: { base: "shoulder", solver: "arm-solve" } } },
  };
}

const OFFSET_X = rig([solved({ length: 80, x: 12 })]);
const OFFSET_Y = rig([solved({ length: 80, y: -4 })]);
const OFFSET_BOTH = rig([solved({ length: 80, x: 12, y: -4 })]);
const OFFSET_ANIMATED = rig([solved({ length: 80, y: RAMP })]);
const OFFSET_ZERO = rig([solved({ length: 80, x: 0, y: 0 })]);
const OFFSET_ZERO_STOPS = rig([solved({ length: 80, x: ZERO_RAMP })]);

/** The chain root, offset from its own parent exactly as the walker's shoulder is. */
const OFFSET_ON_ROOT = rig([
  { id: "shoulder", keyframes: { fk: { values: { x: 0, y: -50, length: 0 } } } },
]);

/** An ordinary FK bone below the chain, hanging off the solved tip with a pivot of its own. */
const HAND: TrackDefinition = {
  id: "hand",
  keyframes: { fk: { values: { length: 20, x: 6 }, requires: { base: "forearm" } } },
};
const OFFSET_BELOW_CHAIN = rig([], [HAND]);

/** `spring` binds the solver, so `fk`'s authored pivot is `fk`'s own live input. */
const OFFSET_IN_OTHER_GROUP = rig([
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80, x: 12 }, requires: { base: "shoulder" } },
      spring: { requires: { solver: "arm-solve" } },
    },
  },
]);

/** A flat `x`, which names no group and therefore no owner this layer can read. */
const FLAT_OFFSET = rig([
  {
    id: "upper-arm",
    keyframes: {
      x: 12,
      fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
]);

describe("a solved member's pivot sits on its base's tip", () => {
  it("RS-11 refuses a non-zero pivot offset on a solved member, naming the keys", () => {
    expect(reported(buildGraphIR(OFFSET_X))).toEqual([
      "ik-solved-pivot-unsupported at walker/upper-arm",
    ]);
    expect(reported(buildGraphIR(OFFSET_Y))).toEqual([
      "ik-solved-pivot-unsupported at walker/upper-arm",
    ]);

    // A keyframed offset is refused by value rather than by presence, so a ramp that starts at zero
    // and leaves it is one diagnostic rather than none.
    expect(reported(buildGraphIR(OFFSET_ANIMATED))).toEqual([
      "ik-solved-pivot-unsupported at walker/upper-arm",
    ]);

    // One diagnostic per member listing both keys, rather than one per key: the author has one
    // thing to fix, and `compareDiagnostics` orders by rule id and path, so two would be
    // indistinguishable in the report.
    const both = buildGraphIR(OFFSET_BOTH);
    expect(reported(both)).toEqual(["ik-solved-pivot-unsupported at walker/upper-arm"]);
    const refused = both.diagnostics[0]!;
    expect(refused.severity).toBe("error");
    expect(refused.ids).toEqual(["walker/upper-arm"]);
    expect(refused.message).toContain("x, y");
    expect(both.graph).toBeUndefined();

    // Both builders answer identically, because both finalize through `finalizeGraph`.
    const incremental = new IncrementalGraphBuilder().build(OFFSET_BOTH);
    expect(incremental.diagnostics).toEqual(both.diagnostics);
  });

  it("RS-12 accepts every offset neither solve is answerable for", () => {
    // An authored zero composes exactly the frame an unauthored pivot composes, so refusing it would
    // refuse a rig that is already right. Same for a ramp that never leaves zero: the rule reads
    // what a leaf can be rather than whether the key is present, which is the one difference
    // between it and `ik-solved-rotation-dead`.
    expect(reported(buildGraphIR(OFFSET_ZERO))).toEqual([]);
    expect(reported(buildGraphIR(OFFSET_ZERO_STOPS))).toEqual([]);

    // The chain root is not a member, and the solve reads its composed frame whatever produced it,
    // so an offset there is ordinary FK. This is the walker's own shoulder, which hangs off the
    // pelvis at `y: -50`, and a rule that refused it would have refused the rig the two-bone arm
    // ships on.
    expect(reported(buildGraphIR(OFFSET_ON_ROOT))).toEqual([]);

    // And a bone below the chain composes from its base's solved frame like any other FK bone.
    expect(reported(buildGraphIR(OFFSET_BELOW_CHAIN))).toEqual([]);
  });

  it("RS-13 reads the group that bound solver and no other, exactly as RS-9 does", () => {
    // `spring` binds the solver here, so no solved rotation replaces the one `fk`'s pivot hangs on
    // and the offset is `fk`'s own live input. One reader answers this rule and the dead rotation,
    // rather than two that can drift about which group to look in.
    expect(reported(buildGraphIR(OFFSET_IN_OTHER_GROUP))).toEqual([]);

    // Accepted here and refused by the registry instead: a flat key names no group, and which
    // plugin owns one is the question this layer holds no registry to answer. See ADR-043.
    expect(reported(buildGraphIR(FLAT_OFFSET))).toEqual([]);
  });
});
