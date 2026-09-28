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
import { selectFabrik } from "./fabrik-select";
import { seedArc } from "./fabrik-seed";
import {
  FabrikIncumbent,
  fabrikPassBudget,
  fabrikRelativeMove,
  type FabrikConstraint,
} from "./fabrik-cap";
import { unreachable } from "../lang/exhaustive";
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

/**
 * FABRIK over a solver chain: pure, and reviewed as arithmetic.
 *
 * This is one of the two strategies `ik-solve.ts` dispatches to, the one every chain that is not
 * exactly two members with one goal takes. The two questions it raises remain separate: whether the
 * arithmetic is right, and whether the dispatcher hands it the right chain. This file owns only the
 * first, while `ik-solve.ts` owns that dispatch. An earlier header called this module unwired; it
 * has been imported by the dispatcher since issue #195's slice D3. See issue #195 and ADR-106.
 *
 * The shape is the one ADR-051 draws for the analytic solve: a pure function of a root frame and
 * the member states, returning one **local** rotation per member in `fk`'s own degrees and
 * rotate-then-translate convention. A member's rotation is measured from its base member's world
 * direction, or from the root's own rotation when its base is not a member, which is exactly what
 * `fk` substitutes for an authored `rotation`. An `ik` node that solved this way therefore
 * substitutes for one that solved analytically, and nothing downstream can tell the difference.
 *
 * The working state is a pivot and a tip per member rather than a tip alone. A member's segment is
 * the pair, its length is the distance between them, and its pivot is its base's tip moved by the
 * authored offset in the base's own rotated frame: `fk`'s composition, as positions. A solve that
 * held tips alone was assuming every pivot sits on the previous tip, which is true only of a member
 * that authored no offset, and it missed such a member's goal by exactly the offset vector with a
 * `ready` patch and no diagnostic. See ADR-054 and issue #214.
 *
 * Tolerance is a module constant rather than an authored value, and so is the iteration cap, which
 * `fabrik-cap.ts` owns. An interpolatable tolerance would make the operation count a function of
 * the timeline, and then a determinism case could not be written at all: one rig at two progresses
 * would take two different numbers of steps toward two different residuals. It is exported so a
 * test imports the tolerance rather than typing a number beside every assertion.
 */

/**
 * The residual, in world units, at or below which a solve is called converged.
 *
 * A thousandth of a unit is far below anything a renderer can show, and it is deliberately not
 * tighter. FABRIK contracts linearly and its rate degrades toward one as a chain straightens, so a
 * near-boundary rig spends iterations buying digits nothing observes. Over a random sample of five
 * thousand reachable two-to-five bone chains the median residual here is about `4e-4`, and roughly
 * four percent do not reach tolerance before the cap, the worst of them within a few units of the
 * reach boundary. That is why `residual` is returned rather than absorbed: a caller diagnoses the
 * shortfall it actually got instead of trusting a boolean.
 */
export const FABRIK_TOLERANCE = 1e-3;

/**
 * A point in the solve's working state.
 *
 * An alias rather than a second declaration, because it is the same thing `frame.ts` means by a
 * world position and the offset functions this solve composes through take and return that type.
 * The name stays exported: it is what `tips` and `pivots` are keyed to and what the cases read.
 */
export type FabrikPoint = WorldPoint;

/**
 * The solved chain: one local rotation per member id, the pivots and tips those rotations describe,
 * and what the iteration did.
 *
 * The rotations and the quality are the shared `SolveResult` every strategy returns, narrowed to
 * the iterative kinds: a residual inside tolerance converged, a fixed point that remains outside it
 * stalled, and a still-moving pose at the cap hit `iteration-cap`. The last distinction is a
 * capability gain, because a caller can tell a solve that was still improving from an unreachable
 * goal no amount of work would help. The field was `convergence` and its type `FabrikConvergence`
 * until issue #349's second phase moved the kinds into `ik-result.ts`, where the closed form's
 * kinds sit beside them. See ADR-107.
 *
 * `tips` and `pivots` are returned because length preservation is a statement about positions
 * rather than angles, and a case that re-derived them from the rotations would re-derive the thing
 * under test. Both halves are needed once a member may carry an offset: its length is the distance
 * from its own pivot to its own tip, and the distance between two consecutive tips is that length
 * only when the offset is zero. A publisher carries `rotations` and nothing else; the positions are
 * `fk`'s to recompute, which is the point of returning rotations rather than a pose.
 */
export interface FabrikSolution extends SolveResult<IterativeQuality> {
  readonly pivots: Readonly<Record<string, FabrikPoint>>;
  readonly tips: Readonly<Record<string, FabrikPoint>>;
}

const DEGREES = 180 / Math.PI;
const RADIANS = Math.PI / 180;

