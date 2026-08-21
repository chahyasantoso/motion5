import { describe, expect, it } from "vitest";
import { buildGraphIR } from "../../../src/graph/ir";
import type { ProjectDefinition } from "../../../src/contract/v5";

const project = (overrides: Partial<ProjectDefinition> = {}): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
  freeTracks: [{ id: "cursor" }],
  ...overrides,
});

describe("graph IR and candidate validation", () => {
  it("normalizes motion and free tracks into one frozen node model", () => {
    const result = buildGraphIR(project());
    expect(result.diagnostics).toEqual([]);
    expect(result.graph?.nodes.map(({ id, owner }) => [id, owner])).toEqual([
      ["hero/arm", "motion"],
      ["~/cursor", "free"],
    ]);
    expect(Object.isFrozen(result.graph)).toBe(true);
    expect(Object.isFrozen(result.graph?.nodes)).toBe(true);
  });

  it("resolves local, free, and cross-motion observation sources", () => {
    const result = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [{ id: "arm", observes: [{ source: "~/cursor", role: "input" }] }],
          },
          {
            id: "caption",
            trigger: { type: "manual" },
            tracks: [{ id: "label", observes: [{ source: "hero/arm" }] }],
          },
        ],
      }),
    );
    expect(result.diagnostics).toEqual([]);
    expect(
      result.graph?.nodes.flatMap(({ edges }) => edges.map(({ sourceId }) => sourceId)),
    ).toEqual(["~/cursor", "hero/arm"]);
  });

  it("rejects unknown, duplicate, and self-referential edges before mount", () => {
    // The removed `target` field has its own owner in observation-target-removal.test.ts, so it
    // is not authored here: this case owns topology, and one rule belongs to one test.
    const result = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "arm",
                observes: [
                  { source: "missing" },
                  { source: "missing" },
                  { source: "arm" },
                  { source: "cursor", role: "input" },
                ],
              },
            ],
          },
        ],
      }),
    );
    expect(result.graph).toBeUndefined();
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining([
        "observation-duplicate",
        "observation-self-reference",
        "observation-unknown-source",
      ]),
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
            tracks: [{ id: "arm", observes: [{ source: "missing" }] }],
          },
        ],
      }),
    );
    const second = buildGraphIR(
      project({
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [{ id: "arm", observes: [{ source: "missing" }] }],
          },
        ],
      }),
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
            tracks: [{ id: "bx", observes: [{ source: "~/nope" }] }],
          },
          {
            id: "a-b",
            trigger: { type: "manual" },
            tracks: [{ id: "x", observes: [{ source: "~/nope" }] }],
          },
        ],
      }),
    );
    expect(result.graph).toBeUndefined();
    expect(result.diagnostics.map(({ path }) => path)).toEqual(["a-b/x", "a/bx"]);
  });
});
