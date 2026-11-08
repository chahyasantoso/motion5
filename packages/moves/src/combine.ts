import { ADDED_FIELDS as ADDED, MULTIPLIED_FIELDS as MULTIPLIED, type Pose2d } from "./pose";

/** Poses on one target as one: offsets and turns add, scales and opacity multiply, the first anchor stays. */
export function combine(poses: readonly Pose2d[]): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
  for (const pose of poses) {
    for (const key of ADDED) {
      const value = pose[key];
      if (value !== undefined) out[key] = (out[key] ?? 0) + value;
    }
    for (const key of MULTIPLIED) {
      const value = pose[key];
      if (value !== undefined) out[key] = (out[key] ?? 1) * value;
    }
    if (out.anchor === undefined && pose.anchor !== undefined) out.anchor = pose.anchor;
  }
  return out;
}
