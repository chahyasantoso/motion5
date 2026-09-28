import { unreachable } from "../lang/exhaustive";
import { FABRIK_TOLERANCE, iterativeQuality } from "./fabrik";
import {
  FabrikIncumbent,
  fabrikPassBudget,
  fabrikRelativeMove,
  type FabrikConstraint,
  type FabrikPassMotion,
} from "./fabrik-cap";
import { selectFabrik, type FabrikSeed } from "./fabrik-select";
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
import {
  boundBaseFrame3d,
  constrains,
  FREE_JOINT3D,
  limitLocal3d,
  nonPlanarHinge3d,
} from "./ik3d-constraint";
import { restoreResult3d, type SolveResult3d } from "./ik3d-result";
import { ROOT_INDEX, seedTree3d } from "./ik3d-seed";

/**
 * FABRIK in three dimensions: the iterative strategy for every 3D chain that is not the closed
 * form's two bones, long serial chains and branching trees alike (issue #500 phase 5, ADR-122).
 *
 * **What is shared with 2D, and why only that.** Canonical member order, child counts, leaves and
 * serial depth are `ik-topology.ts`'s; goal reading, the direction stand-in and the miss are
 * `ik-goal-reading.ts`'s; branch pulls, the `Pull` union, relative weights and the rule dispatch
 * are `ik-goal.ts`'s; the tolerance and the naming of an outcome as one quality kind are
 * `fabrik.ts`'s; the seed half-angle, depth-scaled cap and progress-gated budget are
 * `fabrik-seed.ts` and `fabrik-cap.ts` (ADR-115, ADR-126); the closed quality selector is
 * `fabrik-select.ts`'s (#490, ADR-126); the magnitude policy is `ik-scale.ts`'s. Each of those
 * questions has the same contract in both dimensions. Vector arithmetic does not, so the passes,
 * the placement and the compromise geometry are stated here and in `ik3d-compromise.ts` over
 * `Vec3`, rather than behind a dimension flag in the 2D file.
 *
 * **Orientation, which positional FABRIK does not determine.** Positions fix a member's direction,
 * two of its three rotational degrees of freedom. The third, roll about the bone, is reconstructed
 * deterministically: each member's world frame is its rest frame (its authored `fk3d` rest
 * orientation under its parent's solved frame, ADR-116) turned by `swingFrame3d`, the one minimal
 * swing onto its solved direction. So a member adds no roll its rest pose did not have, a rig with
 * no authored rest reconstructs pure swings from its parent, and the planar subset reduces to the
 * 2D solve's angles. The reconstruction runs inside every outward pass, not only at the end,
 * because a child's pivot offset is read in its parent's full rotated frame, roll included
 * (ADR-117).
 *
 * **Bend plane.** Each root-to-leaf path is seeded on a constant-curvature arc in the plane the
 * closed form bends in, read through `bendBasis3d`, the one owner of the pole rule (ADR-118):
 * toward an authored pole, else the root-local +z rule. `flip` mirrors the arc across the line to
 * the goal; a conflicted baseline pays its three alternatives and a limited or capped baseline
 * pays one opposite-seed retry with the centroid rule (ADR-128). No 3D author sets it, so an
 * authored solve always starts on the pole's side.
 *
 * The solve is a pure function of the root, the members and the pole: no state survives a call and
 * nothing is warm-started, so a reverse scrub and a random seek republish the forward pass byte for
 * byte (ADR-111).
 */

/** The index `parent` holds for a member that hangs from the root: the seed's own convention. */
const ROOT = ROOT_INDEX;

const X_AXIS: Vec3 = [1, 0, 0];

/**
 * The point at distance `length` from `from`, toward `to`: the 2D `place` over `Vec3`, with the
 * same two chosen degeneracies (a zero length collapses onto `from`, a zero distance takes world
 * +x) and the same overflow guard, which normalises by the largest component only when `length /
 * distance` is not finite, so every ordinary rig takes the plain expression.
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
 * One attempt from one seed side and one compromise rule, over members as `solveTree3d` read them.
 *
 * The structure is the 2D attempt's: seed every addressed path, run an outward pass, then alternate
 * inward and outward passes until the worst addressed miss is inside `FABRIK_TOLERANCE`, the shared
 * pass budget settles the attempt at a fixed point (a pass that moved nothing, or two consecutive
 * passes that moved by rounding only, issue #519), or it denies another pass. Limited
 * children constrain both directions; a sub-base settles on the influence-weighted compromise of
 * the tips its branches propose, each branch un-offsetting its proposed pivot through its base's
 * current full frame, so positions are averaged and orientations never are (ADR-054).
 *
 * The chain is read once into arrays indexed by canonical position, where a member's base always
 * sits at a smaller index than the member (canonical order is by depth), so both passes are plain
 * index walks: no per-pass snapshot and no per-pass proposal map, only the vectors the arithmetic
 * itself produces. Movement is measured against the tips the previous outward pass settled, which
 * are the tips every pass starts from.
 */
