import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphIR } from "../../src/graph/ir";
import { GraphPublisher, type PublisherNode } from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";

const snapshot = (nodes: readonly PublisherNode[]): GraphIR & { nodes: readonly PublisherNode[] } => ({
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

describe("GraphPublisher partial-seed inputs", () => {
  it("uses the last published value for an unseeded input source", () => {
    const registry = new PatchRegistry();
    const sourceA = node("source-a", 0, [], () => ({
      values: { a: 2 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const sourceB = node("source-b", 1, [], () => ({
      values: { b: 3 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const sink = node(
      "sink",
      2,
      [
        { observerId: "sink", sourceId: "source-a", role: "input", target: "a" },
        { observerId: "sink", sourceId: "source-b", role: "input", target: "b" },
      ],
      (inputs) => ({
        values: { total: (inputs.a as { a: number }).a + (inputs.b as { b: number }).b },
        sourceProgress: 0,
        sourceRevisions: {},
      }),
    );
    const graph = snapshot([sourceA, sourceB, sink]);
    const publisher = new GraphPublisher(registry);

    publisher.flush(graph, ["source-a", "source-b"], 1);
    const batch = publisher.flush(graph, ["source-a"], 2);

    expect(batch.patches.find(({ nodeId }) => nodeId === "sink")?.values).toEqual({ total: 5 });
  });
});
