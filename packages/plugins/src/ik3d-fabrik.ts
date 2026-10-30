import { unreachable } from "@motion5/core/plugin-api";
import { FABRIK_TOLERANCE, iterativeQuality } from "./fabrik";
import {
  FabrikIncumbent,
  fabrikPassBudget,
  fabrikRelativeMove,
  type FabrikConstraint,
  type FabrikPassMotion,
} from "./fabrik-cap";
import {
  NO_LEGAL_STARTS,
  addressedReach,
  arcLegalStarts,
  goalsWithinReach,
  selectFabrik,
  type LegalStarts,
} from "./fabrik-select";
import { DEFAULT_FABRIK_SEED, heldFromSeed, type FabrikSeed } from "./fabrik-seed";
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
  type JointLimit3d,
} from "./ik3d-constraint";
import { restoreResult3d, type SolveResult3d } from "./ik3d-result";
import { ROOT_INDEX, defaultTreeSeed3d, seedTree3d, type SeedTree3d } from "./ik3d-seed";

/** 3D FABRIK for chains the closed form skips: serial chains, trees. Roll = rest frame swung onto solved direction; pure over root/members/pole -> seek replays identically. */

const ROOT = ROOT_INDEX;

const X_AXIS: Vec3 = [1, 0, 0];

/** Canonical geometry + addressed aims, shared across attempts and retry stages. */
function prepareSeedTree3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
): {
  tree: SeedTree3d;
  readings: GoalReading[];
  byId: ReadonlyMap<string, ChainMember3d>;
  ids: readonly string[];
  chain: readonly ChainMember3d[];
  serialDepth: () => number;
  addressed: readonly number[];
  addressedIds: readonly string[];
} {
  const { byId, ids, serialDepth, childCount, leaves } = canonicalChain(members);
  const chain = ids.map((id) => byId.get(id)!);
  const indexOf = new Map(ids.map((id, index) => [id, index]));
  const parent = chain.map(({ base }) => indexOf.get(base) ?? ROOT);
  const lengths = chain.map(({ length }) => segmentExtent(length));
  const offsets = chain.map(({ offset }): Vec3 => [offset.x, offset.y, offset.z]);
  const compactOffsets = offsets.map((vector) =>
    vector[0] === 0 && vector[1] === 0 && vector[2] === 0 ? undefined : vector,
  );
  const rests = chain.map(({ rest }) => matrixFromEuler3d(rest));
  const limits = chain.map(({ limit }): JointLimit3d => limit ?? FREE_JOINT3D);
  const inner = ids.find((id) => (childCount.get(id) ?? 0) > 0 && byId.get(id)!.goal !== undefined);
  if (inner !== undefined)
    throw new Error(`Solver goal on member "${inner}" is not on a leaf of the chain.`);
  const addressedIds = leaves.filter((id) => byId.get(id)!.goal !== undefined);
  const addressed = addressedIds.map((id) => indexOf.get(id)!);
  const rootPoint: Vec3 = [root.x, root.y, root.z];
  const paths = addressed.map((leaf) => {
    const path: number[] = [];
    for (let cursor = leaf; cursor !== ROOT; cursor = parent[cursor]!) path.unshift(cursor);
    return path;
  });
  const readings: GoalReading[] = [];
  const aims = addressed.map((leaf, step): Vec3 => {
    const goal = chain[leaf]!.goal!;
    const reading = readGoal(ids[leaf]!, [
      ["x", goal.x],
      ["y", goal.y],
      ["z", goal.z],
    ]);
    const reach = (): number =>
      paths[step]!.reduce((sum, index) => sum + lengths[index]! + norm3(offsets[index]!), 0);
    const [x, y, z] = aimPoint(reading, rootPoint, reach);
    readings.push(reading);
    return [x!, y!, z!];
  });
  return {
    tree: {
      rootPoint,
      rootMatrix: matrixFromEuler3d(root),
      parent,
      lengths,
      offsets: compactOffsets,
      rests,
      limits,
      paths,
      aims,
    },
    readings,
    byId,
    ids,
    chain,
    serialDepth,
    addressed,
    addressedIds,
  };
}

type PreparedSeedTree3d = ReturnType<typeof prepareSeedTree3d>;

/** Point at distance `length` from `from` toward `to`: zero length -> `from`; zero distance -> world +x; infinite ratio -> scaled by largest component. */
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

