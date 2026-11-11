import { POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d } from "./pose";

type PoseNumber = (typeof POSE_2D_NUMBERS)[number];

const ADDED: readonly PoseNumber[] = POSE_2D_NUMBERS.filter(
  (name) => VALUE_FIELDS[name].combines === "add",
);

/** A pose field's value, 0 when the pose leaves it out. */
export const num = (value: number | undefined): number => value ?? 0;

/** Every custom number any of the poses names. */
export function customNames(...poses: readonly Pose2d[]): readonly string[] {
  return [...new Set(poses.flatMap((pose) => Object.keys(pose.custom ?? {})))];
}

/** Reads one number out of a pose. */
type Reading = (pose: Pose2d) => number;

/** `pose` with each number that adds, and each custom number in `names`, set by `f` from how to read it. */
function setAdded(pose: Pose2d, names: readonly string[], f: (read: Reading) => number): Pose2d {
  const out: { -readonly [K in PoseNumber]?: number } = {};
  for (const field of ADDED) out[field] = f((p) => num(p[field]));
  if (names.length === 0 && pose.custom === undefined) return { ...pose, ...out };
  const custom: Record<string, number> = {};
  for (const name of names) custom[name] = f((p) => num(p.custom?.[name]));
  return { ...pose, ...out, custom };
}

/** A pose with every number that adds written out, so every sample of a modifier carries the same fields. */
export const whole = (pose: Pose2d, names: readonly string[]): Pose2d =>
  setAdded(pose, names, (read) => read(pose));

/** `base` pushed `k` of the way from `other` through it, on every number that adds. */
export const pushed = (base: Pose2d, other: Pose2d, k: number, names: readonly string[]): Pose2d =>
  setAdded(base, names, (read) => read(base) + k * (read(base) - read(other)));
