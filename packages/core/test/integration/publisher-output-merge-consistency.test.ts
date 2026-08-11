import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphIR } from "../../src/graph/ir";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { GraphPublisher, type PublisherNode } from "../../src/runtime/graph-publisher";

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
  nodeById: Object.freeze(Object.fromEntries(nodes.map((n) => [n.id, n]))),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

describe("GraphPublisher: memo/registry consistency (recovery A1)", () => {
  it("a same-flush input-role consumer of a node sees exactly what that node published, including its own output-role merge", () => {
    // overlaySource merges onto sourceA via an output-role edge.
    // sourceA's real published patch must be the MERGED value.
    // downstream reads sourceA via an input-role edge in the SAME flush and must see the same merged value,
    // not the pre-merge value sourceA's own compose() returned.
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
      node(
        "downstream",
        [{ observerId: "downstream", sourceId: "sourceA", role: "input", target: "fromA" }],
        (inputs) => ({ values: inputs, sourceProgress: 0, sourceRevisions: {} }),
      ),
    ];
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const batch = publisher.flush(snapshot(nodes), ["overlaySource", "sourceA", "downstream"], 1);

    const sourceAPatch = registry.get("sourceA");
    const downstreamPatch = batch.patches.find((p) => p.nodeId === "downstream");

    expect(sourceAPatch?.values).toEqual({ base: 1, overlay: 99 });
    expect(downstreamPatch?.values.fromA).toEqual(sourceAPatch?.values);
  });

  it("a node reprocessed on a later flush, while its input source is not, still resolves the source's merged value via the registry fallback", () => {
    // overlaySource's contribution changes between ticks so downstream is forced to
    // actually recompute (and republish) on tick 2, while sourceA is NOT reseeded on tick 2
    // (its own inputs did not change) and so must be read back from the registry, not memo.
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
      node(
        "downstream",
        [{ observerId: "downstream", sourceId: "sourceA", role: "input", target: "fromA" }],
        (inputs) => ({
          // Force a genuine republish on tick 2 (rather than being deduped as unchanged)
          // so the assertion below exercises a real, non-degenerate flush.
          values: { ...inputs, callCount: (downstreamCalls += 1) },
          sourceProgress: 0,
          sourceRevisions: {},
        }),
      ),
    ];
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    publisher.flush(snapshot(nodes), ["overlaySource", "sourceA", "downstream"], 1);
    expect(registry.get("sourceA")?.values).toEqual({ base: 1, overlay: 99 });

    // Tick 2: only "downstream" reseeds. sourceA is untouched this flush, so its input
    // must resolve via the registry, and it must still be the merged value from tick 1.
    const batch2 = publisher.flush(snapshot(nodes), ["downstream"], 2);
    const downstreamPatch2 = batch2.patches.find((p) => p.nodeId === "downstream");
    expect(downstreamPatch2?.values.fromA).toEqual({ base: 1, overlay: 99 });
  });
});
