import { describe, expect, it } from "vitest";
import { parsePoseResult, readRawPose, writePoseResult } from "../src/filler/adapter";
import { IMAGE_SPACE, LANDMARK_SPACES } from "../src/filler/space";
import { createPlaybackSource, loopPeriod } from "../src/live/playback";
import type { SourceSample, WebcamSourcePorts } from "../src/live/source";
import {
  SOURCE_SPECS,
  createLandmarkSource,
  sourceId,
  sourceLabel,
  type SourceSpec,
} from "../src/live/sources";
import { replayFrame, type PoseRecording } from "../src/replay/recording";
import {
  DEFAULT_STAGE,
  SYNTHETIC_TAKES,
  createSyntheticRecording,
  syntheticWorldPose,
} from "../src/replay/synthetic";
import { manualFrames } from "./frame-ports";

const SHORT: PoseRecording = createSyntheticRecording({
  ...SYNTHETIC_TAKES.exercise,
  durationMs: 200,
});
const STEP = 1000 / 30;

function collect(): { samples: SourceSample[]; onSample: (sample: SourceSample) => void } {
  const samples: SourceSample[] = [];
  return { samples, onSample: (sample) => samples.push(sample) };
}

/** Webcam ports that fail the test the moment anything would download or open a camera. */
const FORBIDDEN_WEBCAM: WebcamSourcePorts = {
  loadLandmarker: () => {
    throw new Error("loaded MediaPipe");
  },
  getUserMedia: () => {
    throw new Error("asked for the camera");
  },
  requestFrame: () => {
    throw new Error("ran the webcam frame loop");
  },
  cancelFrame: () => {
    throw new Error("cancelled a webcam frame");
  },
};
const NO_VIDEO = {} as HTMLVideoElement;

