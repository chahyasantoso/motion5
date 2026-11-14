import { POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d, type ValueField } from "../fields/pose";

type PoseNumber = (typeof POSE_2D_NUMBERS)[number];

const ADDED: readonly PoseNumber[] = POSE_2D_NUMBERS.filter(
  (name) => VALUE_FIELDS[name].combines === "add",
);

/** A pose field's value, 0 when the pose leaves it out. */
export const num = (value: number | undefined): number => value ?? 0;

/** What a modifier writes out: the added fields and the custom numbers its input carries. */
export interface Carried {
  readonly fields: readonly PoseNumber[];
  readonly names: readonly string[];
}

/** Every added field and custom number any of the poses carries; a field none carries is left alone. */
export function carried(...poses: readonly Pose2d[]): Carried {
  return {
    fields: ADDED.filter((field) => poses.some((pose) => pose[field] !== undefined)),
    names: [...new Set(poses.flatMap((pose) => Object.keys(pose.custom ?? {})))],
  };
}

/** A field's amount, stopped at the least its row allows. */
function held(field: PoseNumber, value: number): number {
  const row: ValueField = VALUE_FIELDS[field];
  return row.least === undefined ? value : Math.max(row.least, value);
}

/** Reads one number out of a pose. */
type Reading = (pose: Pose2d) => number;

/** `pose` with each carried field and custom number set by `f` from how to read it. */
function setCarried(pose: Pose2d, carry: Carried, f: (read: Reading) => number): Pose2d {
  const out: { -readonly [K in PoseNumber]?: number } = {};
  for (const field of carry.fields)
    out[field] = held(
      field,
      f((p) => num(p[field])),
    );
  if (carry.names.length === 0) return { ...pose, ...out };
  const custom: Record<string, number> = {};
  for (const name of carry.names) custom[name] = f((p) => num(p.custom?.[name]));
  return { ...pose, ...out, custom };
}

/** A pose with every carried number written out, so every sample of a modifier has the same fields. */
export const whole = (pose: Pose2d, carry: Carried): Pose2d =>
  setCarried(pose, carry, (read) => read(pose));

/** `base` pushed `k` of the way from `other` through it, on every carried number. */
export const pushed = (base: Pose2d, other: Pose2d, k: number, carry: Carried): Pose2d =>
  setCarried(base, carry, (read) => read(base) + k * (read(base) - read(other)));
