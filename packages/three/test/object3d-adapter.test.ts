import { describe, expect, it } from "vitest";
import {
  Engine,
  PluginCatalog,
  createManualClock,
  type Patch,
  type TrackDefinition,
} from "@motion5/core";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { Matrix4, Object3D, Quaternion, Vector3 } from "three";
// Deterministic interpolator/scheduler fakes remain test support, as in the sibling Three tests.
import { createFakeInterpolator, createFakeScheduler } from "../../core/src/testing/fakes";
import { captureSkeleton, skeletonTracks, tableFrameSource } from "../src/skeleton";
import { EULER_ORDER_3D, createObject3dPatchAdapter, writeFrame3d } from "../src/index";
import { syntheticSkeleton } from "./support/synthetic-skeleton";

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
  values: Readonly<Record<string, number | string | boolean>>,
  revision = 1,
): Patch {
  return {
    nodeId,
    revision,
    status: "ready",
    outputs: { values },
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

function load(tracks: readonly TrackDefinition[]) {
  const plugins = new PluginCatalog();
  plugins.register(fk3dPlugin);
  const project = new Engine({
    plugins,
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({ schemaVersion: 5, motions: [{ id: "scene", trigger: { type: "manual" }, tracks }] });
  for (const track of tracks) project.mount(`scene/${track.id}`);
  for (const track of tracks) project.seek(`scene/${track.id}`, 0);
  return project;
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

  it("TH-124 poses captured skeleton rows through caller selection, not a table overload", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const tracks = skeletonTracks(binding, { idPrefix: "avatar" });
    const project = load(tracks);
    const patch = project.get("scene/avatar-pose");
    if (patch?.status !== "ready") throw new Error("Missing pose publication");
    const table = patch.outputs.values;
    const objects = new Map(
      binding.bones.map((bone) => [bone.key ?? `avatar-bone-${bone.index}`, new Object3D()]),
    );
    for (const object of objects.values()) rig.rootParent.add(object);
    const adapter = createObject3dPatchAdapter((nodeId) => objects.get(nodeId));

    // A table-valued ready patch has no flat frame keys, so `apply` writes nothing and leaves the
    // caller's objects untouched. The row selection below is the whole supported table path.
    adapter.apply(patch);
    for (const object of objects.values()) object.updateMatrixWorld(true);
    expect([...objects.values()].every((object) => object.position.length() === 0)).toBe(true);

    const read = tableFrameSource(table);
    for (const [rowId, object] of objects) {
      const cells = read(rowId);
      if (cells === undefined) throw new Error(`Missing pose row ${rowId}`);
      adapter.applyValues(rowId, cells);
      object.updateMatrixWorld(true);
    }
    rig.rootParent.updateMatrixWorld(true);
    for (const bone of binding.bones) {
      const rowId = bone.key ?? `avatar-bone-${bone.index}`;
      const object = objects.get(rowId)!;
      const objectPosition = new Vector3(),
        objectQuaternion = new Quaternion(),
        objectScale = new Vector3();
      const bonePosition = new Vector3(),
        boneQuaternion = new Quaternion(),
        boneScale = new Vector3();
      object.matrixWorld.decompose(objectPosition, objectQuaternion, objectScale);
      bone.bone.matrixWorld.decompose(bonePosition, boneQuaternion, boneScale);
      expect(objectPosition.distanceTo(bonePosition)).toBeLessThan(1e-6);
      expect(Math.abs(objectQuaternion.dot(boneQuaternion))).toBeGreaterThan(1 - 1e-9);
    }
    project.dispose();
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

  it("TH-134 writes a selected row's cells onto the resolved target without a table overload", () => {
    const object = new Object3D();
    const adapter = createObject3dPatchAdapter((nodeId) =>
      nodeId === "rig/hand" ? object : undefined,
    );
    const read = tableFrameSource([{ id: "rig/hand", cells: { x: 4, y: 5, z: 6, rotation: 90 } }]);
    const cells = read("rig/hand");
    if (cells === undefined) throw new Error("Missing row");
    adapter.applyValues("rig/hand", cells);
    expect(object.position.toArray()).toEqual([4, 5, 6]);
    expect(object.rotation.z).toBeCloseTo(Math.PI / 2, 12);
    expect(distance(object.position, new Vector3(4, 5, 6))).toBeLessThan(1e-12);
  });
});
