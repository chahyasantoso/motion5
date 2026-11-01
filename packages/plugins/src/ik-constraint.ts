import {
  BEND_KEY,
  classifyBend,
  FLIP_KEY,
  LIMIT_CEILING,
  LIMIT_FLOOR,
  MAX_ROTATION_KEY,
  MIN_ROTATION_KEY,
  readLimitDegree,
  unreachable,
} from "@motion5/core/plugin-api";
import type { DofBound } from "./ik-descent";

/** Sole runtime owner of joint-limit arithmetic and bend hint: FABRIK and `ik-chain.ts` clamp through it, never restate a bound. */
export type JointLimit =
  | { readonly kind: "free" }
  | { readonly kind: "range"; readonly min: number; readonly max: number };

/** Limited variant; the only kind a `SolveMember` carries: an absent limit is free. */
export type JointRange = Extract<JointLimit, { readonly kind: "range" }>;

export const FREE_JOINT: JointLimit = Object.freeze({ kind: "free" });

/** Angle in `(-180, 180]`; an in-range value returns unchanged — re-deriving shifts an ulp and moves a tip FABRIK placed. */
export function wrapRotation(angle: number): number {
  if (angle > -180 && angle <= 180) return angle;
  const wrapped = ((((angle + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

/** Unsigned shortest angle between two directions, in `[0, 180]`. */
function angularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Legal local angle nearest `local`: free returns it exactly; range wraps first, then takes the bound nearer on the circle, tie to `min`. */
export function limitRotation(limit: JointLimit, local: number): number {
  switch (limit.kind) {
    case "free":
      return local;
    case "range": {
      const wrapped = wrapRotation(local);
      if (wrapped >= limit.min && wrapped <= limit.max) return wrapped;
      return angularDistance(wrapped, limit.min) <= angularDistance(wrapped, limit.max)
        ? limit.min
        : limit.max;
    }
    default:
      return unreachable(limit);
  }
}

/** Centre of a limit's legal set: range midpoint, 0 for free — legal, farthest from both bounds. */
export function rangeCentre(limit: JointLimit): number {
  switch (limit.kind) {
    case "free":
      return 0;
    case "range":
      return (limit.min + limit.max) / 2;
    default:
      return unreachable(limit);
  }
}

/** Legal angle at `fraction` of a range; the sole owner of legal joint-space starts in 2D and 3D. Free→0, 0.5→`rangeCentre`, else interpolates from `min`, legal for `[0, 1]`. */
export function legalRotation(limit: JointLimit, fraction: number): number {
  if (fraction === 0.5) return rangeCentre(limit);
  switch (limit.kind) {
    case "free":
      return 0;
    case "range":
      return limit.min + fraction * (limit.max - limit.min);
    default:
      return unreachable(limit);
  }
}

/** Degrees from a bound that still read as on it: covers `atan2` against `hingeAngle` ulp drift, and moves no visible bone. */
export const JOINT_BOUND_TOLERANCE = 1e-9;

/** Whether `local`, once limited, rests within `JOINT_BOUND_TOLERANCE` of a bound on the circle; free never does. */
export function atBound(limit: JointLimit, local: number): boolean {
  switch (limit.kind) {
    case "free":
      return false;
    case "range": {
      const bounded = limitRotation(limit, local);
      return (
        angularDistance(bounded, limit.min) <= JOINT_BOUND_TOLERANCE ||
        angularDistance(bounded, limit.max) <= JOINT_BOUND_TOLERANCE
      );
    }
    default:
      return unreachable(limit);
  }
}

/** Continuous turn by `degrees` for joint-space descent: range clamps at the bound it meets rather than jumping the forbidden arc; free and full-circle ranges turn unchanged. */
export function turnRotation(limit: JointLimit, local: number, degrees: number): number {
  switch (limit.kind) {
    case "free":
      return local + degrees;
    case "range":
      return limit.max - limit.min >= 360
        ? local + degrees
        : Math.max(limit.min, Math.min(limit.max, local + degrees));
    default:
      return unreachable(limit);
  }
}

/** Which bound a `turnRotation` result rests on: `lower`, `upper` or `interior`. */
export function rotationSide(limit: JointLimit, local: number): DofBound {
  switch (limit.kind) {
    case "free":
      return "interior";
    case "range":
      if (limit.max - limit.min >= 360) return "interior";
      return local <= limit.min ? "lower" : local >= limit.max ? "upper" : "interior";
    default:
      return unreachable(limit);
  }
}

/** Base world direction turned least to put a limited child's local angle back in range — the inward half of enforcement; free or already-legal returns `baseDirection`. */
export function boundBaseDirection(
  limit: JointLimit,
  childDirection: number,
  baseDirection: number,
): number {
  switch (limit.kind) {
    case "free":
      return baseDirection;
    case "range": {
      const local = wrapRotation(childDirection - baseDirection);
      const bounded = limitRotation(limit, local);
      return bounded === local ? baseDirection : childDirection - bounded;
    }
    default:
      return unreachable(limit);
  }
}

/** World direction of an extent-less member: its base's, turned by the legal angle nearest 0; a free joint inherits exactly, a range cannot inherit a forbidden angle. */
export function restDirection(limit: JointLimit, baseDirection: number): number {
  switch (limit.kind) {
    case "free":
      return baseDirection;
    case "range":
      return baseDirection + limitRotation(limit, 0);
    default:
      return unreachable(limit);
  }
}

/** Limit a member's live values declare, total over any value a live write delivers: absent side takes its domain edge, neither bound is free, inverted pair yields `[min, min]`. */
export function readJointLimit(values: Readonly<Record<string, unknown>>): JointLimit {
  return readAngleRange(values, MIN_ROTATION_KEY, MAX_ROTATION_KEY);
}

/** Range a live bound-key pair declares: the sole reader of a live angle range, so defaults, domain and inverted-pair answer are stated once for every dimension. */
export function readAngleRange(
  values: Readonly<Record<string, unknown>>,
  minKey: string,
  maxKey: string,
): JointLimit {
  const min = readLimitDegree(values[minKey]);
  const max = readLimitDegree(values[maxKey]);
  if (min === undefined && max === undefined) return FREE_JOINT;
  const lower = min ?? LIMIT_FLOOR;
  return { kind: "range", min: lower, max: Math.max(lower, max ?? LIMIT_CEILING) };
}

/** Closed form's `flip` from either branch-hint spelling: `positive` bend is true, `negative` false; absent or malformed `bend` falls back to `flip`. */
export function readBend(values: Readonly<Record<string, unknown>>): boolean {
  const bend = classifyBend(values[BEND_KEY]);
  switch (bend.kind) {
    case "bend":
      return bend.bend === "positive";
    case "absent":
    case "malformed":
      return Boolean(values[FLIP_KEY]);
    default:
      return unreachable(bend);
  }
}
