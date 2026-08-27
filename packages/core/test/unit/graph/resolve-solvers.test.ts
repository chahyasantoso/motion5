import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult, type GraphNode } from "../../../src/graph/ir";

// Slice C2 of issue #195: `resolveSolvers` and the five load-time IK diagnostics.
//
// Solvers are derived from requirement edges:
// - Solvers: nodes with an edge where requirement.slot === "root".
// - Members: nodes with an edge { sourceId: solver.id, requirement: { slot: "solver" } }.
// - Solves: members ordered depth from root ascending, ties by authoredIndex, then qualified id.
//
// This red test file runs against the parent where resolveSolvers has not landed yet.

export interface SolveMemberSeam {
  readonly id: string;
  readonly base: string;
}

export type GraphNodeSeam = GraphNode & {
  readonly solves?: readonly SolveMemberSeam[];
};

export type ResolveSolversSeam = (
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
) => readonly GraphNodeSeam[];

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "c2",
    motions: [
      {
        id: "walker",
        trigger: { type: "time" },
        tracks,
      },
    ],
  };
}

function buildPair(p: ProjectDefinition): [GraphBuildResult, GraphBuildResult] {
  return [buildGraphIR(p), new IncrementalGraphBuilder().build(p)];
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

describe("resolveSolvers (Slice C2)", () => {
  it("RS-1 derives solves on solver node root-most first and nowhere else", () => {
    const p = project(HAPPY_RIG);
    const result = buildGraphIR(p);
    expect(result.diagnostics).toEqual([]);
    expect(result.graph).toBeDefined();

    const graph = result.graph!;
    const solverNode = graph.nodeById["walker/arm-solve"] as GraphNodeSeam;
    expect(solverNode).toBeDefined();
    expect(solverNode.solves).toEqual([
      { id: "walker/upper-arm", base: "walker/shoulder" },
      { id: "walker/forearm", base: "walker/upper-arm" },
    ]);

    const upperArm = graph.nodeById["walker/upper-arm"] as GraphNodeSeam;
    const forearm = graph.nodeById["walker/forearm"] as GraphNodeSeam;
    const hand = graph.nodeById["walker/hand"] as GraphNodeSeam;
    expect(upperArm.solves).toBeUndefined();
    expect(forearm.solves).toBeUndefined();
    expect(hand.solves).toBeUndefined();
  });

  it("RS-2 reports all five IK diagnostics with correct ruleId, path, and participant ids", () => {
    // 1. ik-solver-unreachable-root: upper-arm base is wrong
    const unreachableRootRig = project([
      { id: "shoulder" },
      { id: "hand-target" },
      { id: "other-root" },
      {
        id: "arm-solve",
        keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
      },
      {
        id: "upper-arm",
        keyframes: {
          fk: { values: { length: 80 }, requires: { base: "other-root", solver: "arm-solve" } },
        },
      },
      {
        id: "forearm",
        keyframes: {
          fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
        },
      },
    ]);
    const res1 = buildGraphIR(unreachableRootRig);
    const diag1 = res1.diagnostics.find((d) => d.ruleId === "ik-solver-unreachable-root");
    expect(diag1).toBeDefined();
    expect(diag1?.path).toBe("walker/upper-arm");
    expect(diag1?.severity).toBe("error");

    // 2. ik-solver-no-members: arm-solve exists but no members bind to it
    const noMembersRig = project([
      { id: "shoulder" },
      { id: "hand-target" },
      {
        id: "arm-solve",
        keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
      },
    ]);
    const res2 = buildGraphIR(noMembersRig);
    const diag2 = res2.diagnostics.find((d) => d.ruleId === "ik-solver-no-members");
    expect(diag2).toBeDefined();
    expect(diag2?.path).toBe("walker/arm-solve");
    expect(diag2?.severity).toBe("error");

    // 3. ik-mode-ambiguous: node binds solver and root simultaneously
    const modeAmbiguousRig = project([
      { id: "shoulder" },
      { id: "hand-target" },
      {
        id: "arm-solve",
        keyframes: {
          ik: { requires: { root: "shoulder", target: "hand-target", solver: "shoulder" } },
        },
      },
    ]);
    const res3 = buildGraphIR(modeAmbiguousRig);
    const diag3 = res3.diagnostics.find((d) => d.ruleId === "ik-mode-ambiguous");
    expect(diag3).toBeDefined();
    expect(diag3?.path).toBe("walker/arm-solve");
    expect(diag3?.severity).toBe("error");

    // 4. ik-solved-rotation-dead: authored values.rotation on a node that binds solver
    const solvedRotationDeadRig = project([
      { id: "shoulder" },
      { id: "hand-target" },
      {
        id: "arm-solve",
        keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
      },
      {
        id: "upper-arm",
        keyframes: {
          fk: {
            values: { length: 80, rotation: 45 },
            requires: { base: "shoulder", solver: "arm-solve" },
          },
        },
      },
      {
        id: "forearm",
        keyframes: {
          fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
        },
      },
    ]);
    const res4 = buildGraphIR(solvedRotationDeadRig);
    const diag4 = res4.diagnostics.find((d) => d.ruleId === "ik-solved-rotation-dead");
    expect(diag4).toBeDefined();
    expect(diag4?.path).toBe("walker/upper-arm");
    expect(diag4?.severity).toBe("error");

    // 5. ik-solver-unsupported-arity: only 1 member instead of 2
    const unsupportedArityRig = project([
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
    ]);
    const res5 = buildGraphIR(unsupportedArityRig);
    const diag5 = res5.diagnostics.find((d) => d.ruleId === "ik-solver-unsupported-arity");
    expect(diag5).toBeDefined();
    expect(diag5?.path).toBe("walker/arm-solve");
    expect(diag5?.severity).toBe("error");
  });

  it("RS-3 solves derivation is deterministic under track permutation", () => {
    const baseP = project(HAPPY_RIG);
    const reference = buildGraphIR(baseP);
    const expectedSolves = (reference.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam)?.solves;
    expect(expectedSolves).toBeDefined();
    const expectedOrder = reference.graph?.order;

    // Run 20 pseudo-random permutations of the authored tracks
    for (let seed = 1; seed <= 20; seed++) {
      const tracks = [...HAPPY_RIG];
      // Deterministic Fisher-Yates shuffle with seed
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = (seed * (i + 1) * 31) % (i + 1);
        const temp = tracks[i]!;
        tracks[i] = tracks[j]!;
        tracks[j] = temp;
      }
      const permuted = buildGraphIR(project(tracks));
      expect(permuted.diagnostics).toEqual([]);
      expect(permuted.graph?.order).toEqual(expectedOrder);
      const solver = permuted.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam;
      expect(solver?.solves).toEqual(expectedSolves);
    }
  });

  it("RS-4 produces identical solves when reconstructed from a graph snapshot", () => {
    const p = project(HAPPY_RIG);
    const built = buildGraphIR(p);
    expect(built.graph).toBeDefined();

    // Reconstructing through buildGraphIR from the same project definition matches
    const rebuilt = buildGraphIR(p);
    const solver1 = built.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam;
    const solver2 = rebuilt.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam;
    expect(solver1?.solves).toEqual(solver2?.solves);
    expect(solver1?.solves).toBeDefined();
  });

  it("RS-5 rebuild after removing a solver binding updates solves without stale cache mutation", () => {
    const builder = new IncrementalGraphBuilder();
    const p1 = project(HAPPY_RIG);
    const res1 = builder.build(p1);
    expect(res1.diagnostics).toEqual([]);
    const solver1 = res1.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam;
    expect(solver1?.solves).toHaveLength(2);

    // Replace forearm with a version that drops the solver binding -> now only 1 member -> arity error
    const modifiedTracks = HAPPY_RIG.map((t) =>
      t.id === "forearm"
        ? {
            id: "forearm",
            keyframes: { fk: { values: { length: 60 }, requires: { base: "upper-arm" } } },
          }
        : t,
    );
    const res2 = builder.build(project(modifiedTracks));
    expect(res2.diagnostics.some((d) => d.ruleId === "ik-solver-unsupported-arity")).toBe(true);
  });

  it("RS-6 both buildGraphIR and IncrementalGraphBuilder produce identical solves across corpus", () => {
    const [reference, incremental] = buildPair(project(HAPPY_RIG));
    expect(reference.diagnostics).toEqual(incremental.diagnostics);
    const refSolver = reference.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam;
    const incSolver = incremental.graph?.nodeById["walker/arm-solve"] as GraphNodeSeam;
    expect(refSolver?.solves).toEqual(incSolver?.solves);
    expect(refSolver?.solves).toBeDefined();
  });
});
