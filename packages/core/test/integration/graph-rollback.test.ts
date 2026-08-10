import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { GraphBinding, type GraphBindingHooks } from "../../src/graph/binding";

const project = (tracks: ProjectDefinition["motions"][number]["tracks"]): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks }],
  freeTracks: [{ id: "cursor" }],
});

const base = project([
  { id: "arm", observes: [{ source: "~/cursor", role: "input", target: "pointer" }] },
  { id: "halo", observes: [{ source: "arm" }] },
]);

const changed = project([
  { id: "arm", observes: [{ source: "~/cursor", role: "input", target: "pointer" }] },
  { id: "badge", observes: [{ source: "arm" }] },
]);

describe("GraphBinding transactions", () => {
  it("I-2 applies a valid candidate and preserves one live state identity", () => {
    const binding = new GraphBinding(base);
    const held = binding.state;

    binding.replace(changed);

    expect(binding.state).toBe(held);
    expect(binding.graph.order).toEqual(["~/cursor", "hero/arm", "hero/badge"]);
    expect(held.snapshot().nodes).toEqual(["hero/arm", "hero/badge", "~/cursor"]);
    expect(held.hasNode("hero/halo")).toBe(false);
    expect(held.hasEdge({ observerId: "hero/badge", sourceId: "hero/arm", role: "output" })).toBe(
      true,
    );
  });

  it("I-2 rejects an invalid candidate before touching the active graph", () => {
    const binding = new GraphBinding(base);
    const beforeGraph = binding.graph;
    const beforeState = binding.state.snapshot();
    const invalid = project([{ id: "arm", observes: [{ source: "missing" }] }]);

    expect(() => binding.replace(invalid)).toThrow(TypeError);
    expect(binding.graph).toBe(beforeGraph);
    expect(binding.state.snapshot()).toEqual(beforeState);
    expect(binding.state.journalLength).toBe(0);
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
    const binding = new GraphBinding(base, { hooks });
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
