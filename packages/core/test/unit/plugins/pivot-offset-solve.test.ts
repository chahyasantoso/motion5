import { describe, expect, it } from "vitest";
import type { ImmutableRecord } from "../../../src/domain/values";
import { fkPlugin } from "../../../src/plugins/fk";
import { FABRIK_TOLERANCE, solveFabrik, type FabrikMember } from "../../../src/plugins/fabrik";
import { solveChain, solveTwoBone, type MemberState } from "../../../src/plugins/ik";

// Issue #214: `ik` accounts for `fk`'s authored pivot offsets, in both solves.
//
// ADR-053 refused a non-zero `x` or `y` on a solved member, because neither solve modelled it: a
// bone composes its pivot at that offset and then extends by `length`, so the tip landed away from
// where the solve placed it and the chain missed its goal by exactly that vector, with a `ready`
// patch and no diagnostic. The refusal was a safety stop. ADR-054 replaces it with the geometry,
// and this file is its evidence.
//
// The ownership split is unchanged and is what the cases are written against. `fk` still applies the
// offset; `ik` predicts the frame that application composes and publishes rotations only. So the
// oracle here is `fkPlugin.compose` itself rather than a copy of the trigonometry: a case asks the
// solve for rotations, composes the chain forward through the real plugin with the real authored
// offsets, and measures where the leaf actually landed. A convention error between the two halves
// cannot hide from that, which is the failure ADR-053 says went silent.
//
// `PV-` belongs to offset-aware solving. `FO-` owns what an authored `x` and `y` mean on a bone and
// in whose space `fk` reads them, which is unchanged. `IK-` owns the analytic two-bone solve and
// `FB-` owns the iterative one, and both keep every number they pinned: this is not a widening of
// either, it is the one contract that spans them, which is why it is its own series. `RS-` owns
// what the loader now accepts.

const ROOT = { x: 200, y: 300, rotation: 0 };
const HAND = { x: 320, y: 340, rotation: 0 };
const UPPER = "walker/upper-arm";
const FOREARM = "walker/forearm";
const SHOULDER = "walker/shoulder";

function at(x: number, y: number) {
  return { x, y, rotation: 0 };
}

/** A solved member: the authored values a bone carries, as the publisher delivers them. */
function member(id: string, base: string, length: number, x = 0, y = 0) {
  return { id, base, values: { length, x, y }, progress: 0 };
}

/** One member of an iterative chain, and its leaf form with a goal. */
function link(id: string, base: string, length: number, pivot: { x: number; y: number }) {
  return { id, base, length, pivot };
}
function leaf(
  id: string,
  base: string,
  length: number,
  pivot: { x: number; y: number },
  goal: { x: number; y: number; rotation: number },
) {
  return { id, base, length, pivot, goal };
}

/**
 * A member state narrowed to values a composition can be handed.
 *
 * `MemberState.values` is `unknown`-valued, and correctly so: `ik` reads every authored number
 * through the shared reader and holds no opinion about what else a member carries. `fk`'s composer
 * takes a `Readonly<ImmutableRecord>`, because that is what a published patch is made of, so
 * composing a member through the real plugin needs the narrower fact stated somewhere.
 *
 * Stated by extending the published type rather than by restating it or by asserting it. A local
 * copy of a type the module exports is what `ik-solve.test.ts` deleted, and a cast would claim this
 * narrowing with nothing checking it, on the one argument the oracle below depends on the shape of.
 * As an extension, every fixture in this file is held to it at its own literal.
 */
interface SolvedMember extends MemberState {
  readonly values: Readonly<ImmutableRecord>;
}

/**
 * Where the rig actually ends up, composed through `fk` with the solved rotations injected.
 *
 * The chain is walked root-most first and each bone's composed frame becomes the next one's `base`,
 * which is exactly what the publisher does over `orderGraph`'s linearisation. `inputs.solver` is the
 * patch shape `ik` publishes, so the authored `rotation` each member does not carry is replaced by
 * the solved one through the real override path rather than by substitution in the test.
 */
