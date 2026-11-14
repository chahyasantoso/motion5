import { describe, expect, it } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";
import { aim, orbit, project3d, seeded, type Lens3d } from "@gerak/moves";
import { applyPose3d } from "@gerak/three";

const STAGE = { width: 1280, height: 720 };

function drawn(lens: Lens3d, point: { x: number; y: number; z: number }) {
  const camera = new PerspectiveCamera(lens.fov, STAGE.width / STAGE.height, 0.01, 1000);
  applyPose3d(camera, lens);
  camera.updateMatrixWorld(true);
  const ndc = new Vector3(point.x, point.y, point.z).project(camera);
  return { x: ((ndc.x + 1) / 2) * STAGE.width, y: ((1 - ndc.y) / 2) * STAGE.height };
}

describe("project3d", () => {
  it("lands every point where Three.js draws it, for lenses placed by orbit and aim", () => {
    const random = seeded(7);
    for (let n = 0; n < 50; n += 1) {
      const target = { x: random() - 0.5, y: random() + 0.5, z: random() - 0.5 };
      const eye = orbit({
        target,
        radius: 2 + random() * 3,
        azimuth: random() * 360,
        elevation: random() * 60 - 20,
      });
      const lens: Lens3d = { ...eye, ...aim(eye, target), fov: 30 + random() * 40 };
      const point = {
        x: target.x + random() - 0.5,
        y: target.y + random() - 0.5,
        z: target.z + random() - 0.5,
      };
      const projected = project3d(point, lens, STAGE);
      const expected = drawn(lens, point);
      expect(projected.visible).toBe(true);
      expect(Math.abs(projected.x - expected.x)).toBeLessThan(1e-6);
      expect(Math.abs(projected.y - expected.y)).toBeLessThan(1e-6);
    }
  });

  it("puts the point it aims at in the middle, and one behind the lens out of sight", () => {
    const target = { x: 0.3, y: 1, z: -0.2 };
    const eye = orbit({ target, radius: 4, azimuth: 30, elevation: 15 });
    const lens: Lens3d = { ...eye, ...aim(eye, target), fov: 45 };
    const middle = project3d(target, lens, STAGE);
    expect(middle.x).toBeCloseTo(640, 9);
    expect(middle.y).toBeCloseTo(360, 9);
    expect(middle.depth).toBeCloseTo(4, 9);
    const behind = { x: 2 * eye.x - target.x, y: 2 * eye.y - target.y, z: 2 * eye.z - target.z };
    expect(project3d(behind, lens, STAGE).visible).toBe(false);
    expect(() => project3d(target, { ...lens, fov: 0 }, STAGE)).toThrow(RangeError);
    expect(() => project3d({ ...target, x: Number.NaN }, lens, STAGE)).toThrow(/finite/);
  });
});
