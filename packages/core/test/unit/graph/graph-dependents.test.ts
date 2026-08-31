import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { buildGraphIR, type GraphEdge, type GraphIR } from "../../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

/**
 * Issue #223, optimisation 7a.
 *
 * `GraphPublisher.flush` rebuilds its whole graph shape on every tick: one map from node id to node
 * and one map of dependents, both recomputed from `snapshot.nodes` per flush, over a graph that
 * changed at most once between ticks. Both are pure functions of the `GraphIR`, and `finalizeGraph`
 * already walks every edge of every node for the duplicate, unknown-source and self-reference
 * rules, and it ran `resolveSolvers` immediately before, so the solver fan-in is in hand there too.
 *
 * So reverse topology gets one owner, in the file that already owns `compareEdges` and delegates to
 * `orderGraph`, and the publisher reads graph shape instead of deriving it. Its two walks then cost
 * O(affected) rather than O(V+E), which is what the authoring surface makes worth doing: a
 * structural edit lands once between ticks and steady-state ticking pays for it every frame.
 *
 * ADR-051's walker is the rig, because it is the one shape whose reverse topology edges cannot
 * answer on their own: a solver reads its members through `solves`, and no edge points that way.
 */
const WALKER: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "ra-7a",
  motions: [
    {
      id: "walker",
      trigger: { type: "manual" },
      tracks: [
        { id: "shoulder", keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } } },
        {
          id: "hand-target",
          keyframes: { transform: { values: { x: 320, y: 340, rotation: 0 } } },
        },
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
      ],
    },
  ],
  freeTracks: [{ id: "hud", keyframes: { transform: { values: { x: 5 } } } }],
};

/**
 * Every reader of every node of the rig above, in node order.
 *
 * `walker/forearm` is the entry edges cannot answer: nothing observes it and nothing bases on it,
 * and its only reader is the solver that solves it. `walker/upper-arm` carries one of each, the
 * solver through `solves` and the forearm through its `base` edge, and the solver's entry is first
 * because the solver is the earlier node rather than because membership outranks an edge.
 */
const EXPECTED: GraphIR["dependents"] = {
  "walker/shoulder": ["walker/arm-solve", "walker/upper-arm"],
  "walker/hand-target": ["walker/arm-solve"],
  "walker/arm-solve": ["walker/upper-arm", "walker/forearm"],
  "walker/upper-arm": ["walker/arm-solve", "walker/forearm"],
  "walker/forearm": ["walker/arm-solve"],
  "~/hud": [],
};

function walkerGraph(build: (project: ProjectDefinition) => ReturnType<typeof buildGraphIR>) {
  const built = build(WALKER);
  expect(built.diagnostics).toEqual([]);
  expect(built.graph).toBeDefined();
  return built.graph!;
}

function node(
  id: string,
  edges: readonly GraphEdge[],
  values: Readonly<Record<string, unknown>>,
): PublisherNode {
  return Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose: () => ({ values, sourceProgress: 0, sourceRevisions: {} }),
  }) as PublisherNode;
}

function inputEdge(observerId: string, sourceId: string): GraphEdge {
  return { observerId, sourceId, role: "input", requirement: { plugin: "p", slot: "s" } };
}

/**
 * A snapshot whose graph shape is stated rather than derived, which is what makes the two publisher
 * cases below discriminating: a publisher that recomputes either map from `nodes` cannot see what
 * this hands it, and one that reads the snapshot cannot see anything else.
 */
function snapshot(
  nodes: readonly PublisherNode[],
  dependents: GraphIR["dependents"],
  nodeById: Readonly<Record<string, PublisherNode>> = Object.fromEntries(
    nodes.map((entry) => [entry.id, entry]),
  ),
): PublisherSnapshot {
  return {
    nodes,
    nodeById,
    dependents,
    order: nodes.map((entry) => entry.id),
    diagnostics: [],
  };
}

describe("reverse topology is derived once, by the graph that owns every other edge rule", () => {
  it("RA-18 names every reader of every node, edges and solver membership alike", () => {
    expect(walkerGraph(buildGraphIR).dependents).toEqual(EXPECTED);
  });

  it("RA-19 answers for every node, frozen, including the ones nothing reads", () => {
    const graph = walkerGraph(buildGraphIR);
    const dependents = graph.dependents;

    // Total rather than sparse. A missing key and an empty list are the same answer to a consumer
    // that spells `?? []`, and one of them makes the map's own shape depend on the rig.
    expect(Object.keys(dependents).sort()).toEqual(graph.nodes.map(({ id }) => id).sort());
    expect(Object.isFrozen(dependents)).toBe(true);
    for (const [id, readers] of Object.entries(dependents))
      expect(Object.isFrozen(readers), `readers of ${id} frozen`).toBe(true);
    expect(dependents["~/hud"]).toEqual([]);
  });

  it("RA-20 answers identically from both builders, which finalize through one owner", () => {
    const builder = new IncrementalGraphBuilder();
    const incremental = walkerGraph((project) => builder.build(project)).dependents;
    expect(incremental).toEqual(walkerGraph(buildGraphIR).dependents);
  });
});

describe("the publisher reads graph shape rather than deriving it per flush", () => {
  it("RA-21 walks the reverse topology the snapshot carries, not one built from edges", () => {
    const source = node("source", [], { x: 1 });
    const consumer = node("consumer", [inputEdge("consumer", "source")], { y: 2 });

    // Honest first: a reader the map names is reached, so this case cannot pass by the publisher
    // ignoring the map altogether.
    const reached = new PatchRegistry();
    new GraphPublisher(reached).flush(
      snapshot([source, consumer], { source: ["consumer"], consumer: [] }),
      ["source"],
      1,
    );
    expect(reached.get("source")?.values).toEqual({ x: 1 });
    expect(reached.get("consumer")?.values).toEqual({ y: 2 });

    // And a reader the map does not name is not reached, even though the edge that would have
    // derived it is right there on the node. Deriving one per flush is what this refuses.
    const skipped = new PatchRegistry();
    new GraphPublisher(skipped).flush(
      snapshot([source, consumer], { source: [], consumer: [] }),
      ["source"],
      1,
    );
    expect(skipped.get("source")?.values).toEqual({ x: 1 });
    expect(skipped.get("consumer")).toBeUndefined();
  });

  it("RA-22 resolves a node through the snapshot's nodeById, not a map rebuilt per flush", () => {
    const source = node("source", [], { x: 1 });
    const consumer = node("consumer", [inputEdge("consumer", "source")], { y: 2 });
    const registry = new PatchRegistry();

    // `nodeById` omits the consumer while `nodes` and `order` still carry it, which no builder can
    // produce and no runtime can hand over. It is a lie detector, and the only thing it detects is
    // the publisher answering "which node is this" from somewhere other than the graph's own map.
    new GraphPublisher(registry).flush(
      snapshot([source, consumer], { source: ["consumer"], consumer: [] }, { source }),
      ["source"],
      1,
    );
    expect(registry.get("source")?.values).toEqual({ x: 1 });
    expect(registry.get("consumer")).toBeUndefined();
  });
});
