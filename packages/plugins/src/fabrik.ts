import {
  baseTipFromPivot,
  pivotFromBaseTip,
  type PivotOffset,
  type WorldFrame,
  type WorldPoint,
} from "./frame";
import { solveLength, solveOffset, type SolveMember } from "./ik-member";
import { aimPoint, goalMiss, readGoal, type GoalReading } from "./ik-goal-reading";
import { branchPulls, compromise, type CompromiseRule, type Pull } from "./ik-goal";
import {
  addressedReach,
  arcLegalStarts,
  goalsWithinReach,
  NO_LEGAL_STARTS,
  selectFabrik,
} from "./fabrik-select";
import { DEFAULT_FABRIK_SEED, heldFromSeed, seedArc, seedLegal } from "./fabrik-seed";
import type { FabrikSeed } from "./fabrik-seed";
import {
  FabrikIncumbent,
  fabrikPassBudget,
  fabrikRelativeMove,
  type FabrikConstraint,
} from "./fabrik-cap";
import { unreachable } from "@motion5/core/plugin-api";
import { canonicalChain } from "./ik-topology";
import {
  atBound,
  boundBaseDirection,
  FREE_JOINT,
  limitRotation,
  restDirection,
  wrapRotation,
  type JointLimit,
} from "./ik-constraint";
import type { IterativeQuality, SolveResult } from "./ik-result";

/** The residual in world units at or below which a solve is converged. Never authored: a tolerance
 * a timeline could vary makes the pass count a function of the frame. */
export const FABRIK_TOLERANCE = 1e-3;

/** A point in the solve's working state. */
export type FabrikPoint = WorldPoint;

/** Local rotations plus the pivots and tips they describe; length is a member's own pivot-to-tip distance. */
export interface FabrikSolution extends SolveResult<IterativeQuality> {
  readonly pivots: Readonly<Record<string, FabrikPoint>>;
  readonly tips: Readonly<Record<string, FabrikPoint>>;
}

const DEGREES = 180 / Math.PI;
const RADIANS = Math.PI / 180;

