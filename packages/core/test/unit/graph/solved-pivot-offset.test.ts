import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type {
  AuthoredProperty,
  AuthoredStop,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";

// Issue #214: a solved member may carry a pivot offset, because both solves now account for one.
//
// This file opened as the refusal `ik-solved-pivot-unsupported`, recorded by ADR-053 as a safety
// stop rather than an end state: neither solve modelled a member's authored `x` and `y`, so a
// non-zero offset moved the tip the solve placed and the chain missed its goal by exactly that
// vector, with a `ready` patch and no diagnostic. ADR-054 lands the geometry in both paths, and the
// rule is deleted rather than widened, because a rule that refuses a shape the runtime solves is
// worse than no rule. The three cases below are inverted rather than removed: an acceptance needs
// evidence exactly as a refusal did, and a deleted case is how a rule quietly comes back.
//
// `RS-` rather than a new series, and the ids are kept. `RS-` owns solver resolution in
// `graph/ir.ts`, which is the layer that stopped reporting; `PV-` owns the geometry that let it stop
// and lives beside the solves it changed. What each case pins has moved, which is what the titles
// say, and `RS-13` now carries the whole of the shared reader's coverage because the dead rotation
// is the only rule left that uses it.

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

/** Both members offset, which is the shape the analytic path reduces to a link and a twist. */
const OFFSET_EVERY_MEMBER = rig([
  solved({ length: 80, x: 12, y: -4 }),
  {
    id: "forearm",
    keyframes: {
      fk: {
        values: { length: 60, x: -7, y: 9 },
        requires: { base: "upper-arm", solver: "arm-solve" },
      },
    },
  },
]);

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

/** A solved member authoring the one key the solve does replace. */
const ROTATION_ON_MEMBER = rig([solved({ length: 80, x: 12, rotation: 15 })]);

/** `spring` binds the solver, so `fk`'s authored rotation is `fk`'s own live input. */
const ROTATION_IN_OTHER_GROUP = rig([
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80, rotation: 15 }, requires: { base: "shoulder" } },
      spring: { requires: { solver: "arm-solve" } },
    },
  },
]);

/** A flat `rotation`, which names no group and therefore no owner this layer can read. */
const FLAT_ROTATION = rig([
  {
    id: "upper-arm",
    keyframes: {
      rotation: 15,
      fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
]);

describe("a solved member may carry a pivot offset", () => {
  it("RS-11 accepts a non-zero pivot offset on a solved member", () => {
    // The inversion, key by key and shape by shape. Every fixture here was a diagnostic and is now a
    // graph, because `ik` accounts for the offset instead of the loader refusing it.
    expect(reported(buildGraphIR(OFFSET_X))).toEqual([]);
    expect(reported(buildGraphIR(OFFSET_Y))).toEqual([]);
    expect(reported(buildGraphIR(OFFSET_BOTH))).toEqual([]);

    // A keyframed offset too. The refusal read the value rather than the key so that an authored
    // zero stayed legal; nothing reads it now, and a ramp that leaves zero is an animated pivot on a
    // solved bone, which is a rig rather than a mistake.
    expect(reported(buildGraphIR(OFFSET_ANIMATED))).toEqual([]);

    // Built rather than merely undiagnosed, which is the assertion an empty diagnostics array does
    // not make on its own: the chain still derives, and both builders answer identically because
    // both finalize through `finalizeGraph`.
    const both = buildGraphIR(OFFSET_BOTH);
    expect(both.graph).toBeDefined();
    expect(both.graph?.nodeById["walker/arm-solve"]?.solves?.map(({ id }) => id)).toEqual([
      "walker/upper-arm",
      "walker/forearm",
    ]);
    const incremental = new IncrementalGraphBuilder().build(OFFSET_BOTH);
    expect(incremental.diagnostics).toEqual(both.diagnostics);

    // Every member of one chain, which is the shape the closed form reduces to a rigid link and a
    // twist and the iterative path walks as pivots. One rule refused it and no rule replaces it.
    const every = buildGraphIR(OFFSET_EVERY_MEMBER);
    expect(reported(every)).toEqual([]);
    expect(every.graph).toBeDefined();
  });

  it("RS-12 still accepts every offset it accepted before", () => {
    // The other half of a deletion: the shapes that were already legal have to stay legal, or the
    // change is a swap rather than a widening. An authored zero and a ramp that never leaves it are
    // the two the refusal was careful to allow.
    expect(reported(buildGraphIR(OFFSET_ZERO))).toEqual([]);
    expect(reported(buildGraphIR(OFFSET_ZERO_STOPS))).toEqual([]);

    // The chain root is not a member, and the solve reads its composed frame whatever produced it,
    // so an offset there is ordinary FK and moves the whole chain rigidly. This is the walker's own
    // shoulder, which hangs off the pelvis at `y: -50`.
    expect(reported(buildGraphIR(OFFSET_ON_ROOT))).toEqual([]);

    // And a bone below the chain composes from its base's solved frame like any other FK bone.
    expect(reported(buildGraphIR(OFFSET_BELOW_CHAIN))).toEqual([]);
  });

  it("RS-13 still reads the group that bound solver, for the one rule left that asks", () => {
    // `authoredByBinders` was generalised to a key so that the pivot rule and the dead rotation
    // asked one function which group bound the solver. The pivot rule is gone and the reader stays
    // general, so its scope needs evidence that no longer travels with a second caller: this case
    // carries all of it now.
    //
    // A solved rotation is still dead input, and it is still refused beside an accepted offset on
    // the same member, which is the pairing that says the deletion was scoped to one key rather than
    // to the rule beside it.
    expect(reported(buildGraphIR(ROTATION_ON_MEMBER))).toEqual([
      "ik-solved-rotation-dead at walker/upper-arm",
    ]);

    // `spring` binds the solver here, so no solved rotation replaces `fk`'s, and the authored one is
    // `fk`'s own live input rather than dead.
    expect(reported(buildGraphIR(ROTATION_IN_OTHER_GROUP))).toEqual([]);

    // Accepted here and refused by the registry instead: a flat key names no group, and which plugin
    // owns one is the question this layer holds no registry to answer. See ADR-043.
    expect(reported(buildGraphIR(FLAT_ROTATION))).toEqual([]);
  });
});
