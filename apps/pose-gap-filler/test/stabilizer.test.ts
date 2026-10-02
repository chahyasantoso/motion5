import { describe, expect, it } from "vitest";
import { presentedPosition, trustedPosition, type FilledFrame } from "../src/filler/frame";
import type { FillerSpec } from "../src/filler/gap-filler";
import { JOINTS, LIMBS, jointRecord, type JointId } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { IMAGE_SPACE, LANDMARK_SPACES, WORLD_SPACE, type LandmarkSpace } from "../src/filler/space";
import {
  createStabilizer,
  IMAGE_ONE_EURO,
  NO_STABILIZER,
  oneEuroStep,
  STABILIZER_KINDS,
  stabilizerFor,
  WORLD_ONE_EURO,
  type OneEuroSpec,
  type StabilizerSpec,
} from "../src/filler/stabilizer";
import { add, distance, type Vec } from "../src/filler/vec";
import { createExperiment, LIVE_FILLER, LIVE_STABILIZER } from "../src/live/experiment";
import { comparedFillers } from "../src/replay/compare";
import { replayFrame, type PoseRecording } from "../src/replay/recording";
import { createSyntheticRecording } from "../src/replay/synthetic";
import { loadImageRig, loadWorldRig, readSolvedLimb } from "../src/rig/rig";
import { createRigSolver } from "../src/rig/solver";
import { createImageWriter, createWorldWriter, MIN_BEND_SINE } from "../src/rig/writer";
import { fakePorts } from "./engine";
import { frameOf, trustedOf } from "./frames";

const WARM_UP_FRAMES = 30;

function take(motion: "still" | "exercise", noiseScale: number): PoseRecording {
  return createSyntheticRecording({
    motion: { kind: motion },
    seed: 11,
    durationMs: 4000,
    fps: 30,
    noiseScale,
  });
}

function chainOf(space: LandmarkSpace): FillerSpec {
  return comparedFillers(space).find((spec) => spec.kind === "chain-kalman")!;
}

/** Per joint, what was presented each frame: the pipeline's fill, or the rig's solve where written. */
type Shown = Array<Record<JointId, Vec | undefined>>;

function present(filled: FilledFrame): Record<JointId, Vec | undefined> {
  return jointRecord((joint) => presentedPosition(filled.joints[joint]));
}

function run(
  recording: PoseRecording,
  space: LandmarkSpace,
  stabilizer: StabilizerSpec,
  options: { filler?: FillerSpec; rig?: boolean } = {},
): Shown {
  const pipeline = createGapPipeline({ filler: options.filler ?? chainOf(space), stabilizer });
  const solver = options.rig === true ? createRigSolver(fakePorts(), space) : undefined;
  try {
    return recording.frames.map((recorded) => {
      const step = pipeline.step(replayFrame(recording, recorded, space));
      const shown = present(step.filled);
      const chains = solver?.solve(step, pipeline.lengths);
      if (chains !== undefined)
        for (const limb of LIMBS) {
          const chain = chains.get(limb.id);
          shown[limb.middle] = chain?.middle;
          shown[limb.tip] = chain?.tip;
        }
      return shown;
    });
  } finally {
    solver?.dispose();
  }
}

/** Mean frame-to-frame motion of every shown joint after the warm-up: how much a still pose moves. */
function meanStep(shown: Shown): number {
  let total = 0;
  let count = 0;
  for (let index = WARM_UP_FRAMES + 1; index < shown.length; index += 1)
    for (const joint of JOINTS) {
      const [before, after] = [shown[index - 1]![joint], shown[index]![joint]];
      if (before === undefined || after === undefined) continue;
      total += distance(before, after);
      count += 1;
    }
  expect(count).toBeGreaterThan(0);
  return total / count;
}

/** Mean distance of every shown joint from the noiseless twin's measurement, after the warm-up. */
function truthError(shown: Shown, truth: PoseRecording, space: LandmarkSpace): number {
  let total = 0;
  let count = 0;
  truth.frames.forEach((recorded, index) => {
    if (index < WARM_UP_FRAMES) return;
    const frame = replayFrame(truth, recorded, space);
    for (const joint of JOINTS) {
      const observed = frame.joints[joint];
      const at = shown[index]![joint];
      if (observed.kind !== "measured" || at === undefined) continue;
      total += distance(at, observed.position);
      count += 1;
    }
  });
  expect(count).toBeGreaterThan(0);
  return total / count;
}