export function solveTree3dAttempt(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
  flip: boolean,
  rule: CompromiseRule,
  seed?: FabrikSeed,
): SolveResult3d<IterativeQuality> {
  const { byId, ids, serialDepth, childCount, leaves } = canonicalChain(members);
  const count = ids.length;
  const chain = ids.map((id) => byId.get(id)!);
  const indexOf = new Map(ids.map((id, index) => [id, index]));
  // A cycle was refused by `canonicalChain`, so every base is the root or an earlier index.
  const parent = chain.map(({ base }) => indexOf.get(base) ?? ROOT);
  const lengths = chain.map(({ length }) => segmentExtent(length));
  const offsets = chain.map(({ offset }): Vec3 => [offset.x, offset.y, offset.z]);
  // A zero offset composes its member's pivot on its base's tip, so it is skipped, not multiplied.
  const offset = offsets.map((vector) =>
    vector[0] === 0 && vector[1] === 0 && vector[2] === 0 ? undefined : vector,
  );
  const rests = chain.map(({ rest }) => matrixFromEuler3d(rest));
  const limits = chain.map(({ limit }) => limit ?? FREE_JOINT3D);
  // Each member's limited children in canonical order, whose limits the inward pass bounds its
  // frame by (ADR-126). A member with none takes the plain inward step and its bytes.
  const limitedChildren = new Array<number[] | undefined>(count);
  for (let index = 0; index < count; index += 1)
    if (parent[index] !== ROOT && constrains(limits[index]!))
      (limitedChildren[parent[index]!] ??= []).push(index);
  const inner = ids.find((id) => (childCount.get(id) ?? 0) > 0 && byId.get(id)!.goal !== undefined);
  if (inner !== undefined)
    throw new Error(`Solver goal on member "${inner}" is not on a leaf of the chain.`);
  const addressedIds = leaves.filter((id) => byId.get(id)!.goal !== undefined);
  const addressed = addressedIds.map((id) => indexOf.get(id)!);
  const pullsById = branchPulls(byId, addressedIds);
  const pulls = ids.map((id) => pullsById.get(id) ?? 0);
  const rootMatrix = matrixFromEuler3d(root);
  const rootPoint: Vec3 = [root.x, root.y, root.z];
  const pivots: Vec3[] = new Array<Vec3>(count);
  const frames: Matrix3[] = new Array<Matrix3>(count);
  const settled: Vec3[] = new Array<Vec3>(count);
  // The largest coordinate magnitude from the root's point down each member's path, re-measured by
  // every outward pass: the scale its movement is judged against (issue #519).
  const pathScales: number[] = new Array<number>(count);
  const rootScale = Math.max(Math.abs(root.x), Math.abs(root.y), Math.abs(root.z));
  // A limited member's legal local orientation from the last outward pass, published as it is
  // rather than re-derived from the frames, and whether it rests on a bound. Free members hold
  // `undefined` and `false` and publish exactly the expression they always did.
  const locals: (Matrix3 | undefined)[] = new Array<Matrix3 | undefined>(count);
  const bounded: boolean[] = new Array<boolean>(count).fill(false);
  const parentFrame = (index: number): Matrix3 => {
    const base = parent[index]!;
    return base === ROOT ? rootMatrix : frames[base]!;
  };
  const originOf = (index: number): Vec3 => {
    const base = parent[index]!;
    return base === ROOT ? rootPoint : tips[base]!;
  };
  /** The member indices from the root's first member down to `leaf`. */
  const pathOf = (leaf: number): readonly number[] => {
    const path: number[] = [];
    for (let cursor = leaf; cursor !== ROOT; cursor = parent[cursor]!) path.unshift(cursor);
    return path;
  };

  const readings: GoalReading[] = [];
  const aims: Vec3[] = new Array<Vec3>(count);
  for (const leaf of addressed) {
    const goal = chain[leaf]!.goal!;
    const reading = readGoal(ids[leaf]!, [
      ["x", goal.x],
      ["y", goal.y],
      ["z", goal.z],
    ]);
    const reach = (): number =>
      pathOf(leaf).reduce((sum, index) => sum + lengths[index]! + norm3(offsets[index]!), 0);
    const [x, y, z] = aimPoint(reading, rootPoint, reach);
    readings.push(reading);
    aims[leaf] = [x!, y!, z!];
  }
  // Every tip starts where the seed puts it: the arc, or the legal seed when the arc requires a
  // hinge-pose projection (`ik3d-seed.ts`, ADR-129). The first outward pass enforces every length.
  const tips: Vec3[] = seedTree3d(
    {
      rootPoint,
      rootMatrix,
      parent,
      lengths,
      offsets: offset,
      rests,
      limits,
      paths: addressed.map(pathOf),
      aims: addressed.map((leaf) => aims[leaf]!),
    },
    pole,
    flip,
    seed,
  );

  /**
   * The outward pass: the only place lengths are enforced, the only place a frame is built and the
   * only place a joint limit is enforced, in canonical depth order, so each member reads its base's
   * final frame and tip. It is `fk3d`'s own composition over the current tip guesses, with the
   * orientation reconstructed by the minimal swing from the member's rest frame; a zero-length
   * member keeps its rest frame, which is what it composes, and its children hang where the solve
   * put them. A limited member's proposed local orientation is then replaced by the legal one
   * nearest it (`limitLocal3d`, ADR-123) and its tip re-placed along the legal direction, so every
   * later pass starts from a legal pose and the published orientation is legal because the pose
   * is, not because the output was clamped afterwards (ADR-108). Answers how far the tips moved
   * from where the previous outward pass settled them, which the budget judges (issue #519): the
   * largest `fabrikRelativeMove`, each tip's coordinate move over the magnitudes on its own path,
   * and the largest coordinate move itself.
   */
  const outward = (): FabrikPassMotion => {
    let relative = 0;
    let farthest = 0;
    for (let index = 0; index < count; index += 1) {
      const frame = parentFrame(index);
      const origin = originOf(index);
      const shift = offset[index];
      const pivot = shift === undefined ? origin : add3(origin, multiplyVector3(frame, shift));
      const length = lengths[index]!;
      const placed = place3d(pivot, tips[index]!, length);
      const rest = multiplyMatrix3(frame, rests[index]!);
      const swung = length > 0 ? swingFrame3d(rest, subtract3(placed, pivot)) : rest;
      const limited = limitLocal3d(limits[index]!, () =>
        length > 0 ? multiplyMatrix3(transposeMatrix3(frame), swung) : rests[index]!,
      );
      bounded[index] = limited.atBound;
      let solved = swung;
      let tip = placed;
      switch (limited.kind) {
        case "unmoved":
          locals[index] = undefined;
          break;
        case "moved":
          locals[index] = limited.local;
          solved = multiplyMatrix3(frame, limited.local);
          if (length > 0) tip = add3(pivot, scale3(axisX3(solved), length));
          break;
        default:
          unreachable(limited);
      }
      const base = parent[index]!;
      const scale = Math.max(
        base === ROOT ? rootScale : pathScales[base]!,
        Math.abs(pivot[0]),
        Math.abs(pivot[1]),
        Math.abs(pivot[2]),
        Math.abs(tip[0]),
        Math.abs(tip[1]),
        Math.abs(tip[2]),
      );
      pathScales[index] = scale;
      const was = settled[index];
      if (was !== undefined) {
        const moved = Math.max(
          Math.abs(was[0] - tip[0]),
          Math.abs(was[1] - tip[1]),
          Math.abs(was[2] - tip[2]),
        );
        relative = Math.max(relative, fabrikRelativeMove(moved, scale));
        farthest = Math.max(farthest, moved);
      }
      settled[index] = tip;
      pivots[index] = pivot;
      tips[index] = tip;
      frames[index] = solved;
    }
    return { relative, moved: farthest };
  };
  // The frame each limited member settled on earlier in the current inward pass: its last outward
  // frame swung onto its inward direction. Only limited members with a member base write one.
  const inwardFrames: (Matrix3 | undefined)[] = new Array<Matrix3 | undefined>(count);
  /**
   * Where the inward pass puts a member's pivot: `length` back from its settled tip toward its old
   * pivot, then, only for a member with limited children, with its frame turned by
   * `boundBaseFrame3d` for each of them in canonical order and the pivot re-placed behind the tip
   * along the bounded +x (ADR-126). Children sit later in canonical order and the walk is deepest
   * first, so every child's inward frame is already written. A member with no limited child, or
   * whose children are legal, returns the plain placement.
   */
  const inwardPivot = (index: number, tip: Vec3): Vec3 => {
    const length = lengths[index]!;
    const placed = place3d(tip, pivots[index]!, length);
    const children = limitedChildren[index];
    if (children === undefined || length <= 0) return placed;
    let frame = swingFrame3d(frames[index]!, subtract3(tip, placed));
    let moved = false;
    for (const child of children) {
      const childFrame = inwardFrames[child];
      if (childFrame === undefined) continue;
      const bound = boundBaseFrame3d(limits[child]!, childFrame, frame);
      switch (bound.kind) {
        case "unmoved":
          break;
        case "moved":
          frame = bound.frame;
          moved = true;
          break;
        default:
          unreachable(bound);
      }
    }
    return moved ? subtract3(tip, scale3(axisX3(frame), length)) : placed;
  };
  const residualNow = (): number => {
    let worst = 0;
    for (const leaf of addressed)
      worst = Math.max(worst, norm3(subtract3(tips[leaf]!, aims[leaf]!)));
    return worst;
  };

  outward();
  const constraint: FabrikConstraint = limits.some(constrains) ? "limited" : "free";
  const budget = fabrikPassBudget(serialDepth(), constraint, FABRIK_TOLERANCE);
  const proposals: Pull3d[][] = Array.from({ length: count }, () => []);
  let iterations = 0;
  let residual = residualNow();
  let stalled = false;
  let spread = 0;
  const incumbent = new FabrikIncumbent();
  const bestTips: (Vec3 | undefined)[] = new Array<Vec3 | undefined>(count);
  const bestPivots: (Vec3 | undefined)[] = new Array<Vec3 | undefined>(count);
  const bestFrames: (Matrix3 | undefined)[] = new Array<Matrix3 | undefined>(count);
  const bestLocals: (Matrix3 | undefined)[] = new Array<Matrix3 | undefined>(count);
  const bestBounded: boolean[] = new Array<boolean>(count);
  // The incumbent pass's inward spread: whether its branches agreed is part of that pass's pose.
  let bestSpread = 0;
  const saveIncumbent = (): void => {
    bestSpread = spread;
    for (let index = 0; index < count; index += 1) {
      bestTips[index] = tips[index];
      bestPivots[index] = pivots[index];
      bestFrames[index] = frames[index];
      bestLocals[index] = locals[index];
      bestBounded[index] = bounded[index]!;
    }
  };
  while (residual > FABRIK_TOLERANCE && budget.admits(iterations, residual)) {
    iterations += 1;
    spread = 0;
    inwardFrames.fill(undefined);
    for (const leaf of addressed)
      proposals[leaf]!.push({ kind: "goal", point: aims[leaf]!, weight: 1 });
    // The inward pass, deepest first: each member settles on its proposals, then proposes its
    // pivot, un-offset through its base's frame, to that base. The root is the one point a solve
    // may not move, so a proposal for it is never made.
    for (let index = count - 1; index >= 0; index -= 1) {
      const proposed = proposals[index]!;
      if (proposed.length > 0) {
        const compromise = compromise3d(proposed, rule);
        spread = Math.max(spread, compromise.spread);
        tips[index] = compromise.point;
        proposed.length = 0;
      }
      const base = parent[index]!;
      if (base === ROOT) continue;
      const tip = tips[index]!;
      const pivot = inwardPivot(index, tip);
      if (constrains(limits[index]!) && lengths[index]! > 0)
        inwardFrames[index] = swingFrame3d(frames[index]!, subtract3(tip, pivot));
      const own = offset[index];
      const shift = own === undefined ? undefined : multiplyVector3(frames[base]!, own);
      proposals[base]!.push({
        kind: "branch",
        point: shift === undefined ? pivot : subtract3(pivot, shift),
        weight: pulls[index]!,
        reach: {
          centre: shift === undefined ? tip : subtract3(tip, shift),
          radius: lengths[index]!,
        },
      });
    }
    const motion = outward();
    residual = residualNow();
    if (incumbent.offer(residual)) saveIncumbent();
    if (budget.settles(motion)) {
      stalled = true;
      break;
    }
  }

  // Publish the incumbent pass, not the last one (ADR-128); nothing is held when no pass ran.
  const held = incumbent.residual;
  if (held !== undefined) {
    for (let index = 0; index < count; index += 1) {
      tips[index] = bestTips[index]!;
      pivots[index] = bestPivots[index]!;
      frames[index] = bestFrames[index]!;
      locals[index] = bestLocals[index];
      bounded[index] = bestBounded[index]!;
    }
    residual = held;
    spread = bestSpread;
  }

  const rotations3d: Record<string, Euler3d> = {};
  const residuals: Record<string, number> = {};
  let worst = residual;
  addressed.forEach((leaf, step) => {
    const miss = goalMiss(readings[step]!, tips[leaf]!);
    residuals[ids[leaf]!] = miss;
    worst = Math.max(worst, miss);
  });
  const atBounds: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const local =
      locals[index] ?? multiplyMatrix3(transposeMatrix3(parentFrame(index)), frames[index]!);
    rotations3d[ids[index]!] = Object.freeze(eulerFromMatrix3d(local));
    if (bounded[index]) atBounds.push(ids[index]!);
  }
  const quality = iterativeQuality({
    residual: worst,
    iterations,
    atBound: atBounds,
    spread,
    stalled,
  });
  return Object.freeze({
    rotations3d: Object.freeze(rotations3d),
    residuals: Object.freeze(residuals),
    quality: Object.freeze(quality),
  });
}

