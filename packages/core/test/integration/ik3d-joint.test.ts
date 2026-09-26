import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { FABRIK_TOLERANCE } from "../../src/plugins/fabrik";
import { fk3dPlugin } from "../../src/plugins/fk3d";
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
} from "../../src/plugins/frame3d";
import { ik3dPlugin } from "../../src/plugins/ik3d";
import { transform3dPlugin } from "../../src/plugins/transform3d";

// 3D joint limits through `Engine` (issue #500 phase 6, ADR-123): a two-bone arm whose shoulder is
// a cone and whose elbow is a one-way hinge loads, is solved by 3D FABRIK rather than the closed
// form, publishes only legal local orientations through `fk3d`, reports `limited` with the members
// resting on a bound once the goal leaves the reachable set, and scrubs byte for byte.

type Values = Readonly<Record<string, unknown>>;

const TOLERANCE = 1e-7;
const MAX_SWING = 40;
const ELBOW = { min: -90, max: 0 } as const;
const HINGE_AXIS: Vec3 = [0, 0, 1];
const PROGRESS = [0, 0.25, 0.5, 0.75, 1] as const;

function member(id: string, base: string, values: Values): TrackDefinition {
  return {
    id,
    keyframes: { fk3d: { values: { length: 30, ...values }, requires: { base, solver: "solve" } } },
  } as TrackDefinition;
}

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
        { id: "root", keyframes: { transform3d: { values: { x: 4, y: -2, z: 1, rotation: 15 } } } },
        {
          id: "goal",
          keyframes: {
            transform3d: { values: { x: ramp(45, -40), y: ramp(20, -30), z: ramp(5, 20) } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik3d: { values: { inspect: true }, requires: { root: "root", target: "goal" } },
          },
        },
        member("upper", "root", { joint: "cone", maxSwing: MAX_SWING }),
        member("lower", "upper", {
          joint: "hinge",
          minRotation: ELBOW.min,
          maxRotation: ELBOW.max,
        }),
      ],
    },
  ],
};

const NODES = ["root", "goal", "solve", "upper", "lower"].map((id) => `rig/${id}`);

function mounted() {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
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
    return Object.fromEntries(
      NODES.map((id) => {
        const patch = patches.get(id);
        if (patch?.status !== "ready") throw new Error(`${id} did not publish a ready patch`);
        return [id, { ...patch.values }];
      }),
    );
  };
}

/** The orientation `fk3d` published for a node, as a matrix. */
function orientation(published: Values | undefined): Matrix3 {
  return matrixFromEuler3d(readFrame3d(published));
}

/** A child's local orientation under its parent, read back from both published world frames. */
function localOf(parent: Values | undefined, child: Values | undefined): Matrix3 {
  return multiplyMatrix3(transposeMatrix3(orientation(parent)), orientation(child));
}

describe("3D joint limits through Engine", () => {
  it("TH-95 a limited two-bone arm takes 3D FABRIK, publishes only legal local orientations, reports limited, and scrubs byte-for-byte", () => {
    const seek = mounted();
    const kinds: string[] = [];
    const forward = PROGRESS.map((progress) => {
      const published = seek(progress);
      const shoulder = swingTwist3d(localOf(published["rig/root"], published["rig/upper"]));
      expect(shoulder.swingDegrees).toBeLessThanOrEqual(MAX_SWING + TOLERANCE);
      const elbow = localOf(published["rig/upper"], published["rig/lower"]);
      const angle = twistAbout3d(elbow, HINGE_AXIS);
      const pure = rotationAboutAxis3d(HINGE_AXIS, angle);
      expect(Math.max(...elbow.map((value, index) => Math.abs(value - pure[index]!)))).toBeLessThan(
        TOLERANCE,
      );
      expect(angle).toBeGreaterThanOrEqual(ELBOW.min - TOLERANCE);
      expect(angle).toBeLessThanOrEqual(ELBOW.max + TOLERANCE);
      const inspection = published["rig/solve"]!.inspection as {
        readonly kind: string;
        readonly iterations: number;
        readonly residual: number;
        readonly atBound: readonly string[];
      };
      // Two members would be the closed form's, which counts no iterations; a joint sends the
      // chain to 3D FABRIK instead (ADR-123), which counts at least one outward pass.
      expect(inspection.iterations).toBeGreaterThan(0);
      if (inspection.kind === "limited") {
        expect(inspection.residual).toBeGreaterThan(FABRIK_TOLERANCE);
        expect(inspection.atBound.length).toBeGreaterThan(0);
        for (const id of inspection.atBound) expect(["rig/upper", "rig/lower"]).toContain(id);
      } else expect(inspection.atBound).toEqual([]);
      kinds.push(inspection.kind);
      return published;
    });
    expect(kinds).toHaveLength(PROGRESS.length);
    expect(forward[4]!["rig/lower"]).not.toEqual(forward[0]!["rig/lower"]);
    // No state survives a solve (ADR-111): reverse and random seeks republish the forward bytes.
    for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
      expect(seek(PROGRESS[index]!)).toEqual(forward[index]);
  });
});
