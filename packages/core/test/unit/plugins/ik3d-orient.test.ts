/** ADR-124 and issue #500 phase 7: executable evidence for the 3D end-effector orientation step and
 * 3D goal influence: byte identity without `orient`, position priority, the nearest roll, the whole
 * turn of a zero-length leaf, the joint owner still holding, the readers, and influence in the tree
 * solve's branch compromise. */
import { describe, expect, it } from "vitest";
import {
  IDENTITY_MATRIX3,
  LOCAL_X3,
  axisX3,
  matrixFromEuler3d,
  multiplyMatrix3,
  rotationAboutAxis3d,
  swingTwist3d,
  transposeMatrix3,
  ZERO_EULER,
  type Euler3d,
  type Matrix3,
  type WorldFrame3d,
} from "../../../../plugins/src/frame3d";
import { readChainMembers3d, type ChainMember3d } from "../../../../plugins/src/ik3d-chain";
import type { JointLimit3d } from "../../../../plugins/src/ik3d-constraint";
import { orientFreedom, orientLeaves3d, readOrient } from "../../../../plugins/src/ik3d-orient";
import type { SolveResult3d } from "../../../../plugins/src/ik3d-result";
import { solveChain3d } from "../../../../plugins/src/ik3d-solve";
import { composeChain3d, frameDistance3d } from "../../support/fk3d-compose";

const ZERO_OFFSET = Object.freeze({ x: 0, y: 0, z: 0 });
const ROUNDING = 1e-9;

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function frame(random: () => number, reach: number): WorldFrame3d {
  const u = (from: number, to: number): number => from + (to - from) * random();
  return {
    x: u(-reach, reach),
    y: u(-reach, reach),
    z: u(-reach, reach),
    rotation: u(-180, 180),
    rotationX: u(-180, 180),
    rotationY: u(-180, 180),
  };
}

function member(
  id: string,
  base: string,
  length: number,
  extra: Partial<Omit<ChainMember3d, "id" | "base" | "length">> = {},
): ChainMember3d {
  return { id, base, length, offset: ZERO_OFFSET, rest: ZERO_EULER, ...extra };
}

/** A serial chain of `count` members whose leaf reaches for `goal`, with random rests. */
function serial(
  random: () => number,
  count: number,
  goal: WorldFrame3d,
  leaf: Partial<ChainMember3d> = {},
): readonly ChainMember3d[] {
  const members: ChainMember3d[] = [];
  for (let index = 0; index < count; index += 1) {
    const rest: Euler3d = {
      rotation: (random() - 0.5) * 60,
      rotationX: (random() - 0.5) * 60,
      rotationY: (random() - 0.5) * 60,
    };
    const last = index === count - 1;
    members.push(
      member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 10 + 30 * random(), {
        rest,
        ...(last ? { goal, ...leaf } : {}),
      }),
    );
  }
  return members;
}

function orientationOf(frame: WorldFrame3d | Euler3d): Matrix3 {
  return matrixFromEuler3d(frame);
}

