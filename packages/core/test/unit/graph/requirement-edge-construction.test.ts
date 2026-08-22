import { describe, expect, it } from "vitest";
import type { Diagnostic, PluginRequiresBinding } from "../../../src/contract/v5";
import { collectTrack, resolveRequirementEdge } from "../../../src/graph/ir";

const binding = (source: string): PluginRequiresBinding =>
  Object.freeze({ plugin: "fk", slot: "base", source, authoredPath: "fk.requires.base" });

describe("requirement edge construction", () => {
  it("Z-1 resolves a bound slot to one frozen input edge carrying its requirement", () => {
    const resolved = resolveRequirementEdge(
      binding("walk/pelvis"),
      "walk/chest",
      "walk",
      "walk/chest.keyframes.fk.requires.base",
    );

    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.edge).toEqual({
      observerId: "walk/chest",
      sourceId: "walk/pelvis",
      role: "input",
      requirement: { plugin: "fk", slot: "base" },
    });
    expect(Object.isFrozen(resolved.edge)).toBe(true);
    expect(Object.isFrozen(resolved.edge?.requirement)).toBe(true);
  });

  it("Z-2 reports requirement-source at the authored path and produces no edge", () => {
    const resolved = resolveRequirementEdge(
      binding("~/"),
      "walk/chest",
      "walk",
      "walk/chest.keyframes.fk.requires.base",
    );

    expect(resolved.edge).toBeUndefined();
    expect(resolved.diagnostics).toHaveLength(1);
    expect(resolved.diagnostics[0]).toMatchObject({
      ruleId: "requirement-source",
      path: "walk/chest.keyframes.fk.requires.base",
      severity: "error",
      ids: ["~/"],
    });
  });

  it("Z-3 leaves collectTrack's edges and diagnostics unchanged for a mixed track", () => {
    const diagnostics: Diagnostic[] = [];
    const node = collectTrack(
      {
        id: "chest",
        observes: [{ source: "pelvis" }],
        keyframes: {
          fk: {
            length: { stops: [{ p: 0, v: 1 }] },
            requires: { base: "pelvis" },
          },
        },
      },
      "motion",
      "walk",
      0,
      diagnostics,
    );

    expect(diagnostics).toEqual([]);
    expect(node?.edges).toEqual([
      { observerId: "walk/chest", sourceId: "walk/pelvis", role: "output" },
      {
        observerId: "walk/chest",
        sourceId: "walk/pelvis",
        role: "input",
        requirement: { plugin: "fk", slot: "base" },
      },
    ]);
  });
});
