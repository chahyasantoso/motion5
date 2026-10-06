import { describe, expect, it } from "vitest";
import { Bone, Skeleton } from "three";
import { createSkeletonDriver } from "@motion5/three/skeleton";
import { syntheticHumanoid } from "../../../packages/three/test/support/synthetic-skeleton";
import { describeGltfAvatarRefusal, loadGltfAvatar } from "../src/view/gltf-avatar";
import { AVATAR_SOURCES } from "../src/view/avatar-frame-source";

type Extra = readonly [name: string, parent: string, position: readonly [number, number, number]];

/** The synthetic humanoid plus extra bones, rebound so the skeleton lists them in this order. */
function humanoidWith(extra: readonly Extra[]) {
  const rig = syntheticHumanoid();
  const byName = new Map(rig.bones.map((bone) => [bone.name, bone]));
  for (const [name, parent, position] of extra) {
    const bone = new Bone();
    bone.name = name;
    bone.position.fromArray(position);
    byName.get(parent)!.add(bone);
    byName.set(name, bone);
  }
  rig.scene.updateMatrixWorld(true);
  const skeleton = new Skeleton([...byName.values()]);
  rig.mesh.bind(skeleton);
  return { ...rig, skeleton, byName };
}

const TORSO: readonly Extra[] = [
  ["Spine", "mixamorig:Hips", [0, 0.1, 0]],
  ["Chest", "Spine", [0, 0.15, 0]],
];
const SHOULDERS_FIRST = (parent: string): readonly Extra[] => [
  ["LeftShoulder", parent, [0.2, 0.3, 0]],
  ["RightShoulder", parent, [-0.2, 0.3, 0]],
  ["Neck", parent, [0, 0.3, 0]],
];

describe("humanoid torso mapping (#559 items 1 and 2)", () => {
  it("A10 a rig with Chest and UpperChest loads and drives the first chest bone", async () => {
    const rig = humanoidWith([
      ...TORSO,
      ["UpperChest", "Chest", [0, 0.15, 0]],
      ...SHOULDERS_FIRST("UpperChest"),
    ]);
    const result = await loadGltfAvatar(new ArrayBuffer(0), async () => rig);
    if (result.kind !== "loaded") throw new Error(describeGltfAvatarRefusal(result.refusal));
    const { binding, drives } = result.avatar;
    expect(binding.boneOf("chest")).toBe(rig.byName.get("Chest"));
    const driver = createSkeletonDriver(binding, { sourceSpace: rig.scene, drives });
    const points: Record<string, Readonly<Record<string, number>>> = {
      [AVATAR_SOURCES.hipsMid]: { x: 0, y: 0.9, z: 0 },
      [AVATAR_SOURCES.shoulderMid]: { x: 0.3, y: 1.4, z: 0 },
    };
    const outcomes = driver.apply((id) => points[id]).bones;
    expect(outcomes.get("chest")).toEqual({ kind: "applied" });
    expect(outcomes.get("spine")).toEqual({ kind: "applied" });
    result.avatar.dispose();
  });

  it("A11 a branching chest aims at the neck whatever the child order", async () => {
    const aims = [];
    for (const extra of [SHOULDERS_FIRST("Chest"), [...SHOULDERS_FIRST("Chest")].reverse()]) {
      const rig = humanoidWith([...TORSO, ...extra]);
      const result = await loadGltfAvatar(new ArrayBuffer(0), async () => rig);
      if (result.kind !== "loaded") throw new Error(describeGltfAvatarRefusal(result.refusal));
      const chest = result.avatar.binding.bones.find((bone) => bone.key === "chest")!;
      aims.push(chest.restAim!.toArray());
      result.avatar.dispose();
    }
    expect(aims).toEqual([
      [0, 1, 0],
      [0, 1, 0],
    ]);
  });

  it("A12 a required key matched by two bones is refused by name", async () => {
    const rig = humanoidWith([["LeftUpperArm", "mixamorig:Hips", [0.2, 0.4, 0.1]]]);
    const result = await loadGltfAvatar(new ArrayBuffer(0), async () => rig);
    if (result.kind !== "refused") throw new Error("Expected an ambiguous refusal");
    expect(result.refusal).toEqual({ kind: "ambiguous-bones", keys: ["left-upper-arm"] });
    expect(describeGltfAvatarRefusal(result.refusal)).toBe(
      "Avatar maps several bones to required keys: left-upper-arm.",
    );
  });
});