/**
 * The tree solve at one magnitude through the shared closed selector: the authored-side attempt,
 * three alternatives for a conflicted baseline and one opposite-seed centroid retry for a limited
 * or capped baseline (#490, ADR-126, ADR-128). A near miss with a non-planar hinge can pay
 * two legal quartiles and, only if both still miss, one endpoint-biased start. The selector owns
 * that bounded budget, not this attempt.
 */
/**
 * Retry scale from addressed paths with a non-planar hinge only. Siblings without goals, orphan
 * members and unrelated planar paths must not enlarge the 2% near-miss window. The maximum
 * eligible path gives the selector one conservative world-unit scale for multiple leaf goals.
 */
export function legalRetryReach3d(members: readonly ChainMember3d[]): number {
  const byId = new Map(members.map((member) => [member.id, member]));
  let reach = 0;
  for (const leaf of members) {
    if (leaf.goal === undefined) continue;
    let pathReach = 0;
    let eligible = false;
    let current: ChainMember3d | undefined = leaf;
    const seen = new Set<string>();
    while (current !== undefined && !seen.has(current.id)) {
      seen.add(current.id);
      eligible ||= nonPlanarHinge3d(current.limit ?? FREE_JOINT3D);
      pathReach +=
        segmentExtent(current.length) +
        norm3([current.offset.x, current.offset.y, current.offset.z]);
      current = byId.get(current.base);
    }
    if (eligible) reach = Math.max(reach, pathReach);
  }
  return reach;
}

