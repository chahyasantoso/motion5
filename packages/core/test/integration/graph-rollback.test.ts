import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { GraphBinding, type GraphBindingHooks } from "../../src/graph/binding";
import { createDefaultGraphBuilder } from "../../src/graph/builders/default";
import { builtinRegistry } from "../support/builtin-registry";

const project = (tracks: readonly TrackDefinition[]): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks }],
  freeTracks: [{ id: "cursor" }],
});

const base = project([
  { id: "arm", plugin: "graph-edge", input: { requires: { chain: "~/cursor" } } },
  { id: "halo", plugin: "graph-edge", input: { requires: { chain: "arm" } } },
]);

const changed = project([
  { id: "arm", plugin: "graph-edge", input: { requires: { chain: "~/cursor" } } },
  { id: "badge", plugin: "graph-edge", input: { requires: { chain: "arm" } } },
]);

describe("GraphBinding transactions", () => {
  it("I-2 applies a valid candidate and preserves one live state identity", () => {
    const binding = new GraphBinding(base, {
      builder: createDefaultGraphBuilder(builtinRegistry()),
    });
    const held = binding.state;

    binding.replace(changed);

    expect(binding.state).toBe(held);
    expect(binding.graph.order).toEqual(["~/cursor", "hero/arm", "hero/badge"]);
    expect(held.snapshot().nodes).toEqual(["hero/arm", "hero/badge", "~/cursor"]);
    expect(held.hasNode("hero/halo")).toBe(false);
    expect(
      held.hasEdge({
        observerId: "hero/badge",
        sourceId: "hero/arm",
        requirement: { plugin: "graph-edge", slot: "chain" },
      }),
    ).toBe(true);
  });

  it("I-2 rejects an invalid candidate before touching the active graph", () => {
    const binding = new GraphBinding(base, {
      builder: createDefaultGraphBuilder(builtinRegistry()),
    });
    const beforeGraph = binding.graph;
    const beforeState = binding.state.snapshot();
    const invalid = project([
      { id: "arm", plugin: "graph-edge", input: { requires: { chain: "~/cursor" } } },
      { id: "newcomer", plugin: "graph-edge", input: { requires: { chain: "arm" } } },
      { id: "broken", plugin: "graph-edge", input: { requires: { chain: "missing" } } },
    ]);

    // A valid node and an invalid edge arrive in one candidate: nothing of it may survive.
    expect(() => binding.replace(invalid)).toThrow(TypeError);
    expect(binding.graph).toBe(beforeGraph);
    expect(binding.state.snapshot()).toEqual(beforeState);
    expect(binding.state.journalLength).toBe(0);
    expect(binding.state.hasNode("hero/newcomer")).toBe(false);

    // And the rejected transaction leaves the binding able to accept valid work afterwards.
    binding.replace(changed);
    expect(binding.graph.order).toEqual(["~/cursor", "hero/arm", "hero/badge"]);
    expect(binding.state.snapshot().nodes).toEqual(["hero/arm", "hero/badge", "~/cursor"]);
  });

  it.each<[string, GraphBindingHooks]>([
    [
      "live-state apply",
      {
        afterStateApply: () => {
          throw new Error("state stage");
        },
      },
    ],
    [
      "publisher scheduling",
      {
        afterScheduleApply: () => {
          throw new Error("schedule stage");
        },
      },
    ],
  ])("I-2 restores every observable state after %s fails", (_stage, hooks) => {
    const binding = new GraphBinding(base, {
      hooks,
      builder: createDefaultGraphBuilder(builtinRegistry()),
    });
    const beforeGraph = binding.graph;
    const beforeState = binding.state.snapshot();
    const held = binding.state;

    expect(() => binding.replace(changed)).toThrow();
    expect(binding.graph).toBe(beforeGraph);
    expect(binding.state).toBe(held);
    expect(binding.state.snapshot()).toEqual(beforeState);
    expect(binding.state.journalLength).toBe(0);
    expect(binding.state.hasNode("hero/halo")).toBe(true);
    expect(binding.state.hasNode("hero/badge")).toBe(false);
  });
});
