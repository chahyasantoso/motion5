import { describe, expect, it } from "vitest";
import type { Patch, ProjectDefinition } from "@motion5/core";
import { Engine, PluginCatalog, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { FABRIK_TOLERANCE } from "../../src/fabrik";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { readFrame3d } from "../../src/frame3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";

type Values = Readonly<Record<string, unknown>>;

const ramp = (
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  axis: 0 | 1 | 2,
) => [
  { p: 0, v: from[axis] },
  { p: 1, v: to[axis] },
];

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-tree",
  perspective: 800,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "root",
          input: {
            values: { x: 5, y: -3, z: 2, rotation: 20, rotationX: -15, rotationY: 0 },
          },
        },
        {
          id: "chain-body",
          input: {
            values: [
              { id: "c0", cells: { length: 25, rotation: 0, rotationX: 0, rotationY: 0 } },
              {
                id: "c1",
                cells: {
                  parentId: "c0",
                  length: 22,
                  y: 3,
                  rotation: 10,
                  rotationX: 25,
                  rotationY: 0,
                  weight: 1,
                },
              },
              {
                id: "c2",
                cells: { parentId: "c1", length: 20, rotation: 0, rotationX: 0, rotationY: 0 },
              },
              {
                id: "c3",
                cells: { parentId: "c2", length: 18, rotation: 0, rotationX: 0, rotationY: 0 },
              },
            ],
          },
        },
        {
          id: "chain-goals",
          input: {
            values: [
              {
                id: "chain-goal",
                cells: {
                  memberId: "c3",
                  x: ramp([50, 20, 10], [30, -25, 35], 0),
                  y: ramp([50, 20, 10], [30, -25, 35], 1),
                  z: ramp([50, 20, 10], [30, -25, 35], 2),
                },
              },
            ],
          },
        },
        {
          id: "chain-solve",
          plugin: "ik3d",
          input: {
            values: {},
            requires: { chain: "chain-body", goals: "chain-goals", base: "root" },
          },
        },
        {
          id: "chain-pose",
          plugin: "fk3d",
          input: {
            values: {},
            requires: { chain: "chain-body", solved: "chain-solve", base: "root" },
          },
        },
        {
          id: "tree-body",
          input: {
            values: [
              { id: "trunk", cells: { length: 25, rotation: 0, rotationX: 0, rotationY: 0 } },
              {
                id: "left",
                cells: {
                  parentId: "trunk",
                  length: 20,
                  z: 2,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                },
              },
              {
                id: "left-tip",
                cells: { parentId: "left", length: 20, rotation: 0, rotationX: 0, rotationY: 0 },
              },
              {
                id: "right",
                cells: { parentId: "trunk", length: 20, rotation: 0, rotationX: 0, rotationY: 0 },
              },
              {
                id: "right-tip",
                cells: { parentId: "right", length: 20, rotation: 0, rotationX: 0, rotationY: 0 },
              },
            ],
          },
        },
        {
          id: "tree-goals",
          input: {
            values: [
              {
                id: "left-goal",
                cells: {
                  memberId: "left-tip",
                  x: ramp([25, 20, 10], [35, 10, 25], 0),
                  y: ramp([25, 20, 10], [35, 10, 25], 1),
                  z: ramp([25, 20, 10], [35, 10, 25], 2),
                },
              },
              {
                id: "right-goal",
                cells: {
                  memberId: "right-tip",
                  x: ramp([25, -20, -10], [30, -5, -30], 0),
                  y: ramp([25, -20, -10], [30, -5, -30], 1),
                  z: ramp([25, -20, -10], [30, -5, -30], 2),
                },
              },
            ],
          },
        },
        {
          id: "tree-solve",
          plugin: "ik3d",
          input: {
            values: { inspect: true },
            requires: { chain: "tree-body", goals: "tree-goals", base: "root" },
          },
        },
        {
          id: "tree-pose",
          plugin: "fk3d",
          input: {
            values: {},
            requires: { chain: "tree-body", solved: "tree-solve", base: "root" },
          },
        },
      ],
    },
  ],
};

const TRACK_IDS = [
  "rig/root",
  "rig/chain-body",
  "rig/chain-goals",
  "rig/chain-solve",
  "rig/chain-pose",
  "rig/tree-body",
  "rig/tree-goals",
  "rig/tree-solve",
  "rig/tree-pose",
];

