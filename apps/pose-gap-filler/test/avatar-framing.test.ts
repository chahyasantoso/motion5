import { describe, expect, it } from "vitest";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Vector3 } from "three";
import { syntheticHumanoid } from "../../../packages/three/test/support/synthetic-skeleton";
import { createAvatarFraming, SKIN_MARGIN } from "../src/view/avatar-framing";

describe("responsive avatar framing", () => {
  it("GF-205 translated visible anatomy fits every orbit without hidden stale geometry affecting it", () => {
    const root = new Group();
    const geometry = new BoxGeometry(0.7, 2.2, 0.4);
    const material = new MeshBasicMaterial();
    const visible = new Mesh(geometry, material);
    visible.position.set(30, 8, -40);
    root.add(visible);
    const stale = new Group();
    stale.visible = false;
    const hiddenMesh = new Mesh(geometry, material);
    hiddenMesh.position.set(-1e6, 1e6, -1e6);
    stale.add(hiddenMesh);
    root.add(stale);
    const frame = createAvatarFraming();
    const camera = new PerspectiveCamera(38, 4 / 3);
    try {
      for (const aspect of [0.5, 4 / 3, 2])
        for (const yaw of [0, 90, 180])
          for (const pitch of [-60, 0, 60]) {
            camera.aspect = aspect;
            frame(camera, root, yaw, pitch);
            expect(camera.position.distanceTo(visible.position)).toBeLessThan(10);
            for (const x of [-0.35, 0.35])
              for (const y of [-1.1, 1.1])
                for (const z of [-0.2, 0.2]) {
                  const ndc = new Vector3(x + 30, y + 8, z - 40).project(camera);
                  expect(Math.abs(ndc.x)).toBeLessThan(1);
                  expect(Math.abs(ndc.y)).toBeLessThan(1);
                  expect(Math.abs(ndc.z)).toBeLessThan(1);
                }
          }
      visible.visible = false;
      frame(camera, root, 45, 20);
      expect(camera.position.toArray().every(Number.isFinite)).toBe(true);
    } finally {
      geometry.dispose();
      material.dispose();
    }
  });

  it("GF-206 a skinned avatar is framed from its joints with a margin and no vertex pass", () => {
    const rig = syntheticHumanoid();
    rig.scene.position.set(4, -2, 9);
    rig.bones[2]!.rotation.z = 1.2;
    let vertexPasses = 0;
    rig.mesh.computeBoundingBox = () => {
      vertexPasses += 1;
    };
    const camera = new PerspectiveCamera(38, 4 / 3);
    createAvatarFraming()(camera, rig.scene, 30, 10);
    expect(vertexPasses).toBe(0);
    const joints = rig.bones.map((bone) => bone.getWorldPosition(new Vector3()));
    for (const joint of joints) {
      const ndc = joint.clone().project(camera);
      expect(Math.max(Math.abs(ndc.x), Math.abs(ndc.y))).toBeLessThan(1 / (1 + SKIN_MARGIN));
    }
  });
});
