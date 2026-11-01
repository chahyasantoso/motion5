import { UNREPORTED, type JointObservation, type LandmarkFrame, type Presence } from "./frame";
import { MEDIAPIPE_INDEX, jointRecord } from "./landmarks";
import { LANDMARK_SPACES, type LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import { isFiniteVec, type Vec } from "./vec";

/** Pixel size the overlay and the rig use; image-space frames map here. */
export interface StageSize {
  readonly width: number;
  readonly height: number;
}

/** Millimetres per MediaPipe world unit (metres); the rig solves in millimetres. */
export const WORLD_UNITS_PER_METRE = 1000;

/**
 * One landmark as MediaPipe reports it, `[x, y, z, visibility, presence]`: normalised for `image`,
 * metres for `world`. Non-numeric component reads `NaN`; `NaN` presence reads `unreported`. */
export type RawLandmark = readonly [
  x: number,
  y: number,
  z: number,
  visibility: number,
  presence: number,
];

/** First pose of one space, index-aligned with MediaPipe's 33 landmarks. */
export type RawPose = readonly RawLandmark[];

/**
 * Sole reader of MediaPipe's result shape: `landmarks[0][i]` / `worldLandmarks[0][i]`, each `x`,
 * `y`, `z`, `visibility`, `presence`. `result` is `unknown`: runtime-loaded, undeclared. */
export function readRawPose(result: unknown, space: LandmarkSpace): RawPose | undefined {
  if (typeof result !== "object" || result === null) return undefined;
  const poses: unknown = (result as Record<string, unknown>)[poseKey(space)];
  if (!Array.isArray(poses)) return undefined;
  const pose: unknown = poses[0];
  return Array.isArray(pose) ? pose.map(readRawLandmark) : undefined;
}

/** Whether a result carries a pose in any space. */
export function hasPose(result: unknown): boolean {
  return LANDMARK_SPACES.some((space) => readRawPose(result, space) !== undefined);
}

/**
 * Sole owner of coordinates: raw pose → `LandmarkFrame`. Missing or non-finite joint is `absent`,
 * never `NaN`. Visibility clamps to [0, 1], non-finite → 0; presence clamps or `unreported`. */
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

/** Live MediaPipe result straight to a frame: `readRawPose` then `adaptPose`. */
export function parsePoseResult(
  result: unknown,
  tMs: number,
  space: LandmarkSpace,
  stage: StageSize,
): LandmarkFrame {
  return adaptPose(readRawPose(result, space), tMs, space, stage);
}

/** One landmark in MediaPipe's result shape, the object `readRawPose` reads. */
export interface ResultLandmark {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly visibility: number;
  readonly presence: number;
}

/** A pose landmarker result as `readRawPose` reads it: at most one pose per space. */
export interface PoseResult {
  readonly landmarks: readonly (readonly ResultLandmark[])[];
  readonly worldLandmarks: readonly (readonly ResultLandmark[])[];
}

/**
 * Inverse of `readRawPose` for non-MediaPipe producers: same shape, so all enter via
 * `parsePoseResult`. Missing pose → empty list (MediaPipe's no-detection); `NaN` round-trips. */
export function writePoseResult(image: RawPose | null, world: RawPose | null): PoseResult {
  const write = (pose: RawPose | null) =>
    pose === null
      ? []
      : [pose.map(([x, y, z, visibility, presence]) => ({ x, y, z, visibility, presence }))];
  return { landmarks: write(image), worldLandmarks: write(world) };
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
  return [read("x"), read("y"), read("z"), read("visibility"), read("presence")];
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
  const [x, y, z, visibility, presence] = landmark.map(finite);
  const position = toSpace(space, stage, x, y, z);
  // Finite input still overflows once scaled to pixels or millimetres.
  if (position === undefined || !isFiniteVec(position)) return { kind: "absent" };
  return {
    kind: "measured",
    position,
    visibility: clampUnit(visibility ?? 0),
    presence: readPresence(presence),
  };
}

const clampUnit = (value: number) => Math.min(1, Math.max(0, value));

function readPresence(value: number | undefined): Presence {
  return value === undefined ? UNREPORTED : { kind: "reported", value: clampUnit(value) };
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
