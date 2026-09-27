import { describe, expect, it } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";
import { IK3D_VIEW } from "../../../../apps/ik-playground/src/ik3d-playground-project";
import {
  projectPoint,
  threeCamera,
  unprojectPoint,
} from "../../../../apps/ik-playground/src/projection";

const DEPTHS = [-120, 0, 120] as const;
const POINTS = [
  { x: 12, y: 28 },
  { x: 180, y: 150 },
  { x: 320, y: 270 },
] as const;

describe("IK playground perspective projection", () => {
  it("TH-142 round-trips points at several depths and keeps the centre fixed", () => {
    for (const z of DEPTHS) {
      for (const point of POINTS) {
        const screen = projectPoint(IK3D_VIEW, { ...point, z });
        expect(screen).toBeDefined();
        if (!screen) continue;
        const world = unprojectPoint(IK3D_VIEW, screen, z);
        expect(world).toBeDefined();
        if (!world) continue;
        expect(world.x).toBeCloseTo(point.x, 12);
        expect(world.y).toBeCloseTo(point.y, 12);
        expect(world.z).toBe(z);
      }
      expect(
        projectPoint(IK3D_VIEW, { x: IK3D_VIEW.width / 2, y: IK3D_VIEW.height / 2, z }),
      ).toEqual({
        x: IK3D_VIEW.width / 2,
        y: IK3D_VIEW.height / 2,
      });
    }
  });

  it("TH-143 rejects points at or behind the viewer", () => {
    expect(projectPoint(IK3D_VIEW, { x: 10, y: 20, z: IK3D_VIEW.perspective })).toBeUndefined();
    expect(projectPoint(IK3D_VIEW, { x: 10, y: 20, z: IK3D_VIEW.perspective + 1 })).toBeUndefined();
    expect(unprojectPoint(IK3D_VIEW, { x: 10, y: 20 }, IK3D_VIEW.perspective)).toBeUndefined();
    expect(unprojectPoint(IK3D_VIEW, { x: 10, y: 20 }, IK3D_VIEW.perspective + 1)).toBeUndefined();
  });

  it("TH-144 agrees with a real three.js camera for the mirrored CSS world", () => {
    const spec = threeCamera(IK3D_VIEW);
    const camera = new PerspectiveCamera(spec.fov, spec.aspect, 0.1, 10000);
    camera.position.set(spec.position.x, spec.position.y, spec.position.z);
    camera.lookAt(spec.target.x, spec.target.y, spec.target.z);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    for (const point of [
      { x: 42, y: 66, z: -100 },
      { x: 180, y: 150, z: 0 },
      { x: 300, y: 230, z: 120 },
    ]) {
      const projected = projectPoint(IK3D_VIEW, point);
      expect(projected).toBeDefined();
      if (!projected) continue;
      const ndc = new Vector3(point.x, -point.y, point.z).project(camera);
      const pixel = {
        x: ((ndc.x + 1) / 2) * IK3D_VIEW.width,
        y: ((1 - ndc.y) / 2) * IK3D_VIEW.height,
      };
      expect(Math.abs(pixel.x - projected.x)).toBeLessThan(1e-6);
      expect(Math.abs(pixel.y - projected.y)).toBeLessThan(1e-6);
    }
  });
});
