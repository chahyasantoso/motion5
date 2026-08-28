import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type {
  AuthoredPluginRequires,
  Diagnostic,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import {
  buildGraphIR,
  resolveSolvers,
  type GraphBuildResult,
  type GraphNode,
  type SolveMember,
} from "../../../src/graph/ir";
import { ObservationState } from "../../../src/graph/observation-state";

// Slice D1 of issue #195: the authored goal dict reaching the solve.
//
// D0 made `targets` authorable and derived one binding, and therefore one edge, per member. This is
// where those edges become a chain leaf's goal. Every rule here lives in `resolveSolvers` because it
// is the only owner that can answer any of them: the authored key is a member id, so whether it names
// a member and whether that member is a leaf are both questions about `solver` edges. `contract/`
// holds no registry and a plugin holds no graph, which is the split ADR-044 already draws for keys.
//
// Arity is still two, so a goal-addressed chain has exactly one leaf and exactly one goal. The
// branched fixture below is the one exception, and it exists only because a two-leaf shape is the
// only way to ask `ik-leaf-without-goal` on its own.

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "d1",
    motions: [{ id: "walker", trigger: { type: "time" }, tracks }],
  };
}

/** Rule id and path together, so a case pins what was reported and where, in order. */
function reported(result: GraphBuildResult): readonly string[] {
  return result.diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

function solvesOf(result: GraphBuildResult): readonly SolveMember[] | undefined {
  return result.graph?.nodeById["walker/arm-solve"]?.solves;
}

/**
 * The worked rig, with only the solver's bindings varying.
 *
 * Typed as `AuthoredPluginRequires` rather than as a loose record, so every fixture below is checked
 * against the authored contract D0 widened. A dict at a slot that may not carry one would be a type
 * error here, which is the fixture doing the job a fixture for an authored shape exists to do.
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
    { id: "hand", keyframes: { fk: { values: { length: 20 }, requires: { base: "forearm" } } } },
  ]);
}

const GOAL_DICT = rig({ root: "shoulder", targets: { forearm: "hand-target" } });
const BARE_TARGET = rig({ root: "shoulder", target: "hand-target" });
const QUALIFIED_KEY = rig({ root: "shoulder", targets: { "walker/forearm": "hand-target" } });
const UNKNOWN_MEMBER = rig({ root: "shoulder", targets: { elbow: "hand-target" } });
const NOT_LEAF = rig({ root: "shoulder", targets: { "upper-arm": "hand-target" } });
const DUPLICATE = rig({
  root: "shoulder",
  targets: { forearm: "hand-target", "walker/forearm": "hand-target" },
});
const CONFLICT = rig({
  root: "shoulder",
  target: "hand-target",
  targets: { forearm: "hand-target" },
});

/**
 * A member binding `solver` beside a goal dict of its own.
 *
 * The read that made this legal was the literal `"target"`: one real input edge per goal, every one
 * of them ignored, which is a field accepted and then ignored.
 */
const MEMBER_WITH_GOALS = project([
  { id: "shoulder" },
  { id: "hand-target" },
  { id: "arm-solve", keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } } },
  {
    id: "upper-arm",
    keyframes: {
      fk: {
        values: { length: 80 },
        requires: {
          base: "shoulder",
          solver: "arm-solve",
          targets: { forearm: "hand-target" },
        },
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

/**
 * Two members hanging straight off the root, so the chain has two leaves and one of them is named.
 *
 * The only shape that asks `ik-leaf-without-goal` alone: on a linear chain every unnamed leaf sits
 * beside a named non-leaf, so the two rules always report together.
 */
const TWO_LEAVES = project([
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: { ik: { requires: { root: "shoulder", targets: { "upper-arm": "hand-target" } } } },
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
      fk: { values: { length: 60 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
]);

/** The one answer for the goal-addressed rig, stated once so no case can pin a different one. */
const EXPECTED_SOLVES: readonly SolveMember[] = [
  { id: "walker/upper-arm", base: "walker/shoulder" },
  { id: "walker/forearm", base: "walker/upper-arm", goal: "walker/hand-target" },
];

/** MINSTD, as `RS-3` uses it: twenty seeds, twenty different permutations, one fixed run. */
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

describe("goal-addressed solving (Slice D1)", () => {
  it("MG-1 an authored goal dict derives the same chain plus the leaf's goal", () => {
    const built = buildGraphIR(GOAL_DICT);
    expect(reported(built)).toEqual([]);
    expect(solvesOf(built)).toEqual(EXPECTED_SOLVES);

    // The goal is a qualified node id rather than the authored key, because the publisher reads it
    // straight off the registry and holds no owner to qualify against.
    const solver = built.graph?.nodeById["walker/arm-solve"];
    const goal = solver?.edges.find((edge) => edge.requirement?.slot === "targets[forearm]");
    expect(goal?.sourceId).toBe("walker/hand-target");

    // Both builders answer identically, because both finalize through `finalizeGraph`.
    const incremental = new IncrementalGraphBuilder().build(GOAL_DICT);
    expect(incremental.diagnostics).toEqual(built.diagnostics);
    expect(incremental.graph?.nodeById["walker/arm-solve"]?.solves).toEqual(EXPECTED_SOLVES);
  });

  it("MG-2 the bare target slot still derives a chain and carries no goal", () => {
    // Kept on purpose. `target` is exactly the degenerate case of the dict, so retiring it would
    // re-author every existing rig to buy one spelling. No member of this chain gains a `goal`, so
    // `ikPlugin` reads `inputs.target` exactly as it did before D1.
    const built = buildGraphIR(BARE_TARGET);
    expect(reported(built)).toEqual([]);
    expect(solvesOf(built)).toEqual([
      { id: "walker/upper-arm", base: "walker/shoulder" },
      { id: "walker/forearm", base: "walker/upper-arm" },
    ]);
  });

  it("MG-3 a qualified and a bare goal key name the same member", () => {
    // The key goes through `qualifySource`, so it is an id in the authored sense rather than a
    // string compared against a node id. That is also what makes `ik-goal-duplicate` a real rule.
    const built = buildGraphIR(QUALIFIED_KEY);
    expect(reported(built)).toEqual([]);
    expect(solvesOf(built)).toEqual(EXPECTED_SOLVES);
  });

  it("MG-4 a goal naming no member of the chain is refused", () => {
    // And the leaf is still unaddressed, so both rules report: the author named something, and it
    // was not the leaf. One diagnostic would leave the second fact for them to infer.
    expect(reported(buildGraphIR(UNKNOWN_MEMBER))).toEqual([
      "ik-goal-unknown-member at walker/arm-solve",
      "ik-leaf-without-goal at walker/arm-solve",
    ]);
    expect(buildGraphIR(UNKNOWN_MEMBER).graph).toBeUndefined();
  });

  it("MG-5 a goal on a member another member hangs from is refused", () => {
    // A goal is what a chain reaches toward, so it belongs to the tip. `upper-arm` is inside the
    // chain, and a solve that pulled it to the goal would leave `forearm` with nothing to do.
    expect(reported(buildGraphIR(NOT_LEAF))).toEqual([
      "ik-goal-not-leaf at walker/arm-solve",
      "ik-leaf-without-goal at walker/arm-solve",
    ]);
  });

  it("MG-6 a leaf the dict never named is refused, on its own", () => {
    // Two leaves off one root, one of them named. The unnamed one has nothing to reach for, and
    // silently solving it toward the other's goal is the failure this rule exists for.
    expect(reported(buildGraphIR(TWO_LEAVES))).toEqual([
      "ik-leaf-without-goal at walker/arm-solve",
    ]);
  });

  it("MG-7 two spellings of one member id are one goal too many", () => {
    // Object keys are unique, so two goals for one member are unrepresentable in the authored dict.
    // What survives is the pair qualification collapses: `forearm` and `walker/forearm` are two keys
    // and one node, which is why the rule is a post-qualification check rather than a shape rule.
    expect(reported(buildGraphIR(DUPLICATE))).toEqual(["ik-goal-duplicate at walker/arm-solve"]);
  });

  it("MG-8 a solver binding both target and the dict is refused", () => {
    // Two names for one dependency. Refused rather than merged, because merging would make which
    // goal the leaf reaches for a property of the reader.
    expect(reported(buildGraphIR(CONFLICT))).toEqual(["ik-goal-conflict at walker/arm-solve"]);
  });

  it("MG-9 ik-mode-ambiguous reads the goal grammar, not the literal slot name", () => {
    // Reported against the member, which is the node that authored the contradiction. Before D1 this
    // rig loaded clean and the member's goals were ignored with no diagnostic behind them.
    expect(reported(buildGraphIR(MEMBER_WITH_GOALS))).toEqual([
      "ik-mode-ambiguous at walker/upper-arm",
    ]);
  });

  it("MG-10 goal derivation is deterministic under real track permutation", () => {
    const tracks = GOAL_DICT.motions[0]!.tracks;
    const reference = buildGraphIR(GOAL_DICT);
    expect(reported(reference)).toEqual([]);
    const expectedOrder = reference.graph?.order;

    const permutations = new Set<string>();
    for (let seed = 1; seed <= 20; seed += 1) {
      const permutedTracks = shuffle(tracks, seed);
      permutations.add(permutedTracks.map((track) => track.id).join(","));
      const permuted = buildGraphIR(project(permutedTracks));
      expect(reported(permuted)).toEqual([]);
      expect(permuted.graph?.order).toEqual(expectedOrder);
      expect(solvesOf(permuted)).toEqual(EXPECTED_SOLVES);
    }

    // Twenty iterations have to be twenty different rigs, per the finding `RS-3` records.
    expect(permutations.size).toBe(20);
    expect(permutations.has(tracks.map((track) => track.id).join(","))).toBe(false);
  });

  it("MG-11 solves including goal is a pure function of nodes and edges", () => {
    // Live state holds nodes and edges and nothing else, so reconstructing from it is the question
    // ADR-051 banked as zero change: no `JournalEntry` variant is added for a goal, because a goal is
    // derived from the edges the journal already carries. Reconstructed nodes take a constant
    // authored index, so authored order cannot answer for anything here.
    const built = buildGraphIR(GOAL_DICT);
    expect(reported(built)).toEqual([]);
    const graph = built.graph!;

    const live = new ObservationState();
    for (const node of graph.nodes) live.addNode(node.id);
    for (const node of graph.nodes) for (const edge of node.edges) live.addEdge(edge);
    const snapshot = live.snapshot();

    const reconstructed: GraphNode[] = snapshot.nodes.map((id) =>
      Object.freeze({
        id,
        owner: "motion" as const,
        authoredIndex: 0,
        track: graph.nodeById[id]!.track,
        edges: Object.freeze(snapshot.edges.filter((edge) => edge.observerId === id)),
      }),
    );

    const diagnostics: Diagnostic[] = [];
    const resolved = resolveSolvers(reconstructed, diagnostics);
    expect(diagnostics).toEqual([]);

    const fromLive = resolved.find((node) => node.id === "walker/arm-solve");
    expect(fromLive?.solves).toEqual(EXPECTED_SOLVES);

    // And nothing else gained a derivation, so the match is not a copy of the whole graph.
    expect(resolved.filter((node) => node.solves !== undefined).map((node) => node.id)).toEqual([
      "walker/arm-solve",
    ]);
  });
});
