import { unreachable } from "../lang/exhaustive";
import { arcHalfAngle, FABRIK_TOLERANCE, iterativeQuality } from "./fabrik";
import { fabrikIterationCap } from "./fabrik-cap";
import { selectFabrik } from "./fabrik-select";
import { readNumber, segmentExtent } from "./frame";
import {
  add3,
  axisX3,
  divide3,
  eulerFromMatrix3d,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  norm3,
  readPivotOffset3d,
  scale3,
  subtract3,
  swingFrame3d,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "./frame3d";
import { branchPulls, type CompromiseRule } from "./ik-goal";
import { aimPoint, goalMiss, readGoal, type GoalReading } from "./ik-goal-reading";
import type { IterativeQuality } from "./ik-result";
import { magnitudeOf } from "./ik-scale";
import { canonicalChain } from "./ik-topology";
import {
  bendBasis3d,
  poleMagnitudes,
  rereadPole3d,
  scaleFrame3d,
  scaleOffset3d,
  scalePole,
  type Pole3d,
} from "./ik3d-analytic";
import type { ChainMember3d } from "./ik3d-chain";
import { compromise3d, type Pull3d } from "./ik3d-compromise";
import { restoreResult3d, type SolveResult3d } from "./ik3d-result";

/**
 * FABRIK in three dimensions: the iterative strategy for every 3D chain that is not the closed
 * form's two bones, long serial chains and branching trees alike (issue #500 phase 5, ADR-122).
 *
 * **What is shared with 2D, and why only that.** Canonical member order, child counts, leaves and
 * serial depth are `ik-topology.ts`'s; goal reading, the direction stand-in and the miss are
 * `ik-goal-reading.ts`'s; branch pulls, the `Pull` union, relative weights and the rule dispatch are
 * `ik-goal.ts`'s; the tolerance, the arc seed's half-angle and the naming of an outcome as one
 * quality kind are `fabrik.ts`'s; the iteration cap is `fabrik-cap.ts`'s (ADR-115); the four
 * candidate conflict selector is `fabrik-select.ts`'s (#490); the magnitude policy is
 * `ik-scale.ts`'s. Each of those questions has the same contract in both dimensions. Vector
 * arithmetic does not, so the passes, the placement and the compromise geometry are stated here and
 * in `ik3d-compromise.ts` over `Vec3`, rather than behind a dimension flag in the 2D file.
 *
 * **Orientation, which positional FABRIK does not determine.** Positions fix a member's direction,
 * two of its three rotational degrees of freedom. The third, roll about the bone, is reconstructed
 * deterministically: each member's world frame is its rest frame (its authored `fk3d` rest
 * orientation under its parent's solved frame, ADR-116) turned by `swingFrame3d`, the one minimal
 * swing onto its solved direction. So a member adds no roll its rest pose did not have, a rig with
 * no authored rest reconstructs pure swings from its parent, and the planar subset reduces to the 2D
 * solve's angles. The reconstruction runs inside every outward pass, not only at the end, because
 * a child's pivot offset is read in its parent's full rotated frame, roll included (ADR-117).
 *
 * **Bend plane.** Each root-to-leaf path is seeded on a constant-curvature arc in the plane the
 * closed form bends in, read through `bendBasis3d`, the one owner of the pole rule (ADR-118): toward
 * an authored pole, else the root-local +z rule. `flip` mirrors the arc across the line to the goal,
 * which is the opposite seed side the selector tries for a conflicted baseline; no 3D author sets
 * it, so an authored solve always starts on the pole's side.
 *
 * The solve is a pure function of the root, the members and the pole: no state survives a call and
 * nothing is warm-started, so a reverse scrub and a random seek republish the forward pass byte for
 * byte (ADR-111).
 */

/** An attempt's full answer: the shared result plus the pivots and tips its rotations describe. */
export interface Fabrik3dSolution extends SolveResult3d<IterativeQuality> {
  readonly pivots: Readonly<Record<string, Vec3>>;
  readonly tips: Readonly<Record<string, Vec3>>;
}

const X_AXIS: Vec3 = [1, 0, 0];

/** A frozen copy of `v`, so a published position never aliases the solve's working state. */
function frozen(v: Vec3): Vec3 {
  return Object.freeze([v[0], v[1], v[2]] as const);
}

/** Whether an offset is exactly zero, which composes its member's pivot on its base's tip. */
function isZeroOffset(offset: Vec3): boolean {
  return offset[0] === 0 && offset[1] === 0 && offset[2] === 0;
}

/**
 * The point at distance `length` from `from`, toward `to`: the 2D `place` over `Vec3`, with the same
 * two chosen degeneracies (a zero length collapses onto `from`, a zero distance takes world +x) and
 * the same overflow guard, which normalises by the largest component only when `length / distance`
 * is not finite, so every ordinary rig takes the plain expression.
 */
export function place3d(from: Vec3, to: Vec3, length: number): Vec3 {
  if (length <= 0) return from;
  const delta = subtract3(to, from);
  const distance = norm3(delta);
  if (distance <= 0) return add3(from, scale3(X_AXIS, length));
  const ratio = length / distance;
  if (Number.isFinite(ratio)) return add3(from, scale3(delta, ratio));
  const axis = Math.max(Math.abs(delta[0]), Math.abs(delta[1]), Math.abs(delta[2]));
  const unit = divide3(delta, axis);
  return add3(from, scale3(unit, length / norm3(unit)));
}

/**
 * The seed for one root-to-leaf path: the joints of a constant-curvature arc from `origin` to
 * `goal` exactly as long as the path, in the plane spanned by `along` (toward the goal) and
 * `across` (the side it bulges to). The 2D `seedArc` arithmetic with its two axes replaced by
 * vectors, and the same `arcHalfAngle` bisection, so a planar rig seeds the same points.
 */
export function seedArc3d(
  origin: Vec3,
  goal: Vec3,
  lengths: readonly number[],
  along: Vec3,
  across: Vec3,
): readonly Vec3[] {
  const total = lengths.reduce((sum, length) => sum + segmentExtent(length), 0);
  const chord = norm3(subtract3(goal, origin));
  const halfAngle = total > 0 && chord < total ? arcHalfAngle(chord / total) : 0;
  const radius = halfAngle > 0 ? total / (2 * halfAngle) : 0;
  const points: Vec3[] = [];
  let travelled = 0;
  for (const length of lengths) {
    travelled += segmentExtent(length);
    const fraction = total > 0 ? travelled / total : 1;
    const angle = -halfAngle + 2 * halfAngle * fraction;
    const axial = halfAngle > 0 ? chord / 2 + radius * Math.sin(angle) : fraction * chord;
    const lateral = halfAngle > 0 ? radius * (Math.cos(angle) - Math.cos(halfAngle)) : 0;
    points.push(add3(origin, add3(scale3(along, axial), scale3(across, lateral))));
  }
  return points;
}

/**
 * One attempt from one seed side and one compromise rule.
 *
 * The structure is the 2D attempt's: seed every addressed path, run an outward pass, then alternate
 * inward and outward passes until the worst addressed miss is inside `FABRIK_TOLERANCE`, a pass
 * moves nothing, or the cap is reached. A sub-base settles on the influence-weighted compromise of
 * the tips its branches propose, each branch un-offsetting its proposed pivot through its base's
 * current full frame, so positions are averaged and orientations never are (ADR-054).
 */
export function solveTree3dAttempt(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
  flip: boolean,
  rule: CompromiseRule,
): Fabrik3dSolution {
  const { byId, ids, serialDepth, childCount, leaves } = canonicalChain(members);
  const isMember = (id: string): boolean => byId.has(id);
  const baseOf = (id: string): string => byId.get(id)!.base;
  const goalOf = (id: string): WorldFrame3d | undefined => byId.get(id)!.goal;
  const lengths = new Map<string, number>();
  const offsets = new Map<string, Vec3>();
  const rests = new Map<string, Matrix3>();
  for (const id of ids) {
    const member = byId.get(id)!;
    const offset = readPivotOffset3d(member.offset);
    lengths.set(id, segmentExtent(readNumber(member.length)));
    offsets.set(id, [offset.x, offset.y, offset.z]);
    rests.set(id, matrixFromEuler3d(member.rest));
  }
  const lengthOf = (id: string): number => lengths.get(id)!;
  const offsetOf = (id: string): Vec3 => offsets.get(id)!;
  const addressed = leaves.filter((id) => goalOf(id) !== undefined);
  const inner = ids.find((id) => (childCount.get(id) ?? 0) > 0 && goalOf(id) !== undefined);
  if (inner !== undefined)
    throw new Error(`Solver goal on member "${inner}" is not on a leaf of the chain.`);
  const pulls = branchPulls(byId, addressed);
  const rootMatrix = matrixFromEuler3d(root);
  const rootPoint: Vec3 = [root.x, root.y, root.z];
  const tips = new Map<string, Vec3>();
  const pivots = new Map<string, Vec3>();
  const frames = new Map<string, Matrix3>();
  const parentFrame = (id: string): Matrix3 => {
    const base = baseOf(id);
    return isMember(base) ? frames.get(base)! : rootMatrix;
  };
  const originOf = (id: string): Vec3 => {
    const base = baseOf(id);
    return isMember(base) ? tips.get(base)! : rootPoint;
  };
  const pathOf = (leaf: string): readonly string[] => {
    const path: string[] = [];
    for (let cursor = leaf; isMember(cursor); cursor = baseOf(cursor)) path.unshift(cursor);
    return path;
  };

  const readings = new Map<string, GoalReading>();
  const aims = new Map<string, Vec3>();
  for (const leaf of addressed) {
    const goal = goalOf(leaf)!;
    const reading = readGoal(leaf, [
      ["x", goal.x],
      ["y", goal.y],
      ["z", goal.z],
    ]);
    const reach = (): number =>
      pathOf(leaf).reduce((sum, id) => sum + lengthOf(id) + norm3(offsetOf(id)), 0);
    const [x, y, z] = aimPoint(reading, rootPoint, reach);
    readings.set(leaf, reading);
    aims.set(leaf, [x!, y!, z!]);
  }
  // Seeded one addressed path at a time in canonical leaf order; a shared member takes the first
  // path's point, and the first outward pass enforces every length.
  for (const leaf of addressed) {
    const aim = aims.get(leaf)!;
    const toAim = subtract3(aim, rootPoint);
    const { e1, e2 } = bendBasis3d(rootMatrix, toAim, norm3(toAim), rootPoint, pole);
    const path = pathOf(leaf);
    const across = flip ? scale3(e2, -1) : e2;
    const seeded = seedArc3d(rootPoint, aim, path.map(lengthOf), e1, across);
    path.forEach((id, index) => {
      if (!tips.has(id)) tips.set(id, seeded[index]!);
    });
  }
  // A member on no addressed path lies straight out along the root's own +x.
  const rootX = axisX3(rootMatrix);
  for (const id of ids)
    if (!tips.has(id)) tips.set(id, add3(originOf(id), scale3(rootX, lengthOf(id))));

  /**
   * The outward pass: the only place lengths are enforced and the only place a frame is built, in
   * canonical depth order, so each member reads its base's final frame and tip. It is `fk3d`'s own
   * composition over the current tip guesses, with the orientation reconstructed by the minimal
   * swing from the member's rest frame; a zero-length member keeps its rest frame, which is what it
   * composes, and its children hang where the solve put them.
   */
  const outward = (): void => {
    for (const id of ids) {
      const parent = parentFrame(id);
      const origin = originOf(id);
      const offset = offsetOf(id);
      const pivot = isZeroOffset(offset) ? origin : add3(origin, multiplyVector3(parent, offset));
      const length = lengthOf(id);
      const tip = place3d(pivot, tips.get(id)!, length);
      const rest = multiplyMatrix3(parent, rests.get(id)!);
      pivots.set(id, pivot);
      tips.set(id, tip);
      frames.set(id, length > 0 ? swingFrame3d(rest, subtract3(tip, pivot)) : rest);
    }
  };
  const residualNow = (): number => {
    let worst = 0;
    for (const leaf of addressed)
      worst = Math.max(worst, norm3(subtract3(tips.get(leaf)!, aims.get(leaf)!)));
    return worst;
  };

  outward();
  const cap = fabrikIterationCap(serialDepth());
  let iterations = 0;
  let residual = residualNow();
  let stalled = false;
  let spread = 0;
  while (residual > FABRIK_TOLERANCE && iterations < cap) {
    iterations += 1;
    spread = 0;
    const before = new Map(tips);
    const proposals = new Map<string, Pull3d[]>();
    for (const leaf of addressed)
      proposals.set(leaf, [{ kind: "goal", point: aims.get(leaf)!, weight: 1 }]);
    for (let index = ids.length - 1; index >= 0; index -= 1) {
      const id = ids[index]!;
      const proposed = proposals.get(id) ?? [];
      if (proposed.length > 0) {
        const settled = compromise3d(proposed, rule);
        spread = Math.max(spread, settled.spread);
        tips.set(id, settled.point);
      }
      const base = baseOf(id);
      // The root is the one point a solve may not move, so a proposal for it is dropped.
      if (!isMember(base)) continue;
      const tip = tips.get(id)!;
      const pivot = place3d(tip, pivots.get(id)!, lengthOf(id));
      const offset = offsetOf(id);
      const shift = isZeroOffset(offset) ? offset : multiplyVector3(frames.get(base)!, offset);
      const list = proposals.get(base) ?? [];
      list.push({
        kind: "branch",
        point: subtract3(pivot, shift),
        weight: pulls.get(id)!,
        reach: { centre: subtract3(tip, shift), radius: lengthOf(id) },
      });
      proposals.set(base, list);
    }
    outward();
    residual = residualNow();
    let moved = 0;
    for (const id of ids) {
      const was = before.get(id)!;
      const now = tips.get(id)!;
      moved = Math.max(
        moved,
        Math.abs(was[0] - now[0]),
        Math.abs(was[1] - now[1]),
        Math.abs(was[2] - now[2]),
      );
    }
    if (moved === 0) {
      stalled = true;
      break;
    }
  }

  const rotations3d: Record<string, Euler3d> = {};
  const solvedPivots: Record<string, Vec3> = {};
  const solvedTips: Record<string, Vec3> = {};
  const residuals: Record<string, number> = {};
  for (const leaf of addressed) residuals[leaf] = goalMiss(readings.get(leaf)!, tips.get(leaf)!);
  for (const id of ids) {
    const local = multiplyMatrix3(transposeMatrix3(parentFrame(id)), frames.get(id)!);
    rotations3d[id] = Object.freeze(eulerFromMatrix3d(local));
    solvedPivots[id] = frozen(pivots.get(id)!);
    solvedTips[id] = frozen(tips.get(id)!);
  }
  let worst = residual;
  for (const leaf of addressed) worst = Math.max(worst, residuals[leaf]!);
  const quality = iterativeQuality({ residual: worst, iterations, atBound: [], spread, stalled });
  return Object.freeze({
    rotations3d: Object.freeze(rotations3d),
    residuals: Object.freeze(residuals),
    pivots: Object.freeze(solvedPivots),
    tips: Object.freeze(solvedTips),
    quality: Object.freeze(quality),
  });
}

/**
 * The tree solve at one magnitude: the authored-side attempt, and the three alternatives only for a
 * conflicted baseline, through the 2D selector unchanged (#490).
 */
function selectTree3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
): SolveResult3d<IterativeQuality> {
  const { rotations3d, residuals, quality } = selectFabrik(
    root,
    members,
    false,
    (frame: WorldFrame3d, chain: readonly ChainMember3d[], flip: boolean, rule: CompromiseRule) =>
      solveTree3dAttempt(frame, chain, pole, flip, rule),
  );
  return Object.freeze({ rotations3d, residuals, quality });
}

