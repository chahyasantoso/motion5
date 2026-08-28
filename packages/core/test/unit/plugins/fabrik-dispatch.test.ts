import { describe, expect, it } from "vitest";
import {
  ikPlugin,
  readGoals,
  solveChain,
  solveTwoBone,
  type MemberState,
} from "../../../src/plugins/ik";
import type { WorldFrame } from "../../../src/plugins/frame";

// Slice D3 of issue #195: the dispatcher, and what it is not allowed to change.
//
// `solveChain` chooses on derived shape: two members and one goal take the closed form, everything
// else takes FABRIK. Nothing new is authorable, so no rig picks its own solver, and the two paths
// publish one convention by assertion rather than by construction. `FB-2` holds FABRIK to the
// analytic numbers; the cases here hold the analytic path to itself.

const ROOT: WorldFrame = { x: 200, y: 300, rotation: 0 };
const UPPER = "walker/upper-arm";
const FOREARM = "walker/forearm";
const SHOULDER = "walker/shoulder";
const HAND: WorldFrame = { x: 320, y: 340, rotation: 0 };

function member(id: string, base: string, length: number, goal?: WorldFrame): MemberState {
  return goal === undefined
    ? { id, base, values: { length }, progress: 0 }
    : { id, base, values: { length }, progress: 0, goal };
}

/** ADR-051's worked rig, addressed through the bare `target` slot. */
const ARM: readonly MemberState[] = [member(UPPER, SHOULDER, 80), member(FOREARM, UPPER, 60)];

/** The same rig with the goal on the leaf, which is what the dict derives. */
const ADDRESSED_ARM: readonly MemberState[] = [
  member(UPPER, SHOULDER, 80),
  member(FOREARM, UPPER, 60, HAND),
];

describe("the solve dispatches on derived shape (Slice D3)", () => {
  it("FB-9 two members and one goal are byte-identical to the closed form", () => {
    // The pin for every rig that already solves, including all thirteen walker bones and every rig
    // that never authored an `ik` group. Asserted against `solveTwoBone`'s own return rather than
    // against literals copied out of it: a literal would keep passing if the dispatcher started
    // rounding, and it would stop meaning "unchanged" the first time the convention moved on purpose.
    for (const flip of [false, true]) {
      const analytic = solveTwoBone(ROOT, HAND, ARM, flip);
      const dispatched = solveChain(ROOT, ARM, readGoals(HAND, ARM), flip);
      expect(dispatched).toEqual(analytic);
      expect(JSON.stringify(dispatched)).toEqual(JSON.stringify(analytic));
    }

    // And the two numbers ADR-051's worked rig is pinned by, so a dispatcher that routed this rig to
    // FABRIK would be caught by the convention rather than only by the byte comparison above.
    const solved = solveChain(ROOT, ARM, readGoals(HAND, ARM), false);
    expect(solved[UPPER]).toBeCloseTo(40.168, 3);
    expect(solved[FOREARM]).toBeCloseTo(-51.3178, 4);

    // An unreachable target is the analytic clamp rather than a stalled iteration, on the same path.
    const far: WorldFrame = { x: 400, y: 300, rotation: 0 };
    expect(solveChain(ROOT, ARM, readGoals(far, ARM), false)).toEqual(
      solveTwoBone(ROOT, far, ARM, false),
    );

    // Dispatch reads shape, not spelling. The goal dict and the bare slot are one map by the time
    // `solveChain` sees them, so a rig re-expressed with `targets` takes the same path and lands on
    // the same doubles.
    const addressed = solveChain(
      ROOT,
      ADDRESSED_ARM,
      readGoals(undefined, ADDRESSED_ARM),
      false,
    );
    expect(JSON.stringify(addressed)).toEqual(
      JSON.stringify(solveTwoBone(ROOT, HAND, ARM, false)),
    );
  });

  it("FB-13 a solve that does not converge publishes rotations and nothing else", () => {
    // The decision this slice owns, and it fails by producing something rather than by erroring.
    //
    // `solveFabrik` reports `residual` and `stalled` because absorbing them would tell a caller to
    // raise a cap that is not the problem. Publishing them is a different question: the analytic
    // path carries neither, so a solver's patch shape would become a function of its arity, `FB-9`'s
    // byte identity would not survive the extra key, and roughly four percent of ordinary reachable
    // rigs miss tolerance before the cap, so a per-tick report would fire on rigs nobody would call
    // broken. A bare `converged` boolean is also the C review's Blocker 1 waiting to happen again:
    // `renderableValues` skips a plain record and a scalar falls through to `target[key] = value`.
    const tail: readonly MemberState[] = [
      member("rig/t1", "rig/hip", 30),
      member("rig/t2", "rig/t1", 30),
      member("rig/t3", "rig/t2", 30, { x: 900, y: 300, rotation: 0 }),
    ];

    const composed = ikPlugin.compose(
      { flip: false },
      0,
      { root: ROOT, members: tail },
      "rig/tail-solve",
    );

    expect(Object.keys(composed).sort()).toEqual(["flip", "rotations"]);
    const rotations = composed.rotations as unknown as Readonly<Record<string, number>>;
    expect(Object.keys(rotations).sort()).toEqual(["rig/t1", "rig/t2", "rig/t3"]);
    for (const value of Object.values(rotations)) expect(Number.isFinite(value)).toBe(true);

    // And the shape is the one the analytic path publishes, so arity is invisible to a consumer.
    const analytic = ikPlugin.compose(
      { flip: false },
      0,
      { root: ROOT, target: HAND, members: ARM },
      "walker/arm-solve",
    );
    expect(Object.keys(analytic).sort()).toEqual(Object.keys(composed).sort());
  });

  it("FB-15 the bare target slot is joined onto the chain's one leaf, and refused past one", () => {
    // `target` names no member, so something has to say which member it is a goal for. The leaf is
    // the only answer, and it is derived from the `base` fields the publisher already joined on
    // rather than from a second walk of the graph.
    const goals = readGoals(HAND, ARM);
    expect([...goals.keys()]).toEqual([FOREARM]);
    expect(goals.get(FOREARM)).toEqual(HAND);

    // A goal dict needs no target to read, and a member with no goal contributes none.
    expect([...readGoals(undefined, ADDRESSED_ARM).keys()]).toEqual([FOREARM]);
    expect(readGoals(undefined, ARM).size).toBe(0);

    // Two leaves and one bare target has no answer, and `ik-target-not-single-leaf` refuses the rig
    // at load, so this is the invariant guard behind that rule rather than a validation step. It
    // throws instead of picking a leaf, because a binding applied to an arbitrary member is the
    // shape ADR-033 rule 6 forbids.
    const branched: readonly MemberState[] = [
      member("rig/left", "rig/hip", 40),
      member("rig/right", "rig/hip", 40),
    ];
    expect(() => readGoals(HAND, branched)).toThrow(/2 leaves/);

    // A solve with no goal at all is thrown rather than answered with the seed pose, which would
    // publish a rig reaching for nothing with status `ready`.
    expect(() => solveChain(ROOT, ARM, new Map(), false)).toThrow(/at least one goal/);
  });
});
