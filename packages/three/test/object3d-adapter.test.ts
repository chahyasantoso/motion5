import { describe, expect, it } from "vitest";
import {
  Engine,
  PluginRegistry,
  createManualClock,
  type Patch,
  type ProjectDefinition,
} from "@motion5/core";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
// The public entry exposes the manual clock, but deterministic interpolator/scheduler fakes remain
// test support, so this test-only import follows the existing renderer test pattern.
import { createFakeInterpolator, createFakeScheduler } from "../../core/src/testing/fakes";
import { Matrix4, Object3D, Vector3 } from "three";
import { EULER_ORDER_3D, createObject3dPatchAdapter, writeFrame3d } from "../src/index";

const DEGREES = 180 / Math.PI;

function seededEulerTriples(
  seed: number,
  count: number,
): readonly (readonly [number, number, number])[] {
  let state = seed >>> 0;
  const next = (): number => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 2 ** 32;
  };
  return Array.from(
    { length: count },
    () => [next() * 360 - 180, next() * 360 - 180, next() * 360 - 180] as const,
  );
}

function readyPatch(
  nodeId: string,
  values: Readonly<Record<string, unknown>>,
  revision = 1,
): Patch {
  return {
    nodeId,
    revision,
    status: "ready",
    values,
    sourceProgress: 1,
    sourceRevisions: {},
    diagnostics: [],
  };
}

function blockedPatch(nodeId: string, revision = 2): Patch {
  return { nodeId, revision, status: "blocked", diagnostics: [] };
}

function errorPatch(nodeId: string, revision = 3): Patch {
  return { nodeId, revision, status: "error", diagnostics: [] };
}

function destroyedPatch(nodeId: string, revision = 4): Patch {
  return { nodeId, revision, status: "destroyed" };
}

function distance(a: Vector3, b: Vector3): number {
  return a.distanceTo(b);
}

