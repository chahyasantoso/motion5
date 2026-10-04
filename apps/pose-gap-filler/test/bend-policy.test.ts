import { describe, expect, it } from "vitest";
import type { FilledJoint, JointPrediction } from "../src/filler/frame";
import { rotate } from "../src/filler/direction";
import { add, distance, dot, norm, scale, sub, unit, type Vec } from "../src/filler/vec";
import {
  decideBend,
  PREDICTED_BEND_POLICY,
  validateBendPolicy,
  type BendState,
} from "../src/rig/bend-policy";

const policy = PREDICTED_BEND_POLICY;
if (policy.kind !== "predict") throw new Error("Predict policy fixture.");
const enabled = policy;
const direction = unit([1, 1, 0])!;
const initial: BendState = {
  observed: { direction, tMs: 0 },
  applied: { direction, tMs: 0 },
};
const evidence: JointPrediction = {
  kind: "coast",
  lastObservedTMs: 0,
  expiresTMs: 500,
  angularVarianceRad2: 0.01,
};
const inferred = (prediction: JointPrediction | undefined = evidence): FilledJoint => ({
  kind: "inferred",
  position: [0, 100, 100],
  sinceMs: 20,
  ...(prediction === undefined ? {} : { prediction }),
});
const decide = (state: BendState = initial, middle = inferred(), tMs = 100) =>
  decideBend(enabled, state, {
    tMs,
    root: [0, 0, 0],
    goal: [0, 150, 0],
    measuredRoot: [0, 0, 0],
    measuredMiddle: undefined,
    filledMiddle: middle,
  });

