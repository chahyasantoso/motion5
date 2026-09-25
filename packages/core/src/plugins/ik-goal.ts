import { INFLUENCE_KEY, readInfluenceValue } from "../contract/solver-constraints";
import type { WorldPoint } from "./frame";
import type { SolveMember } from "./ik-member";
import { unreachable } from "../lang/exhaustive";

/**
 * The one runtime owner of goal influence: how strongly each addressed goal pulls on the members
 * its branch shares with other branches, and the weighted compromise those pulls settle on. See
 * ADR-110.
 *
 * **Influence is the goal's, never the bone's.** A member's blend `weight` says how much of the
 * solved angle the bone composes with, after the solve (ADR-055). Influence says how much a goal's
 * branch counts when branches disagree about a shared member, inside the solve. The two questions
 * sit on opposite sides of the line ADR-055 draws, so neither reads the other.
 *
 * **A compromise, not a priority.** FABRIK settles a sub-base on one point from its branches'
 * proposals, and influence turns the equal mean into a weighted one. Strict priorities (goal A is
 * met exactly and goal B only in what is left) need a null-space projection that FABRIK does not
 * have, so they are withdrawn rather than approximated. See ADR-110.
 */

/** The influence a goal has when its leaf authored none. */
export const DEFAULT_INFLUENCE = 1;

/**
 * The influence a member's live values declare, or `undefined` for anything outside the domain.
 *
 * Total over any live value, as `readJointLimit` is, because a value-tier write bypasses load:
 * load refuses every malformed authored influence, and an out-of-domain live one reads as absent
 * and so as the default rather than as a weight the compromise cannot divide by.
 */
export function readInfluence(values: Readonly<Record<string, unknown>>): number | undefined {
  return readInfluenceValue(values[INFLUENCE_KEY]);
}

/** The influence a solve uses for one member's goal, absence read as the documented default. */
export function goalInfluence(member: SolveMember): number {
  return member.influence ?? DEFAULT_INFLUENCE;
}

/**
 * Each member's pull: the mean influence of the addressed leaves in the subtree it roots.
 *
 * The mean rather than the sum, because a branch's say over a shared member is what its goals
 * want, not how many of them there are, and because with every influence at its default the mean
 * is exactly `1` for every member, which is what keeps an unweighted rig's compromise the equal
 * average it always was, bit for bit. A member no addressed leaf hangs under pulls with the
 * default, which is what an unaddressed branch contributed before influence existed.
 *
 * The mean is taken relative to the subtree's largest influence, `max · (Σ(v / max) / n)`, rather
 * than as `Σv / n`, because every admitted influence is finite but their sum need not be: two
 * leaves at `Number.MAX_VALUE` overflow `Σv` to `Infinity`, and the compromise would then divide
 * `Infinity` by `Infinity`. Each ratio is at most `1` and the largest is exactly `1`, so the scaled
 * sum is finite and at least `1`, and the pull is finite and positive. With every influence at `1`
 * the scale is `1`, every ratio is `1`, and the pull is `1 · (n / n)`, exactly `1`.
 *
 * `addressed` is the caller's own list of the leaves it seeds from goals, so this function answers
 * about exactly the leaves the solve reaches toward rather than re-deriving leafhood.
 */
export function branchPulls(
  byId: ReadonlyMap<string, SolveMember>,
  addressed: readonly string[],
): ReadonlyMap<string, number> {
  const under = new Map<string, number[]>();
  for (const leaf of addressed) {
    const member = byId.get(leaf);
    if (member === undefined) continue;
    const influence = goalInfluence(member);
    const seen = new Set<string>();
    for (let id: string | undefined = leaf; id !== undefined && !seen.has(id); ) {
      seen.add(id);
      const list = under.get(id) ?? [];
      list.push(influence);
      under.set(id, list);
      id = byId.get(id)?.base;
      if (id !== undefined && !byId.has(id)) id = undefined;
    }
  }
  const pulls = new Map<string, number>();
  for (const id of byId.keys()) pulls.set(id, scaledMean(under.get(id) ?? []));
  return pulls;
}

/** The mean of positive finite influences without overflow, or the default for none. */
function scaledMean(influences: readonly number[]): number {
  if (influences.length === 0) return DEFAULT_INFLUENCE;
  let scale = 0;
  for (const influence of influences) scale = Math.max(scale, influence);
  let ratios = 0;
  for (const influence of influences) ratios += influence / scale;
  return scale * (ratios / influences.length);
}

