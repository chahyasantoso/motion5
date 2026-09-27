import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { FABRIK_TOLERANCE } from "../../src/plugins/fabrik";
import { fk3dPlugin } from "@motion5/core/plugins/fk3d";
import { ik3dPlugin } from "@motion5/core/plugins/ik3d";
import { transform3dPlugin } from "@motion5/core/plugins/transform3d";
import {
  IK3D,
  IK3D_NODE_ID,
  IK3D_NODE_IDS,
  IK3D_PERSPECTIVE,
  ik3dPlaygroundMotion,
} from "../../../../apps/ik-playground/src/ik3d-playground-project";

const ik3dPlaygroundProject = {
  schemaVersion: 5,
  projectId: "ik-playground-3d-under-test",
  perspective: IK3D_PERSPECTIVE,
  motions: [{ ...ik3dPlaygroundMotion, trigger: { type: "manual" } }],
} as const;

type Values = Readonly<Record<string, unknown>>;
type Vec3 = readonly [number, number, number];

function registry(): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
  return plugins;
}

function mounted() {
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins: registry(),
  }).load(ik3dPlaygroundProject);
  for (const id of IK3D_NODE_IDS) handle.mount(id);
  const flush = () => {
    for (let rounds = 0; scheduler.pending.length; rounds++) {
      if (rounds > 20) throw new Error("Scheduler did not settle.");
      scheduler.flush();
    }
  };
  flush();
  const read = (progress: number, goal?: Vec3): Readonly<Record<string, Values>> => {
    if (goal)
      handle.track(IK3D_NODE_ID(IK3D.goalTrack)).setValues({ x: goal[0], y: goal[1], z: goal[2] });
    handle.signal(IK3D_MOTION_ID, { type: "manual", progress });
    flush();
    return Object.fromEntries(
      IK3D_NODE_IDS.map((id) => {
        const patch = handle.get(id);
        if (patch?.status !== "ready") throw new Error(`${id} did not publish a ready patch`);
        return [id, patch.values];
      }),
    );
  };
  return { handle, read };
}

const IK3D_MOTION_ID = "rig3d";

function point(values: Values): Vec3 {
  return [Number(values.x), Number(values.y), Number(values.z)];
}
function subtract(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}
function dot(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}
function length(vector: Vec3): number {
  return Math.hypot(vector[0], vector[1], vector[2]);
}
function perpendicular(vector: Vec3, line: Vec3): Vec3 {
  const amount = dot(vector, line);
  return [vector[0] - line[0] * amount, vector[1] - line[1] * amount, vector[2] - line[2] * amount];
}
function poleSide(values: Readonly<Record<string, Values>>): number {
  const root = point(values[IK3D_NODE_ID(IK3D.rootTrack)]!);
  const goal = point(values[IK3D_NODE_ID(IK3D.goalTrack)]!);
  const pole = point(values[IK3D_NODE_ID(IK3D.poleTrack)]!);
  const elbow = point(values[IK3D_NODE_ID(IK3D.memberTracks[0]!)]!);
  const goalDirection = subtract(goal, root);
  const goalLength = length(goalDirection);
  const line: Vec3 = [
    goalDirection[0] / goalLength,
    goalDirection[1] / goalLength,
    goalDirection[2] / goalLength,
  ];
  return dot(perpendicular(subtract(pole, root), line), perpendicular(subtract(elbow, root), line));
}

describe("3D IK playground project", () => {
  it("TH-129 reaches the authored and dragged goals at weight one", () => {
    const { handle, read } = mounted();
    try {
      for (const goal of [
        [IK3D.goal.x, IK3D.goal.y, IK3D.goal.z],
        [190, 155, 20],
        [170, 130, 0],
        [130, 180, 20],
      ] as const) {
        const values = read(1, goal);
        const target = point(values[IK3D_NODE_ID(IK3D.goalTrack)]!);
        const tip = point(values[IK3D_NODE_ID(IK3D.tipTrack)]!);
        expect(length(subtract(tip, target))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
        expect(values[IK3D_NODE_ID(IK3D.solverTrack)]).toMatchObject({
          inspection: { kind: "converged" },
        });
      }
    } finally {
      handle.dispose();
    }
  });

  it("TH-130 keeps the first joint on the authored pole side for the pole-bent seed", () => {
    const { handle, read } = mounted();
    try {
      const values = read(1);
      expect(poleSide(values)).toBeGreaterThan(0);
      expect(values[IK3D_NODE_ID(IK3D.solverTrack)]).toMatchObject({
        inspection: { kind: "converged", atBound: [] },
      });
    } finally {
      handle.dispose();
    }
  });

  it("TH-131 reproduces forward bytes after forward, reverse, and random weight scrubs", () => {
    const { handle, read } = mounted();
    try {
      const weights = [0, 0.25, 0.5, 0.75, 1] as const;
      const forward = weights.map((weight) => read(weight));
      for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
        expect(read(weights[index]!)).toEqual(forward[index]);
    } finally {
      handle.dispose();
    }
  });
});
