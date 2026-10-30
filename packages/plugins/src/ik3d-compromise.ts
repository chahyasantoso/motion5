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
 * `Vec3` arithmetic for a shared member's compromise; `ik-goal.ts` owns rule and pull semantics.
 * The reach fit is the 2D fit's three-by-three counterpart, fixed-step, damped alike. */

/** A 3D pull: the shared union over a `Vec3`. */
export type Pull3d = Pull<Vec3>;

/** Where a shared 3D member settles, and how far its branches disagreed about it. */
export function compromise3d(pulls: readonly Pull3d[], rule: CompromiseRule): Compromise<Vec3> {
  return compromiseIn(SPATIAL_GEOMETRY, pulls, rule);
}

/** `Σw·p / Σw` with `relativeWeights`, so a lone pull stays exact. */
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

/** Largest distance to any proposal: the `conflicted` witness. */
function proposalSpread(pulls: readonly Pull3d[], point: Vec3): number {
  let spread = 0;
  for (const pull of pulls) spread = Math.max(spread, norm3(subtract3(pull.point, point)));
  return spread;
}

/** Pinned step count: cost and answer stay fixed. */
const REACH_SPHERE_STEPS = 6;
/** Levenberg damping on the normal equations; keeps a singular system solvable. */
const REACH_SPHERE_DAMPING = 1e-6;

/** Damped Gauss-Newton from the centroid; its result replaces the seed only when the objective strictly falls. */
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
    // Solve A·s = -b, A symmetric.
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

/** The `Vec3` geometry `compromise3d` solves through. */
const SPATIAL_GEOMETRY: CompromiseGeometry<Vec3> = Object.freeze({
  centroid: weightedCentroid,
  spread: proposalSpread,
  reachFit: reachSphereFit,
});
