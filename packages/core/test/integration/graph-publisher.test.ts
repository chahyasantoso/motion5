import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphIR, GraphNode } from "../../src/graph/ir";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { GraphPublisher, type PublisherNode } from "../../src/runtime/graph-publisher";

const makeNode = (
  id: string,
  authoredIndex: number,
  sources: readonly string[],
  compose: PublisherNode["compose"],
): PublisherNode => {
  const edges: readonly GraphEdge[] = sources.map((sourceId) => ({
    observerId: id,
    sourceId,
    role: "output",
  }));
  return Object.freeze({
    id,
    owner: "motion",
    authoredIndex,
    track: { id: id.split("/")[1] ?? id },
    edges: Object.freeze(edges),
    compose,
  });
};

const snapshot = (nodes: readonly PublisherNode[]): GraphIR & { nodes: readonly PublisherNode[] } => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node.id, node]))),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

describe("GraphPublisher", () => {
  it("I-5 composes a shared ancestor once and publishes one whole batch", () => {
    const calls = new Map<string, number>();
    const count = (id: string) => {
      calls.set(id, (calls.get(id) ?? 0) + 1);
      return { values: { id }, sourceProgress: 0.5, sourceRevisions: {} };
    };
    const nodes = [
      makeNode("root", 0, [], () => count("root")),
      makeNode("left", 1, ["root"], () => count("left")),
      makeNode("right", 2, ["root"], () => count("right")),
      makeNode("sink", 3, ["left", "right"], () => count("sink")),
    ];
    const registry = new PatchRegistry();
    const events: string[] = [];
    registry.subscribeBatch(() => events.push("batch"));
    const batch = new GraphPublisher(registry).flush(snapshot(nodes), ["root"], 1);
    expect(calls).toEqual(new Map([["root", 1], ["left", 1], ["right", 1], ["sink", 1]]));
    expect(batch.patches).toHaveLength(4);
    expect(events).toEqual(["batch"]);
  });

  it("I-9 publishes an error and blocks only the downstream closure", () => {
    const nodes = [
      makeNode("bad", 0, [], () => { throw new Error("boom"); }),
      makeNode("child", 1, ["bad"], () => ({ values: {}, sourceProgress: 0, sourceRevisions: {} })),
      makeNode("sibling", 2, [], () => ({ values: { ok: true }, sourceProgress: 0, sourceRevisions: {} })),
    ];
    const registry = new PatchRegistry();
    const batch = new GraphPublisher(registry).flush(snapshot(nodes), ["bad"], 1);
    expect(batch.patches.map(({ nodeId, status }) => [nodeId, status])).toEqual([
      ["bad", "error"],
      ["child", "blocked"],
    ]);
    expect(batch.patches.some(({ nodeId, status }) => nodeId === "sibling" && status === "ready")).toBe(
      false,
    );
  });

  it("does not expose topology mutation methods", () => {
    expect(Object.getOwnPropertyNames(GraphPublisher.prototype)).toEqual(["constructor", "flush"]);
  });
});
