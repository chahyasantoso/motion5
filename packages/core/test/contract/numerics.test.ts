import { describe, expect, it } from "vitest";
import {
  assertFiniteNumber,
  clampWeight,
  composeFrame2D,
  exactEquals,
  exactFrameEquals,
  lerpAngleDegrees,
  ORIGIN_FRAME,
  segmentExtent,
  validateFiniteFrame,
  type Frame2D,
  type LocalTransform2D,
} from "../../src/contract/numerics";

describe("A3: total numerics, exact equality, and frame composition", () => {
  it("composes hand-calculated 0-degree and 90-degree extensions accurately", () => {
    // 1. Root at origin, 0 deg rotation, length 10 -> tip at (10, 0, 0)
    const local0: LocalTransform2D = { pivotX: 0, pivotY: 0, rotation: 0, extent: 10 };
    const frame0 = composeFrame2D(ORIGIN_FRAME, local0);
    expect(frame0.x).toBe(10);
    expect(frame0.y).toBe(0);
    expect(frame0.rotation).toBe(0);

    // 2. Root at origin, 90 deg rotation, length 10 -> tip at (0, 10, 90)
    const local90: LocalTransform2D = { pivotX: 0, pivotY: 0, rotation: 90, extent: 10 };
    const frame90 = composeFrame2D(ORIGIN_FRAME, local90);
    expect(Math.abs(frame90.x)).toBeLessThan(1e-12);
    expect(frame90.y).toBeCloseTo(10, 10);
    expect(frame90.rotation).toBe(90);
  });

  it("applies pivot in rotated parent frame before extending along child direction", () => {
    // Parent at (10, 20) with rotation 90 deg (+x points down, +y points left)
    const parent: Frame2D = { x: 10, y: 20, rotation: 90 };
    // Pivot offset (5, 2) in parent space -> in world space dx = -2, dy = 5 -> pivot at (8, 25)
    // Child rotation 0 relative to parent -> child total rotation 90 deg -> extent 10 along +y (down) -> tip at (8, 35)
    const local: LocalTransform2D = { pivotX: 5, pivotY: 2, rotation: 0, extent: 10 };
    const tip = composeFrame2D(parent, local);

    expect(tip.x).toBeCloseTo(8, 10);
    expect(tip.y).toBeCloseTo(35, 10);
    expect(tip.rotation).toBe(90);
  });

  it("clamps negative length to 0 extent while preserving signed zero", () => {
    expect(segmentExtent(-10)).toBe(0);
    expect(segmentExtent(-0.0001)).toBe(0);
    expect(segmentExtent(0)).toBe(0);
    expect(segmentExtent(25.5)).toBe(25.5);
    // Preserves negative zero
    expect(Object.is(segmentExtent(-0), -0)).toBe(true);
  });

  it("clamps blend weight strictly to [0, 1] and defaults non-finite to 1", () => {
    expect(clampWeight(0.5)).toBe(0.5);
    expect(clampWeight(-0.2)).toBe(0);
    expect(clampWeight(1.5)).toBe(1);
    expect(clampWeight(NaN)).toBe(1);
    expect(clampWeight(Infinity)).toBe(1);
    expect(clampWeight(undefined)).toBe(1);
  });

  it("preserves exact byte identity and signed zero at blend weight endpoints", () => {
    const fromVal = -0;
    const toVal = 45;

    // Weight 0 returns `from` untouched without arithmetic alteration
    const at0 = lerpAngleDegrees(fromVal, toVal, 0);
    expect(Object.is(at0, -0)).toBe(true);

    // Weight 1 returns `to` untouched
    const at1 = lerpAngleDegrees(fromVal, toVal, 1);
    expect(Object.is(at1, 45)).toBe(true);
  });

  it("resolves half-turn tie deterministically in the positive direction", () => {
    // Delta +180 deg tie: from 0 to 180 at weight 0.5 -> 90
    const tiePos = lerpAngleDegrees(0, 180, 0.5);
    expect(tiePos).toBe(90);

    // Delta -180 deg tie: from 0 to -180 at weight 0.5 -> 90 (resolves positive)
    const tieNeg = lerpAngleDegrees(0, -180, 0.5);
    expect(tieNeg).toBe(90);
  });

  it("enforces Object.is exact equality distinguishing +0 and -0", () => {
    expect(exactEquals(0, 0)).toBe(true);
    expect(exactEquals(-0, -0)).toBe(true);
    expect(exactEquals(0, -0)).toBe(false);

    const frameA: Frame2D = { x: 0, y: 10, rotation: 0 };
    const frameB: Frame2D = { x: -0, y: 10, rotation: 0 };
    const frameC: Frame2D = { x: 0, y: 10, rotation: 0 };

    expect(exactFrameEquals(frameA, frameC)).toBe(true);
    expect(exactFrameEquals(frameA, frameB)).toBe(false);
  });

  it("refuses non-finite numbers and magnitude overflows", () => {
    expect(() => assertFiniteNumber(NaN, "coord")).toThrow(TypeError);
    expect(() => assertFiniteNumber(Infinity, "coord")).toThrow(TypeError);
    expect(() => assertFiniteNumber(-Infinity, "coord")).toThrow(TypeError);
    expect(() => assertFiniteNumber(1e305, "coord")).toThrow(RangeError);

    const badFrame: Frame2D = { x: 10, y: NaN, rotation: 0 };
    expect(() => validateFiniteFrame(badFrame, "boneTip")).toThrow(TypeError);
  });
});
