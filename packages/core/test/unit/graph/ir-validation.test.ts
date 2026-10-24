import { builtinRegistry } from "../../support/builtin-registry";
import { describe, expect, it } from "vitest";
import { buildGraphIR } from "../../../src/graph/ir";
import type { GroupedProject } from "../../support/v5-builders";

const project = (overrides: Partial<GroupedProject> = {}): GroupedProject => ({
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
  freeTracks: [{ id: "cursor" }],
  ...overrides,
});

describe("graph IR and candidate validation", () => {
  it("normalizes motion and free tracks into one frozen node model", () => {
    const result = buildGraphIR(project(), builtinRegistry());
    expect(result.diagnostics).toEqual([]);
    expect(result.graph?.nodes.map(({ id, owner }) => [id, owner])).toEqual([
      ["hero/arm", "motion"],
      ["~/cursor", "free"],
    ]);
    expect(Object.isFrozen(result.graph)).toBe(true);
    expect(Object.isFrozen(result.graph?.nodes)).toBe(true);
  });

  it("resolves local, free, and cross-motion bound sources", () => {
    const result = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [{ id: "arm", keyframes: { fk: { requires: { base: "~/cursor" } } } }],
          },
          {
            id: "caption",
            trigger: { type: "manual" },
            tracks: [{ id: "label", keyframes: { fk: { requires: { base: "hero/arm" } } } }],
          },
        ],
      }),
      builtinRegistry(),
    );
    expect(result.diagnostics).toEqual([]);
    expect(
      result.graph?.nodes.flatMap(({ edges }) => edges.map(({ sourceId }) => sourceId)),
    ).toEqual(["~/cursor", "hero/arm"]);
  });

  it("rejects unknown and self-referential edges before mount", () => {
    const result = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [
              { id: "arm", keyframes: { fk: { requires: { base: "missing" } } } },
              { id: "leg", keyframes: { fk: { requires: { base: "leg" } } } },
            ],
          },
        ],
      }),
      builtinRegistry(),
    );
    expect(result.graph).toBeUndefined();
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining(["edge-self-reference", "edge-unknown-source"]),
    );
  });

  it("rejects duplicate motion and node identities", () => {
    const result = buildGraphIR(
      project({
        motions: [
          { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
          { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
        ],
      }),
      builtinRegistry(),
    );
    expect(result.graph).toBeUndefined();
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toContain("motion-duplicate");
  });

  it("orders diagnostics deterministically", () => {
    const first = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [{ id: "arm", keyframes: { fk: { requires: { base: "missing" } } } }],
          },
        ],
      }),
      builtinRegistry(),
    );
    const second = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [{ id: "arm", keyframes: { fk: { requires: { base: "missing" } } } }],
          },
        ],
      }),
      builtinRegistry(),
    );
    expect(first.diagnostics).toEqual(second.diagnostics);
  });

  it("breaks diagnostic ties by code unit, not by locale collation", () => {
    const result = buildGraphIR(
      project({
        motions: [
          {
            id: "a",
            trigger: { type: "manual" },
            tracks: [{ id: "bx", keyframes: { fk: { requires: { base: "~/nope" } } } }],
          },
          {
            id: "a-b",
            trigger: { type: "manual" },
            tracks: [{ id: "x", keyframes: { fk: { requires: { base: "~/nope" } } } }],
          },
        ],
      }),
      builtinRegistry(),
    );
    expect(result.graph).toBeUndefined();
    expect(result.diagnostics.map(({ path }) => path)).toEqual(["a-b/x", "a/bx"]);
  });
});
