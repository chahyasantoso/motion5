import { describe, expect, it } from "vitest";
import { UNREPORTED } from "../src/filler/frame";
import { WORLD_UNITS_PER_METRE, parsePoseResult } from "../src/filler/adapter";
import { JOINTS, MEDIAPIPE_INDEX, MEDIAPIPE_LANDMARK_COUNT } from "../src/filler/landmarks";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";

const STAGE = { width: 640, height: 480 };

function pose(landmark: (index: number) => unknown): unknown[] {
  return Array.from({ length: MEDIAPIPE_LANDMARK_COUNT }, (_, index) => landmark(index));
}

describe("MediaPipe adapter", () => {
  it("GF-1 maps normalised image landmarks to stage pixels and clamps visibility into [0, 1]", () => {
    const result = {
      landmarks: [
        pose((index) => ({ x: 0.5, y: 0.25, z: -0.1, visibility: index === 15 ? 1.4 : -0.2 })),
      ],
    };
    const frame = parsePoseResult(result, 12.5, IMAGE_SPACE, STAGE);
    expect(frame.tMs).toBe(12.5);
    expect(frame.space).toEqual(IMAGE_SPACE);
    expect(frame.joints["left-wrist"]).toEqual({
      kind: "measured",
      position: [320, 120],
      visibility: 1,
      presence: UNREPORTED,
    });
    expect(frame.joints["left-shoulder"]).toEqual({
      kind: "measured",
      position: [320, 120],
      visibility: 0,
      presence: UNREPORTED,
    });
    // Every joint is read from its own MediaPipe index, and no index is read twice.
    expect(new Set(JOINTS.map((joint) => MEDIAPIPE_INDEX[joint])).size).toBe(JOINTS.length);
  });

  it("GF-2 refuses a non-finite or missing landmark as absent, and a missing pose as all absent", () => {
    const result = {
      landmarks: [
        pose((index) => {
          if (index === MEDIAPIPE_INDEX["left-elbow"]) return { x: Number.NaN, y: 0.5 };
          if (index === MEDIAPIPE_INDEX["right-elbow"]) return { x: 0.2, y: Infinity };
          if (index === MEDIAPIPE_INDEX["left-knee"]) return null;
          if (index === MEDIAPIPE_INDEX["right-knee"]) return { x: "0.5", y: 0.5 };
          if (index === MEDIAPIPE_INDEX["left-hip"]) return { x: 0.1, y: 0.1 };
          return { x: 0.5, y: 0.5, visibility: Number.NaN };
        }),
      ],
    };
    const frame = parsePoseResult(result, 0, IMAGE_SPACE, STAGE);
    for (const joint of ["left-elbow", "right-elbow", "left-knee", "right-knee"] as const)
      expect(frame.joints[joint]).toEqual({ kind: "absent" });
    // A landmark without a visibility is kept but can never be trusted.
    expect(frame.joints["left-hip"]).toEqual({
      kind: "measured",
      position: [64, 48],
      visibility: 0,
      presence: UNREPORTED,
    });
    expect(frame.joints["left-wrist"]).toMatchObject({ kind: "measured", visibility: 0 });
    for (const empty of [undefined, null, 7, {}, { landmarks: [] }, { landmarks: [{}] }]) {
      const blank = parsePoseResult(empty, 0, IMAGE_SPACE, STAGE);
      for (const joint of JOINTS) expect(blank.joints[joint]).toEqual({ kind: "absent" });
    }
    // A short pose array is read as far as it goes: the missing tail is absent, not a throw.
    const short = parsePoseResult(
      { landmarks: [[{ x: 0, y: 0, visibility: 1 }]] },
      0,
      IMAGE_SPACE,
      STAGE,
    );
    expect(short.joints["right-ankle"]).toEqual({ kind: "absent" });
    // Finite in, overflowing once scaled to pixels: still refused, never an Infinity downstream.
    const huge = parsePoseResult(
      { landmarks: [pose(() => ({ x: Number.MAX_VALUE, y: 0, visibility: 1 }))] },
      0,
      IMAGE_SPACE,
      STAGE,
    );
    expect(huge.joints["left-wrist"]).toEqual({ kind: "absent" });
  });

  it("GF-3 reads world landmarks in millimetres, requires z there, and ignores the other space", () => {
    const result = {
      landmarks: [pose(() => ({ x: 0.9, y: 0.9, z: 0, visibility: 1 }))],
      worldLandmarks: [
        pose((index) =>
          index === MEDIAPIPE_INDEX["left-ankle"]
            ? { x: 0.1, y: 0.2, visibility: 1 }
            : { x: 0.1, y: -0.2, z: 0.05, visibility: 0.8 },
        ),
      ],
    };
    const frame = parsePoseResult(result, 3, WORLD_SPACE, STAGE);
    expect(frame.joints["left-wrist"]).toEqual({
      kind: "measured",
      position: [
        0.1 * WORLD_UNITS_PER_METRE,
        -0.2 * WORLD_UNITS_PER_METRE,
        0.05 * WORLD_UNITS_PER_METRE,
      ],
      visibility: 0.8,
      presence: UNREPORTED,
    });
    expect(frame.joints["left-ankle"]).toEqual({ kind: "absent" });
    const image = parsePoseResult({ worldLandmarks: result.worldLandmarks }, 3, IMAGE_SPACE, STAGE);
    expect(image.joints["left-wrist"]).toEqual({ kind: "absent" });
  });
});