const LEAVES = [
  ["rig/c3", "rig/chain-goal"],
  ["rig/left-tip", "rig/left-goal"],
  ["rig/right-tip", "rig/right-goal"],
] as const;

function mountedRig() {
  const plugins = new PluginCatalog();
  plugins.registerAll([fk3dPlugin, ik3dPlugin]);
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  const patches = new Map<string, Patch>();
  for (const id of TRACK_IDS) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => patches.set(id, patch));
  }

  const seek = (progress: number): Readonly<Record<string, Values>> => {
    for (const id of TRACK_IDS) runtime.seek(id, progress);
    const published: Record<string, Values> = {};

    const rootPatch = patches.get("rig/root");
    if (rootPatch?.status === "ready") {
      published["rig/root"] = (rootPatch as any).outputs?.values ?? (rootPatch as any).values;
    }

    const chainGoalPatch = patches.get("rig/chain-goals");
    if (chainGoalPatch?.status === "ready") {
      const rows = (chainGoalPatch as any).outputs?.values ?? (chainGoalPatch as any).values;
      if (Array.isArray(rows)) {
        for (const row of rows) published[`rig/${row.id}`] = row.cells;
      }
    }

    const treeGoalPatch = patches.get("rig/tree-goals");
    if (treeGoalPatch?.status === "ready") {
      const rows = (treeGoalPatch as any).outputs?.values ?? (treeGoalPatch as any).values;
      if (Array.isArray(rows)) {
        for (const row of rows) published[`rig/${row.id}`] = row.cells;
      }
    }

    const chainPosePatch = patches.get("rig/chain-pose");
    if (chainPosePatch?.status === "ready") {
      const rows = (chainPosePatch as any).outputs?.values ?? [];
      for (const row of rows) published[`rig/${row.id}`] = row.cells;
    }

    const treePosePatch = patches.get("rig/tree-pose");
    if (treePosePatch?.status === "ready") {
      const rows = (treePosePatch as any).outputs?.values ?? [];
      for (const row of rows) published[`rig/${row.id}`] = row.cells;
    }

    const chainSolvePatch = patches.get("rig/chain-solve");
    if (chainSolvePatch?.status === "ready") {
      published["rig/chain-solve"] = chainSolvePatch.outputs as Values;
    }

    const treeSolvePatch = patches.get("rig/tree-solve");
    if (treeSolvePatch?.status === "ready") {
      const outputs = treeSolvePatch.outputs as any;
      const inspect = outputs?.inspect;
      const rows = outputs?.values ?? [];
      const residuals: Record<string, number> = {};
      for (const row of rows) {
        if (row.cells?.residual !== undefined) {
          residuals[`rig/${row.id}`] = row.cells.residual;
        }
      }
      published["rig/tree-solve"] = {
        ...outputs,
        inspection: {
          kind: inspect?.kind ?? "converged",
          residuals,
        },
      };
    }

    return published;
  };
  return { seek };
}

function miss(published: Readonly<Record<string, Values>>, leaf: string, goal: string): number {
  const tip = readFrame3d(published[leaf]);
  const aim = readFrame3d(published[goal]);
  return Math.hypot(tip.x - aim.x, tip.y - aim.y, tip.z - aim.z);
}

describe("3D FABRIK Engine tree integration", () => {
  it("TH-70 publishes chain and branch solves through Engine, closes every leaf, and scrubs byte-for-byte", () => {
    const { seek } = mountedRig();
    const forward = [0, 0.25, 0.5, 0.75, 1].map((progress) => {
      const published = seek(progress);
      for (const [leaf, goal] of LEAVES)
        expect(miss(published, leaf, goal)).toBeLessThan(FABRIK_TOLERANCE);
      const inspection = published["rig/tree-solve"]!.inspection as {
        readonly kind: string;
        readonly residuals: Readonly<Record<string, number>>;
      };
      expect(inspection.kind).toBe("converged");
      expect(Object.keys(inspection.residuals)).toEqual(["rig/left-tip", "rig/right-tip"]);
      expect(published["rig/chain-solve"]).not.toHaveProperty("inspection");
      return published;
    });
    expect(forward[4]!["rig/c3"]).not.toEqual(forward[0]!["rig/c3"]);
    expect(forward[4]!["rig/left-tip"]).not.toEqual(forward[0]!["rig/left-tip"]);

    for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
      expect(seek([0, 0.25, 0.5, 0.75, 1][index]!)).toEqual(forward[index]);
  });
});