/**
 * The closed compromise policy, read by one exhaustive `switch` in `compromise`.
 *
 * `centroid` is the historical rule and the one every authored-seed baseline uses. `reach-circle`
 * is the alternative FABRIK's conflict selector tries only after the centroid baseline reports
 * `conflicted` (issue #490, ADR-110). No third rule is implied by the union being closed; a new one
 * is a decision recorded in ADR-110 and a compile error at every reader until it is handled.
 */
export type CompromiseRule = "centroid" | "reach-circle";

/**
 * A circle a shared member's tip should lie on for one proposal to be met exactly.
 *
 * `radius` is non-negative and `centre` is finite, because both come from a finite solve state.
 */
export interface ReachCircle {
  readonly centre: WorldPoint;
  readonly radius: number;
}

/**
 * One proposal for a member's tip, and the pull it is weighed by: a closed union by `kind`.
 *
 * A `goal` pull is an addressed leaf's own aim. It is the only proposal a leaf ever receives,
 * because a goal is read only on a leaf, and its reach circle is the aim itself with radius `0`.
 *
 * A `branch` pull is a child member's proposal about its base's tip. `point` is the tip the child
 * proposes (its placed pivot, un-offset through the base's direction), and `reach` is where the
 * base's tip may lie for the child's length to hold while the child's tip stays where the inward
 * pass left it: the child's tip un-offset the same way, at radius the child's solve length. The
 * proposal `point` lies on that circle by construction, so the centroid rule and the reach-circle
 * rule read the same geometry, and the reach circle accounts for pivot offsets exactly because it
 * is taken through the same `baseTipFromPivot` conversion as `point`.
 *
 * Read with `reachCircleOf`, never by probing for a field.
 */
export type Pull =
  | { readonly kind: "goal"; readonly point: WorldPoint; readonly weight: number }
  | {
      readonly kind: "branch";
      readonly point: WorldPoint;
      readonly weight: number;
      readonly reach: ReachCircle;
    };

/** The circle one pull is met on, read exhaustively over the closed `Pull` union. */
export function reachCircleOf(pull: Pull): ReachCircle {
  switch (pull.kind) {
    case "goal":
      return { centre: pull.point, radius: 0 };
    case "branch":
      return pull.reach;
    default:
      return unreachable(pull);
  }
}

/**
 * Where a shared member settles, and how far its branches disagreed about it.
 *
 * `spread` is the largest distance from the settled point to any branch's proposal. It is zero
 * wherever one branch proposed, and it stays above tolerance after the last pass only when the
 * branches still pull the member to different places, which is the witness FABRIK's `conflicted`
 * kind reads rather than an inference from the goal count.
 */
export interface Compromise {
  readonly point: WorldPoint;
  readonly spread: number;
}

/**
 * The influence-weighted mean of one member's proposals, `Σw·p / Σw`.
 *
 * A lone proposal is weighed by `1` whatever its pull, because a branch with nobody to compromise
 * with settles where it proposed, and `(w·x) / w` is not `x` in floating point. Several proposals
 * are weighed relative to the largest pull, `w / max`, which leaves the mean unchanged in exact
 * arithmetic and keeps it finite in floating point: every relative weight is at most `1`, the
 * largest is exactly `1`, so `Σw` is at least `1` and never overflows or vanishes, where raw pulls
 * near `Number.MAX_VALUE` would overflow `Σw` and settle the member on `NaN`. With every weight
 * exactly `1` the scale is `1` and the sums are the ones FABRIK always took (`0 + 1·x` is `0 + x`,
 * including the `-0` the zero-seeded sum normalises to `+0`) and the divisor is the proposal
 * count, so an unweighted rig settles on the equal mean bit for bit. Weights are positive and
 * finite by construction (`readInfluenceValue` admits nothing else and a pull is a scaled mean of
 * admitted values), and `pulls` is never empty because FABRIK asks only about a member that
 * received a proposal.
 *
 * That mean is the `centroid` rule's point and the seed of the `reach-circle` rule's fit. Both
 * rules report the same `spread`, measured around the mean, so `conflicted` keeps one witness
 * whichever rule placed the member. The default rule is the historical one, so a caller that never
 * names a rule settles exactly where it always did.
 */
export function compromise(pulls: readonly Pull[], rule: CompromiseRule = "centroid"): Compromise {
  const centroid = weightedCentroid(pulls);
  const spread = proposalSpread(pulls, centroid);
  switch (rule) {
    case "centroid":
      return { point: centroid, spread };
    case "reach-circle":
      return { point: reachCircleFit(pulls, centroid), spread };
    default:
      return unreachable(rule);
  }
}

