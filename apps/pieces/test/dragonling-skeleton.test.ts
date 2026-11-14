import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Vector3, type Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { bonesOf3d, chainThrough3d, fk3d, ik3d } from "@gerak/rig";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";

const MODEL = new URL("../references/dragonling.glb", import.meta.url);

async function loadModel(): Promise<Group> {
  const bytes = readFileSync(MODEL);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const gltf = await new GLTFLoader().parseAsync(buffer, "");
  return gltf.scene;
}

describe("the dragonling's own skeleton", () => {
  it("puts the front paw where fk3d puts the chain's tip, through ik3d, bonesOf3d and applyBones", async () => {
    const model = await loadModel();
    const skeleton = captureSkeleton(model);
    const leg = chainThrough3d([
      skeleton.joint("LeftFrontUpLeg"),
      skeleton.joint("LeftFrontElbow"),
      skeleton.joint("LeftFrontLeg"),
    ]);
    const shoulder = skeleton.joint("LeftFrontUpLeg");
    const goal = { x: shoulder.x + 0.08, y: shoulder.y + 0.1, z: shoulder.z + 0.1 };
    const solved = ik3d(leg.chain, { LeftFrontElbow: goal });
    const tip = fk3d(leg.chain, solved).LeftFrontElbow;

    applyBones(skeleton, bonesOf3d(leg.chain, solved));
    const paw = skeleton.byName.get("LeftFrontLeg")?.bone.getWorldPosition(new Vector3());
    expect(paw?.distanceTo(new Vector3(tip.x, tip.y, tip.z))).toBeLessThan(1e-6);

    applyBones(skeleton, {});
    const rest = skeleton.byName.get("LeftFrontLeg")?.bone.getWorldPosition(new Vector3());
    const joint = skeleton.joint("LeftFrontLeg");
    expect(rest?.distanceTo(new Vector3(joint.x, joint.y, joint.z))).toBeLessThan(1e-9);
  });

  it("opens its jaw about the model's x axis", async () => {
    const model = await loadModel();
    const skeleton = captureSkeleton(model);
    const jaw = skeleton.byName.get("Jaw")?.bone;
    applyBones(skeleton, { Jaw: { rotationX: 20 } });
    const turned = jaw?.getWorldDirection(new Vector3());
    applyBones(skeleton, {});
    const rest = jaw?.getWorldDirection(new Vector3());
    expect(turned && rest ? (Math.acos(turned.dot(rest)) * 180) / Math.PI : NaN).toBeCloseTo(20, 6);
  });
});
