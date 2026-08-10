import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphIR } from "../../src/graph/ir";
import { edgeKey } from "../../src/graph/ir";
import { GraphPublisher, type PublisherNode } from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";

const snapshot = (
  nodes: readonly PublisherNode[],
): GraphIR & { nodes: readonly PublisherNode[] } => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node.id, node]))),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

const node = (
  id: string,
  authoredIndex: number,
  edges: readonly GraphEdge[],
  compose: PublisherNode["compose"],
): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex,
    track: { id },
    edges: Object.freeze(edges),
    compose,
  });

describe("GraphPublisher output edges", () => {
  it("merges output source values over the composed patch", () => {
    const registry = new PatchRegistry();
    const source = node("source", 0, [], () => ({
      values: { opacity: 0.5 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const observer = node(
      "observer",
      1,
      [{ observerId: "observer", sourceId: "source", role: "output" }],
      () => ({ values: { x: 10 }, sourceProgress: 0, sourceRevisions: {} }),
    );
    const batch = new GraphPublisher(registry).flush(snapshot([source, observer]), ["source"], 1);
    expect(batch.patches.find(({ nodeId }) => nodeId === "observer")?.values).toEqual({
      opacity: 0.5,
      x: 10,
    });
  });

  it("uses canonical edge order when output sources collide", () => {
    const registry = new PatchRegistry();
    const sourceA = node("a", 0, [], () => ({
      values: { color: "a" },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const sourceB = node("b", 1, [], () => ({
      values: { color: "b" },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const edges = [
      { observerId: "observer", sourceId: "b", role: "output" as const },
      { observerId: "observer", sourceId: "a", role: "output" as const },
    ];
    const observer = node("observer", 2, edges, () => ({
      values: {},
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const batch = new GraphPublisher(registry).flush(
      snapshot([sourceA, sourceB, observer]),
      ["a", "b"],
      1,
    );
    const expectedWinner = edgeKey(edges[0]!) < edgeKey(edges[1]!) ? "a" : "b";
    expect(batch.patches.find(({ nodeId }) => nodeId === "observer")?.values).toEqual({
      color: expectedWinner,
    });
  });
});
