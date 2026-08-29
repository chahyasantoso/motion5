import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";

// Issue #211: what a solver-bound member may author once `weight` exists.
//
// Two rules, one group walker. `ik-solved-rotation-dead` narrows from "authored `rotation` at all"
// to "authored `rotation` with no `weight` beside it", and `ik-weight-without-solver` is its mirror.
// Both are presence-only, both speak only about a node that bound a `solver` slot somewhere, and
// both are scoped to the plugin group that bound it, which is what `RS-9` already pins for the first
// of them. See ADR-055.

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "wt",
    motions: [
      {
        id: "walker",
        trigger: { type: "time" },
        tracks,
      },
    ],
  };
}

const HAPPY_RIG: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: {
      ik: {
        requires: { root: "shoulder", target: "hand-target" },
      },
    },
  },
  {
    id: "upper-arm",
    keyframes: {
      fk: {
        values: { length: 80 },
        requires: { base: "shoulder", solver: "arm-solve" },
      },
    },
  },
  {
    id: "forearm",
    keyframes: {
      fk: {
        values: { length: 60 },
        requires: { base: "upper-arm", solver: "arm-solve" },
      },
    },
  },
  {
    id: "hand",
    keyframes: {
      fk: {
        values: { length: 20 },
        requires: { base: "forearm" },
      },
    },
  },
];

/** The happy rig with the named tracks replaced. */
function rig(replacements: readonly TrackDefinition[]): ProjectDefinition {
  const byId = new Map(replacements.map((track) => [track.id, track] as const));
  return project(HAPPY_RIG.map((track) => byId.get(track.id) ?? track));
}

