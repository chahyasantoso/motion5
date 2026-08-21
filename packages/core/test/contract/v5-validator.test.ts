import { describe, expect, it } from "vitest";

import { validateV5 } from "../../src/contract/validate-v5";

const baseProject = () => ({ schemaVersion: 5, motions: [], freeTracks: [] });

function projectWithKeyframes(keyframes: unknown) {
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm", keyframes }] }],
  };
}

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}

describe("schema v5 validator", () => {
  it("accepts the minimal v5 project", () => {
    const result = validateV5(baseProject());
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it("rejects malformed, non-finite, out-of-range, non-monotonic, and duplicate stops", () => {
    const result = validateV5(
      projectWithKeyframes({
        malformed: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 1 },
          ],
        },
        nan: { stops: [{ p: Number.NaN, v: 0 }] },
        range: { stops: [{ p: 1.5, v: 0 }] },
        order: {
          stops: [
            { p: 0.8, v: 0 },
            { p: 0.2, v: 1 },
          ],
        },
        duplicate: {
          stops: [
            { p: 0.2, v: 0 },
            { p: 0.2, v: 1 },
          ],
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining([
        "stop-position",
        "stop-position-range",
        "stop-position-order",
        "stop-position-duplicate",
      ]),
    );
  });

  it("warns when a property does not cover both interpolation endpoints", () => {
    const result = validateV5(projectWithKeyframes({ opacity: { stops: [{ p: 0.25, v: 0.5 }] } }));
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "stop-missing-start", severity: "warning" }),
        expect.objectContaining({ ruleId: "stop-missing-end", severity: "warning" }),
      ]),
    );
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

  it("F-1 accepts plugin-named keyframe groups alongside the flat form", () => {
    const grouped = projectWithKeyframes({
      opacity: ramp(0, 1),
      fk: { boneLength: ramp(10, 20) },
    });
    const result = validateV5(grouped);
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it("F-2 keeps the perspective warning for 3D content authored inside a group", () => {
    const grouped = projectWithKeyframes({ transform: { rotationY: ramp(0, 1) } });
    const result = validateV5(grouped);
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("F-3 rejects a colon in flat, group, and leaf keyframe names", () => {
    const project = projectWithKeyframes({
      "fk:length": ramp(0, 1),
      fk: { "length:ratio": ramp(0, 1) },
      "trans:form": { rotation: ramp(0, 1) },
    });
    const result = validateV5(project);
    const reserved = result.diagnostics.filter(
      ({ ruleId }) => ruleId === "keyframes-reserved-separator",
    );
    expect(result.valid).toBe(false);
    expect(reserved.map(({ path }) => path)).toEqual([
      "motions[0].tracks[0].keyframes.fk:length",
      "motions[0].tracks[0].keyframes.fk.length:ratio",
      "motions[0].tracks[0].keyframes.trans:form",
    ]);
  });

  it("F-4 reports a grouped leaf stop error at the authored path", () => {
    const project = projectWithKeyframes({ fk: { lenght: { stops: [{ p: 2, v: 1 }] } } });
    const result = validateV5(project);
    expect(result.valid).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "stop-position-range",
        path: "motions[0].tracks[0].keyframes.fk.lenght.stops[0].p",
      }),
    );
  });

  it("F-5 rejects one compiled key authored under two spellings", () => {
    const project = projectWithKeyframes({ x: ramp(0, 1), transform: { x: ramp(0, 2) } });
    const result = validateV5(project);
    expect(result.valid).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "keyframes-duplicate-key",
        path: "motions[0].tracks[0].keyframes.transform.x",
      }),
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

  it("rejects invalid observation roles, unknown sources, self references, and cycles", () => {
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
      expect.arrayContaining(["graph-cycle"]),
    );
  });

  it("accepts free-track references in the reserved namespace", () => {
    const result = validateV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "pointer", observes: [{ source: "~/cursor", role: "input" }] }],
        },
      ],
      freeTracks: [{ id: "cursor" }],
    });
    expect(result.valid).toBe(true);
  });
});
