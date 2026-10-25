import { describe, expect, it, vi } from "vitest";
import type { Patch, ProjectDefinition, ValueSpec } from "../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../src/engine";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { createManualClock } from "../../src/ports/clock";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { createGoalControl } from "../../../../apps/ik-playground/src/goal-control";
import {
  STAGE_2D,
  TENTACLE,
  nodeId,
} from "../../../../apps/ik-playground/src/ik-playground-project";
import { IK3D, IK3D_NODE_ID } from "../../../../apps/ik-playground/src/ik3d-playground-project";

const PLANAR_GOAL: ValueSpec = {
  kind: "record",
  fields: {
    x: { kind: "number" },
    y: { kind: "number" },
    rotation: { kind: "number" },
  },
};

const SOLVER: ValueSpec = {
  kind: "record",
  fields: { flip: { kind: "boolean" } },
};

const SPATIAL_GOAL: ValueSpec = {
  kind: "record",
  fields: {
    x: { kind: "number" },
    y: { kind: "number" },
    z: { kind: "number" },
    rotation: { kind: "number" },
  },
};

function goalProject(): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          {
            id: TENTACLE.goalTrack,
            input: {
              values: { x: TENTACLE.goal.x, y: TENTACLE.goal.y, rotation: 33 },
              schema: PLANAR_GOAL,
            },
          },
          {
            id: TENTACLE.solverTrack,
            input: { values: { flip: false }, schema: SOLVER },
          },
        ],
      },
      {
        id: "rig3d",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "goal",
            input: { values: { x: 205, y: 170, z: 30, rotation: 12 }, schema: SPATIAL_GOAL },
          },
        ],
      },
    ],
  };
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

function loaded(): ProjectHandle {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog(),
  }).load(goalProject());
}

function authored(handle: ProjectHandle, node: string): unknown {
  return handle.track(node).definition.input?.values;
}

describe("a goal move is one value-tier write", () => {
  it("writes planar and spatial goals once each, keeping rotation and other authored fields", () => {
    const handle = loaded();
    try {
      const planarNode = nodeId(TENTACLE.goalTrack);
      const spatialNode = IK3D_NODE_ID(IK3D.goalTrack);
      handle.mount(planarNode);
      handle.mount(spatialNode);

      const patches: Patch[] = [];
      handle.subscribeNode(planarNode, (patch) => patches.push(patch));
      handle.subscribeNode(spatialNode, (patch) => patches.push(patch));
      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      flush.mockClear();
      const goals = createGoalControl(handle);

      goals.move({ rig: "planar", x: 240, y: 250 });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(patches).toHaveLength(1);
      expect(patches[0]?.nodeId).toBe(planarNode);
      expect(authored(handle, planarNode)).toEqual({ x: 240, y: 250, rotation: 33 });

      flush.mockClear();
      patches.length = 0;
      goals.move({ rig: "spatial", x: 190, y: 155, z: 20 });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(patches).toHaveLength(1);
      expect(patches[0]?.nodeId).toBe(spatialNode);
      expect(authored(handle, spatialNode)).toEqual({
        x: 190,
        y: 155,
        z: 20,
        rotation: 12,
      });
    } finally {
      handle.dispose();
    }
  });

  it("keeps clamping, ignores non-finite moves, and still writes a flip once", () => {
    const handle = loaded();
    try {
      const planarNode = nodeId(TENTACLE.goalTrack);
      const spatialNode = IK3D_NODE_ID(IK3D.goalTrack);
      const solverNode = nodeId(TENTACLE.solverTrack);
      for (const node of [planarNode, spatialNode, solverNode]) handle.mount(node);

      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      flush.mockClear();
      const goals = createGoalControl(handle);

      goals.move({ rig: "planar", x: NaN, y: 20 });
      goals.move({ rig: "spatial", x: Infinity, y: 20, z: 0 });
      expect(flush).not.toHaveBeenCalled();

      goals.move({ rig: "planar", x: -100, y: 1000 });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(authored(handle, planarNode)).toEqual({
        x: STAGE_2D.margin,
        y: STAGE_2D.height - STAGE_2D.margin,
        rotation: 33,
      });

      flush.mockClear();
      goals.move({ rig: "spatial", x: -100, y: 1000, z: 1000 });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(authored(handle, spatialNode)).toMatchObject({
        x: expect.closeTo(12, 9),
        y: expect.closeTo(288, 9),
        z: 160,
        rotation: 12,
      });

      flush.mockClear();
      goals.flip(true);
      expect(flush).toHaveBeenCalledTimes(1);
      expect(authored(handle, solverNode)).toEqual({ flip: true });
    } finally {
      handle.dispose();
    }
  });

  it("refuses a goal move when a track authors a table or lacks values", () => {
    const tableProject: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            {
              id: TENTACLE.goalTrack,
              input: { values: [{ id: "r1", cells: { x: 0 } }] },
            },
          ],
        },
      ],
    };
    const tableHandle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: new PluginCatalog(),
    }).load(tableProject);
    try {
      const goals = createGoalControl(tableHandle);
      expect(() => goals.move({ rig: "planar", x: 10, y: 10 })).toThrow(
        new TypeError(`Track "${TENTACLE.goalTrack}" must author its goal as one record.`),
      );
    } finally {
      tableHandle.dispose();
    }

    const missingProject: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [{ id: TENTACLE.goalTrack }],
        },
      ],
    };
    const missingHandle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: new PluginCatalog(),
    }).load(missingProject);
    try {
      const goals = createGoalControl(missingHandle);
      expect(() => goals.move({ rig: "planar", x: 10, y: 10 })).toThrow(
        new TypeError(`Track "${TENTACLE.goalTrack}" must author its goal as one record.`),
      );
    } finally {
      missingHandle.dispose();
    }
  });
});
