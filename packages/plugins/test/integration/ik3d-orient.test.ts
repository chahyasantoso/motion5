import { describe, expect, it } from "vitest";
import type { Patch, ProjectDefinition } from "@motion5/core";
import { Engine, PluginCatalog, createManualClock } from "@motion5/core";
import {
  axisX3,
  matrixFromEuler3d,
  multiplyMatrix3,
  readFrame3d,
  transposeMatrix3,
  type Matrix3,
} from "../../src/frame3d";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";

type Values = Readonly<Record<string, any>>;
type Published = Readonly<Record<string, Values>>;
const PROGRESS = [0, 0.25, 0.5, 0.75, 1] as const;
const TIP_TOLERANCE = 1e-9;

const ramp = (from: number, to: number) => [
  { p: 0, v: from },
  { p: 1, v: to },
];

function registry(): PluginCatalog {
  const plugins = new PluginCatalog();
  plugins.registerAll([fk3dPlugin, ik3dPlugin]);
  return plugins;
}

const ARM_TRACKS = ["rig/root", "rig/body", "rig/goals", "rig/solve", "rig/pose"];
const BRANCH_TRACKS = ["rig/root", "rig/body", "rig/goals", "rig/solve", "rig/pose"];

function mounted(project: ProjectDefinition, tracks: readonly string[]) {
  return mountedHandle(project, tracks).seek;
}

function mountedHandle(project: ProjectDefinition, tracks: readonly string[]) {
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: registry(),
  }).load(project);
  const patches = new Map<string, Patch>();
  for (const id of tracks) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => patches.set(id, patch));
  }
  const seek = (progress: number): Published => {
    for (const id of tracks) runtime.seek(id, progress);
    const published: Record<string, Values> = {};

    const rootPatch = patches.get("rig/root");
    if (rootPatch?.status === "ready") {
      published["rig/root"] = (rootPatch as any).outputs?.values ?? (rootPatch as any).values;
    }

    const goalPatch = patches.get("rig/goals");
    if (goalPatch?.status === "ready") {
      const rows = (goalPatch as any).outputs?.values ?? (goalPatch as any).values;
      if (Array.isArray(rows)) {
        for (const row of rows) published[`rig/${row.id}`] = row.cells;
      }
    }

    const posePatch = patches.get("rig/pose");
    if (posePatch?.status === "ready") {
      const rows = (posePatch as any).outputs?.values ?? [];
      for (const row of rows) published[`rig/${row.id}`] = row.cells;
    }

    const solvePatch = patches.get("rig/solve");
    if (solvePatch?.status === "ready") {
      published["rig/solve"] = solvePatch.outputs as Values;
    }

    return published;
  };
  return { runtime, seek };
}

function orientation(values: Values): Matrix3 {
  return matrixFromEuler3d(readFrame3d(values));
}

function tip(values: Values): readonly [number, number, number] {
  const frame = readFrame3d(values);
  return [frame.x, frame.y, frame.z];
}

