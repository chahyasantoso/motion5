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

// The 3D Motion alone, on a manual trigger so each case seeks progress directly.
const ik3dPlaygroundProject = {
  schemaVersion: 5,
  projectId: "ik-playground-3d-under-test",
  perspective: IK3D_PERSPECTIVE,
  motions: [{ ...ik3dPlaygroundMotion, trigger: { type: "manual" } }],
} as const;

type Values = Readonly<Record<string, unknown>>;
type Vec3 = readonly [number, number, number];

const PROGRESS = [0, 0.25, 0.5, 0.75, 1] as const;

function registry(): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
  return plugins;
}

function mounted() {
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: registry(),
  }).load(ik3dPlaygroundProject);
  for (const id of IK3D_NODE_IDS) handle.mount(id);
  const read = (progress: number): Readonly<Record<string, Values>> => {
    handle.seek(IK3D_NODE_ID(IK3D.goalTrack), progress);
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
  it("TH-129 reaches every orbit goal with the published hand tip", () => {
    const { handle, read } = mounted();
    try {
      for (const progress of PROGRESS) {
        const values = read(progress);
        const goal = point(values[IK3D_NODE_ID(IK3D.goalTrack)]!);
        const tip = point(values[IK3D_NODE_ID(IK3D.tipTrack)]!);
        expect(length(subtract(tip, goal))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
      }
    } finally {
      handle.dispose();
    }
  });

  it("TH-130 bends the elbow toward the authored 3D pole", () => {
    const { handle, read } = mounted();
    try {
      for (const progress of PROGRESS) expect(poleSide(read(progress))).toBeGreaterThan(0);
    } finally {
      handle.dispose();
    }
  });

  it("TH-131 reproduces forward bytes after a reverse and random seek", () => {
    const { handle, read } = mounted();
    try {
      const forward = PROGRESS.map((progress) => read(progress));
      for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
        expect(read(PROGRESS[index]!)).toEqual(forward[index]);
    } finally {
      handle.dispose();
    }
  });
});
