import { describe, expect, it } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";
import {
  IK3D_FRAME,
  IK3D_GOAL_BOUNDS,
  IK3D_GOAL_RADIUS,
  IK3D_VIEW,
} from "../../../../apps/ik-playground/src/ik3d-playground-project";
import {
  clampToFrame,
  projectPoint,
  threeCamera,
  unprojectPoint,
} from "../../../../apps/ik-playground/src/projection";

const DEPTH = { min: IK3D_GOAL_BOUNDS.min.z, max: IK3D_GOAL_BOUNDS.max.z } as const;

function insideFrame(point: { readonly x: number; readonly y: number; readonly z: number }): void {
  const screen = projectPoint(IK3D_VIEW, point);
  expect(screen).toBeDefined();
  if (!screen) return;
  const slack = 1e-9;
  expect(screen.x).toBeGreaterThanOrEqual(IK3D_FRAME.x + IK3D_GOAL_RADIUS - slack);
  expect(screen.x).toBeLessThanOrEqual(IK3D_FRAME.x + IK3D_FRAME.width - IK3D_GOAL_RADIUS + slack);
  expect(screen.y).toBeGreaterThanOrEqual(IK3D_FRAME.y + IK3D_GOAL_RADIUS - slack);
  expect(screen.y).toBeLessThanOrEqual(IK3D_FRAME.y + IK3D_FRAME.height - IK3D_GOAL_RADIUS + slack);
}

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

  it("TH-144 agrees with a real three.js camera for the mirrored CSS world in the frame", () => {
    const spec = threeCamera(IK3D_VIEW, IK3D_FRAME);
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
        x: IK3D_FRAME.x + ((ndc.x + 1) / 2) * IK3D_FRAME.width,
        y: IK3D_FRAME.y + ((1 - ndc.y) / 2) * IK3D_FRAME.height,
      };
      expect(Math.abs(pixel.x - projected.x)).toBeLessThan(1e-6);
      expect(Math.abs(pixel.y - projected.y)).toBeLessThan(1e-6);
    }
  });

  it("TH-145 frames the box centred and draws every reachable goal with the whole handle", () => {
    expect(IK3D_FRAME.x + IK3D_FRAME.width / 2).toBeCloseTo(IK3D_VIEW.width / 2, 12);
    expect(IK3D_FRAME.y + IK3D_FRAME.height / 2).toBeCloseTo(IK3D_VIEW.height / 2, 12);
    expect(IK3D_FRAME.width).toBeGreaterThan(IK3D_VIEW.width);
    expect(IK3D_FRAME.height).toBeGreaterThan(IK3D_VIEW.height);
    const { min, max } = IK3D_GOAL_BOUNDS;
    for (const x of [min.x, max.x])
      for (const y of [min.y, max.y]) for (const z of [min.z, 0, max.z]) insideFrame({ x, y, z });
  });

  it("TH-146 clamps a goal to the drawn frame at its depth, reaching past the authored box", () => {
    const inside = { x: 200, y: 140, z: 20 };
    expect(clampToFrame(IK3D_VIEW, IK3D_FRAME, IK3D_GOAL_RADIUS, DEPTH, inside)).toEqual(inside);
    for (const z of [DEPTH.min - 50, 0, DEPTH.max + 50]) {
      for (const corner of [
        { x: -1000, y: -1000 },
        { x: 1000, y: 1000 },
      ]) {
        const clamped = clampToFrame(IK3D_VIEW, IK3D_FRAME, IK3D_GOAL_RADIUS, DEPTH, {
          ...corner,
          z,
        });
        expect(clamped.z).toBe(Math.min(DEPTH.max, Math.max(DEPTH.min, z)));
        insideFrame(clamped);
        const edge = projectPoint(IK3D_VIEW, clamped);
        expect(edge?.x).toBeCloseTo(
          corner.x < 0
            ? IK3D_FRAME.x + IK3D_GOAL_RADIUS
            : IK3D_FRAME.x + IK3D_FRAME.width - IK3D_GOAL_RADIUS,
          9,
        );
      }
    }
    const atPlane = clampToFrame(IK3D_VIEW, IK3D_FRAME, IK3D_GOAL_RADIUS, DEPTH, {
      x: -1000,
      y: 150,
      z: 0,
    });
    expect(atPlane.x).toBeLessThan(IK3D_GOAL_BOUNDS.min.x);
  });
});