describe("trusted-measurement stabilizer", () => {
  it("GF-61 is one exhaustive factory: none is the identity, presets are per space, bad specs throw", () => {
    const frame = trustedOf(frameOf({ "left-wrist": [10, 20] }, 0));
    expect(createStabilizer(NO_STABILIZER).stabilize(frame)).toBe(frame);
    expect(STABILIZER_KINDS).toEqual(["one-euro", "none"]);
    expect(stabilizerFor("one-euro", IMAGE_SPACE)).toBe(IMAGE_ONE_EURO);
    expect(stabilizerFor("one-euro", WORLD_SPACE)).toBe(WORLD_ONE_EURO);
    for (const space of LANDMARK_SPACES) expect(stabilizerFor("none", space)).toBe(NO_STABILIZER);
    expect(IMAGE_ONE_EURO).not.toEqual(WORLD_ONE_EURO);
    const valid = { kind: "one-euro", minCutoffHz: 1, beta: 0, derivativeCutoffHz: 1 } as const;
    expect(() => createStabilizer(valid)).not.toThrow();
    // A valid spec is snapshotted: mutating the caller's object afterwards changes nothing.
    const mutable: { -readonly [K in keyof OneEuroSpec]: OneEuroSpec[K] } = { ...valid };
    const snapshot = createStabilizer(mutable);
    const reference = createStabilizer(valid);
    mutable.minCutoffHz = 1000;
    const series = (stabilizer: typeof snapshot) =>
      [0, 33, 66].map((tMs, index) =>
        trustedPosition(
          stabilizer.stabilize(trustedOf(frameOf({ "left-wrist": [10 * index, 0] }, tMs))).trust[
            "left-wrist"
          ],
        ),
      );
    expect(series(snapshot)).toEqual(series(reference));
    for (const bad of [
      { ...valid, minCutoffHz: 0 },
      { ...valid, derivativeCutoffHz: Number.NaN },
      { ...valid, beta: -1 },
      { ...valid, beta: Infinity },
    ])
      expect(() => createStabilizer(bad)).toThrow(/One Euro/);
    expect(() => createStabilizer({ kind: "median" } as unknown as StabilizerSpec)).toThrow(
      /Unhandled stabilizer spec/,
    );
  });

  it("GF-62 holds a still subject still in both spaces and lands nearer the noiseless pose", () => {
    for (const noiseScale of [1, 3])
      for (const space of LANDMARK_SPACES) {
        const noisy = take("still", noiseScale);
        const truth = take("still", 0);
        const before = run(noisy, space, NO_STABILIZER);
        const after = run(noisy, space, stabilizerFor("one-euro", space));
        expect(meanStep(after)).toBeLessThan(meanStep(before) / 4);
        expect(truthError(after, truth, space)).toBeLessThan(truthError(before, truth, space) / 2);
      }
  });

  it("GF-63 still follows a moving subject: bounded lag at default noise, better than raw at 3x", () => {
    for (const space of LANDMARK_SPACES) {
      const truth = take("exercise", 0);
      const stable = stabilizerFor("one-euro", space);
      const at = (noiseScale: number, spec: StabilizerSpec) =>
        truthError(run(take("exercise", noiseScale), space, spec), truth, space);
      expect(at(1, stable)).toBeLessThan(1.5 * at(1, NO_STABILIZER));
      expect(at(3, stable)).toBeLessThan(at(3, NO_STABILIZER));
    }
    // A 100 px step settles: the speed term opens the cutoff, so a third of a second is enough.
    let state = oneEuroStep(IMAGE_ONE_EURO, undefined, 0, [0, 0]);
    for (let frame = 1; frame <= 10; frame += 1)
      state = oneEuroStep(IMAGE_ONE_EURO, state, (frame * 1000) / 30, [100, 0]);
    expect(distance(state.value, [100, 0])).toBeLessThan(2);
  });

  it("GF-64 leaves trust and observations raw and never learns from an untrusted sample", () => {
    const recording = take("exercise", 3);
    for (const space of LANDMARK_SPACES) {
      const options = { filler: { kind: "raw" } as const };
      const plain = createGapPipeline(options);
      const stable = createGapPipeline({
        ...options,
        stabilizer: stabilizerFor("one-euro", space),
      });
      recording.frames.forEach((recorded, index) => {
        const frame = replayFrame(recording, recorded, space);
        const forced = new Set<JointId>(index % 7 === 0 ? ["left-wrist"] : []);
        const [a, b] = [plain.step(frame, forced), stable.step(frame, forced)];
        for (const joint of JOINTS)
          expect(b.trusted.trust[joint].kind).toBe(a.trusted.trust[joint].kind);
        // `raw` reads observations, so it is the unprocessed reference with or without a stabilizer.
        expect(b.filled).toEqual(a.filled);
        expect(b.trusted.joints).toBe(frame.joints);
      });
    }
    // A forced (untrusted) teleport never enters the state: the next trusted sample blends from
    // the pre-gap value, not from the teleport.
    const stabilizer = createStabilizer(IMAGE_ONE_EURO);
    stabilizer.stabilize(trustedOf(frameOf({ "left-wrist": [100, 100] }, 0)));
    const gap = stabilizer.stabilize(
      trustedOf(frameOf({ "left-wrist": [900, 900] }, 33), ["left-wrist"]),
    );
    expect(gap.trust["left-wrist"]).toEqual({ kind: "gap", reason: "forced" });
    const back = stabilizer.stabilize(trustedOf(frameOf({ "left-wrist": [101, 100] }, 66)));
    expect(distance(trustedPosition(back.trust["left-wrist"])!, [100, 100])).toBeLessThan(1);
  });

  it("GF-65 reads time from the frame: repeated time holds, replays repeat exactly, reset forgets", () => {
    const spec: OneEuroSpec = IMAGE_ONE_EURO;
    const first = oneEuroStep(spec, undefined, 10, [5, 5]);
    expect(first.value).toEqual([5, 5]);
    expect(oneEuroStep(spec, first, 10, [50, 50])).toBe(first);
    expect(oneEuroStep(spec, first, 5, [50, 50])).toBe(first);
    // Bad input is refused before any state advances.
    expect(() => oneEuroStep(spec, first, Number.NaN, [1, 1])).toThrow(/time/);
    expect(() => oneEuroStep(spec, first, 20, [Number.NaN, 1])).toThrow(/sample/);
    expect(() => oneEuroStep(spec, first, 20, [1, 1, 1])).toThrow(/dimension/);
    expect(() => oneEuroStep(spec, undefined, 0, [Infinity, 0])).toThrow(/sample/);
    // A constant-velocity ramp is followed with a bounded, settled lag: the speed term opens the
    // cutoff rather than letting a moving joint trail at the still cutoff.
    let ramp = oneEuroStep(spec, undefined, 0, [0, 0]);
    const lags: number[] = [];
    for (let frame = 1; frame <= 90; frame += 1) {
      ramp = oneEuroStep(spec, ramp, (frame * 1000) / 30, [3 * frame, 0]);
      lags.push(3 * frame - ramp.value[0]!);
    }
    expect(lags.at(-1)!).toBeLessThan(6);
    expect(Math.abs(lags.at(-1)! - lags.at(-31)!)).toBeLessThan(0.05);
    const recording = take("still", 1);
    const stable = stabilizerFor("one-euro", IMAGE_SPACE);
    expect(run(recording, IMAGE_SPACE, stable)).toEqual(run(recording, IMAGE_SPACE, stable));
    const pipeline = createGapPipeline({ filler: { kind: "hold" }, stabilizer: stable });
    pipeline.step(frameOf({ "left-wrist": [0, 0] }, 0));
    pipeline.reset();
    const after = pipeline.step(frameOf({ "left-wrist": [300, 300] }, 33));
    expect(after.filled.joints["left-wrist"]).toEqual({ kind: "measured", position: [300, 300] });
  });
});