/** FABRIK over one solver chain, pure: local rotations in `fk`'s degrees, in canonical depth order derived here. */
export function solveFabrikAttempt(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
  compromiseRule: CompromiseRule = "centroid",
  seed: FabrikSeed = DEFAULT_FABRIK_SEED,
): FabrikSolution {
  const { byId, ids, serialDepth, childCount, leaves } = canonicalChain(members);
  const isMember = (id: string): boolean => byId.has(id);
  const baseOf = (id: string): string => byId.get(id)!.base;
  const lengthOf = (id: string): number => solveLength(byId.get(id)!);
  const offsetOf = (id: string): PivotOffset => solveOffset(byId.get(id)!);
  const goalOf = (id: string): WorldFrame | undefined => byId.get(id)!.goal;
  const limitOf = (id: string): JointLimit => byId.get(id)!.limit ?? FREE_JOINT;
  const isLimited = (id: string): boolean => byId.get(id)!.limit !== undefined;
  const rootPoint: FabrikPoint = Object.freeze({ x: root.x, y: root.y });
  const limitedChildren = new Map<string, string[]>();
  for (const id of ids) {
    const base = baseOf(id);
    if (!isMember(base) || !isLimited(id)) continue;
    const list = limitedChildren.get(base) ?? [];
    list.push(id);
    limitedChildren.set(base, list);
  }
  const addressed = leaves.filter((id) => goalOf(id) !== undefined);
  const inner = ids.find((id) => (childCount.get(id) ?? 0) > 0 && goalOf(id) !== undefined);
  if (inner !== undefined)
    throw new Error(`Solver goal on member "${inner}" is not on a leaf of the chain.`);
  const pulls = branchPulls(byId, addressed);
  const tips = new Map<string, FabrikPoint>();
  const pivots = new Map<string, FabrikPoint>();
  // Each member's path magnitude scale, re-measured every pass, bases before children.
  const pathScales = new Map<string, number>();
  const rootScale = Math.max(Math.abs(rootPoint.x), Math.abs(rootPoint.y));
  const originOf = (id: string): FabrikPoint => {
    const base = baseOf(id);
    return isMember(base) ? tips.get(base)! : rootPoint;
  };
  /** A member's world direction from its own pivot; with no extent, its rest direction off its base's. */
  const worldDirection = (id: string): number => {
    const pivot = pivots.get(id)!;
    const tip = tips.get(id)!;
    if (tip.x === pivot.x && tip.y === pivot.y)
      return restDirection(limitOf(id), baseDirection(id));
    return Math.atan2(tip.y - pivot.y, tip.x - pivot.x) * DEGREES;
  };
  const baseDirection = (id: string): number => {
    const base = baseOf(id);
    return isMember(base) ? worldDirection(base) : root.rotation;
  };

  // Goals are read in canonical order, so the first `NaN` leaf is the one refused.
  const readings = new Map<string, GoalReading>();
  const aims = new Map<string, FabrikPoint>();
  const pathReach = (leaf: string): number => {
    let reach = 0;
    for (let cursor = leaf; isMember(cursor); cursor = baseOf(cursor))
      reach += lengthOf(cursor) + Math.hypot(offsetOf(cursor).x, offsetOf(cursor).y);
    return reach;
  };
  for (const leaf of addressed) {
    const goal = goalOf(leaf)!;
    const reading = readGoal(leaf, [
      ["x", goal.x],
      ["y", goal.y],
    ]);
    const [x, y] = aimPoint(reading, [root.x, root.y], () => pathReach(leaf));
    readings.set(leaf, reading);
    aims.set(leaf, Object.freeze({ x: x!, y: y! }));
  }
  // The default seed walks one root-to-leaf path per leaf.
  switch (seed.kind) {
    case "default":
      for (const leaf of addressed) {
        const path: string[] = [];
        for (let cursor = leaf; isMember(cursor); cursor = baseOf(cursor)) path.unshift(cursor);
        const seeded = seedArc(root, aims.get(leaf)!, path.map(lengthOf), flip);
        path.forEach((id, index) => {
          if (!tips.has(id)) tips.set(id, seeded[index]!);
        });
      }
      break;
    case "legal-range":
    case "legal-descent":
      for (const [id, tip] of seedLegal(root, ids, byId, aims, seed)) tips.set(id, tip);
      break;
    default:
      return unreachable(seed);
  }
  for (const id of ids) {
    if (tips.has(id)) continue;
    const start = originOf(id);
    const along = lengthOf(id);
    tips.set(
      id,
      Object.freeze({
        x: start.x + along * Math.cos(root.rotation * RADIANS),
        y: start.y + along * Math.sin(root.rotation * RADIANS),
      }),
    );
  }

  // Degenerate answers stay defined so no `NaN` reaches a frame; a non-finite ratio normalises by the larger component.
  const place = (from: FabrikPoint, to: FabrikPoint, length: number): FabrikPoint => {
    if (length <= 0) return Object.freeze({ x: from.x, y: from.y });
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= 0) return Object.freeze({ x: from.x + length, y: from.y });
    const scale = length / distance;
    if (Number.isFinite(scale))
      return Object.freeze({ x: from.x + dx * scale, y: from.y + dy * scale });
    const axis = Math.max(Math.abs(dx), Math.abs(dy));
    const extent = length / Math.hypot(dx / axis, dy / axis);
    return Object.freeze({ x: from.x + (dx / axis) * extent, y: from.y + (dy / axis) * extent });
  };
  // The inward pivot: `length` back from the settled tip, turned for each limited child settled earlier in this deepest-first pass.
  const inwardDirections = new Map<string, number>();
  const inwardPivot = (id: string): FabrikPoint => {
    const tip = tips.get(id)!;
    const length = lengthOf(id);
    const placed = place(tip, pivots.get(id)!, length);
    const children = limitedChildren.get(id);
    if (children === undefined || length <= 0) return placed;
    const direction = Math.atan2(tip.y - placed.y, tip.x - placed.x) * DEGREES;
    let bounded = direction;
    for (const child of children) {
      const childDirection = inwardDirections.get(child);
      if (childDirection !== undefined)
        bounded = boundBaseDirection(limitOf(child), childDirection, bounded);
    }
    if (bounded === direction) return placed;
    return Object.freeze({
      x: tip.x - length * Math.cos(bounded * RADIANS),
      y: tip.y - length * Math.sin(bounded * RADIANS),
    });
  };
  /** The outward pass composes pivots in canonical depth order and is the only place lengths are enforced. */
  /** A free joint keeps its placed tip; a limited one turns onto the nearest legal local angle. */
  /** The bound flag comes from the enforced angle, not from rounded positions. */
  const onBound = new Map<string, boolean>();
  const limitTip = (
    id: string,
    pivot: FabrikPoint,
    placed: FabrikPoint,
    length: number,
  ): FabrikPoint => {
    const limit = limitOf(id);
    switch (limit.kind) {
      case "free":
        return placed;
      case "range": {
        if (length <= 0) {
          onBound.set(id, atBound(limit, 0));
          return placed;
        }
        const base = baseDirection(id);
        const local = wrapRotation(
          Math.atan2(placed.y - pivot.y, placed.x - pivot.x) * DEGREES - base,
        );
        const bounded = limitRotation(limit, local);
        onBound.set(id, atBound(limit, bounded));
        if (bounded === local) return placed;
        return Object.freeze({
          x: pivot.x + length * Math.cos((base + bounded) * RADIANS),
          y: pivot.y + length * Math.sin((base + bounded) * RADIANS),
        });
      }
      default:
        return unreachable(limit);
    }
  };
  const outward = (): void => {
    for (const id of ids) {
      const pivot = Object.freeze(pivotFromBaseTip(originOf(id), baseDirection(id), offsetOf(id)));
      pivots.set(id, pivot);
      const length = lengthOf(id);
      tips.set(id, limitTip(id, pivot, place(pivot, tips.get(id)!, length), length));
    }
  };
  const shortfall = (leaf: string): number => {
    const goal = aims.get(leaf)!;
    const tip = tips.get(leaf)!;
    return Math.hypot(tip.x - goal.x, tip.y - goal.y);
  };
  /** The worst addressed-leaf shortfall, so no branch hides behind a mean. */
  const residualNow = (): number => {
    let worst = 0;
    for (const leaf of addressed) worst = Math.max(worst, shortfall(leaf));
    return worst;
  };

  outward();
  const constraint: FabrikConstraint = ids.some(isLimited) ? "limited" : "free";
  const budget = fabrikPassBudget(serialDepth(), constraint, FABRIK_TOLERANCE);
  let iterations = 0;
  let residual = residualNow();
  let stalled = false;
  let spread = 0;
  const incumbent = new FabrikIncumbent();
  const bestTips: FabrikPoint[] = new Array(ids.length);
  const bestPivots: FabrikPoint[] = new Array(ids.length);
  const bestOnBound: boolean[] = new Array(ids.length);
  let bestSpread = 0;
  const saveIncumbent = (): void => {
    bestSpread = spread;
    for (let index = 0; index < ids.length; index += 1) {
      const id = ids[index]!;
      bestTips[index] = tips.get(id)!;
      bestPivots[index] = pivots.get(id)!;
      bestOnBound[index] = onBound.get(id) === true;
    }
  };
  if (heldFromSeed(seed) && incumbent.offer(residual)) saveIncumbent();
  while (residual > FABRIK_TOLERANCE && budget.admits(iterations, residual)) {
    iterations += 1;
    spread = 0;
    inwardDirections.clear();
    const before = new Map(tips);
    // Inward: each leaf starts at its aim; a sub-base settles on the weighted compromise of its branches' base-tip proposals.
    const proposals = new Map<string, Pull[]>();
    for (const leaf of addressed)
      proposals.set(leaf, [{ kind: "goal", point: aims.get(leaf)!, weight: 1 }]);
    for (let index = ids.length - 1; index >= 0; index -= 1) {
      const id = ids[index]!;
      const proposed = proposals.get(id) ?? [];
      if (proposed.length > 0) {
        const settled = compromise(proposed, compromiseRule);
        spread = Math.max(spread, settled.spread);
        tips.set(id, settled.point);
      }
      const base = baseOf(id);
      // A proposal for the root is dropped: the root never moves.
      if (!isMember(base)) continue;
      const pivot = inwardPivot(id);
      if (isLimited(id) && lengthOf(id) > 0) {
        const tip = tips.get(id)!;
        inwardDirections.set(id, Math.atan2(tip.y - pivot.y, tip.x - pivot.x) * DEGREES);
      }
      const list = proposals.get(base) ?? [];
      const direction = baseDirection(id);
      const point = Object.freeze(baseTipFromPivot(pivot, direction, offsetOf(id)));
      // The child's tip un-offset: the base tips that keep both its tip and its length.
      const centre = Object.freeze(baseTipFromPivot(tips.get(id)!, direction, offsetOf(id)));
      const reach = { centre, radius: lengthOf(id) };
      list.push({ kind: "branch", point, weight: pulls.get(id)!, reach });
      proposals.set(base, list);
    }
    outward();
    residual = residualNow();
    if (incumbent.offer(residual)) saveIncumbent();
    // Nothing moved, so nothing can: exiting here makes `iterations` mean work and `stalled` say a bigger cap would not help.
    let relative = 0;
    let farthest = 0;
    for (const id of ids) {
      const was = before.get(id)!;
      const now = tips.get(id)!;
      const pivot = pivots.get(id)!;
      const base = baseOf(id);
      const scale = Math.max(
        isMember(base) ? pathScales.get(base)! : rootScale,
        Math.abs(pivot.x),
        Math.abs(pivot.y),
        Math.abs(now.x),
        Math.abs(now.y),
      );
      pathScales.set(id, scale);
      const moved = Math.max(Math.abs(was.x - now.x), Math.abs(was.y - now.y));
      relative = Math.max(relative, fabrikRelativeMove(moved, scale));
      farthest = Math.max(farthest, moved);
    }
    if (budget.settles({ relative, moved: farthest })) {
      stalled = true;
      break;
    }
  }

  // The incumbent pass is published, not the last; nothing is held when no pass ran.
  const held = incumbent.residual;
  if (held !== undefined) {
    for (let index = 0; index < ids.length; index += 1) {
      const id = ids[index]!;
      tips.set(id, bestTips[index]!);
      pivots.set(id, bestPivots[index]!);
      onBound.set(id, bestOnBound[index]!);
    }
    residual = held;
    spread = bestSpread;
  }
  const rotations: Record<string, number> = {};
  const solvedPivots: Record<string, FabrikPoint> = {};
  const solvedTips: Record<string, FabrikPoint> = {};
  const atBounds: string[] = [];
  const residuals: Record<string, number> = {};
  for (const leaf of addressed) {
    const tip = tips.get(leaf)!;
    residuals[leaf] = goalMiss(readings.get(leaf)!, [tip.x, tip.y]);
  }
  for (const id of ids) {
    const limit = limitOf(id);
    const local = limitRotation(limit, worldDirection(id) - baseDirection(id));
    rotations[id] = local;
    if (onBound.get(id) === true) atBounds.push(id);
    solvedPivots[id] = pivots.get(id)!;
    solvedTips[id] = tips.get(id)!;
  }
  // The iteration measured aims while the quality reports goals, differing only for a direction's miss.
  let worst = residual;
  for (const leaf of addressed) worst = Math.max(worst, residuals[leaf]!);
  const quality = iterativeQuality({
    residual: worst,
    iterations,
    atBound: atBounds,
    spread,
    stalled,
  });
  return Object.freeze({
    rotations: Object.freeze(rotations),
    residuals: Object.freeze(residuals),
    pivots: Object.freeze(solvedPivots),
    tips: Object.freeze(solvedTips),
    quality: Object.freeze(quality),
  });
}

