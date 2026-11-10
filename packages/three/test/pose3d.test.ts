import { describe, expect, it } from "vitest";
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Vector3 } from "three";
import { aim, lift2d } from "@gerak/moves";
import { applyPose2d, applyPose3d } from "../src/index";

function box(): Mesh<BoxGeometry, MeshBasicMaterial> {
  return new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
}

describe("applyPose3d", () => {
  it("lands every field", () => {
    const mesh = box();
    applyPose3d(
      mesh,
      { x: 1, y: 2, z: 3, scale: 2, scaleX: 3, scaleZ: 0.5, rotation: 90, opacity: 0.4 },
      { x: 10, y: 20, z: 30 },
    );
    expect(mesh.position.toArray()).toEqual([11, 22, 33]);
    expect(mesh.scale.toArray()).toEqual([6, 2, 1]);
    expect(mesh.rotation.z).toBeCloseTo(Math.PI / 2, 12);
    expect(mesh.material.opacity).toBe(0.4);
    expect(mesh.material.transparent).toBe(true);
  });

  it("resets turn and scale with an empty pose", () => {
    const mesh = box();
    applyPose3d(mesh, { rotation: 30, rotationX: 40, rotationY: 50, scale: 3 });
    applyPose3d(mesh, {});
    expect(mesh.rotation.toArray().slice(0, 3)).toEqual([0, 0, 0]);
    expect(mesh.scale.toArray()).toEqual([1, 1, 1]);
  });

  it("turns a lifted 2D rotation as applyPose2d does", () => {
    const a = box();
    const b = box();
    applyPose3d(a, lift2d({ rotation: 30 }, { unitsPerPx: 1 }));
    applyPose2d(b, { rotation: 30 });
    expect(a.rotation.z).toBeCloseTo(b.rotation.z, 12);
  });

  it("points a camera at the target as lookAt does", () => {
    const from = { x: 3, y: 2, z: 5 };
    const to = { x: -1, y: 0.5, z: -2 };
    const camera = new PerspectiveCamera();
    applyPose3d(camera, aim(from, to), from);
    const reference = new PerspectiveCamera();
    reference.position.set(from.x, from.y, from.z);
    reference.lookAt(to.x, to.y, to.z);
    const direction = camera.getWorldDirection(new Vector3());
    const wanted = new Vector3(to.x - from.x, to.y - from.y, to.z - from.z).normalize();
    expect(direction.distanceTo(wanted)).toBeLessThan(1e-6);
    expect(direction.distanceTo(reference.getWorldDirection(new Vector3()))).toBeLessThan(1e-6);
    expect(camera.quaternion.angleTo(reference.quaternion)).toBeLessThan(1e-6);
  });
});
