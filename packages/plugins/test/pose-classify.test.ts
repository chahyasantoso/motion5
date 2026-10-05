import { describe, expect, it } from "vitest";
import {
  createManualClock,
  Engine,
  PluginRegistry,
  type PluginDefinition,
  type ProjectHandle,
} from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import type { ImmutableRecord } from "@motion5/core/plugin-api";
import { builtinCatalog } from "../src/catalog";
import { type Euler3d } from "../src/frame3d";
import { onLabelChange } from "../src/labels";
import { createPluginLoader } from "../src/loader";
import {
  createPoseClassifyPlugin,
  type PoseClassifyOptions,
  type PoseTemplate,
} from "../src/pose-classify";
import { rigPlugin } from "../src/rig";
import { transform3dPlugin } from "../src/transform3d";

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
  return createPoseClassifyPlugin({ templates, maxDistance }).compose(
    {},
    0,
    { rig: { pose: actual } },
    "scene/classifier",
  );
}

function values(project: ProjectHandle): Readonly<Record<string, unknown>> {
  const patch = project.get("scene/classifier");
  if (patch?.status !== "ready") throw new Error(`Classifier status ${patch?.status}.`);
  return patch.values;
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
    expect(plugin.name).toBe("tag-pose");
    expect(plugin.compose({}, 0, { rig: { pose: { wrist: ZERO } } }, "tag")).toEqual({
      label: "idle",
      confidence: 1,
    });
    expect(plugin.compose({}, 0, {}, "tag")).toEqual({ label: "other", confidence: 0 });
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
  it("G7 downstream label changes follow the rig edge and notify only when the label changes", () => {
    const plugins = new PluginRegistry();
    plugins.registerAll([
      transform3dPlugin,
      rigPlugin,
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
              id: "bone",
              keyframes: {
                transform3d: {
                  values: {
                    rotation: [
                      { p: 0, v: 0 },
                      { p: 1, v: 120 },
                    ],
                  },
                },
              },
            },
            { id: "rig", keyframes: { rig: { requires: { bones: { wrist: "bone" } } } } },
            { id: "classifier", keyframes: { "pose-classify": { requires: { rig: "rig" } } } },
          ],
        },
      ],
    });
    try {
      project.mount("scene/classifier");
      project.seek("scene/bone", 0);
      expect(values(project).label).toBe("idle");
      const changes: unknown[] = [];
      const dispose = onLabelChange(project, "scene/classifier", "label", (next, previous) =>
        changes.push([next, previous]),
      );
      project.seek("scene/bone", 1);
      expect(values(project)).toEqual({ label: "unknown", confidence: 0 });
      project.seek("scene/bone", 0.9);
      project.seek("scene/bone", 0);
      expect(changes).toEqual([
        ["unknown", "idle"],
        ["idle", "unknown"],
      ]);
      dispose();
      expect(plugins.capabilityOf("rig")?.chain).toEqual({ kind: "any" });
      expect(plugins.capabilityOf("pose-classify")?.joint).toBe(false);
    } finally {
      project.dispose();
    }
  });

  it("an app-owned descriptor loads the configured classifier and rig without implicit dependencies", async () => {
    const definition = createPoseClassifyPlugin({
      name: "tag-pose",
      templates: [template()],
      maxDistance: 10,
    });
    expect(builtinCatalog.has("pose-classify")).toBe(false);
    const descriptor = { load: async (): Promise<PluginDefinition> => definition };
    const loader = createPluginLoader(new Map([...builtinCatalog, ["tag-pose", descriptor]]));
    const registry = new PluginRegistry();
    const result = await loader.ensure(registry, {
      kind: "tracks",
      tracks: [
        { id: "bone", keyframes: { transform3d: { values: { x: 0 } } } },
        { id: "rig", keyframes: { rig: { requires: { bones: { wrist: "bone" } } } } },
        { id: "classifier", keyframes: { "tag-pose": { requires: { rig: "rig" } } } },
      ],
    });
    expect(result).toEqual({ kind: "ensured", added: ["transform3d", "rig", "tag-pose"] });
    expect("dependencies" in descriptor).toBe(false);
  });
});
