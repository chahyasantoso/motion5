import {
  eulerFromMatrix3d,
  IDENTITY_MATRIX3,
  matrixFromEuler3d,
  multiplyMatrix3,
  type Euler3d,
  type Matrix3,
} from "@gerak/rig";
import { addCustom, join } from "./combine";
import { VALUE_FIELDS, type Pose2d } from "./pose";

/** The turns a 3D pose carries; they compose as one rotation rather than by their rows. */
export const TURNS = Object.freeze(["rotation", "rotationX", "rotationY"] as const);

/** The other numbers a 3D pose carries, each a row of the table. */
export const NUMBERS = Object.freeze([
  "x",
  "y",
  "z",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "opacity",
] as const) satisfies readonly (keyof typeof VALUE_FIELDS)[];

/** A 3D pose, every field optional: `x`, `y`, `z`, `rotation` (about z), `rotationX`, `rotationY`,
 * scales, `opacity`. Y up, degrees on Z-X-Y; a `Pose2d` is refused. */
export type Pose3d = {
  readonly [K in (typeof TURNS)[number] | (typeof NUMBERS)[number]]?: number;
} & {
  readonly anchor?: never;
  readonly custom?: Readonly<Record<string, number>>;
};

export type Mutable3d = { -readonly [K in Exclude<keyof Pose3d, "anchor">]?: Pose3d[K] };

export function eulerOf(pose: Pose3d): Euler3d {
  return {
    rotation: pose.rotation ?? 0,
    rotationX: pose.rotationX ?? 0,
    rotationY: pose.rotationY ?? 0,
  };
}

export function writeEuler(out: Mutable3d, euler: Euler3d): void {
  out.rotation = euler.rotation;
  out.rotationX = euler.rotationX;
  out.rotationY = euler.rotationY;
}

/** Poses on one target as one: each field joins as its row says, custom numbers add, turns compose in order. */
export function combine3d(poses: readonly Pose3d[]): Pose3d {
  const out: Mutable3d = {};
  for (const pose of poses)
    for (const key of NUMBERS) {
      const value = pose[key];
      if (value !== undefined) out[key] = join(VALUE_FIELDS[key].combines, out[key], value);
    }
  const custom = addCustom(poses);
  if (custom !== undefined) out.custom = custom;
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

/** A 2D pose on the 3D xy plane: px scaled by `unitsPerPx`, y and the turn flipped, the anchor dropped;
 * every 2D move reaches 3D through it. */
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
  if (pose.custom !== undefined) out.custom = pose.custom;
  return out;
}
