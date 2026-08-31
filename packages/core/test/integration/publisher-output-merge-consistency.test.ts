import { describe, expect, it } from "vitest";
import { deriveDependents, type GraphEdge } from "../../src/graph/ir";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../src/runtime/graph-publisher";
import { slotOf } from "../helpers/requirement-inputs";

const node = (id: string, edges: GraphEdge[], compose: PublisherNode["compose"]): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose,
  });

const snapshot = (nodes: readonly PublisherNode[]): PublisherSnapshot => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((n) => [n.id, n]))),
  dependents: deriveDependents(nodes),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

const REQUIREMENT_EDGE: GraphEdge = {
  observerId: "downstream",
  sourceId: "sourceA",
  role: "input",
  requirement: { plugin: "p", slot: "s" },
};

describe("GraphPublisher: memo/registry consistency (recovery A1)", () => {
  it("a same-flush requirement consumer sees the source's merged value", () => {
    const nodes = [
      node("overlaySource", [], () => ({
        values: { overlay: 99 },
        sourceProgress: 0,
        sourceRevisions: {},
      })),
      node(
        "sourceA",
        [{ observerId: "sourceA", sourceId: "overlaySource", role: "output" }],
        () => ({ values: { base: 1 }, sourceProgress: 0, sourceRevisions: {} }),
      ),
      node("downstream", [REQUIREMENT_EDGE], (inputs) => ({
        values: slotOf(inputs, "p", "s"),
        sourceProgress: 0,
        sourceRevisions: {},
      })),
    ];
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const batch = publisher.flush(snapshot(nodes), ["overlaySource", "sourceA", "downstream"], 1);
    const sourceAPatch = registry.get("sourceA");
    const downstreamPatch = batch.patches.find((p) => p.nodeId === "downstream");

    expect(sourceAPatch?.values).toEqual({ base: 1, overlay: 99 });
    expect(downstreamPatch?.values).toEqual({ base: 1, overlay: 99 });
  });

  it("a later flush resolves the source's merged value via registry fallback", () => {
    let downstreamCalls = 0;
    const nodes = [
      node("overlaySource", [], () => ({
        values: { overlay: 99 },
        sourceProgress: 0,
        sourceRevisions: {},
      })),
      node(
        "sourceA",
        [{ observerId: "sourceA", sourceId: "overlaySource", role: "output" }],
        () => ({ values: { base: 1 }, sourceProgress: 0, sourceRevisions: {} }),
      ),
      node("downstream", [REQUIREMENT_EDGE], (inputs) => ({
        values: { ...slotOf(inputs, "p", "s"), callCount: (downstreamCalls += 1) },
        sourceProgress: 0,
        sourceRevisions: {},
      })),
    ];
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    publisher.flush(snapshot(nodes), ["overlaySource", "sourceA", "downstream"], 1);
    expect(registry.get("sourceA")?.values).toEqual({ base: 1, overlay: 99 });

    const batch2 = publisher.flush(snapshot(nodes), ["downstream"], 2);
    const downstreamPatch2 = batch2.patches.find((p) => p.nodeId === "downstream");
    expect(downstreamPatch2?.values).toMatchObject({ base: 1, overlay: 99 });
  });
});
