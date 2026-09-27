import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import {
  axisX3,
  matrixFromEuler3d,
  multiplyMatrix3,
  readFrame3d,
  transposeMatrix3,
  type Matrix3,
} from "../../src/plugins/frame3d";
import { fk3dPlugin } from "../../src/plugins/fk3d";
import { ik3dPlugin } from "../../src/plugins/ik3d";
import { transform3dPlugin } from "../../src/plugins/transform3d";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

// 3D goal orientation through Engine (issue #500 phase 7, ADR-124): orientation is applied after
// the position solve without moving a positive-length tip, a zero-length hand can take the whole
// goal frame, and influence weighs a branched position compromise. Every solve is re-derived on a
// seek, including reverse and random scrubs.

type Values = Readonly<Record<string, unknown>>;
type Published = Readonly<Record<string, Values>>;
const PROGRESS = [0, 0.25, 0.5, 0.75, 1] as const;
const TIP_TOLERANCE = 1e-9;

const ramp = (from: number, to: number) => [
  { p: 0, v: from },
  { p: 1, v: to },
];

function member(
  id: string,
  base: string,
  length: number,
  values: Readonly<Record<string, unknown>> = {},
): TrackDefinition {
  return {
    id,
    keyframes: {
      fk3d: { values: { length, ...values }, requires: { base, solver: "solve" } },
    },
  };
}

function registry(): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
  return plugins;
}

function mounted(project: ProjectDefinition, nodes: readonly string[], goals: readonly string[]) {
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: registry(),
  }).load(project);
  const patches = new Map<string, Patch>();
  for (const id of nodes) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => patches.set(id, patch));
  }
  const seek = (progress: number): Published => {
    for (const goal of goals) runtime.seek(goal, progress);
    return Object.fromEntries(
      nodes.map((id) => {
        const patch = patches.get(id);
        if (patch?.status !== "ready") throw new Error(`${id} did not publish a ready patch`);
        return [id, { ...patch.values }];
      }),
    );
  };
  return seek;
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

function goalTrack(
  id: string,
  positionFrom: readonly [number, number, number],
  positionTo: readonly [number, number, number],
  rotationFrom: readonly [number, number, number],
  rotationTo: readonly [number, number, number],
): TrackDefinition {
  return {
    id,
    keyframes: {
      transform3d: {
        values: {
          x: ramp(positionFrom[0], positionTo[0]),
          y: ramp(positionFrom[1], positionTo[1]),
          z: ramp(positionFrom[2], positionTo[2]),
          ...orientationGoal(rotationFrom, rotationTo),
        },
      },
    },
  };
}

function armProject(orient: boolean, zeroHand = false): ProjectDefinition {
  const members = [
    member("upper", "root", 55),
    member("fore", "upper", 45, zeroHand ? {} : orient ? { orient: 1 } : {}),
    ...(zeroHand ? [member("hand", "fore", 0, orient ? { orient: 1 } : {})] : []),
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
            keyframes: {
              transform3d: {
                values: { x: 5, y: -4, z: 7, rotation: 12, rotationX: -8, rotationY: 15 },
              },
            },
          },
          goalTrack("goal", [72, 24, 18], [32, -48, 42], [10, -20, 15], [125, 35, -55]),
          { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
          ...members,
        ],
      },
    ],
  };
}

const ARM_NODES = ["root", "goal", "solve", "upper", "fore"].map((id) => `rig/${id}`);
const HAND_NODES = [...ARM_NODES, "rig/hand"];

function branchProject(influences?: readonly [number, number]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: `3d-influence-${influences?.join("-") ?? "none"}`,
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
          { id: "goal-a", keyframes: { transform3d: { values: { x: 70, y: 60, z: 0 } } } },
          { id: "goal-b", keyframes: { transform3d: { values: { x: 70, y: -60, z: 0 } } } },
          {
            id: "solve",
            keyframes: {
              ik3d: { requires: { root: "root", targets: { a: "goal-a", b: "goal-b" } } },
            },
          },
          member("shared", "root", 50),
          member("a", "shared", 50, influences ? { influence: influences[0] } : {}),
          member("b", "shared", 50, influences ? { influence: influences[1] } : {}),
        ],
      },
    ],
  };
}

const BRANCH_NODES = ["root", "goal-a", "goal-b", "solve", "shared", "a", "b"].map(
  (id) => `rig/${id}`,
);

describe("3D orientation and goal influence through Engine", () => {
  it("TH-105 keeps a positive-length leaf's tip and direction to rounding and its parent byte for byte while orienting, reaches the goal frame for a zero-length hand, and scrubs", () => {
    const plainSeek = mounted(armProject(false), ARM_NODES, ["rig/goal"]);
    const orientedSeek = mounted(armProject(true), ARM_NODES, ["rig/goal"]);
    const forward = PROGRESS.map((progress) => {
      const plain = plainSeek(progress);
      const oriented = orientedSeek(progress);
      const plainTip = tip(plain["rig/fore"]!);
      const orientedTip = tip(oriented["rig/fore"]!);
      // The roll leaves the tip where the position solve put it; only the rounding of a different
      // published triple through `fk3d`'s composition moves its last bits (ADR-124).
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

    const handSeek = mounted(armProject(true, true), HAND_NODES, ["rig/goal"]);
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
    const plainSeek = mounted(branchProject(), BRANCH_NODES, ["rig/goal-a", "rig/goal-b"]);
    const equalSeek = mounted(branchProject([1, 1]), BRANCH_NODES, ["rig/goal-a", "rig/goal-b"]);
    const weightedSeek = mounted(branchProject([4, 1]), BRANCH_NODES, ["rig/goal-a", "rig/goal-b"]);
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
});
