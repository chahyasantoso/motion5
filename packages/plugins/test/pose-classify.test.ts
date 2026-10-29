import { describe, expect, it } from "vitest";
import { createManualClock, Engine, PluginCatalog, type ProjectHandle } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import type { ImmutableRecord } from "@motion5/core/plugin-api";
import { type Euler3d } from "../src/frame3d";
import { onLabelChange } from "../src/labels";
import {
  createPoseClassifyPlugin,
  type PoseClassifyOptions,
  type PoseTemplate,
} from "../src/pose-classify";
import { fk3dPlugin } from "../src/fk3d";
import { BODY_3D_SPEC, ROOT_3D_SPEC, SOLVED_3D_SPEC } from "../src/aggregate-topology";

const ZERO: Euler3d = { rotation: 0, rotationX: 0, rotationY: 0 };
const template = (label = "idle", angles: Euler3d = ZERO): PoseTemplate => ({
  label,
  pose: { wrist: angles },
});

function classify(
  actual: ImmutableRecord,
  templates: readonly PoseTemplate[] = [template()],
  maxDistance = 10,
): Readonly<Record<string, unknown>> {
  const pose = Object.entries(actual).map(([id, frame]) => {
    const f = frame as Readonly<Record<string, number | undefined>>;
    return {
      id,
      cells: {
        x: 0,
        y: 0,
        z: 0,
        rotation: f.rotation ?? 0,
        rotationX: f.rotationX ?? 0,
        rotationY: f.rotationY ?? 0,
      },
    };
  });
  return (
    (createPoseClassifyPlugin({ templates, maxDistance }).transform(
      { values: {}, requires: { pose: { values: pose } } },
      { nodeId: "scene/classifier", progress: 0 },
    ).values as Readonly<Record<string, unknown>>) ?? {}
  );
}

function values(project: ProjectHandle): Readonly<Record<string, unknown>> {
  const patch = project.get("scene/classifier");
  if (patch?.status !== "ready") throw new Error(`Classifier status ${patch?.status}.`);
  return patch.outputs.values as Readonly<Record<string, unknown>>;
}

