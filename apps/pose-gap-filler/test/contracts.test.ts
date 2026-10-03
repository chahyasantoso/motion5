import { describe, expect, it } from "vitest";
import {
  hasPose,
  parsePoseResult,
  writePoseResult,
  type RawLandmark,
  type RawPose,
} from "../src/filler/adapter";
import { UNREPORTED } from "../src/filler/frame";
import { createGapDetector } from "../src/filler/gap-detector";
import { JOINTS, MEDIAPIPE_INDEX, MEDIAPIPE_LANDMARK_COUNT } from "../src/filler/landmarks";
import { IMAGE_SPACE, LANDMARK_SPACES, WORLD_SPACE } from "../src/filler/space";
import { createBoneLengthEstimator } from "../src/filler/bone-length";
import {
  DEFAULT_INGEST,
  EMPTY_TALLY,
  createIngestGate,
  tally,
  type Admission,
} from "../src/live/ingest";
import {
  MIRRORED,
  UNMIRRORED,
  defaultMirror,
  mirrorChecked,
  mirrorOf,
  previewPoint,
  previewTransform,
} from "../src/live/preview";
import { createRecorder } from "../src/live/recorder";
import { createSourceSession, type SessionSample } from "../src/live/session";
import type { LandmarkSource, SourceSample } from "../src/live/source";
import { SOURCE_SPECS } from "../src/live/sources";
import {
  RECORDING_FORMAT,
  RECORDING_VERSION,
  parseRecording,
  recordResult,
  replayFrame,
} from "../src/replay/recording";
import { DEFAULT_STAGE, projectToImage, syntheticWorldPose } from "../src/replay/synthetic";
import type { Vec } from "../src/filler/vec";

const STAGE = DEFAULT_STAGE;
const blankPose = (presence: number): RawLandmark[] =>
  Array.from({ length: MEDIAPIPE_LANDMARK_COUNT }, (_, index) => [
    0.3 + index / 100,
    0.5,
    0,
    0.9,
    presence,
  ]);

function stamped(tMs: number, session = 1, sequence = 0): SessionSample {
  return { result: null, tMs, detectMs: 0, session, sequence };
}