function selectTree3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
): SolveResult3d<IterativeQuality> {
  return selectFabrik(
    root,
    members,
    false,
    (
      frame: WorldFrame3d,
      chain: readonly ChainMember3d[],
      flip: boolean,
      rule: CompromiseRule,
      seed?: FabrikSeed,
    ) => solveTree3dAttempt(frame, chain, pole, flip, rule, seed),
    legalRetryReach3d(members),
  );
}

/**
 * A member re-read through the frame readers, as `solveTwoBone3d` re-reads its two, so a direct
 * caller's non-finite length or offset component reads as zero exactly as a delivered one does.
 * Done once per solve, before the magnitude policy reads it, so neither the policy, the image nor
 * any attempt reads a raw field.
 */
function rereadMember3d(member: ChainMember3d): ChainMember3d {
  return {
    ...member,
    length: readNumber(member.length),
    offset: readPivotOffset3d(member.offset),
  };
}

/** A member's image under `factor`: every world-unit field scaled, orientation carried. */
function scaleMember(member: ChainMember3d, factor: number): ChainMember3d {
  const { goal } = member;
  return {
    ...member,
    length: member.length * factor,
    offset: scaleOffset3d(member.offset, factor),
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
  const read = members.map(rereadMember3d);
  const magnitudes = [root.x, root.y, root.z, ...poleMagnitudes(pole)];
  for (const { length, offset, goal } of read) {
    magnitudes.push(length, offset.x, offset.y, offset.z);
    if (goal !== undefined) magnitudes.push(goal.x, goal.y, goal.z);
  }
  const magnitude = magnitudeOf(magnitudes);
  switch (magnitude.kind) {
    case "native":
      return selectTree3d(root, read, pole);
    case "rescaled": {
      const factor = 2 ** -magnitude.exponent;
      const image = selectTree3d(
        scaleFrame3d(root, factor),
        read.map((member) => scaleMember(member, factor)),
        scalePole(pole, factor),
      );
      return restoreResult3d(image, magnitude.exponent);
    }
    default:
      return unreachable(magnitude);
  }
}
