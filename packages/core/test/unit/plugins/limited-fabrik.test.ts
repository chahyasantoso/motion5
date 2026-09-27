/** Issue #514 and ADR-126: executable evidence that limited FABRIK no longer traps on a seed-side
 * bound or stops short of a reachable goal, in both dimensions, through the three shared owners
 * (`fabrik-select.ts`, the inward passes with `ik-constraint.ts` / `ik3d-constraint.ts`, and
 * `fabrik-cap.ts`), and that free rigs keep the path they had. Every solve case below fails on the
 * pre-#514 solver: the seed-side rigs end `limited` at a residual of 141 or 153 units, and the
 * premature-termination rigs end `iteration-cap` a few thousandths short at the free cap of 64. */
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
  fabrikIterationCap,
  fabrikPassBudget,
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
  boundBaseDirection,
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

  it("CL-34 the selector pays for the opposite side only on a limited baseline, and keeps the better", () => {
    const quality = (kind: IterativeQuality["kind"]): IterativeQuality =>
      kind === "limited"
        ? { kind, iterations: 1, residual: 5, atBound: ["m"] }
        : { kind, iterations: 1, residual: 5 };
    expect(fabrikAlternatives(quality("converged"))).toEqual([]);
    expect(fabrikAlternatives(quality("stalled"))).toEqual([]);
    expect(fabrikAlternatives(quality("iteration-cap"))).toEqual([]);
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
    // A still-moving limited rig whose residual holds to ten digits: at the plain 4x cap it took 256
    // passes in each dimension to publish the pose it had at 64. Now it stops at 64, both agree.
    const crawl: SolveMember[] = [
      { id: "a", base: "root", length: 67.8, limit: range(-18.8, 81.6) },
      {
        id: "b",
        base: "a",
        length: 62.8,
        limit: range(-9.2, 52.7),
        goal: { x: 140.4, y: 21.2, rotation: 0 },
      },
    ];
    const flat = solveFabrikAttempt(ROOT, crawl, false, "centroid");
    const spatial = solveTree3dAttempt(ROOT3, planar3d(crawl), UNBOUND_POLE3D, false, "centroid");
    for (const quality of [flat.quality, spatial.quality] as IterativeQuality[]) {
      expect(quality.kind).toBe("iteration-cap");
      expect(quality.iterations).toBe(FABRIK_MIN_ITERATIONS);
      expect(quality.residual).toBeCloseTo(11.3915490443, 9);
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
});
