import { describe, expect, it } from "vitest";
import { clamp, lerpAngle } from "../../../src/plugins/frame";
import { solveTwoBone, type MemberState } from "../../../src/plugins/ik";

// Issue #211: the two numerics the per-member `weight` blend is built out of.
//
// Both live in `plugins/frame.ts` rather than in `fk.ts`. `clamp` was module-private in `ik.ts`,
// where it holds a target inside the chain's reachable band and the law of cosines inside the `acos`
// domain, and the blend needs the same bound on its weight. `lerpAngle` is wrap-aware angle math
// between an authored angle and a solved one, which is shared-domain between the two halves of one
// composition. A pure function is also what makes the wrap a unit assertion rather than a rig one.
// See ADR-055.

function member(id: string, length: number): MemberState {
  return { id, base: "", values: { length }, progress: 0 };
}

describe("shared angle numerics (issue #211)", () => {
  it("WT-1 one clamp answers for the solve and for the blend alike", () => {
    expect(clamp(-0.5, 0, 1)).toBe(0);
    expect(clamp(1.5, 0, 1)).toBe(1);
    expect(clamp(0.25, 0, 1)).toBe(0.25);
    // The `acos` domain guard, which is why this function was private to `ik.ts` before it moved.
    expect(clamp(-1.0000000000000002, -1, 1)).toBe(-1);

    // A `NaN` is propagated rather than laundered, which is the contract every caller reads its
    // number through `readNumber` first because of.
    expect(Number.isNaN(clamp(Number.NaN, 0, 1))).toBe(true);

    // The move is a move. An unreachable target still clamps into the reachable band instead of
    // producing `NaN` out of `acos`, which is the whole of what `ik`'s five call sites are for.
    const root = { x: 200, y: 300, rotation: 0 };
    const unreachable = { x: 2000, y: 300, rotation: 0 };
    const solved = solveTwoBone(root, unreachable, [member("a", 80), member("b", 60)]);
    expect(Number.isFinite(solved.a as number)).toBe(true);
    expect(Number.isFinite(solved.b as number)).toBe(true);
  });

  it("WT-2 both endpoints are returned untouched rather than computed", () => {
    // Not a rounding nicety. The wrap sends a separation past half a turn to its short-arc
    // complement, so the arithmetic at `weight` of `1` lands a whole turn away from `to`: the same
    // pose, and a different published number. `weight` defaults to `1` on every solver-bound member
    // that authors none, so every existing rig rides on this identity.
    expect(lerpAngle(0, 200, 1)).toBe(200);
    expect(lerpAngle(0, -200, 1)).toBe(-200);
    expect(lerpAngle(40.168, -51.318, 1)).toBe(-51.318);
    expect(lerpAngle(0.1, 0.3, 0)).toBe(0.1);

    // A negative zero survives the other end, exactly as `pivotFromBaseTip` guarantees it for a
    // zero offset: `-0 + 0 * w` is `0`, and the short-circuit is what keeps it `-0`.
    expect(Object.is(lerpAngle(-0, 123.456, 0), -0)).toBe(true);

    // A weight past either end is that end, so a clamped caller and this function never disagree.
    expect(lerpAngle(10, 70, 2)).toBe(70);
    expect(lerpAngle(10, 70, -1)).toBe(10);
  });

  it("WT-3 the blend takes the short arc through the wrap", () => {
    expect(lerpAngle(170, -170, 0.5)).toBeCloseTo(180, 12);
    expect(lerpAngle(-170, 170, 0.5)).toBeCloseTo(-180, 12);
    expect(lerpAngle(350, 10, 0.5)).toBeCloseTo(360, 12);
    expect(lerpAngle(10, 350, 0.5)).toBeCloseTo(0, 12);

    // Past a full turn on either side, because `solveTwoBone` returns unwrapped degrees.
    expect(lerpAngle(0, 540, 0.5)).toBeCloseTo(90, 12);
    expect(lerpAngle(0, -540, 0.5)).toBeCloseTo(90, 12);
    expect(lerpAngle(0, 720, 0.5)).toBeCloseTo(0, 12);

    // The case this function exists for, stated as arithmetic: a naive linear blend across the
    // wrap swings the long way round and passes through zero instead of through half a turn.
    expect(170 + (-170 - 170) * 0.5).toBe(0);
    expect(lerpAngle(170, -170, 0.5)).not.toBe(0);

    // And it is a blend, not a snap: a quarter of the short arc is a quarter of the way round it.
    expect(lerpAngle(0, 90, 0.25)).toBeCloseTo(22.5, 12);
    expect(lerpAngle(175, -175, 0.25)).toBeCloseTo(177.5, 12);
  });

  it("WT-4 exactly half a turn resolves in the positive direction from either side", () => {
    // Both arcs are equally short at a separation of exactly 180 degrees, so the tie-break is
    // arbitrary. It is pinned rather than left to the arithmetic: a rewrite reaching for `floor`
    // instead of `ceil` would silently flip a pose with every other case in this file still green.
    expect(lerpAngle(0, 180, 0.5)).toBe(90);
    expect(lerpAngle(0, -180, 0.5)).toBe(90);
    expect(lerpAngle(90, -90, 0.25)).toBe(135);
    expect(lerpAngle(-90, 90, 0.25)).toBe(-45);
  });
});
