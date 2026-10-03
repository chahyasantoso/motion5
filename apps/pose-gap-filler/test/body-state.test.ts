import { describe, expect, it } from "vitest";
import { BODY_ROOTS, createBodyStateOwner } from "../src/body/state";
import { createBoneLengthEstimator } from "../src/filler/bone-length";
import { createGapPipeline } from "../src/filler/pipeline";
import { presentedPosition } from "../src/filler/frame";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { WORLD_SPACE } from "../src/filler/space";
import { jointRecord, type JointId } from "../src/filler/landmarks";
import { add, distance, scale, type Vec } from "../src/filler/vec";
import { syntheticWorldPose } from "../src/replay/synthetic";
import { frameOf, trustedOf } from "./frames";

const pose = () =>
  jointRecord((joint) => scale(syntheticWorldPose({ kind: "exercise" }, 400)[joint], 1000));
const setup = () => {
  const owner = createBodyStateOwner(DEFAULT_WORLD_KALMAN_NOISE, 500);
  const lengths = createBoneLengthEstimator();
  const step = (
    points: Partial<Record<JointId, Vec>>,
    tMs: number,
    gaps: readonly JointId[] = [],
  ) => {
    const frame = trustedOf(frameOf(points, tMs, WORLD_SPACE), gaps);
    lengths.observe(frame);
    return owner.step(frame, lengths);
  };
  return { owner, lengths, step };
};

describe("shared body state", () => {
  it("GF-126 shares one immutable body snapshot and never replaces a trusted root", () => {
    const pipeline = createGapPipeline({
      filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
      detector: { threshold: 0.5, gate: Infinity },
    });
    const points = pose();
    const step = pipeline.step(frameOf(points, 0, WORLD_SPACE));
    expect(step.trusted.body).toBe(step.filled.body);
    expect(Object.isFrozen(step.filled.body)).toBe(true);
    for (const root of BODY_ROOTS) {
      expect(step.filled.joints[root]).toBe(step.filled.body!.anchors[root].joint);
      expect(presentedPosition(step.filled.joints[root])).toEqual(points[root]);
      expect(Object.isFrozen(presentedPosition(step.filled.joints[root]))).toBe(true);
    }
  });

  it("GF-127 reconstructs each missing root using the shared calibrated body and expires it", () => {
    for (const root of BODY_ROOTS) {
      const run = setup(),
        points = pose();
      run.step(points, 0);
      const at = run.step(points, 500, [root]);
      expect(at.anchors[root].joint.kind).toBe("inferred");
      expect(at.anchors[root].expiresMs).toBe(500);
      expect(distance(presentedPosition(at.anchors[root].joint)!, points[root])).toBeLessThan(1e-6);
      expect(run.step(points, 501, [root]).anchors[root].joint.kind).toBe("lost");
    }
  });

  it("GF-128 uses no inferred anchor as a measurement and can translate both missing shoulders", () => {
    const run = setup(),
      points = pose();
    run.step(points, 0);
    const moved = jointRecord((joint) => add(points[joint], [40, -20, 60]));
    const result = run.step(moved, 100, ["left-shoulder", "right-shoulder"]);
    for (const root of ["left-shoulder", "right-shoulder"] as const) {
      expect(result.anchors[root].joint.kind).toBe("inferred");
      expect(distance(presentedPosition(result.anchors[root].joint)!, moved[root])).toBeLessThan(
        1e-6,
      );
      expect(result.anchors[root].residualMm).toBeUndefined();
    }
    expect(result.orientation.kind).toBe("inferred");
    expect(
      run.step(moved, 501, ["left-shoulder", "right-shoulder"]).anchors["left-shoulder"].joint.kind,
    ).toBe("lost");
  });

  it("GF-129 refuses a degenerate current torso even after a valid frame", () => {
    for (const started of [false, true]) {
      const run = setup();
      if (started) run.step(pose(), 0);
      const points = pose();
      points["left-shoulder"] = [100, 0, 0];
      points["right-shoulder"] = [-100, 0, 0];
      points["left-hip"] = [200, 0, 0];
      points["right-hip"] = [0, 0, 0];
      const result = run.step(points, 100);
      expect(result.orientation).toEqual({ kind: "unavailable", reason: "degenerate" });
      expect(result.origin).toBeUndefined();
      expect(result.anchors["left-shoulder"].joint.kind).toBe("measured");
    }
  });

  it("GF-130 labels torso coasting and does not refresh its observed age during full loss", () => {
    const run = setup();
    run.step(pose(), 0);
    const held = run.step({}, 500);
    expect(held.orientation.kind).toBe("inferred");
    if (held.orientation.kind === "inferred") {
      expect(held.orientation.measuredMs).toBe(0);
      expect(held.orientation.expiresMs).toBe(500);
    }
    const expired = run.step({}, 501);
    expect(expired.orientation.kind).toBe("unavailable");
    for (const root of BODY_ROOTS) expect(expired.anchors[root].joint.kind).toBe("lost");
  });

  it("GF-131 exposes observed-model disagreements without changing root trust", () => {
    const run = setup(),
      points = pose();
    run.step(points, 0);
    const noisy = { ...points, "left-shoulder": add(points["left-shoulder"], [20, 10, 30]) };
    const body = run.step(noisy, 100);
    expect(body.anchors["left-shoulder"].joint.kind).toBe("measured");
    expect(presentedPosition(body.anchors["left-shoulder"].joint)).toEqual(noisy["left-shoulder"]);
    expect(body.anchors["left-shoulder"].residualMm!).toBeGreaterThan(1);
  });

  it("GF-132 has no unknown-subject anchors and reset removes all calibration", () => {
    const run = setup();
    const first = run.step(pose(), 0, BODY_ROOTS);
    for (const root of BODY_ROOTS) expect(first.anchors[root].joint.kind).toBe("lost");
    run.step(pose(), 100);
    run.owner.reset();
    const reset = run.step({}, 0);
    expect(reset.offsets).toEqual({});
    for (const root of BODY_ROOTS) expect(reset.anchors[root].joint.kind).toBe("lost");
  });

  it("GF-133 rejects invalid input before consuming its timestamp", () => {
    const run = setup(),
      frame = trustedOf(frameOf(pose(), 0, WORLD_SPACE));
    const bad = {
      ...frame,
      trust: {
        ...frame.trust,
        "left-hip": { kind: "trusted" as const, position: [0, NaN, 0], visibility: 1 },
      },
    };
    expect(() => run.owner.step(bad, run.lengths)).toThrow(/finite/);
    expect(run.owner.step(frame, run.lengths).orientation.kind).toBe("observed");
    expect(() => run.owner.step(frame, run.lengths)).toThrow(/timestamps/);
  });
});
