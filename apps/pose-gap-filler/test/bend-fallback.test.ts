import { describe, expect, it } from "vitest";
import type { FilledFrame, JointPrediction } from "../src/filler/frame";
import { createGapFiller } from "../src/filler/gap-filler";
import { LIMBS } from "../src/filler/landmarks";
import { WORLD_SPACE } from "../src/filler/space";
import { add, distance, dot, sub, unit } from "../src/filler/vec";
import { decideBend, PREDICTED_BEND_POLICY } from "../src/rig/bend-policy";
import { createWorldRigSolver } from "../src/rig/solver";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { createWorldWriter } from "../src/rig/writer";
import { fakePorts } from "./engine";
import { frameOf, trustedOf } from "./frames";
import { bendPose, recordingValues, type StagedWrite } from "./phase5-fixtures";

const raw = createGapFiller({ kind: "raw" });
const lengths = { length: () => 100 };
const policy = PREDICTED_BEND_POLICY;
if (policy.kind !== "predict") throw new Error("Prediction policy fixture.");
const enabled = policy;
const initial = (tMs = 0) => {
  const trusted = trustedOf(frameOf(bendPose(0), tMs, WORLD_SPACE));
  return { trusted, filled: raw.fill(trusted) };
};
const gap = (
  tMs: number,
  shift = [0, 0, 0],
  prediction?: JointPrediction,
): { trusted: ReturnType<typeof trustedOf>; filled: FilledFrame } => {
  const points = bendPose(0.7, shift);
  const trusted = trustedOf(
    frameOf(points, tMs, WORLD_SPACE),
    LIMBS.map((limb) => limb.middle),
  );
  const filled = raw.fill(trusted);
  const joints = { ...filled.joints };
  for (const limb of LIMBS)
    joints[limb.middle] = {
      kind: "inferred",
      position: points[limb.middle],
      sinceMs: 20,
      ...(prediction === undefined ? {} : { prediction }),
    };
  return { trusted, filled: { ...filled, joints } };
};
const coast: JointPrediction = {
  kind: "coast",
  lastObservedTMs: 0,
  expiresTMs: 500,
  angularVarianceRad2: 0.01,
};
const valueAt = (batch: readonly StagedWrite[], node: string) => {
  const values = batch.find(([id]) => id === node)![1] as {
    x: number;
    y: number;
    z: number;
  };
  return [values.x, values.y, values.z];
};

