import { describe, expect, it } from "vitest";

import { validateV5 } from "../../src/contract/validate-v5";

const baseProject = () => ({ schemaVersion: 5, motions: [], freeTracks: [] });

describe("schema v5 validator", () => {
  it("accepts the minimal v5 project", () => {
    const result = validateV5(baseProject());
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it("rejects v4 and reports the schema path", () => {
    const result = validateV5({ schemaVersion: 4, motions: [] });
    expect(result.valid).toBe(false);
    expect(result.diagnostics[0]).toMatchObject({
      ruleId: "schema-version",
      path: "schemaVersion",
      severity: "error",
    });
  });

  it("accepts perspective for 3D content and rejects invalid perspective", () => {
    const good = validateV5({
      schemaVersion: 5,
      perspective: 800,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "tilt", keyframes: { rotationY: {} } }],
        },
      ],
    });
    const bad = validateV5({ schemaVersion: 5, perspective: 0, motions: [] });
    expect(good.valid).toBe(true);
    expect(bad.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-shape", severity: "error" }),
    );
  });

  it("warns, but does not reject, 3D content without perspective", () => {
    const result = validateV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "tilt", keyframes: { rotationY: {} } }],
        },
      ],
    });
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("rejects duplicate ids, invalid triggers, and malformed freeTracks", () => {
    const result = validateV5({
      schemaVersion: 5,
      freeTracks: {},
      motions: [{ id: "hero", trigger: { type: "unknown" }, tracks: [{ id: "x" }, { id: "x" }] }],
    });
    expect(result.valid).toBe(false);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining(["free-tracks-shape", "trigger-shape", "track-duplicate-id"]),
    );
  });

  it("rejects invalid observation roles, targets, unknown sources, self references, and cycles", () => {
    const result = validateV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            { id: "a", observes: [{ source: "b", role: "input" }] },
            { id: "b", observes: [{ source: "a" }] },
          ],
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining(["observation-input-target", "observation-cycle"]),
    );
  });

  it("accepts free-track references in the reserved namespace", () => {
    const result = validateV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "pointer",
              observes: [{ source: "~/cursor", role: "input", target: "position" }],
            },
          ],
        },
      ],
      freeTracks: [{ id: "cursor" }],
    });
    expect(result.valid).toBe(true);
  });
});
