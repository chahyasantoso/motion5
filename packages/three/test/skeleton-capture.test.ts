import { describe, expect, it } from "vitest";
import { captureSkeleton as capture } from "../src/skeleton";
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