/**
 * The solve.
 *
 * Order is derived here rather than trusted from the caller: members are sorted by depth, then by
 * qualified id, which is the ordering `resolveSolvers` already produces. Both passes and every
 * sub-base average therefore read one canonical sequence, so permuting the argument cannot change a
 * digit and determinism is asserted as byte identity rather than as closeness.
 *
 * A joint several members hang from is a sub-base, and the inward pass leaves it one position per
 * branch. Averaging those in canonical order is the whole of tree FABRIK, and the order is what
 * makes the average a value at all: floating-point addition is not associative, so "average the
 * branches" means nothing until the sequence is fixed.
 *
 * **The sub-base convention, stated because offsets are what make it a question.** Each branch
 * converts its own pivot proposal into a proposal about its base's *tip* before contributing it,
 * using the base's current direction, and the average is taken over those tips. Positions are
 * averaged and twists never are. A sub-base carries one direction and each of its children hangs
 * off that one direction at its own offset, so the children's pivots are not independent quantities
 * to average: the tip is the single quantity they all have an opinion about, and un-offsetting
 * first is what makes the average a statement about one thing. Averaging the pivots instead would
 * average geometry that is incompatible by construction, which ADR-053 named as the reason this was
 * left for its own slice. The forward pass then re-derives every child's pivot from that one tip
 * and direction, so no branch can hold a pose the composition would not compose. See ADR-054.
 */
