import { unreachable } from "@motion5/core/plugin-api";
import { FABRIK_TOLERANCE } from "./fabrik";
import {
  add3,
  axisX3,
  cross3,
  dot3,
  eulerFromMatrix3d,
  matrixFromEuler3d,
  multiplyMatrix3,
  norm3,
  normalize3,
  rotationAboutAxis3d,
  scale3,
  subtract3,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "./frame3d";
import { bendBasis3d, rereadPole3d, UNBOUND_POLE3D, type Pole3d } from "./ik3d-analytic";
import type { ChainMember3d } from "./ik3d-chain";
import { nonPlanarHinge3d, renderedLegalHinge3d, type JointLimit3d } from "./ik3d-constraint";
import type { SolveResult3d } from "./ik3d-result";
import type { ClosedFormQuality } from "./ik-result";
import { canonicalChain } from "./ik-topology";

/**
 * Legal-hinge serial recovery: fallback for a constrained 3D chain whose tree solve missed; `reached` only for legal hinges and an FK tip within `FABRIK_TOLERANCE`.
 */

/** Hinge axis must be this close to unit length; the loader normalizes axes. */
const AXIS_UNIT_TOLERANCE = 1e-12;

/** Shorter side vector names no side → deterministic transverse basis. */
const BASIS_DEGENERACY = 1e-9;

/** Slack for a block resultant closing its polygon interval. */
const RADIUS_TOLERANCE = FABRIK_TOLERANCE / 8;

/** Bisection steps along one bracketing joint-space segment. */
const BRACKET_BISECTIONS = 48;

/**
 * Grid fractions per hinge range, tried in order; a lone block's interval is a point, so it brackets from `COARSE_GRID`.
 */
const CENTRE_GRID: readonly number[] = Object.freeze([0.5]);
const COARSE_GRID: readonly number[] = Object.freeze([0, 0.5, 1]);
const FINE_GRID: readonly number[] = Object.freeze([0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]);
const POLYGON_GRIDS: readonly (readonly number[])[] = Object.freeze([
  CENTRE_GRID,
  COARSE_GRID,
  FINE_GRID,
]);
const BRACKET_GRIDS: readonly (readonly number[])[] = Object.freeze([COARSE_GRID, FINE_GRID]);

const SEARCH_SAMPLES = 16;
const SEARCH_SWEEPS = 3;
const SEARCH_GOLDEN_STEPS = 24;
const GOLDEN = (Math.sqrt(5) - 1) / 2;

/** Private unfrozen units: frozen shared arrays would add a second element shape and deoptimize hot loops. */
const UNIT_X: Vec3 = [1, 0, 0];
const IDENTITY: Matrix3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/** Largest chain the bounded grids are priced for: five members → four hinges. */
const MAX_MEMBERS = 5;

type HingeLimit3d = Extract<JointLimit3d, { readonly kind: "hinge" }>;

interface LegalHinge {
  readonly member: ChainMember3d;
  readonly limit: HingeLimit3d;
  readonly min: number;
  readonly max: number;
}

interface Block {
  readonly free: ChainMember3d;
  readonly hinges: readonly LegalHinge[];
}

/** Validated rig; everything below trusts these fields. */
interface SerialRig {
  readonly rootFrame: Matrix3;
  readonly origin: Vec3;
  readonly goal: Vec3;
  readonly target: Vec3;
  readonly distance: number;
  readonly blocks: readonly Block[];
  readonly hinges: readonly LegalHinge[];
  readonly leafId: string;
}

/** Every block's local resultant for one angle set, in the leader's frame. */
interface Sample {
  readonly angles: readonly number[];
  readonly vectors: readonly Vec3[];
  readonly lengths: readonly number[];
}

/** Where the distance lies against a sample's polygon interval. */
type Reach = "short" | "within" | "long";

/** Attainable resultant lengths of freely orientable vectors: the polygon interval. */
function radialInterval(lengths: readonly number[]): readonly [number, number] {
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return [Math.max(0, 2 * Math.max(...lengths) - total), total];
}

function reachOf(sample: Sample, distance: number): Reach {
  const [minimum, maximum] = radialInterval(sample.lengths);
  if (maximum < distance - RADIUS_TOLERANCE) return "short";
  if (minimum > distance + RADIUS_TOLERANCE) return "long";
  return "within";
}

function legalHinge(member: ChainMember3d, limit: HingeLimit3d): LegalHinge | undefined {
  const { axis, range } = limit;
  switch (range.kind) {
    case "free":
      return undefined;
    case "range":
      break;
    default:
      return unreachable(range);
  }
  if (!nonPlanarHinge3d(limit) || ![...axis, range.min, range.max].every(Number.isFinite))
    return undefined;
  if (Math.abs(norm3(axis) - 1) > AXIS_UNIT_TOLERANCE) return undefined;
  if (range.max < range.min || range.max - range.min > 360) return undefined;
  return { member, limit, min: range.min, max: range.max };
}

/** Rig in recovery scope, split into free-led blocks, or `undefined` for any other shape. */
function readSerialRig(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
): SerialRig | undefined {
  if (members.length < 2 || members.length > MAX_MEMBERS) return undefined;
  const { byId, ids, leaves } = canonicalChain(members);
  if (leaves.length !== 1) return undefined;
  const chain = ids.map((id) => byId.get(id)!);
  const leaf = chain[chain.length - 1]!;
  const goal = leaf.goal;
  if (goal === undefined) return undefined;
  const blocks: { free: ChainMember3d; hinges: LegalHinge[] }[] = [];
  for (const [index, member] of chain.entries()) {
    if (index > 0 && member.base !== chain[index - 1]!.id) return undefined;
    if (member !== leaf && member.goal !== undefined) return undefined;
    if (!(member.length > 0 && Number.isFinite(member.length))) return undefined;
    if (member.offset.x !== 0 || member.offset.y !== 0 || member.offset.z !== 0) return undefined;
    const limit = member.limit ?? { kind: "free" };
    switch (limit.kind) {
      case "free":
        blocks.push({ free: member, hinges: [] });
        break;
      case "hinge": {
        const hinge = legalHinge(member, limit);
        const block = blocks[blocks.length - 1];
        if (hinge === undefined || block === undefined) return undefined;
        block.hinges.push(hinge);
        break;
      }
      case "cone":
      case "swing-twist":
        return undefined;
      default:
        return unreachable(limit);
    }
  }
  const hinges = blocks.flatMap((block) => block.hinges);
  if (hinges.length === 0) return undefined;
  const frame = [root.x, root.y, root.z, root.rotation, root.rotationX, root.rotationY];
  if (![...frame, goal.x, goal.y, goal.z].every(Number.isFinite)) return undefined;
  const origin: Vec3 = [root.x, root.y, root.z];
  const goalPoint: Vec3 = [goal.x, goal.y, goal.z];
  const target = subtract3(goalPoint, origin);
  const distance = norm3(target);
  if (!Number.isFinite(distance)) return undefined;
  return {
    rootFrame: matrixFromEuler3d(root),
    origin,
    goal: goalPoint,
    target,
    distance,
    blocks,
    hinges,
    leafId: leaf.id,
  };
}

/** Each block's rigid local resultant at `angles`, or `undefined` if one is not finite. */
function sampleAt(rig: SerialRig, angles: readonly number[]): Sample | undefined {
  const vectors: Vec3[] = [];
  const lengths: number[] = [];
  let at = 0;
  for (const block of rig.blocks) {
    let frame = IDENTITY;
    let vector = scale3(UNIT_X, block.free.length);
    for (const hinge of block.hinges) {
      frame = multiplyMatrix3(frame, rotationAboutAxis3d(hinge.limit.axis, angles[at++]!));
      vector = add3(vector, scale3(axisX3(frame), hinge.member.length));
    }
    const length = norm3(vector);
    if (!Number.isFinite(length)) return undefined;
    vectors.push(vector);
    lengths.push(length);
  }
  return { angles, vectors, lengths };
}

/**
 * One-hinge block meeting the distance: length equation fixes cos(theta) → ≤2 signed roots, nearer the range centre first.
 */
function hingeRoots(rig: SerialRig, block: Block, hinge: LegalHinge): readonly number[] {
  const l1 = block.free.length;
  const l2 = hinge.member.length;
  const extent = Math.max(l1, l2, rig.distance);
  const [a, b, d] = [l1 / extent, l2 / extent, rig.distance / extent];
  const ax = hinge.limit.axis[0];
  const radial = 2 * a * b * (1 - ax * ax);
  if (!(radial > 0)) return [];
  const cosine = (d * d - a * a - b * b - 2 * a * b * ax * ax) / radial;
  // Shell-endpoint roundoff may shift the cosine a few ulps; the rendered FK gate decides.
  if (!(Math.abs(cosine) <= 1 + 64 * Number.EPSILON)) return [];
  const angle = (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
  const centre = (hinge.min + hinge.max) / 2;
  return [-angle, angle]
    .filter((value) => value >= hinge.min && value <= hinge.max)
    .sort((p, q) => Math.abs(p - centre) - Math.abs(q - centre) || p - q);
}

/** Hinge angles at `fractions` of every range, lexicographic, until `visit` answers. */
function visitGrid<R>(
  hinges: readonly LegalHinge[],
  fractions: readonly number[],
  visit: (angles: readonly number[]) => R | undefined,
): R | undefined {
  const angles: number[] = [];
  const descend = (depth: number): R | undefined => {
    if (depth === hinges.length) return visit([...angles]);
    const { min, max } = hinges[depth]!;
    for (const fraction of fractions) {
      angles.push(min + fraction * (max - min));
      const answer = descend(depth + 1);
      angles.pop();
      if (answer !== undefined) return answer;
    }
    return undefined;
  };
  return descend(0);
}

/** Bisect short→long joint-space segment to a sample within the interval. */
function bisect(rig: SerialRig, short: Sample, long: Sample): Sample | undefined {
  let low = short;
  let high = long;
  for (let step = 0; step < BRACKET_BISECTIONS; step += 1) {
    const middle = sampleAt(
      rig,
      low.angles.map((angle, index) => (angle + high.angles[index]!) / 2),
    );
    if (middle === undefined) return undefined;
    const reach = reachOf(middle, rig.distance);
    switch (reach) {
      case "within":
        return middle;
      case "short":
        low = middle;
        break;
      case "long":
        high = middle;
        break;
      default:
        return unreachable(reach);
    }
  }
  return undefined;
}

/** Side of the interval a search starts from; `within` needs none. */
type Side = Exclude<Reach, "within">;

/**
 * Missing-side reach bound pushed toward the distance by uniform sweeps + golden-section refine; stops at first sample off `side` or a sweep with no gain.
 */
function searchAcross(rig: SerialRig, start: Sample, side: Side): Sample | undefined {
  const score = (sample: Sample): number => {
    const [minimum, maximum] = radialInterval(sample.lengths);
    switch (side) {
      case "short":
        return maximum;
      case "long":
        return -minimum;
      default:
        return unreachable(side);
    }
  };
  let best = start;
  let bestScore = score(start);
  const probe = (angles: readonly number[]) => {
    const sample = sampleAt(rig, angles);
    if (sample === undefined) return undefined;
    const value = score(sample);
    if (value > bestScore) [best, bestScore] = [sample, value];
    return { sample, value, crossed: reachOf(sample, rig.distance) !== side };
  };
  for (let sweep = 0; sweep < SEARCH_SWEEPS; sweep += 1) {
    const before = bestScore;
    for (const [index, { min, max }] of rig.hinges.entries()) {
      const at = (angle: number): readonly number[] =>
        best.angles.map((value, position) => (position === index ? angle : value));
      const cell = (max - min) / SEARCH_SAMPLES;
      for (let step = 0; step <= SEARCH_SAMPLES; step += 1) {
        const probed = probe(at(min + step * cell));
        if (probed?.crossed) return probed.sample;
      }
      let low = Math.max(min, best.angles[index]! - cell);
      let high = Math.min(max, best.angles[index]! + cell);
      for (let step = 0; step < SEARCH_GOLDEN_STEPS; step += 1) {
        const left = probe(at(high - GOLDEN * (high - low)));
        const right = probe(at(low + GOLDEN * (high - low)));
        if (left === undefined || right === undefined) break;
        if (left.crossed) return left.sample;
        if (right.crossed) return right.sample;
        if (left.value > right.value) high = right.sample.angles[index]!;
        else low = left.sample.angles[index]!;
      }
    }
    if (!(bestScore > before)) break;
  }
  return undefined;
}

/** Why a grid scan stopped: a rendered answer, or a sample on each side of the distance. */
type GridStop<R> =
  | { readonly kind: "rendered"; readonly answer: R }
  | { readonly kind: "bracketed" };

/** First samples found on each side of the distance. */
interface Bracket {
  short?: Sample;
  long?: Sample;
}

/**
 * Candidates in order: lone-hinge roots, grids → bisect first bracket, then coordinate search toward the missing side when unbracketed.
 */
function searchAngles<R>(
  rig: SerialRig,
  render: (angles: readonly number[]) => R | undefined,
): R | undefined {
  const [block] = rig.blocks;
  if (rig.blocks.length === 1 && block!.hinges.length === 1) {
    for (const angle of hingeRoots(rig, block!, block!.hinges[0]!)) {
      const answer = render([angle]);
      if (answer !== undefined) return answer;
    }
    return undefined;
  }
  const bracket: Bracket = {};
  const renderBracket = (): R | undefined => {
    const { short, long } = bracket;
    if (short === undefined || long === undefined) return undefined;
    const within = bisect(rig, short, long);
    return within === undefined ? undefined : render(within.angles);
  };
  for (const fractions of rig.blocks.length === 1 ? BRACKET_GRIDS : POLYGON_GRIDS) {
    const stop = visitGrid<GridStop<R>>(rig.hinges, fractions, (angles) => {
      const sample = sampleAt(rig, angles);
      if (sample === undefined) return undefined;
      const reach = reachOf(sample, rig.distance);
      const [minimum, maximum] = radialInterval(sample.lengths);
      switch (reach) {
        case "within": {
          const answer = render(angles);
          return answer === undefined ? undefined : { kind: "rendered", answer };
        }
        case "short":
          if (bracket.short === undefined || maximum > radialInterval(bracket.short.lengths)[1])
            bracket.short = sample;
          break;
        case "long":
          if (bracket.long === undefined || minimum < radialInterval(bracket.long.lengths)[0])
            bracket.long = sample;
          break;
        default:
          return unreachable(reach);
      }
      return bracket.short !== undefined && bracket.long !== undefined
        ? { kind: "bracketed" }
        : undefined;
    });
    switch (stop?.kind) {
      case "rendered":
        return stop.answer;
      case "bracketed":
      case undefined: {
        const bracketed = renderBracket();
        if (bracketed !== undefined) return bracketed;
        break;
      }
      default:
        return unreachable(stop);
    }
  }
  const { short, long } = bracket;
  if (short !== undefined && long !== undefined) return undefined;
  const start = short ?? long;
  if (start === undefined) return undefined;
  const crossed = searchAcross(rig, start, short === undefined ? "long" : "short");
  if (crossed === undefined) return undefined;
  const reach = reachOf(crossed, rig.distance);
  switch (reach) {
    case "within":
      return render(crossed.angles);
    case "short":
      bracket.short = crossed;
      return renderBracket();
    case "long":
      bracket.long = crossed;
      return renderBracket();
    default:
      return unreachable(reach);
  }
}

/**
 * Side vectors of given lengths summing to `target`, each closed in the pole's plane at the middle remaining radius; zero length stays zero.
 */
function polygon(rig: SerialRig, lengths: readonly number[], pole: Pole3d): Vec3[] | undefined {
  const sides: Vec3[] = [];
  let remaining = rig.target;
  for (const [index, length] of lengths.entries()) {
    const distance = norm3(remaining);
    if (index === lengths.length - 1) {
      if (Math.abs(distance - length) > RADIUS_TOLERANCE) return undefined;
      sides.push(remaining);
      break;
    }
    const [minimum, maximum] = radialInterval(lengths.slice(index + 1));
    const lower = Math.max(minimum, Math.abs(distance - length));
    const upper = Math.min(maximum, distance + length);
    if (lower > upper + RADIUS_TOLERANCE) return undefined;
    const next = (lower + upper) / 2;
    const { e1, e2 } = bendBasis3d(rig.rootFrame, remaining, distance, rig.origin, pole);
    const cosine =
      distance > 0 && length > 0
        ? Math.max(
            -1,
            Math.min(
              1,
              (distance * distance + length * length - next * next) / (2 * distance * length),
            ),
          )
        : 1;
    const side = add3(
      scale3(e1, length * cosine),
      scale3(e2, length * Math.sqrt(Math.max(0, 1 - cosine * cosine))),
    );
    sides.push(side);
    remaining = subtract3(remaining, side);
  }
  return sides;
}

/** Right-handed basis: first column `direction`, second leaning on `lean`. */
function basisAlong(direction: Vec3, lean: Vec3): Matrix3 {
  const candidate = subtract3(lean, scale3(direction, dot3(lean, direction)));
  const side = normalize3(
    norm3(candidate) > BASIS_DEGENERACY
      ? candidate
      : subtract3([0, 1, 0], scale3(direction, direction[1])),
    [0, 0, 1],
  );
  const normal = cross3(direction, side);
  return [
    direction[0],
    side[0],
    normal[0],
    direction[1],
    side[1],
    normal[1],
    direction[2],
    side[2],
    normal[2],
  ];
}

/**
 * World orientation carrying a block's local resultant onto its world side; local basis leans on +x, world basis on the pole side.
 */
function alignedWorld(local: Vec3, world: Vec3, poleSide: Vec3): Matrix3 {
  const localBasis = basisAlong(normalize3(local, UNIT_X), UNIT_X);
  const worldBasis = basisAlong(normalize3(world, UNIT_X), poleSide);
  return multiplyMatrix3(worldBasis, transposeMatrix3(localBasis));
}

/** Render candidate through the published Euler image, gated on its rendered FK tip. */
function renderRecovery(
  rig: SerialRig,
  angles: readonly number[],
  pole: Pole3d,
): SolveResult3d<ClosedFormQuality> | undefined {
  const sample = sampleAt(rig, angles);
  if (sample === undefined) return undefined;
  const sides = polygon(rig, sample.lengths, pole);
  if (sides === undefined) return undefined;
  const rotations3d: Record<string, Euler3d> = {};
  let frame = rig.rootFrame;
  let tip = rig.origin;
  let at = 0;
  for (const [index, block] of rig.blocks.entries()) {
    const world = sides[index]!;
    const { e2 } = bendBasis3d(rig.rootFrame, world, sample.lengths[index]!, rig.origin, pole);
    const aligned = alignedWorld(sample.vectors[index]!, world, e2);
    const freeLocal = eulerFromMatrix3d(multiplyMatrix3(transposeMatrix3(frame), aligned));
    rotations3d[block.free.id] = freeLocal;
    frame = multiplyMatrix3(frame, matrixFromEuler3d(freeLocal));
    tip = add3(tip, scale3(axisX3(frame), block.free.length));
    for (const hinge of block.hinges) {
      const legal = renderedLegalHinge3d(hinge.limit, angles[at++]!);
      if (legal === undefined) return undefined;
      rotations3d[hinge.member.id] = legal.euler;
      frame = multiplyMatrix3(frame, legal.matrix);
      tip = add3(tip, scale3(axisX3(frame), hinge.member.length));
    }
  }
  const residual = norm3(subtract3(tip, rig.goal));
  if (!(residual <= FABRIK_TOLERANCE)) return undefined;
  return Object.freeze({
    rotations3d: Object.freeze(rotations3d),
    residuals: Object.freeze({ [rig.leafId]: residual }),
    quality: Object.freeze({ kind: "reached", residual }),
  });
}

/**
 * Legal serial recovery for a constrained chain whose tree solve missed; `undefined` when out of scope or no bounded candidate renders within `FABRIK_TOLERANCE`; pure, deterministic.
 */
export function solveSerialRecovery3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d<ClosedFormQuality> | undefined {
  const rig = readSerialRig(root, members);
  if (rig === undefined) return undefined;
  // Every legal pose stays inside the unrestricted interval → refuse before searching.
  const [minimum, maximum] = radialInterval(
    rig.blocks
      .flatMap((block) => [block.free, ...block.hinges.map(({ member }) => member)])
      .map((member) => member.length),
  );
  if (rig.distance < minimum - FABRIK_TOLERANCE || rig.distance > maximum + FABRIK_TOLERANCE)
    return undefined;
  const pole = rereadPole3d(bend);
  return searchAngles(rig, (angles) => renderRecovery(rig, angles, pole));
}
