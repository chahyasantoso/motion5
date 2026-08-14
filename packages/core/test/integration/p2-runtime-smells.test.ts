import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphIR } from "../../src/graph/ir";
import { GraphPublisher, type PublisherNode } from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";

const node = (id: string, edges: GraphEdge[], compose: PublisherNode["compose"]): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose,
  });

const snapshot = (
  nodes: readonly PublisherNode[],
): GraphIR & { nodes: readonly PublisherNode[] } => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [entry.id, entry]))),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

describe("P2 runtime smell hardening", () => {
  it("preserves the last known good values when a node publishes error", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, ["source"]);
    registry.publish({ nodeId: "source", values: { x: 1 }, sourceProgress: 0, status: "ready" });
    registry.closeBatch();

    registry.beginBatch(2, ["source"]);
    registry.publish({
      nodeId: "source",
      sourceProgress: 0,
      status: "error",
      diagnostics: [{ ruleId: "test", path: "source", message: "boom", severity: "error" }],
    });
    registry.closeBatch();

    expect(registry.get("source")?.values).toEqual({ x: 1 });
  });

  it("derives source revisions from the upstream patches consumed in the flush", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const source = node("source", [], () => ({
      values: { x: 1 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const consumer = node(
      "consumer",
      [{ observerId: "consumer", sourceId: "source", role: "input" }],
      (inputs) => ({ values: inputs, sourceProgress: 0, sourceRevisions: {} }),
    );

    publisher.flush(snapshot([source, consumer]), ["source", "consumer"], 1);
    const patch = registry.get("consumer");
    expect(patch?.sourceRevisions).toEqual({ source: 1 });
  });

  it("reports a missing upstream instead of silently composing with an input hole", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const consumer = node(
      "consumer",
      [{ observerId: "consumer", sourceId: "missing", role: "input" }],
      (inputs) => ({ values: inputs, sourceProgress: 0, sourceRevisions: {} }),
    );

    publisher.flush(snapshot([consumer]), ["consumer"], 1);
    expect(registry.get("consumer")?.status).toBe("error");
    expect(registry.get("consumer")?.diagnostics[0]?.ruleId).toBe("observation-missing-upstream");
  });

  it("chooses the blocked upstream deterministically by edge key, not authored edge order", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const failedA = node("a", [], () => {
      throw new Error("a failed");
    });
    const failedB = node("b", [], () => {
      throw new Error("b failed");
    });
    const consumer = node(
      "consumer",
      [
        { observerId: "consumer", sourceId: "b", role: "input" },
        { observerId: "consumer", sourceId: "a", role: "input" },
      ],
      (inputs) => ({ values: inputs, sourceProgress: 0, sourceRevisions: {} }),
    );

    publisher.flush(snapshot([failedA, failedB, consumer]), ["a", "b", "consumer"], 1);
    expect(registry.get("consumer")?.diagnostics[0]?.ids).toEqual(["a", "consumer"]);
  });
});
