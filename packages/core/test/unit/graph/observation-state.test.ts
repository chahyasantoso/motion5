import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import type { GraphEdge } from "../../../src/graph/ir";
import { buildGraphIR } from "../../../src/graph/ir";
import { ObservationState } from "../../../src/graph/observation-state";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        { id: "arm", observes: [{ source: "~/cursor", role: "input", target: "pointer" }] },
        { id: "halo", observes: [{ source: "arm" }] },
      ],
    },
  ],
  freeTracks: [{ id: "cursor" }],
};

const edge = (observerId: string, sourceId: string): GraphEdge => ({
  observerId,
  sourceId,
  role: "output",
});

/**
 * Population is the transaction coordinator's job, which P2-06 has not written yet.
 * The live state deliberately offers no way to do this for itself.
 */
function load(state: ObservationState): void {
  const { graph } = buildGraphIR(project);
  if (graph === undefined) throw new Error("fixture project must build");
  for (const id of graph.order) state.addNode(id);
  for (const id of graph.order)
    for (const live of graph.nodeById[id]?.edges ?? []) state.addEdge(live);
}

describe("stable observation state", () => {
  it("I-1 keeps a held reference authoritative across commit and rollback", () => {
    const state = new ObservationState();
    const held = state;
    load(state);
    const committed = state.snapshot();
    state.commit();

    expect(held).toBe(state);
    expect(held.snapshot()).toEqual(committed);

    state.addNode("hero/ghost");
    state.removeEdge(edge("hero/halo", "hero/arm"));
    expect(held.snapshot()).not.toEqual(committed);

    state.rollback();
    expect(held).toBe(state);
    expect(held.snapshot()).toEqual(committed);
  });

  it("I-1 replays the journal in reverse to restore an exact structural snapshot", () => {
    const state = new ObservationState();
    load(state);
    state.commit();
    const before = state.snapshot();

    state.removeEdge(edge("hero/halo", "hero/arm"));
    state.addNode("caption/label");
    state.addEdge(edge("caption/label", "hero/arm"));
    state.addEdge(edge("hero/halo", "caption/label"));
    state.removeEdge(edge("hero/halo", "caption/label"));

    state.rollback();
    expect(state.snapshot()).toEqual(before);
    expect(state.hasNode("caption/label")).toBe(false);
    expect(state.hasEdge(edge("hero/halo", "hero/arm"))).toBe(true);
  });

  it("releases the journal only after a successful commit", () => {
    const state = new ObservationState();
    expect(state.journalLength).toBe(0);
    load(state);
    expect(state.journalLength).toBeGreaterThan(0);

    state.commit();
    expect(state.journalLength).toBe(0);

    const committed = state.snapshot();
    state.rollback();
    expect(state.snapshot()).toEqual(committed);
  });

  it("clears the journal after a rollback so a second rollback is a no-op", () => {
    const state = new ObservationState();
    load(state);
    state.commit();
    const committed = state.snapshot();

    state.addNode("hero/ghost");
    state.rollback();
    expect(state.journalLength).toBe(0);
    state.rollback();
    expect(state.snapshot()).toEqual(committed);
  });

  it("exposes no rebuild-from-snapshot seam", () => {
    expect(Object.getOwnPropertyNames(ObservationState.prototype).sort()).toEqual([
      "addEdge",
      "addNode",
      "commit",
      "constructor",
      "hasEdge",
      "hasNode",
      "journalLength",
      "observersOf",
      "removeEdge",
      "removeNode",
      "rollback",
      "snapshot",
      "sourcesOf",
    ]);
  });

  it("refuses duplicates, unknown endpoints, and removal of a connected node", () => {
    const state = new ObservationState();
    load(state);

    expect(() => state.addNode("hero/arm")).toThrow(TypeError);
    expect(() => state.addEdge(edge("hero/halo", "hero/arm"))).toThrow(TypeError);
    expect(() => state.addEdge(edge("hero/halo", "hero/missing"))).toThrow(TypeError);
    expect(() => state.addEdge(edge("hero/missing", "hero/arm"))).toThrow(TypeError);
    expect(() => state.removeEdge(edge("hero/halo", "~/cursor"))).toThrow(TypeError);
    expect(() => state.removeNode("hero/arm")).toThrow(TypeError);
    expect(() => state.removeNode("hero/missing")).toThrow(TypeError);
  });

  it("indexes both directions and orders snapshots canonically", () => {
    const first = new ObservationState();
    for (const id of ["~/cursor", "hero/arm", "hero/halo"]) first.addNode(id);
    first.addEdge(edge("hero/halo", "hero/arm"));
    first.addEdge(edge("hero/arm", "~/cursor"));

    const second = new ObservationState();
    for (const id of ["hero/halo", "hero/arm", "~/cursor"]) second.addNode(id);
    second.addEdge(edge("hero/arm", "~/cursor"));
    second.addEdge(edge("hero/halo", "hero/arm"));

    expect(first.snapshot()).toEqual(second.snapshot());
    expect(first.snapshot().nodes).toEqual(["hero/arm", "hero/halo", "~/cursor"]);
    expect(first.observersOf("hero/arm").map(({ observerId }) => observerId)).toEqual([
      "hero/halo",
    ]);
    expect(first.sourcesOf("hero/arm").map(({ sourceId }) => sourceId)).toEqual(["~/cursor"]);
  });

  it("hands out frozen snapshots and frozen live edges", () => {
    const state = new ObservationState();
    load(state);
    const snapshot = state.snapshot();
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.nodes)).toBe(true);
    expect(Object.isFrozen(snapshot.edges)).toBe(true);
    for (const live of snapshot.edges) expect(Object.isFrozen(live)).toBe(true);
  });
});
