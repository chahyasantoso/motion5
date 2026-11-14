import { CUSTOM_FIELD, POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d } from "../../fields/pose";

/** The number `share` of the way from `from` to `to`; a share past 0 or 1 extrapolates. */
export function mix(from: number, to: number, share: number): number {
  return from + (to - from) * share;
}

/** An angle in degrees `share` of the way from `from` to `to`, turning the short way round. */
export function mixAngle(from: number, to: number, share: number): number {
  const turn = ((((to - from) % 360) + 540) % 360) - 180;
  return from + turn * share;
}

/** A point `share` of the way from `from` to `to`. */
export function mixPoint(
  from: { readonly x: number; readonly y: number },
  to: { readonly x: number; readonly y: number },
  share: number,
): { readonly x: number; readonly y: number } {
  return { x: mix(from.x, to.x, share), y: mix(from.y, to.y, share) };
}

type Customized = { readonly custom?: Readonly<Record<string, number>> };

/** The custom numbers `share` of the way between two values, each missing one at its rest, or nothing when neither has one. */
export function mixCustom(
  from: Customized,
  to: Customized,
  share: number,
): Record<string, number> | undefined {
  const names = new Set([...Object.keys(from.custom ?? {}), ...Object.keys(to.custom ?? {})]);
  if (names.size === 0) return undefined;
  const rest = CUSTOM_FIELD.rest ?? 0;
  return Object.fromEntries(
    [...names].map((name) => [
      name,
      mix(from.custom?.[name] ?? rest, to.custom?.[name] ?? rest, share),
    ]),
  );
}

// A field with no rest, such as a clip, has nothing to blend from: the side that has it gives both ends.
/** A pose `share` of the way between two; a field one pose lacks counts as its rest, and a custom number as 0. */
export function mixPose(from: Pose2d, to: Pose2d, share: number): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
  for (const key of POSE_2D_NUMBERS) {
    const rest = VALUE_FIELDS[key].rest;
    const start = from[key] ?? rest ?? to[key];
    const end = to[key] ?? rest ?? from[key];
    if (start === undefined || end === undefined) continue;
    if (from[key] === undefined && to[key] === undefined) continue;
    out[key] = mix(start, end, share);
  }
  const custom = mixCustom(from, to, share);
  if (custom !== undefined) out.custom = custom;
  const anchor = share < 1 ? (from.anchor ?? to.anchor) : (to.anchor ?? from.anchor);
  if (anchor !== undefined) out.anchor = anchor;
  return out;
}