/** What an iterative solve observed when it stopped. */
export interface IterativeOutcome {
  /** The worst addressed-leaf shortfall of the published pass. */
  readonly residual: number;
  readonly iterations: number;
  /** Members whose published angle sits exactly on a bound, canonical order. */
  readonly atBound: readonly string[];
  /** Branch disagreement still open in the published pass. */
  readonly spread: number;
  /** A fixed point: nothing moved, or a pass moved only by rounding. */
  readonly stalled: boolean;
}

/** Names an outcome, most specific first: bound, tolerance, disagreement, stall, cap; disagreement needs spread above tolerance. */
export function iterativeQuality(outcome: IterativeOutcome): IterativeQuality {
  const { residual, iterations, atBound, spread, stalled } = outcome;
  if (residual > FABRIK_TOLERANCE && atBound.length > 0)
    return { kind: "limited", iterations, residual, atBound: Object.freeze([...atBound]) };
  if (residual <= FABRIK_TOLERANCE) return { kind: "converged", iterations, residual };
  if (spread > FABRIK_TOLERANCE) return { kind: "conflicted", iterations, residual };
  if (stalled) return { kind: "stalled", iterations, residual };
  return { kind: "iteration-cap", iterations, residual };
}

/** Solve once with the authored seed; a conflicted, limited or capped baseline pays extra attempts. */
export function solveFabrik(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
): FabrikSolution {
  const limited = members.some(({ limit }) => limit !== undefined);
  const offsetExtent = ({ pivot }: SolveMember): number => Math.hypot(pivot?.x ?? 0, pivot?.y ?? 0);
  return selectFabrik(
    root,
    members,
    flip,
    solveFabrikAttempt,
    limited
      ? arcLegalStarts(
          addressedReach(members, offsetExtent),
          goalsWithinReach(members, offsetExtent, ({ goal }) =>
            Math.hypot(goal!.x - root.x, goal!.y - root.y),
          ),
        )
      : NO_LEGAL_STARTS,
  );
}
