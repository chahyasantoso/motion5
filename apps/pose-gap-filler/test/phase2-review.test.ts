import { describe, expect, it } from "vitest";
import { JOINTS, MEDIAPIPE_INDEX, jointRecord, type JointId } from "../src/filler/landmarks";
import { IMAGE_SPACE } from "../src/filler/space";
import { createForcedJoints } from "../src/live/hotkeys";
import { createRecorder } from "../src/live/recorder";
import { createMediaPipeWebcamSource } from "../src/live/source";
import { calibrateDetector } from "../src/replay/compare";
import { validateMask, type Mask } from "../src/replay/mask";
import { measureReplay } from "../src/replay/metrics";
import { parseRecording, recordResult } from "../src/replay/recording";
import { runReplay, type ReplayFrame } from "../src/replay/replay";
import { createSyntheticRecording } from "../src/replay/synthetic";

const still = createSyntheticRecording({
  motion: { kind: "still" },
  seed: 9,
  durationMs: 1000,
  fps: 30,
});

describe("independent phase 2 regression cases", () => {
  it("GF-32 releases the camera and model after a running detection or consumer fails", async () => {
    for (const stage of ["detect", "consumer", "schedule"]) {
      let callback!: FrameRequestCallback;
      let closed = 0;
      let stopped = 0;
      let requested = 0;
      const stream = {
        getTracks: () => [
          {
            stop: () => {
              stopped += 1;
            },
          },
        ],
      } as unknown as MediaStream;
      const video = { srcObject: null, play: async () => {} } as unknown as HTMLVideoElement;
      const source = createMediaPipeWebcamSource(video, {
        loadLandmarker: async () => ({
          close: () => {
            closed += 1;
          },
          detectForVideo: () => {
            if (stage === "detect") throw new Error(stage);
            return {};
          },
        }),
        getUserMedia: async () => stream,
        requestFrame: (tick) => {
          requested += 1;
          if (stage === "schedule" && requested > 1) throw new Error(stage);
          callback = tick;
          return requested;
        },
        cancelFrame: () => {},
      });
      await source.start(() => {
        if (stage === "consumer") throw new Error(stage);
      });
      expect(() => callback(0)).toThrow(stage);
      expect(closed).toBe(1);
      expect(stopped).toBe(1);
      expect(video.srcObject).toBeNull();
      source.stop();
      expect(closed).toBe(1);
    }
  });
  it("GF-24 never lets an invisible calibration joint weaken the visibility floor", () => {
    const recording = {
      ...still,
      frames: still.frames.map((frame) => ({
        ...frame,
        image: frame.image!.map((point, index) =>
          index === MEDIAPIPE_INDEX["left-wrist"] ? ([0, 0, 0, 0, Number.NaN] as const) : point,
        ),
      })),
    };
    const calibration = calibrateDetector(recording);
    expect(calibration.detector.threshold).toBeGreaterThanOrEqual(0.5);
    const frames = runReplay({
      recording,
      space: IMAGE_SPACE,
      filler: { kind: "hold" },
      detector: calibration.detector,
    });
    for (const frame of frames)
      expect(frame.trust["left-wrist"]).toEqual({ kind: "gap", reason: "low-visibility" });
  });

  it("GF-25 measures alignment delay from the actual timestamp pairs", () => {
    const frames = [0, 10, 110, 120].map(
      (tMs, index): ReplayFrame => ({
        tMs,
        masked: new Set(),
        reference: jointRecord((joint) => (joint === "left-wrist" ? [index, 0] : undefined)),
        presented: jointRecord((joint) =>
          joint === "left-wrist" && index === 3 ? [2, 0] : undefined,
        ),
        trust: jointRecord(() => ({ kind: "gap", reason: "absent" })),
      }),
    );
    expect(measureReplay(frames).lagMs).toBe(10);
  });

  it("GF-26 restricts rig jitter to actually solved joints, including all three sample frames", () => {
    const frames = [0, 1, 4].map(
      (x, index): ReplayFrame => ({
        tMs: index * 100,
        masked: new Set(),
        reference: jointRecord(() => undefined),
        presented: jointRecord((joint) => (joint === "left-shoulder" ? [x, 0] : [0, 0])),
        trust: jointRecord(() => ({ kind: "gap", reason: "absent" })),
        solved: new Set<JointId>(["left-elbow", "left-wrist"]),
      }),
    );
    expect(measureReplay(frames).jitter).toMatchObject({ count: 2, max: 0 });
    expect(
      measureReplay(
        frames.map((frame, index) => ({
          ...frame,
          solved: new Set<JointId>(index === 1 ? [] : ["left-elbow", "left-wrist"]),
        })),
      ).jitter.count,
    ).toBe(0);
  });

  it("GF-27 refuses unknown mask joints instead of silently masking nothing", () => {
    expect(() =>
      validateMask({
        kind: "span",
        joints: ["bogus"],
        from: 0,
        to: 1,
      } as unknown as Mask),
    ).toThrow(/joint/);
    for (const joint of JOINTS)
      expect(validateMask({ kind: "span", joints: [joint], from: 0, to: 1 }).joints).toEqual([
        joint,
      ]);
  });

  it("GF-28 produces reloadable recordings even for malformed live results and rejects bad time", () => {
    const result = { landmarks: [[{ x: 0, y: 0, z: 0, visibility: 1 }]] };
    const frame = recordResult(result, 0);
    expect(frame.image).toBeNull();
    expect(parseRecording({ ...still, frames: [frame] }).frames).toEqual([frame]);
    const recorder = createRecorder(still.stage);
    recorder.start();
    recorder.keep(result, 10);
    expect(() => recorder.keep(result, 10)).toThrow(/increasing/);
    expect(() => recorder.keep(result, Infinity)).toThrow(/finite/);
    expect(parseRecording(JSON.parse(JSON.stringify(recorder.stop()))).frames).toHaveLength(1);
  });

  it("GF-29 ignores auto-repeat without changing toggle semantics", () => {
    const keys = createForcedJoints();
    expect(keys.toggle("w", false)).toBe(true);
    expect(keys.toggle("w", true)).toBe(true);
    expect([...keys.joints]).toEqual(["left-wrist"]);
    keys.toggle("w", false);
    expect(keys.joints.size).toBe(0);
  });

  it("GF-30 resolves a cancelled startup rejection, but preserves a live startup error", async () => {
    let reject!: (error: Error) => void;
    const loaded = new Promise<unknown>((_resolve, fail) => {
      reject = fail;
    });
    void loaded.catch(() => {});
    const video = { srcObject: null } as unknown as HTMLVideoElement;
    const ports = {
      loadLandmarker: () => loaded,
      getUserMedia: async () => {
        throw new Error("not reached");
      },
      requestFrame: () => 0,
      cancelFrame: () => {},
    };
    const source = createMediaPipeWebcamSource(video, ports);
    const starting = source.start(() => {});
    source.stop();
    reject(new Error("cancelled load"));
    await starting;
    let caught: unknown;
    try {
      await source.start(() => {});
    } catch (error) {
      caught = error;
    }
    expect(String(caught)).toContain("cancelled load");
  });
});
