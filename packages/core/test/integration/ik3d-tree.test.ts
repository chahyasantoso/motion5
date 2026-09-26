import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { fk3dPlugin } from "../../src/plugins/fk3d";
import { readFrame3d, type WorldFrame3d } from "../../src/plugins/frame3d";
import { ik3dPlugin } from "../../src/plugins/ik3d";
import { solveChain3d } from "../../src/plugins/ik3d-solve";
import { UNBOUND_POLE3D } from "../../src/plugins/ik3d-analytic";
import type { ChainMember3d } from "../../src/plugins/ik3d-chain";
import { transform3dPlugin } from "../../src/plugins/transform3d";

function member(id: string, base: string, length: number, solver: string): TrackDefinition {
  return {
    id,
    keyframes: { fk3d: { values: { length }, requires: { base, solver } } },
  };
}

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-tree",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
        {
          id: "chain-goal",
          keyframes: { transform3d: { values: { x: 50, y: 20, z: 10 } } },
        },
        {
          id: "left-goal",
          keyframes: { transform3d: { values: { x: 25, y: 20, z: 10 } } },
        },
        {
          id: "right-goal",
          keyframes: { transform3d: { values: { x: 25, y: -20, z: -10 } } },
        },
        {
          id: "chain-solve",
          keyframes: { ik3d: { requires: { root: "root", target: "chain-goal" } } },
        },
        {
          id: "tree-solve",
          keyframes: {
            ik3d: {
              requires: {
                root: "root",
                targets: { "left-tip": "left-goal", "right-tip": "right-goal" },
              },
            },
          },
        },
        member("c0", "root", 25, "chain-solve"),
        member("c1", "c0", 22, "chain-solve"),
        member("c2", "c1", 20, "chain-solve"),
        member("c3", "c2", 18, "chain-solve"),
        member("trunk", "root", 25, "tree-solve"),
        member("left", "trunk", 20, "tree-solve"),
        member("left-tip", "left", 20, "tree-solve"),
        member("right", "trunk", 20, "tree-solve"),
        member("right-tip", "right", 20, "tree-solve"),
      ],
    },
  ],
};

function createRuntime(): Engine {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
}

function directMembers(ids: readonly [string, string, string, string]): readonly ChainMember3d[] {
  return [
    {
      id: ids[0],
      base: "rig/root",
      length: 25,
      offset: { x: 0, y: 0, z: 0 },
      rest: { rotation: 0, rotationX: 0, rotationY: 0 },
    },
    {
      id: ids[1],
      base: ids[0],
      length: 22,
      offset: { x: 0, y: 0, z: 0 },
      rest: { rotation: 0, rotationX: 0, rotationY: 0 },
    },
    {
      id: ids[2],
      base: ids[1],
      length: 20,
      offset: { x: 0, y: 0, z: 0 },
      rest: { rotation: 0, rotationX: 0, rotationY: 0 },
    },
    {
      id: ids[3],
      base: ids[2],
      length: 18,
      offset: { x: 0, y: 0, z: 0 },
      rest: { rotation: 0, rotationX: 0, rotationY: 0 },
      goal: readFrame3d({ x: 50, y: 20, z: 10 }),
    },
  ];
}

function directTreeMembers(): readonly ChainMember3d[] {
  const rest = { rotation: 0, rotationX: 0, rotationY: 0 } as const;
  const offset = { x: 0, y: 0, z: 0 } as const;
  return [
    { id: "rig/trunk", base: "rig/root", length: 25, offset, rest },
    { id: "rig/left", base: "rig/trunk", length: 20, offset, rest },
    {
      id: "rig/left-tip",
      base: "rig/left",
      length: 20,
      offset,
      rest,
      goal: readFrame3d({ x: 25, y: 20, z: 10 }),
    },
    { id: "rig/right", base: "rig/trunk", length: 20, offset, rest },
    {
      id: "rig/right-tip",
      base: "rig/right",
      length: 20,
      offset,
      rest,
      goal: readFrame3d({ x: 25, y: -20, z: -10 }),
    },
  ];
}

function ready(patches: ReadonlyMap<string, Patch>, id: string): Readonly<Record<string, unknown>> {
  const patch = patches.get(id);
  if (patch?.status !== "ready") throw new Error(`${id} did not publish a ready patch`);
  return patch.values;
}

function frame(values: Readonly<Record<string, unknown>>): WorldFrame3d {
  return readFrame3d(values);
}

function snapshot(patches: ReadonlyMap<string, Patch>): Readonly<Record<string, unknown>> {
  const ids = ["rig/chain-solve", "rig/tree-solve", "rig/c3", "rig/left-tip", "rig/right-tip"];
  return Object.fromEntries(ids.map((id) => [id, { ...ready(patches, id) }]));
}

describe("3D FABRIK Engine tree integration", () => {
  it("TH-70 publishes chain and branch solves, reaches leaves, and scrubs byte-for-byte", () => {
    const runtime = createRuntime();
    const patches = new Map<string, Patch>();
    const ids = [
      "rig/root",
      "rig/chain-goal",
      "rig/left-goal",
      "rig/right-goal",
      "rig/chain-solve",
      "rig/tree-solve",
      "rig/c0",
      "rig/c1",
      "rig/c2",
      "rig/c3",
      "rig/trunk",
      "rig/left",
      "rig/left-tip",
      "rig/right",
      "rig/right-tip",
    ];
    for (const id of ids) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    runtime.seek("rig/c3", 0);
    runtime.seek("rig/left-tip", 0);

    const root = frame(ready(patches, "rig/root"));
    const chain = solveChain3d(
      root,
      directMembers(["rig/c0", "rig/c1", "rig/c2", "rig/c3"]),
      UNBOUND_POLE3D,
    );
    const tree = solveChain3d(root, directTreeMembers(), UNBOUND_POLE3D);
    const chainPublished = ready(patches, "rig/chain-solve").rotations3d;
    const treePublished = ready(patches, "rig/tree-solve").rotations3d;
    expect(JSON.stringify(chainPublished)).toBe(JSON.stringify(chain.rotations3d));
    expect(JSON.stringify(treePublished)).toBe(JSON.stringify(tree.rotations3d));

    const chainTip = frame(ready(patches, "rig/c3"));
    expect(Math.hypot(chainTip.x - 50, chainTip.y - 20, chainTip.z - 10)).toBeLessThanOrEqual(1e-3);
    const leftTip = frame(ready(patches, "rig/left-tip"));
    const rightTip = frame(ready(patches, "rig/right-tip"));
    expect(Math.hypot(leftTip.x - 25, leftTip.y - 20, leftTip.z - 10)).toBeLessThanOrEqual(1e-3);
    expect(Math.hypot(rightTip.x - 25, rightTip.y + 20, rightTip.z + 10)).toBeLessThanOrEqual(1e-3);

    const initial = snapshot(patches);
    runtime.seek("rig/left-tip", 1);
    runtime.seek("rig/c3", 1);
    runtime.seek("rig/c3", 0);
    runtime.seek("rig/left-tip", 0);
    expect(snapshot(patches)).toEqual(initial);

    const random = new Map<number, Readonly<Record<string, unknown>>>();
    for (const progress of [0.37, 0.12, 0.73, 0.37]) {
      runtime.seek("rig/c3", progress);
      runtime.seek("rig/left-tip", progress);
      const value = snapshot(patches);
      const previous = random.get(progress);
      if (previous === undefined) random.set(progress, value);
      else expect(value).toEqual(previous);
    }
  });
});