function distance(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function matrixDistance(a: Matrix3, b: Matrix3): number {
  return Math.max(...a.map((value, index) => Math.abs(value - b[index]!)));
}

function angleBetween(actual: Matrix3, goal: Matrix3): number {
  const relative = multiplyMatrix3(transposeMatrix3(goal), actual);
  const cosine = Math.max(-1, Math.min(1, (relative[0] + relative[4] + relative[8] - 1) / 2));
  return Math.acos(cosine);
}

function orientationGoal(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
) {
  return {
    rotation: ramp(from[0], to[0]),
    rotationX: ramp(from[1], to[1]),
    rotationY: ramp(from[2], to[2]),
  };
}

/** `orient` is the leaf's authored weight, `true` for 1 and `false` for none authored. */
function armProject(orient: boolean | number, zeroHand = false): ProjectDefinition {
  const weight = orient === true ? 1 : orient === false ? 0 : orient;
  const upperCells: Record<string, any> = {
    length: 55,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
  };
  const foreCells: Record<string, unknown> = {
    parentId: "upper",
    length: 45,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    ...(!zeroHand ? { orient: weight } : {}),
  };
  const handCells: Record<string, unknown> = {
    parentId: "fore",
    length: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    ...(zeroHand ? { orient: weight } : {}),
  };

  const bodyRows = [
    { id: "upper", cells: upperCells },
    { id: "fore", cells: foreCells },
    ...(zeroHand ? [{ id: "hand", cells: handCells }] : []),
  ];

  return {
    schemaVersion: 5,
    projectId: zeroHand ? `3d-orient-hand-${orient}` : `3d-orient-${orient}`,
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "root",
            input: {
              values: { x: 5, y: -4, z: 7, rotation: 12, rotationX: -8, rotationY: 15 },
            },
          },
          {
            id: "goals",
            input: {
              values: [
                {
                  id: "goal",
                  cells: {
                    memberId: zeroHand ? "hand" : "fore",
                    x: ramp(72, 32),
                    y: ramp(24, -48),
                    z: ramp(18, 42),
                    ...orientationGoal([10, -20, 15], [125, 35, -55]),
                  },
                },
              ],
            },
          },
          {
            id: "body",
            input: { values: bodyRows },
          },
          {
            id: "solve",
            plugin: "ik3d",
            input: {
              values: {},
              requires: { chain: "body", goals: "goals", base: "root" },
            },
          },
          {
            id: "pose",
            plugin: "fk3d",
            input: {
              values: {},
              requires: { chain: "body", solved: "solve", base: "root" },
            },
          },
        ],
      },
    ],
  };
}

function branchProject(influences?: readonly [number, number]): ProjectDefinition {
  const infA = influences?.[0];
  const infB = influences?.[1];
  return {
    schemaVersion: 5,
    projectId: `3d-influence-${influences?.join("-") ?? "none"}`,
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "root",
            input: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
          },
          {
            id: "goals",
            input: {
              values: [
                {
                  id: "goal-a",
                  cells: {
                    memberId: "a",
                    x: 70,
                    y: 60,
                    z: 0,
                    ...(infA !== undefined && infA !== 1 ? { influence: infA } : {}),
                  },
                },
                {
                  id: "goal-b",
                  cells: {
                    memberId: "b",
                    x: 70,
                    y: -60,
                    z: 0,
                    ...(infB !== undefined && infB !== 1 ? { influence: infB } : {}),
                  },
                },
              ],
            },
          },
          {
            id: "body",
            input: {
              values: [
                { id: "shared", cells: { length: 50, rotation: 0, rotationX: 0, rotationY: 0 } },
                {
                  id: "a",
                  cells: {
                    parentId: "shared",
                    length: 50,
                    rotation: 0,
                    rotationX: 0,
                    rotationY: 0,
                  },
                },
                {
                  id: "b",
                  cells: {
                    parentId: "shared",
                    length: 50,
                    rotation: 0,
                    rotationX: 0,
                    rotationY: 0,
                  },
                },
              ],
            },
          },
          {
            id: "solve",
            plugin: "ik3d",
            input: {
              values: {},
              requires: { chain: "body", goals: "goals", base: "root" },
            },
          },
          {
            id: "pose",
            plugin: "fk3d",
            input: {
              values: {},
              requires: { chain: "body", solved: "solve", base: "root" },
            },
          },
        ],
      },
    ],
  };
}

