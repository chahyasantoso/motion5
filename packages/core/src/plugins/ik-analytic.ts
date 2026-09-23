import { clamp, effectiveLink, pivotFromBaseTip, type WorldFrame } from "./frame";
import { solveLength, solveOffset, type SolveMember } from "./ik-member";
import type { ClosedFormQuality, SolveResult } from "./ik-result";

/**
 * The analytic two-bone solve, in `fk`'s own degrees and rotate-then-translate convention.
 *
 * Both members' rotations are local, so the returned angles are exactly what `fk` substitutes for
 * an authored `rotation`: the first is measured from the root's own rotation, the second from the
 * first bone's world direction.
 *
 * The two members arrive as two parameters rather than as an array, because the closed form is
 * defined for exactly two and nothing else. `ik-solve.ts` is the one caller that decides a chain
 * has that shape, and it hands over the pair it proved rather than a list this function would have
 * to index and trust. A `members.length < 2` branch used to answer a one-member chain with zeros;
 * it stays deleted, because a one-member chain is a real solve that points at its goal.
 *
 * The default elbow is the positive branch. `flip: false` takes `phi + alpha`, so the worked rig
 * (root `200,300`, target `320,340`, lengths `80` and `60`) solves to `40.168` and `-51.318`, and
 * `flip: true` is its mirror across the root-to-target line. Both configurations put the tip on
 * the target exactly, so the convention has to be pinned by the two numbers rather than by a
 * reachability assertion that either branch satisfies. `IK-1` owns the default and `IK-3` owns the
 * mirror.
 *
 * **Pivot offsets are solved rather than ignored, and the closed form survives them.** Two authored
 * offsets enter the geometry in two different places, and neither is an approximation:
 *
 * The first member's offset moves the point the whole chain pivots about. It is read in the root's
 * own rotated frame, so it is fixed the moment the root frame is known and no rotation this solve
 * publishes can move it. The triangle is therefore solved from that pivot rather than from the
 * root's own position.
 *
 * The second member's offset fuses with the first member's extension into one rigid link, because
 * both are read in the first member's frame and turn with it: a length of `hypot(l1 + x2, y2)` at a
 * fixed twist of `atan2(y2, l1 + x2)` off the first bone's own direction. The law of cosines then
 * runs on that link and `l2` unchanged, and the twist is subtracted from the first angle and added
 * to the second, which is exactly the accounting that leaves the composed tip on the target. See
 * ADR-054 and `PV-1` through `PV-4`.
 *
 * A member that authors no offset contributes an effective link of exactly `l1` at exactly zero
 * twist, and `frame.ts` guarantees both by short-circuit rather than by arithmetic that happens to
 * round that way. Every zero-offset rig therefore publishes the doubles it always published, which
 * `PV-4` pins as byte identity against every branch of this function.
 *
 * An unreachable target is clamped into `[|a - l2|, a + l2]` rather than refused, so the chain
 * extends toward it instead of producing `NaN` out of `acos`. The bound is stated on the effective
 * link rather than on `l1`, because the reach an offset chain actually has is the link's. The
 * `clamp` it is stated with is `frame.ts`', shared with the bone's blend weight rather than held
 * privately here. See ADR-055.
 *
 * Every exit returns through one frozen record. The degenerate cases are a pair of angles each,
 * not a return statement each, so the record's key order and freezing are stated once.
 *
 * **The result says how well the angles answer the goal, and it is stated rather than measured.**
 * The rotations are exact for every goal in the reach band, so the residual is the clamp's own
 * `|d - clampedD|` rather than a forward composition this function would have to run: zero inside
 * the band, and the distance to the nearer bound outside it. The degenerate exits read the same
 * band, because with extents already clamped to zero `[|reach - l2|, reach + l2]` is exactly
 * `[reach, reach]` when the second segment has no extent and `[l2, l2]` when the link has none, so
 * no exit needs a band of its own. The one miss inside the band is the coincident goal, which the
 * rest pose answers; its residual is where that pose leaves the tip. `IR-6` holds every residual to
 * the miss `fk`'s own composition measures. See `ik-result.ts` and ADR-107.
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
  // The chain's own base, and the rigid link that leaves it. Both are pure functions of the root
  // frame and the two authored offsets, so neither depends on the angles solved below.
  const base = pivotFromBaseTip(root, root.rotation, solveOffset(first));
  const link = effectiveLink(l1, solveOffset(second));
  const reach = link.length;
  const twist = link.twist;

  const dx = target.x - base.x;
  const dy = target.y - base.y;
  const d = Math.hypot(dx, dy);
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const minReach = Math.abs(reach - l2);
  const maxReach = reach + l2;
  const clampedD = clamp(d, minReach, maxReach);
  const band = bandQuality(d, minReach, maxReach, Math.abs(d - clampedD));

  // A link with no extent has no twist either, which `effectiveLink` guarantees, so the degenerate
  // cases aim whichever segment is left and subtract a twist that is exactly zero. A missing second
  // segment aims the link, whether or not the link itself has extent; a missing link with a real
  // second segment aims the second segment.
  if (l2 <= 0) return { angles: [targetAngle - twist - root.rotation, 0], quality: band };
  if (reach <= 0) return { angles: [0, targetAngle - root.rotation], quality: band };

  // Only a goal on the base with `reach === l2` clamps to zero: the band's lower bound is zero only
  // then, and a positive distance clamps to itself. It has no direction, so the rest pose answers.
  if (clampedD <= 0) {
    return {
      angles: [0, 0],
      quality: { kind: "coincident", residual: restMiss(root, reach, twist, l2) },
    };
  }

  const cosAlpha = clamp(
    (reach * reach + clampedD * clampedD - l2 * l2) / (2 * reach * clampedD),
    -1,
    1,
  );
  const alpha = (Math.acos(cosAlpha) * 180) / Math.PI;

  const cosBeta = clamp((reach * reach + l2 * l2 - clampedD * clampedD) / (2 * reach * l2), -1, 1);
  const beta = (Math.acos(cosBeta) * 180) / Math.PI;

  const angles: readonly [number, number] = flip
    ? [targetAngle - alpha - twist - root.rotation, 180 - beta + twist]
    : [targetAngle + alpha - twist - root.rotation, beta - 180 + twist];
  return { angles, quality: band };
}

/**
 * Where a goal at distance `d` sits against the reach band, and the residual the clamp leaves.
 *
 * Read in this order so a band that has collapsed to one point still names the side it was missed
 * on. A non-finite distance or bound compares false against both and reads as `reached` with the
 * non-finite residual it produced: the angles it publishes are non-finite too, the quality reports
 * the geometry it was handed rather than validating it, and the residual is not laundered to zero.
 */
function bandQuality(
  d: number,
  minReach: number,
  maxReach: number,
  residual: number,
): ClosedFormQuality {
  if (d > maxReach) return { kind: "too-far", residual };
  if (d < minReach) return { kind: "too-near", residual };
  return { kind: "reached", residual };
}

/**
 * The distance the rest pose leaves the tip from the chain's own base, which is where a coincident
 * goal sits. With both local angles zero the link leaves the base at the root's rotation plus its
 * twist and the second segment continues at the root's rotation, so the tip is the sum of those two
 * vectors.
 */
function restMiss(root: WorldFrame, reach: number, twist: number, l2: number): number {
  const link = ((root.rotation + twist) * Math.PI) / 180;
  const segment = (root.rotation * Math.PI) / 180;
  return Math.hypot(
    reach * Math.cos(link) + l2 * Math.cos(segment),
    reach * Math.sin(link) + l2 * Math.sin(segment),
  );
}
