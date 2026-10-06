import { describe, expect, it } from "vitest";
import { Engine, PluginRegistry, createManualClock, type TrackDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { rigPlugin } from "@motion5/plugins/rig";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import { Matrix4, Object3D, Vector3 } from "three";
import { frameToMatrix } from "../src/index";
import {
  captureSkeleton,
  createSkeletonDriver,
  describeBoneOutcome,
  rigFrameSource,
  skeletonTracks,
  type BoneDrive,
  type BoneOutcome,
} from "../src/skeleton";
import { syntheticSkeleton } from "./support/synthetic-skeleton";

function load(tracks: readonly TrackDefinition[]) {
  const plugins = new PluginRegistry();
  plugins.registerAll([transform3dPlugin, fk3dPlugin, rigPlugin]);
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

function expectMatrix(a: Matrix4, b: Matrix4) {
  for (let i = 0; i < 16; i += 1)
    expect(Math.abs(a.elements[i]! - b.elements[i]!)).toBeLessThan(1e-6);
}

describe("captured skeleton tracks", () => {
  it("K1 publishes each pivot in root-parent space without changing FK", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const project = load(skeletonTracks(binding, { idPrefix: "imported" }));
    try {
      for (const bone of binding.bones) {
        const patch = project.get(`scene/imported-bone-${bone.index}`);
        expect(patch?.status).toBe("ready");
        if (patch?.status !== "ready") throw new Error("Missing bone publication");
        const expected = new Matrix4()
          .copy(rig.rootParent.matrixWorld)
          .invert()
          .multiply(rig.skeleton.bones[bone.index]!.matrixWorld);
        expectMatrix(frameToMatrix(patch.values, new Matrix4()), expected);
      }
    } finally {
      project.dispose();
    }
  });

  it("K2 includes an unmapped intermediate bone, binding only mapped keys", () => {
    const rig = syntheticSkeleton();
    const tracks = skeletonTracks(captureSkeleton(rig.skeleton, rig), { idPrefix: "a" });
    expect(tracks.length).toBe(5);
    expect(tracks[3]!.id).toBe("a-bone-2");
    expect(tracks[4]!.keyframes).toEqual({
      rig: { requires: { bones: { hand: "a-bone-0", hips: "a-bone-1" } } },
    });
  });

  it("K3 refuses bad prefixes and newly scaled bones", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    for (const idPrefix of ["", "bad/id"])
      expect(() => skeletonTracks(binding, { idPrefix })).toThrow(TypeError);
    rig.middle.scale.x = 2;
    expect(() => skeletonTracks(binding, { idPrefix: "a" })).toThrow(TypeError);
  });

  it("K4 generates deterministic snapshots", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    expect(skeletonTracks(binding, { idPrefix: "a" })).toEqual(
      skeletonTracks(binding, { idPrefix: "a" }),
    );
  });
});

