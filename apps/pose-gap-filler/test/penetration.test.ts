import { describe, expect, it } from "vitest";
import {
  capsulePenetration,
  diagnosePenetration,
  segmentDistance,
  type Capsule,
} from "../src/rig/penetration";
import { add, type Vec } from "../src/filler/vec";
import { WORLD_SPACE } from "../src/filler/space";
import { jointRecord } from "../src/filler/landmarks";

const capsule = (id: string, from: Vec, to: Vec, radiusMm = 1): Capsule => ({
  id,
  from,
  to,
  radiusMm,
});
describe("coarse solved capsule diagnostics", () => {
  it("GF-170 covers crossing, skew, parallel, endpoint and zero-length segments", () => {
    expect(segmentDistance([-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0])).toBeCloseTo(0, 10);
    expect(segmentDistance([-1, 0, 0], [1, 0, 0], [0, -1, 3], [0, 1, 3])).toBeCloseTo(3, 10);
    expect(segmentDistance([0, 0, 0], [1, 0, 0], [0, 2, 0], [1, 2, 0])).toBeCloseTo(2, 10);
    expect(segmentDistance([0, 0, 0], [1, 0, 0], [3, 0, 0], [4, 0, 0])).toBeCloseTo(2, 10);
    expect(segmentDistance([0, 0, 0], [0, 0, 0], [0, 3, 0], [0, 3, 0])).toBeCloseTo(3, 10);
  });
  it("GF-171 distinguishes penetration, tangency and separation with symmetric depth", () => {
    const a = capsule("a", [0, 0, 0], [10, 0, 0]);
    const b = capsule("b", [0, 1, 0], [10, 1, 0]);
    expect(capsulePenetration(a, b)).toEqual({ a: "a", b: "b", depthMm: 1 });
    expect(capsulePenetration(b, a)!.depthMm).toBe(1);
    expect(capsulePenetration(a, capsule("tangent", [0, 2, 0], [10, 2, 0]))).toBeUndefined();
    expect(capsulePenetration(a, capsule("far", [20, 0, 0], [30, 0, 0]))).toBeUndefined();
  });
  it("GF-172 is translation-invariant and rejects malformed or overflowing geometry", () => {
    const a = capsule("a", [0, 0, 0], [10, 0, 0]);
    const b = capsule("b", [0, 1, 0], [10, 1, 0]);
    const move = (c: Capsule) => ({
      ...c,
      from: add(c.from, [100, 200, 300]),
      to: add(c.to, [100, 200, 300]),
    });
    expect(capsulePenetration(move(a), move(b))).toEqual(capsulePenetration(a, b));
    for (const bad of [
      capsule("bad", [NaN, 0, 0], [0, 0, 0]),
      capsule("bad", [0, 0], [0, 0, 0]),
      { ...a, radiusMm: -1 },
    ])
      expect(() => capsulePenetration(bad, b)).toThrow(/Capsules/);
  });
  it("GF-173 excludes skipped and intentionally adjacent segments without mutating solver data", () => {
    const frame = {
      tMs: 100,
      space: WORLD_SPACE,
      joints: jointRecord(() => ({ kind: "lost" as const })),
    };
    expect(diagnosePenetration(frame, new Map())).toEqual([]);
    const presented = {
      ...frame,
      joints: {
        ...frame.joints,
        "left-shoulder": { kind: "measured" as const, position: [0, 0, 0] },
      },
    };
    const limb = { middle: [100, 0, 0], tip: [0, 0, 0] };
    expect(diagnosePenetration(presented, new Map([["left-arm", limb]]))).toEqual([]);
    expect(limb).toEqual({ middle: [100, 0, 0], tip: [0, 0, 0] });
  });
});
