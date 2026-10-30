import { INFLUENCE_KEY, readInfluenceValue, unreachable } from "@motion5/core/plugin-api";
import type { WorldPoint } from "./frame";
import type { SolveMember } from "./ik-member";

/** Owns goal influence, how much a goal's branch counts when branches disagree about a shared member, and the compromise it settles on. */

/** The influence a goal has when its leaf authored none. */
export const DEFAULT_INFLUENCE = 1;

/** The influence a member's live values declare, or `undefined` for anything outside the domain. */
export function readInfluence(values: Readonly<Record<string, unknown>>): number | undefined {
  return readInfluenceValue(values[INFLUENCE_KEY]);
}

/** The influence a solve uses for one member's goal, absence read as `DEFAULT_INFLUENCE`. */
export function goalInfluence(member: Pick<SolveMember, "influence">): number {
  return member.influence ?? DEFAULT_INFLUENCE;
}

/** Each member's pull: the mean influence of the addressed leaves in the subtree it roots, or the default where it has none. */
export function branchPulls(
  byId: ReadonlyMap<string, Pick<SolveMember, "base" | "influence">>,
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

/** The influence mean scaled by its largest value, so large influences cannot overflow the sum. */
function scaledMean(influences: readonly number[]): number {
  if (influences.length === 0) return DEFAULT_INFLUENCE;
  let scale = 0;
  for (const influence of influences) scale = Math.max(scale, influence);
  let ratios = 0;
  for (const influence of influences) ratios += influence / scale;
  return scale * (ratios / influences.length);
}

/** The closed compromise policy: `centroid` is the default, `reach-circle` the alternative tried only after a centroid baseline reports `conflicted`. */
export type CompromiseRule = "centroid" | "reach-circle";

/** A circle a shared member's tip should lie on for a proposal to be met exactly; finite centre, non-negative radius. */
export interface ReachCircle<P = WorldPoint> {
  readonly centre: P;
  readonly radius: number;
}

/** One proposal for a member's tip, weighed by its pull: a closed `kind` union read by `reachCircleOf`; a `branch` `point` and `reach` are un-offset through the base's direction. */
export type Pull<P = WorldPoint> =
  | { readonly kind: "goal"; readonly point: P; readonly weight: number }
  | {
      readonly kind: "branch";
      readonly point: P;
      readonly weight: number;
      readonly reach: ReachCircle<P>;
    };

/** The circle one pull is met on, read exhaustively over the closed `Pull` union. */
export function reachCircleOf<P>(pull: Pull<P>): ReachCircle<P> {
  switch (pull.kind) {
    case "goal":
      return { centre: pull.point, radius: 0 };
    case "branch":
      return pull.reach;
    default:
      return unreachable(pull);
  }
}

/** Where a shared member settles, and `spread`: the largest distance from it to any proposal, the `conflicted` witness. */
export interface Compromise<P = WorldPoint> {
  readonly point: P;
  readonly spread: number;
}

/** The arithmetic a compromise needs in one dimension: weighted centroid, proposal spread, and the seeded reach fit. */
export interface CompromiseGeometry<P> {
  readonly centroid: (pulls: readonly Pull<P>[]) => P;
  readonly spread: (pulls: readonly Pull<P>[], point: P) => number;
  readonly reachFit: (pulls: readonly Pull<P>[], centroid: P) => P;
}

/** The one reading of the closed `CompromiseRule` union: where a member settles under `rule` in `geometry`'s dimension, both rules reporting the centroid `spread`. */
export function compromiseIn<P>(
  geometry: CompromiseGeometry<P>,
  pulls: readonly Pull<P>[],
  rule: CompromiseRule,
): Compromise<P> {
  const centroid = geometry.centroid(pulls);
  const spread = geometry.spread(pulls, centroid);
  switch (rule) {
    case "centroid":
      return { point: centroid, spread };
    case "reach-circle":
      return { point: geometry.reachFit(pulls, centroid), spread };
    default:
      return unreachable(rule);
  }
}

/** The influence-weighted mean `Σw·p / Σw` of one member's proposals: the `centroid` point and the `reach-circle` seed. */
export function compromise(pulls: readonly Pull[], rule: CompromiseRule = "centroid"): Compromise {
  return compromiseIn(PLANAR_GEOMETRY, pulls, rule);
}

/** One pull's weight relative to the largest in `pulls`, and `1` for a lone pull, so both rules' sums stay finite. */
export function relativeWeights(pulls: readonly { readonly weight: number }[]): readonly number[] {
  if (pulls.length === 1) return [1];
  let scale = 0;
  for (const { weight } of pulls) scale = Math.max(scale, weight);
  return pulls.map(({ weight }) => weight / scale);
}

function weightedCentroid(pulls: readonly Pull[]): WorldPoint {
  const weights = relativeWeights(pulls);
  let sumX = 0;
  let sumY = 0;
  let sumW = 0;
  pulls.forEach(({ point }, index) => {
    const w = weights[index]!;
    sumX += w * point.x;
    sumY += w * point.y;
    sumW += w;
  });
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
/** Levenberg damping on the normal equations; it only keeps a rank-one system solvable. */
const REACH_CIRCLE_DAMPING = 1e-6;

/** Damped Gauss-Newton fit of one tip to its pulls' circles, `Σ(w/max)·(|p - centre| - radius)^2`, seeded at the centroid and returned to unless it strictly improves it. */
function reachCircleFit(pulls: readonly Pull[], centroid: WorldPoint): WorldPoint {
  if (pulls.length === 1) return centroid;
  const weights = relativeWeights(pulls);
  const circles = pulls.map((pull, index) => ({ ...reachCircleOf(pull), weight: weights[index]! }));
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

/** The 2D arithmetic `compromise` hands to `compromiseIn`. */
const PLANAR_GEOMETRY: CompromiseGeometry<WorldPoint> = Object.freeze({
  centroid: weightedCentroid,
  spread: proposalSpread,
  reachFit: reachCircleFit,
});
