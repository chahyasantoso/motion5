import { describe, expect, it } from "vitest";
import { JOINTS, jointRecord, type JointId } from "../src/filler/landmarks";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";
import type { Vec } from "../src/filler/vec";
import {
  COMPARED_FILLERS,
  DEFAULT_MASKS,
  calibrateDetector,
  compareFillers,
  formatComparison,
} from "../src/replay/compare";
import { maskedJoints, validateMask, type Mask } from "../src/replay/mask";
import { measureReplay, summarize, type ReplayMetrics } from "../src/replay/metrics";
import { replayFrame } from "../src/replay/recording";
import { runReplay, type ReplayFrame } from "../src/replay/replay";
import { createSyntheticRecording } from "../src/replay/synthetic";
import { createImageRigSolver } from "../src/rig/solver";
import { fakePorts } from "./engine";

const exercise = createSyntheticRecording({
  motion: { kind: "exercise" },
  seed: 11,
  durationMs: 6000,
  fps: 30,
});
const still = createSyntheticRecording({
  motion: { kind: "still" },
  seed: 7,
  durationMs: 6000,
  fps: 30,
});

describe("replay masks", () => {
  it("GF-20 covers a span or a periodic run of frames, unions joints, and refuses bad ranges", () => {
    const masks: Mask[] = [
      { kind: "span", joints: ["left-wrist"], from: 2, to: 4 },
      { kind: "periodic", joints: ["left-wrist", "right-knee"], every: 5, length: 2, offset: 3 },
    ];
    const at = (frame: number) => [...maskedJoints(masks, frame)].sort();
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((frame) => at(frame).length)).toEqual([
      0, 0, 1, 2, 2, 0, 0, 0, 2, 2,
    ]);
    expect(at(3)).toEqual(["left-wrist", "right-knee"]);
    const refused: Mask[] = [
      { kind: "span", joints: ["left-wrist"], from: 3, to: 3 },
      { kind: "span", joints: ["left-wrist"], from: -1, to: 3 },
      { kind: "periodic", joints: ["left-wrist"], every: 4, length: 4, offset: 0 },
      { kind: "periodic", joints: ["left-wrist"], every: 4, length: 1.5, offset: 0 },
      { kind: "span", joints: [], from: 0, to: 1 },
    ];
    for (const mask of refused) expect(() => validateMask(mask)).toThrow(/[Mm]ask/);
    expect(() => validateMask({ kind: "blink" } as unknown as Mask)).toThrow(/Unhandled mask/);
  });
});

describe("replay runner", () => {
  it("GF-21 is deterministic on the recording's clock, masks trust only, and shows the rig's solve", () => {
    const masks: Mask[] = [{ kind: "span", joints: ["left-wrist"], from: 40, to: 55 }];
    const options = {
      recording: exercise,
      space: IMAGE_SPACE,
      filler: { kind: "hold" },
      masks,
    } as const;
    const first = runReplay(options);
    expect(runReplay(options)).toEqual(first);
    expect(first.map((frame) => frame.tMs)).toEqual(exercise.frames.map((frame) => frame.tMs));
    const inGap = first[45]!;
    expect(inGap.masked.has("left-wrist")).toBe(true);
    expect(inGap.trust["left-wrist"]).toEqual({ kind: "gap", reason: "forced" });
    // The reference ignores masks and trust alike: it is the landmark the frame measured.
    const measured = (index: number) => {
      const joint = replayFrame(exercise, exercise.frames[index]!, IMAGE_SPACE).joints[
        "left-wrist"
      ];
      return joint.kind === "measured" ? joint.position : undefined;
    };
    expect(inGap.reference["left-wrist"]).toEqual(measured(45));
    // Even a detector that gates every move keeps the reference: one landmark judges every filler.
    const strict = runReplay({ ...options, detector: { threshold: 0, gate: 1e-6 } });
    expect(strict[45]!.trust["left-wrist"].kind).toBe("gap");
    expect(strict[45]!.reference["left-wrist"]).toEqual(measured(45));
    expect(inGap.presented["left-wrist"]).toEqual(first[39]!.presented["left-wrist"]);
    // With a rig, a limb's middle and tip are where it solved them, never the raw fill.
    const solver = createImageRigSolver(fakePorts());
    const solved = runReplay({ ...options, solver });
    solver.dispose();
    const frame = solved[20]!;
    const lengthOf = (pose: ReplayFrame["presented"], a: JointId, b: JointId) => {
      const [p, q] = [pose[a]!, pose[b]!];
      return Math.hypot(p[0]! - q[0]!, p[1]! - q[1]!);
    };
    expect(lengthOf(frame.presented, "left-shoulder", "left-elbow")).not.toBeCloseTo(
      lengthOf(frame.reference, "left-shoulder", "left-elbow"),
      6,
    );
    expect(frame.presented["left-wrist"]![0]).toBeCloseTo(frame.reference["left-wrist"]![0]!, 6);
    // A shoulder held out from the first frame is never trusted, so hold loses it and the writer
    // skips the arm: its elbow shows its fill, as the overlay draws it, here the measured landmark.
    const rig = createImageRigSolver(fakePorts());
    const skipped = runReplay({
      ...options,
      masks: [{ kind: "span", joints: ["left-shoulder"], from: 0, to: 10 }],
      solver: rig,
    });
    rig.dispose();
    expect(skipped[5]!.presented["left-shoulder"]).toBeUndefined();
    expect(skipped[5]!.presented["left-elbow"]).toEqual(skipped[5]!.reference["left-elbow"]);
  });
});

