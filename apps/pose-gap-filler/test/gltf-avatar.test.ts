import { describe, expect, it } from "vitest";
import { Group, SkinnedMesh } from "three";
import { syntheticHumanoid } from "../../../packages/three/test/support/synthetic-skeleton";
import {
  loadGltfAvatar,
  parseGltf,
  describeGltfAvatarRefusal,
  type GltfAvatarRefusal,
} from "../src/view/gltf-avatar";
import { resolveHumanoid } from "../src/view/humanoid-map";
import { syntheticGlb } from "./support/synthetic-glb";

describe("injected avatar loading", () => {
  it("A1 returns every refusal and describes it exhaustively", async () => {
    const results = [];
    results.push(
      await loadGltfAvatar(new ArrayBuffer(0), async () => {
        throw new Error("bad parse");
      }),
    );
    results.push(await loadGltfAvatar(new ArrayBuffer(0), async () => ({ scene: new Group() })));
    const a = syntheticHumanoid(),
      b = syntheticHumanoid();
    a.scene.add(b.scene);
    results.push(await loadGltfAvatar(new ArrayBuffer(0), async () => a));
    const missing = syntheticHumanoid();
    missing.bones[1]!.name = "unrecognized";
    results.push(await loadGltfAvatar(new ArrayBuffer(0), async () => missing));
    const scaled = syntheticHumanoid();
    scaled.bones[0]!.scale.setScalar(2);
    results.push(await loadGltfAvatar(new ArrayBuffer(0), async () => scaled));
    const kinds = [
      "load-failed",
      "no-skinned-mesh",
      "multiple-skeletons",
      "missing-bones",
      "invalid-skeleton",
    ];
    results.forEach((result, i) => {
      expect(result.kind).toBe("refused");
      if (result.kind !== "refused") throw new Error("Expected refusal");
      expect(result.refusal.kind).toBe(kinds[i]);
      expect(describeGltfAvatarRefusal(result.refusal).length).toBeGreaterThan(0);
    });
  });

  it("A2 maps Mixamo and VRM aliases to the same required keys", () => {
    const mixamo = syntheticHumanoid();
    const vrm = syntheticHumanoid("");
    const rename: Record<string, string> = {
      LeftArm: "leftUpperArm",
      LeftForeArm: "leftLowerArm",
      RightArm: "rightUpperArm",
      RightForeArm: "rightLowerArm",
      LeftUpLeg: "leftUpperLeg",
      LeftLeg: "leftLowerLeg",
      RightUpLeg: "rightUpperLeg",
      RightLeg: "rightLowerLeg",
    };
    vrm.bones.forEach((bone) => {
      bone.name = rename[bone.name] ?? bone.name;
    });
    expect(Object.values(resolveHumanoid(vrm.skeleton).boneKeys)).toEqual(
      Object.values(resolveHumanoid(mixamo.skeleton).boneKeys),
    );
    expect(resolveHumanoid(vrm.skeleton).missing).toEqual([]);
  });

  it("A7 drives one shared skeleton and disables mesh frustum culling", async () => {
    const rig = syntheticHumanoid();
    const other = new SkinnedMesh(rig.mesh.geometry, rig.mesh.material);
    other.bind(rig.skeleton);
    rig.scene.add(other);
    const result = await loadGltfAvatar(new ArrayBuffer(0), async () => rig);
    expect(result.kind).toBe("loaded");
    expect(rig.mesh.frustumCulled).toBe(false);
    expect(other.frustumCulled).toBe(false);
    if (result.kind === "loaded") {
      result.avatar.dispose();
      result.avatar.dispose();
    }
  });

  it("A8 real GLTFLoader sanitization resolves three Mixamo prefix forms", async () => {
    for (const prefix of ["mixamorig:", "mixamorig1:", "mixamorig"]) {
      const bytes = syntheticGlb(prefix);
      expect(bytes.byteLength).toBeLessThan(50_000);
      expect(new Uint8Array(bytes)).toEqual(new Uint8Array(syntheticGlb(prefix)));
      const result = await loadGltfAvatar(bytes, parseGltf);
      expect(result.kind).toBe("loaded");
      if (result.kind !== "loaded") throw new Error(describeGltfAvatarRefusal(result.refusal));
      expect(result.avatar.binding.boneOf("left-upper-arm").name.includes(":")).toBe(false);
      expect(result.avatar.binding.bones.length).toBe(13);
      result.avatar.dispose();
    }
  });
});