export function solveFabrikAttempt(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
  compromiseRule: CompromiseRule = "centroid",
): FabrikSolution {
  // Canonical order, child counts, leaves and serial depth are topology rather than arithmetic, so
  // they are read through `ik-topology.ts`, the owner the 3D solve reads too (ADR-122). It throws
  // by name if the bases cycle, which graph construction refuses long before a solve is reached.
  const { byId, ids, serialDepth, childCount, leaves } = canonicalChain(members);
  const isMember = (id: string): boolean => byId.has(id);
  const baseOf = (id: string): string => byId.get(id)!.base;
  const lengthOf = (id: string): number => solveLength(byId.get(id)!);
  const offsetOf = (id: string): PivotOffset => solveOffset(byId.get(id)!);
  const goalOf = (id: string): WorldFrame | undefined => byId.get(id)!.goal;
  const limitOf = (id: string): JointLimit => byId.get(id)!.limit ?? FREE_JOINT;
  // A `SolveMember` carries a limit only when it constrains the solve, so presence is the answer.
  const isLimited = (id: string): boolean => byId.get(id)!.limit !== undefined;
  const rootPoint: FabrikPoint = Object.freeze({ x: root.x, y: root.y });
  // Each member's limited children, canonical order, which bound it in the inward pass (ADR-126).
  const limitedChildren = new Map<string, string[]>();
  for (const id of ids) {
    const base = baseOf(id);
    if (!isMember(base) || !isLimited(id)) continue;
    const list = limitedChildren.get(base) ?? [];
    list.push(id);
    limitedChildren.set(base, list);
  }
  const addressed = leaves.filter((id) => goalOf(id) !== undefined);
  // A goal is read only on a leaf, so a goal on a member with children would be solved as if it
  // were absent while the result reported the rig converged. Load refuses that shape as
  // `ik-goal-not-leaf`, so reaching here is a publisher invariant violation, thrown by name after
  // the cycle guard above so a cycle keeps its own message. See ADR-111.
  const inner = ids.find((id) => (childCount.get(id) ?? 0) > 0 && goalOf(id) !== undefined);
  if (inner !== undefined)
    throw new Error(`Solver goal on member "${inner}" is not on a leaf of the chain.`);
  // Each member's pull on the sub-base it proposes to, from the influence of the goals under it.
  // `ik-goal.ts` owns both the pull and the compromise; this loop only carries them. See ADR-110.
  const pulls = branchPulls(byId, addressed);
  const tips = new Map<string, FabrikPoint>();
  const pivots = new Map<string, FabrikPoint>();
  // The largest coordinate magnitude from the root's point down each member's path, re-measured
  // after every pass: the scale its movement is judged against (issue #519).
  const pathScales = new Map<string, number>();
  const rootScale = Math.max(Math.abs(rootPoint.x), Math.abs(rootPoint.y));
  /** The tip a member hangs off: its base member's, or the root's own point. */
  const originOf = (id: string): FabrikPoint => {
    const base = baseOf(id);
    return isMember(base) ? tips.get(base)! : rootPoint;
  };
  /**
   * A member's world direction, and its base's when its own segment has no extent.
   *
   * Measured from its own pivot rather than from its base's tip, which is the same point only for a
   * member that authored no offset. A zero-length member has no direction, and inheriting its
   * base's is the only answer that leaves its children where the solve put them: `fk` measures a
   * child's rotation from its parent's world direction, so answering zero here would swing every
   * descendant by the parent's own angle.
   */
  const worldDirection = (id: string): number => {
    const pivot = pivots.get(id)!;
    const tip = tips.get(id)!;
    if (tip.x === pivot.x && tip.y === pivot.y)
      return restDirection(limitOf(id), baseDirection(id));
    return Math.atan2(tip.y - pivot.y, tip.x - pivot.x) * DEGREES;
  };
  /** The direction the node a member hangs off is pointing, which is the frame its offset is in. */
  const baseDirection = (id: string): number => {
    const base = baseOf(id);
    return isMember(base) ? worldDirection(base) : root.rotation;
  };

  // Every addressed leaf's goal, read once through the one goal reader in canonical order, so the
  // first `NaN` leaf is the one refused. The passes iterate toward its aim, which is the goal
  // itself or a direction's stand-in past everything the leaf's path can reach.
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
  // Seeded one root-to-leaf path at a time, in canonical leaf order. A member two branches share is
  // seeded by the first of them, and every branch is enforced to length below, so the sharing costs
  // a direction and nothing else.
  for (const leaf of addressed) {
    const goal = aims.get(leaf)!;
    const path: string[] = [];
    let cursor = leaf;
    while (isMember(cursor)) {
      path.unshift(cursor);
      cursor = baseOf(cursor);
    }
    const seeded = seedArc(root, goal, path.map(lengthOf), flip);
    path.forEach((id, index) => {
      if (!tips.has(id)) tips.set(id, seeded[index]!);
    });
  }
  // A member on no addressed path still needs a position. Straight out along the root's own
  // rotation, because a member with nothing to reach for has no direction of its own to prefer.
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

  /**
   * The point at distance `length` from `from`, toward `to`.
   *
   * Both degenerate answers are chosen rather than propagated. A zero-length segment collapses onto
   * its start, which is what a zero-length bone is, and a zero-distance direction takes the local
   * `+x` axis, which is arbitrary but total and identical on every call. A coincident pair then
   * produces a defined pose instead of a `NaN` that reaches a published frame and blocks every
   * child of the node that published it.
   *
   * A finite length over a finite but tiny distance can still overflow the ratio between them: a
   * `1e300` member reaching across a `1e-100` gap is a finite rig whose `length / distance` is
   * `Infinity`, and the product that follows is `NaN` for any delta that is zero on one axis. Only
   * then is the direction normalised by its larger component first, which keeps every intermediate
   * within `[1, sqrt(2)]` of the length; every ratio that is finite takes the original expression,
   * so a rig that never overflowed places its points byte-identically. See ADR-111.
   */
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
  /**
   * The inward pivot: `length` back from the settled tip, turned for each limited child by
   * `boundBaseDirection` (ADR-126). `inwardDirections` holds the directions limited members settled
   * on earlier in this deepest-first pass. No limited child, or legal ones, returns the plain
   * placement, so a free rig keeps its bytes.
   */
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
  /**
   * The outward pass. Lengths are law, and this is the only place that enforces them.
   *
   * It is also the only place that composes a pivot, and it does so in canonical depth order, so a
   * member's base already holds its final pivot and tip by the time the member reads its direction.
   * That makes the pass exactly `fk`'s own forward composition over the current tip guesses, which
   * is what makes an offset chain's pose one the runtime can actually compose.
   */
  /**
   * Where a placed tip may actually go: unchanged for a free joint, and for a limited one turned
   * about its pivot onto the legal local angle nearest the placed one. Enforced here, inside the
   * pass that enforces lengths, so every later iteration starts from a legal pose and the published
   * angle is legal because the pose is, not because the output was clamped afterwards. See ADR-108.
   * Whether the member rests on a bound is recorded here too, from the bounded angle this pass
   * enforced, matching the 3D record. Re-deriving it from rounded positions can land a bound pose a
   * few ulps inside the range and report it as unbounded (ADR-126).
   */
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
  /** One addressed leaf's goal shortfall, in world units. */
  const shortfall = (leaf: string): number => {
    const goal = aims.get(leaf)!;
    const tip = tips.get(leaf)!;
    return Math.hypot(tip.x - goal.x, tip.y - goal.y);
  };
  /** The worst goal shortfall over addressed leaves: the worst, so no branch hides behind a mean. */
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
  // How far the branches still disagreed about a shared member in the latest inward pass.
  let spread = 0;
  const incumbent = new FabrikIncumbent();
  const bestTips: FabrikPoint[] = new Array(ids.length);
  const bestPivots: FabrikPoint[] = new Array(ids.length);
  const bestOnBound: boolean[] = new Array(ids.length);
  // The incumbent pass's inward spread: whether its branches agreed is part of that pass's pose.
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
  while (residual > FABRIK_TOLERANCE && budget.admits(iterations, residual)) {
    iterations += 1;
    spread = 0;
    inwardDirections.clear();
    const before = new Map(tips);
    // The inward pass. Every addressed leaf starts at its goal, and each member proposes where its
    // own pivot would have to sit for its length to hold, then un-offsets that pivot into a
    // proposal about its base's tip. A sub-base settles on the influence-weighted compromise of the
    // tips its branches left it, which is the equal average when no goal authored an influence.
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
      // A proposal for the root is dropped rather than averaged in. The root is the one point a
      // solve may not move: it is the frame the chain hangs from, published by a node this solve
      // does not own.
      if (!isMember(base)) continue;
      const pivot = inwardPivot(id);
      if (isLimited(id) && lengthOf(id) > 0) {
        const tip = tips.get(id)!;
        inwardDirections.set(id, Math.atan2(tip.y - pivot.y, tip.x - pivot.x) * DEGREES);
      }
      const list = proposals.get(base) ?? [];
      const direction = baseDirection(id);
      const point = Object.freeze(baseTipFromPivot(pivot, direction, offsetOf(id)));
      // The base tips that keep this child's tip and length: its tip un-offset the same way.
      const centre = Object.freeze(baseTipFromPivot(tips.get(id)!, direction, offsetOf(id)));
      const reach = { centre, radius: lengthOf(id) };
      list.push({ kind: "branch", point, weight: pulls.get(id)!, reach });
      proposals.set(base, list);
    }
    outward();
    residual = residualNow();
    if (incumbent.offer(residual)) saveIncumbent();
    // Nothing moved, so nothing can. An unreachable goal reaches full extension in one pass and
    // holds, and exiting here rather than at the cap is what makes `iterations` mean work done and
    // lets `stalled` tell a caller that a larger cap is not the answer. What counts as nothing is
    // the budget's, one rule for every constraint, so 3D stops on it too; each tip's move is judged
    // against the magnitudes on its own path, bases before children (issue #519).
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

  // Publish the incumbent pass, not the last one (ADR-128); nothing is held when no pass ran.
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
    // A free joint's `limitRotation` is the identity, so its published angle is the expression it
    // always was, byte for byte. A limited one is already legal from the outward pass and is read
    // through the same owner, which only wraps it into the declared domain.
    const limit = limitOf(id);
    const local = limitRotation(limit, worldDirection(id) - baseDirection(id));
    rotations[id] = local;
    if (onBound.get(id) === true) atBounds.push(id);
    solvedPivots[id] = pivots.get(id)!;
    solvedTips[id] = tips.get(id)!;
  }
  // The iteration measured its aims; the quality reports the goals. They differ only for a
  // direction, whose miss is infinite, so its kind is the one this strategy gives any unreachable
  // goal and its residual says how unreachable.
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

