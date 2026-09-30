import { describe, expect, it } from "vitest";
import { MEDIAPIPE_INDEX, MEDIAPIPE_LANDMARK_COUNT, JOINTS } from "../src/filler/landmarks";
import { parsePoseResult } from "../src/filler/adapter";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";
import { createRecorder } from "../src/live/recorder";
import {
  RECORDING_FORMAT,
  parseRecording,
  recordResult,
  replayFrame,
} from "../src/replay/recording";
import {
  SYNTHETIC_BONES,
  createSyntheticRecording,
  syntheticWorldPose,
} from "../src/replay/synthetic";
import { distance } from "../src/filler/vec";

const STAGE = { width: 640, height: 480 };

function liveResult(tMs: number): unknown {
  const pose = (scale: number) =>
    Array.from({ length: MEDIAPIPE_LANDMARK_COUNT }, (_, index) =>
      index === MEDIAPIPE_INDEX["left-elbow"]
        ? { x: Number.NaN, y: 0.5, z: 0, visibility: 0.9 }
        : { x: (index / 40) * scale, y: 0.5 * scale, z: 0.01 * index, visibility: 0.8 + tMs / 1e4 },
    );
  return { landmarks: [pose(1)], worldLandmarks: [pose(0.5)] };
}

describe("pose recording", () => {
  it("GF-14 replays a recorded result through the adapter exactly as the live result, after JSON", () => {
    const recorder = createRecorder(STAGE);
    recorder.keep(liveResult(0), 0);
    expect(recorder.recording).toBe(false);
    recorder.start();
    for (const tMs of [10, 43, 76]) recorder.keep(liveResult(tMs), tMs);
    recorder.keep({ landmarks: [] }, 109);
    const take = recorder.stop();
    expect(recorder.recording).toBe(false);
    const recording = parseRecording(JSON.parse(JSON.stringify(take)));
    expect(recording.frames.map((frame) => frame.tMs)).toEqual([10, 43, 76, 109]);
    for (const [index, tMs] of [10, 43, 76].entries())
      for (const space of [IMAGE_SPACE, WORLD_SPACE])
        expect(replayFrame(recording, recording.frames[index]!, space)).toEqual(
          parsePoseResult(liveResult(tMs), tMs, space, STAGE),
        );
    // JSON wrote the NaN as null and it came back as an absent joint, as live.
    expect(replayFrame(recording, recording.frames[0]!, IMAGE_SPACE).joints["left-elbow"]).toEqual({
      kind: "absent",
    });
    // An undetected pose is null, and replays as a frame of absent joints.
    expect(recording.frames[3]!.image).toBeNull();
    const blank = replayFrame(recording, recording.frames[3]!, IMAGE_SPACE);
    for (const joint of JOINTS) expect(blank.joints[joint]).toEqual({ kind: "absent" });
    expect(recordResult(null, 5)).toEqual({ tMs: 5, image: null, world: null });
  });

  it("GF-15 refuses every other shape: keys, format, version, stage, landmarks, clock", () => {
    const pose = (last: readonly (number | null)[]) => [
      ...Array.from({ length: MEDIAPIPE_LANDMARK_COUNT - 1 }, () => [0.1, 0.2, 0, 1]),
      last,
    ];
    const valid = {
      format: RECORDING_FORMAT,
      version: 1,
      stage: STAGE,
      frames: [
        { tMs: 0, image: pose([0.1, 0.2, 0, 1]), world: null },
        { tMs: 33, image: null, world: pose([0.1, null, 0, 1]) },
      ],
    };
    expect(parseRecording(valid).frames[1]!.world!.at(-1)![1]).toBeNaN();
    const refused: Array<[unknown, RegExp]> = [
      [null, /not an object/],
      [{ ...valid, extra: 1 }, /unexpected|keys/],
      [{ ...valid, format: "other" }, /format is other/],
      [{ ...valid, version: 2 }, /version is 2/],
      [{ ...valid, stage: { width: Infinity, height: 480 } }, /stage/],
      [{ ...valid, stage: { width: 640, height: 480, depth: 1 } }, /stage has keys/],
      [{ ...valid, frames: {} }, /frames is not an array/],
      [{ ...valid, frames: [{ tMs: 0, image: null }] }, /frame 0 has keys/],
      [{ ...valid, frames: [{ tMs: 0, image: pose([1, 2, 3]), world: null }] }, /not four numbers/],
      [{ ...valid, frames: [{ tMs: 0, image: [], world: null }] }, /has 0 landmarks, not 33/],
      [
        { ...valid, frames: [{ tMs: 0, image: null, world: [[0, 0, 0, 1]] }] },
        /world has 1 landmarks/,
      ],
      [{ ...valid, frames: [{ tMs: 0, image: 7, world: null }] }, /neither an array nor null/],
      [{ ...valid, frames: [valid.frames[1], valid.frames[0]] }, /frame 1 tMs/],
      [{ ...valid, frames: [valid.frames[0], valid.frames[0]] }, /frame 1 tMs/],
      [{ ...valid, frames: [{ ...valid.frames[0], tMs: Number.NaN }] }, /frame 0 tMs/],
    ];
    for (const [value, message] of refused) expect(() => parseRecording(value)).toThrow(message);
  });

  it("GF-16 builds a deterministic synthetic subject whose world bones are exact", () => {
    const options = { motion: { kind: "exercise" }, seed: 3, durationMs: 1000, fps: 30 } as const;
    const first = createSyntheticRecording(options);
    expect(first.frames).toHaveLength(30);
    expect(first.frames[29]!.tMs).toBeCloseTo(29000 / 30, 9);
    expect(createSyntheticRecording(options)).toEqual(first);
    expect(createSyntheticRecording({ ...options, seed: 4 })).not.toEqual(first);
    expect(parseRecording(JSON.parse(JSON.stringify(first)))).toEqual(first);
    const b = SYNTHETIC_BONES;
    for (const motion of [{ kind: "still" }, { kind: "exercise" }] as const)
      for (const tMs of [0, 333, 1200, 2399, 7777]) {
        const pose = syntheticWorldPose(motion, tMs);
        for (const [from, to, length] of [
          ["left-shoulder", "left-elbow", b.upperArm],
          ["right-elbow", "right-wrist", b.forearm],
          ["left-hip", "left-knee", b.thigh],
          ["right-knee", "right-ankle", b.shin],
          ["right-shoulder", "left-shoulder", b.shoulderWidth],
          ["right-hip", "left-hip", b.hipWidth],
        ] as const)
          expect(distance(pose[from], pose[to])).toBeCloseTo(length, 12);
      }
    // The exercise moves and the still subject barely does.
    const travel = (kind: "still" | "exercise") =>
      distance(
        syntheticWorldPose({ kind }, 0)["left-wrist"],
        syntheticWorldPose({ kind }, 1200)["left-wrist"],
      );
    expect(travel("exercise")).toBeGreaterThan(0.5);
    expect(travel("still")).toBeLessThan(0.02);
    for (const bad of [
      { seed: 1.5 },
      { durationMs: -1 },
      { fps: 0 },
      { stage: { width: 0, height: 1 } },
    ])
      expect(() => createSyntheticRecording({ ...options, ...bad })).toThrow(/Synthetic/);
  });
});