/** Rule id and path together, so a case pins what was reported and where, in order. */
function reported(result: GraphBuildResult): readonly string[] {
  return result.diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

/** A solver-bound member of the happy rig, authoring whatever the case is about. */
function member(values: Readonly<Record<string, unknown>>): TrackDefinition {
  return {
    id: "upper-arm",
    keyframes: {
      fk: { values, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  } as TrackDefinition;
}

/**
 * `upper-arm` with its solver bound under `spring` and its weight authored under `fk`.
 *
 * The one weight shape this layer can attribute: the node holds a solve, and the weight sits in a
 * group that cannot reach it. `spring` still binds the slot, so the chain stays intact and the
 * refusal below is the only diagnostic the rig produces.
 */
const WEIGHT_IN_OTHER_GROUP: TrackDefinition = {
  id: "upper-arm",
  keyframes: {
    fk: { values: { length: 80, weight: 0.5 }, requires: { base: "shoulder" } },
    spring: { requires: { solver: "arm-solve" } },
  },
} as TrackDefinition;

const RAMP = [
  { p: 0, v: 0 },
  { p: 1, v: 1 },
];

describe("solved rotation weight (issue #211)", () => {
  it("WT-12 an authored rotation with no weight beside it is still dead", () => {
    // Byte-identically the pre-#211 rule, which is what makes the narrowing zero-migration: with no
    // weight in reach there is no runtime state in which the authored rotation influences output.
    expect(reported(buildGraphIR(rig([member({ length: 80, rotation: 45 })])))).toEqual([
      "ik-solved-rotation-dead at walker/upper-arm",
    ]);

    // A ramped rotation is the same shape and the same refusal.
    expect(reported(buildGraphIR(rig([member({ length: 80, rotation: RAMP })])))).toEqual([
      "ik-solved-rotation-dead at walker/upper-arm",
    ]);

    // And the happy rig, which authors neither key, still loads clean.
    expect(reported(buildGraphIR(project(HAPPY_RIG)))).toEqual([]);
  });

  it("WT-13 an authored rotation with a weight is accepted, whatever the weight is", () => {
    // Presence, never value. A static `1` is accepted rather than caught: "fully solved for now, I
    // will animate the weight next" is authoring intent, and refusing it would force the author to
    // delete a rotation they are about to use. Answering "is every stop 1" here would also make
    // this layer a second owner of leaf shape, which is the break #192 closed once.
    for (const weight of [1, 0, 0.5, RAMP]) {
      const authored = { length: 80, rotation: 45, weight };
      expect(reported(buildGraphIR(rig([member(authored)])))).toEqual([]);
    }
  });

  it("WT-14 a weight on a node that bound no solver anywhere is not this rule's to refuse", () => {
    // The boundary rather than a gap, and the same one `RS-9` drew for the dead rotation. `weight`
    // is claimed by `fkPlugin` and ADR-043 lets any other plugin claim it too, and `resolveSolvers`
    // holds no registry by design: on a node with no solver binding at all it cannot tell a blend
    // weight from another plugin's own live input. `Q-10`'s `reach` plugin claims `weight` and binds
    // no solver slot, so refusing this shape refuses a rig for a plugin this pass knows nothing
    // about, which is exactly the wider read this narrowing exists to stop.
    const unbound: TrackDefinition = {
      id: "hand",
      keyframes: {
        fk: { values: { length: 20, weight: 0.5 }, requires: { base: "forearm" } },
      },
    };
    expect(reported(buildGraphIR(rig([unbound])))).toEqual([]);

    // A bone that binds nothing at all is the same case, so the rule is about the solver binding
    // rather than about being inside a chain.
    const orphan: TrackDefinition = {
      id: "hand",
      keyframes: { fk: { values: { length: 20, weight: 1 } } },
    };
    expect(reported(buildGraphIR(rig([orphan])))).toEqual([]);

    // The cost is stated rather than hidden: an `fk` weight on a bone with no solver is inert, and
    // no load-time rule names it. `WT-10` is what pins the composition that makes it harmless, an
    // unbound slot short-circuiting to the authored rotation without reading the weight at all.

    // And the member that does bind a solver in the group that authored its weight is untouched.
    expect(reported(buildGraphIR(rig([member({ length: 80, weight: 0.5 })])))).toEqual([]);
  });

  it("WT-15 both rules read the group that bound the solver and no other", () => {
    // `spring` binds the solver, so `fk`'s weight blends nothing: refused, because this node does
    // hold a solve and authored the weight where that solve cannot reach it. "Does this node have a
    // solver anywhere" is the guard the rule needs, and it is not the whole rule.
    expect(reported(buildGraphIR(rig([WEIGHT_IN_OTHER_GROUP])))).toEqual([
      "ik-weight-without-solver at walker/upper-arm",
    ]);

    // Accepted, and it takes both rules staying narrow to get there. `spring` bound the solver and
    // authors the weight, so that weight is a live input; `fk` bound none, so its rotation is
    // `fk`'s own live input and no solve replaces it. `RS-9`'s pairing, with a weight added to it.
    const splitAcrossGroups: TrackDefinition = {
      id: "upper-arm",
      keyframes: {
        fk: { values: { length: 80, rotation: 45 }, requires: { base: "shoulder" } },
        spring: { values: { weight: 0.5 }, requires: { solver: "arm-solve" } },
      },
    };
    expect(reported(buildGraphIR(rig([splitAcrossGroups])))).toEqual([]);

    // A flat `weight` names no group, so it is not this layer's to attribute, exactly as a flat
    // `rotation` is not. The registry refuses or claims it instead. See ADR-043.
    const flatWeight: TrackDefinition = {
      id: "upper-arm",
      keyframes: {
        weight: 0.5,
        fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
      },
    };
    expect(reported(buildGraphIR(rig([flatWeight])))).toEqual([]);
  });

  it("WT-16 both builders report the two rules identically", () => {
    // Both finalize through `finalizeGraph`, so a rule that fired in one and not the other would be
    // a rule the runtime and the loader disagree about. The third candidate is the cross-group
    // refusal rather than an unbound weight, because an unbound weight is now clean in both and a
    // parity case that reports nothing anywhere pins nothing.
    for (const candidate of [
      rig([member({ length: 80, rotation: 45 })]),
      rig([member({ length: 80, rotation: 45, weight: RAMP })]),
      rig([WEIGHT_IN_OTHER_GROUP]),
    ]) {
      const reference = buildGraphIR(candidate);
      const incremental = new IncrementalGraphBuilder().build(candidate);
      expect(incremental.diagnostics).toEqual(reference.diagnostics);
    }
  });
});