describe("pose classifier geodesic distance", () => {
  it("G5 matches, refuses far poses and scores missing bones with zero confidence", () => {
    const match = classify({ wrist: ZERO });
    expect(match.label).toBe("idle");
    expect(match.confidence).toBeGreaterThan(0.9);
    expect(classify({ wrist: { ...ZERO, rotation: 120 } })).toEqual({
      label: "unknown",
      confidence: 0,
    });
    expect(classify({})).toEqual({ label: "unknown", confidence: 0 });
    expect(classify({ wrist: {} })).toEqual({ label: "idle", confidence: 1 });
    expect(classify({ wrist: { ...ZERO, rotation: 5 } }).confidence).toBeCloseTo(0.5, 8);
  });

  it("G9 ignores unreferenced bones and never reads inherited names as bones", () => {
    const base = classify({ wrist: { ...ZERO, rotation: 4 } });
    expect(
      classify({ wrist: { ...ZERO, rotation: 4 }, hips: { ...ZERO, rotationX: 170 }, spine: {} }),
    ).toEqual(base);
    const inherited: PoseTemplate = { label: "proto", pose: { toString: ZERO } };
    expect(classify({ wrist: ZERO }, [inherited])).toEqual({ label: "unknown", confidence: 0 });
  });

  it("G8 equivalent Euler triples at gimbal lock match rather than falsely answering unknown", () => {
    const expected = template("raised", { rotation: 30, rotationX: 90, rotationY: 0 });
    const result = classify({ wrist: { rotation: 0, rotationX: 90, rotationY: 30 } }, [expected]);
    expect(result.label).toBe("raised");
    expect(result.confidence).toBeCloseTo(1, 7);
  });

  it("G8b equivalent near-lock poses stay within half a degree", () => {
    const result = classify(
      { wrist: { rotation: 0, rotationX: 90.1, rotationY: 30 } },
      [template("raised", { rotation: 30, rotationX: 89.9, rotationY: 0 })],
      0.5,
    );
    expect(result.label).toBe("raised");
    expect(result.confidence).toBeGreaterThan(0.6);
  });

  it("G8c distinct lock poses remain separated by sixty degrees", () => {
    const result = classify(
      { wrist: { rotation: 0, rotationX: 90, rotationY: -30 } },
      [template("raised", { rotation: 30, rotationX: 90, rotationY: 0 })],
      10,
    );
    expect(result).toEqual({ label: "unknown", confidence: 0 });
  });

  it("averages per-bone geodesic angles, keeps the first tie and wraps full turns", () => {
    const templates = [
      { label: "first", pose: { a: ZERO, b: ZERO } },
      { label: "second", pose: { a: ZERO, b: ZERO } },
    ];
    const result = classify({ a: ZERO, b: { ...ZERO, rotation: 20 } }, templates, 30);
    expect(result.label).toBe("first");
    expect(result.confidence).toBeCloseTo(2 / 3, 8);
    expect(classify({ wrist: { ...ZERO, rotation: 360 } }).label).toBe("idle");
    expect(classify({ a: ZERO }, templates)).toEqual({ label: "unknown", confidence: 0 });
  });

  it("clamps trace rounding, resolves small rotations and ignores position", () => {
    const result = classify({ wrist: { ...ZERO, rotation: 0.001, x: 1e9 } }, [template()], 1);
    expect(result.label).toBe("idle");
    expect(result.confidence).toBeCloseTo(0.999, 7);
    for (const rotation of [0, 1, 30, 90, 179, 180, -180, 1e308]) {
      const result = classify({ wrist: { ...ZERO, rotation } }, [
        template("same", { ...ZERO, rotation }),
      ]);
      expect(result.label).toBe("same");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("copies templates so later caller mutation cannot affect classification", () => {
    const angles = { ...ZERO };
    const pose = { wrist: angles };
    const source = { label: "idle", pose };
    const templates = [source];
    const options = { templates, maxDistance: 10, unknownLabel: "other", name: "tag-pose" };
    const plugin = createPoseClassifyPlugin(options);
    angles.rotation = 180;
    source.label = "changed";
    templates.length = 0;
    options.maxDistance = 180;
    options.unknownLabel = "changed";
    expect(plugin.id).toBe("tag-pose");
    expect(
      plugin.transform(
        {
          values: {},
          requires: { pose: { values: [{ id: "wrist", cells: { ...ZERO, x: 0, y: 0, z: 0 } }] } },
        },
        { nodeId: "tag", progress: 0 },
      ).values,
    ).toEqual({ label: "idle", confidence: 1 });
    expect(
      plugin.transform(
        { values: {}, requires: { pose: { values: [] } } },
        { nodeId: "tag", progress: 0 },
      ).values,
    ).toEqual({
      label: "other",
      confidence: 0,
    });
  });

  it("G6 eagerly refuses each invalid factory input", () => {
    const valid = { templates: [template()], maxDistance: 10 };
    const invalid: unknown[] = [
      null,
      [],
      { ...valid, templates: [] },
      { ...valid, templates: null },
      { ...valid, templates: [null] },
      { ...valid, templates: [template("")] },
      { ...valid, templates: [template("unknown")] },
      { ...valid, templates: [template(), template()] },
      { ...valid, templates: [{ label: "idle", pose: {} }] },
      { ...valid, templates: [{ label: "idle", pose: [] }] },
      { ...valid, templates: [{ label: "idle", pose: { wrist: {} } }] },
      { ...valid, templates: [{ label: "idle", pose: { wrist: null } }] },
      { ...valid, name: "" },
      { ...valid, name: " " },
      { ...valid, name: null },
      { ...valid, name: 1 },
      { ...valid, unknownLabel: "" },
      { ...valid, unknownLabel: null },
      { ...valid, templates: Array(1) },
    ];
    for (const maxDistance of [0, -1, NaN, Infinity, -Infinity, "10", undefined]) {
      invalid.push({ ...valid, maxDistance });
    }
    for (const axis of ["rotation", "rotationX", "rotationY"]) {
      for (const value of [NaN, Infinity, -Infinity, "0", undefined]) {
        invalid.push({
          ...valid,
          templates: [{ label: "idle", pose: { wrist: { ...ZERO, [axis]: value } } }],
        });
      }
    }
    for (const input of invalid) {
      expect(() => createPoseClassifyPlugin(input as PoseClassifyOptions)).toThrow(TypeError);
    }
  });
});

describe("pose classifier graph integration", () => {
  it("G7 downstream label changes follow the pose edge and notify only when the label changes", () => {
    const plugins = new PluginCatalog();
    plugins.registerAll([
      fk3dPlugin,
      createPoseClassifyPlugin({ templates: [template()], maxDistance: 10 }),
    ]);
    const project = new Engine({
      plugins,
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "scene",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "root",
              input: {
                schema: ROOT_3D_SPEC,
                values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 },
              },
            },
            {
              id: "body",
              input: {
                schema: BODY_3D_SPEC,
                values: [
                  {
                    id: "wrist",
                    cells: {
                      x: 0,
                      y: 0,
                      z: 0,
                      rotation: 0,
                      rotationX: 0,
                      rotationY: 0,
                      length: 10,
                      weight: 1,
                    },
                  },
                ],
              },
            },
            {
              id: "solved",
              input: {
                schema: SOLVED_3D_SPEC,
                values: [
                  {
                    id: "wrist",
                    cells: { rotation: 0, rotationX: 0, rotationY: 0 },
                  },
                ],
              },
            },
            {
              id: "pose",
              plugin: "fk3d",
              input: { values: {}, requires: { chain: "body", solved: "solved", base: "root" } },
            },
            {
              id: "classifier",
              plugin: "pose-classify",
              input: { values: {}, requires: { pose: "pose" } },
            },
          ],
        },
      ],
    });
    try {
      project.mount("scene/root");
      project.mount("scene/body");
      project.mount("scene/solved");
      project.mount("scene/pose");
      project.mount("scene/classifier");
      project.seek("scene/classifier", 0);
      expect(values(project).label).toBe("idle");
      const changes: unknown[] = [];
      const dispose = onLabelChange(project, "scene/classifier", "label", (next, previous) =>
        changes.push([next, previous]),
      );
      project
        .track("scene/solved")
        .input.values.set([{ id: "wrist", cells: { rotation: 120, rotationX: 0, rotationY: 0 } }]);
      expect(values(project)).toEqual({ label: "unknown", confidence: 0 });
      project
        .track("scene/solved")
        .input.values.set([{ id: "wrist", cells: { rotation: 0, rotationX: 0, rotationY: 0 } }]);
      expect(changes).toEqual([
        ["unknown", "idle"],
        ["idle", "unknown"],
      ]);
      dispose();
    } finally {
      project.dispose();
    }
  });

  it("an app-owned catalog admits the configured classifier and fk3d without implicit dependencies", () => {
    const definition = createPoseClassifyPlugin({
      name: "tag-pose",
      templates: [template()],
      maxDistance: 10,
    });
    const catalog = new PluginCatalog();
    catalog.registerAll([fk3dPlugin, definition]);
    expect(catalog.get("tag-pose")?.id).toBe("tag-pose");
    expect(catalog.get("fk3d")?.id).toBe("fk3d");
  });
});
