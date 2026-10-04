import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Engine, PluginRegistry, type ProjectDefinition } from "@motion5/core";
import { transform3dPlugin } from "@motion5/core/plugins/transform3d";
import { fk3dPlugin } from "@motion5/core/plugins/fk3d";
import { ik3dPlugin } from "@motion5/core/plugins/ik3d";
import type { FilledFrame, FilledJoint } from "../src/filler/frame";
import { createGapFiller } from "../src/filler/gap-filler";
import { createGapPipeline } from "../src/filler/pipeline";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { LIMBS, type JointId } from "../src/filler/landmarks";
import { WORLD_SPACE } from "../src/filler/space";
import { add, distance, scale, sub } from "../src/filler/vec";
import { LEGACY_BEND_POLICY, PREDICTED_BEND_POLICY } from "../src/rig/bend-policy";
import { createWorldWriter } from "../src/rig/writer";
import { createWorldRigSolver } from "../src/rig/solver";
import { loadWorldRig, readSolvedLimb, worldRigProject } from "../src/rig/rig";
import { POSE_MOTION_ID, limbTracks, poseNodeId } from "../src/rig/tracks";
import { fakePorts } from "./engine";
import { frameOf, trustedOf } from "./frames";
import { bendPose, legacyTrace, recordingValues } from "./phase5-fixtures";

const lengths = { length: () => 100 };
const raw = createGapFiller({ kind: "raw" });
const middleGaps = LIMBS.map((limb) => limb.middle);
const predictedFrame = (
  tMs: number,
  angle: number,
  sourceMs = 0,
): { trusted: ReturnType<typeof trustedOf>; filled: FilledFrame } => {
  const points = bendPose(angle);
  const trusted = trustedOf(frameOf(points, tMs, WORLD_SPACE), middleGaps);
  const filled = raw.fill(trusted);
  return {
    trusted,
    filled: {
      ...filled,
      joints: {
        ...filled.joints,
        ...Object.fromEntries(
          middleGaps.map((joint) => [
            joint,
            {
              kind: "inferred",
              position: points[joint],
              sinceMs: 20,
              prediction: {
                kind: "coast",
                lastObservedTMs: sourceMs,
                expiresTMs: sourceMs + 500,
                angularVarianceRad2: 0.01,
              },
            } satisfies FilledJoint,
          ]),
        ),
      },
    },
  };
};

