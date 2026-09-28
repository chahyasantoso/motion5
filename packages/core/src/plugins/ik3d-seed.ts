import { unreachable } from "../lang/exhaustive";
import { arcHalfAngle } from "./fabrik-seed";
import {
  add3,
  axisX3,
  multiplyMatrix3,
  multiplyVector3,
  norm3,
  normalize3,
  rotationAboutAxis3d,
  scale3,
  subtract3,
  swingFrame3d,
  transposeMatrix3,
  type Matrix3,
  type Vec3,
} from "./frame3d";
import { bendBasis3d, type Pole3d } from "./ik3d-analytic";
import { centreLocal3d, constrains, leavesHingeCircle, type JointLimit3d } from "./ik3d-constraint";

/**
 * The 3D FABRIK seed: where every member's tip starts before the first outward pass, and the one
 * owner of that question for the 3D tree solve (issue #523, ADR-129).
 *
 * Two seeds, a closed union read exhaustively (`TreeSeed3d`). The **arc** is the 2D seed's
 * constant-curvature arc in the closed form's bend plane (ADR-118, ADR-122); it is kept whenever it
 * is a legal pose for every hinge's plane, which is every planar +z rig, so those rigs seed, solve
 * and publish exactly the bytes they did and stay in agreement with 2D. The **legal** seed is taken
 * when the arc would point some hinge's member off the circle its axis sweeps: that arc is not a
 * pose the chain can hold, both of its mirrored sides are illegal, and the first outward pass would
 * spend itself projecting the seed instead of exploring legal poses. The legal seed is built in
 * joint space rather than point space: every limited member sits at the centre of its legal set
 * (`centreLocal3d`), and every free member on an addressed path turns its subtree so the mean of
 * the subtree's addressed tips points at the mean of their aims. It is legal by construction, so
 * the first outward pass re-derives it rather than repairs it.
 *
 * `flip` is the same geometric act for both seeds. Mirroring the arc across the line to its goal
 * is a half turn about that line, so the legal seed's opposite side is the half turn of each
 * topmost aimed free member's subtree about the line from its pivot to its aim: legal, because
 * only a free member turns. A rig whose addressed paths hold no free member has one legal seed, and
 * its flip reproduces it.
 *
 * The seed is a pure function of the tree, the pole and `flip`, with a fixed amount of arithmetic,
 * so a solve stays reproducible (ADR-111).
 */

/** The index `parent` holds for a member that hangs from the root rather than from a member. */
export const ROOT_INDEX = -1;

/**
 * The chain as the 3D attempt reads it, indexed by canonical position, so a member's base always
 * sits at a smaller index. `offsets` holds `undefined` for a zero offset. `paths` are the
 * addressed root-to-leaf paths in canonical leaf order and `aims` their goals' aim points, one per
 * path.
 */
export interface SeedTree3d {
  readonly rootPoint: Vec3;
  readonly rootMatrix: Matrix3;
  readonly parent: readonly number[];
  readonly lengths: readonly number[];
  readonly offsets: readonly (Vec3 | undefined)[];
  readonly rests: readonly Matrix3[];
  readonly limits: readonly JointLimit3d[];
  readonly paths: readonly (readonly number[])[];
  readonly aims: readonly Vec3[];
}

/** Which seed a tree takes; `legal` exactly when the arc leaves some hinge's plane. */
export type TreeSeed3d = { readonly kind: "arc" } | { readonly kind: "legal" };

const ARC_SEED: TreeSeed3d = Object.freeze({ kind: "arc" });
const LEGAL_SEED: TreeSeed3d = Object.freeze({ kind: "legal" });

/**
 * The seed for one root-to-leaf path: the joints of a constant-curvature arc from `origin` to
 * `goal` exactly as long as the path, in the plane spanned by `along` (toward the goal) and
 * `across` (the side it bulges to). The 2D `seedArc` arithmetic with its two axes replaced by
 * vectors, and the same `arcHalfAngle` bisection, so a planar rig seeds the same points. `lengths`
 * are already clamped through `segmentExtent`.
 */
