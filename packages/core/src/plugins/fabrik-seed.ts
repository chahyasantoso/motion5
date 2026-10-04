import { unreachable } from "../plugin-api";
import { pivotFromBaseTip, segmentExtent, type WorldFrame, type WorldPoint } from "./frame";
import {
  FREE_JOINT,
  legalRotation,
  limitRotation,
  rotationSide,
  turnRotation,
  wrapRotation,
} from "./ik-constraint";
import { descendLegally, type LegalDescent } from "./ik-descent";
import { solveLength, solveOffset, type SolveMember } from "./ik-member";

/**
 * The FABRIK seed: the constant-curvature arc every iterative solve starts from, and the only owner
 * of its geometry.
 *
 * Its own module rather than a section of `fabrik.ts`, because the seed is a question the iteration
 * does not answer: which way the chain bends before the first pass. The 2D solve seeds each path
 * with `seedArc`, and the 3D tree solve's `seedArc3d` is the same arithmetic with vector axes over
 * the same `arcHalfAngle`, so a planar rig seeds the same points in both dimensions from one
 * bisection. Moved here unchanged from `fabrik.ts` when issue #514 took that file past its read
 * budget (docs/AI-EDIT-WORKFLOW.md); every double it produces is the one it produced there.
 */

const RADIANS = Math.PI / 180;

/**
 * Where a legal joint-space start holds each limited member within its range: the centre (#524,
 * ADR-131), or one of the staged fractions a near miss on a non-planar 3D hinge pays for (#527,
 * ADR-130).
 */
export type LegalSeedFraction = 0.1 | 0.25 | 0.5 | 0.75 | 0.9;

/**
 * Which start one FABRIK attempt takes: the default seed (the arc, or in 3D the centred legal seed
 * where the arc is illegal), a legal joint-space start at `fraction` of every range, or the legal
 * centre walked toward the aims by a bounded joint-space descent (`ik-descent.ts`, ADR-132). The
 * selector chooses which of them a solve pays for; each dimension's attempt reads the union
 * exhaustively, the 2D one through `seedLegal` below and the 3D one through `ik3d-seed.ts`.
 */
export type FabrikSeed =
  | { readonly kind: "default" }
  | { readonly kind: "legal-range"; readonly fraction: LegalSeedFraction }
  | { readonly kind: "legal-descent" };

/** The starts built in joint space and legal by construction: every seed but the arc. */
export type LegalSeed = Exclude<FabrikSeed, { readonly kind: "default" }>;

/**
 * Whether an attempt holds its seeded pose, after the first outward pass enforced every length and
 * limit, as its first incumbent (ADR-128, ADR-132). Only the descent's: its end pose is the best a
 * monotone legal walk found, and a FABRIK pass that wanders to a worse fixed point must not replace
 * it. The arc and a fixed legal fraction are guesses about a basin, never offered, as before.
 */
export function heldFromSeed(seed: FabrikSeed): boolean {
  switch (seed.kind) {
    case "default":
    case "legal-range":
      return false;
    case "legal-descent":
      return true;
    default:
      return unreachable(seed);
  }
}

export const DEFAULT_FABRIK_SEED: FabrikSeed = Object.freeze({ kind: "default" });

/** Every limited member at its range's centre (#524, ADR-131): legal for every range. */
export const CENTRE_LEGAL_SEED: LegalSeed = Object.freeze({ kind: "legal-range", fraction: 0.5 });

/** Bisection steps for the seed's arc half-angle. A fixed count, so the seed is reproducible. */
export const FABRIK_ARC_BISECTIONS = 60;

/**
 * The half-angle of the circular arc whose length is one and whose chord is `ratio`.
 *
 * `sin(theta) / theta` decreases strictly on `(0, pi]`, from one at a straight chord to zero at a
 * folded one, so bisection is total here: no derivative, no seed guess, and no failure branch. A
 * fixed step count rather than a convergence test is what makes the seed reproducible: two calls
 * with one ratio return the same double, which is what lets the whole solve be asserted as a pure
 * function.
 */
