import type { JointObservation, LandmarkFrame } from "./frame";
import { MEDIAPIPE_INDEX, jointRecord } from "./landmarks";
import { type LandmarkSpace } from "./space";
import type { Vec } from "./vec";

/** The stage an image-space frame is mapped onto, in the pixels the overlay and the rig use. */
export interface StageSize {
  readonly width: number;
  readonly height: number;
}

/** Millimetres per MediaPipe world unit (metres): the world rig solves in millimetres. */
export const WORLD_UNITS_PER_METRE = 1000;

/**
 * The one place a raw MediaPipe value enters. `result` is read as `unknown` because MediaPipe is
 * loaded at runtime behind the `LandmarkSource` port and has no declaration in this repository, so
 * this parser is the only owner of its shape: `landmarks[0][i]` (normalised image coordinates) for
 * image space and `worldLandmarks[0][i]` (metres, hip-centred) for world space, each with
 * `x`, `y`, `z` and `visibility`.
 *
 * A joint whose coordinates are missing or non-finite is `absent`, never a NaN. Visibility is
 * clamped into [0, 1], and a missing or non-finite visibility reads as 0, so the landmark is kept
 * but can never be trusted. A result with no first pose is a frame of absent joints.
 */
export function parsePoseResult(
  result: unknown,
  tMs: number,
  space: LandmarkSpace,
  stage: StageSize,
): LandmarkFrame {
  const pose = firstPose(result, poseKey(space));
  return {
    tMs,
    space,
    joints: jointRecord((joint) => readLandmark(pose?.[MEDIAPIPE_INDEX[joint]], space, stage)),
  };
}

function poseKey(space: LandmarkSpace): "landmarks" | "worldLandmarks" {
  switch (space.kind) {
    case "image":
      return "landmarks";
    case "world":
      return "worldLandmarks";
    default: {
      const unhandled: never = space;
      throw new Error(`Unhandled landmark space: ${JSON.stringify(unhandled)}`);
    }
  }
}

function firstPose(result: unknown, key: string): readonly unknown[] | undefined {
  if (typeof result !== "object" || result === null) return undefined;
  const poses: unknown = (result as Record<string, unknown>)[key];
  if (!Array.isArray(poses)) return undefined;
  const pose: unknown = poses[0];
  return Array.isArray(pose) ? pose : undefined;
}

function field(landmark: object, key: string): unknown {
  return (landmark as Record<string, unknown>)[key];
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readLandmark(landmark: unknown, space: LandmarkSpace, stage: StageSize): JointObservation {
  if (typeof landmark !== "object" || landmark === null) return { kind: "absent" };
  const x = finiteNumber(field(landmark, "x"));
  const y = finiteNumber(field(landmark, "y"));
  const z = finiteNumber(field(landmark, "z"));
  const position = toSpace(space, stage, x, y, z);
  if (position === undefined) return { kind: "absent" };
  const visibility = Math.min(1, Math.max(0, finiteNumber(field(landmark, "visibility")) ?? 0));
  return { kind: "measured", position, visibility };
}

function toSpace(
  space: LandmarkSpace,
  stage: StageSize,
  x: number | undefined,
  y: number | undefined,
  z: number | undefined,
): Vec | undefined {
  switch (space.kind) {
    case "image":
      return x === undefined || y === undefined ? undefined : [x * stage.width, y * stage.height];
    case "world":
      return x === undefined || y === undefined || z === undefined
        ? undefined
        : [x * WORLD_UNITS_PER_METRE, y * WORLD_UNITS_PER_METRE, z * WORLD_UNITS_PER_METRE];
    default: {
      const unhandled: never = space;
      throw new Error(`Unhandled landmark space: ${JSON.stringify(unhandled)}`);
    }
  }
}
