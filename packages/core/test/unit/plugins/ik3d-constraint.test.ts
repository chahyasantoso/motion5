/** ADR-123 and issue #500 phase 6: executable evidence for 3D joint-limit primitives, readers,
 * enforcement, solver dispatch, planar agreement, corpus safety, and free-path byte identity. */
import { describe, expect, it } from "vitest";
import {
  IDENTITY_MATRIX3,
  LOCAL_X3,
  axisX3,
  cross3,
  dot3,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  norm3,
  rotationAboutAxis3d,
  swingFrame3d,
  swingTwist3d,
  twistAbout3d,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import {
  FREE_JOINT,
  atBound,
  limitRotation,
  readAngleRange,
} from "../../../src/plugins/ik-constraint";
import {
  FREE_JOINT3D,
  constrains,
  readJointLimit3d,
  limitLocal3d,
  type JointLimit3d,
} from "../../../src/plugins/ik3d-constraint";
import { readChainMembers3d, type ChainMember3d } from "../../../src/plugins/ik3d-chain";
import { chainShape3d, solveChain3d } from "../../../src/plugins/ik3d-solve";
import { solveChain } from "../../../src/plugins/ik-solve";
import type { SolveMember } from "../../../src/plugins/ik-member";
import { composeChain3d, frameDistance3d } from "../../support/fk3d-compose";

const MATRIX_TOLERANCE = 1e-9;
const ANGLE_TOLERANCE = 1e-7;
const PLANAR_TOLERANCE = 1e-5;
const ROOT: WorldFrame3d = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
const ZERO_OFFSET = { x: 0, y: 0, z: 0 } as const;
const ZERO_REST: Euler3d = { rotation: 0, rotationX: 0, rotationY: 0 };

type Rng = () => number;
function seeded(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function unit(v: Vec3): Vec3 {
  const n = norm3(v);
  return [v[0] / n, v[1] / n, v[2] / n];
}
function closeMatrix(a: Matrix3, b: Matrix3, tolerance = MATRIX_TOLERANCE): void {
  expect(Math.max(...a.map((value, index) => Math.abs(value - b[index]!)))).toBeLessThanOrEqual(
    tolerance,
  );
}
function angleDistance(a: number, b: number): number {
  return Math.abs(a - b - 360 * Math.round((a - b) / 360));
}
function member(id: string, base: string, length: number, extra = {}): ChainMember3d {
  return { id, base, length, offset: ZERO_OFFSET, rest: ZERO_REST, ...extra };
}
function goal(x: number, y: number, z = 0): WorldFrame3d {
  return { x, y, z, rotation: 0, rotationX: 0, rotationY: 0 };
}

const axisAngle = (axis: Vec3, degrees: number): Matrix3 =>
  rotationAboutAxis3d(unit(axis), degrees);

describe("3D joint limits", () => {
  it("TH-79 frame3d primitives preserve rotations and swing-twist identities", () => {
    const axes: readonly [Vec3, Euler3d][] = [
      [[1, 0, 0], { rotation: 0, rotationX: 37, rotationY: 0 }],
      [[0, 1, 0], { rotation: 0, rotationX: 0, rotationY: 37 }],
      [[0, 0, 1], { rotation: 37, rotationX: 0, rotationY: 0 }],
    ];
    for (const [axis, euler] of axes) {
      const matrix = rotationAboutAxis3d(axis, 37);
      const product = multiplyMatrix3(matrix, [
        matrix[0],
        matrix[3],
        matrix[6],
        matrix[1],
        matrix[4],
        matrix[7],
        matrix[2],
        matrix[5],
        matrix[8],
      ]);
      closeMatrix(product, IDENTITY_MATRIX3);
      expect(
        matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) -
          matrix[1] * (matrix[3] * matrix[8] - matrix[5] * matrix[6]) +
          matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6]),
      ).toBeCloseTo(1, 12);
      closeMatrix(matrix, matrixFromEuler3d(euler));
      closeMatrix(multiplyMatrix3(matrix, axisAngle(axis, -37)), IDENTITY_MATRIX3);
      const fixed = multiplyVector3(matrix, axis);
      expect(fixed[0]).toBeCloseTo(axis[0], 12);
      expect(fixed[1]).toBeCloseTo(axis[1], 12);
      expect(fixed[2]).toBeCloseTo(axis[2], 12);
    }
    closeMatrix(rotationAboutAxis3d([1, 2, 3], NaN), IDENTITY_MATRIX3);
    const random = seeded(79);
    for (let index = 0; index < 40; index += 1) {
      const axis = unit([random() * 2 - 1, random() * 2 - 1, random() * 2 - 1]);
      const local = multiplyMatrix3(
        axisAngle(axis, random() * 360 - 180),
        axisAngle(LOCAL_X3, random() * 360 - 180),
      );
      const split = swingTwist3d(local);
      closeMatrix(
        multiplyMatrix3(split.swing, rotationAboutAxis3d(LOCAL_X3, split.twistDegrees)),
        local,
        2e-9,
      );
      expect(split.swingDegrees).toBeGreaterThanOrEqual(0);
      expect(split.swingDegrees).toBeLessThanOrEqual(180);
      expect(split.twistDegrees).toBeGreaterThan(-180);
      expect(split.twistDegrees).toBeLessThanOrEqual(180);
      closeMatrix(swingTwist3d(swingFrame3d(IDENTITY_MATRIX3, [1, 0, 0])).swing, IDENTITY_MATRIX3);
      expect(swingTwist3d(swingFrame3d(IDENTITY_MATRIX3, [1, 0, 0])).twistDegrees).toBe(0);
      expect(swingTwist3d(swingFrame3d(IDENTITY_MATRIX3, [-1, 0, 0])).swingAxis).toEqual([0, 0, 1]);
    }
    const axis = seeded(80);
    for (let index = 0; index < 40; index += 1) {
      const direction = unit([axis() * 2 - 1, axis() * 2 - 1, axis() * 2 - 1]);
      const degrees = axis() * 360 - 180;
      expect(
        angleDistance(twistAbout3d(axisAngle(direction, degrees), direction), degrees),
      ).toBeLessThanOrEqual(ANGLE_TOLERANCE);
    }
  });

  it("TH-80 reads every live joint-limit value totally and constrains only non-free kinds", () => {
    for (const values of [{}, { joint: "wat" }, { joint: 3 }, { joint: null }, { joint: "free" }])
      expect(readJointLimit3d(values)).toBe(FREE_JOINT3D);
    expect(readJointLimit3d({ joint: "hinge" })).toEqual({
      kind: "hinge",
      axis: [0, 0, 1],
      range: FREE_JOINT,
    });
    expect(
      readJointLimit3d({
        joint: "hinge",
        axisX: 2,
        axisY: 0,
        axisZ: 0,
        minRotation: 20,
        maxRotation: 10,
      }),
    ).toEqual({ kind: "hinge", axis: [1, 0, 0], range: { kind: "range", min: 20, max: 20 } });
    expect(readJointLimit3d({ joint: "hinge", axisX: 0, axisY: 0, axisZ: 0 })).toEqual({
      kind: "hinge",
      axis: [0, 0, 1],
      range: FREE_JOINT,
    });
    expect(readJointLimit3d({ joint: "hinge", axisX: NaN, axisY: Infinity, axisZ: "x" })).toEqual({
      kind: "hinge",
      axis: [0, 0, 1],
      range: FREE_JOINT,
    });
    expect(readJointLimit3d({ joint: "cone" })).toEqual({ kind: "cone", maxSwing: 180 });
    for (const maxSwing of [-1, 181, NaN, "30"])
      expect(readJointLimit3d({ joint: "cone", maxSwing })).toEqual({
        kind: "cone",
        maxSwing: 180,
      });
    expect(
      readJointLimit3d({ joint: "swing-twist", maxSwing: 30, minTwist: -20, maxTwist: 15 }),
    ).toEqual({ kind: "swing-twist", maxSwing: 30, twist: { kind: "range", min: -20, max: 15 } });
    expect(
      readAngleRange({ minRotation: 20, maxRotation: 10 }, "minRotation", "maxRotation"),
    ).toEqual({ kind: "range", min: 20, max: 20 });
    expect(constrains(FREE_JOINT3D)).toBe(false);
    for (const kind of ["hinge", "cone", "swing-twist"] as const)
      expect(constrains({ kind } as JointLimit3d)).toBe(true);
  });

  it("TH-81 free and in-range cone limits leave proposals unmoved without reading free proposals", () => {
    expect(
      limitLocal3d(FREE_JOINT3D, () => {
        throw new Error("free proposal read");
      }),
    ).toEqual({ kind: "unmoved", atBound: false });
    const local = axisAngle([0, 1, 0], 20);
    expect(limitLocal3d({ kind: "cone", maxSwing: 30 }, () => local).kind).toBe("unmoved");
    expect(
      limitLocal3d(
        { kind: "swing-twist", maxSwing: 30, twist: { kind: "range", min: -30, max: 30 } },
        () => local,
      ).kind,
    ).toBe("unmoved");
  });

  it("TH-82 hinge limits rebuild pure axis turns and use the 2D nearer-bound rule", () => {
    const axis: Vec3 = unit([1, 2, 3]);
    const range = { kind: "range" as const, min: 90, max: 170 };
    for (const proposed of [axisAngle(axis, -170), axisAngle(axis, 120), axisAngle(axis, 30)]) {
      const answer = limitLocal3d({ kind: "hinge", axis, range }, () => proposed);
      if (answer.kind !== "moved") throw new Error("hinge must answer moved");
      const angle = twistAbout3d(proposed, axis);
      const expected = limitRotation(range, angle);
      closeMatrix(answer.local, rotationAboutAxis3d(axis, expected));
      expect(atBound(range, expected)).toBe(answer.atBound);
    }
    const planar = limitLocal3d({ kind: "hinge", axis: [0, 0, 1], range: FREE_JOINT }, () =>
      matrixFromEuler3d({ rotation: -40, rotationX: 0, rotationY: 0 }),
    );
    if (planar.kind !== "moved") throw new Error("planar hinge must answer moved");
    expect(twistAbout3d(planar.local, [0, 0, 1])).toBeCloseTo(-40, 12);
    const roll = limitLocal3d(
      { kind: "hinge", axis: LOCAL_X3, range: { kind: "range", min: 20, max: 40 } },
      () => axisAngle(LOCAL_X3, 70),
    );
    if (roll.kind !== "moved") throw new Error("roll hinge must answer moved");
    closeMatrix(roll.local, rotationAboutAxis3d(LOCAL_X3, 40));
    const along = limitLocal3d(
      { kind: "hinge", axis: [0, 0, 1], range: { kind: "range", min: 20, max: 40 } },
      () => multiplyMatrix3(swingFrame3d(IDENTITY_MATRIX3, [0, 0, 1]), axisAngle([0, 0, 1], 70)),
    );
    if (along.kind !== "moved") throw new Error("axis direction hinge must answer moved");
    closeMatrix(along.local, rotationAboutAxis3d([0, 0, 1], 40));
  });

  it("TH-83 cone and swing-twist limits cap swing, preserve its plane, and limit twist", () => {
    const proposed = multiplyMatrix3(
      rotationAboutAxis3d([0, 0, 1], 50),
      rotationAboutAxis3d(LOCAL_X3, 70),
    );
    const before = swingTwist3d(proposed);
    const cone = limitLocal3d({ kind: "cone", maxSwing: 20 }, () => proposed);
    if (cone.kind !== "moved") throw new Error("cone must move");
    const coneRead = swingTwist3d(cone.local);
    expect(coneRead.swingDegrees).toBe(20);
    expect(coneRead.swingAxis).toEqual(before.swingAxis);
    expect(coneRead.twistDegrees).toBe(before.twistDegrees);
    expect(cone.atBound).toBe(true);
    const limited = limitLocal3d(
      { kind: "swing-twist", maxSwing: 80, twist: { kind: "range", min: -20, max: 20 } },
      () => proposed,
    );
    if (limited.kind !== "moved") throw new Error("swing-twist must move");
    expect(swingTwist3d(limited.local).twistDegrees).toBe(20);
    expect(limited.atBound).toBe(true);
    const zero = limitLocal3d({ kind: "cone", maxSwing: 0 }, () => proposed);
    if (zero.kind !== "moved") throw new Error("zero cone must move");
    expect(axisX3(zero.local)).toEqual([1, 0, 0]);
  });

  it("TH-84 seeded constrained chains keep every published local pose legal, finite, pure, and composable", () => {
    const random = seeded(500);
    for (let sample = 0; sample < 600; sample += 1) {
      const count = 1 + (sample % 6);
      const members: ChainMember3d[] = [];
      for (let index = 0; index < count; index += 1) {
        const kind = (["free", "hinge", "cone", "swing-twist"] as const)[Math.floor(random() * 4)]!;
        const lo = random() * 300 - 150;
        const limit: JointLimit3d =
          kind === "free"
            ? FREE_JOINT3D
            : kind === "hinge"
              ? {
                  kind,
                  axis: unit([random() * 2 - 1, random() * 2 - 1, random() * 2 - 1]),
                  range: { kind: "range", min: lo, max: lo + random() * (180 - lo) },
                }
              : kind === "cone"
                ? { kind, maxSwing: random() * 180 }
                : {
                    kind,
                    maxSwing: random() * 180,
                    twist: { kind: "range", min: lo, max: lo + random() * (180 - lo) },
                  };
        members.push(
          member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 5 + random() * 35, {
            offset:
              random() < 0.3 ? { x: random() * 4, y: random() * 4, z: random() * 4 } : ZERO_OFFSET,
            rest:
              random() < 0.5
                ? {
                    rotation: random() * 180 - 90,
                    rotationX: random() * 120 - 60,
                    rotationY: random() * 180 - 90,
                  }
                : ZERO_REST,
            ...(kind === "free" ? {} : { limit }),
          }),
        );
      }
      const root = goal(random() * 100 - 50, random() * 100 - 50, random() * 100 - 50);
      const target = goal(random() * 120 - 60, random() * 120 - 60, random() * 120 - 60);
      members[count - 1] = { ...members[count - 1]!, goal: target };
      const result = solveChain3d(root, members);
      expect(solveChain3d(root, members)).toEqual(result);
      for (const item of members) {
        const euler = result.rotations3d[item.id]!;
        expect(Object.values(euler).every(Number.isFinite)).toBe(true);
        if (item.limit === undefined || item.limit.kind === "free") continue;
        const local = matrixFromEuler3d(euler);
        const split = swingTwist3d(local);
        if (item.limit.kind === "hinge") {
          const twist = twistAbout3d(local, item.limit.axis);
          const pure = rotationAboutAxis3d(item.limit.axis, twist);
          expect(
            Math.max(...local.map((value, index) => Math.abs(value - pure[index]!))),
          ).toBeLessThanOrEqual(ANGLE_TOLERANCE);
          if (item.limit.range.kind === "range")
            expect(twist).toBeGreaterThanOrEqual(item.limit.range.min - ANGLE_TOLERANCE);
          if (item.limit.range.kind === "range")
            expect(twist).toBeLessThanOrEqual(item.limit.range.max + ANGLE_TOLERANCE);
        } else {
          expect(split.swingDegrees).toBeLessThanOrEqual(item.limit.maxSwing + ANGLE_TOLERANCE);
          if (item.limit.kind === "swing-twist" && item.limit.twist.kind === "range") {
            expect(split.twistDegrees).toBeGreaterThanOrEqual(
              item.limit.twist.min - ANGLE_TOLERANCE,
            );
            expect(split.twistDegrees).toBeLessThanOrEqual(item.limit.twist.max + ANGLE_TOLERANCE);
          }
        }
      }
      const frames = composeChain3d(root, members, result);
      const leaf = frames[members[count - 1]!.id]!;
      expect(Math.abs(frameDistance3d(leaf, target) - result.quality.residual)).toBeLessThanOrEqual(
        1e-9,
      );
    }
  });

  it("TH-85 planar +z hinges agree with 2D constrained angles", () => {
    const random = seeded(506);
    for (let sample = 0; sample < 120; sample += 1) {
      const count = 2 + (sample % 4);
      const m3: ChainMember3d[] = [];
      const m2: SolveMember[] = [];
      for (let index = 0; index < count; index += 1) {
        const min = random() * 180 - 150;
        const max = min + random() * (180 - min);
        const length = 5 + random() * 35;
        const common = { id: `m${index}`, base: index === 0 ? "root" : `m${index - 1}`, length };
        const g = index === count - 1 ? goal(random() * 160 - 80, random() * 160 - 80) : undefined;
        m3.push(
          member(common.id, common.base, length, {
            limit: { kind: "hinge", axis: [0, 0, 1], range: { kind: "range", min, max } },
            ...(g === undefined ? {} : { goal: g }),
          }),
        );
        m2.push({
          ...common,
          limit: { kind: "range", min, max },
          ...(g === undefined ? {} : { goal: { x: g.x, y: g.y, rotation: 0 } }),
        });
      }
      const spatial = solveChain3d(ROOT, m3);
      const flat = solveChain({ x: 0, y: 0, rotation: 0 }, m2);
      for (const item of m3) {
        const a = spatial.rotations3d[item.id]!.rotation;
        const b = flat.rotations[item.id] as number;
        expect(angleDistance(a, b)).toBeLessThanOrEqual(PLANAR_TOLERANCE);
      }
    }
  });

  it("TH-86 dispatches constrained shapes and reports canonical bound quality", () => {
    const freePair = [member("a", "root", 10), member("b", "a", 10, { goal: goal(12, 3) })];
    expect(chainShape3d(freePair).kind).toBe("two-bone");
    expect(chainShape3d(freePair.map((item) => ({ ...item, limit: FREE_JOINT3D })))).toMatchObject({
      kind: "two-bone",
    });
    const tree = [
      member("a", "root", 10, { goal: goal(8, 4) }),
      member("b", "root", 10, { goal: goal(7, -4) }),
    ];
    expect(chainShape3d(tree).kind).toBe("tree");
    expect(chainShape3d(tree.map((item) => ({ ...item, limit: FREE_JOINT3D })))).toMatchObject({
      kind: "tree",
    });
    const limited = [
      member("a", "root", 10, {
        limit: { kind: "hinge", axis: [0, 0, 1], range: { kind: "range", min: 0, max: 0 } },
      }),
      member("b", "a", 10, { goal: goal(-30, 0) }),
    ];
    expect(chainShape3d(limited).kind).toBe("constrained");
    expect(solveChain3d(ROOT, limited).quality).toEqual({
      kind: "limited",
      iterations: 1,
      residual: 30,
      atBound: ["a"],
    });
    const reachable = [
      member("a", "root", 10, {
        limit: { kind: "hinge", axis: [0, 0, 1], range: { kind: "range", min: -180, max: 180 } },
      }),
      member("b", "a", 10, { goal: goal(12, 3) }),
    ];
    const reachableQuality = solveChain3d(ROOT, reachable).quality;
    expect(reachableQuality.kind).toBe("converged");
    expect(("atBound" in reachableQuality ? reachableQuality.atBound : []) ?? []).toEqual([]);
  });

  it("TH-87 preserves free bytes and read-chain limit omission versus inclusion", () => {
    const make = (limit?: JointLimit3d): ChainMember3d[] => [
      member("a", "root", 10, limit === undefined ? {} : { limit }),
      member("b", "a", 10, { goal: goal(12, 3) }),
    ];
    expect(solveChain3d(ROOT, make()).rotations3d).toEqual(
      solveChain3d(ROOT, make(FREE_JOINT3D)).rotations3d,
    );
    const tree = [
      member("a", "root", 10, { goal: goal(8, 4) }),
      member("b", "root", 10, { goal: goal(7, -4) }),
    ];
    expect(solveChain3d(ROOT, tree)).toEqual(
      solveChain3d(
        ROOT,
        tree.map((item) => ({ ...item, limit: FREE_JOINT3D })),
      ),
    );
    const delivered = (joint?: string) => [
      {
        id: "a",
        base: "root",
        values: { length: 10, ...(joint === undefined ? {} : { joint }) },
        progress: 1,
      },
      { id: "b", base: "a", values: { length: 10 }, progress: 1, goal: goal(12, 3) },
    ];
    expect(readChainMembers3d(delivered(), undefined)[0]).not.toHaveProperty("limit");
    expect(readChainMembers3d(delivered("free"), undefined)[0]).not.toHaveProperty("limit");
    expect(readChainMembers3d(delivered("hinge"), undefined)[0]).toHaveProperty("limit", {
      kind: "hinge",
      axis: [0, 0, 1],
      range: FREE_JOINT,
    });
  });
});