/** What an iterative solve observed when it stopped, before it is named as one quality kind. */
export interface IterativeOutcome {
  /** The worst addressed-leaf shortfall of the published pass (ADR-128). */
  readonly residual: number;
  readonly iterations: number;
  /** The members whose published local angle sits exactly on a declared bound, canonical order. */
  readonly atBound: readonly string[];
  /** How far branches still disagreed about a shared member in the published pass's inward pass. */
  readonly spread: number;
  /**
   * Whether the last pass left the attempt at a fixed point, as `FabrikPassBudget.settles` judges
   * it: nothing moved at all, or a second consecutive pass moved by rounding only (issue #519).
   */
  readonly stalled: boolean;
}

/**
 * The one owner of how a FABRIK outcome is named, so the order below is pinned at its boundaries
 * rather than only through whichever rigs happen to land near them.
 *
 * A bound is the most specific cause and an authored one, so a miss with any joint at a bound is
 * `limited` first. Within tolerance is `converged`. A disagreement is named before the stall or
 * the cap, because neither more iterations nor a different stall test answers branches that pull
 * one member to two places, and it is named only when the published pass's spread is strictly above
 * `FABRIK_TOLERANCE`, the same strict bound the residual is judged by. See ADR-108 and ADR-110.
 */
export function iterativeQuality(outcome: IterativeOutcome): IterativeQuality {
  const { residual, iterations, atBound, spread, stalled } = outcome;
  if (residual > FABRIK_TOLERANCE && atBound.length > 0)
    return { kind: "limited", iterations, residual, atBound: Object.freeze([...atBound]) };
  if (residual <= FABRIK_TOLERANCE) return { kind: "converged", iterations, residual };
  if (spread > FABRIK_TOLERANCE) return { kind: "conflicted", iterations, residual };
  if (stalled) return { kind: "stalled", iterations, residual };
  return { kind: "iteration-cap", iterations, residual };
}

/**
 * Solve once with the authored seed; a conflicted baseline pays three alternatives, while a
 * limited or capped baseline pays one opposite-seed retry with the centroid rule (ADR-128).
 */
export function solveFabrik(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
): FabrikSolution {
  return selectFabrik(root, members, flip, solveFabrikAttempt);
}
