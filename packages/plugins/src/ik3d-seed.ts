import { unreachable } from "@motion5/core/plugin-api";
import {
  arcHalfAngle,
  CENTRE_LEGAL_SEED,
  DEFAULT_FABRIK_SEED,
  legalFraction,
  type FabrikSeed,
  type LegalSeed,
} from "./fabrik-seed";
import { legalRotation, rotationSide, turnRotation } from "./ik-constraint";
import { descendLegally, type DofBound, type LegalDescent } from "./ik-descent";
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
import {
  constrains,
  leavesHingePose,
  legalLocal3d,
  limitLocal3d,
  type JointLimit3d,
} from "./ik3d-constraint";

/**
 * 3D FABRIK seed: each tip before the outward pass. Arc when every hinge pose survives,
 * else legal seed, legal by construction. Pure in tree, pole, `flip`; flip = half turn. */

/** `parent` index of a member hanging from the root. */
export const ROOT_INDEX = -1;

/**
 * Chain as the 3D attempt reads it, canonical order (base before member); `paths` addressed
 * root-to-leaf; `offsets` `undefined` = zero shift; `aims` one per path. */
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

/** Which seed a tree takes; `legal` when the arc needs a hinge-pose projection. */
export type TreeSeed3d = { readonly kind: "arc" } | { readonly kind: "legal" };

const ARC_SEED: TreeSeed3d = Object.freeze({ kind: "arc" });
const LEGAL_SEED: TreeSeed3d = Object.freeze({ kind: "legal" });

/** `seedArc` with two axis vectors; planar rigs seed the same points. `lengths` clamped. */
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

/** First path wins a shared member; unaddressed members continue along the root +x. */
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

/** `legal` when composing `arc` as the outward pass does leaves a hinge off its legal pose. */
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
    if (leavesHingePose(limits[index]!, multiplyMatrix3(transposeMatrix3(frame), swung)))
      return LEGAL_SEED;
  }
  return ARC_SEED;
}

/** Seed kind for the arc the default, unflipped attempt would use. */
export function defaultTreeSeed3d(tree: SeedTree3d, pole: Pole3d): TreeSeed3d {
  return treeSeed3d(tree, arcTips(tree, pole, false));
}

