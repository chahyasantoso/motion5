import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { FABRIK_TOLERANCE } from "../../src/plugins/fabrik";
import { fk3dPlugin } from "../../src/plugins/fk3d";
import { readFrame3d } from "../../src/plugins/frame3d";
import { ik3dPlugin } from "../../src/plugins/ik3d";
import { transform3dPlugin } from "../../src/plugins/transform3d";

type Values = Readonly<Record<string, unknown>>;

/** An `fk3d` member of `solver`, with an optional pivot offset and rest orientation. */
function member(
  id: string,
  base: string,
  solver: string,
  length: number,
  extra: Readonly<Record<string, number>> = {},
): TrackDefinition {
  return {
    id,
    keyframes: { fk3d: { values: { length, ...extra }, requires: { base, solver } } },
  };
}

/** A goal whose position is keyframed from `from` at progress 0 to `to` at progress 1. */
function movingGoal(
  id: string,
  from: readonly [number, number, number],
  to: readonly [number, number, number],
): TrackDefinition {
  const ramp = (axis: 0 | 1 | 2) => [
    { p: 0, v: from[axis] },
    { p: 1, v: to[axis] },
  ];
  return { id, keyframes: { transform3d: { values: { x: ramp(0), y: ramp(1), z: ramp(2) } } } };
}

/**
 * A rotated root carrying two `ik3d` solvers: a four-member serial chain with a lateral pivot offset
 * and a rest orientation, and a branching tree whose two leaves are addressed per leaf and which
 * opts into inspection. Every goal moves with its own track's progress, so a seek re-solves.
 */
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
          keyframes: {
            transform3d: { values: { x: 5, y: -3, z: 2, rotation: 20, rotationX: -15 } },
          },
        },
        movingGoal("chain-goal", [50, 20, 10], [30, -25, 35]),
        movingGoal("left-goal", [25, 20, 10], [35, 10, 25]),
        movingGoal("right-goal", [25, -20, -10], [30, -5, -30]),
        {
          id: "chain-solve",
          keyframes: { ik3d: { requires: { root: "root", target: "chain-goal" } } },
        },
        {
          id: "tree-solve",
          keyframes: {
            ik3d: {
              values: { inspect: true },
              requires: {
                root: "root",
                targets: { "left-tip": "left-goal", "right-tip": "right-goal" },
              },
            },
          },
        },
        member("c0", "root", "chain-solve", 25),
        member("c1", "c0", "chain-solve", 22, { y: 3, rotation: 10, rotationX: 25, weight: 1 }),
        member("c2", "c1", "chain-solve", 20),
        member("c3", "c2", "chain-solve", 18),
        member("trunk", "root", "tree-solve", 25),
        member("left", "trunk", "tree-solve", 20, { z: 2 }),
        member("left-tip", "left", "tree-solve", 20),
        member("right", "trunk", "tree-solve", 20),
        member("right-tip", "right", "tree-solve", 20),
      ],
    },
  ],
};

const NODES = [
  "root",
  "chain-goal",
  "left-goal",
  "right-goal",
  "chain-solve",
  "tree-solve",
  "c0",
  "c1",
  "c2",
  "c3",
  "trunk",
  "left",
  "left-tip",
  "right",
  "right-tip",
].map((id) => `rig/${id}`);

/** Each addressed leaf and the goal node it reaches for. */
const LEAVES = [
  ["rig/c3", "rig/chain-goal"],
  ["rig/left-tip", "rig/left-goal"],
  ["rig/right-tip", "rig/right-goal"],
] as const;

function mountedRig() {
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
  /** Every goal at `progress`, then every published value, copied so a later seek cannot alias it. */
  const seek = (progress: number): Readonly<Record<string, Values>> => {
    for (const [, goal] of LEAVES) runtime.seek(goal, progress);
    return Object.fromEntries(NODES.map((id) => [id, { ...ready(patches, id) }]));
  };
  return { seek };
}

function ready(patches: ReadonlyMap<string, Patch>, id: string): Values {
  const patch = patches.get(id);
  if (patch?.status !== "ready") throw new Error(`${id} did not publish a ready patch`);
  return patch.values;
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
      // fk3d composed every published member from the solve's triples: each leaf lands on the
      // goal it reached for, through the rotated root, the offset and the rest orientation.
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
    // The goals moved, so the solves did: the scrub is evidence only if the pose changes.
    expect(forward[4]!["rig/c3"]).not.toEqual(forward[0]!["rig/c3"]);
    expect(forward[4]!["rig/left-tip"]).not.toEqual(forward[0]!["rig/left-tip"]);

    // No state survives a solve (ADR-111): reverse and random seeks republish the forward bytes.
    for (const index of [4, 3, 2, 1, 0, 2, 4, 1, 3, 0])
      expect(seek([0, 0.25, 0.5, 0.75, 1][index]!)).toEqual(forward[index]);
  });
});