/** One attempt per seed side, compromise rule: alternating inward/outward passes until the worst addressed miss is inside `FABRIK_TOLERANCE` or the budget settles. */
export function solveTree3dAttempt(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
  flip: boolean,
  rule: CompromiseRule,
  seed: FabrikSeed = DEFAULT_FABRIK_SEED,
  preparedTree?: PreparedSeedTree3d,
): SolveResult3d<IterativeQuality> {
  const prepared = preparedTree ?? prepareSeedTree3d(root, members);
  const { byId, ids, serialDepth, chain, addressed, addressedIds, readings } = prepared;
  const { parent, lengths, offsets: offset, rests, limits, rootPoint, rootMatrix } = prepared.tree;
  const count = ids.length;
  // Limited children, canonical order: inward pass bounds member frame by their limits.
  const limitedChildren = new Array<number[] | undefined>(count);
  for (let index = 0; index < count; index += 1)
    if (parent[index] !== ROOT && constrains(limits[index]!))
      (limitedChildren[parent[index]!] ??= []).push(index);
  const pullsById = branchPulls(byId, addressedIds);
  const pulls = ids.map((id) => pullsById.get(id) ?? 0);
  const pivots: Vec3[] = new Array<Vec3>(count);
  const frames: Matrix3[] = new Array<Matrix3>(count);
  const settled: Vec3[] = new Array<Vec3>(count);
  // Largest coordinate magnitude down each path from root, re-measured every outward pass: the scale movement is judged against.
  const pathScales: number[] = new Array<number>(count);
  const rootScale = Math.max(Math.abs(root.x), Math.abs(root.y), Math.abs(root.z));
  // Limited member's legal local from the last outward pass, published as-is not re-derived from frames, plus its bound flag; free members hold `undefined`/`false`.
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
  const aims: Vec3[] = new Array<Vec3>(count);
  for (let step = 0; step < addressed.length; step += 1)
    aims[addressed[step]!] = prepared.tree.aims[step]!;
  // Tips start at seed: arc, or legal seed when arc needs hinge-pose projection; 3D authors never set `flip` -> authored solve starts on pole's side.
  const tips: Vec3[] = seedTree3d(prepared.tree, pole, flip, seed);

  /** Outward: sole enforcer of lengths, frames, limits; depth order -> member reads base's final frame. Limited local -> nearest legal, tip re-placed: legal by construction, not clamped. */
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
  // Inward frame a limited member settled earlier this pass: last outward frame swung onto inward direction; only limited members with a member base write one.
  const inwardFrames: (Matrix3 | undefined)[] = new Array<Matrix3 | undefined>(count);
  /** Inward pivot: `length` back from settled tip toward old pivot; limited children turn the frame via `boundBaseFrame3d`, deepest-first; pivot re-placed on bounded +x. */
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
  // Incumbent pass inward spread: branch agreement is part of the pose.
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
  if (heldFromSeed(seed) && incumbent.offer(residual)) saveIncumbent();
  while (residual > FABRIK_TOLERANCE && budget.admits(iterations, residual)) {
    iterations += 1;
    spread = 0;
    inwardFrames.fill(undefined);
    for (const leaf of addressed)
      proposals[leaf]!.push({ kind: "goal", point: aims[leaf]!, weight: 1 });
    // Inward pass, deepest first: member settles on proposals, then proposes its pivot, un-offset via base frame, to base. Root never moves -> no proposal.
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

  // Publish incumbent pass, not the last; nothing held if no pass ran. Budget settles at a fixed point: no movement, or two consecutive passes moved only by rounding.
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

/** Retry scale: longest addressed path holding a non-planar hinge, world units; max = one conservative selector scale. Goal-free siblings, planar paths never enlarge it. */
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

/** Legal starts for a 3D rig: arc-default non-planar hinge pays centre, legal-seed default pays reach-gated stages; descent follows only while each goal sits within path reach. */
export function legalStarts3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
  preparedTree?: PreparedSeedTree3d,
): LegalStarts {
  const offsetExtent = ({ offset }: ChainMember3d): number => norm3([offset.x, offset.y, offset.z]);
  const within = (): boolean =>
    goalsWithinReach(members, offsetExtent, ({ goal }) =>
      norm3([goal!.x - root.x, goal!.y - root.y, goal!.z - root.z]),
    );
  const reach = legalRetryReach3d(members);
  if (reach > 0) {
    const seed = defaultTreeSeed3d((preparedTree ?? prepareSeedTree3d(root, members)).tree, pole);
    switch (seed.kind) {
      case "arc":
        return arcLegalStarts(reach, within());
      case "legal":
        return { kind: within() ? "staged-then-descent" : "staged", reach };
      default:
        return unreachable(seed);
    }
  }
  if (!members.some(({ limit }) => limit !== undefined && constrains(limit)))
    return NO_LEGAL_STARTS;
  return arcLegalStarts(addressedReach(members, offsetExtent), within());
}

/** Authored-side attempt, conflicted-baseline alternatives, opposite-seed centroid retry, legalStarts3d starts: shared selector owns their order and ceiling. */
function selectTree3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  pole: Pole3d,
): SolveResult3d<IterativeQuality> {
  // Canonical geometry + addressed goals: invariant across sides and stages.
  const prepared = prepareSeedTree3d(root, members);
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
    ) => solveTree3dAttempt(frame, chain, pole, flip, rule, seed, prepared),
    legalStarts3d(root, members, pole, prepared),
  );
}

/** Member re-read through frame readers: non-finite length/offset reads as zero, as a delivered one does. Once per solve, before magnitude policy or attempt reads a field. */
function rereadMember3d(member: ChainMember3d): ChainMember3d {
  return {
    ...member,
    length: readNumber(member.length),
    offset: readPivotOffset3d(member.offset),
  };
}

/** Member image at `factor`: world-unit fields scaled, orientation kept. */
function scaleMember(member: ChainMember3d, factor: number): ChainMember3d {
  const { goal } = member;
  return {
    ...member,
    length: member.length * factor,
    offset: scaleOffset3d(member.offset, factor),
    ...(goal === undefined ? {} : { goal: scaleFrame3d(goal, factor) }),
  };
}

/** 3D tree solve, total over finite rigs: magnitude policy picks native or exact power-of-two image; solve is scale-free, so angles match; residuals restore via `restoreResult3d`. */
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
