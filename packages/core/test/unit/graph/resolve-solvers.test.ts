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

const OTHER_ROOT: TrackDefinition = { id: "other-root" };

/** The happy rig with the named tracks replaced, plus any extra track a case needs to exist. */
function rig(
  replacements: readonly TrackDefinition[],
  extra: readonly TrackDefinition[] = [],
): ProjectDefinition {
  const byId = new Map(replacements.map((track) => [track.id, track] as const));
  return project([...HAPPY_RIG.map((track) => byId.get(track.id) ?? track), ...extra]);
}

/** Rule id and path together, so a case pins what was reported and where, in order. */
function reported(result: GraphBuildResult): readonly string[] {
  return result.diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

function solvesOf(result: GraphBuildResult): readonly SolveMember[] | undefined {
  return result.graph?.nodeById["walker/arm-solve"]?.solves;
}

/** The tip is authored before the member it hangs from, so depth has to decide the order. */
const TIP_FIRST = project([
  HAPPY_RIG[0]!, // shoulder
  HAPPY_RIG[1]!, // hand-target
  HAPPY_RIG[4]!, // forearm
  HAPPY_RIG[3]!, // upper-arm
  HAPPY_RIG[2]!, // arm-solve
  HAPPY_RIG[5]!, // hand
]);

/** `upper-arm` binds no `base` at all, so its own walk cannot take a first step. */
const NO_BASE = rig([
  {
    id: "upper-arm",
    keyframes: { fk: { values: { length: 80 }, requires: { solver: "arm-solve" } } },
  },
]);

/** `upper-arm` hangs from a node that is neither the solver's root nor one of its members. */
const BASE_OUTSIDE = rig(
  [
    {
      id: "upper-arm",
      keyframes: {
        fk: { values: { length: 80 }, requires: { base: "other-root", solver: "arm-solve" } },
      },
    },
  ],
  [OTHER_ROOT],
);

/** Both members leave the member set, so both are answerable for their own broken chain. */
const BOTH_OUTSIDE = rig(
  [
    {
      id: "upper-arm",
      keyframes: {
        fk: { values: { length: 80 }, requires: { base: "other-root", solver: "arm-solve" } },
      },
    },
    {
      id: "forearm",
      keyframes: {
        fk: { values: { length: 60 }, requires: { base: "other-root", solver: "arm-solve" } },
      },
    },
  ],
  [OTHER_ROOT],
);

/** The bone that binds `solver` authors the `rotation` the solve would replace. */
const ROTATION_IN_BINDER = rig([
  {
    id: "upper-arm",
    keyframes: {
      fk: {
        values: { length: 80, rotation: 45 },
        requires: { base: "shoulder", solver: "arm-solve" },
      },
    },
  },
]);

/** `spring` binds the solver, so `fk`'s authored rotation is `fk`'s own live input. */
const ROTATION_IN_OTHER_GROUP = rig([
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80, rotation: 45 }, requires: { base: "shoulder" } },
      spring: { requires: { solver: "arm-solve" } },
    },
  },
]);