export function arcHalfAngle(ratio: number): number {
  let low = 0;
  let high = Math.PI;
  for (let step = 0; step < FABRIK_ARC_BISECTIONS; step += 1) {
    const middle = (low + high) / 2;
    if (Math.sin(middle) / middle > ratio) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

/**
 * The seed pose for one root-to-leaf path: the joints of a constant-curvature arc that leaves the
 * root, arrives at the goal, and is exactly as long as the chain.
 *
 * Derived, never authored. Reviving a member's authored `rotation` as the seed was rejected for a
 * reason that outlives this function: that key is dead at arity two, where the solve owns rotation
 * outright, so reading it at arity three would leave one authored key live or dead depending on how
 * many bones its neighbours happen to have.
 *
 * An arc rather than a straight line, because FABRIK cannot leave one. With every joint colinear,
 * both passes move along that line, so the chain slides but never bends: a straight seed is a fixed
 * point for a goal on the line and converges from the wrong side for a goal off it. The bulge is
 * the geometric slack made symmetric. It is zero at both ends by construction, largest in the
 * middle, and vanishes exactly at full extension, which is the one pose where colinear is the
 * answer rather than the trap.
 *
 * `flip` mirrors the bulge across the root-to-goal line, so it selects the same two configurations
 * the closed form's `flip` selects and both branches can be held to the analytic numbers.
 *
 * The points honour the arc, not the lengths: `solveFabrik` enforces lengths outward immediately,
 * so a seed's only job is to say which way the chain bends. That is also why it is handed segment
 * lengths and no offsets. A seed that modelled the offsets would be a better guess and a second
 * geometry to keep in step with the composition, and the first outward pass overwrites every point
 * it produces.
 */
export function seedArc(
  root: WorldFrame,
  goal: WorldPoint,
  lengths: readonly number[],
  flip = false,
): readonly WorldPoint[] {
  const total = lengths.reduce((sum, length) => sum + segmentExtent(length), 0);
  const chord = Math.hypot(goal.x - root.x, goal.y - root.y);
  // A goal on the root leaves no direction to read, so the root's own rotation is the axis. The
  // chain still folds out and back along it rather than collapsing, because an arc at a zero chord
  // is a half turn.
  const alongX = chord > 0 ? (goal.x - root.x) / chord : Math.cos(root.rotation * RADIANS);
  const alongY = chord > 0 ? (goal.y - root.y) / chord : Math.sin(root.rotation * RADIANS);
  const side = flip ? -1 : 1;
  const acrossX = -alongY * side;
  const acrossY = alongX * side;
  const halfAngle = total > 0 && chord < total ? arcHalfAngle(chord / total) : 0;
  const radius = halfAngle > 0 ? total / (2 * halfAngle) : 0;
  const points: WorldPoint[] = [];
  let travelled = 0;
  for (const length of lengths) {
    travelled += segmentExtent(length);
    const fraction = total > 0 ? travelled / total : 1;
    const angle = -halfAngle + 2 * halfAngle * fraction;
    const axial = halfAngle > 0 ? chord / 2 + radius * Math.sin(angle) : fraction * chord;
    const lateral = halfAngle > 0 ? radius * (Math.cos(angle) - Math.cos(halfAngle)) : 0;
    points.push(
      Object.freeze({
        x: root.x + alongX * axial + acrossX * lateral,
        y: root.y + alongY * axial + acrossY * lateral,
      }),
    );
  }
  return Object.freeze(points);
}

/**
 * The 2D legal seed: every member's tip for a start that is legal in joint space by construction,
 * the planar image of the 3D legal seed (`ik3d-seed.ts`), so a planar rig starts from the same pose
 * in both dimensions (issue #524, ADR-131).
 *
 * Built as `fk` composes, over `ids` in canonical order so a base is placed before its members:
 * each member's pivot is its base's tip moved by its offset in the base's direction, its direction
 * the base's plus its local angle, and its tip its length along that direction. A limited member
 * holds `legalRotation` at `fraction` of its range. Each free member on an addressed path is then
 * turned, ancestors first, by the angle that points the mean of its subtree's addressed tips at the
 * mean of their aims, and only it and the members after it are recomposed. Only a free member
 * turns, so the pose stays legal; `solveFabrik` offers it only to a rig with a limited member,
 * because a free rig's legal seed is a straight line, the one start FABRIK cannot bend out of.
 *
 * It takes no `flip`. The 3D legal seed's opposite side is a half turn of a free subtree out of
 * the plane, which the plane cannot express, and its in-plane mirror negates every limited angle
 * below it, which is not legal; the arc's opposite side is already the selector's other
 * alternative. The arithmetic is fixed for a given rig, so the seed is reproducible (ADR-111).
 *
 * `legal-descent` starts from the centre and walks it toward the aims (`descendLegally`) until the
 * worst miss is inside `LEGAL_DESCENT_TOLERANCE`: one degree of freedom per member with extent on an addressed
 * path, turned by `turnRotation`, so a range stops the walk at its bound. A collapsed member and a
 * member no aim reads keep their centre angle, which is all the first outward pass can recover.
 */
export function seedLegal(
  root: WorldFrame,
  ids: readonly string[],
  byId: ReadonlyMap<string, SolveMember>,
  aims: ReadonlyMap<string, WorldPoint>,
  start: LegalSeed,
): ReadonlyMap<string, WorldPoint> {
  const fraction = legalFraction(start);
  const count = ids.length;
  const at = new Map(ids.map((id, index) => [id, index]));
  const members = ids.map((id) => byId.get(id)!);
  const parent = members.map(({ base }) => at.get(base) ?? -1);
  // A zero-length tip cannot encode a direction. Match the first outward pass's rest-direction
  // fallback rather than composing descendants from an orientation that pass cannot recover.
  const locals = members.map((member) =>
    solveLength(member) > 0
      ? legalRotation(member.limit ?? FREE_JOINT, fraction)
      : limitRotation(member.limit ?? FREE_JOINT, 0),
  );
  // `%` is exact, so this is the frame the root names; unreduced, a turn added to a root rotation
  // near `Number.MAX_VALUE` would be absorbed by its ulp and the free members would not turn.
  const rootDirection = root.rotation % 360;
  const directions = new Array<number>(count);
  const pivots = new Array<WorldPoint>(count);
  const tips = new Array<WorldPoint>(count);
  const compose = (from: number, angles: readonly number[] = locals): void => {
    for (let index = from; index < count; index += 1) {
      const base = parent[index]!;
      const baseDirection = base < 0 ? rootDirection : directions[base]!;
      const pivot = pivotFromBaseTip(
        base < 0 ? root : tips[base]!,
        baseDirection,
        solveOffset(members[index]!),
      );
      const direction = baseDirection + angles[index]!;
      const length = solveLength(members[index]!);
      pivots[index] = pivot;
      directions[index] = direction;
      tips[index] = {
        x: pivot.x + length * Math.cos(direction * RADIANS),
        y: pivot.y + length * Math.sin(direction * RADIANS),
      };
    }
  };
  compose(0);
  // The addressed leaves below each member, in canonical leaf order.
  const below: string[][] = Array.from({ length: count }, () => []);
  for (const leaf of aims.keys())
    for (let index = at.get(leaf); index !== undefined && index >= 0; index = parent[index])
      below[index]!.push(leaf);
  for (let index = 0; index < count; index += 1) {
    const leaves = below[index]!;
    if (
      members[index]!.limit !== undefined ||
      solveLength(members[index]!) === 0 ||
      leaves.length === 0
    )
      continue;
    let tipX = 0;
    let tipY = 0;
    let aimX = 0;
    let aimY = 0;
    for (const leaf of leaves) {
      const tip = tips[at.get(leaf)!]!;
      const aim = aims.get(leaf)!;
      tipX += tip.x;
      tipY += tip.y;
      aimX += aim.x;
      aimY += aim.y;
    }
    const pivot = pivots[index]!;
    const share = 1 / leaves.length;
    const from = Math.atan2(tipY * share - pivot.y, tipX * share - pivot.x);
    const to = Math.atan2(aimY * share - pivot.y, aimX * share - pivot.x);
    // The same minimal planar turn as the 3D swing, including the ±π branch cut.
    locals[index] = locals[index]! + wrapRotation((to - from) / RADIANS);
    compose(index);
  }
  switch (start.kind) {
    case "legal-range":
      break;
    case "legal-descent": {
      // One angle per member with extent that an aim reads; every other member keeps its centre.
      const moving = members.flatMap((member, index) =>
        solveLength(member) > 0 && below[index]!.length > 0 ? [index] : [],
      );
      const limitAt = (dof: number) => members[moving[dof]!]!.limit ?? FREE_JOINT;
      const leaves = [...aims.keys()].map((leaf) => at.get(leaf)!);
      const descent: LegalDescent<readonly number[]> = {
        dofs: moving.length,
        width: 2,
        reach: Math.max(
          0,
          ...leaves.map((leaf) => {
            let extent = 0;
            for (let index = leaf; index >= 0; index = parent[index]!) {
              const { x, y } = solveOffset(members[index]!);
              extent += solveLength(members[index]!) + Math.hypot(x, y);
            }
            return extent;
          }),
        ),
        misses: (angles) => {
          compose(0, angles);
          return leaves.flatMap((leaf) => {
            const aim = aims.get(ids[leaf]!)!;
            return [tips[leaf]!.x - aim.x, tips[leaf]!.y - aim.y];
          });
        },
        turn: (angles, degrees) => {
          const next = [...angles];
          moving.forEach((index, dof) => {
            next[index] = turnRotation(limitAt(dof), angles[index]!, degrees[dof]!);
          });
          return next;
        },
        bound: (angles, dof) => rotationSide(limitAt(dof), angles[moving[dof]!]!),
      };
      compose(0, descendLegally(descent, [...locals]));
      break;
    }
    default:
      return unreachable(start);
  }
  return new Map(ids.map((id, index) => [id, Object.freeze(tips[index]!)]));
}

/**
 * The fraction of every range a legal start holds its limited members at before any walk: the
 * descent starts from the centre. Shared by both dimensions' seeds.
 */
export function legalFraction(start: LegalSeed): LegalSeedFraction {
  switch (start.kind) {
    case "legal-range":
      return start.fraction;
    case "legal-descent":
      return 0.5;
    default:
      return unreachable(start);
  }
}
