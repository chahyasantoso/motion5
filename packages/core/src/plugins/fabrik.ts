import {
  baseTipFromPivot,
  pivotFromBaseTip,
  segmentExtent,
  type PivotOffset,
  type WorldFrame,
  type WorldPoint,
} from "./frame";
import { solveLength, solveOffset, type SolveMember } from "./ik-member";
import { aimPoint, goalMiss, readGoal, type GoalReading } from "./ik-goal-reading";
import { branchPulls, compromise, type CompromiseRule, type Pull } from "./ik-goal";
import { selectFabrik } from "./fabrik-select";
import { unreachable } from "../lang/exhaustive";
import {
  atBound,
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
 * Tolerance and iteration cap are module constants rather than authored values. An interpolatable
 * tolerance would make the operation count a function of the timeline, and then a determinism case
 * could not be written at all: one rig at two progresses would take two different numbers of steps
 * toward two different residuals. They are exported so a test imports the tolerance rather than
 * typing a number beside every assertion.
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
 * The hard iteration cap.
 *
 * A cap, not a promise. The loop also exits the moment an iteration moves nothing at all, which is
 * what an unreachable goal does after its first pass, so the cap is reached only by a chain that is
 * still converging and merely slower than it.
 */
export const FABRIK_MAX_ITERATIONS = 64;

/** Bisection steps for the seed's arc half-angle. A fixed count, so the seed is reproducible. */
export const FABRIK_ARC_BISECTIONS = 60;

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
 * The rotations and the quality are the shared `SolveResult` every strategy returns, narrowed to the
 * iterative kinds: a residual inside tolerance converged, a fixed point that remains outside it
 * stalled, and a still-moving pose at the hard cap hit `iteration-cap`. The last distinction is a
 * capability gain, because a caller can raise the cap for the slow case without treating an
 * unreachable goal as if more work could help. The field was `convergence` and its type
 * `FabrikConvergence` until issue #349's second phase moved the kinds into `ik-result.ts`, where the
 * closed form's kinds sit beside them. See ADR-107.
 *
 * `tips` and `pivots` are returned because length preservation is a statement about positions rather
 * than angles, and a case that re-derived them from the rotations would re-derive the thing under
 * test. Both halves are needed once a member may carry an offset: its length is the distance from
 * its own pivot to its own tip, and the distance between two consecutive tips is that length only
 * when the offset is zero. A publisher carries `rotations` and nothing else; the positions are
 * `fk`'s to recompute, which is the point of returning rotations rather than a pose.
 */
export interface FabrikSolution extends SolveResult<IterativeQuality> {
  readonly pivots: Readonly<Record<string, FabrikPoint>>;
  readonly tips: Readonly<Record<string, FabrikPoint>>;
}

const DEGREES = 180 / Math.PI;
const RADIANS = Math.PI / 180;

/**
 * Code-unit order, the same total order `graph/compare.ts` defines for qualified ids.
 *
 * Local rather than imported, because a plugin may not depend on the graph layer. It is a total
 * order on strings and not a rule that can drift: the two copies cannot disagree about an answer
 * the language defines.
 */
function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

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
  goal: FabrikPoint,
  lengths: readonly number[],
  flip = false,
): readonly FabrikPoint[] {
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
  const points: FabrikPoint[] = [];
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
 * to average: the tip is the single quantity they all have an opinion about, and un-offsetting first
 * is what makes the average a statement about one thing. Averaging the pivots instead would average
 * geometry that is incompatible by construction, which ADR-053 named as the reason this was left
 * for its own slice. The forward pass then re-derives every child's pivot from that one tip and
 * direction, so no branch can hold a pose the composition would not compose. See ADR-054.
 */
export function solveFabrikAttempt(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
  compromiseRule: CompromiseRule = "centroid",
): FabrikSolution {
  const byId = new Map(members.map((member) => [member.id, member]));
  const isMember = (id: string): boolean => byId.has(id);
  const baseOf = (id: string): string => byId.get(id)!.base;
  const lengthOf = (id: string): number => solveLength(byId.get(id)!);
  const offsetOf = (id: string): PivotOffset => solveOffset(byId.get(id)!);
  const goalOf = (id: string): WorldFrame | undefined => byId.get(id)!.goal;
  const limitOf = (id: string): JointLimit => byId.get(id)!.limit ?? FREE_JOINT;
  /**
   * Depth from the root, and a refusal if the bases cycle.
   *
   * Graph construction refuses a cycle long before a solve is reached, so this is an invariant
   * guard and not a validation step: it exists so a caller that broke the invariant gets a named
   * failure instead of this function never returning.
   */
  const depthOf = (member: SolveMember): number => {
    const seen = new Set<string>([member.id]);
    let current = member;
    let depth = 0;
    while (isMember(current.base)) {
      if (seen.has(current.base))
        throw new Error(`Solver chain cycles at member "${current.base}".`);
      seen.add(current.base);
      current = byId.get(current.base)!;
      depth += 1;
    }
    return depth;
  };
  const ids = [...members]
    .sort((a, b) => depthOf(a) - depthOf(b) || compareCodeUnits(a.id, b.id))
    .map((member) => member.id);
  const rootPoint: FabrikPoint = Object.freeze({ x: root.x, y: root.y });
  const childCount = new Map<string, number>(ids.map((id) => [id, 0]));
  for (const id of ids) {
    const base = baseOf(id);
    if (isMember(base)) childCount.set(base, (childCount.get(base) ?? 0) + 1);
  }
  const leaves = ids.filter((id) => (childCount.get(id) ?? 0) === 0);
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
  // first `NaN` leaf is the one refused. The passes iterate toward its aim, which is the goal itself
  // or a direction's stand-in past everything the leaf's path can reach.
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
   * within `[1, sqrt(2)]` of the length; every ratio that is finite takes the original expression, so
   * a rig that never overflowed places its points byte-identically. See ADR-111.
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
   */
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
        if (length <= 0) return placed;
        const base = baseDirection(id);
        const local = wrapRotation(
          Math.atan2(placed.y - pivot.y, placed.x - pivot.x) * DEGREES - base,
        );
        const bounded = limitRotation(limit, local);
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
  let iterations = 0;
  let residual = residualNow();
  let stalled = false;
  // How far the branches still disagreed about a shared member in the last inward pass.
  let spread = 0;
  while (residual > FABRIK_TOLERANCE && iterations < FABRIK_MAX_ITERATIONS) {
    iterations += 1;
    spread = 0;
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
      const pivot = place(tips.get(id)!, pivots.get(id)!, lengthOf(id));
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
    // Nothing moved, so nothing can. An unreachable goal reaches full extension in one pass and
    // holds, and exiting here rather than at the cap is what makes `iterations` mean work done and
    // lets `stalled` tell a caller that a larger cap is not the answer.
    let moved = 0;
    for (const id of ids) {
      const was = before.get(id)!;
      const now = tips.get(id)!;
      moved = Math.max(moved, Math.abs(was.x - now.x), Math.abs(was.y - now.y));
    }
    if (moved === 0) {
      stalled = true;
      break;
    }
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
    if (atBound(limit, local)) atBounds.push(id);
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
  /** The worst addressed-leaf shortfall after the last outward pass. */
  readonly residual: number;
  readonly iterations: number;
  /** The members whose published local angle sits exactly on a declared bound, canonical order. */
  readonly atBound: readonly string[];
  /** How far branches still disagreed about a shared member in the last inward pass. */
  readonly spread: number;
  /** Whether the last pass moved nothing. */
  readonly stalled: boolean;
}

/**
 * The one owner of how a FABRIK outcome is named, so the order below is pinned at its boundaries
 * rather than only through whichever rigs happen to land near them.
 *
 * A bound is the most specific cause and an authored one, so a miss with any joint at a bound is
 * `limited` first. Within tolerance is `converged`. A disagreement is named before the stall or
 * the cap, because neither more iterations nor a different stall test answers branches that pull
 * one member to two places, and it is named only when the last pass's spread is strictly above
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

/** Solve once with the authored seed, and search alternatives only for a conflicted baseline. */
export function solveFabrik(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
): FabrikSolution {
  return selectFabrik(root, members, flip, solveFabrikAttempt);
}
