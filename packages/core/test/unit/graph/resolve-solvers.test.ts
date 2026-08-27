import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import {
  buildGraphIR,
  resolveSolvers,
  type GraphBuildResult,
  type GraphNode,
  type SolveMember,
} from "../../../src/graph/ir";
import { ObservationState } from "../../../src/graph/observation-state";

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

/** The one answer for the happy rig, stated once so no case can pin a different one. */
const EXPECTED_SOLVES: readonly SolveMember[] = [
  { id: "walker/upper-arm", base: "walker/shoulder" },
  { id: "walker/forearm", base: "walker/upper-arm" },
];

/** MINSTD. Twenty seeds give twenty different permutations, and the run is still fixed. */
function nextState(state: number): number {
  return (state * 16807) % 2147483647;
}

function shuffle(tracks: readonly TrackDefinition[], seed: number): TrackDefinition[] {
  const result = [...tracks];
  let state = nextState(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = nextState(state);
    const swap = state % (index + 1);
    const held = result[index]!;
    result[index] = result[swap]!;
    result[swap] = held;
  }
  return result;
}

describe("resolveSolvers (Slice C2)", () => {
  it("RS-1 derives solves on solver node root-most first and nowhere else", () => {
    const p = project(HAPPY_RIG);
    const result = buildGraphIR(p);
    expect(result.diagnostics).toEqual([]);
    expect(result.graph).toBeDefined();

    const graph = result.graph!;
    const solverNode = graph.nodeById["walker/arm-solve"] as GraphNode;
    expect(solverNode).toBeDefined();
    expect(solverNode.solves).toEqual(EXPECTED_SOLVES);

    const upperArm = graph.nodeById["walker/upper-arm"] as GraphNode;
    const forearm = graph.nodeById["walker/forearm"] as GraphNode;
    const hand = graph.nodeById["walker/hand"] as GraphNode;
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

  it("RS-7 a node bound as a solver with no root requirement is refused", () => {
    // Two members bind `arm-solve`, and `arm-solve` binds no `root`. A solver is classified by its
    // root edge, so the derivation used to skip this node entirely: no `solves`, no `rotations`,
    // both bones falling back to their own authored rotation, and a rig holding a broken pose with
    // no error and no diagnostic. It is also the one shape `GraphPublisher` cannot scope members
    // for, so refusing it at load time is what keeps that throw unreachable. See ADR-051.
    const noRootRig = project([
      { id: "shoulder" },
      { id: "arm-solve" },
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

    const result = buildGraphIR(noRootRig);
    const noRoot = result.diagnostics.find((d) => d.ruleId === "ik-solver-no-root");
    expect(noRoot).toBeDefined();
    expect(noRoot?.path).toBe("walker/arm-solve");
    expect(noRoot?.severity).toBe("error");
    expect(noRoot?.ids).toEqual(["walker/arm-solve"]);
    // The error stops the build, so no member reaches a graph that cannot solve it.
    expect(result.graph).toBeUndefined();

    // Both builders answer identically, because both finalize through `finalizeGraph`.
    const [reference, incremental] = buildPair(noRootRig);
    expect(incremental.diagnostics).toEqual(reference.diagnostics);

    // A solver that does bind a root is untouched by the rule.
    expect(buildGraphIR(project(HAPPY_RIG)).diagnostics).toEqual([]);
  });

  it("RS-3 solves derivation is deterministic under real track permutation", () => {
    const reference = buildGraphIR(project(HAPPY_RIG));
    expect(reference.diagnostics).toEqual([]);
    const expectedSolves = (reference.graph?.nodeById["walker/arm-solve"] as GraphNode)?.solves;
    const expectedOrder = reference.graph?.order;
    expect(expectedSolves).toEqual(EXPECTED_SOLVES);

    const permutations = new Set<string>();
    for (let seed = 1; seed <= 20; seed += 1) {
      const tracks = shuffle(HAPPY_RIG, seed);
      permutations.add(tracks.map((track) => track.id).join(","));
      const permuted = buildGraphIR(project(tracks));
      expect(permuted.diagnostics).toEqual([]);
      expect(permuted.graph?.order).toEqual(expectedOrder);
      const solver = permuted.graph?.nodeById["walker/arm-solve"] as GraphNode;
      expect(solver?.solves).toEqual(expectedSolves);
    }

    // Twenty iterations have to be twenty different rigs. The shuffle this case shipped with
    // computed `(seed * (i + 1) * 31) % (i + 1)`, which is zero for every seed and every index, so
    // it performed one fixed rotation twenty times over: a determinism assertion whose inputs were
    // all one input. Asserting the input set is what makes the loop mean anything at all.
    expect(permutations.size).toBe(20);
    expect(permutations.has(HAPPY_RIG.map((track) => track.id).join(","))).toBe(false);
  });

  it("RS-4 solves reconstructed from live state alone match the built graph", () => {
    const built = buildGraphIR(project(HAPPY_RIG));
    expect(built.diagnostics).toEqual([]);
    const graph = built.graph!;

    // Live state holds nodes and edges and nothing else: no authored index, and no derived
    // `solves`. Round-tripping through it is therefore a real question about the derivation, where
    // this case used to build the same project twice and compare it with itself. That would have
    // passed against a derivation that read authored order, ignored `base`, or returned a cache.
    const live = new ObservationState();
    for (const node of graph.nodes) {
      live.addNode(node.id);
    }
    for (const node of graph.nodes) {
      for (const edge of node.edges) {
        live.addEdge(edge);
      }
    }
    const snapshot = live.snapshot();

    // Every reconstructed node carries the same authored index, on purpose. `resolveSolvers` breaks
    // depth ties by authored index, so inheriting the real one would let authored order answer for
    // a rig whose two members sit at different depths, which is what has to decide.
    const reconstructed: GraphNode[] = snapshot.nodes.map((id) => {
      const edges = snapshot.edges.filter((edge) => edge.observerId === id);
      return Object.freeze({
        id,
        owner: "motion" as const,
        authoredIndex: 0,
        track: graph.nodeById[id]!.track,
        edges: Object.freeze(edges),
      });
    });

    const diagnostics: Diagnostic[] = [];
    const resolved = resolveSolvers(reconstructed, diagnostics);
    expect(diagnostics).toEqual([]);

    const fromLive = resolved.find((node) => node.id === "walker/arm-solve");
    expect(fromLive?.solves).toEqual(EXPECTED_SOLVES);
    expect(fromLive?.solves).toEqual((graph.nodeById["walker/arm-solve"] as GraphNode).solves);

    // And nothing else gained a derivation, so the match is not a copy of the whole graph.
    const derived = resolved.filter((node) => node.solves !== undefined).map((node) => node.id);
    expect(derived).toEqual(["walker/arm-solve"]);
  });

  it("RS-5 rebuild after removing a solver binding updates solves without stale cache mutation", () => {
    const builder = new IncrementalGraphBuilder();
    const p1 = project(HAPPY_RIG);
    const res1 = builder.build(p1);
    expect(res1.diagnostics).toEqual([]);
    const solver1 = res1.graph?.nodeById["walker/arm-solve"] as GraphNode;
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
    const refSolver = reference.graph?.nodeById["walker/arm-solve"] as GraphNode;
    const incSolver = incremental.graph?.nodeById["walker/arm-solve"] as GraphNode;
    expect(refSolver?.solves).toEqual(incSolver?.solves);
    expect(refSolver?.solves).toBeDefined();
  });
});
