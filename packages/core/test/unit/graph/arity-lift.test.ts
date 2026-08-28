import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult, type SolveMember } from "../../../src/graph/ir";

// Slice D3 of issue #195: the arity cap, and the one guarantee it was making silently.
//
// `ik-solver-unsupported-arity` refused every derived member count other than two. That was honest
// while the closed form was the only solve a rig could reach, and it is false once `solveChain`
// dispatches on derived shape, so it is deleted rather than widened. What the cap guaranteed for
// free is that a chain had exactly one leaf, which is the only thing the bare `target` slot can
// address, and that guarantee is now a rule of its own.

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "d3",
    motions: [{ id: "rig", trigger: { type: "time" }, tracks }],
  };
}

/** Rule id and path together, so a case pins what was reported and where, in order. */
function reported(result: GraphBuildResult): readonly string[] {
  return result.diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

function solvesOf(result: GraphBuildResult): readonly SolveMember[] | undefined {
  return result.graph?.nodeById["rig/solve"]?.solves;
}

/** One member per authored id, hanging off the previous one, all bound to `solve`. */
function bones(ids: readonly string[]): readonly TrackDefinition[] {
  return ids.map((id, index) => ({
    id,
    keyframes: {
      fk: {
        values: { length: 40 },
        requires: { base: index === 0 ? "hip" : ids[index - 1]!, solver: "solve" },
      },
    },
  }));
}

/** A linear chain of `ids`, with the goal addressed on its last member. */
function chain(ids: readonly string[]): ProjectDefinition {
  return project([
    { id: "hip" },
    { id: "goal" },
    {
      id: "solve",
      keyframes: { ik: { requires: { root: "hip", targets: { [ids[ids.length - 1]!]: "goal" } } } },
    },
    ...bones(ids),
  ]);
}

/** Two members hanging straight off the root, with the bare slot bound and no leaf to give it to. */
const BRANCHED_BARE_TARGET = project([
  { id: "hip" },
  { id: "goal" },
  { id: "solve", keyframes: { ik: { requires: { root: "hip", target: "goal" } } } },
  {
    id: "left",
    keyframes: { fk: { values: { length: 40 }, requires: { base: "hip", solver: "solve" } } },
  },
  {
    id: "right",
    keyframes: { fk: { values: { length: 40 }, requires: { base: "hip", solver: "solve" } } },
  },
]);

/** The same branching chain with both leaves addressed, which is the spelling that answers. */
const BRANCHED_DICT = project([
  { id: "hip" },
  { id: "goal-l" },
  { id: "goal-r" },
  {
    id: "solve",
    keyframes: { ik: { requires: { root: "hip", targets: { left: "goal-l", right: "goal-r" } } } },
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

describe("the solver arity cap is lifted (Slice D3)", () => {
  it("FB-10 a chain past arity two loads, and so does a chain short of it", () => {
    // Three, five, and one. Every one of these was `ik-solver-unsupported-arity` on the parent, and
    // the one-member case is the shape `solveTwoBone`'s deleted fallback used to answer with zeros.
    const three = buildGraphIR(chain(["a", "b", "c"]));
    expect(reported(three)).toEqual([]);
    expect(solvesOf(three)).toEqual([
      { id: "rig/a", base: "rig/hip" },
      { id: "rig/b", base: "rig/a" },
      { id: "rig/c", base: "rig/b", goal: "rig/goal" },
    ]);

    const five = buildGraphIR(chain(["m1", "m2", "m3", "m4", "m5"]));
    expect(reported(five)).toEqual([]);
    expect(solvesOf(five)?.map((member) => member.id)).toEqual([
      "rig/m1",
      "rig/m2",
      "rig/m3",
      "rig/m4",
      "rig/m5",
    ]);

    const one = buildGraphIR(chain(["only"]));
    expect(reported(one)).toEqual([]);
    expect(solvesOf(one)).toEqual([{ id: "rig/only", base: "rig/hip", goal: "rig/goal" }]);

    // A tree loads too, so the lift is about derived shape rather than about chain length.
    const branched = buildGraphIR(BRANCHED_DICT);
    expect(reported(branched)).toEqual([]);
    expect(solvesOf(branched)?.map((member) => member.goal)).toEqual(["rig/goal-l", "rig/goal-r"]);

    // Both builders answer identically, because both finalize through `finalizeGraph`.
    const incremental = new IncrementalGraphBuilder().build(chain(["a", "b", "c"]));
    expect(incremental.diagnostics).toEqual(three.diagnostics);
    expect(incremental.graph?.nodeById["rig/solve"]?.solves).toEqual(solvesOf(three));
  });

  it("FB-14 the bare target slot over a branching chain is refused by name", () => {
    // The cap made this unreachable, so lifting it is what creates the shape. `target` names no
    // member and a two-leaf chain gives it two candidates, so the rig is refused rather than solved
    // with the goal applied to whichever leaf the derivation happened to order first. The diagnostic
    // names both leaves, which is the choice the author has to make.
    const result = buildGraphIR(BRANCHED_BARE_TARGET);
    expect(reported(result)).toEqual(["ik-target-not-single-leaf at rig/solve"]);
    expect(result.graph).toBeUndefined();

    const refused = result.diagnostics[0]!;
    expect(refused.severity).toBe("error");
    expect(refused.ids).toEqual(["rig/solve", "rig/left", "rig/right"]);

    // The dict is the spelling that answers it, and it is accepted over the same topology.
    expect(reported(buildGraphIR(BRANCHED_DICT))).toEqual([]);

    // A linear chain has one leaf however long it is, so the bare slot keeps working past arity two
    // and no existing rig is re-authored to buy the rule.
    const linear = project([
      { id: "hip" },
      { id: "goal" },
      { id: "solve", keyframes: { ik: { requires: { root: "hip", target: "goal" } } } },
      ...bones(["a", "b", "c"]),
    ]);
    expect(reported(buildGraphIR(linear))).toEqual([]);
    expect(solvesOf(buildGraphIR(linear))?.map((member) => member.goal)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
  });
});
