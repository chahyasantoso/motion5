import { describe, expect, it } from "vitest";
import { Bone, Group, Skeleton } from "three";
import { captureSkeleton, createSkeletonDriver } from "../src/skeleton";

/** A chest branching into neck and shoulders, with children attached in the given order. */
function branchingChest(order: readonly ("Neck" | "LeftShoulder" | "RightShoulder")[]) {
  const scene = new Group();
  const chest = new Bone();
  chest.name = "Chest";
  chest.position.set(0, 1, 0);
  scene.add(chest);
  const offsets = { Neck: [0, 0.3, 0], LeftShoulder: [0.2, 0.3, 0], RightShoulder: [-0.2, 0.3, 0] };
  const children = order.map((name) => {
    const bone = new Bone();
    bone.name = name;
    bone.position.fromArray(offsets[name]);
    chest.add(bone);
    return bone;
  });
  scene.updateMatrixWorld(true);
  return { scene, chest, skeleton: new Skeleton([chest, ...children]) };
}

describe("rest aim child (#559 item 2)", () => {
  it("S6 a named aim child gives the same rest aim for any child order", () => {
    const aims = [
      ["Neck", "LeftShoulder", "RightShoulder"],
      ["LeftShoulder", "RightShoulder", "Neck"],
    ].map((order) => {
      const rig = branchingChest(order as never);
      const binding = captureSkeleton(rig.skeleton, {
        boneKeys: { Chest: "chest" },
        aimChildren: { Chest: "Neck" },
      });
      return binding.bones[0]!.restAim!.toArray();
    });
    expect(aims[0]).toEqual([0, 1, 0]);
    expect(aims[1]).toEqual(aims[0]);
  });

  it("S7 a branching bone without a named child has no rest aim, and its aim drive holds", () => {
    const rig = branchingChest(["LeftShoulder", "Neck", "RightShoulder"]);
    const binding = captureSkeleton(rig.skeleton, { boneKeys: { Chest: "chest" } });
    expect(binding.bones[0]!.restAim).toBeUndefined();
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.scene,
      drives: { chest: { kind: "aim", from: "a", to: "b" } },
    });
    const before = rig.chest.quaternion.clone();
    const outcome = driver.apply((id) => (id === "a" ? { x: 0 } : { x: 1 })).bones.get("chest");
    expect(outcome).toEqual({ kind: "held", reason: "no-rest-aim" });
    expect(rig.chest.quaternion.equals(before)).toBe(true);
  });

  it("S8 refuses an aim child that is unknown or not a direct child", () => {
    const rig = branchingChest(["Neck", "LeftShoulder"]);
    expect(() =>
      captureSkeleton(rig.skeleton, { boneKeys: {}, aimChildren: { Chest: "Head" } }),
    ).toThrow('Bone name "Head" must match exactly one bone.');
    expect(() =>
      captureSkeleton(rig.skeleton, { boneKeys: {}, aimChildren: { Neck: "Chest" } }),
    ).toThrow('Aim child "Chest" must be a direct child of "Neck".');
  });
});
