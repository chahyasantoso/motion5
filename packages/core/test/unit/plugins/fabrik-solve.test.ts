import { describe, expect, it } from "vitest";
import {
  arcHalfAngle,
  FABRIK_MAX_ITERATIONS,
  FABRIK_TOLERANCE,
  seedArc,
  solveFabrik,
  type FabrikMember,
  type FabrikPoint,
} from "../../../src/plugins/fabrik";
import type { WorldFrame } from "../../../src/plugins/frame";
import { solveTwoBone, type MemberState } from "../../../src/plugins/ik";

// Slice D2 of issue #195: FABRIK as arithmetic, before anything wires it.
//
// `plugins/fabrik.ts` is imported by nothing under `src/`, so no rig can reach it and no published
// value can change. That is the point of the slice: the numerical method is reviewed on its own,
// and the dispatcher that chooses between it and the closed form is a separate change with its own
// regression pin. Every case below therefore calls the solver directly.
//
// Assertions are stated against `FABRIK_TOLERANCE` rather than against typed literals wherever the
// answer is iterative. An exact expectation on a converged position would pin a floating-point
// trajectory rather than a result, and the next honest change to the seed would fail it for no
// reason. The two places a literal is right are the closed-form comparison, where the analytic
// numbers are the evidence, and the degenerate cases, where the answer is exact.

const ROOT: WorldFrame = { x: 200, y: 300, rotation: 0 };
const UPPER = "walker/upper-arm";
const FOREARM = "walker/forearm";

function at(x: number, y: number): WorldFrame {
  return { x, y, rotation: 0 };
}

function bone(id: string, base: string, length: number): FabrikMember {
  return { id, base, length };
}

/** A chain leaf: the same member, plus the goal that makes it addressed. */
function tip(id: string, base: string, length: number, goal: WorldFrame): FabrikMember {
  return { id, base, length, goal };
}

function memberState(id: string, base: string, length: number): MemberState {
  return { id, base, values: { length }, progress: 0 };
}

