// @ts-nocheck
import { builtinRegistry } from "../support/builtin-registry";
import { describe, expect, it } from "vitest";

import { validateSchemaV5 } from "../../src/contract/validate-v5";
import { buildGraphIR } from "../../src/graph/ir";

const perspectiveWarningProject = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "tilt", keyframes: { transform3d: { values: { rotationY: {} } } } }],
    },
  ],
} as const;

const cyclicProject = {
  schemaVersion: 5,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "a", observes: [{ source: "b" }] },
        { id: "b", observes: [{ source: "a" }] },
      ],
    },
  ],
} as const;

describe("P0-05 v5 contract integration", () => {
  it("preserves warnings without rejecting the project", () => {
    const result = validateSchemaV5(perspectiveWarningProject);
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("rejects cycles before runtime mounting", () => {
    const result = validateSchemaV5(cyclicProject);
    expect(result.kind).toBe("accepted");
    if (result.kind !== "accepted") throw new Error("Expected schema validation to pass.");
    const graph = buildGraphIR(result.value, builtinRegistry());
    expect(graph.graph).toBeUndefined();
    expect(graph.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "graph-cycle", severity: "error" }),
    );
  });
});
