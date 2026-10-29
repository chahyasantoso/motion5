import { describe, expect, it } from "vitest";
import { deriveDependants, type GraphEdge, type GraphIR } from "../../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import { slotOf } from "../../helpers/requirement-inputs";
import { code, member } from "../../helpers/source-region";

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

function pair(source: PublisherNode, observer: PublisherNode): PublisherSnapshot {
  return {
    nodes: [source, observer],
    nodeById: { [source.id]: source, [observer.id]: observer },
    dependants: deriveDependants([source, observer]),
    order: [source.id, observer.id],
    diagnostics: [],
  };
}

// The successor of the flat-input suite. Its first case survives here as delivery under a plugin
// and a slot; the pick-projection and collision cases retire with the primitives they proved,
// because a slot is the scope and there is no key left to rename or to collide with. See ADR-047.
const PUBLISHER_SOURCE = new URL("../../../src/runtime/graph-publisher.ts", import.meta.url);

describe("requirement-scoped input observations", () => {
  it("delivers the source record whole under its plugin and slot", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let observed: unknown;

    const source = node("hero/source", [], () => ({
      outputs: { values: { base: 1, overlay: 99 } },
      sourceProgress: 0.5,
      sourceRevisions: {},
    }));
    const observer = node(
      "hero/observer",
      [
        {
          observerId: "hero/observer",
          sourceId: "hero/source",
          requirement: { plugin: "fk", slot: "base" },
        },
      ],
      (requirementInputs) => {
        observed = requirementInputs.fk;
        const scoped = slotOf(requirementInputs, "fk", "base");
        return {
          outputs: {
            values: { seenBase: scoped.base ?? "absent", seenOverlay: scoped.overlay ?? "absent" },
          },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );

    publisher.flush(pair(source, observer), ["hero/source"], 1);

    expect(observed).toEqual({ base: { base: 1, overlay: 99 } });
    const heroObserverPatch = registry.get("hero/observer");
    if (heroObserverPatch?.status !== "ready")
      throw new Error(`hero/observer is ${heroObserverPatch?.status ?? "absent"}, not ready.`);
    expect(heroObserverPatch.outputs.values).toEqual({ seenBase: 1, seenOverlay: 99 });
  });

  it("delivers a __proto__ dict member as an own data property, without changing prototypes", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let observed: Readonly<Record<string, unknown>> | undefined;
    const source = node("hero/source", [], () => ({
      outputs: { values: { x: 7 } },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const observer = node(
      "hero/observer",
      [
        {
          observerId: "hero/observer",
          sourceId: "hero/source",
          requirement: { plugin: "collector", slot: "bones", memberKey: "__proto__" },
        },
      ],
      (inputs) => {
        observed = slotOf(inputs, "collector", "bones");
        const source = Object.hasOwn(observed, "__proto__") ? observed.__proto__ : undefined;
        return {
          outputs: { values: { seen: (source as { x?: number } | undefined)?.x ?? -1 } },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );
    publisher.flush(pair(source, observer), ["hero/source"], 1);
    expect(Object.hasOwn(observed!, "__proto__")).toBe(true);
    expect(Object.getPrototypeOf(observed)).toBe(Object.prototype);
    expect(Object.isFrozen(observed)).toBe(true);
    const patch = registry.get("hero/observer");
    if (patch?.status !== "ready") throw new Error("Observer must publish a ready scalar.");
    expect(patch.outputs.values).toEqual({ seen: 7 });
  });
});