function distance(a: FabrikPoint, b: FabrikPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Twice the signed area of `a, b, c`. Zero exactly when the three points are colinear. */
function cross(a: FabrikPoint, b: FabrikPoint, c: FabrikPoint): number {
  return (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
}

const HAND = at(320, 340);
const TWO_BONE: readonly FabrikMember[] = [
  bone(UPPER, "walker/shoulder", 80),
  tip(FOREARM, UPPER, 60, HAND),
];

const THREE_BONE: readonly FabrikMember[] = [
  bone("a", "root", 80),
  bone("b", "a", 60),
  tip("c", "b", 40, at(300, 380)),
];

const FIVE_BONE: readonly FabrikMember[] = [
  bone("m1", "root", 40),
  bone("m2", "m1", 40),
  bone("m3", "m2", 40),
  bone("m4", "m3", 40),
  tip("m5", "m4", 40, at(260, 380)),
];

/** Two branches off one sub-base, both goals inside reach. */
const TREE: readonly FabrikMember[] = [
  bone("spine", "hip", 50),
  bone("arm-l", "spine", 40),
  tip("fore-l", "arm-l", 30, at(240, 400)),
  bone("arm-r", "spine", 40),
  tip("fore-r", "arm-r", 30, at(160, 400)),
];

/**
 * The same tree with the goals pulled apart until no pose satisfies both.
 *
 * Each goal is inside its own branch's reach, and they are mirrored about the root, so the only
 * question left is what the shared sub-base does when its branches disagree.
 */
const CONTESTED_TREE: readonly FabrikMember[] = [
  bone("spine", "hip", 50),
  bone("arm-l", "spine", 40),
  tip("fore-l", "arm-l", 30, at(260, 400)),
  bone("arm-r", "spine", 40),
  tip("fore-r", "arm-r", 30, at(140, 400)),
];

/** MINSTD, as `RS-3` and `MG-10` use it: a fixed run of twenty different permutations. */
function nextState(state: number): number {
  return (state * 16807) % 2147483647;
}

function shuffle(members: readonly FabrikMember[], seed: number): FabrikMember[] {
  const result = [...members];
  let state = nextState(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = nextState(state);
    const swap = state % (index + 1);
    const held = result[index]!;
    result[index] = result[swap]!;
    result[swap] = held;
  }
  return result;
}

describe("FABRIK over a solver chain (Slice D2)", () => {
  it("FB-1 a two-bone chain reaches its goal and keeps both segment lengths", () => {
    const solution = solveFabrik(ROOT, TWO_BONE);

    expect(solution.convergence.converged).toBe(true);
    expect(solution.convergence.stalled).toBe(false);
    expect(solution.convergence.iterations).toBeLessThan(FABRIK_MAX_ITERATIONS);
    expect(solution.convergence.residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(distance(solution.tips[FOREARM]!, HAND)).toBeLessThanOrEqual(FABRIK_TOLERANCE);

    // Lengths are the invariant the tolerance does not cover: an iteration that reached the goal by
    // stretching a bone would converge and be wrong.
    expect(distance(ROOT, solution.tips[UPPER]!)).toBeCloseTo(80, 9);
    expect(distance(solution.tips[UPPER]!, solution.tips[FOREARM]!)).toBeCloseTo(60, 9);

    // And the rotations are local. Turning the root turns the first member's frame of reference and
    // nothing else, because the goal is a world position and the pose that reaches it is unchanged.
    const turned = solveFabrik({ ...ROOT, rotation: 30 }, TWO_BONE);
    expect(turned.rotations[UPPER]!).toBeCloseTo(solution.rotations[UPPER]! - 30, 9);
    expect(turned.rotations[FOREARM]!).toBeCloseTo(solution.rotations[FOREARM]!, 9);
  });

  it("FB-2 both elbow branches agree with the closed form", () => {
    // The evidence is deliberately ADR-051's worked rig: `IK-1` and `IK-3` pin `40.168` and
    // `-51.318` for this root, goal and pair of lengths, so agreement here says the iterative path
    // lands on the same two configurations rather than on some other pose that also reaches.
    //
    // The bound is angular and derived rather than typed to taste: a positional residual of at most
    // `FABRIK_TOLERANCE` over the shorter 60-unit bone is about `0.001` of a degree, and the bound
    // is ten times that, so the case pins agreement without pinning a trajectory.
    const bound = 0.01;
    const analytic = [memberState(UPPER, "walker/shoulder", 80), memberState(FOREARM, UPPER, 60)];

    for (const flip of [false, true]) {
      const closed = solveTwoBone(ROOT, HAND, analytic, flip);
      const iterative = solveFabrik(ROOT, TWO_BONE, flip);
      expect(iterative.convergence.converged).toBe(true);
      expect(Math.abs(iterative.rotations[UPPER]! - closed[UPPER]!)).toBeLessThan(bound);
      expect(Math.abs(iterative.rotations[FOREARM]! - closed[FOREARM]!)).toBeLessThan(bound);
    }

    // The two branches are genuinely different poses, so neither assertion above can pass by the
    // solve ignoring `flip` and both comparisons landing on one answer.
    const closed = solveTwoBone(ROOT, HAND, analytic, false);
    const mirrored = solveTwoBone(ROOT, HAND, analytic, true);
    expect(Math.abs(closed[UPPER]! - mirrored[UPPER]!)).toBeGreaterThan(1);
  });

  it("FB-3 chains past arity two reach their goal", () => {
    const three = solveFabrik(ROOT, THREE_BONE);
    expect(three.convergence.converged).toBe(true);
    expect(distance(three.tips.c!, at(300, 380))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(distance(ROOT, three.tips.a!)).toBeCloseTo(80, 9);
    expect(distance(three.tips.a!, three.tips.b!)).toBeCloseTo(60, 9);
    expect(distance(three.tips.b!, three.tips.c!)).toBeCloseTo(40, 9);

    const five = solveFabrik(ROOT, FIVE_BONE);
    expect(five.convergence.converged).toBe(true);
    expect(five.convergence.iterations).toBeLessThan(FABRIK_MAX_ITERATIONS);
    expect(distance(five.tips.m5!, at(260, 380))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(distance(five.tips.m4!, five.tips.m5!)).toBeCloseTo(40, 9);
  });

  it("FB-4 the derived seed bends, except at full extension", () => {
    // This is the case that has to hold the line. A colinear seed is a fixed point for both passes,
    // so a straight seed does not converge slowly, it does not converge at all for a goal off the
    // line and picks the wrong side for one on it. The bend is therefore load-bearing, and it fails
    // silently: the solve still returns a pose, and the pose is simply wrong.
    const bent = seedArc(ROOT, HAND, [80, 60]);
    expect(cross(ROOT, bent[0]!, bent[1]!)).not.toBe(0);
    expect(distance(bent[1]!, HAND)).toBeCloseTo(0, 9);

    // Mirrored by `flip`, on the other side of the same chord, which is what makes the two elbow
    // branches reachable at all.
    const mirrored = seedArc(ROOT, HAND, [80, 60], true);
    expect(Math.sign(cross(ROOT, mirrored[0]!, mirrored[1]!))).toBe(
      -Math.sign(cross(ROOT, bent[0]!, bent[1]!)),
    );

    // Fully extended is the one pose where colinear is the answer rather than the trap, and it is
    // exact rather than close: the arc half-angle is zero, so no lateral term is added at all.
    const extended = seedArc(ROOT, at(340, 300), [80, 60]);
    expect(cross(ROOT, extended[0]!, extended[1]!)).toBe(0);
    expect(extended[0]!).toEqual({ x: 280, y: 300 });

    // The half-angle itself: a straight chord is no bend, a folded one is a half turn.
    expect(arcHalfAngle(1)).toBeLessThan(1e-9);
    expect(arcHalfAngle(0)).toBeCloseTo(Math.PI, 12);
  });

  it("FB-5 two goals sharing one sub-base are both solved, and contention is deterministic", () => {
    const tree = solveFabrik(ROOT, TREE);
    expect(tree.convergence.converged).toBe(true);
    expect(distance(tree.tips["fore-l"]!, at(240, 400))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(distance(tree.tips["fore-r"]!, at(160, 400))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(distance(ROOT, tree.tips.spine!)).toBeCloseTo(50, 9);
    expect(distance(tree.tips.spine!, tree.tips["arm-l"]!)).toBeCloseTo(40, 9);
    expect(distance(tree.tips.spine!, tree.tips["arm-r"]!)).toBeCloseTo(40, 9);

    // When the branches cannot both be satisfied, the sub-base takes the average of what they ask
    // for. Mirrored goals therefore leave it on the axis of symmetry and the two branches in mirror
    // poses: a solve that let one branch win, or that averaged in an order the input decided, would
    // pull it off the axis instead.
    const contested = solveFabrik(ROOT, CONTESTED_TREE);
    expect(contested.convergence.converged).toBe(false);
    expect(contested.tips.spine!.x).toBeCloseTo(200, 9);
    expect(contested.tips["arm-l"]!.x + contested.tips["arm-r"]!.x).toBeCloseTo(400, 9);
    expect(contested.tips["arm-l"]!.y).toBeCloseTo(contested.tips["arm-r"]!.y, 9);
  });

  it("FB-6 a solve that does not converge says which way it stopped", () => {
    // An unreachable goal: the chain extends toward it and then holds, because a fully extended
    // chain is a fixed point of both passes. Reported as stalled, in one iteration rather than at
    // the cap, so a caller is not told to raise a cap that would change nothing.
    const unreachable = solveFabrik(ROOT, [bone("a", "root", 30), tip("b", "a", 20, at(600, 300))]);
    expect(unreachable.convergence.converged).toBe(false);
    expect(unreachable.convergence.stalled).toBe(true);
    expect(unreachable.convergence.iterations).toBe(1);
    // Exactly the shortfall: 400 units away, 50 units of chain.
    expect(unreachable.convergence.residual).toBeCloseTo(350, 9);
    expect(unreachable.tips.b!).toEqual({ x: 250, y: 300 });
    expect(unreachable.rotations.a!).toBe(0);
    expect(unreachable.rotations.b!).toBe(0);

    // A goal just inside reach is the other exit. FABRIK contracts linearly and its rate degrades
    // toward one as a chain straightens, so this one is still improving when the cap arrives. It is
    // reported as unconverged with its residual rather than as success, which is the whole reason
    // the residual is returned.
    const slow = solveFabrik(ROOT, [bone("a", "root", 50), tip("b", "a", 40, at(280, 340))]);
    expect(slow.convergence.converged).toBe(false);
    expect(slow.convergence.stalled).toBe(false);
    expect(slow.convergence.iterations).toBe(FABRIK_MAX_ITERATIONS);
    expect(slow.convergence.residual).toBeGreaterThan(FABRIK_TOLERANCE);
    expect(slow.convergence.residual).toBeLessThan(0.01);
  });

  it("FB-7 the solve is deterministic under member permutation", () => {
    // Order is derived inside the solve rather than trusted from the caller, so this is byte
    // identity and not closeness. It matters twice: floating-point addition is not associative, so
    // a sub-base average is only a value once the sequence is fixed, and both passes walk the same
    // sequence in opposite directions.
    const reference = JSON.stringify(solveFabrik(ROOT, TREE));
    const identity = TREE.map((member) => member.id).join(",");
    const permutations = new Set<string>();

    for (let seed = 9; seed <= 28; seed += 1) {
      const permuted = shuffle(TREE, seed);
      permutations.add(permuted.map((member) => member.id).join(","));
      expect(JSON.stringify(solveFabrik(ROOT, permuted))).toEqual(reference);
    }

    // Twenty iterations have to be twenty different rigs, per the finding `RS-3` records.
    expect(permutations.size).toBe(20);
    expect(permutations.has(identity)).toBe(false);
  });

  it("FB-8 degenerate segments produce a defined pose rather than NaN", () => {
    // A zero-length chain cannot move, and the answer is a real pose with a real shortfall. The
    // failure this refuses is a `NaN` out of a zero-distance normalisation: it would reach a
    // published frame, fail the publisher's renderer-neutrality check, and block every child of the
    // node that published it.
    const zero = solveFabrik(ROOT, [bone("a", "root", 0), tip("b", "a", 0, HAND)]);
    expect(zero.rotations.a!).toBe(0);
    expect(zero.rotations.b!).toBe(0);
    expect(zero.tips.b!).toEqual({ x: 200, y: 300 });
    expect(zero.convergence.stalled).toBe(true);
    expect(Number.isFinite(zero.convergence.residual)).toBe(true);

    // A negative length is a zero-length segment, read the way `readNumber` reads a bad number: the
    // damage stays inside the value that was wrong.
    const negative = solveFabrik(ROOT, [bone("a", "root", -40), tip("b", "a", 40, at(240, 300))]);
    expect(negative.convergence.converged).toBe(true);
    expect(negative.tips.a!).toEqual({ x: 200, y: 300 });
    expect(negative.tips.b!).toEqual({ x: 240, y: 300 });

    // A goal on the root has no direction to read, so the seed's axis is the root's own rotation
    // and the chain folds back along it. Defined, exact, and reachable.
    const folded = solveFabrik(ROOT, [bone("a", "root", 40), tip("b", "a", 40, at(200, 300))]);
    expect(folded.convergence.converged).toBe(true);
    expect(folded.convergence.residual).toBe(0);
    expect(folded.rotations.a!).toBe(90);
    expect(folded.rotations.b!).toBe(-180);

    // One member is a chain, and an unreachable one-member chain still reports its shortfall.
    const single = solveFabrik(ROOT, [tip("only", "root", 40, at(200, 360))]);
    expect(single.rotations.only!).toBe(90);
    expect(single.convergence.residual).toBeCloseTo(20, 9);

    // Cycling bases are refused rather than looped over. Graph construction refuses a cycle long
    // before a solve is reached, so this is an invariant guard and it fails by name.
    expect(() => solveFabrik(ROOT, [bone("a", "b", 10), bone("b", "a", 10)])).toThrow(
      /cycles at member "b"/,
    );
  });
});