/** The geodesic angle between two rotations, in degrees. */
function angle(a: Matrix3, b: Matrix3): number {
  const relative = multiplyMatrix3(transposeMatrix3(a), b);
  const cos = (relative[0] + relative[4] + relative[8] - 1) / 2;
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

function largestDifference(a: readonly number[], b: readonly number[]): number {
  return Math.max(...a.map((value, index) => Math.abs(value - b[index]!)));
}

function withOrient(
  members: readonly ChainMember3d[],
  orient: number | undefined,
): readonly ChainMember3d[] {
  return members.map((entry) => {
    if (entry.goal === undefined) return entry;
    const { orient: _drop, ...rest } = entry;
    return orient === undefined ? rest : { ...rest, orient };
  });
}

/** The leaf's composed world orientation, read through `fk3d` itself. */
function leafWorld(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  result: SolveResult3d,
  leaf: string,
): WorldFrame3d {
  return composeChain3d(root, members, result)[leaf]!;
}

describe("3D end-effector orientation (ADR-124)", () => {
  it("TH-96 a chain with no positive orient on an addressed leaf publishes the position solve itself", () => {
    const random = seeded(0x96);
    for (let trial = 0; trial < 60; trial += 1) {
      const root = frame(random, 50);
      const goal = frame(random, 80);
      const members = serial(random, 2 + (trial % 4), goal);
      const plain = solveChain3d(root, members);
      // `orient` absent, zero, or on a member no goal addresses: the very same result object.
      expect(orientLeaves3d(root, members, plain)).toBe(plain);
      expect(orientLeaves3d(root, withOrient(members, 0), plain)).toBe(plain);
      const inner = members.map((entry, index) => (index === 0 ? { ...entry, orient: 1 } : entry));
      expect(orientLeaves3d(root, inner, plain)).toBe(plain);
      // And through the dispatcher, both strategies, the bytes are the ones it published before.
      expect(solveChain3d(root, withOrient(members, 0))).toStrictEqual(plain);
    }
  });

  it("TH-97 a leaf with length only rolls: no tip, residual, quality or ancestor moves, and the roll is the nearest one", () => {
    const random = seeded(0x97);
    for (let trial = 0; trial < 80; trial += 1) {
      const root = frame(random, 40);
      const goal = frame(random, 90);
      const members = serial(random, 2 + (trial % 5), goal);
      const leaf = members[members.length - 1]!.id;
      const plain = solveChain3d(root, members);
      const plainLeaf = leafWorld(root, members, plain, leaf);
      const goalMatrix = orientationOf(goal);
      let previous = angle(orientationOf(plainLeaf), goalMatrix);
      const turns: number[] = [];
      for (const weight of [0.25, 0.5, 0.75, 1]) {
        const oriented = solveChain3d(root, withOrient(members, weight));
        // Evidence is carried, not recomputed, and every ancestor's triple is byte-identical.
        const step = orientLeaves3d(root, withOrient(members, weight), plain);
        expect(step.residuals).toBe(plain.residuals);
        expect(step.quality).toBe(plain.quality);
        expect(oriented).toStrictEqual(step);
        for (const { id } of members)
          if (id !== leaf) expect(step.rotations3d[id]).toBe(plain.rotations3d[id]);
        const turned = leafWorld(root, members, oriented, leaf);
        // Position keeps priority: the tip and direction `fk3d` composes are the solve's, to rounding.
        expect(frameDistance3d(turned, plainLeaf)).toBeLessThanOrEqual(ROUNDING * 100);
        expect(
          largestDifference(axisX3(orientationOf(turned)), axisX3(orientationOf(plainLeaf))),
        ).toBeLessThanOrEqual(ROUNDING);
        // Each larger weight is at least as near the goal's orientation along the one short arc.
        turns.push(angle(orientationOf(plainLeaf), orientationOf(turned)));
        const now = angle(orientationOf(turned), goalMatrix);
        expect(now).toBeLessThanOrEqual(previous + ROUNDING);
        previous = now;
        if (weight === 1) {
          // No other roll about the bone is nearer the goal than the one published at weight 1.
          const world = orientationOf(plainLeaf);
          for (let degrees = -180; degrees < 180; degrees += 7.5) {
            const rolled = multiplyMatrix3(world, rotationAboutAxis3d(LOCAL_X3, degrees));
            expect(angle(rolled, goalMatrix)).toBeGreaterThanOrEqual(now - 1e-7);
          }
        }
      }
      // `orient` is the fraction of the one short arc about the bone the leaf travels.
      [0.25, 0.5, 0.75].forEach((weight, index) =>
        expect(Math.abs(turns[index]! - weight * turns[3]!)).toBeLessThanOrEqual(1e-6),
      );
    }
  });

  it("TH-98 a zero-length leaf turns wholly: weight 1 is the goal's orientation and a partial weight is the short arc", () => {
    const random = seeded(0x98);
    for (let trial = 0; trial < 60; trial += 1) {
      const root = frame(random, 40);
      const goal = frame(random, 70);
      const arm = serial(random, 2 + (trial % 3), goal);
      // The hand hangs from the last bone with no length, and it is the addressed leaf.
      const last = arm[arm.length - 1]!;
      const { goal: _goal, ...bone } = last;
      const members = [...arm.slice(0, -1), bone, member("hand", last.id, 0, { goal })];
      const plain = solveChain3d(root, members);
      const plainHand = orientationOf(leafWorld(root, members, plain, "hand"));
      const full = solveChain3d(root, withOrient(members, 1));
      const fullFrames = composeChain3d(root, members, full);
      expect(
        largestDifference(orientationOf(fullFrames.hand!), orientationOf(goal)),
      ).toBeLessThanOrEqual(ROUNDING);
      // The hand's tip is its pivot, which its own orientation cannot move.
      expect(frameDistance3d(fullFrames.hand!, leafWorld(root, members, plain, "hand"))).toBe(0);
      const half = orientationOf(
        leafWorld(root, members, solveChain3d(root, withOrient(members, 0.5)), "hand"),
      );
      const whole = angle(plainHand, orientationOf(goal));
      if (whole < 179) {
        expect(Math.abs(angle(plainHand, half) - whole / 2)).toBeLessThanOrEqual(1e-6);
        expect(Math.abs(angle(half, orientationOf(goal)) - whole / 2)).toBeLessThanOrEqual(1e-6);
      }
    }
    expect(orientFreedom(0)).toBe("whole");
    expect(orientFreedom(-3)).toBe("whole");
    expect(orientFreedom(Number.NaN)).toBe("whole");
    expect(orientFreedom(1e-300)).toBe("roll");
  });

  it("TH-99 the joint owner still holds: a swing-twist caps the roll, a cone keeps it, and a hinge keeps its one degree of freedom", () => {
    const root: WorldFrame3d = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
    const goal: WorldFrame3d = { x: 30, y: 25, z: 12, rotation: 40, rotationX: 75, rotationY: 20 };
    const chain = (limit: JointLimit3d | undefined, orient?: number): readonly ChainMember3d[] => [
      member("a", "root", 25),
      member("b", "a", 25),
      member("c", "b", 20, {
        goal,
        ...(limit === undefined ? {} : { limit }),
        ...(orient === undefined ? {} : { orient }),
      }),
    ];
    const twistOf = (result: SolveResult3d): number =>
      swingTwist3d(orientationOf(result.rotations3d.c!)).twistDegrees;
    const free = solveChain3d(root, chain(undefined, 1));
    const freeTwist = twistOf(free);
    expect(Math.abs(freeTwist)).toBeGreaterThan(10);

    const capped: JointLimit3d = {
      kind: "swing-twist",
      maxSwing: 180,
      twist: { kind: "range", min: -10, max: 10 },
    };
    const held = solveChain3d(root, chain(capped, 1));
    expect(Math.abs(twistOf(held) - Math.sign(freeTwist) * 10)).toBeLessThanOrEqual(ROUNDING);
    const heldPlain = solveChain3d(root, chain(capped));
    expect(
      largestDifference(
        axisX3(orientationOf(held.rotations3d.c!)),
        axisX3(orientationOf(heldPlain.rotations3d.c!)),
      ),
    ).toBeLessThanOrEqual(ROUNDING);
    expect(held.quality).toStrictEqual(heldPlain.quality);
    expect(held.residuals).toStrictEqual(heldPlain.residuals);

    // A cone limits the swing only, so it keeps the whole roll a free leaf takes.
    const cone: JointLimit3d = { kind: "cone", maxSwing: 170 };
    const coned = solveChain3d(root, chain(cone, 1));
    const conedPlain = solveChain3d(root, chain(cone));
    expect(swingTwist3d(orientationOf(coned.rotations3d.c!)).swingDegrees).toBeLessThanOrEqual(
      170 + ROUNDING,
    );
    expect(
      angle(orientationOf(leafWorld(root, chain(cone), coned, "c")), orientationOf(goal)),
    ).toBeLessThan(
      angle(orientationOf(leafWorld(root, chain(cone), conedPlain, "c")), orientationOf(goal)),
    );

    // A hinge about the parent's +z: the direction fixes its angle, so the roll is not its to give.
    const hinge: JointLimit3d = {
      kind: "hinge",
      axis: [0, 0, 1],
      range: { kind: "range", min: -170, max: 170 },
    };
    const hinged = solveChain3d(root, chain(hinge, 1));
    const hingedPlain = solveChain3d(root, chain(hinge));
    expect(
      largestDifference(
        orientationOf(hinged.rotations3d.c!),
        orientationOf(hingedPlain.rotations3d.c!),
      ),
    ).toBeLessThanOrEqual(ROUNDING);

    // A hinge about the bone's own +x only rolls, so the orientation step turns it, within range.
    const rolling: JointLimit3d = {
      kind: "hinge",
      axis: [1, 0, 0],
      range: { kind: "range", min: -30, max: 30 },
    };
    const single = (orient?: number): readonly ChainMember3d[] => [
      member("c", "root", 20, {
        goal,
        limit: rolling,
        ...(orient === undefined ? {} : { orient }),
      }),
    ];
    const rolled = solveChain3d(root, single(1));
    const local = orientationOf(rolled.rotations3d.c!);
    expect(largestDifference(axisX3(local), LOCAL_X3)).toBeLessThanOrEqual(ROUNDING);
    const turn = swingTwist3d(local).twistDegrees;
    expect(Math.abs(turn)).toBeLessThanOrEqual(30 + ROUNDING);
    expect(
      angle(orientationOf(leafWorld(root, single(), rolled, "c")), orientationOf(goal)),
    ).toBeLessThan(
      angle(
        orientationOf(leafWorld(root, single(), solveChain3d(root, single()), "c")),
        orientationOf(goal),
      ),
    );
  });

  it("TH-100 the readers: orient is a finite weight in [0, 1], and a member carries each goal weight only in its domain", () => {
    for (const value of [0, 0.25, 1]) expect(readOrient({ orient: value })).toBe(value);
    for (const value of [-0.01, 1.01, Number.NaN, Number.POSITIVE_INFINITY, "1", true, null])
      expect(readOrient({ orient: value })).toBeUndefined();
    expect(readOrient({})).toBeUndefined();
    const delivered = [
      { id: "a", base: "root", progress: 0, values: { length: 10, influence: 3, orient: 0.5 } },
      {
        id: "b",
        base: "a",
        progress: 0,
        values: { length: 10, influence: 0, orient: 2 },
        goal: { x: 5, y: 5, z: 5 },
      },
    ];
    const [a, b] = readChainMembers3d(delivered, undefined);
    expect(a).toMatchObject({ influence: 3, orient: 0.5 });
    expect(Object.hasOwn(b!, "influence")).toBe(false);
    expect(Object.hasOwn(b!, "orient")).toBe(false);
    // A member authoring neither builds the record it built before either key existed.
    const [bare] = readChainMembers3d([{ ...delivered[0]!, values: { length: 10 } }], undefined);
    expect(Object.keys(bare!)).toEqual(["id", "base", "length", "offset", "rest"]);
    // The step is pure: frozen inputs, and a second call publishes the same bytes.
    const root = Object.freeze({ x: 1, y: 2, z: 3, rotation: 10, rotationX: 20, rotationY: 30 });
    const goal = Object.freeze({ x: 20, y: 25, z: 5, rotation: 80, rotationX: -20, rotationY: 45 });
    const members = Object.freeze([
      Object.freeze(member("a", "root", 20)),
      Object.freeze(member("b", "a", 20, { goal, orient: 0.7 })),
    ]);
    expect(solveChain3d(root, members)).toStrictEqual(solveChain3d(root, members));
    expect(IDENTITY_MATRIX3).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  it("TH-101 influence weighs the 3D tree solve's branch compromise through the 2D goal owner, and does nothing to one goal", () => {
    const root: WorldFrame3d = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
    const goalA: WorldFrame3d = { x: 60, y: 55, z: 20, rotation: 0, rotationX: 0, rotationY: 0 };
    const goalB: WorldFrame3d = { x: 60, y: -55, z: -20, rotation: 0, rotationX: 0, rotationY: 0 };
    const tree = (influence?: number, other?: number): readonly ChainMember3d[] => [
      member("shared", "root", 40),
      member("a", "shared", 40, {
        goal: goalA,
        ...(influence === undefined ? {} : { influence }),
      }),
      member("b", "shared", 40, {
        goal: goalB,
        ...(other === undefined ? {} : { influence: other }),
      }),
    ];
    const plain = solveChain3d(root, tree());
    expect(solveChain3d(root, tree(1))).toStrictEqual(plain);
    let previous = plain.residuals.a!;
    let opposite = plain.residuals.b!;
    for (const influence of [2, 4, 8]) {
      const weighted = solveChain3d(root, tree(influence));
      expect(weighted.residuals.a!).toBeLessThan(previous);
      expect(weighted.residuals.b!).toBeGreaterThan(opposite);
      previous = weighted.residuals.a!;
      opposite = weighted.residuals.b!;
    }
    // Scaling every influence by one factor changes nothing: the weights are relative.
    const scaled = (factor: number): readonly ChainMember3d[] =>
      tree().map((entry) =>
        entry.goal === undefined
          ? entry
          : { ...entry, influence: entry.id === "a" ? 3 * factor : factor },
      );
    expect(solveChain3d(root, scaled(1))).toStrictEqual(solveChain3d(root, scaled(4)));
    // One goal has nobody to compromise with, on the closed form and on the tree solve alike.
    const pair = (influence?: number): readonly ChainMember3d[] => [
      member("upper", "root", 30),
      member("fore", "upper", 30, {
        goal: goalA,
        ...(influence === undefined ? {} : { influence }),
      }),
    ];
    expect(solveChain3d(root, pair(7))).toStrictEqual(solveChain3d(root, pair()));
    const long = (influence?: number): readonly ChainMember3d[] => [
      member("m0", "root", 20),
      member("m1", "m0", 20),
      member("m2", "m1", 20, { goal: goalA, ...(influence === undefined ? {} : { influence }) }),
    ];
    expect(solveChain3d(root, long(7))).toStrictEqual(solveChain3d(root, long()));
  });

  it("TH-108 orients every addressed leaf of a branched tree with pivot offsets, each by its own freedom, and moves nothing else", () => {
    const random = seeded(0x108);
    const offset = () => ({
      x: (random() - 0.5) * 10,
      y: (random() - 0.5) * 10,
      z: (random() - 0.5) * 10,
    });
    for (let trial = 0; trial < 40; trial += 1) {
      const root = frame(random, 30);
      const goalA = frame(random, 70);
      const goalB = frame(random, 70);
      const plainMembers: readonly ChainMember3d[] = [
        member("spine", "root", 25, { offset: offset() }),
        member("upper", "spine", 20, { offset: offset() }),
        member("finger", "upper", 15, {
          offset: offset(),
          goal: goalA,
        }),
        // A zero-length hand with an offset: its tip is its pivot, so it turns wholly.
        member("hand", "spine", 0, {
          offset: offset(),
          goal: goalB,
        }),
      ];
      const plain = solveChain3d(root, plainMembers);
      const plainFrames = composeChain3d(root, plainMembers, plain);
      const oriented = withOrient(plainMembers, 1);
      const result = solveChain3d(root, oriented);
      expect(result.residuals).toStrictEqual(plain.residuals);
      expect(result.quality).toStrictEqual(plain.quality);
      for (const id of ["spine", "upper"])
        expect(result.rotations3d[id]).toStrictEqual(plain.rotations3d[id]);
      const frames = composeChain3d(root, oriented, result);
      for (const id of ["finger", "hand"])
        expect(frameDistance3d(frames[id]!, plainFrames[id]!)).toBeLessThanOrEqual(ROUNDING * 100);
      // The finger only rolls: its long axis is the solve's.
      expect(
        largestDifference(
          axisX3(orientationOf(frames.finger!)),
          axisX3(orientationOf(plainFrames.finger!)),
        ),
      ).toBeLessThanOrEqual(ROUNDING);
      // The hand takes the goal's orientation outright at a weight of 1.
      expect(
        largestDifference(orientationOf(frames.hand!), orientationOf(goalB)),
      ).toBeLessThanOrEqual(ROUNDING);
    }
  });

  it("TH-110 a hinge about an arbitrary axis keeps its one degree of freedom under orient, and the published orientation stays a legal hinge turn", () => {
    const root: WorldFrame3d = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
    const goal: WorldFrame3d = {
      x: 20,
      y: 30,
      z: 18,
      rotation: -35,
      rotationX: 60,
      rotationY: 110,
    };
    const axis = [2 / 3, 1 / 3, 2 / 3] as const;
    const hinge: JointLimit3d = {
      kind: "hinge",
      axis,
      range: { kind: "range", min: -120, max: 120 },
    };
    const chain = (orient?: number): readonly ChainMember3d[] => [
      member("a", "root", 25),
      member("b", "a", 20, {
        goal,
        limit: hinge,
        ...(orient === undefined ? {} : { orient }),
      }),
    ];
    const oriented = solveChain3d(root, chain(1));
    const plain = solveChain3d(root, chain());
    const local = orientationOf(oriented.rotations3d.b!);
    // A hinge turn fixes its own axis: R · axis = axis.
    const turnedAxis = [0, 1, 2].map(
      (row) =>
        local[row * 3]! * axis[0] + local[row * 3 + 1]! * axis[1] + local[row * 3 + 2]! * axis[2],
    );
    expect(largestDifference(turnedAxis, axis)).toBeLessThanOrEqual(ROUNDING);
    // The direction the position solve chose fixes the hinge angle, so the roll is not its to give.
    expect(largestDifference(local, orientationOf(plain.rotations3d.b!))).toBeLessThanOrEqual(
      ROUNDING,
    );
    expect(oriented.residuals).toStrictEqual(plain.residuals);
    expect(oriented.quality).toStrictEqual(plain.quality);
  });
});