describe("landmark sources (#540)", () => {
  it("GF-80 writes a recorded pose as the result the one reader reads, NaN and no-pose included", () => {
    const frame = SHORT.frames[2]!;
    const holed = frame.image!.map((landmark, index) =>
      index === 13
        ? ([Number.NaN, landmark[1], landmark[2], landmark[3], landmark[4]] as const)
        : landmark,
    );
    for (const space of LANDMARK_SPACES)
      expect(
        parsePoseResult(writePoseResult(frame.image, frame.world), 5, space, DEFAULT_STAGE),
      ).toEqual(replayFrame(SHORT, { ...frame, tMs: 5 }, space));
    expect(readRawPose(writePoseResult(holed, null), IMAGE_SPACE)).toEqual(holed);
    expect(readRawPose(writePoseResult(null, null), IMAGE_SPACE)).toBeUndefined();
    expect(writePoseResult(null, null)).toEqual({ landmarks: [], worldLandmarks: [] });
  });

  it("GF-81 plays every frame in order, never early and at most one per animation frame, then loops", () => {
    const frames = manualFrames();
    const { samples, onSample } = collect();
    const source = createPlaybackSource(SHORT, { loop: true }, frames.ports);
    void source.start(onSample);
    frames.frame();
    expect(samples.map((sample) => sample.tMs)).toEqual([0]);
    // Not yet due: no frame, however many animation frames run.
    frames.advance(STEP / 2);
    frames.frame();
    frames.frame();
    expect(samples).toHaveLength(1);
    // A stall makes several frames due; still one per animation frame, in recorded order.
    frames.advance(STEP * 4);
    for (let index = 0; index < 3; index += 1) frames.frame();
    expect(samples.map((sample) => sample.tMs)).toEqual(SHORT.frames.slice(0, 4).map((f) => f.tMs));
    for (const sample of samples) expect(sample.detectMs).toBe(0);
    const period = loopPeriod(SHORT);
    expect(period).toBeCloseTo(SHORT.frames.length * STEP, 9);
    frames.advance(period * 3);
    while (samples.length < SHORT.frames.length * 2 + 1) frames.frame();
    const times = samples.map((sample) => sample.tMs);
    for (let index = 1; index < times.length; index += 1)
      expect(times[index]!).toBeGreaterThan(times[index - 1]!);
    // The second lap is the first one, a period later, sample for sample.
    const lap = SHORT.frames.length;
    expect(times[lap]).toBeCloseTo(period, 9);
    expect(samples[lap]!.result).toEqual(samples[0]!.result);
    expect(samples[lap + 2]!.result).toEqual(samples[2]!.result);
    source.stop();
    expect(frames.pending).toBe(0);
  });

  it("GF-82 a once-through playback ends; stop inside a sample, a restart and a throw are honoured", () => {
    const frames = manualFrames();
    const once = createPlaybackSource(SHORT, { loop: false }, frames.ports);
    const all = collect();
    void once.start(all.onSample);
    frames.advance(10_000);
    for (let index = 0; index < SHORT.frames.length + 5; index += 1) frames.frame();
    expect(all.samples).toHaveLength(SHORT.frames.length);
    expect(frames.pending).toBe(0);

    const stopping = createPlaybackSource(SHORT, { loop: true }, frames.ports);
    const seen: number[] = [];
    void stopping.start((sample) => {
      seen.push(sample.tMs);
      if (seen.length === 2) stopping.stop();
    });
    frames.advance(10_000);
    for (let index = 0; index < 6; index += 1) frames.frame();
    expect(seen).toHaveLength(2);
    expect(frames.pending).toBe(0);
    // A restart is a new generation: it begins at the first frame, timed from the restart.
    void stopping.start((sample) => seen.push(sample.tMs));
    frames.frame();
    frames.frame();
    expect(seen.slice(2)).toEqual([0]);
    stopping.stop();

    const broken = createPlaybackSource(SHORT, { loop: true }, frames.ports);
    let calls = 0;
    void broken.start(() => {
      calls += 1;
      throw new Error("consumer broke");
    });
    expect(() => frames.frame()).toThrow("consumer broke");
    frames.advance(10_000);
    frames.frame();
    expect(calls).toBe(1);
    expect(frames.pending).toBe(0);
    expect(() =>
      createPlaybackSource({ ...SHORT, frames: [] }, { loop: true }, frames.ports),
    ).toThrow(/at least one frame/);
  });

  it("GF-83 a synthetic source plays the committed take and never loads MediaPipe or opens a camera", () => {
    const frames = manualFrames();
    for (const spec of SOURCE_SPECS) {
      // Creating any source, the camera's included, acquires nothing.
      if (spec.kind === "simulator") continue;
      const source = createLandmarkSource(spec, {
        video: NO_VIDEO,
        webcam: FORBIDDEN_WEBCAM,
        frames: frames.ports,
      });
      if (spec.kind !== "synthetic") continue;
      const { samples, onSample } = collect();
      void source.start(onSample);
      frames.advance(STEP * 10);
      for (let index = 0; index < 4; index += 1) frames.frame();
      source.stop();
      const take = createSyntheticRecording(SYNTHETIC_TAKES[spec.motion.kind]);
      expect(samples).toHaveLength(4);
      samples.forEach((sample, index) => {
        const recorded = take.frames[index]!;
        expect(sample.tMs).toBe(recorded.tMs);
        expect(sample.result).toEqual(writePoseResult(recorded.image, recorded.world));
      });
    }
  });

  it("GF-84 lists every source once, and each committed take loops without a seam in the pose", () => {
    const ids = SOURCE_SPECS.map(sourceId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["simulator", "synthetic-exercise", "synthetic-still", "camera"]);
    const kinds = new Set(SOURCE_SPECS.map((spec: SourceSpec) => spec.kind));
    expect(kinds).toEqual(new Set(["camera", "synthetic", "simulator"]));
    for (const spec of SOURCE_SPECS) expect(sourceLabel(spec).length).toBeGreaterThan(0);
    for (const take of Object.values(SYNTHETIC_TAKES)) {
      expect(loopPeriod(createSyntheticRecording(take))).toBeCloseTo(take.durationMs, 9);
      const start = syntheticWorldPose(take.motion, 0);
      const end = syntheticWorldPose(take.motion, take.durationMs);
      for (const joint of Object.keys(start) as (keyof typeof start)[])
        start[joint].forEach((value, axis) => expect(end[joint][axis]).toBeCloseTo(value, 9));
    }
  });
});