describe("parent-space skeleton driver", () => {
  it("D1 round trips FK world frames through nested bones", () => {
    const rig = syntheticSkeleton();
    const boneKeys = { hips: "hips", middle: "middle", tip: "hand" };
    const binding = captureSkeleton(rig.skeleton, { boneKeys });
    const project = load(skeletonTracks(binding, { idPrefix: "a" }));
    try {
      const patch = project.get("scene/a-rig");
      if (patch?.status !== "ready") throw new Error("Missing rig publication");
      const matrices = rig.skeleton.bones.map((bone) => bone.matrixWorld.clone());
      for (const bone of rig.skeleton.bones) {
        bone.position.set(9, 8, 7);
        bone.quaternion.identity();
      }
      const driver = createSkeletonDriver(binding, {
        sourceSpace: rig.rootParent,
        drives: {
          hand: { kind: "frame", source: "hand" },
          middle: { kind: "frame", source: "middle" },
          hips: { kind: "frame", source: "hips" },
        },
      });
      const result = driver.apply(rigFrameSource(patch.values));
      expect([...result.bones.values()].map((outcome) => outcome.kind)).toEqual([
        "applied",
        "applied",
        "applied",
      ]);
      rig.skeleton.bones.forEach((bone, i) => expectMatrix(bone.matrixWorld, matrices[i]!));
    } finally {
      project.dispose();
    }
  });

  it("D2 maps a calibrated source and differently scaled armature into one parent space", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const sourceSpace = new Object3D();
    sourceSpace.rotation.x = Math.PI;
    sourceSpace.scale.setScalar(0.001);
    const driver = createSkeletonDriver(binding, {
      sourceSpace,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    driver.apply((id) => (id === "a" ? { x: 0, y: 0, z: 0 } : { x: 300, y: 900, z: -200 }));
    const actual = rig.middle.position.clone().transformDirection(rig.root.matrixWorld);
    const expected = new Vector3(300, 900, -200).transformDirection(sourceSpace.matrixWorld);
    expect(actual.angleTo(expected)).toBeLessThan(1e-6);
  });

  it("D3 and D3b preserve non-identity rest rotation and rest twist under a swing", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const captured = binding.bones[1]!;
    const aim = captured.restAim!;
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    driver.apply((id) => (id === "a" ? {} : { x: aim.x, y: aim.y, z: aim.z }));
    expect(rig.root.quaternion.equals(captured.restQuaternion)).toBe(true);
    const perpendicular = new Vector3(aim.y, -aim.x, 0).normalize();
    driver.apply((id) =>
      id === "a" ? {} : { x: perpendicular.x, y: perpendicular.y, z: perpendicular.z },
    );
    const swing = rig.root.quaternion.clone().multiply(captured.restQuaternion.clone().invert());
    expect(Math.abs(new Vector3(swing.x, swing.y, swing.z).dot(aim))).toBeLessThan(1e-12);
    expect(
      rig.middle.position
        .clone()
        .applyQuaternion(rig.root.quaternion)
        .normalize()
        .angleTo(perpendicular),
    ).toBeLessThan(1e-6);
  });

  it("D4 holds missing or degenerate input and keeps antipodal rotation finite", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    const before = rig.root.quaternion.clone();
    expect(driver.apply(() => undefined).bones.get("hips")).toEqual({
      kind: "held",
      reason: "source-missing",
    });
    expect(driver.apply(() => ({})).bones.get("hips")).toEqual({
      kind: "held",
      reason: "degenerate-direction",
    });
    expect(rig.root.quaternion.equals(before)).toBe(true);
    const aim = binding.bones[1]!.restAim!;
    driver.apply((id) => (id === "a" ? {} : { x: -aim.x, y: -aim.y, z: -aim.z }));
    expect(rig.root.quaternion.toArray().every(Number.isFinite)).toBe(true);
  });

  it("D5 snapshots drives independent of authored order and resets all bones", () => {
    const a = syntheticSkeleton(),
      b = syntheticSkeleton();
    const drives: Record<string, BoneDrive> = {
      hand: { kind: "frame", source: "tip" },
      hips: { kind: "frame", source: "root" },
    };
    const first = createSkeletonDriver(captureSkeleton(a.skeleton, a), {
      sourceSpace: a.rootParent,
      drives,
    });
    const second = createSkeletonDriver(captureSkeleton(b.skeleton, b), {
      sourceSpace: b.rootParent,
      drives: { hips: drives.hips!, hand: drives.hand! },
    });
    drives.hips = { kind: "rest" };
    const read = (id: string) => (id === "root" ? { x: 5, rotation: 35 } : { y: 8, rotationX: 20 });
    first.apply(read);
    second.apply(read);
    a.skeleton.bones.forEach((bone, i) =>
      expectMatrix(bone.matrixWorld, b.skeleton.bones[i]!.matrixWorld),
    );
    a.middle.position.set(9, 9, 9);
    first.reset();
    expect(a.middle.position.toArray()).toEqual([2, 4, -1]);
  });

  it("D6 never writes inverse bind data after 100 applies", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const inverses = rig.skeleton.boneInverses.map((matrix) => matrix.toArray());
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "frame", source: "x" } },
    });
    for (let i = 0; i < 100; i += 1) driver.apply(() => ({ x: i, rotation: i }));
    expect(rig.skeleton.boneInverses.map((matrix) => matrix.toArray())).toEqual(inverses);
  });

  it("D7 refuses an unmapped drive key", () => {
    const rig = syntheticSkeleton();
    expect(() =>
      createSkeletonDriver(captureSkeleton(rig.skeleton, rig), {
        sourceSpace: rig.rootParent,
        drives: { absent: { kind: "rest" } },
      }),
    ).toThrow(TypeError);
  });

  it("D8 decodes rig sources and excludes inherited keys", () => {
    const read = rigFrameSource({ pose: { hand: { x: 2, rotation: 30 } } });
    expect(read("hand")).toEqual({ x: 2, y: 0, z: 0, rotation: 30, rotationX: 0, rotationY: 0 });
    expect(read("toString")).toBe(undefined);
    expect(read("absent")).toBe(undefined);
  });

  it("D9 describes every kind and held reason", () => {
    const outcomes: BoneOutcome[] = [
      { kind: "applied" },
      { kind: "rest" },
      { kind: "held", reason: "source-missing" },
      { kind: "held", reason: "degenerate-direction" },
      { kind: "held", reason: "no-rest-aim" },
    ];
    expect(outcomes.map(describeBoneOutcome)).toEqual([
      "Bone transform applied.",
      "Bone restored to rest.",
      "Bone held: source missing.",
      "Bone held: degenerate direction.",
      "Bone held: no unambiguous rest aim child.",
    ]);
  });
});
