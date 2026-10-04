import { describe, expect, it } from "vitest";
import { createGapPipeline } from "../src/filler/pipeline";
import { parsePoseResult } from "../src/filler/adapter";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { LANDMARK_SPACES, WORLD_SPACE } from "../src/filler/space";
import { stabilizerFor } from "../src/filler/stabilizer";
import { actorFrame, actorPose, hipMidpoint } from "../src/synthetic/actor";
import { defaultCameraSpec } from "../src/synthetic/camera";
import { CORRUPTION_PRESETS } from "../src/synthetic/corruption";
import { GEOMETRIC_SCORES } from "../src/synthetic/observation";
import { createSimulator, reportResult } from "../src/synthetic/simulator";
import { createAvatarScene } from "../src/view/avatar";
import { createWorldRigSolver } from "../src/rig/solver";
import { JOINTS } from "../src/filler/landmarks";
import { fakePorts } from "./engine";

const STAGE = { width: 640, height: 480 };
const camera = defaultCameraSpec(STAGE, hipMidpoint(actorFrame(actorPose())));
const filler = { kind: "chain-kalman" as const, noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 };

describe("real simulator corruption and endpoint-expiry regressions", () => {
  it("accepts the clean fast arm reversal in both spaces under the default gate", () => {
    for (const space of LANDMARK_SPACES) {
      const simulator = createSimulator({
        drive: { kind: "scenario", scenario: "arm-reversal" },
        camera,
      });
      const pipeline = createGapPipeline({ filler, stabilizer: stabilizerFor("one-euro", space) });
      let rejected = 0;
      for (let k = 0; k < 180; k++) {
        const t = (k * 1000) / 30;
        const step = pipeline.step(
          parsePoseResult(reportResult(simulator.frame(t).report), t, space, STAGE),
        );
        rejected += Object.keys(step.trusted.rejections ?? {}).length;
      }
      expect(rejected).toBe(0);
    }
  });

  it("rejects actual seeded phone outliers while retaining complete warmed-up world presentation", () => {
    const simulator = createSimulator({
      drive: { kind: "scenario", scenario: "standing" },
      camera,
      corruption: CORRUPTION_PRESETS.phone,
    });
    const run = createGapPipeline({ filler, stabilizer: stabilizerFor("one-euro", WORLD_SPACE) });
    const solver = createWorldRigSolver(fakePorts());
    const avatar = createAvatarScene();
    let rejected = 0,
      dropped = 0;
    try {
      for (let k = 0; k < 900; k++) {
        const timing = simulator.timing(k);
        if (timing.kind === "dropped") {
          dropped++;
          continue;
        }
        const t = timing.tMs;
        const frame = parsePoseResult(
          reportResult(simulator.frame(t).report),
          t,
          WORLD_SPACE,
          STAGE,
        );
        const step = run.step(frame);
        rejected += Object.keys(step.trusted.rejections ?? {}).length;
        avatar.update(step, solver.solve(step, run.lengths), run.lengths, solver.readPatch);
        if (k > 30)
          expect([...avatar.objects.values()].every((object) => object.visible)).toBe(true);
      }
      expect(rejected).toBeGreaterThan(0);
      expect(dropped).toBeGreaterThan(0);
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });

  it("keeps the lower-back wrist visible after geometric confidence and endpoint coast expire", () => {
    const simulator = createSimulator({
      drive: { kind: "scenario", scenario: "wrist-behind-torso" },
      camera,
      scores: GEOMETRIC_SCORES,
    });
    const run = createGapPipeline({ filler, stabilizer: stabilizerFor("one-euro", WORLD_SPACE) });
    const solver = createWorldRigSolver(fakePorts());
    const avatar = createAvatarScene();
    let stale = 0;
    try {
      // Bootstrap a valid subject before the hand enters occlusion, not hidden simulator truth.
      const clear = createSimulator({ drive: { kind: "scenario", scenario: "standing" }, camera });
      const first = run.step(
        parsePoseResult(reportResult(clear.frame(0).report), 0, WORLD_SPACE, STAGE),
      );
      avatar.update(first, solver.solve(first, run.lengths), run.lengths, solver.readPatch);
      for (let k = 1; k < 180; k++) {
        const t = (k * 1000) / 30;
        const step = run.step(
          parsePoseResult(reportResult(simulator.frame(t).report), t, WORLD_SPACE, STAGE),
        );
        const solved = solver.solve(step, run.lengths);
        avatar.update(step, solved, run.lengths, solver.readPatch);
        const hand = avatar.objects.get("left-arm-extremity")!;
        expect(hand.visible).toBe(true);
        if (hand.userData.freshness.kind === "stale") {
          stale++;
          expect(solved.has("left-arm")).toBe(false);
        }
        for (const joint of JOINTS) {
          const trust = step.trusted.trust[joint];
          if (trust.kind === "trusted") expect(trust.position.every(Number.isFinite)).toBe(true);
        }
      }
      expect(stale).toBeGreaterThan(0);
    } finally {
      avatar.dispose();
      solver.dispose();
    }
  });
});
