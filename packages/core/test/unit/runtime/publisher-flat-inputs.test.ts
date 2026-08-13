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

  it("applies an explicit pick projection before merging input keys", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let observed: Readonly<Record<string, unknown>> | undefined;
    const source = node("hero/source", [], () => ({
      values: { base: 1, overlay: 99 },
      sourceProgress: 0,
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
          projection: { pick: ["overlay"] },
        } as never,
      ],
      (inputs) => {
        observed = inputs;
        return { values: inputs, sourceProgress: 0, sourceRevisions: {} };
      },
    );
    const snapshot = {
      nodes: [source, observer],
      nodeById: { "hero/source": source, "hero/observer": observer },
      order: ["hero/source", "hero/observer"],
      diagnostics: [],
    } as GraphIR & { nodes: readonly PublisherNode[] };

    publisher.flush(snapshot, ["hero/source"], 1);
    expect(observed).toEqual({ overlay: 99 });
  });

  it("rejects colliding projected keys instead of silently overwriting", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const sourceA = node("hero/a", [], () => ({
      values: { value: 1 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const sourceB = node("hero/b", [], () => ({
      values: { value: 2 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const observer = node(
      "hero/observer",
      [
        {
          observerId: "hero/observer",
          sourceId: "hero/a",
          role: "input",
          target: "a",
          projection: { map: { value: "shared" } },
        } as never,
        {
          observerId: "hero/observer",
          sourceId: "hero/b",
          role: "input",
          target: "b",
          projection: { map: { value: "shared" } },
        } as never,
      ],
      (inputs) => ({ values: inputs, sourceProgress: 0, sourceRevisions: {} }),
    );
    const snapshot = {
      nodes: [sourceA, sourceB, observer],
      nodeById: { "hero/a": sourceA, "hero/b": sourceB, "hero/observer": observer },
      order: ["hero/a", "hero/b", "hero/observer"],
      diagnostics: [],
    } as GraphIR & { nodes: readonly PublisherNode[] };

    const batch = publisher.flush(snapshot, ["hero/a", "hero/b"], 1);
    expect(
      batch.patches.find((patch) => patch.nodeId === "hero/observer")?.diagnostics[0]?.ruleId,
    ).toBe("observation-input-collision");
  });
});
