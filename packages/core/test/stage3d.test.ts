import { describe, expect, it } from "vitest";
import {
  aim,
  mixPoint,
  mixPoint3d,
  orbit,
  project3d,
  unproject3d,
  viewSize3d,
  type Lens3d,
  type Point2d,
  type Point3d,
} from "@gerak/core";

describe("aim", () => {
  it("gives no turn when looking down -z", () => {
    const turn = aim({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: -5 });
    expect(turn.rotation ?? 0).toBeCloseTo(0, 9);
    expect(turn.rotationX ?? 0).toBeCloseTo(0, 9);
    expect(turn.rotationY ?? 0).toBeCloseTo(0, 9);
  });

  it("turns -90 about y to face +x", () => {
    const turn = aim({ x: 0, y: 0, z: 0 }, { x: 4, y: 0, z: 0 });
    expect(turn.rotationY).toBeCloseTo(-90, 9);
    expect(turn.rotationX ?? 0).toBeCloseTo(0, 9);
    expect(turn.rotation ?? 0).toBeCloseTo(0, 9);
  });

  it("gives an empty pose when from is to", () => {
    expect(aim({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toEqual({});
  });
});

describe("orbit", () => {
  it("sits above the target at elevation 90", () => {
    const point = orbit({ target: { x: 1, y: 2, z: 3 }, radius: 5, azimuth: 40, elevation: 90 });
    expect(point.x).toBeCloseTo(1, 9);
    expect(point.y).toBeCloseTo(7, 9);
    expect(point.z).toBeCloseTo(3, 9);
  });

  it("puts azimuth 90 on +x", () => {
    const point = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 2, azimuth: 90, elevation: 0 });
    expect(point.x).toBeCloseTo(2, 9);
    expect(point.y).toBeCloseTo(0, 9);
    expect(point.z).toBeCloseTo(0, 9);
  });

  it("accepts plain 2d and 3d points without ids", () => {
    const a: Point2d = { x: 0, y: 0 };
    const b: Point3d = { x: 1, y: 2, z: 3 };
    expect(mixPoint(a, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 });
    expect(mixPoint3d(b, { x: 3, y: 6, z: 9 }, 0.5)).toEqual({ x: 2, y: 4, z: 6 });
  });
});

describe("unproject3d", () => {
  const stageSize = { width: 1280, height: 720 };
  const eye = orbit({ target: { x: 0, y: 0.6, z: 0 }, radius: 9, azimuth: 25, elevation: 14 });
  const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0.6, z: 0 }), fov: 40 };

  it("inverts project3d at the same depth", () => {
    for (const point of [
      { x: 0, y: 0, z: 0 },
      { x: 1.2, y: -0.7, z: 2.5 },
      { x: -3, y: 2, z: -1 },
    ]) {
      const seen = project3d(point, lens, stageSize);
      const back = unproject3d({ x: seen.x, y: seen.y }, lens, stageSize, seen.depth);
      expect(back.x).toBeCloseTo(point.x, 9);
      expect(back.y).toBeCloseTo(point.y, 9);
      expect(back.z).toBeCloseTo(point.z, 9);
    }
  });

  it("refuses a depth at or behind the lens", () => {
    expect(() => unproject3d({ x: 0, y: 0 }, lens, stageSize, 0)).toThrow(RangeError);
  });
});

describe("viewSize3d", () => {
  it("matches the world span between unprojected viewport corners across FOVs, depths, and sizes", () => {
    for (const fov of [30, 36, 55]) {
      const eye = orbit({ target: { x: 0, y: 0.4, z: 0 }, radius: 6, azimuth: 15, elevation: 12 });
      const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0.4, z: 0 }), fov };
      for (const stageSize of [
        { width: 1440, height: 900 },
        { width: 390, height: 844 },
      ]) {
        for (const depth of [1.5, 5.2, 12]) {
          const size = viewSize3d(lens, stageSize, depth);
          const tl = unproject3d({ x: 0, y: 0 }, lens, stageSize, depth);
          const tr = unproject3d({ x: stageSize.width, y: 0 }, lens, stageSize, depth);
          const bl = unproject3d({ x: 0, y: stageSize.height }, lens, stageSize, depth);
          const unprojectedW = Math.hypot(tr.x - tl.x, tr.y - tl.y, tr.z - tl.z);
          const unprojectedH = Math.hypot(bl.x - tl.x, bl.y - tl.y, bl.z - tl.z);
          expect(size.width).toBeCloseTo(unprojectedW, 9);
          expect(size.height).toBeCloseTo(unprojectedH, 9);
          expect(size.unitsPerPx).toBeCloseTo(size.height / stageSize.height, 12);
          expect(size.unitsPerPx).toBeCloseTo(size.width / stageSize.width, 12);
        }
      }
    }
  });

  it("refuses invalid fov, depth, or stage size", () => {
    const lens: Lens3d = { x: 0, y: 0, z: 5, fov: 40 };
    const stageSize = { width: 1440, height: 900 };
    expect(() => viewSize3d({ ...lens, fov: 0 }, stageSize, 5)).toThrow(RangeError);
    expect(() => viewSize3d({ ...lens, fov: 180 }, stageSize, 5)).toThrow(RangeError);
    expect(() => viewSize3d(lens, stageSize, 0)).toThrow(RangeError);
    expect(() => viewSize3d(lens, stageSize, Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => viewSize3d(lens, { width: 0, height: 900 }, 5)).toThrow(RangeError);
    expect(() => viewSize3d(lens, { width: 1440, height: -1 }, 5)).toThrow(RangeError);
  });
});
