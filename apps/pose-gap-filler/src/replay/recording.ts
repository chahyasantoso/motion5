import {
  adaptPose,
  readRawPose,
  type RawLandmark,
  type RawPose,
  type StageSize,
} from "../filler/adapter";
import type { LandmarkFrame } from "../filler/frame";
import { MEDIAPIPE_LANDMARK_COUNT } from "../filler/landmarks";
import { IMAGE_SPACE, WORLD_SPACE, type LandmarkSpace } from "../filler/space";
import { unreachable } from "../filler/unreachable";

/** Raw landmarks only, no video, never committed; spaces keyed by `LandmarkSpace` kind, `null` when undetected.
 * Disk landmark: `[x, y, z, visibility, presence]`; JSON `null` → `NaN`. */
export interface RecordedFrame {
  readonly tMs: number;
  readonly image: RawPose | null;
  readonly world: RawPose | null;
}

export const RECORDING_FORMAT = "motion5-pose-recording";

/** Version every recording is written in and parsed into; v1's missing presence decodes as `NaN`. */
export const RECORDING_VERSION = 2;

/** Versions `parseRecording` accepts, read by one exhaustive switch. */
export type RecordingVersion = 1 | typeof RECORDING_VERSION;

export interface PoseRecording {
  readonly format: typeof RECORDING_FORMAT;
  readonly version: typeof RECORDING_VERSION;
  /** The stage the image landmarks map onto when replayed. */
  readonly stage: StageSize;
  readonly frames: readonly RecordedFrame[];
}

function fail(message: string): never {
  throw new Error(`Not a ${RECORDING_FORMAT} recording: ${message}.`);
}

function landmarkShape(version: RecordingVersion): {
  readonly length: number;
  readonly name: string;
} {
  switch (version) {
    case 1:
      return { length: 4, name: "four" };
    case 2:
      return { length: 5, name: "five" };
    default:
      return unreachable(version, "recording version");
  }
}

function readVersion(value: unknown): RecordingVersion {
  if (value === 1 || value === RECORDING_VERSION) return value;
  return fail(`version is ${String(value)}`);
}

function exactKeys(value: object, expected: string, where: string): Record<string, unknown> {
  const keys = Object.keys(value).sort().join(",");
  if (keys !== expected) fail(`${where} has keys ${keys}, expected ${expected}`);
  return value as Record<string, unknown>;
}

function readPose(value: unknown, where: string, version: RecordingVersion): RawPose | null {
  if (value === null) return null;
  if (!Array.isArray(value)) fail(`${where} is neither an array nor null`);
  if (value.length !== MEDIAPIPE_LANDMARK_COUNT)
    fail(`${where} has ${value.length} landmarks, not ${MEDIAPIPE_LANDMARK_COUNT}`);
  const shape = landmarkShape(version);
  return value.map((landmark: unknown, index): RawLandmark => {
    if (
      !Array.isArray(landmark) ||
      landmark.length !== shape.length ||
      !landmark.every((component) => typeof component === "number" || component === null)
    )
      fail(`${where}[${index}] is not ${shape.name} numbers`);
    const [x, y, z, visibility, presence] = (landmark as readonly (number | null)[]).map(
      (component) => component ?? Number.NaN,
    );
    return [x!, y!, z!, visibility!, presence ?? Number.NaN];
  });
}

function readStage(value: unknown): StageSize {
  if (typeof value !== "object" || value === null) fail("stage is not an object");
  const stage = exactKeys(value, "height,width", "stage");
  const { width, height } = stage;
  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    fail("stage is not a finite positive width and height");
  return { width, height };
}

/** Reads any supported version into the current one; shape must match exactly.
 * `tMs` finite and strictly increasing; coordinate ranges are the adapter's to judge. */
export function parseRecording(value: unknown): PoseRecording {
  if (typeof value !== "object" || value === null) fail("not an object");
  const record = exactKeys(value, "format,frames,stage,version", "recording");
  if (record.format !== RECORDING_FORMAT) fail(`format is ${String(record.format)}`);
  const version = readVersion(record.version);
  const stage = readStage(record.stage);
  if (!Array.isArray(record.frames)) fail("frames is not an array");
  let previous = -Infinity;
  const frames = record.frames.map((frame: unknown, index): RecordedFrame => {
    if (typeof frame !== "object" || frame === null) fail(`frame ${index} is not an object`);
    const entry = exactKeys(frame, "image,tMs,world", `frame ${index}`);
    const { tMs } = entry;
    if (typeof tMs !== "number" || !Number.isFinite(tMs) || tMs <= previous)
      fail(`frame ${index} tMs is not finite and increasing`);
    previous = tMs;
    return {
      tMs,
      image: readPose(entry.image, `frame ${index} image`, version),
      world: readPose(entry.world, `frame ${index} world`, version),
    };
  });
  return { format: RECORDING_FORMAT, version: RECORDING_VERSION, stage, frames };
}

/** Live recorder's half: one MediaPipe result as a frame, first pose only. */
export function recordResult(result: unknown, tMs: number): RecordedFrame {
  if (!Number.isFinite(tMs)) fail("live tMs is not finite");
  const pose = (space: LandmarkSpace) => {
    const raw = readRawPose(result, space);
    return raw?.length === MEDIAPIPE_LANDMARK_COUNT ? raw : null;
  };
  return {
    tMs,
    image: pose(IMAGE_SPACE),
    world: pose(WORLD_SPACE),
  };
}

/** A recorded frame in one space, through the same adapter the live page uses. */
export function replayFrame(
  recording: PoseRecording,
  frame: RecordedFrame,
  space: LandmarkSpace,
): LandmarkFrame {
  return adaptPose(frame[space.kind] ?? undefined, frame.tMs, space, recording.stage);
}