describe("optional bend evidence never gates valid world geometry", () => {
  it("GF-189 stale fallback publishes the legacy held pole translated by the current root", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, enabled);
    const first = initial();
    writer.write(first.filled, first.trusted, lengths);
    const predicted = gap(100, [0, 0, 0], coast);
    writer.write(predicted.filled, predicted.trusted, lengths);
    const expired = gap(501, [70, -20, 90], coast);
    const writes = writer.write(expired.filled, expired.trusted, lengths);
    const points = bendPose(0);
    for (const limb of LIMBS) {
      expect(writes[limb.id]).toEqual({ kind: "written", bend: { kind: "unavailable" } });
      const pole = valueAt(recorded.batches[2]!, poseNodeId(limbTracks(limb.id).pole));
      const held = unit(sub(points[limb.middle], points[limb.root]))!;
      expect(distance(pole, add(add(points[limb.root], [70, -20, 90]), held))).toBeLessThan(1e-9);
    }
    expect(recorded.batches.length).toBe(3);
  });

  it("GF-190 a fresh writer without measured history publishes authored default poles", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, enabled);
    const step = gap(100, [10, 20, 30], coast);
    const writes = writer.write(step.filled, step.trusted, lengths);
    const points = bendPose(0.7, [10, 20, 30]);
    for (const limb of LIMBS) {
      expect(writes[limb.id]).toMatchObject({ kind: "written", bend: { kind: "unavailable" } });
      expect(valueAt(recorded.batches[0]!, poseNodeId(limbTracks(limb.id).pole))).toEqual(
        add(points[limb.root], [0, 0, 1]),
      );
    }
  });

  it("GF-191 failed fallback batches retry identical writes without leaking applied state", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, enabled);
    const first = initial();
    writer.write(first.filled, first.trusted, lengths);
    const predicted = gap(100, [0, 0, 0], coast);
    writer.write(predicted.filled, predicted.trusted, lengths);
    const expired = gap(501, [50, 0, 10], coast);
    recorded.setFail(true);
    expect(() => writer.write(expired.filled, expired.trusted, lengths)).toThrow(/publication/);
    recorded.setFail(false);
    writer.write(expired.filled, expired.trusted, lengths);
    expect(recorded.batches[3]).toEqual(recorded.batches[2]);
    recorded.setFail(true);
    const later = gap(700, [100, 0, 20], coast);
    expect(() => writer.write(later.filled, later.trusted, lengths)).toThrow();
    recorded.setFail(false);
    const earlier = gap(600, [60, 0, 12], coast);
    expect(() => writer.write(earlier.filled, earlier.trusted, lengths)).not.toThrow();
  });

  it("GF-192 fallback never refreshes observed age and is the next reacquisition baseline", () => {
    const direction = unit([60, 80, 0])!;
    const stale = decideBend(
      enabled,
      {
        observed: { direction, tMs: 0 },
        applied: { direction: unit([0, 80, 60])!, tMs: 400 },
      },
      {
        tMs: 501,
        root: [0, 0, 0],
        goal: [0, 160, 0],
        measuredRoot: [0, 0, 0],
        measuredGoal: [0, 160, 0],
        measuredMiddle: undefined,
        filledMiddle: { kind: "lost" },
      },
    );
    expect(stale.reference.kind).toBe("unavailable");
    expect(stale.next.observed).toEqual({ direction, tMs: 0 });
    expect(stale.next.applied).toEqual({ direction, tMs: 501 });
    const recovered = decideBend(enabled, stale.next, {
      tMs: 521,
      root: [0, 0, 0],
      goal: [0, 160, 0],
      measuredRoot: [0, 0, 0],
      measuredGoal: [0, 160, 0],
      measuredMiddle: [-60, 80, 0],
      filledMiddle: { kind: "measured", position: [-60, 80, 0] },
    });
    expect(recovered.reference.kind).toBe("observed");
    expect(recovered.next.observed!.tMs).toBe(521);
    expect(
      Math.acos(Math.min(1, dot(direction, recovered.next.applied!.direction))),
    ).toBeLessThanOrEqual(0.120001);
  });

  it("GF-193 repeated expired fallback does not make old coast evidence fresh again", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, enabled);
    const first = initial();
    writer.write(first.filled, first.trusted, lengths);
    for (const tMs of [501, 600, 700, 900]) {
      const step = gap(tMs, [tMs / 10, 0, 0], { ...coast, expiresTMs: 2000 });
      const writes = writer.write(step.filled, step.trusted, lengths);
      for (const limb of LIMBS)
        expect(writes[limb.id]).toEqual({ kind: "written", bend: { kind: "unavailable" } });
    }
    expect(recorded.batches.length).toBe(5);
  });

  it("GF-194 fallback still skips lost roots, lost goals and unknown lengths independently", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, enabled);
    const step = gap(501);
    const joints = { ...step.filled.joints };
    joints[LIMBS[0]!.root] = { kind: "lost" };
    joints[LIMBS[1]!.tip] = { kind: "lost" };
    const writes = writer.write({ ...step.filled, joints }, step.trusted, {
      length: (bone) => (bone === LIMBS[2]!.upper ? undefined : 100),
    });
    expect(writes[LIMBS[0]!.id]).toEqual({ kind: "skipped", reason: "root-lost" });
    expect(writes[LIMBS[1]!.id]).toEqual({ kind: "skipped", reason: "goal-lost" });
    expect(writes[LIMBS[2]!.id]).toEqual({ kind: "skipped", reason: "length-unknown" });
    expect(writes[LIMBS[3]!.id]).toMatchObject({ kind: "written" });
    expect(recorded.batches.length).toBe(1);
    expect(recorded.batches[0]!.length).toBe(5);
    const absent = trustedOf(frameOf({}, 600, WORLD_SPACE));
    writer.write(raw.fill(absent), absent, lengths);
    expect(recorded.batches.length).toBe(1);
  });

  it("GF-195 engine fallback solves publish current endpoints and preserve both segment lengths", () => {
    const solver = createWorldRigSolver(fakePorts(), { bendPolicy: enabled, diagnostics: true });
    try {
      solver.solve(initial(), lengths);
      const step = gap(501, [50, 20, 10], coast);
      const solved = solver.solve(step, lengths);
      expect(solved.size).toBe(4);
      const points = bendPose(0.7, [50, 20, 10]);
      for (const limb of LIMBS) {
        const pose = solved.get(limb.id)!;
        expect(distance(pose.middle, points[limb.root])).toBeCloseTo(100, 7);
        expect(distance(pose.tip, pose.middle)).toBeCloseTo(100, 7);
        expect(distance(pose.tip, points[limb.tip])).toBeLessThan(1e-5);
        expect(solver.readDiagnostics!()!.bends.get(limb.id)).toEqual({ kind: "unavailable" });
        expect(
          solver.readDiagnostics!()!.residuals.get(limb.id)!.middleToObservedMm,
        ).toBeUndefined();
      }
    } finally {
      solver.dispose();
    }
  });

  it("GF-196 evidence expiry is inclusive and stale candidates never suppress geometry", () => {
    for (const prediction of [
      coast,
      { ...coast, expiresTMs: NaN },
      { ...coast, angularVarianceRad2: 1 },
      { ...coast, lastObservedTMs: 600 },
      { ...coast, kind: "prior" as const, uncertaintyCalibrated: false },
    ]) {
      const writer = createWorldWriter(recordingValues().port, enabled);
      const first = initial();
      writer.write(first.filled, first.trusted, lengths);
      const boundary = gap(500, [0, 0, 0], prediction);
      const written = writer.write(boundary.filled, boundary.trusted, lengths);
      for (const limb of LIMBS)
        expect(written[limb.id]).toMatchObject({
          kind: "written",
          bend: { kind: prediction === coast ? "predicted" : "held" },
        });
      const expired = gap(501, [0, 0, 0], prediction);
      for (const outcome of Object.values(writer.write(expired.filled, expired.trusted, lengths)))
        expect(outcome).toEqual({ kind: "written", bend: { kind: "unavailable" } });
    }
  });

  it("GF-197 fallback publication establishes the monotonic clock without measured history", () => {
    const writer = createWorldWriter(recordingValues().port, enabled);
    const first = gap(501);
    writer.write(first.filled, first.trusted, lengths);
    const backwards = gap(500);
    expect(() => writer.write(backwards.filled, backwards.trusted, lengths)).toThrow(/timestamp/);
  });

  it("GF-198 inferred roots and goals remain writable after bend evidence expiry", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, enabled);
    const first = initial();
    writer.write(first.filled, first.trusted, lengths);
    const points = bendPose(0.7, [90, 10, 30]);
    const trusted = trustedOf(
      frameOf(points, 501, WORLD_SPACE),
      LIMBS.flatMap((limb) => [limb.root, limb.middle, limb.tip]),
    );
    const filled = raw.fill(trusted);
    const joints = { ...filled.joints };
    for (const limb of LIMBS)
      for (const joint of [limb.root, limb.tip])
        joints[joint] = { kind: "inferred", position: points[joint], sinceMs: 20 };
    const writes = writer.write({ ...filled, joints }, trusted, lengths);
    for (const limb of LIMBS)
      expect(writes[limb.id]).toEqual({ kind: "written", bend: { kind: "unavailable" } });
    expect(recorded.batches.length).toBe(2);
  });
});
