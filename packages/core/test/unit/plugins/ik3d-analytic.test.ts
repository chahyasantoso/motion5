import { describe, expect, it } from "vitest";
import {
  composeWorld3d,
  readFrame3d,
  ZERO_EULER,
  ZERO_PIVOT_OFFSET3D,
  type Euler3d,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import { solveTwoBone } from "../../../src/plugins/ik-analytic";
import { solveTwoBone3d } from "../../../src/plugins/ik3d-analytic";

const root: WorldFrame3d = readFrame3d({});
const first = { id: "upper", length: 80, offset: ZERO_PIVOT_OFFSET3D };
const second = { id: "fore", length: 60, offset: ZERO_PIVOT_OFFSET3D };

type Point = { readonly x: number; readonly y: number; readonly z: number };

/** The deterministic xorshift the envelope rigs use, so every seeded case below is reproducible. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

/** Composes a solved pose the way `fk3d` does: rotate in the base frame, then extend along +x. */
function pose(
  base: WorldFrame3d,
  rotations: Readonly<Record<string, Euler3d>>,
  ids: readonly [string, string],
  lengths: readonly [number, number],
) {
  const upper = composeWorld3d(base, { x: 0, y: 0, z: 0, ...rotations[ids[0]]! });
  const elbow = composeWorld3d(upper, { ...ZERO_EULER, x: lengths[0], y: 0, z: 0 });
  const fore = composeWorld3d(elbow, { x: 0, y: 0, z: 0, ...rotations[ids[1]]! });
  const tip = composeWorld3d(fore, { ...ZERO_EULER, x: lengths[1], y: 0, z: 0 });
  return { upper, elbow, tip };
}

function armPose(result: ReturnType<typeof solveTwoBone3d>, base: WorldFrame3d = root) {
  return pose(base, result.rotations3d, ["upper", "fore"], [80, 60]);
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

/** The distance between two angles on the circle, so a wrapped and an unwrapped spelling agree. */
function turnDistance(a: number, b: number): number {
  const d = a - b;
  return Math.abs(d - 360 * Math.round(d / 360));
}

describe("3D analytic two-bone solve", () => {
  it("TH-4 reaches a planar goal on the positive branch with no X or Y rotation", () => {
    const result = solveTwoBone3d(root, readFrame3d({ x: 100, y: 20 }), first, second);
    const { tip } = armPose(result);
    expect(result.quality).toEqual({ kind: "reached", residual: 0 });
    expect(distance(tip, { x: 100, y: 20, z: 0 })).toBeLessThanOrEqual(1e-9);
    for (const id of ["upper", "fore"]) {
      expect(result.rotations3d[id]!.rotationX).toBe(0);
      expect(result.rotations3d[id]!.rotationY).toBe(0);
    }
  });

  it("TH-5 classifies misses and degenerate arms exactly as the 2D closed form does", () => {
    const planar = (x: number, y: number, l1: number, l2: number) =>
      solveTwoBone(
        { x: 0, y: 0, rotation: 0 },
        { x, y, rotation: 0 },
        { id: "a", base: "root", length: l1 },
        { id: "b", base: "a", length: l2 },
      ).quality;
    const spatial = (x: number, y: number, l1: number, l2: number) =>
      solveTwoBone3d(
        root,
        readFrame3d({ x, y }),
        { id: "a", length: l1, offset: ZERO_PIVOT_OFFSET3D },
        { id: "b", length: l2, offset: ZERO_PIVOT_OFFSET3D },
      ).quality;
    const cases: readonly (readonly [number, number, number, number])[] = [
      [200, 0, 80, 60], // too far
      [1, 0, 80, 60], // too near
      [0, 0, 80, 80], // coincident: on the base with l1 === l2
      [0, 0, 80, 60], // on the base but l1 !== l2: too near, not coincident
      [10, 20, 0, 0], // both arms without extent and a goal away from the base: too far
      [0, 0, 0, 0], // both without extent on the base: reached, not coincident
      [30, 40, 50, 0], // no second segment: the first aims, reached
      [30, 40, 0, 50], // no first segment: the second aims, reached
    ];
    for (const [x, y, l1, l2] of cases) expect(spatial(x, y, l1, l2)).toEqual(planar(x, y, l1, l2));
    expect(spatial(10, 20, 0, 0)).toEqual({ kind: "too-far", residual: Math.hypot(10, 20) });

    // The degenerate arms publish exact identities where 2D publishes exact zero angles.
    const noSecond = solveTwoBone3d(
      root,
      readFrame3d({ x: 0, y: 0, z: 50 }),
      { id: "a", length: 50, offset: ZERO_PIVOT_OFFSET3D },
      { id: "b", length: 0, offset: ZERO_PIVOT_OFFSET3D },
    );
    expect(noSecond.rotations3d.b).toEqual(ZERO_EULER);
    const noFirst = solveTwoBone3d(
      root,
      readFrame3d({ x: 0, y: 0, z: 50 }),
      { id: "a", length: 0, offset: ZERO_PIVOT_OFFSET3D },
      { id: "b", length: 50, offset: ZERO_PIVOT_OFFSET3D },
    );
    expect(noFirst.rotations3d.a).toEqual(ZERO_EULER);
    const rest = solveTwoBone3d(root, root, first, {
      id: "fore",
      length: 80,
      offset: ZERO_PIVOT_OFFSET3D,
    });
    expect(rest.quality).toEqual({ kind: "coincident", residual: 160 });
    expect(rest.rotations3d.upper).toEqual(ZERO_EULER);
    expect(rest.rotations3d.fore).toEqual(ZERO_EULER);
  });

  it("TH-6 equals the 2D closed form on 500 seeded planar rigs, modulo whole turns", () => {
    const next = seeded(0x3d6);
    let worstInside = 0;
    let worstAtEdge = 0;
    let worstMiss = 0;
    for (let index = 0; index < 500; index += 1) {
      const rotation = next() * 720 - 360;
      const x = next() * 200 - 100;
      const y = next() * 200 - 100;
      const l1 = 5 + next() * 95;
      const l2 = 5 + next() * 95;
      // Goal azimuths all the way round, goals behind the root, and all three reach-band outcomes.
      const gx = x + (next() * 2 - 1) * (l1 + l2) * 1.2;
      const gy = y + (next() * 2 - 1) * (l1 + l2) * 1.2;
      const base = readFrame3d({ x, y, rotation });
      const spatial = solveTwoBone3d(
        base,
        readFrame3d({ x: gx, y: gy }),
        { id: "upper", length: l1, offset: ZERO_PIVOT_OFFSET3D },
        { id: "fore", length: l2, offset: ZERO_PIVOT_OFFSET3D },
      );
      const planar = solveTwoBone(
        { x, y, rotation },
        { x: gx, y: gy, rotation: 0 },
        { id: "upper", base: "root", length: l1 },
        { id: "fore", base: "upper", length: l2 },
      );
      // `Math.hypot` over three arguments may round the distance one ulp away from two.
      expect(spatial.quality.kind).toBe(planar.quality.kind);
      expect(Math.abs(spatial.quality.residual - planar.quality.residual)).toBeLessThanOrEqual(
        1e-9,
      );
      for (const id of ["upper", "fore"]) {
        expect(spatial.rotations3d[id]!.rotationX).toBe(0);
        expect(spatial.rotations3d[id]!.rotationY).toBe(0);
        const gap = turnDistance(spatial.rotations3d[id]!.rotation, planar.rotations[id]!);
        if (planar.quality.kind === "reached") worstInside = Math.max(worstInside, gap);
        else worstAtEdge = Math.max(worstAtEdge, gap);
      }
      const { tip } = pose(base, spatial.rotations3d, ["upper", "fore"], [l1, l2]);
      const miss = distance(tip, { x: gx, y: gy, z: 0 });
      worstMiss = Math.max(worstMiss, Math.abs(miss - spatial.quality.residual));
    }
    // Not bit identity: the 3D answer is read back from a matrix through `atan2`, which rounds
    // differently from the 2D sum of angles; a 200,000-rig sandbox run of this generator, outside
    // CI, measured 2.1e-11 degrees inside the band.
    // At a band edge the 2D elbow is `acos` of a cosine rounded next to -1 or 1, where `acos` has
    // an infinite slope, so 2D bends a straight arm by up to 2.4e-5 degrees and 3D, which lays the
    // clamped arm out along `e1`, does not. ADR-114 records both.
    expect(worstInside).toBeLessThanOrEqual(1e-9);
    expect(worstAtEdge).toBeLessThanOrEqual(1e-4);
    expect(worstMiss).toBeLessThanOrEqual(1e-9);
  });

  it("TH-17 is continuous across the planar boundary, where a 2D bridge jumped 720 degrees", () => {
    const base = readFrame3d({ rotation: -323.92574921250343 });
    const lengths = [
      { id: "upper", length: 24.2029164123, offset: ZERO_PIVOT_OFFSET3D },
      { id: "fore", length: 43.0485040788, offset: ZERO_PIVOT_OFFSET3D },
    ] as const;
    const at = (z: number) =>
      solveTwoBone3d(
        base,
        readFrame3d({ x: -14.4570728487, y: 20.2751132434, z }),
        lengths[0],
        lengths[1],
      ).rotations3d;
    const below = at(-1e-12);
    const on = at(0);
    const above = at(1e-12);
    for (const id of ["upper", "fore"]) {
      for (const key of ["rotation", "rotationX", "rotationY"] as const) {
        expect(Math.abs(below[id]![key] - on[id]![key])).toBeLessThan(1e-6);
        expect(Math.abs(above[id]![key] - on[id]![key])).toBeLessThan(1e-6);
      }
    }
  });

  it("TH-18 bends toward root-local +y on the one singular line, the root's local z axis", () => {
    const onAxis = solveTwoBone3d(root, readFrame3d({ z: 100 }), first, second);
    expect(onAxis).toEqual(solveTwoBone3d(root, readFrame3d({ z: 100 }), first, second));
    const { elbow, tip } = armPose(onAxis);
    expect(elbow.y).toBeGreaterThan(0);
    expect(Math.abs(elbow.x)).toBeLessThanOrEqual(1e-9);
    expect(distance(tip, { x: 0, y: 0, z: 100 })).toBeLessThanOrEqual(1e-9);

    // Off the axis the pole is root-local +z itself, so a rotated root carries its bend plane.
    const turned = readFrame3d({ x: 5, y: -3, z: 2, rotation: 30, rotationX: 40, rotationY: -20 });
    const goal = composeWorld3d(turned, { ...ZERO_EULER, x: 90, y: 10, z: 0 });
    const carried = solveTwoBone3d(turned, goal, first, second);
    const local = armPose(solveTwoBone3d(root, readFrame3d({ x: 90, y: 10 }), first, second));
    const world = armPose(carried, turned);
    const expected = composeWorld3d(turned, { ...ZERO_EULER, ...local.elbow });
    expect(distance(world.elbow, expected)).toBeLessThanOrEqual(1e-9);
  });

  it("TH-19 closes 600 seeded non-planar rigs, keeps both lengths, and a worked pose", () => {
    const next = seeded(0x349);
    for (let index = 0; index < 600; index += 1) {
      const base = readFrame3d({
        x: next() * 40 - 20,
        y: next() * 40 - 20,
        z: next() * 40 - 20,
        rotation: next() * 360 - 180,
        rotationX: next() * 140 - 70,
        rotationY: next() * 140 - 70,
      });
      const l1 = 20 + next() * 80;
      const l2 = 20 + next() * 80;
      const direction = [next() * 2 - 1, next() * 2 - 1, next() * 2 - 1] as const;
      const size = Math.hypot(...direction);
      const reach = Math.abs(l1 - l2) + next() * (l1 + l2 - Math.abs(l1 - l2));
      const goal = composeWorld3d(base, {
        ...ZERO_EULER,
        x: (direction[0] / size) * reach,
        y: (direction[1] / size) * reach,
        z: (direction[2] / size) * reach,
      });
      const result = solveTwoBone3d(
        base,
        goal,
        { id: "a", length: l1, offset: ZERO_PIVOT_OFFSET3D },
        { id: "b", length: l2, offset: ZERO_PIVOT_OFFSET3D },
      );
      const { upper, elbow, tip } = pose(base, result.rotations3d, ["a", "b"], [l1, l2]);
      expect(result.quality.kind).toBe("reached");
      expect(distance(base, upper)).toBeLessThanOrEqual(1e-9);
      expect(Math.abs(distance(upper, elbow) - l1)).toBeLessThanOrEqual(1e-9);
      expect(Math.abs(distance(elbow, tip) - l2)).toBeLessThanOrEqual(1e-9);
      expect(distance(tip, goal)).toBeLessThanOrEqual(1e-9);
    }

    // Worked by hand: a goal at (60, 0, 80) is 100 away, so 80-60-100 is a right triangle with
    // cos(alpha) = 0.8. e1 = (0.6, 0, 0.8); the pole +z less its e1 part is (-0.48, 0, 0.36), so
    // the normal is (-0.8, 0, 0.6) and e2 = normal x e1 = (0, 1, 0). The elbow is
    // 80 * (0.8 e1 + 0.6 e2) = (38.4, 48, 51.2).
    const worked = armPose(solveTwoBone3d(root, readFrame3d({ x: 60, z: 80 }), first, second));
    expect(distance(worked.elbow, { x: 38.4, y: 48, z: 51.2 })).toBeLessThanOrEqual(1e-9);
    expect(distance(worked.tip, { x: 60, y: 0, z: 80 })).toBeLessThanOrEqual(1e-9);
  });

  it("TH-22 keeps finite extreme geometry finite, at the 2D magnitude policy", () => {
    const finitePose = (result: ReturnType<typeof solveTwoBone3d>) =>
      Object.values(result.rotations3d).every((pose) =>
        Object.values(pose).every((value) => Number.isFinite(value)),
      );
    // Subnormal: a reciprocal of the distance would be `Infinity`, and `0 * Infinity` is `NaN`.
    const tiny = solveTwoBone3d(
      root,
      readFrame3d({ x: Number.MIN_VALUE }),
      { id: "a", length: Number.MIN_VALUE, offset: ZERO_PIVOT_OFFSET3D },
      { id: "b", length: Number.MIN_VALUE, offset: ZERO_PIVOT_OFFSET3D },
    );
    expect(finitePose(tiny)).toBe(true);
    expect(Number.isFinite(tiny.quality.residual)).toBe(true);

    // A finite root orientation past about 5.7e307 degrees overflowed its product with pi, and
    // `sin(Infinity)` is `NaN`; whole turns are reduced first, so it reads as the angle it names.
    const spun = solveTwoBone3d(
      readFrame3d({ rotation: Number.MAX_VALUE, rotationX: -Number.MAX_VALUE, rotationY: 1e306 }),
      readFrame3d({ x: 60, y: 40, z: 50 }),
      first,
      second,
    );
    expect(finitePose(spun)).toBe(true);
    expect(spun.quality.kind).toBe("reached");

    // Near `Number.MAX_VALUE`: the offset between opposite roots overflows unless the rig solves as
    // its power-of-two image, and a residual past the largest double saturates rather than
    // becoming `Infinity`, exactly as the 2D closed form's does.
    const huge = solveTwoBone3d(
      readFrame3d({ x: 1e308 }),
      readFrame3d({ x: -1e308, y: 1e307 }),
      { id: "a", length: 1e307, offset: ZERO_PIVOT_OFFSET3D },
      { id: "b", length: 1e307, offset: ZERO_PIVOT_OFFSET3D },
    );
    expect(finitePose(huge)).toBe(true);
    expect(huge.quality.kind).toBe("too-far");
    expect(huge.quality.residual).toBe(Number.MAX_VALUE);
    expect(huge.residuals.b).toBe(Number.MAX_VALUE);

    // Planar reduction holds past the ceiling too: the same rig solved by 2D agrees.
    const planar = solveTwoBone(
      { x: 1e300, y: 0, rotation: 0 },
      { x: 1e300 + 3e299, y: 4e299, rotation: 0 },
      { id: "upper", base: "root", length: 4e299 },
      { id: "fore", base: "upper", length: 3e299 },
    );
    const spatial = solveTwoBone3d(
      readFrame3d({ x: 1e300 }),
      readFrame3d({ x: 1e300 + 3e299, y: 4e299 }),
      { id: "upper", length: 4e299, offset: ZERO_PIVOT_OFFSET3D },
      { id: "fore", length: 3e299, offset: ZERO_PIVOT_OFFSET3D },
    );
    expect(spatial.quality.kind).toBe(planar.quality.kind);
    for (const id of ["upper", "fore"])
      expect(turnDistance(spatial.rotations3d[id]!.rotation, planar.rotations[id]!)).toBeLessThan(
        1e-9,
      );
  });
});