/** A member's image under `factor`: every world-unit field scaled, orientation carried. */
function scaleMember(member: ChainMember3d, factor: number): ChainMember3d {
  const { goal } = member;
  return {
    ...member,
    length: readNumber(member.length) * factor,
    offset: scaleOffset3d(readPivotOffset3d(member.offset), factor),
    ...(goal === undefined ? {} : { goal: scaleFrame3d(goal, factor) }),
  };
}

/**
 * The 3D tree solve, total over finite rigs at the 2D magnitude policy.
 *
 * `ik-scale.ts` decides from every world-unit magnitude the solve reads (the root, each member's
 * length and offset, each goal, and a bound pole) whether it runs natively or as its exact
 * power-of-two image, whose angles are the rig's because the solve is scale-free; residuals are
 * restored through `restoreResult3d`. `pivots` and `tips` stay behind, as they do in 2D, so the
 * result's shape does not depend on the strategy.
 */
export function solveTree3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d,
): SolveResult3d<IterativeQuality> {
  const pole = rereadPole3d(bend);
  const magnitudes = [root.x, root.y, root.z, ...poleMagnitudes(pole)];
  for (const member of members) {
    const offset = readPivotOffset3d(member.offset);
    magnitudes.push(readNumber(member.length), offset.x, offset.y, offset.z);
    if (member.goal !== undefined) magnitudes.push(member.goal.x, member.goal.y, member.goal.z);
  }
  const magnitude = magnitudeOf(magnitudes);
  switch (magnitude.kind) {
    case "native":
      return selectTree3d(root, members, pole);
    case "rescaled": {
      const factor = 2 ** -magnitude.exponent;
      const image = selectTree3d(
        scaleFrame3d(root, factor),
        members.map((member) => scaleMember(member, factor)),
        scalePole(pole, factor),
      );
      return restoreResult3d(image, magnitude.exponent);
    }
    default:
      return unreachable(magnitude);
  }
}
