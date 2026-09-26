import { describe, expect, it } from "vitest";
import type { PluginInputs } from "../../../src/domain/plugins";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import {
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  readFrame3d,
  swingFrame3d,
  ZERO_EULER,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import { solveChain } from "../../../src/plugins/ik-solve";
import {
  solveTwoBone3d,
  UNBOUND_POLE3D,
  type Pole3d,
  type SolveMember3d,
} from "../../../src/plugins/ik3d-analytic";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import { place3d } from "../../../src/plugins/ik3d-fabrik";
import { chainShape3d, solveChain3d } from "../../../src/plugins/ik3d-solve";
import type { ChainMember3d } from "../../../src/plugins/ik3d-chain";
import type { SolveResult3d } from "../../../src/plugins/ik3d-result";

const ROOT = readFrame3d({ x: 0, y: 0, z: 0 });
const ZERO_OFFSET = { x: 0, y: 0, z: 0 } as const;
const ZERO_REST: Euler3d = { ...ZERO_EULER };

type Vec2 = { readonly x: number; readonly y: number };

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function member(
  id: string,
  base: string,
  length: number,
  extra: Partial<ChainMember3d> = {},
): ChainMember3d {
  return { id, base, length, offset: ZERO_OFFSET, rest: ZERO_REST, ...extra };
}

function composeMembers(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  result: SolveResult3d,
): Readonly<Record<string, WorldFrame3d>> {
  const frames: Record<string, WorldFrame3d> = {};
  for (const item of members) {
    const base = item.base === "root" ? root : (frames[item.base] ?? root);
    frames[item.id] = fk3dPlugin.compose(
      {
        length: item.length,
        ...item.offset,
        ...item.rest,
      },
      1,
      { base, solver: result } as unknown as PluginInputs,
      item.id,
    ) as WorldFrame3d;
  }
  return frames;
}

function distance3(a: WorldFrame3d, b: WorldFrame3d): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function allFinite(result: SolveResult3d): boolean {
  return Object.values(result.rotations3d).every((euler) =>
    Object.values(euler).every(Number.isFinite),
  );
}

function turnDistance(a: number, b: number): number {
  const delta = a - b;
  return Math.abs(delta - 360 * Math.round(delta / 360));
}

function composedInputs(
  root: WorldFrame3d,
  target: WorldFrame3d,
  members: readonly SolveMember3d[],
  inspect = false,
) {
  return {
    root,
    target,
    members: members.map((item) => ({
      id: item.id,
      base: item.base,
      values: { length: item.length, ...item.offset, ...item.rest },
      progress: 1,
    })),
    ...(inspect ? { inspect: true } : {}),
  };
}

function columns(matrix: Matrix3): readonly [Vec3, Vec3, Vec3] {
  return [
    [matrix[0], matrix[3], matrix[6]],
    [matrix[1], matrix[4], matrix[7]],
    [matrix[2], matrix[5], matrix[8]],
  ];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function perpendicularSide(point: Vec3, goal: Vec3, side: Vec3): number {
  const length = Math.hypot(goal[0], goal[1], goal[2]);
  const along: Vec3 = [goal[0] / length, goal[1] / length, goal[2] / length];
  const project = (value: Vec3): Vec3 => {
    const amount = dot(value, along);
    return [
      value[0] - along[0] * amount,
      value[1] - along[1] * amount,
      value[2] - along[2] * amount,
    ];
  };
  return dot(project(point), project(side));
}

describe("3D FABRIK evidence", () => {
  it("TH-58 closes seeded serial chains and independently composes their tips", () => {
    const random = seeded(7);
    for (let sample = 0; sample < 300; sample += 1) {
      const count = 3 + Math.floor(random() * 6);
      const root = readFrame3d({
        x: random() * 100 - 50,
        y: random() * 100 - 50,
        z: random() * 100 - 50,
        rotation: random() * 360 - 180,
        rotationX: random() * 360 - 180,
        rotationY: random() * 360 - 180,
      });
      const members: ChainMember3d[] = [];
      for (let index = 0; index < count; index += 1) {
        members.push(
          member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 10 + random() * 10, {
            offset:
              sample % 2 === 1
                ? { x: random() * 3, y: random() * 3, z: random() * 3 }
                : ZERO_OFFSET,
            rest:
              sample % 3 === 0
                ? { rotation: random() * 90, rotationX: random() * 90, rotationY: random() * 90 }
                : ZERO_REST,
          }),
        );
      }
      const reach = members.reduce((sum, item) => sum + item.length, 0);
      const direction: Vec3 = [random() - 0.5, random() - 0.5, random() - 0.5];
      const size = Math.hypot(direction[0], direction[1], direction[2]);
      const distance = reach * (0.1 + 0.8 * random());
      const goal = readFrame3d({
        x: root.x + (direction[0] / size) * distance,
        y: root.y + (direction[1] / size) * distance,
        z: root.z + (direction[2] / size) * distance,
      });
      members[count - 1] = { ...members[count - 1]!, goal };

      const result = solveChain3d(root, members, UNBOUND_POLE3D);
      expect(result.quality.kind).toBe("converged");
      expect(result.quality.residual).toBeLessThanOrEqual(1e-3);
      const composed = composeMembers(root, members, result);
      const tip = composed[`m${count - 1}`];
      if (tip === undefined) throw new Error("missing composed tip");
      expect(Math.abs(distance3(tip, goal) - result.quality.residual)).toBeLessThanOrEqual(1e-9);
    }
  });

  it("TH-59 reduces planar FABRIK to 2D angles and zero X/Y rotations", () => {
    const random = seeded(11);
    for (let sample = 0; sample < 200; sample += 1) {
      const count = 3 + Math.floor(random() * 5);
      const root2 = { x: random() * 100, y: random() * 100, rotation: random() * 360 - 180 };
      const members2 = Array.from({ length: count }, (_, index) => ({
        id: `m${index}`,
        base: index === 0 ? "root" : `m${index - 1}`,
        length: 10 + random() * 10,
      }));
      const reach = members2.reduce((sum, item) => sum + item.length, 0);
      const angle = random() * Math.PI * 2;
      const goal: Vec2 = {
        x: root2.x + Math.cos(angle) * reach * (0.1 + 0.8 * random()),
        y: root2.y + Math.sin(angle) * reach * (0.1 + 0.8 * random()),
      };
      const flat = solveChain(
        root2,
        members2.map((item, index) => ({
          ...item,
          ...(index === count - 1 ? { goal: { ...goal, rotation: 0 } } : {}),
        })),
      );
      const spatialMembers = members2.map((item, index) =>
        member(item.id, item.base, item.length, {
          ...(index === count - 1 ? { goal: readFrame3d({ ...goal, z: 0 }) } : {}),
        }),
      );
      const spatial = solveChain3d(
        readFrame3d({ ...root2, z: 0, rotationX: 0, rotationY: 0 }),
        spatialMembers,
      );
      expect(spatial.quality.kind).toBe(flat.quality.kind);
      expect(Math.abs(spatial.quality.residual - flat.quality.residual)).toBeLessThanOrEqual(1e-9);
      for (const item of members2) {
        const euler = spatial.rotations3d[item.id]!;
        expect(euler.rotationX).toBeCloseTo(0, 9);
        expect(euler.rotationY).toBeCloseTo(0, 9);
        expect(turnDistance(euler.rotation, flat.rotations[item.id]!)).toBeLessThanOrEqual(1e-9);
      }
    }
  });

  it("TH-60 is pure and member-order independent at every published byte", () => {
    const members = [
      member("m2", "m1", 20),
      member("m0", "root", 20),
      member("m3", "m2", 20, { goal: readFrame3d({ x: 35, y: 25, z: 15 }) }),
      member("m1", "m0", 20),
    ] as const;
    const first = solveChain3d(ROOT, members);
    const second = solveChain3d(ROOT, members);
    const permuted = solveChain3d(ROOT, [...members].reverse());
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.stringify(first.rotations3d)).toBe(JSON.stringify(permuted.rotations3d));
    expect(Object.is(first.quality.residual, second.quality.residual)).toBe(true);
  });

  it("TH-61 bends a 3D chain toward an authored pole and preserves the unbound default", () => {
    const members = [
      member("m0", "root", 20),
      member("m1", "m0", 20),
      member("m2", "m1", 20, { goal: readFrame3d({ x: 30, y: 0, z: 0 }) }),
    ];
    const defaultResult = solveChain3d(ROOT, members);
    const explicitDefault = solveChain3d(ROOT, members, UNBOUND_POLE3D);
    expect(JSON.stringify(defaultResult.rotations3d)).toBe(
      JSON.stringify(explicitDefault.rotations3d),
    );
    const pole: Pole3d = { kind: "point", point: [15, 0, -50] };
    const bound = solveChain3d(ROOT, members, pole);
    const composed = composeMembers(ROOT, members, bound);
    const first = composed.m0;
    if (first === undefined) throw new Error("missing first member");
    const side = perpendicularSide([first.x, first.y, first.z], [30, 0, 0], [15, 0, -50]);
    expect(side).toBeGreaterThan(0);
  });

  it("TH-62 restores magnitude images and handles all degenerate tree shapes", () => {
    const huge = 2 ** 600;
    const image = 2 ** 499;
    const makeScaled = (scale: number): readonly ChainMember3d[] =>
      [0, 1, 2, 3].map((index) =>
        member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 20 * scale, {
          offset: { x: scale, y: 2 * scale, z: 0 },
          ...(index === 3
            ? { goal: readFrame3d({ x: 40 * scale, y: 30 * scale, z: 20 * scale }) }
            : {}),
        }),
      );
    const large = solveChain3d(readFrame3d({ x: 3 * huge, z: -huge }), makeScaled(huge));
    const small = solveChain3d(readFrame3d({ x: 3 * image, z: -image }), makeScaled(image));
    expect(JSON.stringify(large.rotations3d)).toBe(JSON.stringify(small.rotations3d));
    expect(large.quality.kind).toBe(small.quality.kind);
    expect(large.quality.residual).toBe(small.quality.residual * 2 ** 101);

    const cases: readonly [string, readonly ChainMember3d[], string][] = [
      [
        "zero",
        [
          member("a", "root", 0),
          member("b", "a", 20),
          member("c", "b", 20, { goal: readFrame3d({ x: 10, y: 10 }) }),
        ],
        "converged",
      ],
      [
        "root",
        [member("a", "root", 20), member("b", "a", 20), member("c", "b", 20, { goal: ROOT })],
        "converged",
      ],
      [
        "far",
        [
          member("a", "root", 20),
          member("b", "a", 20),
          member("c", "b", 20, { goal: readFrame3d({ x: 100 }) }),
        ],
        "stalled",
      ],
      [
        "inside",
        [
          member("a", "root", 20),
          member("b", "a", 20),
          member("c", "b", 20, { goal: readFrame3d({ x: 15, y: 4 }) }),
        ],
        "converged",
      ],
      ["single", [member("only", "root", 20, { goal: readFrame3d({ y: 10, z: 10 }) })], "stalled"],
      [
        "orphan",
        [
          member("a", "root", 20),
          member("b", "a", 20, { goal: readFrame3d({ x: 20, y: 10, z: 3 }) }),
          member("orphan", "nowhere", 4),
        ],
        "converged",
      ],
    ];
    for (const [name, members, kind] of cases) {
      const result = solveChain3d(ROOT, members);
      expect(result.quality.kind, name).toBe(kind);
      expect(allFinite(result), name).toBe(true);
      expect(Object.values(result.rotations3d)).toHaveLength(members.length);
    }
  });

  it("TH-63 implements swingFrame3d's aligned, antiparallel, and orthonormal cases", () => {
    const identity = matrixFromEuler3d(ZERO_EULER);
    expect(swingFrame3d(identity, [1, 0, 0])).toEqual(identity);
    expect(swingFrame3d(identity, [-1, 0, 0])).toEqual([-1, 0, 0, 0, -1, 0, 0, 0, 1]);
    const turned = matrixFromEuler3d({ rotation: 30, rotationX: 20, rotationY: -15 });
    const swung = swingFrame3d(turned, [0, 2, 3]);
    const axis = multiplyVector3(swung, [1, 0, 0]);
    expect(axis[0]).toBeCloseTo(0, 12);
    expect(axis[1]).toBeCloseTo(0.5547001962252291, 12);
    expect(axis[2]).toBeCloseTo(0.8320502943378437, 12);
    for (const column of columns(swung)) expect(Math.hypot(...column)).toBeCloseTo(1, 12);
    const [first, second, third] = columns(swung);
    expect(dot(first, second)).toBeCloseTo(0, 12);
    expect(dot(first, third)).toBeCloseTo(0, 12);
    expect(dot(second, third)).toBeCloseTo(0, 12);
  });

  it("TH-64 selects a deterministic conflicted tree result", () => {
    const members = [
      member("a", "root", 20),
      member("b1", "a", 20, { goal: readFrame3d({ x: 40 }) }),
      member("b2", "a", 20, { goal: readFrame3d({ x: -40 }) }),
    ];
    const result = solveChain3d(ROOT, members);
    const permutation = solveChain3d(ROOT, [...members].reverse());
    expect(result.quality.kind).toBe("conflicted");
    expect(allFinite(result)).toBe(true);
    expect(JSON.stringify(result.rotations3d)).toBe(JSON.stringify(permutation.rotations3d));
  });

  it("TH-65 publishes iterative quality kinds through ik3d inspection", () => {
    const inspect = (inputs: unknown) =>
      ik3dPlugin.compose({ inspect: true }, 1, inputs as PluginInputs, "solve").inspection as {
        readonly kind: string;
        readonly residual: number;
        readonly residuals: Readonly<Record<string, number>>;
      };
    const serial = [member("a", "root", 20), member("b", "a", 20), member("c", "b", 20)];
    const stalled = inspect(composedInputs(ROOT, readFrame3d({ x: 100 }), serial));
    expect(stalled.kind).toBe("stalled");
    expect(stalled.residuals).toEqual({ c: stalled.residual });

    const converged = inspect(composedInputs(ROOT, readFrame3d({ x: 15, y: 4 }), serial));
    expect(converged.kind).toBe("converged");

    const branch = [
      member("a", "root", 20),
      member("b1", "a", 20, { goal: readFrame3d({ x: 40 }) }),
      member("b2", "a", 20, { goal: readFrame3d({ x: -40 }) }),
    ];
    const conflicted = inspect({
      root: ROOT,
      members: branch.map((item) => ({
        id: item.id,
        base: item.base,
        values: { length: item.length, ...item.offset, ...item.rest },
        progress: 1,
        ...(item.goal === undefined ? {} : { goal: item.goal }),
      })),
    });
    expect(conflicted.kind).toBe("conflicted");
  });

  it("TH-66 dispatches two-bone, single, long, and branched chain shapes", () => {
    const first = member("a", "root", 30);
    const second = member("b", "a", 20, { goal: readFrame3d({ x: 30, y: 10 }) });
    const direct = solveTwoBone3d(ROOT, second.goal!, first, second);
    expect(chainShape3d([first, second])).toEqual({
      kind: "two-bone",
      first,
      second,
      goal: second.goal,
    });
    expect(solveChain3d(ROOT, [first, second])).toEqual(direct);
    expect(chainShape3d([member("only", "root", 20, { goal: readFrame3d({ x: 1 }) })]).kind).toBe(
      "tree",
    );
    expect(
      chainShape3d([first, second, member("c", "b", 10, { goal: readFrame3d({ x: 1 }) })]).kind,
    ).toBe("tree");
    expect(
      chainShape3d([
        member("a", "root", 20),
        member("l", "a", 20, { goal: readFrame3d({ x: 10 }) }),
        member("r", "a", 20, { goal: readFrame3d({ x: -10 }) }),
      ]).kind,
    ).toBe("tree");
    expect(() => chainShape3d([member("none", "root", 1)])).toThrow(/requires at least one goal/);
  });
  it("TH-67 matches every branch residual to an independently composed FK tip", () => {
    const members = [
      member("trunk", "root", 25),
      member("left", "trunk", 20),
      member("left-tip", "left", 20, { goal: readFrame3d({ x: 25, y: 20, z: 10 }) }),
      member("right", "trunk", 20),
      member("right-tip", "right", 20, { goal: readFrame3d({ x: 25, y: -20, z: -10 }) }),
    ];
    const result = solveChain3d(ROOT, members);
    const composed = composeMembers(ROOT, members, result);
    const goals: Readonly<Record<string, WorldFrame3d>> = {
      "left-tip": members[2]!.goal!,
      "right-tip": members[4]!.goal!,
    };
    const actual: Record<string, number> = {};
    for (const id of ["left-tip", "right-tip"] as const) {
      const tip = composed[id];
      if (tip === undefined) throw new Error(`missing composed tip ${id}`);
      actual[id] = distance3(tip, goals[id]!);
      expect(Math.abs(result.residuals[id]! - actual[id]!)).toBeLessThanOrEqual(1e-9);
    }
    expect(result.quality.residual).toBeCloseTo(
      Math.max(actual["left-tip"]!, actual["right-tip"]!),
      12,
    );
  });

  it("TH-68 reconstructs rest roll as swing and zero-rest frames as pure swings", () => {
    const random = seeded(0x68_500);
    for (let sample = 0; sample < 40; sample += 1) {
      const members: ChainMember3d[] = [];
      for (let index = 0; index < 5; index += 1) {
        members.push(
          member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 18 + random() * 8, {
            offset: { x: random() * 3 - 1.5, y: random() * 3 - 1.5, z: random() * 3 - 1.5 },
            rest: {
              rotation: random() * 180 - 90,
              rotationX: random() * 60 - 30,
              rotationY: random() * 60 - 30,
            },
          }),
        );
      }
      const direction: Vec3 = [random() - 0.5, random() - 0.5, random() - 0.5];
      const directionSize = Math.hypot(direction[0], direction[1], direction[2]);
      const reach = members.reduce((sum, item) => sum + item.length, 0);
      const distance = reach * (0.25 + random() * 0.45);
      const goal = readFrame3d({
        x: (direction[0] / directionSize) * distance,
        y: (direction[1] / directionSize) * distance,
        z: (direction[2] / directionSize) * distance,
      });
      members[4] = { ...members[4]!, goal };
      const result = solveChain3d(ROOT, members);
      expect(result.quality.kind).toBe("converged");
      const composed = composeMembers(ROOT, members, result);
      for (const item of members) {
        const world = composed[item.id];
        if (world === undefined) throw new Error(`missing composed member ${item.id}`);
        const parent = item.base === "root" ? ROOT : composed[item.base];
        if (parent === undefined) throw new Error(`missing composed parent ${item.base}`);
        const restUnderParent = multiplyMatrix3(
          matrixFromEuler3d(parent),
          matrixFromEuler3d(item.rest),
        );
        const worldMatrix = matrixFromEuler3d(world);
        const direction = [worldMatrix[0], worldMatrix[3], worldMatrix[6]] as const;
        const expected = swingFrame3d(restUnderParent, direction);
        for (let entry = 0; entry < 9; entry += 1)
          expect(Math.abs(worldMatrix[entry]! - expected[entry]!)).toBeLessThanOrEqual(1e-12);
      }
    }

    const zeroRestMembers = [
      member("a", "root", 24),
      member("b", "a", 21),
      member("c", "b", 19, { goal: readFrame3d({ x: 20, y: 15, z: 12 }) }),
    ];
    const zeroResult = solveChain3d(ROOT, zeroRestMembers);
    const zeroComposed = composeMembers(ROOT, zeroRestMembers, zeroResult);
    for (const item of zeroRestMembers) {
      const world = zeroComposed[item.id];
      if (world === undefined) throw new Error(`missing zero-rest member ${item.id}`);
      const parent = item.base === "root" ? ROOT : zeroComposed[item.base];
      if (parent === undefined) throw new Error(`missing zero-rest parent ${item.base}`);
      const worldMatrix = matrixFromEuler3d(world);
      const direction = [worldMatrix[0], worldMatrix[3], worldMatrix[6]] as const;
      const expected = swingFrame3d(matrixFromEuler3d(parent), direction);
      for (let entry = 0; entry < 9; entry += 1)
        expect(Math.abs(worldMatrix[entry]! - expected[entry]!)).toBeLessThanOrEqual(1e-12);
    }
  });

  it("TH-69 places lateral offsets through the parent's rolled frame", () => {
    const goal = readFrame3d({ x: 50, y: 20, z: 30 });
    const members = [
      member("parent", "root", 30, {
        rest: { rotation: 0, rotationX: 70, rotationY: 0 },
      }),
      member("offset-child", "parent", 30, { offset: { x: 0, y: 8, z: 0 } }),
      member("tip", "offset-child", 25, { goal }),
    ];
    const result = solveChain3d(ROOT, members);
    expect(result.quality.kind).toBe("converged");
    const composed = composeMembers(ROOT, members, result);
    const tip = composed.tip;
    if (tip === undefined) throw new Error("missing rolled-offset tip");
    expect(distance3(tip, goal)).toBeLessThanOrEqual(1e-3);

    const parent = composed.parent;
    const child = composed["offset-child"];
    if (parent === undefined || child === undefined)
      throw new Error("missing rolled-offset parent");
    const parentMatrix = matrixFromEuler3d(parent);
    const childMatrix = matrixFromEuler3d(child);
    const parentDirection: Vec3 = [parentMatrix[0], parentMatrix[3], parentMatrix[6]];
    const noRollParent = swingFrame3d(matrixFromEuler3d(ZERO_EULER), parentDirection);
    const wrongPivot = multiplyVector3(noRollParent, [0, 8, 0]);
    const wrongTip: Vec3 = [
      parent.x + wrongPivot[0] + childMatrix[0] * 25,
      parent.y + wrongPivot[1] + childMatrix[3] * 25,
      parent.z + wrongPivot[2] + childMatrix[6] * 25,
    ];
    expect(
      Math.hypot(wrongTip[0] - goal.x, wrongTip[1] - goal.y, wrongTip[2] - goal.z),
    ).toBeGreaterThan(1e-3);
  });

  it("TH-75 preserves direction residuals, restores unreachable scale, and uses +x for zero distance", () => {
    const directionMembers = [
      member("only", "root", 10, { goal: { x: Infinity, y: 0, z: 0, ...ZERO_EULER } }),
    ];
    const direction = solveChain3d(ROOT, directionMembers);
    expect(direction.residuals.only).toBe(Number.POSITIVE_INFINITY);
    expect(direction.quality.residual).toBe(Number.POSITIVE_INFINITY);

    const scale = 2 ** 600;
    const nativeMembers = [
      member("a", "root", 10),
      member("b", "a", 10),
      member("c", "b", 10, { goal: readFrame3d({ x: 100, y: 0, z: 0 }) }),
    ];
    const native = solveChain3d(ROOT, nativeMembers);
    expect(native.quality.kind).toBe("stalled");
    const scaledMembers = [
      member("a", "root", 10 * scale),
      member("b", "a", 10 * scale),
      member("c", "b", 10 * scale, { goal: readFrame3d({ x: 100 * scale, y: 0, z: 0 }) }),
    ];
    const scaled = solveChain3d(ROOT, scaledMembers);
    expect(scaled.quality.residual).toBe(native.quality.residual * scale);
    expect(scaled.residuals.c).toBe(native.residuals.c! * scale);

    expect(place3d([1, 2, 3], [1, 2, 3], 4)).toEqual([5, 2, 3]);
    expect(place3d([1, 2, 3], [1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
});
