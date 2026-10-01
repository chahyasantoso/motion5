import type { RawLandmark, StageSize } from "../filler/adapter";
import {
  JOINTS,
  MEDIAPIPE_INDEX,
  MEDIAPIPE_LANDMARK_COUNT,
  type JointId,
} from "../filler/landmarks";
import { unreachable } from "../filler/unreachable";
import { add, dot, scale, sub, unit, type Vec } from "../filler/vec";
import { RECORDING_FORMAT, type PoseRecording } from "./recording";

/**
 * The deterministic subject the harness is proven on before any recording exists. `still` is a
 * person standing with a slow sway, the calibration input for the gap detector; `exercise` is an
 * arm raise with a squat, fast enough that a gate tuned on noise alone would cut it.
 */
export type SyntheticMotion = { readonly kind: "still" } | { readonly kind: "exercise" };

export interface SyntheticOptions {
  readonly motion: SyntheticMotion;
  readonly seed: number;
  readonly durationMs: number;
  readonly fps: number;
  readonly stage?: StageSize;
  /**
   * A factor on the position noise, 1 by default. 0 is the noiseless twin of the same seed (the
   * draws still happen, so visibility and trust are identical), the truth a denoiser is judged
   * against; above 1 stands in for a camera noisier than the default.
   */
  readonly noiseScale?: number;
}

export const DEFAULT_STAGE: StageSize = Object.freeze({ width: 640, height: 480 });

/**
 * The figure is hip-centred and camera-facing, in metres: person-left is +x, down is +y and
 * negative z is toward the camera. Limbs are built by forward kinematics, so these lengths are
 * exact in world space.
 */
export const SYNTHETIC_BONES = Object.freeze({
  hipToShoulder: 0.5,
  shoulderWidth: 0.38,
  hipWidth: 0.28,
  upperArm: 0.3,
  forearm: 0.27,
  thigh: 0.45,
  shin: 0.43,
});
const PERIOD_MS = 2400;
const SWAY_PERIOD_MS = 10000;
const CAMERA_DISTANCE = 2.6;
/** Pixels of image noise per axis, and metres of world noise per axis, one standard deviation. */
const IMAGE_NOISE_PX = 1.5;
const WORLD_NOISE_M = 0.008;
const DEG = Math.PI / 180;

/** Every angle the pose at one instant is built from, in radians. */
interface PoseAngles {
  readonly lean: number;
  readonly twist: number;
  readonly arm: (phase: number) => { raise: number; depth: number; elbow: number };
  readonly leg: (phase: number) => { flex: number; abduction: number; knee: number };
  /** The right side's lag behind the left, so the two sides are never mirror-identical. */
  readonly rightLagMs: number;
}

/** The one switch over the motion: everything else builds the same figure from these angles. */
function poseAngles(motion: SyntheticMotion, tMs: number): PoseAngles {
  switch (motion.kind) {
    case "still": {
      const sway = (2 * Math.PI * tMs) / SWAY_PERIOD_MS;
      return {
        lean: 0.01 * Math.sin(sway),
        twist: 0.006 * Math.sin(sway + 0.7),
        arm: () => ({ raise: 20 * DEG, depth: 0, elbow: 10 * DEG }),
        leg: () => ({ flex: 0, abduction: 0, knee: 0 }),
        rightLagMs: 0,
      };
    }
    case "exercise": {
      const phase = (2 * Math.PI * tMs) / PERIOD_MS;
      return {
        lean: 0.056 * Math.sin(phase),
        twist: 0.04 * Math.sin(phase + 0.8),
        arm: (p) => ({
          raise: (20 + 130 * p) * DEG,
          depth: 35 * p * DEG,
          elbow: (10 + 70 * p) * DEG,
        }),
        leg: (p) => ({ flex: 60 * p * DEG, abduction: 5 * p * DEG, knee: 90 * p * DEG }),
        rightLagMs: 150,
      };
    }
    default:
      return unreachable(motion, "synthetic motion");
  }
}

/** 0 at rest, 1 at the top of the repetition. */
function repetition(tMs: number): number {
  return 0.5 - 0.5 * Math.cos((2 * Math.PI * tMs) / PERIOD_MS);
}

/** Rotates the unit `u` by `angle` toward `preferred`, in the plane they span, keeping it unit. */
function bend(u: Vec, preferred: Vec, angle: number): Vec {
  const across = unit(sub(preferred, scale(u, dot(preferred, u)))) ?? [1, 0, 0];
  return unit(add(scale(u, Math.cos(angle)), scale(across, Math.sin(angle))))!;
}

/** A unit vector `angle` from straight down, abducted to `side`, pitched `depth` toward camera. */
function swing(side: number, angle: number, depth: number): Vec {
  return [
    side * Math.sin(angle) * Math.cos(depth),
    Math.cos(angle) * Math.cos(depth),
    -Math.sin(depth),
  ];
}

const SIDES = [
  { side: 1, prefix: "left" },
  { side: -1, prefix: "right" },
] as const;