describe("Three.js Object3D renderer adapter", () => {
  it("TH-123 writes the core ZXY convention as Rz·Rx·Ry", () => {
    const seeds = seededEulerTriples(0x5003, 32);

    for (const [rotation, rotationX, rotationY] of seeds) {
      const object = new Object3D();
      writeFrame3d(object, { rotation, rotationX, rotationY });
      object.updateMatrix();

      const expected = new Matrix4()
        .makeRotationZ(rotation / DEGREES)
        .multiply(new Matrix4().makeRotationX(rotationX / DEGREES))
        .multiply(new Matrix4().makeRotationY(rotationY / DEGREES));
      const actual = object.matrix;
      for (let index = 0; index < 16; index += 1)
        expect(actual.elements[index]).toBeCloseTo(expected.elements[index]!, 12);
      expect(object.rotation.order).toBe(EULER_ORDER_3D);
    }
  });

  it("TH-124 publishes a public-plugin three-member pole rig into world Object3D frames", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      projectId: "three-adapter-rig",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
            {
              id: "goal",
              keyframes: { transform3d: { values: { x: 62, y: 37, z: 29 } } },
            },
            {
              id: "pole",
              keyframes: { transform3d: { values: { x: 12, y: 40, z: 18 } } },
            },
            {
              id: "solve",
              keyframes: {
                ik3d: {
                  requires: { root: "root", target: "goal", pole: "pole" },
                },
              },
            },
            {
              id: "upper",
              keyframes: {
                fk3d: {
                  values: { length: 50 },
                  requires: { base: "root", solver: "solve" },
                },
              },
            },
            {
              id: "fore",
              keyframes: {
                fk3d: {
                  values: { length: 40 },
                  requires: { base: "upper", solver: "solve" },
                },
              },
            },
            {
              id: "hand",
              keyframes: {
                fk3d: {
                  values: { length: 30 },
                  requires: { base: "fore", solver: "solve" },
                },
              },
            },
          ],
        },
      ],
    };
    const plugins = new PluginRegistry();
    plugins.register(transform3dPlugin);
    plugins.register(fk3dPlugin);
    plugins.register(ik3dPlugin);
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load(project);
    const objects = new Map(
      ["root", "goal", "pole", "upper", "fore", "hand"].map((id) => [`rig/${id}`, new Object3D()]),
    );
    const adapter = createObject3dPatchAdapter((nodeId) => objects.get(nodeId));
    for (const id of objects.keys()) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => adapter.apply(patch));
    }
    runtime.seek("rig/goal", 1);
    for (const object of objects.values()) object.updateMatrixWorld(true);

    const pivot = (id: string, length: number): Vector3 =>
      objects.get(id)!.localToWorld(new Vector3(-length, 0, 0));
    const rootTip = objects.get("rig/root")!.position;
    const upperTip = objects.get("rig/upper")!.position;
    const foreTip = objects.get("rig/fore")!.position;
    expect(distance(pivot("rig/upper", 50), rootTip)).toBeLessThan(1e-6);
    expect(distance(pivot("rig/fore", 40), upperTip)).toBeLessThan(1e-6);
    expect(distance(pivot("rig/hand", 30), foreTip)).toBeLessThan(1e-6);
    expect(
      distance(objects.get("rig/hand")!.position, objects.get("rig/goal")!.position),
    ).toBeLessThan(1e-3);
    runtime.dispose();
  });

  it("TH-125 retains the last pose for blocked patches", () => {
    const object = new Object3D();
    const adapter = createObject3dPatchAdapter((nodeId) =>
      nodeId === "rig/arm" ? object : undefined,
    );
    adapter.apply(readyPatch("rig/arm", { x: 7, y: 8, z: 9, rotation: 10 }));
    const before = object.position.clone();
    adapter.apply(blockedPatch("rig/arm"));
    expect(object.position.equals(before)).toBe(true);
    expect(object.rotation.z).toBeCloseTo(10 / DEGREES, 12);
  });

  it("TH-126 retains the last pose for error patches and supports caller-derived values", () => {
    const object = new Object3D();
    const adapter = createObject3dPatchAdapter((nodeId) =>
      nodeId === "rig/arm" ? object : undefined,
    );
    adapter.apply(readyPatch("rig/arm", { x: 7, y: 8, z: 9 }));
    adapter.apply(errorPatch("rig/arm"));
    expect(object.position.toArray()).toEqual([7, 8, 9]);
    adapter.applyValues("rig/arm", { x: 11, y: 12, z: 13 });
    expect(object.position.toArray()).toEqual([11, 12, 13]);
  });

  it("TH-127 ignores destroyed patches and unresolved objects", () => {
    const object = new Object3D();
    const adapter = createObject3dPatchAdapter((nodeId) =>
      nodeId === "rig/arm" ? object : undefined,
    );
    adapter.apply(readyPatch("rig/arm", { x: 3, y: 4, z: 5 }));
    adapter.apply(destroyedPatch("rig/arm"));
    expect(object.position.toArray()).toEqual([3, 4, 5]);
    expect(() => adapter.apply(readyPatch("rig/missing", { x: 1, y: 2, z: 3 }))).not.toThrow();
    expect(() => adapter.applyValues("rig/missing", { x: 1 })).not.toThrow();
  });

  it("TH-128 reads absent and non-finite frame values as zero", () => {
    const object = new Object3D();
    const adapter = createObject3dPatchAdapter((nodeId) =>
      nodeId === "rig/arm" ? object : undefined,
    );
    adapter.applyValues("rig/arm", {
      x: Number.NaN,
      y: Number.POSITIVE_INFINITY,
      z: undefined,
      rotation: Number.NEGATIVE_INFINITY,
      rotationX: "not-a-number",
    });
    expect(object.position.toArray()).toEqual([0, 0, 0]);
    expect(object.rotation.toArray()).toEqual([0, 0, 0, "ZXY"]);
  });

  it("TH-133 accepts only newer revisions per object and node, then re-arms a rebound object", () => {
    const first = new Object3D();
    const second = new Object3D();
    const other = new Object3D();
    const objects = new Map([
      ["rig/arm", first],
      ["rig/leg", other],
    ]);
    const adapter = createObject3dPatchAdapter((nodeId) => objects.get(nodeId));

    adapter.apply(readyPatch("rig/arm", { x: 2 }, 2));
    expect(first.position.x).toBe(2);
    adapter.apply(readyPatch("rig/arm", { x: 1 }, 1));
    expect(first.position.x).toBe(2);
    adapter.apply(readyPatch("rig/arm", { x: 22 }, 2));
    expect(first.position.x).toBe(2);
    adapter.apply(readyPatch("rig/arm", { x: 3 }, 3));
    expect(first.position.x).toBe(3);

    adapter.apply(readyPatch("rig/leg", { x: 1 }, 1));
    expect(other.position.x).toBe(1);

    objects.set("rig/arm", second);
    adapter.apply(readyPatch("rig/arm", { x: 30 }, 3));
    expect(second.position.x).toBe(30);
    adapter.clear(first);
    objects.set("rig/arm", first);
    adapter.apply(readyPatch("rig/arm", { x: 31 }, 3));
    expect(first.position.x).toBe(31);
  });
});