describe("inferred bends through the real world rig", () => {
  it("GF-174 feature-disabled output matches the frozen PR545 writer, including all patch revisions", () => {
    const baseline = JSON.parse(
      readFileSync(new URL("./fixtures/phase5-legacy-trace.json", import.meta.url), "utf8"),
    );
    expect(legacyTrace()).toEqual(baseline);
    expect(legacyTrace((port) => createWorldWriter(port, LEGACY_BEND_POLICY))).toEqual(baseline);
  });
  it("GF-175 better hidden middles improve both arms and legs without replacing measured history", () => {
    const legacy = createWorldRigSolver(fakePorts());
    const predicted = createWorldRigSolver(fakePorts(), {
      bendPolicy: PREDICTED_BEND_POLICY,
      diagnostics: true,
    });
    try {
      const first = trustedOf(frameOf(bendPose(0), 0, WORLD_SPACE));
      const step = { trusted: first, filled: raw.fill(first) };
      legacy.solve(step, lengths);
      predicted.solve(step, lengths);
      const next = predictedFrame(100, 0.3);
      const a = legacy.solve(next, lengths);
      const b = predicted.solve(next, lengths);
      const truth = bendPose(0.3);
      for (const limb of LIMBS) {
        expect(distance(b.get(limb.id)!.middle, truth[limb.middle])).toBeLessThan(1e-5);
        expect(distance(a.get(limb.id)!.middle, truth[limb.middle])).toBeGreaterThan(10);
        expect(distance(b.get(limb.id)!.tip, truth[limb.tip])).toBeLessThan(1e-5);
        expect(predicted.readDiagnostics!()!.bends.get(limb.id)).toMatchObject({
          kind: "predicted",
          basis: "coast",
          lastObservedTMs: 0,
        });
        expect(
          predicted.readDiagnostics!()!.residuals.get(limb.id)!.middleToObservedMm,
        ).toBeUndefined();
      }
      // A hold fill cannot continue training prediction. It returns toward the original observation.
      const held = predictedFrame(200, 0.3);
      const joints = { ...held.filled.joints };
      for (const joint of middleGaps)
        joints[joint] = { kind: "inferred", position: truth[joint], sinceMs: 20 };
      const back = predicted.solve({ ...held, filled: { ...held.filled, joints } }, lengths);
      for (const limb of LIMBS) {
        expect(distance(back.get(limb.id)!.middle, bendPose(0)[limb.middle])).toBeLessThan(1e-5);
        expect(predicted.readDiagnostics!()!.bends.get(limb.id)).toMatchObject({
          kind: "held",
          lastObservedTMs: 0,
        });
      }
    } finally {
      legacy.dispose();
      predicted.dispose();
    }
  });
  it("GF-176 failed inferred and observed batches retry exactly and never commit hidden history", () => {
    const recorded = recordingValues();
    const writer = createWorldWriter(recorded.port, PREDICTED_BEND_POLICY);
    const first = trustedOf(frameOf(bendPose(0), 0, WORLD_SPACE));
    writer.write(raw.fill(first), first, lengths);
    const next = predictedFrame(100, 0.3);
    recorded.setFail(true);
    expect(() => writer.write(next.filled, next.trusted, lengths)).toThrow(/publication/);
    recorded.setFail(false);
    const writes = writer.write(next.filled, next.trusted, lengths);
    expect(recorded.batches[2]).toEqual(recorded.batches[1]);
    expect(writes["left-arm"]).toMatchObject({
      kind: "written",
      bend: { kind: "predicted", lastObservedTMs: 0 },
    });
    const opposite = trustedOf(frameOf(bendPose(Math.PI), 200, WORLD_SPACE));
    recorded.setFail(true);
    expect(() => writer.write(raw.fill(opposite), opposite, lengths)).toThrow();
    recorded.setFail(false);
    const held = predictedFrame(300, 0.3);
    const joints = { ...held.filled.joints };
    for (const joint of middleGaps) joints[joint] = { kind: "lost" };
    const outcome = writer.write({ ...held.filled, joints }, held.trusted, lengths);
    expect(outcome["left-arm"]).toMatchObject({
      kind: "written",
      bend: { kind: "held", lastObservedTMs: 0 },
    });
  });
  it("GF-177 expiry uses fallback solves, while complete endpoint loss still hides old solves", () => {
    const solver = createWorldRigSolver(fakePorts(), {
      bendPolicy: PREDICTED_BEND_POLICY,
      diagnostics: true,
    });
    try {
      const first = trustedOf(frameOf(bendPose(0), 0, WORLD_SPACE));
      solver.solve({ trusted: first, filled: raw.fill(first) }, lengths);
      expect(solver.solve(predictedFrame(501, 0.3), lengths).size).toBe(4);
      for (const bend of solver.readDiagnostics!()!.bends.values())
        expect(bend.kind).toBe("unavailable");
      const absent = trustedOf(frameOf({}, 600, WORLD_SPACE));
      expect(solver.solve({ trusted: absent, filled: raw.fill(absent) }, lengths).size).toBe(0);
      expect(solver.readDiagnostics!()!.penetration).toEqual({ kind: "unavailable", contacts: [] });
    } finally {
      solver.dispose();
    }
    expect(solver.readDiagnostics!()).toBeUndefined();
    const fresh = createWorldRigSolver(fakePorts(), { bendPolicy: PREDICTED_BEND_POLICY });
    try {
      expect(fresh.solve(predictedFrame(100, Math.PI), lengths).size).toBe(4);
      const observed = trustedOf(frameOf(bendPose(Math.PI), 200, WORLD_SPACE));
      const solved = fresh.solve({ trusted: observed, filled: raw.fill(observed) }, lengths);
      for (const limb of LIMBS)
        expect(distance(solved.get(limb.id)!.tip, bendPose(Math.PI)[limb.tip])).toBeLessThan(1e-5);
    } finally {
      fresh.dispose();
    }
  });
  it("GF-178 the real chain filler exposes coast evidence bounded by the oldest direction and torso measurement", () => {
    const pipeline = createGapPipeline({
      filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
      detector: { gate: Infinity, threshold: 0.5 },
    });
    const legacy = createWorldRigSolver(fakePorts());
    const prediction = createWorldRigSolver(fakePorts(), {
      bendPolicy: PREDICTED_BEND_POLICY,
      diagnostics: true,
    });
    try {
      for (let tMs = 0; tMs <= 900; tMs += 30) {
        const step = pipeline.step(frameOf(bendPose(tMs / 1000), tMs, WORLD_SPACE));
        legacy.solve(step, pipeline.lengths);
        prediction.solve(step, pipeline.lengths);
      }
      const step = pipeline.step(frameOf(bendPose(1), 1000, WORLD_SPACE), new Set(middleGaps));
      const a = legacy.solve(step, pipeline.lengths),
        b = prediction.solve(step, pipeline.lengths);
      for (const limb of LIMBS) {
        const filled = step.filled.joints[limb.middle];
        expect(filled).toMatchObject({
          kind: "inferred",
          prediction: { kind: "coast", lastObservedTMs: 900, expiresTMs: 1400 },
        });
        expect(distance(b.get(limb.id)!.middle, bendPose(1)[limb.middle])).toBeLessThan(
          distance(a.get(limb.id)!.middle, bendPose(1)[limb.middle]),
        );
        expect(prediction.readDiagnostics!()!.bends.get(limb.id)!.kind).toBe("predicted");
      }
    } finally {
      legacy.dispose();
      prediction.dispose();
    }
  });
  it("GF-179 diagnostic-only capsule reports leave every solved value and revision untouched", () => {
    const plain = createWorldRigSolver(fakePorts(), { bendPolicy: PREDICTED_BEND_POLICY });
    const reported = createWorldRigSolver(fakePorts(), {
      bendPolicy: PREDICTED_BEND_POLICY,
      diagnostics: true,
    });
    try {
      for (const tMs of [0, 100, 200]) {
        const trusted = trustedOf(frameOf(bendPose(tMs / 1000), tMs, WORLD_SPACE));
        const step = { trusted, filled: raw.fill(trusted) };
        expect(reported.solve(step, lengths)).toEqual(plain.solve(step, lengths));
        for (const limb of LIMBS)
          for (const id of Object.values(limbTracks(limb.id)))
            expect(reported.readPatch!(poseNodeId(id))).toEqual(plain.readPatch!(poseNodeId(id)));
      }
      expect(reported.readDiagnostics!()!.tMs).toBe(200);
      expect(plain.readDiagnostics!()).toBeUndefined();
    } finally {
      plain.dispose();
      reported.dispose();
    }
  });
  it("GF-180 identical pole inputs take analytic versus constrained FABRIK routes with independent middle residuals", () => {
    const build = (constrained: boolean) => {
      const definition = worldRigProject();
      const motion = definition.motions[0]!;
      const solvers = new Set(LIMBS.map((limb) => limbTracks(limb.id).solve));
      const uppers = new Set(LIMBS.map((limb) => limbTracks(limb.id).upper));
      const changed: ProjectDefinition = {
        ...definition,
        motions: [
          {
            ...motion,
            tracks: motion.tracks.map((track) => {
              const keyframes = track.keyframes;
              if (keyframes === undefined) throw new Error("World rig fixture needs keyframes.");
              if (solvers.has(track.id))
                return {
                  ...track,
                  keyframes: { ik3d: { ...keyframes.ik3d, values: { inspect: true } } },
                };
              if (constrained && uppers.has(track.id))
                return {
                  ...track,
                  keyframes: {
                    fk3d: {
                      ...keyframes.fk3d,
                      values: {
                        length: 100,
                        weight: 1,
                        joint: "hinge",
                        axisX: 0,
                        axisY: 0,
                        axisZ: 1,
                        minRotation: 15,
                        maxRotation: 15,
                      },
                    },
                  },
                };
              return track;
            }),
          },
        ],
      };
      const plugins = new PluginRegistry();
      for (const plugin of [transform3dPlugin, fk3dPlugin, ik3dPlugin]) plugins.register(plugin);
      const project = new Engine({ ...fakePorts(), plugins }).load(changed);
      for (const node of project.motion(POSE_MOTION_ID).trackIds) project.mount(node);
      return project;
    };
    for (const angle of [0.3, -0.3, Math.PI + 0.3, Math.PI - 0.3]) {
      const analytic = build(false),
        constrained = build(true);
      try {
        const points = bendPose(angle);
        const first = trustedOf(frameOf(points, 0, WORLD_SPACE));
        const filled = raw.fill(first);
        for (const project of [analytic, constrained])
          createWorldWriter(project, PREDICTED_BEND_POLICY).write(filled, first, lengths);
        for (const limb of LIMBS) {
          const ids = limbTracks(limb.id);
          for (const id of [ids.root, ids.goal, ids.pole]) {
            const a = analytic.get(poseNodeId(id))!,
              b = constrained.get(poseNodeId(id))!;
            if (a.status !== "ready" || b.status !== "ready") throw new Error("not ready");
            expect(a.values).toEqual(b.values);
          }
          const free = analytic.get(poseNodeId(ids.solve))!,
            limited = constrained.get(poseNodeId(ids.solve))!;
          if (free.status !== "ready" || limited.status !== "ready") throw new Error("not ready");
          expect(free.values.inspection).toMatchObject({ kind: "reached", iterations: 0 });
          expect(limited.values.inspection).toMatchObject({ kind: "limited" });
          const a = readSolvedLimb(analytic, limb.id, ["x", "y", "z"])!;
          const b = readSolvedLimb(constrained, limb.id, ["x", "y", "z"])!;
          expect(distance(a.middle, points[limb.middle])).toBeLessThan(1e-5);
          expect(distance(b.middle, points[limb.middle])).toBeGreaterThan(10);
          expect(distance(b.middle, points[limb.root])).toBeCloseTo(100, 7);
          expect(distance(b.tip, b.middle)).toBeCloseTo(100, 7);
          const inspection = limited.values.inspection as {
            readonly residual: number;
            readonly iterations: number;
          };
          expect(inspection.residual).toBeCloseTo(distance(b.tip, points[limb.tip]), 7);
          expect(inspection.iterations).toBeGreaterThan(0);
        }
      } finally {
        analytic.dispose();
        constrained.dispose();
      }
    }
  });
});