function weightedCentroid(pulls: readonly Pull[]): WorldPoint {
  const lone = pulls.length === 1;
  let scale = 0;
  for (const { weight } of pulls) scale = Math.max(scale, weight);
  let sumX = 0;
  let sumY = 0;
  let sumW = 0;
  for (const { point, weight } of pulls) {
    const w = lone ? 1 : weight / scale;
    sumX += w * point.x;
    sumY += w * point.y;
    sumW += w;
  }
  return Object.freeze({ x: sumX / sumW, y: sumY / sumW });
}

function proposalSpread(pulls: readonly Pull[], point: WorldPoint): number {
  let spread = 0;
  for (const pull of pulls) {
    spread = Math.max(spread, Math.hypot(pull.point.x - point.x, pull.point.y - point.y));
  }
  return spread;
}

/** Gauss-Newton steps the reach-circle fit takes, fixed so its cost and answer are fixed. */
const REACH_CIRCLE_STEPS = 6;
/** Levenberg damping on the normal equations, fixed; it only keeps a rank-one system solvable. */
const REACH_CIRCLE_DAMPING = 1e-6;

/**
 * Fit one tip to its pulls' reach circles by a fixed number of damped Gauss-Newton steps.
 *
 * The objective is `Σ (w_i / max w) · (|p − centre_i| − radius_i)²`. Weights are taken relative to
 * the largest pull exactly as `weightedCentroid` takes them, so the fit and the centroid share one
 * normalisation: every relative weight is in `(0, 1]` and the largest is `1`, which keeps the
 * normal equations finite for pulls near `Number.MAX_VALUE`, and scaling every influence by one
 * factor changes neither answer.
 *
 * Seeded at the centroid, because the centroid is the rule's baseline and the fit must never be
 * worse than it: a non-finite step, a singular system, or a final objective that does not strictly
 * improve the centroid's keeps the centroid. A lone pull settles on its own proposal exactly, as
 * the centroid does. A pull whose centre coincides with the current point takes the positive x axis
 * for its Jacobian row, which is arbitrary but total and identical on every call. The proposal
 * spread is measured by the caller around the centroid, not around this point, because the spread
 * is the `conflicted` witness and not a property of this alternative. See ADR-110.
 */
function reachCircleFit(pulls: readonly Pull[], centroid: WorldPoint): WorldPoint {
  if (pulls.length === 1) return centroid;
  let scale = 0;
  for (const { weight } of pulls) scale = Math.max(scale, weight);
  const circles = pulls.map((pull) => ({ ...reachCircleOf(pull), weight: pull.weight / scale }));
  const objective = (point: WorldPoint): number => {
    let value = 0;
    for (const { centre, radius, weight } of circles) {
      const error = Math.hypot(point.x - centre.x, point.y - centre.y) - radius;
      value += weight * error * error;
    }
    return value;
  };
  let point = centroid;
  for (let step = 0; step < REACH_CIRCLE_STEPS; step += 1) {
    let jxx = REACH_CIRCLE_DAMPING;
    let jxy = 0;
    let jyy = REACH_CIRCLE_DAMPING;
    let bx = 0;
    let by = 0;
    for (const { centre, radius, weight } of circles) {
      const dx = point.x - centre.x;
      const dy = point.y - centre.y;
      const distance = Math.hypot(dx, dy);
      const axisX = distance === 0 ? 1 : dx / distance;
      const axisY = distance === 0 ? 0 : dy / distance;
      const error = distance - radius;
      jxx += weight * axisX * axisX;
      jxy += weight * axisX * axisY;
      jyy += weight * axisY * axisY;
      bx += weight * axisX * error;
      by += weight * axisY * error;
    }
    const determinant = jxx * jyy - jxy * jxy;
    if (!Number.isFinite(determinant) || determinant === 0) return centroid;
    const next = {
      x: point.x + (-jyy * bx + jxy * by) / determinant,
      y: point.y + (jxy * bx - jxx * by) / determinant,
    };
    if (!Number.isFinite(next.x) || !Number.isFinite(next.y)) return centroid;
    point = next;
  }
  const fitted = objective(point);
  const seeded = objective(centroid);
  return Number.isFinite(fitted) && fitted < seeded ? Object.freeze(point) : centroid;
}