describe("bend-side hysteresis", () => {
  const ROOT: Vec = [300, 100];
  const GOAL: Vec = [300, 300];
  /** A nearly straight arm whose measured elbow sits `offset` px off the reach line. */
  const arm = (offset: number) => ({
    "left-shoulder": ROOT,
    "left-elbow": [300 + offset, 200],
    "left-wrist": GOAL,
  });

  it("GF-66 holds the 2D bend side through a straight limb's noise and flips on a decisive bend", () => {
    const loaded = loadImageRig(fakePorts());
    try {
      const writer = createImageWriter(loaded);
      const pipeline = createGapPipeline({
        filler: { kind: "raw" },
        detector: { threshold: 0.5, gate: Infinity },
      });
      const write = (offset: number, tMs: number) => {
        const step = pipeline.step(frameOf(arm(offset), tMs));
        // Lengths of a bent arm, so the solve bends visibly and its side is observable.
        writer.write(step.filled, step.trusted, { length: () => 120 });
        return readSolvedLimb(loaded, "left-arm")!.middle[0]! - 300;
      };
      const side = Math.sign(write(3, 0));
      expect(side).toBe(1);
      // Wobbles across the reach line, all under MIN_BEND_SINE: the solved elbow never changes side.
      const wobble = [-4, 2, -6, 5, -3, -8, 1];
      for (const offset of wobble)
        expect(Math.abs(offset) / Math.hypot(offset, 100)).toBeLessThan(MIN_BEND_SINE);
      wobble.forEach((offset, index) =>
        expect(Math.sign(write(offset, 33 * (index + 1)))).toBe(side),
      );
      // A decisive opposite bend (about 17 degrees at the root) does change it.
      expect(Math.sign(write(-30, 33 * 9))).toBe(-1);
    } finally {
      loaded.dispose();
    }
  });

  it("GF-67 holds the 3D pole through a straight limb's noise and turns on a decisive bend", () => {
    const loaded = loadWorldRig(fakePorts());
    try {
      const writer = createWorldWriter(loaded);
      const pipeline = createGapPipeline({
        filler: { kind: "raw" },
        detector: { threshold: 0.5, gate: Infinity },
      });
      const root: Vec = [0, 0, 0];
      const goal: Vec = [0, 500, 0];
      const write = (offset: Vec, tMs: number) => {
        const step = pipeline.step(
          frameOf(
            { "left-shoulder": root, "left-elbow": add([0, 250, 0], offset), "left-wrist": goal },
            tMs,
            WORLD_SPACE,
          ),
        );
        writer.write(step.filled, step.trusted, { length: () => 300 });
        return readSolvedLimb(loaded, "left-arm", ["x", "y", "z"])!.middle;
      };
      const held = write([10, 0, 0], 0);
      // Small offsets in every perpendicular direction: the bend plane does not spin.
      const noise: Vec[] = [
        [0, 0, 12],
        [-9, 0, 0],
        [6, 0, -8],
        [0, 0, -15],
        [-12, 0, 5],
      ];
      noise.forEach((offset, index) => {
        expect(Math.hypot(offset[0]!, offset[2]!) / 250).toBeLessThan(MIN_BEND_SINE);
        expect(distance(write(offset, 33 * (index + 1)), held)).toBeLessThan(1e-6);
      });
      // A decisive bend toward -z (about 17 degrees) turns the plane there.
      const turned = write([0, 0, -80], 33 * 7);
      expect(turned[2]!).toBeLessThan(-100);
    } finally {
      loaded.dispose();
    }
  });
});

describe("the live page holds a still person still", () => {
  it("GF-68 starts on chain-kalman with the per-space stabilizer and stills the Engine rig in both spaces", () => {
    expect(LIVE_FILLER).toBe("chain-kalman");
    expect(LIVE_STABILIZER).toBe("one-euro");
    for (const space of LANDMARK_SPACES) {
      const experiment = createExperiment(space);
      expect(experiment.filler).toBe("chain-kalman");
      expect(experiment.stabilizer).toBe(stabilizerFor("one-euro", space));
      const before = experiment.pipeline;
      experiment.stabilize("none");
      expect(experiment.stabilizer).toBe(NO_STABILIZER);
      expect(experiment.pipeline).not.toBe(before);
      // The rig the user sees: raw input against the live defaults, still subject, real solves.
      const noisy = take("still", 2);
      const raw = run(noisy, space, NO_STABILIZER, { filler: { kind: "raw" }, rig: true });
      const live = run(noisy, space, stabilizerFor(LIVE_STABILIZER, space), { rig: true });
      expect(meanStep(live)).toBeLessThan(meanStep(raw) / 4);
    }
  });
});
