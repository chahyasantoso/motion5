import { describe, expect, it } from "vitest";
import {
  IDENTITY_MATRIX3,
  add3,
  axisX3,
  dot3,
  matrixFromEuler3d,
  multiplyMatrix3,
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
  legalLocal3d,
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

  it("TH-161 builds legal quartile starts without changing the default or planar arc", () => {
    const alternate = { kind: "legal-range", fraction: 0.25 } as const;
    const q25 = seedTree3d(tree, UNBOUND_POLE3D, false, alternate);
    const q75 = seedTree3d(tree, UNBOUND_POLE3D, false, {
      kind: "legal-range",
      fraction: 0.75,
    });
    expect(q25).toEqual([scale3(axisX3(legalLocal3d(hinge, tree.rests[0]!, 0.25)), 10)]);
    expect(q75).toEqual([scale3(axisX3(legalLocal3d(hinge, tree.rests[0]!, 0.75)), 10)]);
    expect(q25).toEqual(seedTree3d(tree, UNBOUND_POLE3D, true, alternate));
    expect(q25).toEqual(seedTree3d(tree, UNBOUND_POLE3D, false, alternate));
    expect(seedTree3d(tree, UNBOUND_POLE3D, false)).toEqual(
      seedTree3d(tree, UNBOUND_POLE3D, false, { kind: "default" }),
    );
    const planar: SeedTree3d = {
      ...tree,
      rests: [IDENTITY_MATRIX3],
      limits: [{ ...hinge, axis: [0, 0, 1] }],
      aims: [[0, 10, 0]],
    };
    expect(treeSeed3d(planar, [[0, 10, 0]]).kind).toBe("arc");
  });

  it("TH-163 composes legal branch, offsets and rolled rests from joint space", () => {
    const branch: SeedTree3d = {
      rootPoint: [2, -3, 4],
      rootMatrix: matrixFromEuler3d({ rotation: 10, rotationX: 20, rotationY: -15 }),
      parent: [-1, 0, 0],
      lengths: [4, 6, 3],
      offsets: [undefined, [0, 2, 1], [0, -1, 3]],
      rests: [tree.rests[0]!, tree.rests[0]!, tree.rests[0]!],
      limits: [
        { kind: "cone", maxSwing: 30 },
        hinge,
        { kind: "swing-twist", maxSwing: 30, twist: { kind: "range", min: 10, max: 70 } },
      ],
      paths: [
        [0, 1],
        [0, 2],
      ],
      aims: [
        [10, 10, 10],
        [-4, 2, 5],
      ],
    };
    for (const fraction of [0.25, 0.75] as const) {
      const rootLocal = legalLocal3d(branch.limits[0]!, branch.rests[0]!, fraction);
      const rootFrame = multiplyMatrix3(branch.rootMatrix, rootLocal);
      const rootTip = add3(branch.rootPoint, scale3(axisX3(rootFrame), 4));
      const childTip = (index: 1 | 2): Vec3 => {
        const pivot = add3(rootTip, multiplyVector3(rootFrame, branch.offsets[index]!));
        const local = legalLocal3d(branch.limits[index]!, branch.rests[index]!, fraction);
        return add3(
          pivot,
          scale3(axisX3(multiplyMatrix3(rootFrame, local)), branch.lengths[index]!),
        );
      };
      const expected = [rootTip, childTip(1), childTip(2)];
      const policy = { kind: "legal-range", fraction } as const;
      expect(seedTree3d(branch, UNBOUND_POLE3D, false, policy)).toEqual(expected);
      expect(seedTree3d(branch, UNBOUND_POLE3D, true, policy)).toEqual(expected);
    }
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