describe("#540 observation, time and coordinate contracts", () => {
  it("GF-86 carries presence as reported, clamped, or unreported, and trust never reads it", () => {
    const pose = (presence: unknown) =>
      Array.from({ length: MEDIAPIPE_LANDMARK_COUNT }, () => ({
        x: 0.5,
        y: 0.5,
        z: 0,
        visibility: 0.9,
        presence,
      }));
    const presenceOf = (value: unknown) =>
      parsePoseResult({ landmarks: [pose(value)] }, 0, IMAGE_SPACE, STAGE).joints["left-wrist"];
    expect(presenceOf(0.42)).toMatchObject({ presence: { kind: "reported", value: 0.42 } });
    expect(presenceOf(1.7)).toMatchObject({ presence: { kind: "reported", value: 1 } });
    expect(presenceOf(-3)).toMatchObject({ presence: { kind: "reported", value: 0 } });
    for (const missing of [undefined, Number.NaN, Infinity, "0.9", null])
      expect(presenceOf(missing)).toMatchObject({ presence: UNREPORTED });
    // Trust is decided on visibility; two frames that differ only in presence are trusted alike.
    const detect = (presence: unknown) =>
      createGapDetector().detect(
        parsePoseResult({ landmarks: [pose(presence)] }, 0, IMAGE_SPACE, STAGE),
        new Set(),
        createBoneLengthEstimator(),
      ).trust;
    expect(detect(0.01)).toEqual(detect(undefined));
    expect(detect(0.01)).toEqual(detect(0.99));
  });

  it("GF-87 writes recording v2 with presence, and still reads v1 with every presence unreported", () => {
    const recorder = createRecorder(STAGE);
    recorder.start();
    recorder.keep(writePoseResult(blankPose(0.7), blankPose(Number.NaN)), 10);
    const take = recorder.stop();
    expect(take.version).toBe(RECORDING_VERSION);
    expect(RECORDING_VERSION).toBe(2);
    const json = JSON.parse(JSON.stringify(take));
    expect(json.frames[0].image[0]).toHaveLength(5);
    expect(json.frames[0].world[0][4]).toBeNull();
    const read = parseRecording(json);
    for (const space of LANDMARK_SPACES)
      expect(replayFrame(read, read.frames[0]!, space)).toEqual(
        parsePoseResult(writePoseResult(blankPose(0.7), blankPose(Number.NaN)), 10, space, STAGE),
      );
    expect(replayFrame(read, read.frames[0]!, IMAGE_SPACE).joints["left-hip"]).toMatchObject({
      presence: { kind: "reported", value: 0.7 },
    });
    expect(replayFrame(read, read.frames[0]!, WORLD_SPACE).joints["left-hip"]).toMatchObject({
      presence: UNREPORTED,
    });
    expect(recordResult(writePoseResult(blankPose(0.2), null), 4).image![0]![4]).toBe(0.2);
    // A v1 file is decoded into the current shape: presence was never recorded.
    const v1Pose = blankPose(0).map((landmark) => landmark.slice(0, 4));
    const v1 = { format: RECORDING_FORMAT, version: 1, stage: STAGE, frames: [] as unknown[] };
    v1.frames.push({ tMs: 0, image: v1Pose, world: null });
    const upgraded = parseRecording(v1);
    expect(upgraded.version).toBe(RECORDING_VERSION);
    expect(upgraded.frames[0]!.image![3]![4]).toBeNaN();
    expect(
      replayFrame(upgraded, upgraded.frames[0]!, IMAGE_SPACE).joints["left-hip"],
    ).toMatchObject({ presence: UNREPORTED });
    // Each version holds its own landmark shape; neither is read as the other.
    expect(() =>
      parseRecording({ ...v1, frames: [{ tMs: 0, image: json.frames[0].image, world: null }] }),
    ).toThrow(/not four numbers/);
    expect(() =>
      parseRecording({ ...json, frames: [{ tMs: 0, image: v1Pose, world: null }] }),
    ).toThrow(/not five numbers/);
    expect(() => parseRecording({ ...json, version: 3 })).toThrow(/version is 3/);
  });

  it("GF-88 admits strictly increasing time per session and restarts on a new subject", () => {
    const gate = createIngestGate({ maxStallMs: 1000, maxLossMs: 2000 });
    const kinds = (admission: Admission) =>
      admission.kind === "continue" ? "continue" : `${admission.kind}:${admission.reason}`;
    const run = (tMs: number, posed = true, session = 1) =>
      kinds(gate.admit(stamped(tMs, session), posed));
    expect(run(100)).toBe("restart:new-session");
    // Irregular but increasing intervals are ordinary time.
    expect(run(133)).toBe("continue");
    expect(run(150.5)).toBe("continue");
    expect(run(250)).toBe("continue");
    // A duplicate, an earlier result and a non-finite time never reach a filter.
    expect(run(250)).toBe("reject:not-increasing");
    expect(run(200)).toBe("reject:not-increasing");
    expect(run(Number.NaN)).toBe("reject:non-finite-time");
    // A stall past maxStallMs is a new subject, whatever arrives.
    expect(run(1251, false)).toBe("restart:stall");
    // Poseless samples keep time; a pose after more than maxLossMs without one restarts.
    expect(run(2200, false)).toBe("continue");
    expect(run(3200, false)).toBe("continue");
    expect(run(3252, true)).toBe("restart:reacquired");
    expect(run(3300, true)).toBe("continue");
    // Exactly at the bounds is still continuous.
    expect(run(4300, true)).toBe("continue");
    // A newer session restarts at its own clock; an older one is stale.
    expect(run(5, true, 2)).toBe("restart:new-session");
    expect(run(6, true, 1)).toBe("reject:stale-session");
    expect(run(6, true, 2)).toBe("continue");
    expect(DEFAULT_INGEST).toEqual({ maxStallMs: 1000, maxLossMs: 2000 });
    for (const bad of [0, -1, Number.NaN, Infinity])
      expect(() => createIngestGate({ maxStallMs: bad, maxLossMs: 10 })).toThrow(/Ingest/);
    let counts = EMPTY_TALLY;
    for (const admission of [
      { kind: "restart", reason: "new-session" },
      { kind: "continue" },
      { kind: "reject", reason: "not-increasing" },
    ] as const)
      counts = tally(counts, admission);
    expect(counts).toEqual({ accepted: 2, restarts: 1, rejected: 1 });
    expect(hasPose(writePoseResult(null, blankPose(1)))).toBe(true);
    expect(hasPose(writePoseResult(null, null))).toBe(false);
    expect(hasPose(undefined)).toBe(false);
  });

  it("GF-89 stamps every forwarded sample with its session and its sequence in that session", () => {
    let deliver: ((sample: SourceSample) => void) | undefined;
    const source: LandmarkSource = {
      start(onSample) {
        deliver = onSample;
        return Promise.resolve();
      },
      stop() {},
    };
    const seen: Array<[number, number, number]> = [];
    const session = createSourceSession({
      create: () => source,
      begin() {},
      sample: (sample) => seen.push([sample.session, sample.sequence, sample.tMs]),
      end() {},
    });
    const [spec] = SOURCE_SPECS;
    session.start(spec!);
    deliver!({ result: null, tMs: 1, detectMs: 0 });
    deliver!({ result: null, tMs: 2, detectMs: 0 });
    session.start(spec!);
    deliver!({ result: null, tMs: 1, detectMs: 0 });
    expect(seen).toEqual([
      [1, 0, 1],
      [1, 1, 2],
      [2, 0, 1],
    ]);
  });

  it("GF-90 a mirrored preview flips only what is drawn, never which side a joint is", () => {
    const point: Vec = [100, 50];
    expect(previewPoint(UNMIRRORED, STAGE)(point)).toEqual(point);
    expect(previewPoint(MIRRORED, STAGE)(point)).toEqual([STAGE.width - 100, 50]);
    const twice = previewPoint(MIRRORED, STAGE);
    expect(twice(twice([12.5, 7, 3]))).toEqual([12.5, 7, 3]);
    expect(previewTransform(UNMIRRORED)).toBe("none");
    expect(previewTransform(MIRRORED)).toBe("scaleX(-1)");
    for (const mirror of [UNMIRRORED, MIRRORED])
      expect(mirrorOf(mirrorChecked(mirror))).toBe(mirror);
    expect(SOURCE_SPECS.map((spec) => defaultMirror(spec).kind)).toEqual([
      "none",
      "none",
      "none",
      "mirrored",
    ]);
    // The person's left wrist is on the image's right, unmirrored, and keeps its name mirrored.
    const truth = syntheticWorldPose({ kind: "still" }, 0);
    const image = blankPose(Number.NaN);
    for (const joint of JOINTS) {
      const [x, y, z] = projectToImage(truth[joint], STAGE);
      image[MEDIAPIPE_INDEX[joint]] = [x!, y!, z!, 0.95, Number.NaN];
    }
    const frame = parsePoseResult(writePoseResult(image, null), 0, IMAGE_SPACE, STAGE);
    const wrist = frame.joints["left-wrist"];
    if (wrist.kind !== "measured") throw new Error("left wrist not measured");
    expect(wrist.position[0]!).toBeGreaterThan(STAGE.width / 2);
    expect(previewPoint(MIRRORED, STAGE)(wrist.position)[0]!).toBeLessThan(STAGE.width / 2);
  });

  it("GF-91 reads MediaPipe's axes: person-left +x, y down, toward the camera negative z", () => {
    const truth = syntheticWorldPose({ kind: "still" }, 0);
    const facing = (turned: boolean): RawPose => {
      const pose = blankPose(Number.NaN);
      for (const joint of JOINTS) {
        const [x, y, z] = truth[joint];
        // Facing away is a half turn about the vertical axis: x and z change sign.
        const world: Vec = turned ? [-x!, y!, -z!] : [x!, y!, z!];
        const [u, v, w] = projectToImage(world, STAGE);
        pose[MEDIAPIPE_INDEX[joint]] = [u!, v!, w!, 0.95, Number.NaN];
      }
      return pose;
    };
    const front = parsePoseResult(writePoseResult(facing(false), null), 0, IMAGE_SPACE, STAGE);
    const back = parsePoseResult(writePoseResult(facing(true), null), 0, IMAGE_SPACE, STAGE);
    const x = (frame: typeof front, joint: (typeof JOINTS)[number]) => {
      const observation = frame.joints[joint];
      if (observation.kind !== "measured") throw new Error(`${joint} not measured`);
      return observation.position;
    };
    expect(truth["left-shoulder"][0]!).toBeGreaterThan(0);
    expect(truth["left-shoulder"][1]!).toBeLessThan(truth["left-hip"][1]!);
    expect(x(front, "left-shoulder")[0]!).toBeGreaterThan(x(front, "right-shoulder")[0]!);
    expect(x(front, "left-shoulder")[1]!).toBeLessThan(x(front, "left-hip")[1]!);
    // Turned away, the same anatomical joint is on the image's other side, and keeps its name.
    expect(x(back, "left-shoulder")[0]!).toBeLessThan(x(back, "right-shoulder")[0]!);
    // Nearer the camera is smaller z in world and image alike.
    const near: Vec = [0, 0, -0.3];
    const far: Vec = [0, 0, 0.3];
    expect(projectToImage(near, STAGE)[2]!).toBeLessThan(projectToImage(far, STAGE)[2]!);
  });
});
