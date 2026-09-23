import { unreachable } from "../lang/exhaustive";
import {
  BEND_KEY,
  classifyBend,
  FLIP_KEY,
  LIMIT_CEILING,
  LIMIT_FLOOR,
  MAX_ROTATION_KEY,
  MIN_ROTATION_KEY,
  readLimitDegree,
} from "../contract/solver-constraints";

/**
 * The one runtime owner of joint-limit arithmetic and of the bend hint. See ADR-108.
 *
 * FABRIK enforces limits by calling this module and never restates a bound, and the adapter in
 * `ik-chain.ts` reads a member's limit through it once per solve. Two owners of one limit is the
 * defect this module exists to refuse: a limit clamped in two places disagrees on the case nobody
 * tests.
 */
export type JointLimit =
  | { readonly kind: "free" }
  | { readonly kind: "range"; readonly min: number; readonly max: number };

/** The limited variant, which is all a `SolveMember` ever carries: an absent limit means free. */
export type JointRange = Extract<JointLimit, { readonly kind: "range" }>;

export const FREE_JOINT: JointLimit = Object.freeze({ kind: "free" });

/**
 * An angle in `(-180, 180]`, returned unchanged when it is already there.
 *
 * Unchanged rather than re-derived, because `(x + 180) - 180` is not `x` in floating point, and a
 * wrap that moved an in-range angle by one ulp would make `limitRotation` report a legal angle as
 * moved and would re-place a tip FABRIK already placed.
 */
export function wrapRotation(angle: number): number {
  if (angle > -180 && angle <= 180) return angle;
  const wrapped = ((((angle + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

/** The unsigned shortest angle between two directions, in `[0, 180]`. */
function angularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * The legal local angle nearest to `local`.
 *
 * A free joint returns `local` exactly, so an unconstrained member publishes the doubles it always
 * published. A range wraps first, then answers an angle outside it with the bound nearer on the
 * circle rather than on the number line: for `[90, 170]`, `-170` is 20 degrees from `170` and 100
 * from `90`, and a numeric clamp would swing the bone the long way round. A tie takes `min`, so the
 * answer never depends on evaluation order.
 */
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

/** Whether `local`, once limited, rests on a bound. A free joint has none. */
export function atBound(limit: JointLimit, local: number): boolean {
  switch (limit.kind) {
    case "free":
      return false;
    case "range": {
      const bounded = limitRotation(limit, local);
      return bounded === limit.min || bounded === limit.max;
    }
    default:
      return unreachable(limit);
  }
}

/**
 * The world direction of a member with no extent: its base's, turned by the legal angle nearest 0.
 *
 * A free joint inherits its base's direction exactly, which is what leaves its children where the
 * solve put them. A limited one cannot inherit an angle its range forbids.
 */
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

/**
 * The limit a member's live values declare, total over any value a live write can deliver.
 *
 * Load refuses every malformed or empty authored limit, but a live value-tier write bypasses load,
 * so this reader is total rather than trusting it. Each bound is read independently: a value outside
 * the domain is absent, an absent side defaults to the domain edge, and a member with neither bound
 * is free. An inverted pair is answered as `[min, min]` rather than thrown.
 */
export function readJointLimit(values: Readonly<Record<string, unknown>>): JointLimit {
  const min = readLimitDegree(values[MIN_ROTATION_KEY]);
  const max = readLimitDegree(values[MAX_ROTATION_KEY]);
  if (min === undefined && max === undefined) return FREE_JOINT;
  const lower = min ?? LIMIT_FLOOR;
  return { kind: "range", min: lower, max: Math.max(lower, max ?? LIMIT_CEILING) };
}

/**
 * The closed form's `flip`, from whichever spelling of the branch hint the solver authored.
 *
 * `bend` names the sign of the solved second joint's local rotation: `positive` turns the elbow
 * toward increasing rotation, which is exactly `flip: true` (the worked rig's `+51.318`), and
 * `negative` is the default branch, `flip: false` (`-51.318`). `CL-19` pins that sign rather than
 * only the boolean equivalence. Load refuses both spellings together; a live malformed `bend` falls
 * back to `flip`, which is total and never silently inverts an authored branch.
 */
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