describe("world bend decision", () => {
  it("GF-159 has observed, coast, calibrated prior, held and unavailable states", () => {
    const observed = decideBend(
      enabled,
      {},
      {
        tMs: 0,
        root: [0, 0, 0],
        goal: [0, 150, 0],
        measuredRoot: [0, 0, 0],
        measuredMiddle: [100, 100, 0],
        measuredGoal: [0, 150, 0],
        filledMiddle: { kind: "measured", position: [100, 100, 0] },
      },
    );
    expect(observed.reference.kind).toBe("observed");
    expect(decide().reference.kind).toBe("predicted");
    expect(
      decide(initial, inferred({ ...evidence, kind: "prior", uncertaintyCalibrated: true }))
        .reference,
    ).toMatchObject({ kind: "predicted", basis: "prior" });
    expect(
      decide(initial, { kind: "inferred", position: [0, 100, 100], sinceMs: 20 }).reference.kind,
    ).toBe("held");
    expect(decide({}, inferred()).reference.kind).toBe("unavailable");
  });
  it("GF-160 prediction never advances measured history or its age", () => {
    let state = initial;
    for (let tMs = 20; tMs <= 500; tMs += 20) {
      const result = decide(state, inferred(), tMs);
      expect(result.reference.kind).toBe("predicted");
      expect(result.next.observed).toEqual(initial.observed);
      state = result.next;
    }
    expect(decide(state, inferred(), 501).reference.kind).toBe("unavailable");
    expect(initial.applied!.tMs).toBe(0);
  });
  it("GF-161 stale, future, uncalibrated, uncertain and malformed candidates fall back to held", () => {
    for (const bad of [
      { ...evidence, lastObservedTMs: -600 },
      { ...evidence, lastObservedTMs: 101 },
      { ...evidence, expiresTMs: 99 },
      { ...evidence, angularVarianceRad2: 0.251 },
      { ...evidence, angularVarianceRad2: -1 },
      { ...evidence, angularVarianceRad2: NaN },
      { ...evidence, expiresTMs: Infinity },
      { ...evidence, kind: "prior" as const, uncertaintyCalibrated: false },
    ])
      expect(decide(initial, inferred(bad)).reference.kind).toBe("held");
    for (const position of [
      [0, 0, 0],
      [0, 100, 0],
      [NaN, 1, 2],
      [1, 2],
    ]) {
      expect(decide(initial, { ...inferred(), position } as FilledJoint).reference.kind).toBe(
        "held",
      );
    }
  });
  it("GF-162 inclusive evidence expiry is independent of the first gap timestamp", () => {
    expect(decide(initial, inferred(), 500).reference.kind).toBe("predicted");
    expect(decide(initial, inferred(), 501).reference.kind).toBe("unavailable");
    const old = { ...evidence, lastObservedTMs: -450 };
    expect(decide(initial, inferred(old), 100).reference.kind).toBe("held");
  });
  it("GF-163 inferred root plus measured middle cannot train observation history", () => {
    const result = decideBend(enabled, initial, {
      tMs: 100,
      root: [10, 20, 30],
      goal: [10, 170, 30],
      measuredRoot: undefined,
      measuredMiddle: [110, 120, 30],
      filledMiddle: { kind: "measured", position: [110, 120, 30] },
    });
    expect(result.reference.kind).toBe("held");
    expect(result.next.observed).toEqual(initial.observed);
  });
  it("GF-164 bounds opposite-side bend planes without crossing a straight pole", () => {
    let state = initial;
    const target: FilledJoint = { ...inferred(), position: [-100, 100, 0] } as FilledJoint;
    let previousPlane: Vec = [1, 0, 0];
    for (let tMs = 20; tMs <= 400; tMs += 20) {
      const result = decide(state, target, tMs);
      if (result.reference.kind === "unavailable") throw new Error("missing bend");
      const next = result.reference.direction;
      expect(norm(next)).toBeCloseTo(1, 10);
      expect(Math.acos(Math.min(1, dot(state.applied!.direction, next)))).toBeLessThanOrEqual(
        0.120001,
      );
      const plane = unit([next[0]!, 0, next[2]!])!;
      expect(plane).toBeDefined();
      expect(Math.acos(Math.min(1, dot(previousPlane, plane)))).toBeLessThanOrEqual(0.120001);
      previousPlane = plane;
      state = result.next;
    }
    expect(state.applied!.direction[0]).toBeLessThan(0);
  });
  it("GF-165 reacquisition is bounded while measured history stores the unblended observation", () => {
    const result = decideBend(enabled, initial, {
      tMs: 1000,
      root: [0, 0, 0],
      goal: [0, 150, 0],
      measuredRoot: [0, 0, 0],
      measuredMiddle: [-100, 100, 0],
      measuredGoal: [0, 150, 0],
      filledMiddle: { kind: "measured", position: [-100, 100, 0] },
    });
    expect(result.reference.kind).toBe("observed");
    expect(result.next.observed!.direction).toEqual(unit([-100, 100, 0]));
    expect(
      Math.acos(Math.min(1, dot(direction, result.next.applied!.direction))),
    ).toBeLessThanOrEqual(0.350001);
    expect(result.next.observed!.tMs).toBe(1000);
  });
  it("GF-166 straight-limb noise holds the last decisive measurement without refreshing age", () => {
    for (const x of [-0.01, 0, 0.01]) {
      const result = decideBend(enabled, initial, {
        tMs: 100,
        root: [0, 0, 0],
        goal: [0, 150, 0],
        measuredRoot: [0, 0, 0],
        measuredMiddle: [x, 100, 0],
        measuredGoal: [0, 150, 0],
        filledMiddle: { kind: "measured", position: [x, 100, 0] },
      });
      expect(result.reference.kind).toBe("held");
      expect(result.next.observed).toEqual(initial.observed);
    }
  });
  it("GF-167 translation changes no direction or evidence, including root fallback", () => {
    const plain = decide();
    const shift = [500, -120, 700];
    const moved = decideBend(enabled, initial, {
      tMs: 100,
      root: shift,
      goal: add([0, 150, 0], shift),
      measuredRoot: undefined,
      measuredMiddle: undefined,
      filledMiddle: { ...inferred(), position: add([0, 100, 100], shift) } as FilledJoint,
    });
    expect(moved).toEqual(plain);
  });
  it("GF-168 ordinary rotations are equivariant and a 180-degree reach turn stays finite", () => {
    const rotation = [0.4, -0.2, 0.7];
    const turned = decideBend(
      enabled,
      {
        observed: { direction: rotate(direction, rotation), tMs: 0 },
        applied: { direction: rotate(direction, rotation), tMs: 0 },
      },
      {
        tMs: 100,
        root: [0, 0, 0],
        goal: rotate([0, 150, 0], rotation),
        measuredRoot: undefined,
        measuredMiddle: undefined,
        filledMiddle: { ...inferred(), position: rotate([0, 100, 100], rotation) } as FilledJoint,
      },
    );
    expect(
      distance(turned.next.applied!.direction, rotate(decide().next.applied!.direction, rotation)),
    ).toBeLessThan(1e-9);
    const reversal = decideBend(enabled, initial, {
      tMs: 100,
      root: [0, 0, 0],
      goal: [0, -150, 0],
      measuredRoot: undefined,
      measuredMiddle: undefined,
      filledMiddle: { ...inferred(), position: [0, -100, 100] } as FilledJoint,
    });
    expect(reversal.next.applied!.direction.every(Number.isFinite)).toBe(true);
  });
  it("GF-169 rejects invalid settings, mismatched dimensions and backward time before state changes", () => {
    for (const maxAgeMs of [NaN, Infinity, -1])
      expect(() => validateBendPolicy({ ...enabled, maxAgeMs })).toThrow();
    expect(() => validateBendPolicy({ ...enabled, maxStepRad: 4 })).toThrow();
    expect(() => decide(initial, inferred(), -1)).toThrow(/timestamp/);
    expect(() =>
      decideBend(enabled, initial, {
        tMs: 100,
        root: [0, 0],
        goal: [0, 1, 0],
        measuredRoot: undefined,
        measuredMiddle: undefined,
        filledMiddle: inferred(),
      }),
    ).toThrow(/input/);
    expect(initial.observed!.tMs).toBe(0);
  });
});
