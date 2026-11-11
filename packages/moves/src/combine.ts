import { POSE_2D_NUMBERS, VALUE_FIELDS, type Combining, type Pose2d } from "./pose";
import { unreachable } from "./unreachable";

function join(combines: Combining, held: number | undefined, value: number): number {
  switch (combines) {
    case "add":
      return (held ?? 0) + value;
    case "multiply":
      return (held ?? 1) * value;
    case "replace":
      return value;
    default:
      return unreachable(combines);
  }
}

/** Poses on one target as one: each field joins as its table row says, custom numbers add, the first anchor stays. */
export function combine(poses: readonly Pose2d[]): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
  const custom: Record<string, number> = {};
  for (const pose of poses) {
    for (const key of POSE_2D_NUMBERS) {
      const value = pose[key];
      if (value !== undefined) out[key] = join(VALUE_FIELDS[key].combines, out[key], value);
    }
    for (const [name, value] of Object.entries(pose.custom ?? {}))
      custom[name] = (custom[name] ?? 0) + value;
    if (out.anchor === undefined && pose.anchor !== undefined) out.anchor = pose.anchor;
  }
  if (Object.keys(custom).length > 0) out.custom = custom;
  return out;
}
