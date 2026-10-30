import { unreachable } from "@motion5/core/plugin-api";
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

/** Constant-curvature arc every FABRIK solve starts from; sole owner of arc geometry. 2D `seedArc` and 3D `seedArc3d` share one `arcHalfAngle` bisection. */

const RADIANS = Math.PI / 180;

/** Where a legal joint-space start holds each limited member: range centre, or staged fraction. */
export type LegalSeedFraction = 0.1 | 0.25 | 0.5 | 0.75 | 0.9;

/** Which start one FABRIK attempt takes: arc default, legal range fraction, or bounded legal descent. */
export type FabrikSeed =
  | { readonly kind: "default" }
  | { readonly kind: "legal-range"; readonly fraction: LegalSeedFraction }
  | { readonly kind: "legal-descent" };

/** Starts built in joint space, legal by construction: every seed but the arc. */
export type LegalSeed = Exclude<FabrikSeed, { readonly kind: "default" }>;

/** Whether an attempt keeps its seeded pose as first incumbent: only the descent, whose end pose is a monotone legal walk's best. */
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

/** Every limited member at its range centre: legal for every range. */
export const CENTRE_LEGAL_SEED: LegalSeed = Object.freeze({ kind: "legal-range", fraction: 0.5 });

/** Bisection depth for the seed arc half-angle: fixed, so the seed is reproducible. */
export const FABRIK_ARC_BISECTIONS = 60;

/**
 * Half-angle of the unit-length arc whose chord is `ratio`. Fixed bisection count -> reproducible.
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

/** Seed pose for one path: arc root to goal, length = chain; owns arc geometry, `flip` mirrors bulge.
 * Arc, not line: FABRIK cannot bend colinear. Points follow arc, not lengths. */
export function seedArc(
  root: WorldFrame,
  goal: WorldPoint,
  lengths: readonly number[],
  flip = false,
): readonly WorldPoint[] {
  const total = lengths.reduce((sum, length) => sum + segmentExtent(length), 0);
  const chord = Math.hypot(goal.x - root.x, goal.y - root.y);
  // Goal on root: no direction to read, so root rotation is the axis; zero chord still folds, a half turn.
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

/** 2D legal seed: tips for a joint-space start legal by construction; planar image of 3D seed.
 * Only free members turn, so pose stays legal. Fixed arithmetic -> reproducible. */
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
  // Zero-length tip encodes no direction: match the first outward pass's rest-direction fallback.
  const locals = members.map((member) =>
    solveLength(member) > 0
      ? legalRotation(member.limit ?? FREE_JOINT, fraction)
      : limitRotation(member.limit ?? FREE_JOINT, 0),
  );
  // `%` is exact -> the frame the root names; unreduced, a turn near `Number.MAX_VALUE` is ulp-absorbed.
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
  // Addressed leaves under each member, in aim order.
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
    // Same minimal planar turn as 3D swing, branch cut included.
    locals[index] = locals[index]! + wrapRotation((to - from) / RADIANS);
    compose(index);
  }
  switch (start.kind) {
    case "legal-range":
      break;
    case "legal-descent": {
      // One angle per member with extent an aim reads; others keep centre.
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

/** Fraction of every range a legal start holds before any walk; the descent starts centred. */
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
