import { describe, expect, it } from "vitest";
import type { GraphIR } from "../../../src/graph/ir";
import { GraphPublisher, type PublisherNode } from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

function node(
  id: string,
  edges: GraphIR["nodes"][number]["edges"],
  compose: PublisherNode["compose"],
): PublisherNode {
  return Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose,
  });
}

describe("flat projected input observations (X-1)", () => {
  it("merges an upstream record into the observer source object", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let observed: Readonly<Record<string, unknown>> | undefined;

    const source = node("hero/source", [], () => ({
      values: { base: 1, overlay: 99 },
      sourceProgress: 0.5,
      sourceRevisions: {},
    }));
    const observer = node(
      "hero/observer",
      [
        {
          observerId: "hero/observer",
          sourceId: "hero/source",
          role: "input",
          target: "fromA",
        },
      ],
      (inputs) => {
        observed = inputs;
        return {
          values: { seenBase: inputs.base, seenOverlay: inputs.overlay },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );

    const snapshot = {
      nodes: [source, observer],
      nodeById: { "hero/source": source, "hero/observer": observer },
      order: ["hero/source", "hero/observer"],
      diagnostics: [],
    } as GraphIR & { nodes: readonly PublisherNode[] };

    publisher.flush(snapshot, ["hero/source"], 1);

    expect(observed).toEqual({ base: 1, overlay: 99 });
    expect(registry.get("hero/observer")?.values).toEqual({
      seenBase: 1,
      seenOverlay: 99,
    });
  });
});
