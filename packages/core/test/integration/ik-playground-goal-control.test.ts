import { describe, expect, it, vi } from "vitest";
import type { Patch, ProjectDefinition } from "../../src/contract/v5";
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

const PLANAR_GOALS = [
  { id: "main", cells: { memberId: TENTACLE.tipTrack, x: 180, y: 290, influence: 0.75 } },
  { id: "spare", cells: { memberId: "seg-5", x: 11, y: 22, influence: 0.5 } },
];

const SPATIAL_GOALS = [
  { id: "main", cells: { memberId: IK3D.tipTrack, x: 205, y: 170, z: 30, influence: 0.9 } },
  { id: "spare", cells: { memberId: "wrist", x: 1, y: 2, z: 3, influence: 0.25 } },
];

function goalProject(): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          { id: TENTACLE.goalsTrack, input: { values: PLANAR_GOALS } },
          {
            id: TENTACLE.solverTrack,
            input: { values: { flip: false, inspect: true } },
          },
        ],
      },
      {
        id: "rig3d",
        trigger: { type: "manual" },
        tracks: [
          { id: IK3D.goalsTrack, input: { values: SPATIAL_GOALS } },
          { id: IK3D.solverTrack, input: { values: { inspect: true } } },
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

describe("a goal move is one whole-table value write", () => {
  it("rewrites only the addressed row, preserving order, other rows and other cells", () => {
    const handle = loaded();
    try {
      const planarNode = nodeId(TENTACLE.goalsTrack);
      const spatialNode = IK3D_NODE_ID(IK3D.goalsTrack);
      handle.mount(planarNode);
      handle.mount(spatialNode);

      const patches: Patch[] = [];
      handle.subscribeNode(planarNode, (patch) => patches.push(patch));
      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      flush.mockClear();
      const goals = createGoalControl(handle);

      goals.move({ rig: "planar", x: 240, y: 250 });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(patches).toHaveLength(1);
      expect(patches[0]?.nodeId).toBe(planarNode);
      expect(authored(handle, planarNode)).toEqual([
        { id: "main", cells: { memberId: TENTACLE.tipTrack, x: 240, y: 250, influence: 0.75 } },
        { id: "spare", cells: { memberId: "seg-5", x: 11, y: 22, influence: 0.5 } },
      ]);

      flush.mockClear();
      patches.length = 0;
      goals.move({ rig: "spatial", x: 190, y: 155, z: 20 });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(authored(handle, spatialNode)).toEqual([
        {
          id: "main",
          cells: { memberId: IK3D.tipTrack, x: 190, y: 155, z: 20, influence: 0.9 },
        },
        { id: "spare", cells: { memberId: "wrist", x: 1, y: 2, z: 3, influence: 0.25 } },
      ]);
    } finally {
      handle.dispose();
    }
  });

  it("reads the latest authored table for each edit, so consecutive edits both survive", () => {
    const handle = loaded();
    try {
      const planarNode = nodeId(TENTACLE.goalsTrack);
      const spatialNode = IK3D_NODE_ID(IK3D.goalsTrack);
      handle.mount(planarNode);
      handle.mount(spatialNode);
      const goals = createGoalControl(handle);

      goals.move({ rig: "planar", x: 100, y: 120 });
      goals.move({ rig: "spatial", x: 140, y: 150, z: 10 });
      goals.move({ rig: "planar", x: 130, y: 160 });

      expect(authored(handle, planarNode)).toEqual([
        { id: "main", cells: { memberId: TENTACLE.tipTrack, x: 130, y: 160, influence: 0.75 } },
        { id: "spare", cells: { memberId: "seg-5", x: 11, y: 22, influence: 0.5 } },
      ]);
      expect(authored(handle, spatialNode)).toEqual([
        {
          id: "main",
          cells: { memberId: IK3D.tipTrack, x: 140, y: 150, z: 10, influence: 0.9 },
        },
        { id: "spare", cells: { memberId: "wrist", x: 1, y: 2, z: 3, influence: 0.25 } },
      ]);
    } finally {
      handle.dispose();
    }
  });

  it("keeps clamping, ignores non-finite moves, and still writes a flip once", () => {
    const handle = loaded();
    try {
      const planarNode = nodeId(TENTACLE.goalsTrack);
      const spatialNode = IK3D_NODE_ID(IK3D.goalsTrack);
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
      const planar = authored(handle, planarNode) as readonly {
        readonly id: string;
        readonly cells: Readonly<Record<string, unknown>>;
      }[];
      expect(planar[0]?.cells).toEqual({
        memberId: TENTACLE.tipTrack,
        x: STAGE_2D.margin,
        y: STAGE_2D.height - STAGE_2D.margin,
        influence: 0.75,
      });

      flush.mockClear();
      goals.move({ rig: "spatial", x: -100, y: 1000, z: 1000 });
      expect(flush).toHaveBeenCalledTimes(1);
      const spatial = authored(handle, spatialNode) as readonly {
        readonly id: string;
        readonly cells: Readonly<Record<string, unknown>>;
      }[];
      expect(spatial[0]?.cells).toMatchObject({
        x: expect.closeTo(12, 9),
        y: expect.closeTo(288, 9),
        z: 160,
        influence: 0.9,
      });

      flush.mockClear();
      goals.flip(true);
      expect(flush).toHaveBeenCalledTimes(1);
      expect(authored(handle, solverNode)).toEqual({ flip: true, inspect: true });
    } finally {
      handle.dispose();
    }
  });

  it("refuses a record goal table, a missing target and duplicate goal member ids", () => {
    const cases: readonly ProjectDefinition[] = [
      {
        schemaVersion: 5,
        motions: [
          {
            id: "rig",
            trigger: { type: "manual" },
            tracks: [
              {
                id: TENTACLE.goalsTrack,
                input: { values: { x: 0, y: 0 } },
              },
            ],
          },
        ],
      },
      {
        schemaVersion: 5,
        motions: [
          {
            id: "rig",
            trigger: { type: "manual" },
            tracks: [
              {
                id: TENTACLE.goalsTrack,
                input: { values: [{ id: "other", cells: { memberId: "seg-5", x: 1, y: 2 } }] },
              },
            ],
          },
        ],
      },
      {
        schemaVersion: 5,
        motions: [
          {
            id: "rig",
            trigger: { type: "manual" },
            tracks: [
              {
                id: TENTACLE.goalsTrack,
                input: {
                  values: [
                    { id: "a", cells: { memberId: TENTACLE.tipTrack, x: 1, y: 2 } },
                    { id: "b", cells: { memberId: TENTACLE.tipTrack, x: 3, y: 4 } },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        schemaVersion: 5,
        motions: [
          {
            id: "rig",
            trigger: { type: "manual" },
            tracks: [
              {
                id: TENTACLE.goalsTrack,
                input: {
                  values: [
                    { id: "a", cells: { memberId: TENTACLE.tipTrack, x: 1, y: 2 } },
                    { id: "b", cells: { memberId: "seg-5", x: 3, y: 4 } },
                    { id: "c", cells: { memberId: "seg-5", x: 5, y: 6 } },
                  ],
                },
              },
            ],
          },
        ],
      },
    ];
    for (const project of cases) {
      const handle = new Engine({
        clock: createManualClock(),
        interpolator: createFakeInterpolator(),
        scheduler: createFakeScheduler(),
        plugins: new PluginCatalog(),
      }).load(project);
      try {
        const goals = createGoalControl(handle);
        expect(() => goals.move({ rig: "planar", x: 10, y: 10 })).toThrow(TypeError);
      } finally {
        handle.dispose();
      }
    }
  });
});
