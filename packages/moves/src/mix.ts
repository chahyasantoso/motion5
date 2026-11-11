import { POSE_2D_NUMBERS, VALUE_FIELDS, type Pose2d } from "./pose";

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

/** A pose `share` of the way between two; a field one pose lacks counts as its rest, and a custom number as 0. */
export function mixPose(from: Pose2d, to: Pose2d, share: number): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
  for (const key of POSE_2D_NUMBERS) {
    if (from[key] === undefined && to[key] === undefined) continue;
    const rest = VALUE_FIELDS[key].rest ?? 0;
    out[key] = mix(from[key] ?? rest, to[key] ?? rest, share);
  }
  const names = new Set([...Object.keys(from.custom ?? {}), ...Object.keys(to.custom ?? {})]);
  if (names.size > 0)
    out.custom = Object.fromEntries(
      [...names].map((name) => [
        name,
        mix(from.custom?.[name] ?? 0, to.custom?.[name] ?? 0, share),
      ]),
    );
  const anchor = share < 1 ? (from.anchor ?? to.anchor) : (to.anchor ?? from.anchor);
  if (anchor !== undefined) out.anchor = anchor;
  return out;
}