/** Legal start: limits centred, free members turn subtree mean tip onto mean aim. */
function legalTips(tree: SeedTree3d, flip: boolean, start: LegalSeed): Vec3[] {
  const fraction = legalFraction(start);
  const { rootPoint, rootMatrix, parent, lengths, offsets, rests, limits, paths, aims } = tree;
  const count = lengths.length;
  // Collapsed member has no tip direction: project its rest as the outward pass does.
  const locals = limits.map((limit, index) => {
    const rest = rests[index]!;
    if (lengths[index]! > 0) return legalLocal3d(limit, rest, fraction);
    const projected = limitLocal3d(limit, () => rest);
    return projected.kind === "moved" ? projected.local : rest;
  });
  const frames = new Array<Matrix3>(count);
  const pivots = new Array<Vec3>(count);
  const tips = new Array<Vec3>(count);
  const compose = (from: number, orientations: readonly Matrix3[] = locals): void => {
    for (let index = from; index < count; index += 1) {
      const base = parent[index]!;
      const frame = base === ROOT_INDEX ? rootMatrix : frames[base]!;
      const origin = base === ROOT_INDEX ? rootPoint : tips[base]!;
      const shift = offsets[index];
      const pivot = shift === undefined ? origin : add3(origin, multiplyVector3(frame, shift));
      const solved = multiplyMatrix3(frame, orientations[index]!);
      pivots[index] = pivot;
      frames[index] = solved;
      tips[index] = add3(pivot, scale3(axisX3(solved), lengths[index]!));
    }
  };
  compose(0);
  // Path steps holding each member; `turnedAbove` gates the flip to a topmost member.
  const below: number[][] = Array.from({ length: count }, () => []);
  paths.forEach((path, step) => path.forEach((index) => below[index]!.push(step)));
  const turnedAbove = new Array<boolean>(count).fill(false);
  for (let index = 0; index < count; index += 1) {
    const base = parent[index]!;
    const inherited = base !== ROOT_INDEX && turnedAbove[base]!;
    const steps = below[index]!;
    turnedAbove[index] = inherited;
    if (constrains(limits[index]!) || lengths[index] === 0 || steps.length === 0) continue;
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
    // Minimal rotation `from` to `to`: swing a frame onto `from`, then onto `to`.
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
  switch (start.kind) {
    case "legal-range":
      return tips;
    case "legal-descent": {
      const moving = new Array<boolean>(count);
      for (let index = 0; index < count; index += 1)
        moving[index] = lengths[index]! > 0 && below[index]!.length > 0;
      const walk = descentOf(tree, moving, (orientations) => {
        compose(0, orientations);
        return tips;
      });
      compose(0, descendLegally(walk.problem, walk.start(locals, fraction)).locals);
      return tips;
    }
    default:
      return unreachable(start);
  }
}

/** Descent view: local orientations plus hinge angles, so a range reads in its own angle. */
interface DescentPose3d {
  readonly locals: readonly Matrix3[];
  readonly angles: readonly number[];
}

/** One walk angle: a hinge's own angle, or a member's tilt about a local axis. */
type Dof3d =
  | {
      readonly kind: "hinge";
      readonly index: number;
      readonly limit: Extract<JointLimit3d, { kind: "hinge" }>;
    }
  | { readonly kind: "tilt"; readonly index: number; readonly about: Vec3 };

const LOCAL_Y3: Vec3 = Object.freeze([0, 1, 0] as const);
const LOCAL_Z3: Vec3 = Object.freeze([0, 0, 1] as const);

function descentOf(
  tree: SeedTree3d,
  moving: readonly boolean[],
  tipsOf: (locals: readonly Matrix3[]) => readonly Vec3[],
): {
  readonly problem: LegalDescent<DescentPose3d>;
  readonly start: (locals: readonly Matrix3[], fraction: number) => DescentPose3d;
} {
  const { rests, limits, paths, aims } = tree;
  const dofs: Dof3d[] = [];
  limits.forEach((limit, index) => {
    if (!moving[index]) return;
    switch (limit.kind) {
      case "hinge":
        dofs.push({ kind: "hinge", index, limit });
        return;
      case "free":
      case "cone":
      case "swing-twist":
        dofs.push(
          { kind: "tilt", index, about: LOCAL_Y3 },
          { kind: "tilt", index, about: LOCAL_Z3 },
        );
        return;
      default:
        return unreachable(limit);
    }
  });
  const rebuild = (index: number, proposal: Matrix3): Matrix3 => {
    const swung = swingFrame3d(rests[index]!, axisX3(proposal));
    const limited = limitLocal3d(limits[index]!, () => swung);
    return limited.kind === "moved" ? limited.local : swung;
  };
  const problem: LegalDescent<DescentPose3d> = {
    dofs: dofs.length,
    width: 3,
    reach: Math.max(
      0,
      ...paths.map((path) =>
        path.reduce((extent, index) => {
          const shift = tree.offsets[index];
          return extent + tree.lengths[index]! + (shift === undefined ? 0 : norm3(shift));
        }, 0),
      ),
    ),
    misses: ({ locals }) => {
      const tips = tipsOf(locals);
      return paths.flatMap((path, step) => subtract3(tips[path[path.length - 1]!]!, aims[step]!));
    },
    turn: ({ locals, angles }, degrees) => {
      const nextLocals = [...locals];
      const nextAngles = [...angles];
      const tilted = new Set<number>();
      dofs.forEach((dof, at) => {
        const turn = degrees[at]!;
        switch (dof.kind) {
          case "hinge":
            nextAngles[dof.index] = turnRotation(dof.limit.range, angles[dof.index]!, turn);
            nextLocals[dof.index] = rotationAboutAxis3d(dof.limit.axis, nextAngles[dof.index]!);
            return;
          case "tilt":
            if (turn === 0) return;
            nextLocals[dof.index] = multiplyMatrix3(
              nextLocals[dof.index]!,
              rotationAboutAxis3d(dof.about, turn),
            );
            tilted.add(dof.index);
            return;
          default:
            return unreachable(dof);
        }
      });
      for (const index of tilted) nextLocals[index] = rebuild(index, nextLocals[index]!);
      return { locals: nextLocals, angles: nextAngles };
    },
    bound: ({ angles }, at): DofBound => {
      const dof = dofs[at]!;
      switch (dof.kind) {
        case "hinge":
          return rotationSide(dof.limit.range, angles[dof.index]!);
        case "tilt":
          return "interior";
        default:
          return unreachable(dof);
      }
    },
  };
  const start = (locals: readonly Matrix3[], fraction: number): DescentPose3d => ({
    // Tilted member starts as the outward pass composes it, so the walk stays smooth.
    locals: locals.map((local, index) =>
      moving[index] && limits[index]!.kind !== "hinge" ? rebuild(index, local) : local,
    ),
    angles: limits.map((limit) =>
      limit.kind === "hinge" ? legalRotation(limit.range, fraction) : 0,
    ),
  });
  return { problem, start };
}

/** Every member's tip for one attempt from `flip`'s side: arc when legal, else legal seed. */
export function seedTree3d(
  tree: SeedTree3d,
  pole: Pole3d,
  flip: boolean,
  policy: FabrikSeed = DEFAULT_FABRIK_SEED,
): Vec3[] {
  switch (policy.kind) {
    case "legal-range":
    case "legal-descent":
      return legalTips(tree, flip, policy);
    case "default":
      break;
    default:
      return unreachable(policy);
  }
  const arc = arcTips(tree, pole, flip);
  const seed = treeSeed3d(tree, arc);
  switch (seed.kind) {
    case "arc":
      return arc;
    case "legal":
      return legalTips(tree, flip, CENTRE_LEGAL_SEED);
    default:
      return unreachable(seed);
  }
}