/** A hand-built replay: one joint on a line at `speed` units per frame, every frame 100 ms. */
function line(
  values: ReadonlyArray<{ shown?: number; reference?: number; masked?: boolean; gap?: boolean }>,
) {
  return values.map((value, index): ReplayFrame => {
    const at = (x: number | undefined) => (x === undefined ? undefined : ([x, 0] as Vec));
    const only = (position: Vec | undefined) =>
      jointRecord((joint) => (joint === "left-wrist" ? position : undefined));
    return {
      tMs: index * 100,
      masked: new Set<JointId>(value.masked ? ["left-wrist"] : []),
      reference: only(at(value.reference)),
      presented: only(at(value.shown)),
      trust: jointRecord(() =>
        value.gap
          ? { kind: "gap", reason: "forced" }
          : { kind: "trusted", position: [0, 0], visibility: 1 },
      ),
    };
  });
}

describe("replay metrics", () => {
  it("GF-22 measures position error, lost frames, jitter, lag and recovery snap", () => {
    expect(summarize([])).toEqual({ count: 0, mean: undefined, p95: undefined, max: undefined });
    expect(summarize([4, 1, 3, 2])).toEqual({ count: 4, mean: 2.5, p95: 4, max: 4 });
    // Constant velocity: no acceleration at all.
    const steady = measureReplay(line([0, 1, 2, 3, 4].map((x) => ({ shown: x, reference: x }))));
    expect(steady.jitter).toMatchObject({ count: 3, max: 0 });
    expect(steady.lagMs).toBe(0);
    // A single +1 step: velocity goes 0 → 10 → 0 u/s over 0.1 s frames, so ±100 u/s² and no more.
    const bump = measureReplay(line([0, 0, 1, 1, 1].map((x) => ({ shown: x, reference: x }))));
    expect(bump.jitter.max).toBeCloseTo(100, 9);
    // Shown trails the reference by two frames: lag 200 ms.
    const trailing = measureReplay(
      line([0, 1, 2, 3, 4, 5, 6, 7].map((x) => ({ shown: Math.max(0, x - 2), reference: x }))),
    );
    expect(trailing.lagMs).toBe(200);
    // Frames without elapsed time have no acceleration: skipped, never a NaN.
    const stalled = line([0, 1, 2].map((x) => ({ shown: x, reference: x }))).map(
      (frame, index) => ({
        ...frame,
        tMs: [0, 0, 100][index]!,
      }),
    );
    expect(measureReplay(stalled).jitter.count).toBe(0);
    // A held gap: error against the unmasked reference, a lost frame, and the snap at recovery.
    const gap = measureReplay(
      line([
        { shown: 0, reference: 0 },
        { shown: 0, reference: 1, masked: true, gap: true },
        { shown: 0, reference: 2, masked: true, gap: true },
        { reference: 3, masked: true, gap: true },
        { shown: 4, reference: 4 },
      ]),
    );
    expect(gap.positionError).toMatchObject({ count: 2, mean: 1.5, max: 2 });
    expect(gap.lostFrames).toBe(1);
    expect(gap.recoverySnap.count).toBe(0);
    const snap = measureReplay(
      line([
        { shown: 0, reference: 0 },
        { shown: 0, reference: 2, masked: true, gap: true },
        { shown: 3, reference: 3 },
      ]),
    );
    expect(snap.recoverySnap).toMatchObject({ count: 1, max: 3 });
  });

  it("GF-23 calibrates on a still subject and compares raw and hold on the exercise in both spaces", () => {
    const calibration = calibrateDetector(still);
    expect(calibration.visibilityP01).toBeGreaterThan(0.85);
    expect(calibration.detector.threshold).toBeLessThanOrEqual(0.5);
    expect(calibration.detector.gate).toBeGreaterThanOrEqual(20);
    expect(calibration.detector.gate).toBeGreaterThan(4 * calibration.speedP999 - 1e-9);
    // Calibrated on stillness, the detector still trusts every joint of the moving exercise.
    for (const recording of [still, exercise])
      for (const frame of runReplay({
        recording,
        space: IMAGE_SPACE,
        filler: { kind: "raw" },
        detector: calibration.detector,
      }))
        for (const joint of JOINTS) expect(frame.trust[joint].kind).toBe("trusted");
    const rows = (space: typeof IMAGE_SPACE) =>
      new Map(
        compareFillers({
          recording: exercise,
          space,
          fillers: COMPARED_FILLERS,
          masks: DEFAULT_MASKS,
          detector: calibration.detector,
          createSolver: space === IMAGE_SPACE ? () => createImageRigSolver(fakePorts()) : undefined,
        }).map((row): [string, ReplayMetrics] => [row.filler, row.metrics]),
      );
    const world = rows(WORLD_SPACE);
    // In world space without a rig, raw is the reference itself; hold pays for every held frame.
    expect(world.get("raw")!.positionError.max).toBe(0);
    expect(world.get("raw")!.boneLengthDeviation.max).toBe(0);
    expect(world.get("hold")!.positionError.mean).toBeGreaterThan(50);
    expect(world.get("hold")!.boneLengthDeviation.mean).toBeGreaterThan(10);
    expect(world.get("hold")!.recoverySnap.mean).toBeGreaterThan(
      world.get("raw")!.recoverySnap.mean!,
    );
    const image = rows(IMAGE_SPACE);
    expect(image.get("hold")!.positionError.mean).toBeGreaterThan(
      image.get("raw")!.positionError.mean!,
    );
    for (const metrics of image.values()) expect(metrics.lostFrames).toBe(0);
    const table = formatComparison(
      [...image].map(([filler, metrics]) => ({ filler: filler as "raw", metrics })),
      IMAGE_SPACE,
    );
    expect(table.split("\n")).toHaveLength(4);
    expect(table).toContain("position error px");
    expect(formatComparison([], WORLD_SPACE)).toContain("jitter mm/s²");
  });
});
