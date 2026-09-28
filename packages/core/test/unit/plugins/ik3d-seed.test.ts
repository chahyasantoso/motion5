import { describe, expect, it } from "vitest";
import {
  IDENTITY_MATRIX3,
  axisX3,
  dot3,
  matrixFromEuler3d,
  multiplyVector3,
  rotationAboutAxis3d,
  scale3,
  swingTwist3d,
  type Vec3,
} from "../../../src/plugins/frame3d";
import { UNBOUND_POLE3D } from "../../../src/plugins/ik3d-analytic";
import {
  centreLocal3d,
  leavesHingeCircle,
  limitLocal3d,
} from "../../../src/plugins/ik3d-constraint";
import { seedTree3d, treeSeed3d, type SeedTree3d } from "../../../src/plugins/ik3d-seed";

const axis: Vec3 = [0.6, 0, 0.8];
const hinge = {
  kind: "hinge",
  axis,
  range: { kind: "range", min: -180, max: 180 },
} as const;
const goal = scale3(multiplyVector3(rotationAboutAxis3d(axis, 30), [1, 0, 0]), 10);
const tree: SeedTree3d = {
  rootPoint: [0, 0, 0],
  rootMatrix: IDENTITY_MATRIX3,
  parent: [-1],
  lengths: [10],
  offsets: [undefined],
  rests: [matrixFromEuler3d({ rotation: 0, rotationX: 30, rotationY: 0 })],
  limits: [hinge],
  paths: [[0]],
  aims: [goal],
};

describe("3D tree seed", () => {
  it("TH-156 rejects an on-circle arc with illegal arbitrary-axis hinge roll", () => {
    expect(leavesHingeCircle(hinge, tree.rests[0]!)).toBe(false);
    expect(dot3(axisX3(tree.rests[0]!), axis)).toBeCloseTo(axis[0], 12);
    const projected = limitLocal3d(hinge, () => tree.rests[0]!);
    expect(projected.kind).toBe("moved");
    expect(treeSeed3d(tree, [goal]).kind).toBe("legal");
  });

  it("TH-157 keeps a planar hinge arc and selects legal for an off-circle axis", () => {
    const planar: SeedTree3d = {
      ...tree,
      rests: [IDENTITY_MATRIX3],
      limits: [{ ...hinge, axis: [0, 0, 1] }],
      aims: [[0, 10, 0]],
    };
    expect(treeSeed3d(planar, [[0, 10, 0]]).kind).toBe("arc");
    const offCircle: SeedTree3d = {
      ...planar,
      limits: [{ ...hinge, axis: [0, 1, 0] }],
    };
    expect(treeSeed3d(offCircle, [[0, 10, 0]]).kind).toBe("legal");
    const seed = seedTree3d(offCircle, UNBOUND_POLE3D, false);
    const opposite = seedTree3d(offCircle, UNBOUND_POLE3D, true);
    expect(seed).toEqual(opposite); // no free joint means no legal opposite side
    expect(seed[0]).toEqual([10, 0, 0]);
  });

  it("TH-158 puts constrained kinds at their legal centre", () => {
    const rest = matrixFromEuler3d({ rotation: 15, rotationX: 30, rotationY: 45 });
    expect(centreLocal3d({ kind: "free" }, rest)).toBe(rest);
    expect(centreLocal3d(hinge, rest)).toEqual(rotationAboutAxis3d(axis, 0));
    expect(centreLocal3d({ kind: "cone", maxSwing: 60 }, rest)).toEqual(
      rotationAboutAxis3d([1, 0, 0], 0),
    );
    expect(
      centreLocal3d(
        { kind: "swing-twist", maxSwing: 60, twist: { kind: "range", min: 10, max: 50 } },
        rest,
      ),
    ).toEqual(rotationAboutAxis3d([1, 0, 0], 30));
  });

  it("TH-159 keeps the shared identity frozen and does not expose the private fast-path array", () => {
    expect(Object.isFrozen(IDENTITY_MATRIX3)).toBe(true);
    const first = swingTwist3d(IDENTITY_MATRIX3).swing;
    const second = swingTwist3d(IDENTITY_MATRIX3).swing;
    expect(first).not.toBe(second);
    expect(first).not.toBe(IDENTITY_MATRIX3);
    expect(first).toEqual(IDENTITY_MATRIX3);
    expect(second).toEqual(IDENTITY_MATRIX3);
  });
});
