import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";

// Issue #211: what a solver-bound member may author once `weight` exists.
//
// Two rules, one group walker. `ik-solved-rotation-dead` narrows from "authored `rotation` at all"
// to "authored `rotation` with no `weight` beside it", and `ik-weight-without-solver` is its mirror.
// Both are presence-only and both are scoped to the plugin group that bound the `solver` slot, which
// is what `RS-9` already pins for the first of them. See ADR-055.

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

  it("WT-14 an authored weight with no solver bound is refused", () => {
    // The symmetric footgun. `fk` short-circuits to the authored rotation when no solve names this
    // node, so the weight is read by nothing: a key accepted and then ignored.
    const unbound: TrackDefinition = {
      id: "hand",
      keyframes: {
        fk: { values: { length: 20, weight: 0.5 }, requires: { base: "forearm" } },
      },
    };
    expect(reported(buildGraphIR(rig([unbound])))).toEqual([
      "ik-weight-without-solver at walker/hand",
    ]);

    // A bone that binds nothing at all is the same case, so the rule is about the binding rather
    // than about being inside a chain.
    const orphan: TrackDefinition = {
      id: "hand",
      keyframes: { fk: { values: { length: 20, weight: 1 } } },
    };
    expect(reported(buildGraphIR(rig([orphan])))).toEqual([
      "ik-weight-without-solver at walker/hand",
    ]);

    // And the member that does bind one is untouched by it.
    expect(reported(buildGraphIR(rig([member({ length: 80, weight: 0.5 })])))).toEqual([]);
  });

  it("WT-15 both rules read the group that bound the solver and no other", () => {
    // `spring` binds the solver, so `fk`'s weight blends nothing: refused, even though this node
    // does hold a solver binding. "Does this node have a solver anywhere" would pass this shape.
    const weightInOtherGroup: TrackDefinition = {
      id: "upper-arm",
      keyframes: {
        fk: { values: { length: 80, weight: 0.5 }, requires: { base: "shoulder" } },
        spring: { requires: { solver: "arm-solve" } },
      },
    };
    expect(reported(buildGraphIR(rig([weightInOtherGroup])))).toEqual([
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
    // a rule the runtime and the loader disagree about.
    for (const candidate of [
      rig([member({ length: 80, rotation: 45 })]),
      rig([member({ length: 80, rotation: 45, weight: RAMP })]),
      rig([
        {
          id: "hand",
          keyframes: { fk: { values: { length: 20, weight: 1 } } },
        } as TrackDefinition,
      ]),
    ]) {
      const reference = buildGraphIR(candidate);
      const incremental = new IncrementalGraphBuilder().build(candidate);
      expect(incremental.diagnostics).toEqual(reference.diagnostics);
    }
  });
});