function seedArc3d(
  origin: Vec3,
  goal: Vec3,
  lengths: readonly number[],
  along: Vec3,
  across: Vec3,
): readonly Vec3[] {
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const chord = norm3(subtract3(goal, origin));
  const halfAngle = total > 0 && chord < total ? arcHalfAngle(chord / total) : 0;
  const radius = halfAngle > 0 ? total / (2 * halfAngle) : 0;
  const points: Vec3[] = [];
  let travelled = 0;
  for (const length of lengths) {
    travelled += length;
    const fraction = total > 0 ? travelled / total : 1;
    const angle = -halfAngle + 2 * halfAngle * fraction;
    const axial = halfAngle > 0 ? chord / 2 + radius * Math.sin(angle) : fraction * chord;
    const lateral = halfAngle > 0 ? radius * (Math.cos(angle) - Math.cos(halfAngle)) : 0;
    points.push(add3(origin, add3(scale3(along, axial), scale3(across, lateral))));
  }
  return points;
}

/**
 * The arc seed for the whole tree: each addressed path on its arc in the bend plane toward the
 * pole (`bendBasis3d`, the one owner of the pole rule), one path at a time in canonical leaf
 * order, a shared member taking the first path's point; a member on no addressed path lies
 * straight out along the root's own +x. The first outward pass enforces every length.
 */
function arcTips(tree: SeedTree3d, pole: Pole3d, flip: boolean): Vec3[] {
  const { rootPoint, rootMatrix, parent, lengths, paths, aims } = tree;
  const tips = new Array<Vec3 | undefined>(lengths.length);
  paths.forEach((path, step) => {
    const aim = aims[step]!;
    const toAim = subtract3(aim, rootPoint);
    const { e1, e2 } = bendBasis3d(rootMatrix, toAim, norm3(toAim), rootPoint, pole);
    const across = flip ? scale3(e2, -1) : e2;
    const seeded = seedArc3d(
      rootPoint,
      aim,
      path.map((index) => lengths[index]!),
      e1,
      across,
    );
    path.forEach((index, at) => {
      if (tips[index] === undefined) tips[index] = seeded[at]!;
    });
  });
  const rootX = axisX3(rootMatrix);
  for (let index = 0; index < tips.length; index += 1)
    if (tips[index] === undefined) {
      const base = parent[index]!;
      const origin = base === ROOT_INDEX ? rootPoint : tips[base]!;
      tips[index] = add3(origin, scale3(rootX, lengths[index]!));
    }
  return tips as Vec3[];
}

/**
 * Which seed the tree takes: `legal` when composing the arc the way the outward pass composes a
 * pose (each member's rest frame under its base, swung onto its seeded direction) points some
 * hinge's member off its axis's circle (`leavesHingeCircle`), otherwise `arc`.
 *
 * Only a hinge's plane is read. A range, a cone's swing or a twist the arc exceeds is a bound the
 * pose can be projected onto without leaving the plane the seed chose, the question issue #524
 * owns, so it does not change the seed here.
 */
export function treeSeed3d(tree: SeedTree3d, arc: readonly Vec3[]): TreeSeed3d {
  const { rootPoint, rootMatrix, parent, lengths, offsets, rests, limits } = tree;
  const frames = new Array<Matrix3>(lengths.length);
  for (let index = 0; index < lengths.length; index += 1) {
    const base = parent[index]!;
    const frame = base === ROOT_INDEX ? rootMatrix : frames[base]!;
    const origin = base === ROOT_INDEX ? rootPoint : arc[base]!;
    const shift = offsets[index];
    const pivot = shift === undefined ? origin : add3(origin, multiplyVector3(frame, shift));
    const rest = multiplyMatrix3(frame, rests[index]!);
    const swung = lengths[index]! > 0 ? swingFrame3d(rest, subtract3(arc[index]!, pivot)) : rest;
    frames[index] = swung;
    if (leavesHingeCircle(limits[index]!, multiplyMatrix3(transposeMatrix3(frame), swung)))
      return LEGAL_SEED;
  }
  return ARC_SEED;
}