/** A flat `rotation`, which names no group and therefore no owner this layer can read. */
const FLAT_ROTATION = rig([
  {
    id: "upper-arm",
    keyframes: {
      rotation: 45,
      fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
]);

/** A member hanging from a source that resolves to no node at all. */
const UNKNOWN_BASE = rig([
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80 }, requires: { base: "nope", solver: "arm-solve" } },
    },
  },
]);

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

  it("RS-2 reports the four IK diagnostics it owns with ruleId, path, and participant ids", () => {
    // The fifth, `ik-solver-no-root`, is `RS-7`'s. This case owns the other four. It owned a fifth
    // of its own, `ik-solver-unsupported-arity`, until slice D3 lifted the cap: a rule that refuses
    // a shape the dispatcher solves is worse than no rule, so it is deleted rather than asserted.
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

    // Replace forearm with a version that drops the solver binding, so one member is left. That was
    // `ik-solver-unsupported-arity` while the cap existed, and this case asserted the rule as its
    // observable effect, which made a cache test depend on a rule with nothing to do with caching.
    // A one-member chain is an ordinary solve now, so the rebuild is observed through the derivation
    // itself: the stale cache this case exists to refuse would have returned the two-member answer.
    const modifiedTracks = HAPPY_RIG.map((t) =>
      t.id === "forearm"
        ? {
            id: "forearm",
            keyframes: { fk: { values: { length: 60 }, requires: { base: "upper-arm" } } },
          }
        : t,
    );
    const res2 = builder.build(project(modifiedTracks));
    expect(res2.diagnostics).toEqual([]);
    const solver2 = res2.graph?.nodeById["walker/arm-solve"] as GraphNode;
    expect(solver2?.solves).toEqual([{ id: "walker/upper-arm", base: "walker/shoulder" }]);
  });

  it("RS-6 both buildGraphIR and IncrementalGraphBuilder produce identical solves across corpus", () => {
    const [reference, incremental] = buildPair(project(HAPPY_RIG));
    expect(reference.diagnostics).toEqual(incremental.diagnostics);
    const refSolver = reference.graph?.nodeById["walker/arm-solve"] as GraphNode;
    const incSolver = incremental.graph?.nodeById["walker/arm-solve"] as GraphNode;
    expect(refSolver?.solves).toEqual(incSolver?.solves);
    expect(refSolver?.solves).toBeDefined();
  });

  it("RS-8 one confined walk answers for every chain shape the two passes answered for", () => {
    // The `base` lookup that verified a member and the `while` loop that measured its depth were
    // two traversals of one chain, and they are one walk now. A refactor's subject is the answer
    // rather than the shape, so this pins the derived chain and the diagnostic each broken chain
    // reports, over the shapes where attribution or depth could differ between the two.
    const clean = buildGraphIR(project(HAPPY_RIG));
    expect(reported(clean)).toEqual([]);
    expect(solvesOf(clean)).toEqual(EXPECTED_SOLVES);

    // Depth decides the order rather than authored position, with the tip authored first.
    const tipFirst = buildGraphIR(TIP_FIRST);
    expect(reported(tipFirst)).toEqual([]);
    expect(solvesOf(tipFirst)).toEqual(EXPECTED_SOLVES);

    // A member holding no `base` edge stops its own walk on the first step. Its descendant reports
    // nothing of its own, because the break belongs to the member whose chain broke.
    expect(reported(buildGraphIR(NO_BASE))).toEqual([
      "ik-solver-unreachable-root at walker/upper-arm",
    ]);

    // A member whose `base` leaves the member set without arriving at the root reports once, on
    // the member that left it, not once per descendant that inherited the broken chain.
    expect(reported(buildGraphIR(BASE_OUTSIDE))).toEqual([
      "ik-solver-unreachable-root at walker/upper-arm",
    ]);

    // Both members leave it, so both are answerable and both report.
    expect(reported(buildGraphIR(BOTH_OUTSIDE))).toEqual([
      "ik-solver-unreachable-root at walker/forearm",
      "ik-solver-unreachable-root at walker/upper-arm",
    ]);
  });

  it("RS-9 ik-solved-rotation-dead reads the group that binds solver and no other", () => {
    // Refused: the group binding `solver` is the group whose `rotation` the solved one replaces.
    expect(reported(buildGraphIR(ROTATION_IN_BINDER))).toEqual([
      "ik-solved-rotation-dead at walker/upper-arm",
    ]);

    // Accepted: `spring` binds the solver here, so `fk.values.rotation` is `fk`'s own live input
    // and no solved rotation replaces it. Reading every group reported this identically to the
    // case above, which is what made the wider read invisible on every current fixture.
    expect(reported(buildGraphIR(ROTATION_IN_OTHER_GROUP))).toEqual([]);

    // Accepted here and refused by the registry instead: a flat key names no group, and which
    // plugin owns one is the question this layer holds no registry to answer. See ADR-043.
    expect(reported(buildGraphIR(FLAT_ROTATION))).toEqual([]);
  });

  it("RS-10 a reference error is reported without a derived chain diagnostic beside it", () => {
    // `resolveSolvers` walks `base` edges and reads the nodes they name, so over a graph whose
    // sources do not resolve it answers about a chain that was never valid, naming a member for a
    // typo one node up. `finalizeGraph` bails on reference errors before the derivation runs.
    const unknownBase = buildGraphIR(UNKNOWN_BASE);
    expect(reported(unknownBase)).toEqual(["observation-unknown-source at walker/upper-arm"]);
    expect(unknownBase.graph).toBeUndefined();

    // Both builders bail at the same point, because both finalize through `finalizeGraph`.
    const [reference, incremental] = buildPair(UNKNOWN_BASE);
    expect(incremental.diagnostics).toEqual(reference.diagnostics);

    // The derivation still runs for a rig whose references all resolve, so this is an ordering
    // change rather than a pass that stopped reporting.
    expect(reported(buildGraphIR(BASE_OUTSIDE))).toEqual([
      "ik-solver-unreachable-root at walker/upper-arm",
    ]);
  });
});
