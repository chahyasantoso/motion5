import { describe, expect, it } from "vitest";
import { createBoneLengthEstimator } from "../src/filler/bone-length";
import { DEFAULT_KALMAN_NOISE } from "../src/filler/chain-kalman";
import { presentedPosition } from "../src/filler/frame";
import { createGapFiller, type FillerSpec } from "../src/filler/gap-filler";
import { JOINTS, LIMBS, jointRecord, type JointId } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { WORLD_SPACE } from "../src/filler/space";
import { distance, type Vec } from "../src/filler/vec";
import { STANDING, frameOf, trustedOf } from "./frames";

const CHAIN: FillerSpec = { kind: "chain-kalman", noise: DEFAULT_KALMAN_NOISE, coastMs: 500 };
const ROOTS: readonly JointId[] = LIMBS.map((limb) => limb.root);
const rotating = (tMs: number): Record<JointId, Vec> => {
  const root = STANDING["left-shoulder"];
  const angle = 0.5 + tMs / 1000;
  const elbow: Vec = [root[0]! + 80 * Math.cos(angle), root[1]! + 80 * Math.sin(angle)];
  return {
    ...STANDING,
    "left-elbow": elbow,
    "left-wrist": [elbow[0]! + 70 * Math.cos(angle + 0.7), elbow[1]! + 70 * Math.sin(angle + 0.7)],
  };
};
const pipeline = () =>
  createGapPipeline({ filler: CHAIN, detector: { threshold: 0.5, gate: Infinity } });
const warm = (run: ReturnType<typeof pipeline>) => {
  for (let tMs = 0; tMs <= 900; tMs += 30) run.step(frameOf(rotating(tMs), tMs));
};

describe("relative-angle chain filler", () => {
  it("GF-36 follows the current parent during a wrist gap, using only estimator lengths", () => {
    const run = pipeline();
    warm(run);
    const pose = rotating(1000);
    const output = run.step(
      frameOf({ ...pose, "left-wrist": [-10000, 10000] }, 1000),
      new Set(["left-wrist"]),
    ).filled;
    const wrist = presentedPosition(output.joints["left-wrist"])!;
    expect(output.joints["left-wrist"].kind).toBe("inferred");
    expect(distance(wrist, pose["left-wrist"])).toBeLessThan(0.01);
    expect(distance(wrist, pose["left-elbow"])).toBeCloseTo(run.lengths.length("left-forearm")!, 9);
    expect(distance(rotating(900)["left-wrist"], pose["left-wrist"])).toBeGreaterThan(10);
    const twin = pipeline();
    warm(twin);
    expect(twin.step(frameOf(pose, 1000), new Set(["left-wrist"])).filled).toEqual(output);
    expect(run.lengths.length("left-forearm")).toBeCloseTo(70, 9);
  });

  it("GF-37 predicts a whole missing chain and caps coasting by time since its last measurement", () => {
    const run = pipeline();
    warm(run);
    const gaps = new Set<JointId>(["left-elbow", "left-wrist"]);
    const first = run.step(frameOf(rotating(1000), 1000), gaps).filled;
    const elbow = first.joints["left-elbow"];
    expect(elbow.kind).toBe("inferred");
    if (elbow.kind !== "inferred") throw new Error("Expected inferred elbow");
    expect(elbow.sinceMs).toBe(1000);
    expect(distance(elbow.position, rotating(1000)["left-elbow"])).toBeLessThan(1);
    const boundary = run.step(frameOf(rotating(1400), 1400), gaps).filled;
    expect(boundary.joints["left-wrist"].kind).toBe("inferred");
    const lost = run.step(frameOf(rotating(1401), 1401), gaps).filled;
    expect(lost.joints["left-elbow"]).toEqual({ kind: "lost" });
    expect(lost.joints["left-wrist"]).toEqual({ kind: "lost" });
    const recovered = run.step(frameOf(rotating(1500), 1500)).filled;
    expect(recovered.joints["left-elbow"].kind).toBe("measured");
    expect(run.step(frameOf(rotating(1510), 1510), gaps).filled.joints["left-elbow"].kind).toBe(
      "inferred",
    );
    run.reset();
    const blank = run.step(frameOf(rotating(0), 0), gaps).filled;
    expect(blank.joints["left-elbow"]).toEqual({ kind: "lost" });
    expect(blank.joints["left-wrist"]).toEqual({ kind: "lost" });
  });

  it("GF-38 rebuilds either missing root from one shared width and falls back without a torso parent", () => {
    for (const root of ROOTS) {
      const run = pipeline();
      run.step(frameOf(STANDING, 0));
      const filled = run.step(frameOf(STANDING, 100), new Set([root])).filled;
      expect(filled.joints[root].kind).toBe("inferred");
      expect(distance(presentedPosition(filled.joints[root])!, STANDING[root])).toBeLessThan(0.001);
    }
    const run = pipeline();
    const translated = (tMs: number) =>
      jointRecord((joint): Vec => [STANDING[joint][0]! + tMs / 10, STANDING[joint][1]!]);
    for (let tMs = 0; tMs <= 900; tMs += 30) run.step(frameOf(translated(tMs), tMs));
    const filled = run.step(frameOf(translated(1000), 1000), new Set(ROOTS)).filled;
    for (const root of ROOTS) {
      expect(filled.joints[root].kind).toBe("inferred");
      expect(
        distance(presentedPosition(filled.joints[root])!, translated(1000)[root]),
      ).toBeLessThan(1);
    }
  });

  it("GF-39 never invents geometry and refuses malformed dimensions, missing lengths and bad time", () => {
    const filler = createGapFiller(CHAIN);
    const lengths = createBoneLengthEstimator();
    expect(() => filler.fill(trustedOf(frameOf(STANDING)))).toThrow(/estimator/);
    expect(() => filler.fill(trustedOf(frameOf(STANDING, 0, WORLD_SPACE)), lengths)).toThrow(
      /three-dimensional/,
    );
    const frame = trustedOf(frameOf(STANDING), JOINTS);
    const output = filler.fill(frame, lengths);
    for (const joint of JOINTS) expect(output.joints[joint]).toEqual({ kind: "lost" });
    expect(() => filler.fill(frame, lengths)).toThrow(/strictly increasing/);
    filler.reset();
    expect(() => filler.fill(trustedOf(frameOf(STANDING, NaN)), lengths)).toThrow(/finite/);
    expect(() => createGapFiller({ ...CHAIN, coastMs: -1 } as FillerSpec)).toThrow(/coastMs/);
  });
});
