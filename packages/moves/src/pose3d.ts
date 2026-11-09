import {
  eulerFromMatrix3d,
  IDENTITY_MATRIX3,
  matrixFromEuler3d,
  matrixFromQuaternion,
  multiplyMatrix3,
  quaternionFromEuler3d,
  slerpQuaternion,
  type Euler3d,
  type Matrix3,
} from "@motion5/rig";
import { mix } from "./mix";
import type { Pose2d } from "./pose";
import { unreachable } from "./unreachable";

/** A 3D pose, y up, turns in degrees on rig's Z-X-Y Euler; a page pose reaches it only through `lift2d`. */
export type Pose3d = {
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
  readonly rotation?: number;
  readonly rotationX?: number;
  readonly rotationY?: number;
  readonly scale?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly scaleZ?: number;
  readonly opacity?: number;
  readonly anchor?: never;
};

type Mutable3d = { -readonly [K in Exclude<keyof Pose3d, "anchor">]?: number };

const OFFSETS = Object.freeze(["x", "y", "z"] as const);
const TURNS = Object.freeze(["rotation", "rotationX", "rotationY"] as const);
const SCALES = Object.freeze(["scale", "scaleX", "scaleY", "scaleZ", "opacity"] as const);

function eulerOf(pose: Pose3d): Euler3d {
  return {
    rotation: pose.rotation ?? 0,
    rotationX: pose.rotationX ?? 0,
    rotationY: pose.rotationY ?? 0,
  };
}

function writeEuler(out: Mutable3d, euler: Euler3d): void {
  out.rotation = euler.rotation;
  out.rotationX = euler.rotationX;
  out.rotationY = euler.rotationY;
}

/** Poses on one target as one: offsets add, scales multiply, turns compose in order without flipping. */
export function combine3d(poses: readonly Pose3d[]): Pose3d {
  const out: Mutable3d = {};
  for (const pose of poses) {
    for (const key of OFFSETS) {
      const value = pose[key];
      if (value !== undefined) out[key] = (out[key] ?? 0) + value;
    }
    for (const key of SCALES) {
      const value = pose[key];
      if (value !== undefined) out[key] = (out[key] ?? 1) * value;
    }
  }
  const turned = poses.filter((pose) => TURNS.some((key) => pose[key] !== undefined));
  const axes = TURNS.filter((key) => turned.some((pose) => pose[key] !== undefined));
  if (turned.length === 1 || axes.length === 1) {
    for (const key of axes) out[key] = turned.reduce((sum, pose) => sum + (pose[key] ?? 0), 0);
  } else if (turned.length > 1) {
    const product = turned.reduce<Matrix3>(
      (matrix, pose) => multiplyMatrix3(matrix, matrixFromEuler3d(eulerOf(pose))),
      IDENTITY_MATRIX3,
    );
    writeEuler(out, eulerFromMatrix3d(product));
  }
  return out;
}

/** A pose `share` of the way between two; turns take the short arc, past the ends too; a missing field rests. */
export function mixPose3d(from: Pose3d, to: Pose3d, share: number): Pose3d {
  const out: Mutable3d = {};
  for (const key of OFFSETS)
    if (from[key] !== undefined || to[key] !== undefined)
      out[key] = mix(from[key] ?? 0, to[key] ?? 0, share);
  for (const key of SCALES)
    if (from[key] !== undefined || to[key] !== undefined)
      out[key] = mix(from[key] ?? 1, to[key] ?? 1, share);
  if (TURNS.some((key) => from[key] !== undefined || to[key] !== undefined)) {
    const turn = slerpQuaternion(
      quaternionFromEuler3d(eulerOf(from)),
      quaternionFromEuler3d(eulerOf(to)),
      share,
    );
    writeEuler(out, eulerFromMatrix3d(matrixFromQuaternion(turn)));
  }
  return out;
}

/** A 3D point `share` of the way from `from` to `to`. */
export function mixPoint3d(
  from: { readonly x: number; readonly y: number; readonly z: number },
  to: { readonly x: number; readonly y: number; readonly z: number },
  share: number,
): { readonly x: number; readonly y: number; readonly z: number } {
  return { x: mix(from.x, to.x, share), y: mix(from.y, to.y, share), z: mix(from.z, to.z, share) };
}

/** A page pose on the 3D xy plane: px scaled to units, y and the turn flipped, the anchor dropped. */
export function lift2d(pose: Pose2d, options: { readonly unitsPerPx: number }): Pose3d {
  const unit = options.unitsPerPx;
  if (!(unit > 0)) throw new RangeError("lift2d: unitsPerPx must be above 0.");
  const out: Mutable3d = {};
  if (pose.x !== undefined) out.x = pose.x * unit;
  if (pose.y !== undefined) out.y = -pose.y * unit;
  if (pose.rotation !== undefined) out.rotation = -pose.rotation;
  for (const key of ["scale", "scaleX", "scaleY", "opacity"] as const) {
    const value = pose[key];
    if (value !== undefined) out[key] = value;
  }
  return out;
}

/** A body `weight` of the way into its `squash` along `axis`, widened on the other two so its volume stays. */
export function squashed3d(squash: number, weight: number, axis: "x" | "y" | "z" = "y"): Pose3d {
  const short = 1 - squash * weight;
  if (!(short > 0)) throw new RangeError("squashed3d: squash times weight must stay below 1.");
  if (weight === 0) return {};
  const wide = 1 / Math.sqrt(short);
  switch (axis) {
    case "x":
      return { scaleX: short, scaleY: wide, scaleZ: wide };
    case "y":
      return { scaleX: wide, scaleY: short, scaleZ: wide };
    case "z":
      return { scaleX: wide, scaleY: wide, scaleZ: short };
    default:
      return unreachable(axis);
  }
}
