import { norm3, subtract3, type Vec3 } from "./frame3d";
import {
  compromiseIn,
  reachCircleOf,
  relativeWeights,
  type Compromise,
  type CompromiseGeometry,
  type CompromiseRule,
  type Pull,
} from "./ik-goal";

/**
 * The 3D arithmetic of a shared member's compromise, and nothing else (ADR-122).
 *
 * Which rules exist, what a pull is, how pulls are weighed relative to the largest and that the
 * spread is measured around the centroid whichever rule placed the member are `ik-goal.ts`'s, the
 * owner the 2D solve reads (ADR-110). This module states only what those words compute on a
 * `Vec3`: the weighted centroid, the proposal spread, and the reach fit, whose "circle" is a sphere
 * in three dimensions. Vector arithmetic is dimension-specific by issue #500's rule, so the 2D fit's
 * two-by-two normal equations are not generalised under a dimension flag; this is their three-by-
 * three counterpart, fixed-step and damped the same way.
 */

/** A 3D pull: the shared union over a `Vec3`. */
export type Pull3d = Pull<Vec3>;

/** Where a shared 3D member settles, and how far its branches disagreed about it. */
export function compromise3d(pulls: readonly Pull3d[], rule: CompromiseRule): Compromise<Vec3> {
  return compromiseIn(SPATIAL_GEOMETRY, pulls, rule);
}

/** `Σw·p / Σw` with `relativeWeights`, so a lone pull settles exactly where it proposed. */
function weightedCentroid(pulls: readonly Pull3d[]): Vec3 {
  const weights = relativeWeights(pulls);
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;
  let sumW = 0;
  pulls.forEach(({ point }, index) => {
    const w = weights[index]!;
    sumX += w * point[0];
    sumY += w * point[1];
    sumZ += w * point[2];
    sumW += w;
  });
  return [sumX / sumW, sumY / sumW, sumZ / sumW];
}

/** The largest distance from `point` to any pull's proposal: the `conflicted` witness. */
function proposalSpread(pulls: readonly Pull3d[], point: Vec3): number {
  let spread = 0;
  for (const pull of pulls) spread = Math.max(spread, norm3(subtract3(pull.point, point)));
  return spread;
}

/** Gauss-Newton steps the reach-sphere fit takes, the 2D fit's count. */
const REACH_SPHERE_STEPS = 6;
/** Levenberg damping on the normal equations, the 2D fit's value. */
const REACH_SPHERE_DAMPING = 1e-6;

/**
 * Fit one tip to its pulls' reach spheres by a fixed number of damped Gauss-Newton steps, seeded at
 * the centroid and kept only when it strictly improves the centroid's objective, exactly the 2D
 * rule: a non-finite step, a singular system or no improvement keeps the centroid, a lone pull
 * settles on its own proposal, and a pull whose centre coincides with the current point takes the
 * positive x axis for its Jacobian row. The three-by-three system is solved by Cramer's rule, which
 * is total for a nonzero finite determinant and has no pivoting order to pin.
 */
function reachSphereFit(pulls: readonly Pull3d[], centroid: Vec3): Vec3 {
  if (pulls.length === 1) return centroid;
  const weights = relativeWeights(pulls);
  const spheres = pulls.map((pull, index) => ({ ...reachCircleOf(pull), weight: weights[index]! }));
  const objective = (point: Vec3): number => {
    let value = 0;
    for (const { centre, radius, weight } of spheres) {
      const error = norm3(subtract3(point, centre)) - radius;
      value += weight * error * error;
    }
    return value;
  };
  let point = centroid;
  for (let step = 0; step < REACH_SPHERE_STEPS; step += 1) {
    let a00 = REACH_SPHERE_DAMPING;
    let a01 = 0;
    let a02 = 0;
    let a11 = REACH_SPHERE_DAMPING;
    let a12 = 0;
    let a22 = REACH_SPHERE_DAMPING;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (const { centre, radius, weight } of spheres) {
      const delta = subtract3(point, centre);
      const distance = norm3(delta);
      const ax = distance === 0 ? 1 : delta[0] / distance;
      const ay = distance === 0 ? 0 : delta[1] / distance;
      const az = distance === 0 ? 0 : delta[2] / distance;
      const error = distance - radius;
      a00 += weight * ax * ax;
      a01 += weight * ax * ay;
      a02 += weight * ax * az;
      a11 += weight * ay * ay;
      a12 += weight * ay * az;
      a22 += weight * az * az;
      b0 += weight * ax * error;
      b1 += weight * ay * error;
      b2 += weight * az * error;
    }
    // Solve A·s = -b for the step s, A symmetric.
    const c00 = a11 * a22 - a12 * a12;
    const c01 = a02 * a12 - a01 * a22;
    const c02 = a01 * a12 - a02 * a11;
    const determinant = a00 * c00 + a01 * c01 + a02 * c02;
    if (!Number.isFinite(determinant) || determinant === 0) return centroid;
    const c11 = a00 * a22 - a02 * a02;
    const c12 = a01 * a02 - a00 * a12;
    const c22 = a00 * a11 - a01 * a01;
    const next: Vec3 = [
      point[0] - (c00 * b0 + c01 * b1 + c02 * b2) / determinant,
      point[1] - (c01 * b0 + c11 * b1 + c12 * b2) / determinant,
      point[2] - (c02 * b0 + c12 * b1 + c22 * b2) / determinant,
    ];
    if (!next.every(Number.isFinite)) return centroid;
    point = next;
  }
  const fitted = objective(point);
  const seeded = objective(centroid);
  return Number.isFinite(fitted) && fitted < seeded ? point : centroid;
}

/** The 3D arithmetic `compromise3d` hands to `compromiseIn`. */
const SPATIAL_GEOMETRY: CompromiseGeometry<Vec3> = Object.freeze({
  centroid: weightedCentroid,
  spread: proposalSpread,
  reachFit: reachSphereFit,
});
