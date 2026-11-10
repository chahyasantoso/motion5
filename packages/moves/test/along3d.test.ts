import { describe, expect, it } from "vitest";
import { matrixFromEuler3d } from "@gerak/rig";
import {
  along3d,
  combine3d,
  toCubics3d,
  type Anchor3d,
  type Cubic3d,
  type Pose3d,
} from "@gerak/moves";

const cubic = (id: string, p: number[]): Cubic3d => ({
  id,
  x0: p[0] ?? 0,
  y0: p[1] ?? 0,
  z0: p[2] ?? 0,
  x1: p[3] ?? 0,
  y1: p[4] ?? 0,
  z1: p[5] ?? 0,
  x2: p[6] ?? 0,
  y2: p[7] ?? 0,
  z2: p[8] ?? 0,
  x3: p[9] ?? 0,
  y3: p[10] ?? 0,
  z3: p[11] ?? 0,
});
const sCurve = [
  cubic("a", [0, 0, 0, 0, 100, 50, 100, 100, 150, 100, 200, 200]),
  cubic("b", [100, 200, 200, 100, 300, 250, 300, 300, 100, 300, 400, 0]),
];

describe("along3d", () => {
  it("hits the end points at share 0 and 1, and clamps outside", () => {
    expect(along3d(sCurve, 0)).toEqual({ x: 0, y: 0, z: 0 });
    const end = along3d(sCurve, 1);
    expect(end.x).toBeCloseTo(300, 9);
    expect(end.y).toBeCloseTo(400, 9);
    expect(end.z).toBeCloseTo(0, 9);
    expect(along3d(sCurve, 2)).toEqual(along3d(sCurve, 1));
    expect(along3d(sCurve, -1)).toEqual(along3d(sCurve, 0));
  });

  it("covers equal distance in equal share steps", () => {
    const points = Array.from({ length: 11 }, (_, i) => along3d(sCurve, i / 10));
    const lengths = points.slice(1).map((p, i) => {
      const q = points[i];
      return Math.hypot(
        (p.x ?? 0) - (q?.x ?? 0),
        (p.y ?? 0) - (q?.y ?? 0),
        (p.z ?? 0) - (q?.z ?? 0),
      );
    });
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    for (const length of lengths) expect(Math.abs(length - mean) / mean).toBeLessThan(0.02);
  });

  it("turns local +x onto a tangent along +z with face", () => {
    const straight = [cubic("z", [0, 0, 0, 0, 0, 100, 0, 0, 200, 0, 0, 300])];
    const pose = along3d(straight, 0.5, { face: true });
    const m = matrixFromEuler3d({
      rotation: pose.rotation ?? 0,
      rotationX: pose.rotationX ?? 0,
      rotationY: pose.rotationY ?? 0,
    });
    expect(m[0]).toBeCloseTo(0, 9);
    expect(m[3]).toBeCloseTo(0, 9);
    expect(m[6]).toBeCloseTo(1, 9);
    expect(pose.z).toBeCloseTo(150, 6);
  });

  it("adds no turn without face, and refuses an empty path", () => {
    expect(along3d(sCurve, 0.5).rotation).toBeUndefined();
    expect(() => along3d([], 0.5)).toThrow(RangeError);
  });

  it("builds one cubic per pair of anchors", () => {
    const anchor = (id: string, x: number): Anchor3d => ({
      id,
      x,
      y: 0,
      z: x,
      inX: -1,
      inY: -2,
      inZ: -3,
      outX: 1,
      outY: 2,
      outZ: 3,
    });
    const cubics = toCubics3d([anchor("a", 0), anchor("b", 10), anchor("c", 20)]);
    expect(cubics).toHaveLength(2);
    expect(cubics[0]).toEqual(cubic("a", [0, 0, 0, 1, 2, 3, 9, -2, 7, 10, 0, 10]));
    expect(toCubics3d([anchor("a", 0)])).toEqual([]);
  });
});

describe("a bank on a facing turn", () => {
  const nose = (pose: Pose3d) => {
    const m = matrixFromEuler3d({
      rotation: pose.rotation ?? 0,
      rotationX: pose.rotationX ?? 0,
      rotationY: pose.rotationY ?? 0,
    });
    return [m[0], m[3], m[6]];
  };

  it("rolls about the nose when combined after the facing turn", () => {
    const path = [cubic("a", [0, 0, 0, 1, 1, 0, 2, 1, 1, 3, 0, 2])];
    const facing = along3d(path, 0.4, { face: true });
    const banked = combine3d([facing, { rotationX: 35 }]);
    nose(banked).forEach((value, axis) => expect(value).toBeCloseTo(nose(facing)[axis] ?? 0, 9));
    expect(banked).not.toEqual(facing);
  });
});
