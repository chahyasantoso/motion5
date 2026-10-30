import { unreachable } from "@motion5/core/plugin-api";
import { clamp, effectiveLink, pivotFromBaseTip, toRadians, type WorldFrame } from "./frame";
import { solveLength, solveOffset, type SolveMember } from "./ik-member";
import { readGoal } from "./ik-goal-reading";
import type { ClosedFormQuality, SolveResult } from "./ik-result";

/**
 * The analytic two-bone solve: local rotations in `fk`'s degrees; offsets fold into `reach`/`twist`; exact in `[|reach - l2|, reach + l2]`, clamped outside; `flip` mirrors the elbow.
 */
export function solveTwoBone(
  root: WorldFrame,
  target: WorldFrame,
  first: SolveMember,
  second: SolveMember,
  flip = false,
): SolveResult<ClosedFormQuality> {
  const { angles, quality } = twoBone(root, target, first, second, flip);
  const [r1, r2] = angles;
  return Object.freeze({
    rotations: Object.freeze({
      [first.id]: r1,
      [second.id]: r2,
    }),
    residuals: Object.freeze({ [second.id]: quality.residual }),
    quality: Object.freeze(quality),
  });
}

/** The two local angles `solveTwoBone` publishes, in member order, and how well they answer. */
interface TwoBoneAnswer {
  readonly angles: readonly [number, number];
  readonly quality: ClosedFormQuality;
}

/** The closed form itself. Every exit reads one reach band and one residual. */
function twoBone(
  root: WorldFrame,
  target: WorldFrame,
  first: SolveMember,
  second: SolveMember,
  flip: boolean,
): TwoBoneAnswer {
  const l1 = solveLength(first);
  const l2 = solveLength(second);
  // Base and link: pure functions of the root frame and the authored offsets, never of the angles.
  const base = pivotFromBaseTip(root, root.rotation, solveOffset(first));
  const link = effectiveLink(l1, solveOffset(second));
  const reach = link.length;
  const twist = link.twist;

  const reading = readGoal(second.id, [
    ["x", target.x],
    ["y", target.y],
  ]);
  // One band serves every exit: `l2 === 0` collapses it to `[reach, reach]`, `reach === 0` to `[l2, l2]`.
  const minReach = Math.abs(reach - l2);
  const maxReach = reach + l2;
  let targetAngle: number;
  let clampedD: number;
  let band: ClosedFormQuality;
  switch (reading.kind) {
    case "point": {
      const dx = reading.coordinates[0]! - base.x;
      const dy = reading.coordinates[1]! - base.y;
      const d = Math.hypot(dx, dy);
      targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      clampedD = clamp(d, minReach, maxReach);
      band = bandQuality(d, minReach, maxReach, Math.abs(d - clampedD));
      break;
    }
    case "direction":
      // No distance to a direction goal: fully extended along it, hence `too-far` with an infinite residual.
      targetAngle = (Math.atan2(reading.direction[1]!, reading.direction[0]!) * 180) / Math.PI;
      clampedD = maxReach;
      band = { kind: "too-far", residual: Number.POSITIVE_INFINITY };
      break;
    default:
      return unreachable(reading);
  }

  // `l2 === 0`: the first angle aims the link, twist included; second angle 0.
  // `reach === 0`: the second angle aims the segment, first 0; no link -> no twist, `effectiveLink`.
  if (l2 <= 0) return { angles: [targetAngle - twist - root.rotation, 0], quality: band };
  if (reach <= 0) return { angles: [0, targetAngle - root.rotation], quality: band };

  // `clampedD === 0` only for a goal at the base with `reach === l2`; positive `d` clamps to itself.
  // No direction there, so the rest pose answers: the band's only in-band miss.
  if (clampedD <= 0) {
    return {
      angles: [0, 0],
      quality: { kind: "coincident", residual: restMiss(root, reach, twist, l2) },
    };
  }

  // `flip` takes `-alpha`, the mirror across the base-goal line; both branches hit the goal exactly.
  // Twist out of the first angle, into the second: that lands the composed tip on the goal.
  const alpha = (Math.acos(cosineOpposite(reach, clampedD, l2)) * 180) / Math.PI;
  const beta = (Math.acos(cosineOpposite(reach, l2, clampedD)) * 180) / Math.PI;

  const angles: readonly [number, number] = flip
    ? [targetAngle - alpha - twist - root.rotation, 180 - beta + twist]
    : [targetAngle + alpha - twist - root.rotation, beta - 180 + twist];
  return { angles, quality: band };
}

/**
 * The law of cosines for the angle between `a` and `b`, opposite `opposite`, clamped into `acos`'s domain; sides scaled by the nearest power of two so their squares stay in range.
 */
export function cosineOpposite(a: number, b: number, opposite: number): number {
  // Capped so `2 ** -exponent` stays a normal power of two; a side past the cap lands within `2 ** 24` of unit.
  const exponent = clamp(Math.round(Math.log2(Math.max(a, b, opposite))), -1000, 1000);
  // Exact, not approximated: a power-of-two scale, and every square, sum and quotient that stays
  // normal, are bit-identical to the unscaled ones.
  const scale = 2 ** -exponent;
  const x = a * scale;
  const y = b * scale;
  const z = opposite * scale;
  const cosine = (x * x + y * y - z * z) / (2 * x * y);
  // `NaN` only from `0 / 0`: a side with no extent even at unit magnitude reads the aligned angle.
  return Number.isNaN(cosine) ? 1 : clamp(cosine, -1, 1);
}

/**
 * Which side of `[minReach, maxReach]` the goal at distance `d` sits on; `residual` is the caller's clamp miss, passed through, never laundered to zero.
 */
export function bandQuality(
  d: number,
  minReach: number,
  maxReach: number,
  residual: number,
): ClosedFormQuality {
  // Tested far-first: a band collapsed to one point still names the side it was missed on.
  // `NaN` in `d` or a bound fails both tests -> `reached`, so `residual <= tolerance` stays false.
  if (d > maxReach) return { kind: "too-far", residual };
  if (d < minReach) return { kind: "too-near", residual };
  return { kind: "reached", residual };
}

/** The distance a coincident goal's rest pose leaves the tip from the base: link at `root.rotation + twist` plus `l2` at `root.rotation`. */
function restMiss(root: WorldFrame, reach: number, twist: number, l2: number): number {
  const link = toRadians(root.rotation + twist);
  const segment = toRadians(root.rotation);
  return Math.hypot(
    reach * Math.cos(link) + l2 * Math.cos(segment),
    reach * Math.sin(link) + l2 * Math.sin(segment),
  );
}
