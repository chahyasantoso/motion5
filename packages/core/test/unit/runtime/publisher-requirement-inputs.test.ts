import { describe, expect, it } from "vitest";
import { deriveDependents, type GraphIR } from "../../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import { slotOf } from "../../helpers/requirement-inputs";

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
    dependents: deriveDependents([source, observer]),
    order: [source.id, observer.id],
    diagnostics: [],
  };
}

// The successor of the flat-input suite. Its first case survives here as delivery under a plugin
// and a slot; the pick-projection and collision cases retire with the primitives they proved,
// because a slot is the scope and there is no key left to rename or to collide with. See ADR-047.
describe("requirement-scoped input observations", () => {
  it("delivers the source record whole under its plugin and slot", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let observed: unknown;

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
          requirement: { plugin: "fk", slot: "base" },
        },
      ],
      (requirementInputs) => {
        observed = requirementInputs.fk;
        const scoped = slotOf(requirementInputs, "fk", "base");
        return {
          values: { seenBase: scoped.base ?? null, seenOverlay: scoped.overlay ?? null },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );

    publisher.flush(pair(source, observer), ["hero/source"], 1);

    expect(observed).toEqual({ base: { base: 1, overlay: 99 } });
    expect(registry.get("hero/observer")?.values).toEqual({ seenBase: 1, seenOverlay: 99 });
  });

  it("refuses an input edge that carries no requirement", () => {
    // Unreachable by construction once `observes` is output-only, so it is thrown rather than
    // skipped: an edge in the input phase with nothing to scope it has no destination at all.
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const source = node("hero/source", [], () => ({
      values: { base: 1 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const observer = node(
      "hero/observer",
      [{ observerId: "hero/observer", sourceId: "hero/source", role: "input" }],
      () => ({ values: {}, sourceProgress: 0, sourceRevisions: {} }),
    );

    const batch = publisher.flush(pair(source, observer), ["hero/source"], 1);

    expect(
      batch.patches.find((patch) => patch.nodeId === "hero/observer")?.diagnostics[0]?.ruleId,
    ).toBe("observation-input-shape");
  });
});
