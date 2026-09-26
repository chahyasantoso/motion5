import { describe, expect, it } from "vitest";

import { validateSchemaV5 } from "../../src/contract/validate-v5";
import { buildGraphIR } from "../../src/graph/ir";

const baseProject = () => ({ schemaVersion: 5, motions: [], freeTracks: [] });

function projectWithKeyframes(keyframes: unknown) {
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm", keyframes }] }],
  };
}

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}

describe("schema v5 validator", () => {
  it("accepts the minimal v5 project", () => {
    const result = validateSchemaV5(baseProject());
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toEqual([]);
  });

  it("rejects malformed, non-finite, out-of-range, non-monotonic, and duplicate stops", () => {
    const result = validateSchemaV5(
      projectWithKeyframes({
        style: {
          values: {
            malformed: [
              { p: 0, v: 0 },
              { p: 0.5, v: 1 },
            ],
            nan: [{ p: Number.NaN, v: 0 }],
            range: [{ p: 1.5, v: 0 }],
            order: [
              { p: 0.8, v: 0 },
              { p: 0.2, v: 1 },
            ],
            duplicate: [
              { p: 0.2, v: 0 },
              { p: 0.2, v: 1 },
            ],
          },
        },
      }),
    );
    expect(result.kind).toBe("refused");
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
    const result = validateSchemaV5(
      projectWithKeyframes({ style: { values: { opacity: [{ p: 0.25, v: 0.5 }] } } }),
    );
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "stop-missing-start", severity: "warning" }),
        expect.objectContaining({ ruleId: "stop-missing-end", severity: "warning" }),
      ]),
    );
  });

  it("rejects v4 and reports the schema path", () => {
    const result = validateSchemaV5({ schemaVersion: 4, motions: [] });
    expect(result.kind).toBe("refused");
    expect(result.diagnostics[0]).toMatchObject({
      ruleId: "schema-version",
      path: "schemaVersion",
      severity: "error",
    });
  });

  it("accepts perspective for 3D content and rejects invalid perspective", () => {
    const good = validateSchemaV5({
      schemaVersion: 5,
      perspective: 800,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "tilt", keyframes: { transform3d: { values: { rotationY: {} } } } }],
        },
      ],
    });
    const bad = validateSchemaV5({ schemaVersion: 5, perspective: 0, motions: [] });
    expect(good.kind).toBe("accepted");
    expect(bad.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-shape", severity: "error" }),
    );
  });

  it("warns, but does not reject, 3D content without perspective", () => {
    const result = validateSchemaV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "tilt", keyframes: { transform3d: { values: { rotationY: {} } } } }],
        },
      ],
    });
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("F-1 accepts only plugin-named keyframe groups", () => {
    const grouped = projectWithKeyframes({
      style: { values: { opacity: ramp(0, 1) } },
      fk: { values: { boneLength: ramp(10, 20) } },
    });
    const result = validateSchemaV5(grouped);
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toEqual([]);
  });

  it("F-2 keeps the perspective warning for 3D content authored inside a group", () => {
    const grouped = projectWithKeyframes({ transform: { values: { rotationY: ramp(0, 1) } } });
    const result = validateSchemaV5(grouped);
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("F-3 rejects a colon in top-level group and leaf keyframe names", () => {
    const project = projectWithKeyframes({
      "fk:length": { values: { length: ramp(0, 1) } },
      fk: { values: { "length:ratio": ramp(0, 1) } },
      "trans:form": { values: { rotation: ramp(0, 1) } },
    });
    const result = validateSchemaV5(project);
    const reserved = result.diagnostics.filter(
      ({ ruleId }) => ruleId === "keyframes-reserved-separator",
    );
    expect(result.kind).toBe("refused");
    expect(reserved.map(({ path }) => path)).toEqual([
      "motions[0].tracks[0].keyframes.fk:length",
      "motions[0].tracks[0].keyframes.fk.values.length:ratio",
      "motions[0].tracks[0].keyframes.trans:form",
    ]);
  });

  it("F-4 reports a grouped leaf stop error at the authored path", () => {
    const leaf = { lenght: [{ p: 2, v: 1 }] };
    const result = validateSchemaV5(projectWithKeyframes({ fk: { values: leaf } }));
    expect(result.kind).toBe("refused");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "stop-position-range",
        path: "motions[0].tracks[0].keyframes.fk.values.lenght[0].p",
      }),
    );
  });

  it("F-5 rejects one compiled key authored under two spellings", () => {
    const authored = {
      style: { values: { x: ramp(0, 1) } },
      transform: { values: { x: ramp(0, 2) } },
    };
    const result = validateSchemaV5(projectWithKeyframes(authored));
    expect(result.kind).toBe("refused");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "keyframes-duplicate-key",
        path: "motions[0].tracks[0].keyframes.transform.values.x",
      }),
    );
  });

  it("F-13 refuses every ungrouped keyframe form", () => {
    const result = validateSchemaV5(
      projectWithKeyframes({
        staticValue: 1,
        arrayValue: ramp(0, 1),
        retiredWrapper: { stops: ramp(0, 1) },
        emptyObject: {},
        unrelatedObject: { foo: { bar: 1 } },
        nullValue: null,
      }),
    );
    expect(result.kind).toBe("refused");
    // Exact, not `arrayContaining`: each ungrouped entry is one diagnostic and nothing else, so a
    // second rule answering the same entry, or a form slipping to another rule, fails here.
    expect(result.diagnostics.map(({ ruleId, path }) => [ruleId, path])).toEqual(
      [
        "staticValue",
        "arrayValue",
        "retiredWrapper",
        "emptyObject",
        "unrelatedObject",
        "nullValue",
      ].map((key) => ["keyframes-ungrouped-key", `motions[0].tracks[0].keyframes.${key}`]),
    );
  });

  it("F-14 keeps the pre-ADR-049 missing-values diagnostic", () => {
    const result = validateSchemaV5(projectWithKeyframes({ fk: { length: 62 } }));
    expect(result.kind).toBe("refused");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "keyframes-missing-values-section",
        path: "motions[0].tracks[0].keyframes.fk",
      }),
    );
  });

  it("rejects duplicate ids, invalid triggers, and malformed freeTracks", () => {
    const result = validateSchemaV5({
      schemaVersion: 5,
      freeTracks: {},
      motions: [{ id: "hero", trigger: { type: "unknown" }, tracks: [{ id: "x" }, { id: "x" }] }],
    });
    expect(result.kind).toBe("refused");
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining(["free-tracks-shape", "trigger-shape", "track-duplicate-id"]),
    );
  });

  it("rejects unknown sources, self references, and cycles", () => {
    const result = validateSchemaV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            { id: "a", observes: [{ source: "b" }] },
            { id: "b", observes: [{ source: "a" }] },
          ],
        },
      ],
    });
    expect(result.kind).toBe("accepted");
    if (result.kind !== "accepted") throw new Error("Expected schema validation to pass.");
    const graph = buildGraphIR(result.value);
    expect(graph.graph).toBeUndefined();
    expect(graph.diagnostics.map(({ ruleId }) => ruleId)).toEqual(
      expect.arrayContaining(["graph-cycle"]),
    );
  });

  it("accepts free-track references in the reserved namespace", () => {
    const result = validateSchemaV5({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "pointer", observes: [{ source: "~/cursor" }] }],
        },
      ],
      freeTracks: [{ id: "cursor" }],
    });
    expect(result.kind).toBe("accepted");
  });
});
