import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "@motion5/core";
import { PluginCatalog } from "@motion5/core";
import { Engine } from "@motion5/core";
import { createManualClock } from "@motion5/core";
import type { Patch } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { FABRIK_TOLERANCE } from "../../src/fabrik";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { BODY_3D_SPEC, GOALS_3D_SPEC, ROOT_3D_SPEC } from "../../src/aggregate-topology";
import {
  matrixFromEuler3d,
  multiplyMatrix3,
  readFrame3d,
  rotationAboutAxis3d,
  swingTwist3d,
  transposeMatrix3,
  twistAbout3d,
  type Matrix3,
  type Vec3,
} from "../../src/frame3d";

type Values = Readonly<Record<string, unknown>>;

const TOLERANCE = 1e-7;
const MAX_SWING = 40;
const ELBOW = { min: -90, max: 0 } as const;
const HINGE_AXIS: Vec3 = [0, 0, 1];
const PROGRESS = [0, 0.25, 0.5, 0.75, 1] as const;

const ramp = (from: number, to: number) => [
  { p: 0, v: from },
  { p: 1, v: to },
];

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-joint",
  perspective: 800,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "root",
          input: {
            schema: ROOT_3D_SPEC,
            values: { x: 4, y: -2, z: 1, rotation: 15, rotationX: 0, rotationY: 0 },
          },
        },
        {
          id: "body",
          input: {
            schema: BODY_3D_SPEC,
            values: [
              {
                id: "upper",
                cells: {
                  length: 30,
                  joint: "cone",
                  maxSwing: MAX_SWING,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                },
              },
              {
                id: "lower",
                cells: {
                  parentId: "upper",
                  length: 30,
                  joint: "hinge",
                  minRotation: ELBOW.min,
                  maxRotation: ELBOW.max,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                },
              },
            ],
          },
        },
        {
          id: "goal",
          input: {
            schema: GOALS_3D_SPEC,
            values: [
              {
                id: "g",
                cells: {
                  memberId: "lower",
                  x: ramp(58.8, -40),
                  y: ramp(2.8, -30),
                  z: ramp(1, 20),
                },
              },
            ],
          },
        },
        {
          id: "solve",
          plugin: "ik3d",
          input: {
            values: { inspect: true },
            requires: { chain: "body", goals: "goal", base: "root" },
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

const NODES = ["root", "goal", "solve", "body", "pose"].map((id) => `rig/${id}`);

function mounted() {
  const plugins = new PluginCatalog();
  plugins.registerAll([fk3dPlugin, ik3dPlugin]);
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  const patches = new Map<string, Patch>();
  for (const id of NODES) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => patches.set(id, patch));
  }
  return (progress: number): Readonly<Record<string, Values>> => {
    runtime.seek("rig/goal", progress);
    const result: Record<string, Values> = {};
    for (const id of NODES) {
      const patch = patches.get(id);
      if (patch?.status !== "ready") throw new Error(`${id} did not publish a ready patch`);
      result[id] = { ...patch.outputs };
    }
    return result;
  };
}

function boneFrame(publishedOutputs: Values | undefined, boneId: string): Values {
  const values = (publishedOutputs?.values as readonly { id: string; cells: Values }[]) ?? [];
  const row = values.find((r) => r.id === boneId);
  expect(row, `bone ${boneId} found`).toBeDefined();
  return row!.cells;
}

function orientation(values: Values | undefined): Matrix3 {
  return matrixFromEuler3d(readFrame3d(values));
}

function localOf(parent: Values | undefined, child: Values | undefined): Matrix3 {
  return multiplyMatrix3(transposeMatrix3(orientation(parent)), orientation(child));
}

describe("3D joint limits through Engine", () => {
  it("TH-95 a limited two-bone arm takes 3D FABRIK, publishes only legal local orientations, reports limited, and scrubs byte-for-byte", () => {
    const seek = mounted();
    const kinds: string[] = [];
    const forward = PROGRESS.map((progress) => {
      const published = seek(progress);
      const rootVals = (published["rig/root"]?.values as Values) ?? {
        x: 4,
        y: -2,
        z: 1,
        rotation: 15,
        rotationX: 0,
        rotationY: 0,
      };
      const upperVals = boneFrame(published["rig/pose"], "upper");
      const lowerVals = boneFrame(published["rig/pose"], "lower");

      const shoulder = swingTwist3d(localOf(rootVals, upperVals));
      expect(shoulder.swingDegrees).toBeLessThanOrEqual(MAX_SWING + TOLERANCE);
      const elbow = localOf(upperVals, lowerVals);
      const angle = twistAbout3d(elbow, HINGE_AXIS);
      const pure = rotationAboutAxis3d(HINGE_AXIS, angle);
      expect(Math.max(...elbow.map((value, index) => Math.abs(value - pure[index]!)))).toBeLessThan(
        TOLERANCE,
      );
      expect(angle).toBeGreaterThanOrEqual(ELBOW.min - TOLERANCE);
      expect(angle).toBeLessThanOrEqual(ELBOW.max + TOLERANCE);

      const solveOutputs = published["rig/solve"]!;
      const inspection = solveOutputs.inspect as {
        readonly kind: string;
        readonly iterations: number;
        readonly residual: number;
        readonly atBound: readonly string[];
      };
      expect(inspection.iterations).toBeGreaterThan(0);
      const rows =
        (solveOutputs.values as readonly { id: string; cells: { atBound?: boolean } }[]) ?? [];
      const atBoundIds = rows.filter((r) => r.cells.atBound).map((r) => r.id);

      if (inspection.kind === "limited") {
        expect(inspection.residual).toBeGreaterThan(FABRIK_TOLERANCE);
        expect(atBoundIds.length).toBeGreaterThan(0);
        for (const id of atBoundIds) expect(["upper", "lower"]).toContain(id);
      } else expect(atBoundIds).toEqual([]);
      kinds.push(inspection.kind);
      return published;
    });

    expect(kinds[0]).toBe("converged");
    expect(kinds[PROGRESS.length - 1]).toBe("limited");
    const lastSolve = forward[PROGRESS.length - 1]!["rig/solve"]!;
    const lastRows =
      (lastSolve.values as readonly { id: string; cells: { atBound?: boolean } }[]) ?? [];
    expect(
      lastRows
        .filter((r) => r.cells.atBound)
        .map((r) => r.id)
        .sort(),
    ).toEqual(["lower", "upper"]);
    expect(boneFrame(forward[4]!["rig/pose"], "lower")).not.toEqual(
      boneFrame(forward[0]!["rig/pose"], "lower"),
    );

    for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
      expect(seek(PROGRESS[index]!)).toEqual(forward[index]);
  });
});