describe("3D orientation and goal influence through Engine", () => {
  it("TH-105 keeps a positive-length leaf's tip and direction to rounding and its parent byte for byte while orienting, reaches the goal frame for a zero-length hand, and scrubs", () => {
    const plainSeek = mounted(armProject(false), ARM_TRACKS);
    const orientedSeek = mounted(armProject(true), ARM_TRACKS);
    const forward = PROGRESS.map((progress) => {
      const plain = plainSeek(progress);
      const oriented = orientedSeek(progress);
      const plainTip = tip(plain["rig/fore"]!);
      const orientedTip = tip(oriented["rig/fore"]!);
      expect(distance(orientedTip, plainTip)).toBeLessThanOrEqual(TIP_TOLERANCE);
      expect(oriented["rig/upper"]).toEqual(plain["rig/upper"]);
      const plainDirection = axisX3(orientation(plain["rig/fore"]!));
      const orientedDirection = axisX3(orientation(oriented["rig/fore"]!));
      for (let index = 0; index < 3; index += 1)
        expect(Math.abs(orientedDirection[index]! - plainDirection[index]!)).toBeLessThanOrEqual(
          TIP_TOLERANCE,
        );
      const goalOrientation = orientation(plain["rig/goal"]!);
      expect(angleBetween(orientation(oriented["rig/fore"]!), goalOrientation)).toBeLessThanOrEqual(
        angleBetween(orientation(plain["rig/fore"]!), goalOrientation) + TIP_TOLERANCE,
      );
      return oriented;
    });
    expect(forward[4]!["rig/fore"]).not.toEqual(forward[0]!["rig/fore"]);
    for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
      expect(orientedSeek(PROGRESS[index]!)).toEqual(forward[index]);

    const handSeek = mounted(armProject(true, true), ARM_TRACKS);
    const handForward = PROGRESS.map((progress) => {
      const published = handSeek(progress);
      expect(
        matrixDistance(orientation(published["rig/hand"]!), orientation(published["rig/goal"]!)),
      ).toBeLessThanOrEqual(TIP_TOLERANCE);
      return published;
    });
    for (const index of [4, 1, 3, 0, 2, 4, 0])
      expect(handSeek(PROGRESS[index]!)).toEqual(handForward[index]);
  });

  it("TH-106 weighs a branched 3D compromise through Engine, and influence 1 is default-identical", () => {
    const plainSeek = mounted(branchProject(), BRANCH_TRACKS);
    const equalSeek = mounted(branchProject([1, 1]), BRANCH_TRACKS);
    const weightedSeek = mounted(branchProject([4, 1]), BRANCH_TRACKS);
    const plain = plainSeek(0.5);
    const equal = equalSeek(0.5);
    const weighted = weightedSeek(0.5);
    expect(equal).toEqual(plain);

    const goalA = tip(plain["rig/goal-a"]!);
    const goalB = tip(plain["rig/goal-b"]!);
    const plainA = distance(tip(plain["rig/a"]!), goalA);
    const plainB = distance(tip(plain["rig/b"]!), goalB);
    const weightedA = distance(tip(weighted["rig/a"]!), goalA);
    const weightedB = distance(tip(weighted["rig/b"]!), goalB);
    expect(weightedA).toBeLessThan(plainA);
    expect(weightedB).toBeGreaterThan(plainB);
  });

  it("TH-109 a live orient write turns the leaf exactly as the authored one does, a write back to 0 restores the solve, and an out-of-domain write reads as no orientation", () => {
    const authored = mounted(armProject(true), ARM_TRACKS);
    const plain = mounted(armProject(false), ARM_TRACKS);
    const live = mountedHandle(armProject(0), ARM_TRACKS);
    const bodyTrack = live.runtime.track("rig/body");
    for (const progress of PROGRESS) {
      bodyTrack.writeValues([
        { id: "upper", cells: { length: 55, rotation: 0, rotationX: 0, rotationY: 0 } },
        {
          id: "fore",
          cells: {
            parentId: "upper",
            length: 45,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            orient: 1,
          },
        },
      ]);
      for (const t of ARM_TRACKS) live.runtime.seek(t, progress);
      expect(live.seek(progress)).toEqual(authored(progress));

      bodyTrack.writeValues([
        { id: "upper", cells: { length: 55, rotation: 0, rotationX: 0, rotationY: 0 } },
        {
          id: "fore",
          cells: {
            parentId: "upper",
            length: 45,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            orient: 0,
          },
        },
      ]);
      for (const t of ARM_TRACKS) live.runtime.seek(t, progress);
      expect(live.seek(progress)).toEqual(plain(progress));

      const batch = bodyTrack.writeValues([
        { id: "upper", cells: { length: 55, rotation: 0, rotationX: 0, rotationY: 0 } },
        {
          id: "fore",
          cells: {
            parentId: "upper",
            length: 45,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            orient: 2,
          },
        },
      ]);
      expect(
        batch.diagnostics.some(
          (d) =>
            d.ruleId === "plugin-input-invalid" &&
            d.message.includes("expected at most 1, received 2"),
        ),
      ).toBe(true);
    }
    live.runtime.dispose();
  });
});
