import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Group, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { applyBones, attach, captureSkeleton } from "@gerak/three/skeleton";

const MODEL = new URL("../references/dragonling.glb", import.meta.url);
const EYES = new URL("../references/dragonling.eyes.json", import.meta.url);

async function loadModel(): Promise<Group> {
  const bytes = readFileSync(MODEL);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const gltf = await new GLTFLoader().parseAsync(buffer, "");
  return gltf.scene;
}

describe("attaching to the dragonling", () => {
  it("sits a marker on the left iris through a turned, moved group and nods with Head", async () => {
    const model = await loadModel();
    const outer = new Group();
    outer.add(model);
    const skeleton = captureSkeleton(model);
    const eyes: { irises: { left: { x: number; y: number; z: number } } } = JSON.parse(
      readFileSync(EYES, "utf8"),
    );
    const iris = new Vector3(eyes.irises.left.x, eyes.irises.left.y, eyes.irises.left.z);
    const marker = new Object3D();
    attach(skeleton, "Head", marker, { at: iris });

    outer.rotation.set(0.3, 1.2, -0.4);
    outer.position.set(4, -2, 1);
    outer.updateWorldMatrix(true, true);
    const expected = iris.clone().applyMatrix4(outer.matrixWorld);
    expect(marker.getWorldPosition(new Vector3()).distanceTo(expected)).toBeLessThan(1e-6);

    const joint = skeleton.joint("Head");
    const pivot = new Vector3(joint.x, joint.y, joint.z).applyMatrix4(outer.matrixWorld);
    const restDistance = expected.distanceTo(pivot);

    applyBones(skeleton, { Head: { rotationX: 25 } });
    outer.updateWorldMatrix(true, true);
    const moved = marker.getWorldPosition(new Vector3());
    expect(moved.distanceTo(expected)).toBeGreaterThan(0.01);
    expect(moved.distanceTo(pivot)).toBeCloseTo(restDistance, 6);
  });
});
