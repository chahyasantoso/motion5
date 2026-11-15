import { CUSTOM_FIELD, POSE_2D_NUMBERS, VALUE_FIELDS, type Combining, type Pose2d } from "./pose";
import { unreachable } from "../unreachable";

/** A field's held answer joined with the next by the field's rule; nothing held counts as the rule's identity. */
export function join(combines: Combining, held: number | undefined, value: number): number {
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

type Customized = { readonly custom?: Readonly<Record<string, number>> };

/** The custom numbers of values on one target added by name, or nothing when none has one. */
export function addCustom(values: readonly Customized[]): Record<string, number> | undefined {
  const custom: Record<string, number> = {};
  for (const value of values)
    for (const [name, number] of Object.entries(value.custom ?? {}))
      custom[name] = join(CUSTOM_FIELD.combines, custom[name], number);
  return Object.keys(custom).length > 0 ? custom : undefined;
}

/** Poses on one target as one: each field joins as its table row says, custom numbers add, the first anchor stays. */
export function combine(poses: readonly Pose2d[]): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
  for (const pose of poses) {
    for (const key of POSE_2D_NUMBERS) {
      const value = pose[key];
      if (value !== undefined) out[key] = join(VALUE_FIELDS[key].combines, out[key], value);
    }
    if (out.anchor === undefined && pose.anchor !== undefined) out.anchor = pose.anchor;
  }
  const custom = addCustom(poses);
  if (custom !== undefined) out.custom = custom;
  return out;
}
