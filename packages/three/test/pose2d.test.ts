import { describe, expect, it } from "vitest";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { applyPose2d } from "../src/index";

function box(): Mesh<BoxGeometry, MeshBasicMaterial> {
  return new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
}

describe("applyPose2d", () => {
  it("moves by the pose with y pointing down, as on a page", () => {
    const mesh = box();
    applyPose2d(mesh, { x: 3, y: 4 });
    expect(mesh.position.toArray()).toEqual([3, -4, 0]);
  });

  it("turns clockwise on screen for a positive rotation", () => {
    const mesh = box();
    applyPose2d(mesh, { rotation: 90 });
    expect(mesh.rotation.z).toBeCloseTo(-Math.PI / 2, 12);
  });

  it("keeps the anchored edge of the box still while it scales", () => {
    const mesh = box();
    applyPose2d(mesh, { scaleY: 0.5, anchor: "bottom" });
    expect(mesh.scale.y).toBe(0.5);
    // The bottom edge, at y = -1, stays put: the centre drops by half the lost height.
    expect(mesh.position.y).toBeCloseTo(-0.5, 12);
    expect(mesh.position.x).toBeCloseTo(0, 12);
  });

  it("pivots about the centre when the pose names no anchor", () => {
    const mesh = box();
    applyPose2d(mesh, { scale: 2, rotation: 30 });
    expect(mesh.position.toArray()).toEqual([0, 0, 0]);
    expect(mesh.scale.toArray()).toEqual([2, 2, 1]);
  });

  it("fades through a transparent material", () => {
    const mesh = box();
    applyPose2d(mesh, { opacity: 0.25 });
    expect(mesh.material.opacity).toBe(0.25);
    expect(mesh.material.transparent).toBe(true);
  });

  it("starts from a rest position the caller gives", () => {
    const mesh = box();
    applyPose2d(mesh, { x: 1 }, { x: 10, y: 20 });
    expect(mesh.position.toArray()).toEqual([11, 20, 0]);
  });
});