/**
 * The legal seed (see the module docblock). Built as `fk3d` composes: each member's pivot is its
 * base's tip plus its offset in the base's frame, its frame the base's frame times its local
 * orientation, and its tip `length` along that frame's +x. Limited members hold their limit's
 * centre; each free member with an addressed leaf below it is then turned, in canonical order so
 * an ancestor turns first, by the minimal rotation that points its subtree's mean addressed tip at
 * the mean of those aims, and on the opposite side a topmost such member is also half-turned about
 * that line. Only the members at and after a turned member are recomposed.
 */
function legalTips(tree: SeedTree3d, flip: boolean): Vec3[] {
  const { rootPoint, rootMatrix, parent, lengths, offsets, rests, limits, paths, aims } = tree;
  const count = lengths.length;
  const locals = limits.map((limit, index) => centreLocal3d(limit, rests[index]!));
  const frames = new Array<Matrix3>(count);
  const pivots = new Array<Vec3>(count);
  const tips = new Array<Vec3>(count);
  const compose = (from: number): void => {
    for (let index = from; index < count; index += 1) {
      const base = parent[index]!;
      const frame = base === ROOT_INDEX ? rootMatrix : frames[base]!;
      const origin = base === ROOT_INDEX ? rootPoint : tips[base]!;
      const shift = offsets[index];
      const pivot = shift === undefined ? origin : add3(origin, multiplyVector3(frame, shift));
      const solved = multiplyMatrix3(frame, locals[index]!);
      pivots[index] = pivot;
      frames[index] = solved;
      tips[index] = add3(pivot, scale3(axisX3(solved), lengths[index]!));
    }
  };
  compose(0);
  // The addressed paths each member lies on, and whether an ancestor is an aimed free member.
  const below: number[][] = Array.from({ length: count }, () => []);
  paths.forEach((path, step) => path.forEach((index) => below[index]!.push(step)));
  const turnedAbove = new Array<boolean>(count).fill(false);
  for (let index = 0; index < count; index += 1) {
    const base = parent[index]!;
    const inherited = base !== ROOT_INDEX && turnedAbove[base]!;
    const steps = below[index]!;
    turnedAbove[index] = inherited;
    if (constrains(limits[index]!) || steps.length === 0) continue;
    let tipSum: Vec3 = [0, 0, 0];
    let aimSum: Vec3 = [0, 0, 0];
    for (const step of steps) {
      const path = paths[step]!;
      tipSum = add3(tipSum, tips[path[path.length - 1]!]!);
      aimSum = add3(aimSum, aims[step]!);
    }
    const pivot = pivots[index]!;
    const from = subtract3(scale3(tipSum, 1 / steps.length), pivot);
    const to = subtract3(scale3(aimSum, 1 / steps.length), pivot);
    // The minimal rotation taking `from` to `to`: a frame swung onto `from`, then onto `to`.
    const onFrom = swingFrame3d(frames[index]!, from);
    let turn = multiplyMatrix3(swingFrame3d(onFrom, to), transposeMatrix3(onFrom));
    if (flip && !inherited)
      turn = multiplyMatrix3(
        rotationAboutAxis3d(normalize3(to, axisX3(frames[index]!)), 180),
        turn,
      );
    const base3 = base === ROOT_INDEX ? rootMatrix : frames[base]!;
    locals[index] = multiplyMatrix3(transposeMatrix3(base3), multiplyMatrix3(turn, frames[index]!));
    turnedAbove[index] = true;
    compose(index);
  }
  return tips;
}

/**
 * Every member's seeded tip for one attempt, from `flip`'s side: the arc when it is legal for
 * every hinge's plane, else the legal seed (`treeSeed3d`). A fresh array the attempt owns.
 */
export function seedTree3d(tree: SeedTree3d, pole: Pole3d, flip: boolean): Vec3[] {
  const arc = arcTips(tree, pole, flip);
  const seed = treeSeed3d(tree, arc);
  switch (seed.kind) {
    case "arc":
      return arc;
    case "legal":
      return legalTips(tree, flip);
    default:
      return unreachable(seed);
  }
}
