import { describe, expect, it } from "vitest";
import { createGapFiller } from "../src/filler/gap-filler";
import { createGapPipeline } from "../src/filler/pipeline";
import type { FilledJoint } from "../src/filler/frame";
import { LIMBS } from "../src/filler/landmarks";
import { WORLD_SPACE } from "../src/filler/space";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { add, distance, scale, sub } from "../src/filler/vec";
import { PREDICTED_BEND_POLICY } from "../src/rig/bend-policy";
import { rotate } from "../src/filler/direction";
import { jointRecord } from "../src/filler/landmarks";
import { dot, unit } from "../src/filler/vec";
import { createWorldWriter } from "../src/rig/writer";
import { createWorldRigSolver } from "../src/rig/solver";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { frameOf, trustedOf } from "./frames";
import { fakePorts } from "./engine";
import { bendPose, recordingValues } from "./phase5-fixtures";

const lengths = { length: () => 100 };
const raw = createGapFiller({ kind: "raw" });

describe("bend provenance boundaries", () => {
  it("GF-181 inferred goals never refresh measured bend history on any limb", () => {
    const writer = createWorldWriter(recordingValues().port, PREDICTED_BEND_POLICY);
    const first = trustedOf(frameOf(bendPose(0), 0, WORLD_SPACE));
    writer.write(raw.fill(first), first, lengths);
    const points = bendPose(0);
    for (const limb of LIMBS) {
      // A nearly straight measured middle would be nondecisive with the actual straight goal.
      points[limb.middle] = add(points[limb.root], [1, 100, 0]);
      points[limb.tip] = add(points[limb.root], [0, 150, 0]);
    }
    const trusted = trustedOf(
      frameOf(points, 100, WORLD_SPACE),
      LIMBS.map((limb) => limb.tip),
    );
    const filled = raw.fill(trusted);
    const joints = { ...filled.joints };
    for (const limb of LIMBS)
      joints[limb.tip] = {
        kind: "inferred",
        position: add(points[limb.root], [100, 100, 0]),
        sinceMs: 100,
      };
    const outcome = writer.write({ ...filled, joints }, trusted, lengths);
    for (const limb of LIMBS)
      expect(outcome[limb.id]).toMatchObject({
        kind: "written",
        bend: { kind: "held", lastObservedTMs: 0 },
      });
  });
  it("GF-182 predicted bends translate with inferred roots but never train them", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, PREDICTED_BEND_POLICY);
    const points = bendPose(0);
    const first = trustedOf(frameOf(points, 0, WORLD_SPACE));
    writer.write(raw.fill(first), first, lengths);
    const shift = [70, -20, 90];
    const moved = bendPose(0.2, shift);
    const trusted = trustedOf(
      frameOf(moved, 100, WORLD_SPACE),
      LIMBS.flatMap((limb) => [limb.root, limb.middle]),
    );
    const filled = raw.fill(trusted);
    const joints = { ...filled.joints };
    for (const limb of LIMBS) {
      joints[limb.root] = { kind: "inferred", position: moved[limb.root], sinceMs: 20 };
      joints[limb.middle] = {
        kind: "inferred",
        position: moved[limb.middle],
        sinceMs: 20,
        prediction: {
          kind: "coast",
          lastObservedTMs: 0,
          expiresTMs: 500,
          angularVarianceRad2: 0.01,
        },
      };
    }
    const outcome = writer.write({ ...filled, joints }, trusted, lengths);
    for (const limb of LIMBS) {
      expect(outcome[limb.id]).toMatchObject({
        kind: "written",
        bend: { kind: "predicted", lastObservedTMs: 0 },
      });
      const pole = recorded.batches[1]!.find(
        ([id]) => id === poseNodeId(limbTracks(limb.id).pole),
      )![1] as { x: number; y: number; z: number };
      const expected = add(
        moved[limb.root],
        scale(sub(moved[limb.middle], moved[limb.root]), 0.01),
      );
      expect(distance([pole.x, pole.y, pole.z], expected)).toBeLessThan(1e-9);
    }
  });
  it("GF-183 inferred and solved middles cannot retrain estimator lengths or re-enter detector trust", () => {
    const pipeline = createGapPipeline({
      filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
      detector: { gate: Infinity, threshold: 0.5 },
    });
    pipeline.step(frameOf(bendPose(0), 0, WORLD_SPACE));
    const before = LIMBS.map((limb) => [
      pipeline.lengths.length(limb.upper),
      pipeline.lengths.length(limb.lower),
    ]);
    const solver = createWorldRigSolver(fakePorts(), { bendPolicy: PREDICTED_BEND_POLICY });
    try {
      const good = pipeline.step(frameOf(bendPose(0.1), 20, WORLD_SPACE));
      solver.solve(good, pipeline.lengths);
      const points = bendPose(0.2);
      for (const limb of LIMBS) points[limb.middle] = [1e6, -1e6, 1e6];
      const step = pipeline.step(
        frameOf(points, 100, WORLD_SPACE),
        new Set(LIMBS.map((limb) => limb.middle)),
      );
      solver.solve(step, pipeline.lengths);
      expect(
        LIMBS.map((limb) => [
          pipeline.lengths.length(limb.upper),
          pipeline.lengths.length(limb.lower),
        ]),
      ).toEqual(before);
      for (const limb of LIMBS) {
        expect(step.trusted.trust[limb.middle]).toEqual({ kind: "gap", reason: "forced" });
        expect(step.filled.joints[limb.middle].kind).toBe("inferred");
      }
    } finally {
      solver.dispose();
    }
  });
  it("GF-184 unknown middle provenance and invalid world frame clocks never fabricate prediction", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, PREDICTED_BEND_POLICY);
    const first = trustedOf(frameOf(bendPose(0), 0, WORLD_SPACE));
    writer.write(raw.fill(first), first, lengths);
    const trusted = trustedOf(
      frameOf(bendPose(0.5), 100, WORLD_SPACE),
      LIMBS.map((limb) => limb.middle),
    );
    const filled = raw.fill(trusted);
    const joints = { ...filled.joints };
    for (const limb of LIMBS)
      joints[limb.middle] = {
        kind: "inferred",
        position: bendPose(0.5)[limb.middle],
        sinceMs: 100,
      };
    expect(() => writer.write({ ...filled, tMs: 101, joints }, trusted, lengths)).toThrow(
      /timestamps/,
    );
    expect(recorded.batches.length).toBe(1);
    const writes = writer.write({ ...filled, joints }, trusted, lengths);
    for (const limb of LIMBS)
      expect(writes[limb.id]).toMatchObject({
        kind: "written",
        bend: { kind: "held", lastObservedTMs: 0 },
      });
  });
  it("GF-187 prediction keeps one batch per frame, and expired/all-skipped frames publish no values", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, PREDICTED_BEND_POLICY);
    const first = trustedOf(frameOf(bendPose(0), 0, WORLD_SPACE));
    writer.write(raw.fill(first), first, lengths);
    expect(recorded.batches.length).toBe(1);
    const gap = trustedOf(
      frameOf(bendPose(0.2), 100, WORLD_SPACE),
      LIMBS.map((limb) => limb.middle),
    );
    const filled = raw.fill(gap);
    const joints = { ...filled.joints };
    for (const limb of LIMBS)
      joints[limb.middle] = {
        kind: "inferred",
        position: bendPose(0.2)[limb.middle],
        sinceMs: 100,
        prediction: {
          kind: "coast",
          lastObservedTMs: 0,
          expiresTMs: 500,
          angularVarianceRad2: 0.01,
        },
      };
    writer.write({ ...filled, joints }, gap, lengths);
    expect(recorded.batches.length).toBe(2);
    expect(recorded.batches[1]!.filter(([id]) => id.endsWith("-pole")).length).toBe(4);
    const expired = { ...gap, tMs: 501 };
    const outcomes = writer.write({ ...filled, tMs: 501, joints }, expired, lengths);
    for (const limb of LIMBS)
      expect(outcomes[limb.id]).toEqual({ kind: "skipped", reason: "bend-lost" });
    expect(recorded.batches.length).toBe(2);
  });
  it("GF-188 abrupt 180-degree body turns and gap reversals retain bounded rendered bend sides on all limbs", () => {
    const solver = createWorldRigSolver(fakePorts(), {
      bendPolicy: PREDICTED_BEND_POLICY,
      diagnostics: true,
    });
    const previous = new Map<string, readonly number[]>();
    try {
      for (const [index, turn] of [0, Math.PI, Math.PI, 0, 0, Math.PI].entries()) {
        const tMs = index * 100;
        const original = bendPose(0);
        const points = jointRecord((joint) => rotate(original[joint], [0, turn, 0]));
        const gaps = index === 2 || index === 4 ? LIMBS.map((limb) => limb.middle) : [];
        const trusted = trustedOf(frameOf(points, tMs, WORLD_SPACE), gaps);
        const filled = raw.fill(trusted);
        const joints = { ...filled.joints };
        for (const limb of LIMBS)
          if (gaps.includes(limb.middle))
            joints[limb.middle] = {
              kind: "inferred",
              position: points[limb.middle],
              sinceMs: tMs,
              prediction: {
                kind: "coast",
                lastObservedTMs: tMs - 100,
                expiresTMs: tMs + 400,
                angularVarianceRad2: 0.01,
              },
            };
        const solved = solver.solve({ trusted, filled: { ...filled, joints } }, lengths);
        for (const limb of LIMBS) {
          const pose = solved.get(limb.id)!;
          const direction = unit(sub(pose.middle, points[limb.root]))!;
          const before = previous.get(limb.id);
          if (before !== undefined)
            expect(Math.acos(Math.min(1, dot(before, direction)))).toBeLessThanOrEqual(0.350001);
          expect(distance(pose.middle, points[limb.root])).toBeCloseTo(100, 7);
          expect(distance(pose.tip, pose.middle)).toBeCloseTo(100, 7);
          expect(distance(pose.tip, points[limb.tip])).toBeLessThan(1e-5);
          previous.set(limb.id, direction);
        }
      }
    } finally {
      solver.dispose();
    }
  });
});