function composeChain(
  root: { x: number; y: number; rotation: number },
  members: readonly SolvedMember[],
  rotations: Readonly<Record<string, number>>,
): { x: number; y: number; rotation: number } {
  let base = root;
  for (const state of members) {
    const composed = fkPlugin.compose(
      state.values,
      state.progress,
      { base, solver: { rotations } },
      state.id,
    );
    base = {
      x: composed.x as number,
      y: composed.y as number,
      rotation: composed.rotation as number,
    };
  }
  return base;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * The closed form exactly as it stood before offsets entered it.
 *
 * Written out rather than imported, because the point of `PV-4` is that the offset-aware code
 * reduces to this arithmetic bit for bit at zero offset, and a comparison against the function under
 * test would be a tautology. Every expression is copied verbatim, including `(v * 180) / Math.PI`
 * rather than a `180 / Math.PI` constant: the two are different doubles, and which one a rig's
 * published angle is rounded from is exactly what "byte-for-byte" has to mean here.
 */
function legacyTwoBone(
  root: { x: number; y: number; rotation: number },
  target: { x: number; y: number },
  l1: number,
  l2: number,
  flip: boolean,
): readonly [number, number] {
  const a = Math.max(0, l1);
  const b = Math.max(0, l2);
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.hypot(dx, dy);
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (a <= 0 && b <= 0) return [targetAngle - root.rotation, 0];
  if (a <= 0) return [0, targetAngle - root.rotation];
  if (b <= 0) return [targetAngle - root.rotation, 0];
  const clampedD = clamp(d, Math.abs(a - b), a + b);
  if (clampedD <= 0) return [0, 0];
  const cosAlpha = clamp((a * a + clampedD * clampedD - b * b) / (2 * a * clampedD), -1, 1);
  const alpha = (Math.acos(cosAlpha) * 180) / Math.PI;
  const cosBeta = clamp((a * a + b * b - clampedD * clampedD) / (2 * a * b), -1, 1);
  const beta = (Math.acos(cosBeta) * 180) / Math.PI;
  if (!flip) return [targetAngle + alpha - root.rotation, beta - 180];
  return [targetAngle - alpha - root.rotation, 180 - beta];
}

/** MINSTD, as `FB-7` and `RS-3` use it: a fixed run of twenty different permutations. */
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

describe("ik accounts for fk's pivot offsets (issue #214)", () => {
  it("PV-1 a two-bone chain whose first member is offset reaches its target", () => {
    // The offset moves the point the whole chain pivots about, and it is read in the root's own
    // rotated frame, so it is fixed before a single angle is solved. Solving the triangle from the
    // root's position instead would miss by exactly this vector, which is the silent failure
    // ADR-053 refused rather than fixed.
    const members = [member(UPPER, SHOULDER, 80, 12, -4), member(FOREARM, UPPER, 60)];
    const rotations = solveTwoBone(ROOT, HAND, members);

    expect(distance(composeChain(ROOT, members, rotations), HAND)).toBeCloseTo(0, 9);

    // And the two angles, so the case pins a configuration rather than only reachability: both
    // elbow branches put the tip on the target, so a reachability assertion alone survives the
    // branches being swapped.
    expect(rotations[UPPER]).toBeCloseTo(50.6528, 4);
    expect(rotations[FOREARM]).toBeCloseTo(-67.9757, 4);
  });

  it("PV-2 a two-bone chain whose second member is offset reaches its target", () => {
    // A different mechanism from `PV-1`, and this is the one a naive fix gets wrong. The second
    // member's offset is read in the *first* member's frame, so it turns with the angle being
    // solved: it cannot be subtracted from the goal up front. It fuses with the first member's
    // extension into one rigid link instead, at a length of `hypot(l1 + x2, y2)` and a fixed twist
    // off the first bone's own direction, and the closed form runs on that link.
    const members = [member(UPPER, SHOULDER, 80), member(FOREARM, UPPER, 60, 0, -4)];
    const rotations = solveTwoBone(ROOT, HAND, members);

    expect(distance(composeChain(ROOT, members, rotations), HAND)).toBeCloseTo(0, 9);
    expect(rotations[UPPER]).toBeCloseTo(43.0875, 4);
    expect(rotations[FOREARM]).toBeCloseTo(-54.3594, 4);

    // The twist is what the second angle carries, and it is added there rather than absorbed into
    // the first: an implementation that subtracted it from both, or from neither, still reaches a
    // target on this rig for one particular pair of lengths. A second geometry pins that it is not
    // a coincidence.
    const wider = [member(UPPER, SHOULDER, 45), member(FOREARM, UPPER, 95, 11, 7)];
    expect(distance(composeChain(ROOT, wider, solveTwoBone(ROOT, HAND, wider)), HAND)).toBeCloseTo(
      0,
      9,
    );
  });

  it("PV-3 combined x and y offsets in both members reach the target on both branches", () => {
    const members = [member(UPPER, SHOULDER, 80, 12, -4), member(FOREARM, UPPER, 60, -7, 9)];

    for (const flip of [false, true]) {
      const rotations = solveTwoBone(ROOT, HAND, members, flip);
      expect(distance(composeChain(ROOT, members, rotations), HAND)).toBeCloseTo(0, 9);
    }

    // Both branches, pinned, so `flip` still selects an exact configuration rather than a basin once
    // a twist is in the accounting. They are not the negations of each other any more, and that is
    // correct: the mirror is across the base-to-target line and the twist is common to both, so the
    // symmetry `IK-3` pins at zero offset is the zero-twist special case of this one.
    const unflipped = solveTwoBone(ROOT, HAND, members, false);
    const flipped = solveTwoBone(ROOT, HAND, members, true);
    expect(unflipped[UPPER]).toBeCloseTo(41.207, 3);
    expect(unflipped[FOREARM]).toBeCloseTo(-51.637, 3);
    expect(flipped[UPPER]).toBeCloseTo(-10.9311, 4);
    expect(flipped[FOREARM]).toBeCloseTo(65.6938, 4);
    expect(Math.abs(unflipped[UPPER]! - flipped[UPPER]!)).toBeGreaterThan(1);

    // A rotated root, because the offsets are read in its frame and a solve that read them in world
    // space is green on every case above: `ROOT.rotation` is zero in all of them.
    const tilted = { x: 200, y: 300, rotation: 37.5 };
    const turned = solveTwoBone(tilted, HAND, members);
    expect(distance(composeChain(tilted, members, turned), HAND)).toBeCloseTo(0, 9);
    const inverted = { x: 200, y: 300, rotation: -90 };
    const near = at(240, 380);
    const mirrored = solveTwoBone(inverted, near, members, true);
    expect(distance(composeChain(inverted, members, mirrored), near)).toBeCloseTo(0, 9);
  });

  it("PV-4 the analytic path is byte-identical to its pre-offset arithmetic at zero offset", () => {
    // The pin for every rig that already solves, and it is byte identity rather than closeness
    // because that is what the requirement says and because closeness would not catch the change
    // that matters: folding an unconditional `hypot(l1 + 0, 0)` and a `- atan2(0, l1)` into the two
    // angles moves the last bits of every published rotation on every walker bone, and no
    // `toBeCloseTo` anywhere would notice. `frame.ts` short-circuits both to guarantee it.
    const lengths: readonly (readonly [number, number])[] = [
      [80, 60],
      [0, 60],
      [80, 0],
      [0, 0],
      [-40, 40],
      [50, 50],
    ];
    const targets = [at(320, 340), at(400, 300), at(300, 350), at(200, 300), at(200, 301)];
    let compared = 0;
    for (const rotation of [0, 30, -90]) {
      for (const [l1, l2] of lengths) {
        for (const target of targets) {
          for (const flip of [false, true]) {
            const root = { x: 200, y: 300, rotation };
            const members = [member(UPPER, SHOULDER, l1), member(FOREARM, UPPER, l2)];
            const solved = solveTwoBone(root, target, members, flip);
            const [r1, r2] = legacyTwoBone(root, target, l1, l2, flip);
            expect(Object.is(solved[UPPER], r1)).toBe(true);
            expect(Object.is(solved[FOREARM], r2)).toBe(true);
            compared += 1;
          }
        }
      }
    }
    // A passing run is never an empty scan.
    expect(compared).toBe(180);
  });

  it("PV-5 a chain past arity two with offsets keeps every length and reaches tolerance", () => {
    // Length preservation is the invariant the tolerance does not cover: an iteration that reached
    // the goal by stretching a bone would converge and be wrong. With offsets it is also the
    // assertion that says the solve carries pivots at all, because a member's length is the distance
    // from its own pivot to its own tip and the gap between two consecutive tips is that length only
    // when the offset is zero.
    const three: readonly FabrikMember[] = [
      link("a", "root", 80, { x: 5, y: 3 }),
      link("b", "a", 60, { x: -4, y: 6 }),
      leaf("c", "b", 40, { x: 2, y: -8 }, at(300, 380)),
    ];
    const solved = solveFabrik(ROOT, three);
    expect(solved.convergence.converged).toBe(true);
    expect(distance(solved.tips.c!, at(300, 380))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    for (const { id, length } of three) {
      expect(distance(solved.pivots[id]!, solved.tips[id]!)).toBeCloseTo(length, 9);
    }
    // And each pivot sits where `fk` would compose it: on its base's tip, moved by the offset in the
    // base's own direction. Asserted through the composition rather than restated as trigonometry.
    const states = three.map((m, index) =>
      member(m.id, index === 0 ? "root" : three[index - 1]!.id, m.length, m.pivot!.x, m.pivot!.y),
    );
    const tip = composeChain(ROOT, states, solved.rotations);
    expect(distance(tip, at(300, 380))).toBeLessThanOrEqual(FABRIK_TOLERANCE);

    const five: readonly FabrikMember[] = [
      link("m1", "root", 40, { x: 3, y: 2 }),
      link("m2", "m1", 40, { x: -2, y: 4 }),
      link("m3", "m2", 40, { x: 1, y: -3 }),
      link("m4", "m3", 40, { x: 0, y: 5 }),
      leaf("m5", "m4", 40, { x: -1, y: -1 }, at(260, 380)),
    ];
    const long = solveFabrik(ROOT, five);
    expect(long.convergence.converged).toBe(true);
    expect(distance(long.tips.m5!, at(260, 380))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    for (const { id, length } of five) {
      expect(distance(long.pivots[id]!, long.tips[id]!)).toBeCloseTo(length, 9);
    }
  });

  it("PV-6 an absent offset and an authored zero are the same solve", () => {
    // The default is a documented value rather than a field accepted and ignored, and this is what
    // says so. It is byte identity over the whole solution, including the convergence record, so a
    // zero that took a different code path and landed within tolerance would still fail.
    const absent: readonly FabrikMember[] = [
      { id: "a", base: "root", length: 80 },
      { id: "b", base: "a", length: 60, goal: HAND },
    ];
    const explicit: readonly FabrikMember[] = [
      link("a", "root", 80, { x: 0, y: 0 }),
      leaf("b", "a", 60, { x: 0, y: 0 }, HAND),
    ];
    for (const flip of [false, true]) {
      expect(JSON.stringify(solveFabrik(ROOT, explicit, flip))).toEqual(
        JSON.stringify(solveFabrik(ROOT, absent, flip)),
      );
    }
    // The analytic path answers the same way, through the same reader: an unauthored key and an
    // authored zero both read as zero, so neither reaches the offset arithmetic at all.
    const unauthored = [
      { id: UPPER, base: SHOULDER, values: { length: 80 }, progress: 0 },
      { id: FOREARM, base: UPPER, values: { length: 60 }, progress: 0 },
    ];
    const zeroed = [member(UPPER, SHOULDER, 80), member(FOREARM, UPPER, 60)];
    expect(JSON.stringify(solveTwoBone(ROOT, HAND, zeroed))).toEqual(
      JSON.stringify(solveTwoBone(ROOT, HAND, unauthored)),
    );
  });

  it("PV-7 both solves share one offset convention rather than holding one each", () => {
    // The assertion ADR-053 says was missing, and the reason the refusal covered both paths instead
    // of one: an offset that meant something at arity two and something else above it would be the
    // arity-dependent meaning that killed reviving a member's authored `rotation` as a seed.
    //
    // The bound is angular and derived rather than typed to taste, exactly as `FB-2` derives its
    // own: a positional residual of at most `FABRIK_TOLERANCE` over the shorter 60-unit bone is
    // about `0.001` of a degree, and the bound is ten times that.
    const bound = 0.01;
    const analytic = [member(UPPER, SHOULDER, 80, 12, -4), member(FOREARM, UPPER, 60, -7, 9)];
    const iterative: readonly FabrikMember[] = [
      link(UPPER, SHOULDER, 80, { x: 12, y: -4 }),
      leaf(FOREARM, UPPER, 60, { x: -7, y: 9 }, HAND),
    ];

    for (const flip of [false, true]) {
      const closed = solveTwoBone(ROOT, HAND, analytic, flip);
      const solved = solveFabrik(ROOT, iterative, flip);
      expect(solved.convergence.converged).toBe(true);
      expect(Math.abs(solved.rotations[UPPER]! - closed[UPPER]!)).toBeLessThan(bound);
      expect(Math.abs(solved.rotations[FOREARM]! - closed[FOREARM]!)).toBeLessThan(bound);
    }

    // And the dispatcher still routes this rig to the closed form, so the agreement above is between
    // two solves rather than between one solve and itself.
    const goals = new Map([[FOREARM, HAND]]);
    expect(JSON.stringify(solveChain(ROOT, analytic, goals, false))).toEqual(
      JSON.stringify(solveTwoBone(ROOT, HAND, analytic, false)),
    );
  });

  it("PV-8 a branching chain with offsets solves every goal, deterministically", () => {
    // The shape ADR-053 said stops generalising, and the convention that makes it generalise. A
    // sub-base carries one direction and each child hangs off it at its own offset, so the children's
    // pivots are not independent quantities to average. Each branch un-offsets its pivot proposal
    // into a proposal about the sub-base's own tip first, and the average is over those tips, so it
    // is an average of one geometric quantity rather than of incompatible twists.
    const tree: readonly FabrikMember[] = [
      link("spine", "hip", 50, { x: 4, y: 2 }),
      link("arm-l", "spine", 40, { x: 3, y: -6 }),
      leaf("fore-l", "arm-l", 30, { x: 1, y: 2 }, at(240, 400)),
      link("arm-r", "spine", 40, { x: 3, y: 6 }),
      leaf("fore-r", "arm-r", 30, { x: 1, y: -2 }, at(160, 400)),
    ];
    const solved = solveFabrik(ROOT, tree);
    expect(solved.convergence.converged).toBe(true);
    expect(distance(solved.tips["fore-l"]!, at(240, 400))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(distance(solved.tips["fore-r"]!, at(160, 400))).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    for (const { id, length } of tree) {
      expect(distance(solved.pivots[id]!, solved.tips[id]!)).toBeCloseTo(length, 9);
    }
    // Both children of the sub-base hang off one direction, so their pivots differ from the shared
    // tip by exactly their own authored offsets. This is the assertion an averaged twist fails.
    for (const child of ["arm-l", "arm-r"] as const) {
      const offset = tree.find(({ id }) => id === child)!.pivot!;
      expect(distance(solved.pivots[child]!, solved.tips.spine!)).toBeCloseTo(
        Math.hypot(offset.x, offset.y),
        9,
      );
    }

    // Deterministic under authored permutation, as byte identity rather than closeness: order is
    // derived inside the solve, and a sub-base average is only a value once the sequence is fixed.
    const reference = JSON.stringify(solveFabrik(ROOT, tree));
    const identity = tree.map(({ id }) => id).join(",");
    const permutations = new Set<string>();
    for (let seed = 9; seed <= 28; seed += 1) {
      const permuted = shuffle(tree, seed);
      permutations.add(permuted.map(({ id }) => id).join(","));
      expect(JSON.stringify(solveFabrik(ROOT, permuted))).toEqual(reference);
    }
    expect(permutations.size).toBe(20);
    expect(permutations.has(identity)).toBe(false);
  });

  it("PV-9 an offset on the chain root or below the chain is untouched by the solve", () => {
    // The solve reads its root as a frame and never as a track, so whatever composed that frame —
    // a `transform` root, an FK bone with a pivot of its own, the walker's shoulder hanging off the
    // pelvis at `y: -50` — is already accounted for by the time it arrives. Moving the root moves
    // the whole chain rigidly and changes no solved angle, which is the property that lets the
    // loader keep accepting an offset there.
    const members = [member(UPPER, SHOULDER, 80), member(FOREARM, UPPER, 60)];
    const shifted = { x: ROOT.x + 7, y: ROOT.y - 13, rotation: ROOT.rotation };
    const target = at(HAND.x + 7, HAND.y - 13);
    expect(JSON.stringify(solveTwoBone(shifted, target, members))).toEqual(
      JSON.stringify(solveTwoBone(ROOT, HAND, members)),
    );

    // And a bone below the chain composes from its base's solved frame like any other FK bone: it is
    // not a member, so no rotation is published for it and its own authored pivot is its own.
    const rotations = solveTwoBone(ROOT, HAND, members);
    expect(Object.keys(rotations).sort()).toEqual([FOREARM, UPPER]);
    const leafFrame = composeChain(ROOT, members, rotations);
    const hand = fkPlugin.compose(
      { length: 20, x: 6, y: -2, rotation: 15 },
      0,
      { base: leafFrame, solver: { rotations } },
      "walker/hand",
    );
    // Its authored rotation survives, because the solver names no rotation for it.
    expect(hand.rotation).toBeCloseTo(leafFrame.rotation + 15, 9);
    expect(distance(leafFrame, HAND)).toBeCloseTo(0, 9);
  });

  it("PV-10 an unreachable offset chain extends toward its goal instead of producing NaN", () => {
    // The clamp is stated on the effective link rather than on `l1`, because the reach an offset
    // chain actually has is the link's. A second member offset backwards past its base's own length
    // shortens that reach, and the answer is a finite pose with a real shortfall.
    const members = [member(UPPER, SHOULDER, 80), member(FOREARM, UPPER, 60, -100, 25)];
    const rotations = solveTwoBone(ROOT, HAND, members);
    expect(Number.isFinite(rotations[UPPER])).toBe(true);
    expect(Number.isFinite(rotations[FOREARM])).toBe(true);
    const tip = composeChain(ROOT, members, rotations);
    expect(Number.isFinite(tip.x)).toBe(true);
    expect(Number.isFinite(tip.y)).toBe(true);
    // Fully extended along the base-to-target line: the shortfall is the whole of the miss.
    const base = { x: ROOT.x, y: ROOT.y };
    const reach = Math.hypot(-100 + 80, 25) + 60;
    expect(distance(base, tip)).toBeCloseTo(reach, 6);
  });
});
