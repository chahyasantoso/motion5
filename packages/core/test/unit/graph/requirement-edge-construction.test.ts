import { describe, expect, it } from "vitest";
import type { Diagnostic, TrackDefinition } from "../../../src/contract/v5";
import { collectTrack, edgeRequirement } from "../../../src/graph/ir";
import { resolveRequirementEdge } from "../../../src/graph/dependency-edges";

type Binding = {
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  readonly authoredPath: string;
};
const binding = (source: string): Binding =>
  Object.freeze({ plugin: "fk", slot: "base", source, authoredPath: "fk.requires.base" });

describe("requirement edge construction", () => {
  it("Z-1 resolves a bound slot to one frozen input edge carrying its requirement", () => {
    const resolved = resolveRequirementEdge(
      binding("walk/pelvis"),
      "walk/chest",
      "walk",
      "walk/chest.keyframes.fk.requires.base",
    );

    expect(resolved.kind).toBe("accepted");
    if (resolved.kind !== "accepted") return;
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.value).toEqual({
      observerId: "walk/chest",
      sourceId: "walk/pelvis",
      role: "input",
      requirement: { plugin: "fk", slot: "base" },
    });
    expect(Object.isFrozen(resolved.value)).toBe(true);
    expect(Object.isFrozen(edgeRequirement(resolved.value))).toBe(true);
  });

  it("Z-2 reports requirement-source at the authored path and produces no edge", () => {
    const resolved = resolveRequirementEdge(
      binding("~/"),
      "walk/chest",
      "walk",
      "walk/chest.keyframes.fk.requires.base",
    );

    expect(resolved.kind).toBe("refused");
    expect("value" in resolved).toBe(false);
    expect(resolved.diagnostics).toHaveLength(1);
    expect(resolved.diagnostics[0]).toMatchObject({
      ruleId: "requirement-source",
      path: "walk/chest.keyframes.fk.requires.base",
      severity: "error",
      ids: ["~/"],
    });
  });

  it("Z-3 leaves collectTrack's edges and diagnostics unchanged for a bound track", () => {
    const diagnostics: Diagnostic[] = [];
    const node = collectTrack(
      {
        id: "chest",
        plugin: "fk",
        input: {
          values: { length: [{ p: 0, v: 1 }], rotation: 0 },
          requires: { chain: "pelvis" },
        },
      } satisfies TrackDefinition,
      "motion",
      "walk",
      0,
      diagnostics,
    );

    expect(diagnostics).toEqual([]);
    expect(node?.edges).toEqual([
      {
        observerId: "walk/chest",
        sourceId: "walk/pelvis",
        role: "input",
        requirement: { plugin: "fk", slot: "chain" },
      },
    ]);
  });
});
