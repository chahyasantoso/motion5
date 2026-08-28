import { describe, expect, it } from "vitest";
import { FABRIK_TOLERANCE } from "../../../src/plugins/fabrik";
import { solveChain } from "../../../src/plugins/ik";

// Slice D4 of issue #195: the shape the deleted fallback used to answer.
//
// `solveTwoBone` carried a `members.length < 2` branch that returned zero for every member, and D3
// deleted it because the dispatcher owns arity now. `FB-10` pins that a one-member chain loads, which
// is a question for `buildGraphIR`; what actually changed at that arity is what the runtime
// publishes, and neither `FB-11`'s five-bone fixture nor `FB-12`'s tree covers it. This case is that
// gap, and it fails by producing zero rather than by erroring.
//
// A one-member chain is a real solve: the bone points at its goal. That is the honest answer at every
// distance, because a single segment has one degree of freedom and no length to spend, so the only
// question a solve can answer for it is which way it faces. Zero was not a degenerate answer, it was
// a different pose.
//
// Structural fixtures rather than `WorldFrame` and `MemberState` annotations, for the reason
// `fabrik-dispatch.test.ts` states: `PluginInputs` values are `ImmutableValue`, an interface has no
// implicit index signature, and an interface-annotated fixture cannot be handed to the plugin at all.

const DEGREES = 180 / Math.PI;
const ROOT = { x: 0, y: 0, rotation: 0 };
const HIP = "rig/hip";
const ONLY = "rig/only";
const LENGTH = 50;

function bone(id: string, base: string, length: number) {
  return { id, base, values: { length }, progress: 0 };
}

/** Where the bone's tip lands, from the local rotation the solve returned. */
function tipOf(rotation: number) {
  const radians = rotation / DEGREES;
  return { x: ROOT.x + LENGTH * Math.cos(radians), y: ROOT.y + LENGTH * Math.sin(radians) };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

describe("a one-member chain is a solve rather than a fallback (Slice D4)", () => {
  it("FB-16 a single bone faces its goal at every distance instead of publishing zero", () => {
    const chain = [bone(ONLY, HIP, LENGTH)];

    // 1. A goal exactly at the bone's reach. The tolerance is imported rather than typed, so the
    //    assertion moves with the module instead of pinning a number beside it.
    const reachable = { x: 30, y: 40, rotation: 0 };
    const solved = solveChain(ROOT, chain, new Map([[ONLY, reachable]]), false);
    expect(Object.keys(solved)).toEqual([ONLY]);
    expect(distance(tipOf(solved[ONLY]!), reachable)).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    // The pin for the deleted branch. Zero is a legal rotation, so it is refused by name here rather
    // than left to the tolerance above: a fallback that returned zero for a goal on the +x axis would
    // pass a position assertion and mean nothing.
    expect(solved[ONLY]).not.toBe(0);
    expect(solved[ONLY]).toBeCloseTo(Math.atan2(40, 30) * DEGREES, 3);

    // 2. A goal past the bone's reach. A single segment cannot stretch, so the honest answer is the
    //    same direction fully extended, which is what the analytic path's reach clamp does too.
    const far = { x: 300, y: 400, rotation: 0 };
    const extended = solveChain(ROOT, chain, new Map([[ONLY, far]]), false);
    expect(extended[ONLY]).toBeCloseTo(Math.atan2(400, 300) * DEGREES, 3);
    expect(distance(tipOf(extended[ONLY]!), ROOT)).toBeCloseTo(LENGTH, 6);

    // 3. A goal short of the bone's reach. Also unreachable, in the other direction, and also a
    //    direction rather than an error: nothing here may fold the bone or shorten it.
    const near = { x: 9, y: 12, rotation: 0 };
    const shortened = solveChain(ROOT, chain, new Map([[ONLY, near]]), false);
    expect(shortened[ONLY]).toBeCloseTo(Math.atan2(12, 9) * DEGREES, 3);
    expect(distance(tipOf(shortened[ONLY]!), ROOT)).toBeCloseTo(LENGTH, 6);

    // 4. A goal on the root leaves no direction to read at all. Defined rather than `NaN`, because a
    //    non-finite rotation reaches a published frame and blocks every child of the node below it.
    const onRoot = { x: 0, y: 0, rotation: 0 };
    const degenerate = solveChain(ROOT, chain, new Map([[ONLY, onRoot]]), false);
    expect(Number.isFinite(degenerate[ONLY])).toBe(true);

    // 5. A chain of one with no goal at all is still thrown rather than answered with the seed pose,
    //    so deleting the fallback did not quietly widen what a solve accepts.
    expect(() => solveChain(ROOT, chain, new Map(), false)).toThrow(/at least one goal/);
  });
});
