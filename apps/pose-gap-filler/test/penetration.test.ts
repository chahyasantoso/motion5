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
    expect(diagnosePenetration(frame, new Map())).toEqual({ kind: "unavailable", contacts: [] });
    const presented = {
      ...frame,
      joints: {
        ...frame.joints,
        "left-shoulder": { kind: "measured" as const, position: [0, 0, 0] },
      },
    };
    const limb = { middle: [100, 0, 0], tip: [0, 0, 0] };
    expect(diagnosePenetration(presented, new Map([["left-arm", limb]]))).toEqual({
      kind: "unavailable",
      contacts: [],
    });
    expect(limb).toEqual({ middle: [100, 0, 0], tip: [0, 0, 0] });
  });
  it("GF-185 diagnoses nearly parallel long crossings without cancellation and bounds unsupported geometry", () => {
    expect(
      segmentDistance([-1e6, 0, 0], [1e6, 0, 0], [-1e6, -0.01, 0], [1e6, 0.01, 0]),
    ).toBeCloseTo(0, 8);
    expect(() =>
      capsulePenetration(
        capsule("a", [0, 0, 0], [1, 0, 0], Number.MAX_VALUE),
        capsule("b", [0, 0, 0], [0, 1, 0]),
      ),
    ).toThrow();
    const frame = {
      tMs: 0,
      space: WORLD_SPACE,
      joints: {
        ...jointRecord(() => ({ kind: "lost" as const })),
        "left-shoulder": { kind: "measured" as const, position: [1e13, 0, 0] },
        "right-shoulder": { kind: "measured" as const, position: [1e13, 1, 0] },
      },
    };
    const report = diagnosePenetration(
      frame,
      new Map([
        ["left-arm", { middle: [1e13, 100, 0], tip: [1e13, 200, 0] }],
        ["right-arm", { middle: [1e13, 100, 0], tip: [1e13, 200, 0] }],
      ]),
    );
    expect(report).toEqual({ kind: "unavailable", contacts: [] });
  });
  it("GF-186 reports unresolved forearm/trunk penetration, not intended shoulder attachment", () => {
    const frame = {
      tMs: 0,
      space: WORLD_SPACE,
      joints: {
        ...jointRecord(() => ({ kind: "lost" as const })),
        "left-shoulder": { kind: "measured" as const, position: [100, -100, 0] },
        "right-shoulder": { kind: "measured" as const, position: [-100, -100, 0] },
        "left-hip": { kind: "measured" as const, position: [100, 100, 0] },
        "right-hip": { kind: "measured" as const, position: [-100, 100, 0] },
      },
    };
    const report = diagnosePenetration(
      frame,
      new Map([
        [
          "left-arm",
          {
            middle: [100, 0, 0],
            tip: [-100, 0, 0],
          },
        ],
      ]),
    );
    expect(report.kind).toBe("partial");
    expect(report.contacts).toEqual([{ a: "left-forearm", b: "trunk", depthMm: 105 }]);
  });
});