/** The noiseless world pose in metres at `tMs`. */
export function syntheticWorldPose(motion: SyntheticMotion, tMs: number): Record<JointId, Vec> {
  const b = SYNTHETIC_BONES;
  const angles = poseAngles(motion, tMs);
  const x = b.hipToShoulder * Math.sin(angles.lean);
  const z = b.hipToShoulder * Math.sin(angles.twist);
  const shoulderMid: Vec = [x, -Math.sqrt(b.hipToShoulder ** 2 - x ** 2 - z ** 2), z];
  const pose = {} as Record<JointId, Vec>;
  for (const { side, prefix } of SIDES) {
    const phase = repetition(tMs - (side < 0 ? angles.rightLagMs : 0));
    const shoulder = add(shoulderMid, [(side * b.shoulderWidth) / 2, 0, 0]);
    const hip: Vec = [(side * b.hipWidth) / 2, 0, 0];
    const arm = angles.arm(phase);
    const upperArm = swing(side, arm.raise, arm.depth);
    const elbow = add(shoulder, scale(upperArm, b.upperArm));
    const leg = angles.leg(phase);
    const thigh = swing(side, leg.abduction, leg.flex);
    const knee = add(hip, scale(thigh, b.thigh));
    pose[`${prefix}-shoulder`] = shoulder;
    pose[`${prefix}-elbow`] = elbow;
    pose[`${prefix}-wrist`] = add(
      elbow,
      scale(bend(upperArm, [-side, 1, 0], arm.elbow), b.forearm),
    );
    pose[`${prefix}-hip`] = hip;
    pose[`${prefix}-knee`] = knee;
    pose[`${prefix}-ankle`] = add(knee, scale(bend(thigh, [0, 1, 0], leg.knee), b.shin));
  }
  return pose;
}

/** Seeded uniform [0, 1): mulberry32, so a seed names one recording on every platform. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number): number {
  const first = Math.max(random(), Number.MIN_VALUE);
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * random());
}

function validate(options: SyntheticOptions): { stage: StageSize; noiseScale: number } {
  if (!Number.isInteger(options.seed)) throw new Error("Synthetic seed must be an integer.");
  if (!Number.isFinite(options.durationMs) || options.durationMs < 0)
    throw new Error("Synthetic durationMs must be finite and non-negative.");
  if (!Number.isFinite(options.fps) || options.fps <= 0)
    throw new Error("Synthetic fps must be finite and greater than zero.");
  const noiseScale = options.noiseScale ?? 1;
  if (!(Number.isFinite(noiseScale) && noiseScale >= 0))
    throw new Error("Synthetic noiseScale must be finite and non-negative.");
  const stage = options.stage ?? DEFAULT_STAGE;
  if (!(Number.isFinite(stage.width) && Number.isFinite(stage.height)))
    throw new Error("Synthetic stage width and height must be finite.");
  if (stage.width <= 0 || stage.height <= 0)
    throw new Error("Synthetic stage width and height must be greater than zero.");
  return { stage: { width: stage.width, height: stage.height }, noiseScale };
}

/**
 * The true image position of a world point, normalised as MediaPipe reports it: a pinhole camera
 * `CAMERA_DISTANCE` in front of the hip midpoint, with a focal length that makes a 1.7 m figure
 * span 70% of the stage height.
 */
export function projectToImage(point: Vec, stage: StageSize): Vec {
  const depth = CAMERA_DISTANCE + point[2]!;
  const focal = (0.7 * stage.height * CAMERA_DISTANCE) / 1.7;
  return [
    0.5 + (focal * point[0]!) / (depth * stage.width),
    0.54 + (focal * point[1]!) / (depth * stage.height),
    (focal * point[2]!) / (depth * stage.width),
  ];
}

const clampUnit = (value: number) => Math.min(0.999999, Math.max(0.000001, value));

/**
 * A deterministic recording: `floor(durationMs * fps / 1000)` frames from t = 0, each with
 * independent seeded noise (world in metres, image in pixels before normalisation). The twelve
 * limb joints are filled; every other MediaPipe slot is a zero landmark of visibility 0.
 */
export function createSyntheticRecording(options: SyntheticOptions): PoseRecording {
  const { stage, noiseScale } = validate(options);
  const random = mulberry32(options.seed);
  const noise = () => gaussian(random);
  const positionNoise = () => noiseScale * noise();
  const frameCount = Math.floor((options.durationMs * options.fps) / 1000);
  const frames = Array.from({ length: frameCount }, (_, index) => {
    const tMs = (index * 1000) / options.fps;
    const truth = syntheticWorldPose(options.motion, tMs);
    const image: RawLandmark[] = Array.from({ length: MEDIAPIPE_LANDMARK_COUNT }, () => [
      0, 0, 0, 0,
    ]);
    const world = image.slice();
    JOINTS.forEach((joint, jointIndex) => {
      const point = truth[joint];
      const wave = 0.018 * Math.sin((2 * Math.PI * tMs) / 7000 + jointIndex * 0.73);
      const visibility = Math.min(0.99, Math.max(0.88, 0.935 + wave + 0.003 * noise()));
      const [x, y, z] = projectToImage(point, stage);
      world[MEDIAPIPE_INDEX[joint]] = [
        point[0]! + WORLD_NOISE_M * positionNoise(),
        point[1]! + WORLD_NOISE_M * positionNoise(),
        point[2]! + WORLD_NOISE_M * positionNoise(),
        visibility,
      ];
      image[MEDIAPIPE_INDEX[joint]] = [
        clampUnit(x! + (IMAGE_NOISE_PX / stage.width) * positionNoise()),
        clampUnit(y! + (IMAGE_NOISE_PX / stage.height) * positionNoise()),
        z!,
        visibility,
      ];
    });
    return { tMs, image, world };
  });
  return { format: RECORDING_FORMAT, version: 1, stage, frames };
}
