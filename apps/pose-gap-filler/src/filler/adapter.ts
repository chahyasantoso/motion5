import type { JointObservation, LandmarkFrame } from "./frame";
import { MEDIAPIPE_INDEX, jointRecord } from "./landmarks";
import { type LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import { isFiniteVec, type Vec } from "./vec";

/** The stage an image-space frame is mapped onto, in the pixels the overlay and the rig use. */
export interface StageSize {
  readonly width: number;
  readonly height: number;
}

/** Millimetres per MediaPipe world unit (metres): the world rig solves in millimetres. */
export const WORLD_UNITS_PER_METRE = 1000;

/**
 * One landmark as MediaPipe reported it, `[x, y, z, visibility]`: normalised image coordinates for
 * `image`, metres for `world`. A component MediaPipe did not report as a number is `NaN`, so the
 * one adapter that reads coordinates refuses it, live or replayed.
 */
export type RawLandmark = readonly [x: number, y: number, z: number, visibility: number];

/** The first pose of one space, index-aligned with MediaPipe's 33 landmarks. */
export type RawPose = readonly RawLandmark[];

/**
 * The one reader of MediaPipe's result shape. `result` is `unknown` because MediaPipe is loaded at
 * runtime behind the `LandmarkSource` port and has no declaration in this repository:
 * `landmarks[0][i]` for image space and `worldLandmarks[0][i]` for world space, each with `x`, `y`,
 * `z` and `visibility`. A result with no first pose reads as `undefined`.
 */
export function readRawPose(result: unknown, space: LandmarkSpace): RawPose | undefined {
  if (typeof result !== "object" || result === null) return undefined;
  const poses: unknown = (result as Record<string, unknown>)[poseKey(space)];
  if (!Array.isArray(poses)) return undefined;
  const pose: unknown = poses[0];
  return Array.isArray(pose) ? pose.map(readRawLandmark) : undefined;
}

/**
 * The one owner of coordinates: a raw pose becomes a `LandmarkFrame`. A joint whose coordinates are
 * missing or non-finite is `absent`, never a NaN. Visibility is clamped into [0, 1], and a
 * non-finite visibility reads as 0, so the landmark is kept but can never be trusted. No pose is a
 * frame of absent joints. Live and replay both enter here, so they adapt identically.
 */
export function adaptPose(
  pose: RawPose | undefined,
  tMs: number,
  space: LandmarkSpace,
  stage: StageSize,
): LandmarkFrame {
  return {
    tMs,
    space,
    joints: jointRecord((joint) => adaptLandmark(pose?.[MEDIAPIPE_INDEX[joint]], space, stage)),
  };
}

/** A live MediaPipe result straight to a frame: `readRawPose` then `adaptPose`. */
export function parsePoseResult(
  result: unknown,
  tMs: number,
  space: LandmarkSpace,
  stage: StageSize,
): LandmarkFrame {
  return adaptPose(readRawPose(result, space), tMs, space, stage);
}

function poseKey(space: LandmarkSpace): "landmarks" | "worldLandmarks" {
  switch (space.kind) {
    case "image":
      return "landmarks";
    case "world":
      return "worldLandmarks";
    default:
      return unreachable(space, "landmark space");
  }
}

function readRawLandmark(landmark: unknown): RawLandmark {
  const read = (key: string): number => {
    if (typeof landmark !== "object" || landmark === null) return Number.NaN;
    const value: unknown = (landmark as Record<string, unknown>)[key];
    return typeof value === "number" ? value : Number.NaN;
  };
  return [read("x"), read("y"), read("z"), read("visibility")];
}

function finite(value: number | undefined): number | undefined {
  return value !== undefined && Number.isFinite(value) ? value : undefined;
}

function adaptLandmark(
  landmark: RawLandmark | undefined,
  space: LandmarkSpace,
  stage: StageSize,
): JointObservation {
  if (landmark === undefined) return { kind: "absent" };
  const [x, y, z, visibility] = landmark.map(finite);
  const position = toSpace(space, stage, x, y, z);
  // Finite inputs can still overflow once scaled to pixels or millimetres.
  if (position === undefined || !isFiniteVec(position)) return { kind: "absent" };
  return { kind: "measured", position, visibility: Math.min(1, Math.max(0, visibility ?? 0)) };
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
    default:
      return unreachable(space, "landmark space");
  }
}
