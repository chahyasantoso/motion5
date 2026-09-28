/** Issues #514, #519 and #521, ADR-126, ADR-127 and ADR-128: executable evidence that limited FABRIK no longer
 * traps on a seed-side bound, stops short of a reachable goal, or runs a rounding circle to the
 * cap, in both dimensions, through the three shared owners (`fabrik-select.ts`, the inward passes
 * with `ik-constraint.ts` / `ik3d-constraint.ts`, and `fabrik-cap.ts`), and that free rigs keep the
 * path they had. Every solve case below fails on the pre-#514 solver: the seed-side rigs end
 * `limited` at a residual of 141 or 153 units, and the premature-termination rigs end
 * `iteration-cap` a few thousandths short at the free cap of 64. TH-153 fails on the pre-#519
 * solver: one dimension ends `iteration-cap` where the other ends `stalled`, and on the first #519
 * head for its free rig, where the settle rule still read the constraint. TH-155 and CL-40 fail on
 * the pre-#521 solver, which published an unsettled attempt's last pass rather than its best. */
import { describe, expect, it } from "vitest";
import {
  FABRIK_TOLERANCE,
  solveFabrik,
  solveFabrikAttempt,
  type FabrikSolution,
} from "../../../src/plugins/fabrik";
import {
  FABRIK_LIMITED_CAP_FACTOR,
  FABRIK_MIN_ITERATIONS,
  FABRIK_PROGRESS_WINDOW,
  FABRIK_ROUNDING_ULPS,
  FabrikIncumbent,
  fabrikIterationCap,
  fabrikPassBudget,
  fabrikPassMovement,
  fabrikRelativeMove,
  fabrikResidualOutranks,
  fabrikRoundingBound,
  projectsConvergence,
  type FabrikPassBudget,
} from "../../../src/plugins/fabrik-cap";
import {
  fabrikAlternatives,
  selectFabrik,
  type FabrikAttempt,
} from "../../../src/plugins/fabrik-select";
import {
  axisX3,
  multiplyMatrix3,
  rotationAboutAxis3d,
  swingTwist3d,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import type { WorldFrame } from "../../../src/plugins/frame";
import {
  atBound,
  boundBaseDirection,
  JOINT_BOUND_TOLERANCE,
  FREE_JOINT,
  limitRotation,
  type JointLimit,
  type JointRange,
} from "../../../src/plugins/ik-constraint";
import type { SolveMember } from "../../../src/plugins/ik-member";
import type { IterativeQuality } from "../../../src/plugins/ik-result";
import { solveChain } from "../../../src/plugins/ik-solve";
import { readPole3d, UNBOUND_POLE3D, type Pole3d } from "../../../src/plugins/ik3d-analytic";
import type { ChainMember3d } from "../../../src/plugins/ik3d-chain";
import {
  boundBaseFrame3d,
  FREE_JOINT3D,
  type JointLimit3d,
} from "../../../src/plugins/ik3d-constraint";
import { solveTree3dAttempt } from "../../../src/plugins/ik3d-fabrik";
import { solveChain3d } from "../../../src/plugins/ik3d-solve";
import { iterationsOf } from "../../support/solve-quality";

const ROOT: WorldFrame = { x: 0, y: 0, rotation: 0 };
const ROOT3: WorldFrame3d = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
const ZERO_REST: Euler3d = { rotation: 0, rotationX: 0, rotationY: 0 };
const Z_AXIS: Vec3 = [0, 0, 1];
const Y_AXIS: Vec3 = [0, 1, 0];
const ANGLE_TOLERANCE = 1e-2;
const PLANAR_TOLERANCE = 1e-5;
const MATRIX_TOLERANCE = 1e-9;

const range = (min: number, max: number): JointRange => ({ kind: "range", min, max });

/** A 2D upper arm hanging from the root and a limited forearm reaching for `(x, y)`. */
function elbow2d(limit: JointRange, x: number, y: number, upper = 100, fore = 100): SolveMember[] {
  return [
    { id: "upper", base: "root", length: upper },
    { id: "fore", base: "upper", length: fore, limit, goal: { x, y, rotation: 0 } },
  ];
}

/** The 3D counterpart: the forearm is a hinge about `axis` in the upper arm's frame. */
function elbow3d(
  axis: Vec3,
  limit: JointRange,
  goal: Vec3,
  upper = 100,
  fore = 100,
): ChainMember3d[] {
  const offset = { x: 0, y: 0, z: 0 };
  const hinge: JointLimit3d = { kind: "hinge", axis, range: limit };
  return [
    { id: "upper", base: "root", length: upper, offset, rest: ZERO_REST },
    {
      id: "fore",
      base: "upper",
      length: fore,
      offset,
      rest: ZERO_REST,
      limit: hinge,
      goal: { x: goal[0], y: goal[1], z: goal[2], ...ZERO_REST },
    },
  ];
}

function angleDistance(a: number, b: number): number {
  return Math.abs(a - b - 360 * Math.round((a - b) / 360));
}

function closeMatrix(a: Matrix3, b: Matrix3): void {
  expect(Math.max(...a.map((value, index) => Math.abs(value - b[index]!)))).toBeLessThanOrEqual(
    MATRIX_TOLERANCE,
  );
}

function solve3d(members: readonly ChainMember3d[], pole: Pole3d = UNBOUND_POLE3D) {
  return solveChain3d(ROOT3, members, pole);
}

/** The same serial rig as planar +z hinges, so both dimensions can be held to one statement. */
function planar3d(members: readonly SolveMember[]): ChainMember3d[] {
  const offset = { x: 0, y: 0, z: 0 };
  return members.map(({ id, base, length, limit, goal }) => ({
    id,
    base,
    length,
    offset,
    rest: ZERO_REST,
    ...(limit === undefined
      ? {}
      : { limit: { kind: "hinge" as const, axis: Z_AXIS, range: limit } }),
    ...(goal === undefined ? {} : { goal: { x: goal.x, y: goal.y, z: 0, ...ZERO_REST } }),
  }));
}

/** The first pass count a budget refuses, feeding it `residual(pass)` in pass order. */
function firstRefused(budget: FabrikPassBudget, residual: (pass: number) => number): number {
  let iterations = 0;
  while (budget.admits(iterations, residual(iterations))) iterations += 1;
  return iterations;
}

describe("limited FABRIK: seed side, bidirectional limits and the limited cap (issue #514)", () => {
  it("CL-31 a one-way elbow seeded on its forbidden side reaches a goal its range allows", () => {
    // Pre-#514: `[0, 90]` ended `limited` at 141.42 and `[10, 90]` at 153.21 with the elbow held on
    // its bound, while `flip: true` converged in one pass. The bound is not special at straight.
    for (const limit of [range(0, 90), range(10, 90)]) {
      const authored = solveChain(ROOT, elbow2d(limit, 100, 100), false);
      expect(authored.quality.kind).toBe("converged");
      expect(authored.quality.residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
      expect(angleDistance(authored.rotations.upper!, 0)).toBeLessThan(ANGLE_TOLERANCE);
      expect(angleDistance(authored.rotations.fore!, 90)).toBeLessThan(ANGLE_TOLERANCE);
      // The flipped seed already started on the legal side, so both hints publish one pose.
      expect(solveChain(ROOT, elbow2d(limit, 100, 100), true)).toEqual(authored);
    }
  });

  it("CL-32 a limited chain still converging at the free cap finishes inside the limited cap", () => {
    // Pre-#514: `iteration-cap` at 64 passes, 0.0049 and 0.0034 units short of reachable goals.
    for (const members of [
      elbow2d(range(-93.5, 32.2), -31.8, -91.5, 57.2, 40.4),
      elbow2d(range(-60, 42), -79, 41, 27, 62.7),
    ]) {
      const solved = solveChain(ROOT, members, false);
      expect(solved.quality.kind).toBe("converged");
      expect(iterationsOf(solved.quality)).toBeGreaterThan(FABRIK_MIN_ITERATIONS);
      expect(iterationsOf(solved.quality)).toBeLessThanOrEqual(fabrikIterationCap(2, "limited"));
    }
  });

  it("CL-33 bidirectional enforcement turns the base the least that makes the child legal", () => {
    // A free child and a legal angle return the base direction itself, so no double moves.
    expect(Object.is(boundBaseDirection(FREE_JOINT, 170, -0), -0)).toBe(true);
    expect(boundBaseDirection(range(0, 90), 40, 10)).toBe(10);
    // dir(base) = dir(child) - limitRotation(range, dir(child) - dir(base)).
    expect(boundBaseDirection(range(0, 90), 10, 40)).toBe(10);
    expect(boundBaseDirection(range(0, 90), 150, 40)).toBe(60);
    // The nearer bound on the circle, as the outward rule reads it: local -170 is 20 from 170.
    expect(boundBaseDirection(range(90, 170), 0, 170)).toBe(-170);
    const limits: JointLimit[] = [FREE_JOINT, range(-30, 45), range(0, 120), range(-150, -20)];
    for (const limit of limits)
      for (let child = -180; child <= 180; child += 15)
        for (let base = -180; base <= 180; base += 20) {
          const bounded = boundBaseDirection(limit, child, base);
          expect(limitRotation(limit, child - bounded)).toBeCloseTo(
            limitRotation(limit, child - base),
            9,
          );
        }
  });

  it("CL-34 the selector pays for the opposite side on a limited or capped baseline, and keeps the better", () => {
    const quality = (kind: IterativeQuality["kind"]): IterativeQuality =>
      kind === "limited"
        ? { kind, iterations: 1, residual: 5, atBound: ["m"] }
        : { kind, iterations: 1, residual: 5 };
    expect(fabrikAlternatives(quality("converged"))).toEqual([]);
    expect(fabrikAlternatives(quality("stalled"))).toEqual([]);
    expect(fabrikAlternatives(quality("iteration-cap"))).toEqual([
      { opposite: true, rule: "centroid" },
    ]);
    expect(fabrikAlternatives(quality("limited"))).toEqual([{ opposite: true, rule: "centroid" }]);
    expect(fabrikAlternatives(quality("conflicted"))).toHaveLength(3);
    // A limited baseline pays exactly one attempt, on the other side, and keeps the baseline when
    // that attempt does not strictly outrank it: limits override the bend hint only when forced.
    const calls: [boolean, string][] = [];
    const scripted =
      (other: IterativeQuality): FabrikAttempt<null, never, { quality: IterativeQuality }> =>
      (_root, _members, flip, rule) => {
        calls.push([flip, rule]);
        return { quality: flip ? other : quality("limited") };
      };
    const worse = { kind: "limited", iterations: 1, residual: 9, atBound: ["m"] } as const;
    const kept = selectFabrik(null, [], false, scripted(worse));
    expect(kept.quality).toEqual(quality("limited"));
    expect(calls).toEqual([
      [false, "centroid"],
      [true, "centroid"],
    ]);
    const met = { kind: "converged", iterations: 1, residual: 0 } as const;
    expect(selectFabrik(null, [], false, scripted(met)).quality).toBe(met);
    // A free rig that converges is the single attempt it always was, the same object.
    const free: SolveMember[] = [
      { id: "a", base: "root", length: 50 },
      { id: "b", base: "a", length: 40 },
      { id: "c", base: "b", length: 30, goal: { x: 60, y: 50, rotation: 0 } },
    ];
    let attempts = 0;
    const counting = (...args: Parameters<typeof solveFabrikAttempt>): FabrikSolution => {
      attempts += 1;
      return solveFabrikAttempt(...args);
    };
    const selected = selectFabrik(ROOT, free, false, counting);
    expect(attempts).toBe(1);
    expect(selected).toEqual(solveFabrik(ROOT, free, false));
  });

  it("TH-160 owns a bounded legal-range portfolio without charging met, stalled or 2D solves", () => {
    const miss = { kind: "limited", iterations: 64, residual: 4, atBound: ["m"] } as const;
    const met = { kind: "converged", iterations: 18, residual: 0.0005 } as const;
    const calls: [boolean, string, string][] = [];
    const attempt: FabrikAttempt<null, never, { quality: IterativeQuality }> = (
      _root,
      _members,
      flip,
      rule,
      seed,
    ) => {
      const name = seed?.kind === "legal-range" ? `q${seed.fraction}` : "default";
      calls.push([flip, rule, name]);
      return { quality: name === "q0.75" ? met : miss };
    };
    expect(selectFabrik(null, [], false, attempt, 250).quality).toBe(met);
    expect(calls).toEqual([
      [false, "centroid", "default"],
      [true, "centroid", "default"],
      [false, "centroid", "q0.25"],
      [false, "centroid", "q0.75"],
    ]);
    calls.length = 0;
    selectFabrik(null, [], false, attempt);
    expect(calls).toHaveLength(2);
    for (const kind of ["converged", "stalled"] as const) {
      calls.length = 0;
      selectFabrik(
        null,
        [],
        false,
        () => {
          calls.push([false, "centroid", "default"]);
          return { quality: { kind, iterations: 1, residual: 0 } };
        },
        100,
      );
      expect(calls).toHaveLength(1);
    }
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      (_root, _members, flip) => {
        calls.push([flip, "centroid", "default"]);
        return { quality: flip ? met : miss };
      },
      100,
    );
    expect(calls).toHaveLength(2); // the baseline was outside the 2% gate
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      (_root, _members, flip) => {
        calls.push([flip, "centroid", "default"]);
        return { quality: flip ? met : miss };
      },
      250,
    );
    expect(calls).toHaveLength(4); // within the gate, quartiles can improve even an opposite-side hit
    calls.length = 0;
    selectFabrik(null, [], false, attempt, 100);
    expect(calls).toHaveLength(2); // four units of miss exceed two percent of 100 units of reach
    calls.length = 0;
    selectFabrik(null, [], false, attempt, 10);
    expect(calls).toHaveLength(2); // distant misses do not pay two extra attempts
  });

  it("TH-164 compares every prescribed converged candidate, including both legal quartiles", () => {
    const miss = { kind: "limited", iterations: 1, residual: 0.5, atBound: ["m"] } as const;
    const met = (residual: number) => ({ kind: "converged", iterations: 1, residual }) as const;
    const calls: string[] = [];
    const selected = selectFabrik(
      null,
      [],
      false,
      (_root, _members, flip, _rule, seed) => {
        const name =
          seed?.kind === "legal-range" ? `q${seed.fraction}` : flip ? "opposite" : "base";
        calls.push(name);
        return { quality: name === "q0.75" ? met(0.0001) : name === "q0.25" ? met(0.0004) : miss };
      },
      100,
    );
    expect(calls).toEqual(["base", "opposite", "q0.25", "q0.75"]);
    expect(selected.quality).toEqual(met(0.0001));

    // The existing conflict portfolio has three prescribed attempts, even if the first meets.
    const rules: string[] = [];
    const conflicted = selectFabrik(null, [], false, (_root, _members, flip, rule) => {
      rules.push(`${flip}/${rule}`);
      return {
        quality:
          rules.length === 1
            ? ({ kind: "conflicted", iterations: 1, residual: 1 } as const)
            : met(0.001 / rules.length),
      };
    });
    expect(rules).toEqual([
      "false/centroid",
      "true/centroid",
      "false/reach-circle",
      "true/reach-circle",
    ]);
    expect(conflicted.quality).toEqual(met(0.00025));
  });

  it("TH-168 pays for one endpoint only when both quartiles still miss", () => {
    const miss = { kind: "limited", iterations: 2, residual: 1, atBound: ["m"] } as const;
    const met = { kind: "converged", iterations: 1, residual: 0.0002 } as const;
    const calls: string[] = [];
    const selected = selectFabrik(
      null,
      [],
      false,
      (_root, _members, flip, _rule, seed) => {
        const name =
          seed?.kind === "legal-range" ? `q${seed.fraction}` : flip ? "opposite" : "base";
        calls.push(name);
        return { quality: name === "q0.1" ? met : miss };
      },
      100,
    );
    expect(calls).toEqual(["base", "opposite", "q0.25", "q0.75", "q0.1"]);
    expect(selected.quality).toBe(met);
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      (_root, _members, flip, _rule, seed) => {
        const name =
          seed?.kind === "legal-range" ? `q${seed.fraction}` : flip ? "opposite" : "base";
        calls.push(name);
        return { quality: name === "q0.25" ? met : miss };
      },
      100,
    );
    expect(calls).toEqual(["base", "opposite", "q0.25", "q0.75"]);
  });

  it("CL-35 the inward pass bounds a base by its limited child, so a two-limit chain converges", () => {
    // Pre-#514: `limited` at 7.18 (authored side) and `iteration-cap` at 2.33 (flipped). With the
    // opposite-side retry and the limited cap but no inward bound, both sides still end
    // `iteration-cap` 2.33 short after 256 passes: only bidirectional enforcement reaches it.
    const members: SolveMember[] = [
      { id: "a", base: "root", length: 29.1 },
      { id: "b", base: "a", length: 86.5, limit: range(0, 33.2) },
      {
        id: "c",
        base: "b",
        length: 65.1,
        limit: range(-21.6, 15.8),
        goal: { x: 169.4, y: 51.8, rotation: 0 },
      },
    ];
    for (const flip of [false, true]) {
      const solved = solveChain(ROOT, members, flip);
      expect(solved.quality.kind).toBe("converged");
      expect(iterationsOf(solved.quality)).toBeLessThan(FABRIK_MIN_ITERATIONS);
      expect(solved.rotations.b!).toBeGreaterThanOrEqual(0);
      expect(solved.rotations.b!).toBeLessThanOrEqual(33.2);
      expect(solved.rotations.c!).toBeGreaterThanOrEqual(-21.6);
      expect(solved.rotations.c!).toBeLessThanOrEqual(15.8);
    }
  });

  it("TH-147 a one-way 3D hinge seeded on its forbidden side reaches a goal its range allows", () => {
    // Planar +z hinges: pre-#514 `limited` at 141.42 and 153.21, exactly the 2D residuals.
    for (const limit of [range(0, 90), range(10, 90)]) {
      const solved = solve3d(elbow3d(Z_AXIS, limit, [100, 100, 0]));
      expect(solved.quality.kind).toBe("converged");
      const planar = solveChain(ROOT, elbow2d(limit, 100, 100), false);
      expect(
        angleDistance(solved.rotations3d.upper!.rotation, planar.rotations.upper!),
      ).toBeLessThan(PLANAR_TOLERANCE);
      expect(angleDistance(solved.rotations3d.fore!.rotation, planar.rotations.fore!)).toBeLessThan(
        PLANAR_TOLERANCE,
      );
    }
    // A hinge about the upper arm's +y bends in the xz plane; an authored pole on the side its
    // range forbids seeds there. Pre-#514 `limited` at 141.42; now the opposite side converges and
    // the published forearm is a pure legal turn about +y.
    const pole = readPole3d({ x: 100, y: 0, z: -300 });
    const tilted = solve3d(elbow3d(Y_AXIS, range(0, 90), [100, 0, -100]), pole);
    expect(tilted.quality.kind).toBe("converged");
    expect(tilted.rotations3d.fore!.rotation).toBeCloseTo(0, 6);
    expect(tilted.rotations3d.fore!.rotationX).toBeCloseTo(0, 6);
    expect(tilted.rotations3d.fore!.rotationY).toBeGreaterThanOrEqual(0);
    expect(tilted.rotations3d.fore!.rotationY).toBeLessThanOrEqual(90);
  });

  it("TH-148 a 3D hinge chain still converging at the free cap finishes inside the limited cap", () => {
    // Pre-#514: `iteration-cap` at 64 passes, 0.0048 and 0.0113 units short of reachable goals.
    for (const members of [
      elbow3d(Z_AXIS, range(-165.7, -113.4), [46.7, -61.9, 0], 21.6, 98),
      elbow3d(Z_AXIS, range(-96.5, 22.9), [-14.8, 146.8, 0], 66, 82.5),
    ]) {
      const solved = solve3d(members);
      expect(solved.quality.kind).toBe("converged");
      expect(iterationsOf(solved.quality)).toBeGreaterThan(FABRIK_MIN_ITERATIONS);
      expect(iterationsOf(solved.quality)).toBeLessThanOrEqual(fabrikIterationCap(2, "limited"));
    }
  });

  it("TH-149 the 3D inward bound holds the child, legalises its local and reduces to 2D on +z", () => {
    const child = multiplyMatrix3(
      rotationAboutAxis3d(Z_AXIS, 150),
      rotationAboutAxis3d([1, 0, 0], 12),
    );
    // Free and in-range answers carry no frame.
    expect(boundBaseFrame3d(FREE_JOINT3D, child, rotationAboutAxis3d(Z_AXIS, 40))).toEqual({
      kind: "unmoved",
    });
    const cone: JointLimit3d = { kind: "cone", maxSwing: 60 };
    expect(boundBaseFrame3d(cone, child, rotationAboutAxis3d(Z_AXIS, 140)).kind).toBe("unmoved");
    // Planar +z hinge: the bounded base points where the 2D rule says.
    const planarChild = rotationAboutAxis3d(Z_AXIS, 150);
    const hinge: JointLimit3d = { kind: "hinge", axis: Z_AXIS, range: range(0, 90) };
    for (const base of [40, 20, -100, 170]) {
      const bound = boundBaseFrame3d(hinge, planarChild, rotationAboutAxis3d(Z_AXIS, base));
      expect(bound.kind).toBe("moved");
      if (bound.kind !== "moved") continue;
      const direction = axisX3(bound.frame);
      const expected = boundBaseDirection(range(0, 90), 150, base);
      expect(Math.atan2(direction[1], direction[0]) * (180 / Math.PI)).toBeCloseTo(expected, 9);
      expect(direction[2]).toBeCloseTo(0, 12);
    }
    // Any limit: the bounded base holds the child's frame and leaves its local on the bound, so a
    // second bound moves nothing measurable.
    const bound = boundBaseFrame3d(cone, child, rotationAboutAxis3d([0, 1, 0], 80));
    expect(bound.kind).toBe("moved");
    if (bound.kind === "moved") {
      const local = multiplyMatrix3(transposeMatrix3(bound.frame), child);
      expect(swingTwist3d(local).swingDegrees).toBeCloseTo(60, 9);
      closeMatrix(multiplyMatrix3(bound.frame, local), child);
      const again = boundBaseFrame3d(cone, child, bound.frame);
      if (again.kind === "moved") closeMatrix(again.frame, bound.frame);
    }
  });

  it("TH-152 a legal hinge child leaves its base unmoved inward, as the 2D rule leaves it", () => {
    // A hinge rebuilds its local from the limited angle even in range, so without the tolerance
    // every legal child here came back `moved` with a frame a few ulps off its base.
    const hinge: JointLimit3d = { kind: "hinge", axis: Z_AXIS, range: range(0, 90) };
    const planarChild = rotationAboutAxis3d(Z_AXIS, 150);
    for (const base of [60, 100, 150, 107.25]) {
      expect(boundBaseFrame3d(hinge, planarChild, rotationAboutAxis3d(Z_AXIS, base))).toEqual({
        kind: "unmoved",
      });
      expect(boundBaseDirection(range(0, 90), 150, base)).toBe(base);
    }
    // Off the planar axis, and under a tilted base: a pure in-range turn about the axis is legal.
    const axis: Vec3 = [0.6, 0, 0.8];
    const skewed: JointLimit3d = { kind: "hinge", axis, range: range(-40, 70) };
    const base = multiplyMatrix3(
      rotationAboutAxis3d([0, 1, 0], 33),
      rotationAboutAxis3d(Z_AXIS, 21),
    );
    for (const angle of [-40, -3.5, 0, 55, 70]) {
      const child = multiplyMatrix3(base, rotationAboutAxis3d(axis, angle));
      expect(boundBaseFrame3d(skewed, child, base).kind).toBe("unmoved");
    }
    // A child tilted off its hinge is not legal at any angle, so the base still turns for it.
    const tilted = multiplyMatrix3(
      base,
      multiplyMatrix3(rotationAboutAxis3d(axis, 20), rotationAboutAxis3d([0, 1, 0], 5)),
    );
    expect(boundBaseFrame3d(skewed, tilted, base).kind).toBe("moved");
  });

  it("TH-151 the 3D inward pass bounds a base by its limited hinge child", () => {
    // Pre-#514: `limited` at 90.38; with the retry and the cap but no inward bound, `limited` at
    // 12.53. Only the inward bound reaches it.
    const offset = { x: 0, y: 0, z: 0 };
    const members: ChainMember3d[] = [
      { id: "a", base: "root", length: 50.1, offset, rest: ZERO_REST },
      { id: "b", base: "a", length: 73.4, offset, rest: ZERO_REST },
      {
        id: "c",
        base: "b",
        length: 54.2,
        offset,
        rest: ZERO_REST,
        limit: { kind: "hinge", axis: Z_AXIS, range: range(0, 99.7) },
        goal: { x: 34.1, y: 25.8, z: 0, ...ZERO_REST },
      },
    ];
    const solved = solve3d(members);
    expect(solved.quality.kind).toBe("converged");
    expect(solved.rotations3d.c!.rotation).toBeGreaterThanOrEqual(0);
    expect(solved.rotations3d.c!.rotation).toBeLessThanOrEqual(99.7);
  });

  it("TH-150 the limited cap factor applies to limited chains only", () => {
    expect(fabrikIterationCap(3, "limited")).toBe(
      FABRIK_LIMITED_CAP_FACTOR * fabrikIterationCap(3, "free"),
    );
    // A limited goal that is out of reach is a fixed point after its first passes and exits at
    // once, so the larger cap costs it nothing.
    const far = solveChain(ROOT, elbow2d(range(-45, 45), 500, 0), false);
    expect(far.quality.kind).not.toBe("converged");
    expect(iterationsOf(far.quality)).toBeLessThan(FABRIK_MIN_ITERATIONS);
  });

  it("CL-36 past the free cap a limited attempt continues only while its residual projects convergence", () => {
    // A free chain reads exactly the `iterations < cap` it always read, so its bytes hold.
    const free = fabrikPassBudget(2, "free", FABRIK_TOLERANCE);
    expect(free.admits(63, 50)).toBe(true);
    expect(free.admits(64, 1e-9)).toBe(false);
    expect(FABRIK_PROGRESS_WINDOW).toBe(8);
    // The projection: 1 -> 0.5 over one window needs 8 log2(500) = 71.7 more passes to tolerance.
    expect(projectsConvergence(1, 0.5, FABRIK_TOLERANCE, 72)).toBe(true);
    expect(projectsConvergence(1, 0.5, FABRIK_TOLERANCE, 71)).toBe(false);
    expect(projectsConvergence(1, 1, FABRIK_TOLERANCE, 1e9)).toBe(false);
    expect(projectsConvergence(1, 1.5, FABRIK_TOLERANCE, 1e9)).toBe(false);
    // Total over every double: inside tolerance has arrived, and no rate is read off a non-finite fall.
    expect(projectsConvergence(1, 0, FABRIK_TOLERANCE, 0)).toBe(true);
    expect(projectsConvergence(Infinity, 1, FABRIK_TOLERANCE, 1e9)).toBe(false);
    expect(projectsConvergence(NaN, 1, FABRIK_TOLERANCE, 1e9)).toBe(false);
    expect(projectsConvergence(1, NaN, FABRIK_TOLERANCE, 1e9)).toBe(false);
    const limited = () => fabrikPassBudget(2, "limited", FABRIK_TOLERANCE);
    const ceiling = fabrikIterationCap(2, "limited");
    // A crawl that holds its residual stops at the free cap, as if the chain were free.
    expect(firstRefused(limited(), () => 12)).toBe(FABRIK_MIN_ITERATIONS);
    // 10 * 0.97^k would reach tolerance only after the ceiling; 10 * 0.95^k projects inside it and is
    // re-measured every window until the ceiling, which the budget still enforces on its own.
    expect(firstRefused(limited(), (pass) => 10 * 0.97 ** pass)).toBe(FABRIK_MIN_ITERATIONS);
    expect(firstRefused(limited(), (pass) => 10 * 0.95 ** pass)).toBe(ceiling);
    // A residual that rises within a window stops at that window's boundary.
    const turning = (pass: number) => (pass < 70 ? 10 * 0.9 ** pass : 1);
    expect(firstRefused(limited(), turning)).toBe(FABRIK_MIN_ITERATIONS + FABRIK_PROGRESS_WINDOW);
  });

  it("CL-39 a pass settles an attempt on one rule for every constraint: no movement, or two rounding passes", () => {
    // One tip's move over its path's scale: zero only when it did not move, never underflowing to
    // zero, and unjudgeable (so moving) without a finite positive scale.
    expect(fabrikRelativeMove(0, 300)).toBe(0);
    expect(fabrikRelativeMove(0, 0)).toBe(0);
    expect(fabrikRelativeMove(3e-14, 300)).toBe(1e-16);
    expect(fabrikRelativeMove(Number.MIN_VALUE, 1e300)).toBe(Number.MIN_VALUE);
    expect(fabrikRelativeMove(1e-12, 0)).toBe(Infinity);
    expect(fabrikRelativeMove(1, Infinity)).toBe(Infinity);
    expect(fabrikRelativeMove(NaN, 300)).toBeNaN();
    // The movement union: rounding only inside both the relative band and the world-unit bound,
    // so a large path's band cannot swallow real motion (independent pass QP-4).
    const band = FABRIK_ROUNDING_ULPS * Number.EPSILON;
    const bound = fabrikRoundingBound(FABRIK_TOLERANCE, FABRIK_MIN_ITERATIONS);
    expect(bound).toBe(FABRIK_TOLERANCE / FABRIK_MIN_ITERATIONS);
    const pass = (relative: number, moved = 1e-12) => ({ relative, moved });
    expect(fabrikPassMovement(pass(0, 0), bound)).toBe("still");
    expect(fabrikPassMovement(pass(Number.MIN_VALUE), bound)).toBe("rounding");
    expect(fabrikPassMovement(pass(band, bound), bound)).toBe("rounding");
    expect(fabrikPassMovement(pass(band * 1.01), bound)).toBe("moving");
    expect(fabrikPassMovement(pass(band, bound * 1.01), bound)).toBe("moving");
    expect(fabrikPassMovement(pass(Infinity), bound)).toBe("moving");
    expect(fabrikPassMovement(pass(NaN), bound)).toBe("moving");
    expect(fabrikPassMovement(pass(1e-16, NaN), bound)).toBe("moving");
    // One settle rule whatever the constraint: no movement settles at once; one rounding pass may
    // be a decay's last step, two are a circle around the fixed point; a moving pass in between
    // starts the count again. The constraint reads only how many passes an attempt may take, and
    // through them the world-unit bound: the limited ceiling's is a quarter of the free cap's.
    for (const constraint of ["free", "limited"] as const) {
      const passes = fabrikIterationCap(2, constraint);
      const limit = fabrikRoundingBound(FABRIK_TOLERANCE, passes);
      expect(fabrikPassBudget(2, constraint, FABRIK_TOLERANCE).settles(pass(0, 0))).toBe(true);
      const circling = fabrikPassBudget(2, constraint, FABRIK_TOLERANCE);
      expect(circling.settles(pass(1e-16))).toBe(false);
      expect(circling.settles(pass(1e-3))).toBe(false);
      expect(circling.settles(pass(1e-16))).toBe(false);
      expect(circling.settles(pass(2e-16, limit))).toBe(true);
      const moving = fabrikPassBudget(2, constraint, FABRIK_TOLERANCE);
      for (let step = 0; step < 4; step += 1) expect(moving.settles(pass(band * 2))).toBe(false);
      const coarse = fabrikPassBudget(2, constraint, FABRIK_TOLERANCE);
      for (let step = 0; step < 4; step += 1) {
        expect(coarse.settles(pass(1e-16, limit * 1.01))).toBe(false);
      }
    }
  });

  it("TH-153 a planar rig circling its fixed point by rounding stalls in both dimensions", () => {
    // Issue #519. Each rig reached one planar fixed point in both dimensions, but 2D landed on an
    // exact repeat (`stalled`) while 3D circled it by an ulp until the cap (`iteration-cap`), or,
    // for the third, both circled and published at 64 passes the pose they had after one. The last
    // is free and unreachable: 2D circled one ulp to the cap and 3D landed exactly, and before the
    // settle rule stopped reading the constraint it was pinned as a deliberate boundary. Found by
    // tools/issue519/agreement.ts, seed 11 rigs 2574 and 1266, seed 13, and CL-36's former crawl.
    const rigs: SolveMember[][] = [
      [
        { id: "0", base: "root", length: 96.5, limit: range(-96.6, 43.6) },
        {
          id: "1",
          base: "0",
          length: 59.5,
          limit: range(-57.4, 87.8),
          goal: { x: -12.1, y: -172.5, rotation: 0 },
        },
      ],
      [
        { id: "0", base: "root", length: 74.4, limit: range(-116.5, -55.7) },
        { id: "1", base: "0", length: 75.1 },
        { id: "2", base: "1", length: 63.3, limit: range(-69.4, 29.6) },
        { id: "3", base: "2", length: 86.9, goal: { x: -150.1, y: -308.8, rotation: 0 } },
      ],
      [
        { id: "a", base: "root", length: 67.8, limit: range(-18.8, 81.6) },
        {
          id: "b",
          base: "a",
          length: 62.8,
          limit: range(-9.2, 52.7),
          goal: { x: 140.4, y: 21.2, rotation: 0 },
        },
      ],
      [
        { id: "0", base: "root", length: 49.9 },
        { id: "1", base: "0", length: 69.8 },
        { id: "2", base: "1", length: 77, goal: { x: 91.2, y: 191.2, rotation: 0 } },
      ],
    ];
    for (const rig of rigs) {
      const flat = solveChain(ROOT, rig, false).quality;
      const spatial = solve3d(planar3d(rig)).quality;
      expect(flat.kind).toBe("stalled");
      expect(spatial.kind).toBe("stalled");
      expect(iterationsOf(spatial)).toBe(iterationsOf(flat));
      expect(iterationsOf(flat)).toBeLessThan(FABRIK_MIN_ITERATIONS);
      expect(spatial.residual).toBeCloseTo(flat.residual, 9);
    }
    // Independent pass QP-1: each tip is judged against its own path, so an unrelated branch a
    // million times larger does not make the small arm's real motion read as rounding and stop it
    // 7e-3 short; with one global extent both dimensions stalled after two passes.
    const beside: SolveMember[] = [
      { id: "huge", base: "root", length: 1e12 },
      { id: "0", base: "root", length: 1.4231766843004152, limit: range(-180, 180) },
      { id: "1", base: "0", length: 2.262208159198053, limit: range(-180, 180) },
      {
        id: "2",
        base: "1",
        length: 1.4237958857556805,
        goal: { x: -0.2715464913628341, y: -0.10005973233703944, rotation: 0 },
      },
    ];
    expect(solveChain(ROOT, beside, false).quality.kind).toBe("converged");
    expect(solve3d(planar3d(beside)).quality.kind).toBe("converged");
    // One attempt, no selector: the same answer, so the loop rather than a retry decides it.
    const crawl = rigs[2]!;
    const flat = solveFabrikAttempt(ROOT, crawl, false, "centroid");
    const spatial = solveTree3dAttempt(ROOT3, planar3d(crawl), UNBOUND_POLE3D, false, "centroid");
    for (const quality of [flat.quality, spatial.quality] as IterativeQuality[]) {
      expect(quality.kind).toBe("stalled");
      expect(quality.iterations).toBe(2);
      expect(quality.residual).toBeCloseTo(11.3915490443, 9);
    }
  });

  it("TH-154 a huge path's rounding band does not stall a chain still converging on it", () => {
    // Independent pass QP-4: on 1e15-unit members 1,024 ulps is 227 world units, and the relative
    // band alone stalled this free chain at pass 30 and a residual of 19.7 in both dimensions.
    const l = 1e15;
    const rig: SolveMember[] = [
      { id: "m0", base: "root", length: l },
      {
        id: "m1",
        base: "m0",
        length: l,
        goal: { x: 1799999999997258.5, y: 3141592653.588198, rotation: 0 },
      },
    ];
    const flat = solveFabrikAttempt(ROOT, rig, false, "centroid").quality;
    const spatial = solveTree3dAttempt(
      ROOT3,
      planar3d(rig),
      UNBOUND_POLE3D,
      false,
      "centroid",
    ).quality;
    for (const quality of [flat, spatial] as IterativeQuality[]) {
      expect(quality.kind).toBe("iteration-cap");
      expect(quality.iterations).toBe(FABRIK_MIN_ITERATIONS);
      expect(quality.residual).toBeLessThan(0.05);
    }
  });

  it("CL-37 a 2D bound is read from the angle the outward pass enforced, so it agrees with 3D", () => {
    // Pre-fix the 2D solve re-derived `b`'s local from published directions as -56.69999999999999,
    // one ulp inside its -56.7 bound, and reported only `c` while the 3D solve reported both. The
    // kind decides whether the selector pays for the opposite side, so the dimensions must agree.
    const members: SolveMember[] = [
      { id: "a", base: "root", length: 79.8 },
      { id: "b", base: "a", length: 69.8, limit: range(-56.7, -18.8) },
      {
        id: "c",
        base: "b",
        length: 99.3,
        limit: range(-41.8, -4.5),
        goal: { x: -141.2, y: 17.9, rotation: 0 },
      },
    ];
    const flat = solveChain(ROOT, members, false);
    const spatial = solve3d(planar3d(members));
    expect(flat.quality.kind).toBe("limited");
    expect(spatial.quality.kind).toBe("limited");
    if (flat.quality.kind !== "limited" || spatial.quality.kind !== "limited") return;
    expect(flat.quality.atBound).toEqual(["b", "c"]);
    expect(spatial.quality.atBound).toEqual(flat.quality.atBound);
    expect(flat.rotations.b!).toBeCloseTo(-56.7, 9);
    expect(flat.quality.residual).toBeCloseTo(spatial.quality.residual, 9);
  });

  // The two issue #521 probe rigs (seeds 7 and 17 of the planar agreement probe, rigs 978 and 2028).
  // On the last-pass rule each attempt ran to the cap, and 2D and its +z-hinge 3D equivalent
  // published poses 1 to 4 degrees apart with different `atBound` lists: 2D ["0","3"] against 3D
  // ["3"], and 2D ["1","2"] against 3D ["1"].
  const issue521Rigs: readonly (readonly SolveMember[])[] = [
    [
      { id: "0", base: "root", length: 49.2, limit: range(-61.7, -5.6) },
      { id: "1", base: "0", length: 29.3 },
      { id: "2", base: "1", length: 58.1, limit: range(-87.2, 27.7) },
      {
        id: "3",
        base: "2",
        length: 77.6,
        limit: range(-109.8, -75.1),
        goal: { x: 20.4, y: -58, rotation: 0 },
      },
    ],
    [
      { id: "0", base: "root", length: 42.9 },
      { id: "1", base: "0", length: 74.6, limit: range(-164.2, -106.6) },
      {
        id: "2",
        base: "1",
        length: 21.7,
        limit: range(-34.9, -16.2),
        goal: { x: -58.3, y: -32.6, rotation: 0 },
      },
    ],
  ];

  it("TH-155 an attempt that never settles publishes its best completed pass, not its last", () => {
    // The best completed pass of each rig's attempts: 44.7738384833087 (seed 7, pass 1) and
    // 12.359072645022295 (seed 17, pass 39). The last-pass rule published 54.51863835775088 and
    // 12.705604321460964 in 2D, and 54.54708824706231 and 14.00764589114864 in 3D, so every
    // assertion below fails on it.
    const bests = [44.7738384833087, 12.359072645022295];
    issue521Rigs.forEach((rig, index) => {
      for (const quality of [
        solveChain(ROOT, rig, false).quality,
        solve3d(planar3d(rig)).quality,
      ]) {
        expect(quality.kind).toBe("limited");
        expect(quality.residual).toBeLessThanOrEqual(bests[index]!);
      }
    });
  });

  it("CL-40 the issue #521 rigs publish the same bound members in 2D and 3D", () => {
    for (const rig of issue521Rigs) {
      const flat = solveChain(ROOT, rig, false).quality;
      const spatial = solve3d(planar3d(rig)).quality;
      expect(flat.kind).toBe("limited");
      expect(spatial.kind).toBe("limited");
      if (flat.kind === "limited" && spatial.kind === "limited")
        expect(flat.atBound).toEqual(spatial.atBound);
    }
  });

  it("CL-41 the incumbent holds the first completed pass, then only a strictly better one", () => {
    const incumbent = new FabrikIncumbent();
    expect(incumbent.residual).toBeUndefined();
    // The first offer is always held, even a worse or unordered one: the seed is never offered.
    expect(incumbent.offer(Number.NaN)).toBe(true);
    expect(incumbent.residual).toBeNaN();
    expect(incumbent.offer(Number.POSITIVE_INFINITY)).toBe(true);
    expect(incumbent.offer(3)).toBe(true);
    expect(incumbent.offer(3)).toBe(false);
    expect(incumbent.offer(4)).toBe(false);
    expect(incumbent.offer(Number.NaN)).toBe(false);
    expect(incumbent.offer(2)).toBe(true);
    expect(incumbent.residual).toBe(2);
    // The same order the selector reads within a tier.
    expect(fabrikResidualOutranks(1, 2)).toBe(true);
    expect(fabrikResidualOutranks(2, 2)).toBe(false);
    expect(fabrikResidualOutranks(Number.NaN, 2)).toBe(false);
    expect(fabrikResidualOutranks(2, Number.NaN)).toBe(true);
    expect(fabrikResidualOutranks(Number.NaN, Number.NaN)).toBe(false);
  });

  it("CL-38 a local a few ulps inside a bound rests on it, so 2D and 3D report one kind", () => {
    // Independent pass RV-2: 2D measured -6.661293716169895 against a max of -6.661293716169894
    // and reported `stalled` where 3D reported `limited`; 51 of 3,000 fuzzed planar rigs disagreed.
    const limit = range(-61.81099883746356, -6.661293716169894);
    expect(atBound(limit, -6.661293716169895)).toBe(true);
    expect(atBound(limit, -6.661293716169894 - 10 * JOINT_BOUND_TOLERANCE)).toBe(false);
    expect(atBound(range(-30, 30), 0)).toBe(false);
    expect(atBound(FREE_JOINT, 180)).toBe(false);
  });
});
