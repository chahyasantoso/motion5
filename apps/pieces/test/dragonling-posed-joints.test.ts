import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Group, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { bonesOf3d, chainThrough3d, ik3d, jointOf, posedJoints3d } from "@gerak/rig";
import { applyPose3d } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";
import rig from "../references/dragonling.joints.json" with { type: "json" };

async function loadModel(): Promise<Group> {
  const bytes = readFileSync(new URL("../references/dragonling.glb", import.meta.url));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return (await new GLTFLoader().parseAsync(buffer, "")).scene;
}

describe("posedJoints3d on the dragonling", () => {
  it("puts every joint where applyBones does, with the model moved and turned by its group", async () => {
    const model = await loadModel();
    const skeleton = captureSkeleton(model);
    const group = new Group();
    group.add(model);
    const root = { x: 0.4, y: 0.1, z: -0.3, rotationY: 35, rotation: 5 };
    applyPose3d(group, root);

    const leg = chainThrough3d([
      jointOf(rig.joints, "LeftFrontUpLeg"),
      jointOf(rig.joints, "LeftFrontElbow"),
      jointOf(rig.joints, "LeftFrontLeg"),
    ]);
    const shoulder = jointOf(rig.joints, "LeftFrontUpLeg");
    const solved = ik3d(leg.chain, {
      LeftFrontElbow: { x: shoulder.x + 0.08, y: shoulder.y + 0.1, z: shoulder.z + 0.1 },
    });
    const bones = {
      ...bonesOf3d(leg.chain, solved),
      Neck: { rotationY: 20 },
      Head: { rotationX: -15, rotation: 8 },
      Jaw: { rotationX: 18 },
      Hips: { y: 0.02 },
    };
    applyBones(skeleton, bones);
    group.updateMatrixWorld(true);

    const posed = new Map(Object.entries(posedJoints3d(rig.joints, bones, root)));
    expect(posed.size).toBe(skeleton.bones.length);
    for (const entry of skeleton.bones) {
      const drawn = entry.bone.getWorldPosition(new Vector3());
      const point = posed.get(entry.name);
      expect(point, entry.name).toBeDefined();
      const at = new Vector3(point?.x, point?.y, point?.z);
      expect(drawn.distanceTo(at), entry.name).toBeLessThan(1e-6);
    }
  });

  it("refuses a bone the table lacks, by name", () => {
    expect(() => posedJoints3d(rig.joints, { Eyelid: { rotationX: 10 } })).toThrow(/"Eyelid"/);
  });
});
