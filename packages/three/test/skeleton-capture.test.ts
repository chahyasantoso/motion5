import { describe, expect, it } from "vitest";
import { captureSkeleton as capture, createSkeletonDriver, skeletonTracks } from "../src/skeleton";
import { syntheticSkeleton } from "./support/synthetic-skeleton";

describe("skeleton capture", () => {
  it("S1 captures indices, depth and parent-space rest aim", () => {
    expect(typeof capture).toBe("function");
    const rig = syntheticSkeleton();
    const binding = capture(rig.skeleton, rig);
    expect(binding.rootParent).toBe(rig.rootParent);
    expect(binding.bones.map((bone) => [bone.index, bone.parent, bone.depth, bone.key])).toEqual([
      [0, 2, 2, "hand"],
      [1, undefined, 0, "hips"],
      [2, 1, 1, undefined],
    ]);
    const aim = rig.middle.position.clone().normalize().applyQuaternion(rig.root.quaternion);
    expect(binding.bones[1]!.restAim!.distanceTo(aim)).toBeLessThan(1e-12);
    expect(binding.boneOf("hand")).toBe(rig.tip);
  });

  it("S2 refuses invalid mappings, separate roots and invalid scales", () => {
    expect(typeof capture).toBe("function");
    for (const boneKeys of [
      { absent: "x" },
      { hips: "" },
      { hips: "bad:key" },
      { hips: "x", tip: "x" },
    ]) {
      const rig = syntheticSkeleton();
      expect(() => capture(rig.skeleton, { boneKeys })).toThrow(TypeError);
    }
    const rig = syntheticSkeleton();
    rig.tip.scale.x = 2;
    expect(() => capture(rig.skeleton, rig)).toThrow(TypeError);
    rig.tip.scale.x = 1;
    rig.rootParent.scale.y = 2;
    expect(() => capture(rig.skeleton, rig)).toThrow(TypeError);
    rig.rootParent.scale.setScalar(1);
    rig.rootParent.remove(rig.root);
    expect(() => capture(rig.skeleton, rig)).toThrow(TypeError);
  });

  it("S6 accepts float32 export noise on bones and relative noise on a large armature", () => {
    const rig = syntheticSkeleton();
    // Measured on a real Mixamo export: a thigh bone at [1.000022, 1, 1.000011].
    rig.tip.scale.set(1.000022, 1, 1.000011);
    // A centimetre armature near 100 carries noise that an absolute 1e-6 would refuse.
    rig.rootParent.scale.set(100, 100.01, 100);
    const binding = capture(rig.skeleton, rig);
    // The one scale owner is shared, so the driver and the track generator accept it too.
    expect(() =>
      createSkeletonDriver(binding, { sourceSpace: rig.rootParent, drives: {} }),
    ).not.toThrow();
    expect(() => skeletonTracks(binding, { idPrefix: "rig" })).not.toThrow();
  });

  it("S7 refuses real scale and names the actual values", () => {
    const rig = syntheticSkeleton();
    rig.tip.scale.x = 1.01;
    expect(() => capture(rig.skeleton, rig)).toThrow(/Bone "tip" has scale \[1\.01, 1, 1\]/);
    rig.tip.scale.x = 1;
    rig.rootParent.scale.set(100, 101, 100);
    expect(() => capture(rig.skeleton, rig)).toThrow(/ancestor .* has scale \[100, 101, 100\]/);
  });

  it("S8 accepts float32 rotation noise, stores a unit rest rotation, refuses a real non-unit one", () => {
    const rig = syntheticSkeleton();
    // Measured shape of a float32 export: components rounded, length off by ~1e-7.
    rig.root.quaternion.set(
      Math.fround(0.1),
      Math.fround(0.2),
      Math.fround(0.3),
      Math.fround(Math.sqrt(1 - 0.14)),
    );
    expect(Math.abs(rig.root.quaternion.lengthSq() - 1)).toBeGreaterThan(1e-9);
    const binding = capture(rig.skeleton, rig);
    expect(Math.abs(binding.bones[1]!.restQuaternion.lengthSq() - 1)).toBeLessThan(1e-15);
    rig.root.quaternion.set(0, 0, 0, 1.001);
    expect(() => capture(rig.skeleton, rig)).toThrow(/finite rigid rest transform/);
  });

  it("S3 freezes cloned rest transforms and snapshots mapping", () => {
    expect(typeof capture).toBe("function");
    const rig = syntheticSkeleton();
    const binding = capture(rig.skeleton, rig);
    const before = rig.root.position.clone();
    rig.root.position.set(9, 9, 9);
    rig.root.quaternion.identity();
    rig.boneKeys.hips = "changed";
    expect(binding.bones[1]!.restPosition.equals(before)).toBe(true);
    expect(binding.boneOf("hips")).toBe(rig.root);
    expect(Object.isFrozen(binding.bones)).toBe(true);
    expect(Object.isFrozen(binding.bones[1]!.restQuaternion)).toBe(true);
    expect(() => binding.bones[1]!.restPosition.set(0, 0, 0)).toThrow(TypeError);
  });

  it("S4 treats an unknown key as a programmer error", () => {
    expect(typeof capture).toBe("function");
    const rig = syntheticSkeleton();
    const binding = capture(rig.skeleton, rig);
    expect(() => binding.boneOf("absent")).toThrow(TypeError);
  });
});
