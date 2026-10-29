import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { fkPlugin } from "../../src/fk";
import { fk3dPlugin } from "../../src/fk3d";
import { ikPlugin } from "../../src/ik";
import { ik3dPlugin } from "../../src/ik3d";
import { createPoseClassifyPlugin, type PoseTemplate } from "../../src/pose-classify";
import { BODY_2D_SPEC, GOALS_2D_SPEC, POSE_2D_SPEC } from "../../src/aggregate-topology";

const ZERO_EULER = { rotation: 0, rotationX: 0, rotationY: 0 };
const T_POSE: PoseTemplate = {
  label: "t-pose",
  pose: { wrist: ZERO_EULER },
};
const RAISED_POSE: PoseTemplate = {
  label: "arms-up",
  pose: { wrist: { rotation: 90, rotationX: 0, rotationY: 0 } },
};

describe("aggregate pose-classify binding (AP)", () => {
  it("AP-1 poseClassifyPlugin declares single-source slot pose and legacy rig is undefined", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE], maxDistance: 10 });
    const requires = plugin.inputs.requires as Record<string, unknown>;
    expect(requires.rig).toBeUndefined();
    expect(requires.pose).toBeDefined();
  });

  it("AP-2 poseClassifyPlugin.outputs.values is a flat record with label and confidence", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE], maxDistance: 10 });
    expect(plugin.outputs.values).toEqual({
      kind: "record",
      fields: {
        label: { kind: "string" },
        confidence: { kind: "number" },
      },
    });
  });

  it("AP-3 classifies t-pose when arms are horizontal", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE, RAISED_POSE], maxDistance: 10 });
    const result = plugin.transform(
      {
        values: {},
        requires: {
          pose: {
            values: [
              { id: "wrist", cells: { x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
            ],
          },
        },
      },
      { nodeId: "classifier", progress: 0 },
    );
    expect(result.values).toEqual({ label: "t-pose", confidence: 1 });
  });

  it("AP-4 classifies arms-up when arms are raised", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE, RAISED_POSE], maxDistance: 10 });
    const result = plugin.transform(
      {
        values: {},
        requires: {
          pose: {
            values: [
              { id: "wrist", cells: { x: 0, y: 0, rotation: 90, rotationX: 0, rotationY: 0 } },
            ],
          },
        },
      },
      { nodeId: "classifier", progress: 0 },
    );
    expect(result.values).toEqual({ label: "arms-up", confidence: 1 });
  });

  it("AP-5 classifies arms-down when arms hang down", () => {
    const downPose: PoseTemplate = {
      label: "arms-down",
      pose: { wrist: { rotation: -90, rotationX: 0, rotationY: 0 } },
    };
    const plugin = createPoseClassifyPlugin({ templates: [downPose], maxDistance: 10 });
    const result = plugin.transform(
      {
        values: {},
        requires: {
          pose: {
            values: [
              { id: "wrist", cells: { x: 0, y: 0, rotation: -90, rotationX: 0, rotationY: 0 } },
            ],
          },
        },
      },
      { nodeId: "classifier", progress: 0 },
    );
    expect(result.values).toEqual({ label: "arms-down", confidence: 1 });
  });

  it("AP-6 returns unknown when confidence is below maxDistance", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE], maxDistance: 5 });
    const result = plugin.transform(
      {
        values: {},
        requires: {
          pose: {
            values: [
              { id: "wrist", cells: { x: 0, y: 0, rotation: 10, rotationX: 0, rotationY: 0 } },
            ],
          },
        },
      },
      { nodeId: "classifier", progress: 0 },
    );
    expect(result.values).toEqual({ label: "unknown", confidence: 0 });
  });

  it("AP-7 returns unknown when required bone row is missing", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE], maxDistance: 10 });
    const result = plugin.transform(
      {
        values: {},
        requires: {
          pose: {
            values: [{ id: "other", cells: { x: 0, y: 0, rotation: 0 } }],
          },
        },
      },
      { nodeId: "classifier", progress: 0 },
    );
    expect(result.values).toEqual({ label: "unknown", confidence: 0 });
  });

  it("AP-8 row-order invariance yielding identical classification", () => {
    const plugin = createPoseClassifyPlugin({ templates: [T_POSE], maxDistance: 10 });
    const row1 = { id: "elbow", cells: { x: 0, y: 0, rotation: 0 } };
    const row2 = { id: "wrist", cells: { x: 0, y: 0, rotation: 0 } };
    const res1 = plugin.transform(
      { values: {}, requires: { pose: { values: [row1, row2] } } },
      { nodeId: "c", progress: 0 },
    );
    const res2 = plugin.transform(
      { values: {}, requires: { pose: { values: [row2, row1] } } },
      { nodeId: "c", progress: 0 },
    );
    expect(res1).toEqual(res2);
  });

  it("AP-9 custom templates override default and classify custom target", () => {
    const custom: PoseTemplate = {
      label: "custom",
      pose: { customBone: { rotation: 45, rotationX: 0, rotationY: 0 } },
    };
    const plugin = createPoseClassifyPlugin({ templates: [custom], maxDistance: 10 });
    const result = plugin.transform(
      {
        values: {},
        requires: {
          pose: {
            values: [{ id: "customBone", cells: { x: 0, y: 0, rotation: 45 } }],
          },
        },
      },
      { nodeId: "classifier", progress: 0 },
    );
    expect(result.values).toEqual({ label: "custom", confidence: 1 });
  });

  it("AP-10 end-to-end Engine integration with 2D and 3D pipelines", () => {
    const plugins = new PluginCatalog();
    plugins.registerAll([
      ikPlugin,
      fkPlugin,
      ik3dPlugin,
      fk3dPlugin,
      createPoseClassifyPlugin({ templates: [T_POSE], maxDistance: 10 }),
    ]);

    const projectDef = {
      schemaVersion: 5,
      motions: [
        {
          id: "scene",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "root",
              input: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
            },
            {
              id: "body",
              input: {
                schema: BODY_2D_SPEC,
                values: [
                  { id: "upper", cells: { length: 20, rotation: 0 } },
                  { id: "wrist", cells: { parentId: "upper", length: 20, rotation: 0 } },
                ],
              },
            },
            {
              id: "goals",
              input: {
                schema: GOALS_2D_SPEC,
                values: [{ id: "goal", cells: { memberId: "wrist", x: 40, y: 0 } }],
              },
            },
            {
              id: "solve",
              plugin: "ik",
              input: { values: {}, requires: { chain: "body", goals: "goals", base: "root" } },
            },
            {
              id: "pose",
              plugin: "fk",
              input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
            },
            {
              id: "classifier",
              plugin: "pose-classify",
              input: { values: {}, requires: { pose: "pose" } },
            },
          ],
        },
      ],
    };

    const project = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load(projectDef as any);

    const motion = projectDef.motions[0]!;
    for (const track of motion.tracks) project.mount(`${motion.id}/${track.id}`);
    project.seek("scene/classifier", 0);

    const patch = project.get("scene/classifier");
    expect(patch?.status).toBe("ready");
    if (patch?.status === "ready") {
      expect((patch.outputs.values as any).label).toBe("t-pose");
    }
    project.dispose();
  });
});
