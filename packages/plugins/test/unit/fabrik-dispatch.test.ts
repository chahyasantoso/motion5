import { describe, expect, it } from "vitest";
import { readSolveMembers } from "../../src/ik-chain";
import { solveTwoBone } from "../../src/ik-analytic";
import { solveChain } from "../../src/ik-solve";

// Slice D3 of issue #195: the dispatcher, and what it is not allowed to change.
//
// `solveChain` chooses on derived shape: two members and one goal take the closed form, everything
// else takes FABRIK. Nothing new is authorable, so no rig picks its own solver, and the two paths
// publish one convention by assertion rather than by construction. `FB-2` holds FABRIK to the
// analytic numbers; the cases here hold the analytic path to itself.
//
// The pure-solver fixtures are structural `SolveMember` records, while the authored fixtures retain
// `values` and `progress` for the `ikPlugin.compose` and adapter checks. `PluginInputs` values are
// `ImmutableValue`, an interface has no implicit index signature, and so an interface-annotated
// authored fixture cannot be handed to `ikPlugin.compose` at all.

type Frame = { x: number; y: number; rotation: number };

const ROOT = { x: 200, y: 300, rotation: 0 };
const UPPER = "walker/upper-arm";
const FOREARM = "walker/forearm";
const SHOULDER = "walker/shoulder";
const HAND = { x: 320, y: 340, rotation: 0 };

function bone(id: string, base: string, length: number) {
  return { id, base, length };
}

function authoredBone(id: string, base: string, length: number) {
  return { id, base, values: { length }, progress: 0 };
}

/** A chain leaf: the same member, plus the goal that makes it addressed. */
function tip(id: string, base: string, length: number, goal: Frame) {
  return { id, base, length, goal };
}

function authoredTip(id: string, base: string, length: number, goal: Frame) {
  return { id, base, values: { length }, progress: 0, goal };
}

/** ADR-051's worked rig, addressed through the bare `target` slot. */
const ARM = [bone(UPPER, SHOULDER, 80), bone(FOREARM, UPPER, 60)];

/** The same rig with the goal on the leaf, which is what the dict derives. */
const ADDRESSED_ARM = [bone(UPPER, SHOULDER, 80), tip(FOREARM, UPPER, 60, HAND)];
const AUTHORED_ARM = [authoredBone(UPPER, SHOULDER, 80), authoredBone(FOREARM, UPPER, 60)];
const AUTHORED_ADDRESSED_ARM = [
  authoredBone(UPPER, SHOULDER, 80),
  authoredTip(FOREARM, UPPER, 60, HAND),
];

describe("the solve dispatches on derived shape (Slice D3)", () => {
  it("FB-9 two members and one goal are byte-identical to the closed form", () => {
    // The pin for every rig that already solves, including all thirteen walker bones and every rig
    // that never authored an `ik` group. Asserted against `solveTwoBone`'s own return rather than
    // against literals copied out of it: a literal would keep passing if the dispatcher started
    // rounding, and it would stop meaning "unchanged" the first time the convention moved on purpose.
    for (const flip of [false, true]) {
      const analytic = solveTwoBone(ROOT, HAND, ARM[0]!, ARM[1]!, flip).rotations;
      const dispatched = solveChain(
        ROOT,
        [{ ...ARM[0]! }, { ...ARM[1]!, goal: HAND }],
        flip,
      ).rotations;
      expect(dispatched).toEqual(analytic);
      expect(JSON.stringify(dispatched)).toEqual(JSON.stringify(analytic));
    }

    // And the two numbers ADR-051's worked rig is pinned by, so a dispatcher that routed this rig to
    // FABRIK would be caught by the convention rather than only by the byte comparison above.
    const solved = solveChain(
      ROOT,
      readSolveMembers(AUTHORED_ARM, new Map([[FOREARM, HAND]])),
      false,
    ).rotations;
    expect(solved[UPPER]).toBeCloseTo(40.168, 3);
    expect(solved[FOREARM]).toBeCloseTo(-51.3178, 4);

    // An unreachable target is the analytic clamp rather than a stalled iteration, on the same path.
    const far = { x: 400, y: 300, rotation: 0 };
    expect(solveChain(ROOT, [{ ...ARM[0]! }, { ...ARM[1]!, goal: far }], false).rotations).toEqual(
      solveTwoBone(ROOT, far, ARM[0]!, ARM[1]!, false).rotations,
    );

    // Dispatch reads shape, not spelling. The goal dict and the bare slot are one map by the time
    // `solveChain` sees them, so a rig re-expressed with `targets` takes the same path and lands on
    // the same doubles.
    const addressed = solveChain(ROOT, ADDRESSED_ARM, false).rotations;
    expect(JSON.stringify(addressed)).toEqual(
      JSON.stringify(solveTwoBone(ROOT, HAND, ARM[0]!, ARM[1]!, false).rotations),
    );
  });
});
