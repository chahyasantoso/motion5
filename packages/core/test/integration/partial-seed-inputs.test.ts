import { describe, expect, it } from "vitest";
import { deriveDependents, type GraphEdge } from "../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { slotOf } from "../helpers/requirement-inputs";

const snapshot = (nodes: readonly PublisherNode[]): PublisherSnapshot => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((node) => [node.id, node]))),
  dependents: deriveDependents(nodes),
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

// TR-R-02, on the surviving input channel. Two slots of one plugin replace two flat edges; what
// the case asks -- what an unseeded upstream contributes to a partial flush -- is unchanged, so
// the scenario is converted rather than deleted. See ADR-047.
describe("GraphPublisher partial-seed requirement inputs", () => {
  it("uses the last published value for an unseeded requirement source", () => {
    const registry = new PatchRegistry();
    let a = 2;
    const sourceA = node("source-a", 0, [], () => ({
      values: { a },
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
        {
          observerId: "sink",
          sourceId: "source-a",
          role: "input",
          requirement: { plugin: "sum", slot: "left" },
        },
        {
          observerId: "sink",
          sourceId: "source-b",
          role: "input",
          requirement: { plugin: "sum", slot: "right" },
        },
      ],
      (requirementInputs) => {
        const left = Number(slotOf(requirementInputs, "sum", "left").a ?? 0);
        const right = Number(slotOf(requirementInputs, "sum", "right").b ?? 0);
        return { values: { total: left + right }, sourceProgress: 0, sourceRevisions: {} };
      },
    );
    const graph = snapshot([sourceA, sourceB, sink]);
    const publisher = new GraphPublisher(registry);

    publisher.flush(graph, ["source-a", "source-b"], 1);
    a = 4;
    const batch = publisher.flush(graph, ["source-a"], 2);

    expect(batch.patches.find(({ nodeId }) => nodeId === "sink")?.values).toEqual({ total: 7 });
  });
});
