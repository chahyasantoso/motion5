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
import { nonPlanarHinge3d, renderedLegalHinge3d } from "./ik3d-constraint";
import type { SolveResult3d } from "./ik3d-result";
import type { ClosedFormQuality } from "./ik-result";
import { canonicalChain } from "./ik-topology";

type Block = {
  readonly free: ChainMember3d;
  readonly hinges: readonly ChainMember3d[];
};

type Sample = {
  readonly angles: readonly number[];
  readonly vectors: readonly Vec3[];
  readonly lengths: readonly number[];
};

/** The attainable resultant lengths of freely orientable vectors. */
function radialInterval(lengths: readonly number[]): readonly [number, number] {
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return [Math.max(0, 2 * Math.max(...lengths) - total), total];
}

/**
 * Construct a polygon with prescribed side lengths and resultant. Each step chooses a remaining
 * radius inside the exact polygon interval, then uses a triangle intersection for the next side.
 * The pole supplies a stable plane; a zero resultant has no preferred direction.
 */
function freeVectors(
  lengths: readonly number[],
  target: Vec3,
  rootFrame: Matrix3,
  origin: Vec3,
  bend: Pole3d,
): Vec3[] | undefined {
  const result: Vec3[] = [];
  let remaining = target;
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index]!;
    if (index === lengths.length - 1) {
      if (Math.abs(norm3(remaining) - length) > FABRIK_TOLERANCE / 8) return undefined;
      result.push(remaining);
      break;
    }
    const distance = norm3(remaining);
    const [min, max] = radialInterval(lengths.slice(index + 1));
    const lower = Math.max(min, Math.abs(distance - length));
    const upper = Math.min(max, distance + length);
    if (lower > upper + 1e-9) return undefined;
    const nextRadius = (lower + upper) / 2;
    const { e1, e2 } = bendBasis3d(rootFrame, remaining, distance, origin, bend);
    const cosine =
      distance > 1e-12
        ? Math.max(-1, Math.min(1, (distance * distance + length * length - nextRadius * nextRadius) / (2 * distance * length)))
        : 1;
    const vector = add3(
      scale3(e1, length * cosine),
      scale3(e2, length * Math.sqrt(Math.max(0, 1 - cosine * cosine))),
    );
    result.push(vector);
    remaining = subtract3(remaining, vector);
  }
  return result;
}

/** A free-led block is one freely orientable vector once all its hinge angles are fixed. */
function sampleBlocks(blocks: readonly Block[], angles: readonly number[]): Sample | undefined {
  const vectors: Vec3[] = [];
  const lengths: number[] = [];
  let at = 0;
  for (const block of blocks) {
    let frame = matrixFromEuler3d({ rotation: 0, rotationX: 0, rotationY: 0 });
    let vector = scale3(axisX3(frame), block.free.length);
    for (const member of block.hinges) {
      if (member.limit?.kind !== "hinge") return undefined;
      frame = multiplyMatrix3(frame, rotationAboutAxis3d(member.limit.axis, angles[at++]!));
      vector = add3(vector, scale3(axisX3(frame), member.length));
    }
    const length = norm3(vector);
    if (!(length > 1e-10 && Number.isFinite(length))) return undefined;
    vectors.push(vector);
    lengths.push(length);
  }
  return { angles, vectors, lengths };
}

function alignedWorld(localVector: Vec3, worldVector: Vec3, poleSide: Vec3): Matrix3 {
  const localDirection = normalize3(localVector, [1, 0, 0]);
  const localSideCandidate = subtract3([1, 0, 0], scale3(localDirection, localDirection[0]));
  const localSide = normalize3(
    norm3(localSideCandidate) > 1e-9
      ? localSideCandidate
      : subtract3([0, 1, 0], scale3(localDirection, localDirection[1])),
    [0, 0, 1],
  );
  const direction = normalize3(worldVector, [1, 0, 0]);
  const sideCandidate = subtract3(poleSide, scale3(direction, dot3(poleSide, direction)));
  const side = normalize3(
    norm3(sideCandidate) > 1e-9
      ? sideCandidate
      : subtract3([0, 1, 0], scale3(direction, direction[1])),
    [0, 0, 1],
  );
  const localNormal = cross3(localDirection, localSide);
  const normal = cross3(direction, side);
  const localBasis: Matrix3 = [
    localDirection[0], localSide[0], localNormal[0],
    localDirection[1], localSide[1], localNormal[1],
    localDirection[2], localSide[2], localNormal[2],
  ];
  const worldBasis: Matrix3 = [
    direction[0], side[0], normal[0],
    direction[1], side[1], normal[1],
    direction[2], side[2], normal[2],
  ];
  return multiplyMatrix3(worldBasis, transposeMatrix3(localBasis));
}

function renderCandidate(
  root: WorldFrame3d,
  goal: WorldFrame3d,
  blocks: readonly Block[],
  sample: Sample,
  bend: Pole3d,
): SolveResult3d<ClosedFormQuality> | undefined {
  const rootFrame = matrixFromEuler3d(root);
  const origin: Vec3 = [root.x, root.y, root.z];
  const target = subtract3([goal.x, goal.y, goal.z], origin);
  const vectors = freeVectors(sample.lengths, target, rootFrame, origin, bend);
  if (vectors === undefined) return undefined;
  const rotations3d: Record<string, Euler3d> = {};
  let frame = rootFrame;
  let tip = origin;
  let at = 0;
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex += 1) {
    const block = blocks[blockIndex]!;
    const { e2 } = bendBasis3d(
      rootFrame,
      vectors[blockIndex]!,
      sample.lengths[blockIndex]!,
      origin,
      rereadPole3d(bend),
    );
    const world = alignedWorld(sample.vectors[blockIndex]!, vectors[blockIndex]!, e2);
    const freeLocal = eulerFromMatrix3d(multiplyMatrix3(transposeMatrix3(frame), world));
    rotations3d[block.free.id] = freeLocal;
    frame = multiplyMatrix3(frame, matrixFromEuler3d(freeLocal));
    tip = add3(tip, scale3(axisX3(frame), block.free.length));
    for (const member of block.hinges) {
      if (member.limit?.kind !== "hinge") return undefined;
      const legalPose = renderedLegalHinge3d(member.limit, sample.angles[at++]!);
      if (legalPose === undefined) return undefined;
      rotations3d[member.id] = legalPose.euler;
      frame = multiplyMatrix3(frame, legalPose.matrix);
      tip = add3(tip, scale3(axisX3(frame), member.length));
    }
  }
  const residual = norm3(subtract3(tip, [goal.x, goal.y, goal.z]));
  if (!(residual <= FABRIK_TOLERANCE)) return undefined;
  const leaf = blocks[blocks.length - 1]!;
  const leafId = leaf.hinges[leaf.hinges.length - 1]?.id ?? leaf.free.id;
  return Object.freeze({
    rotations3d: Object.freeze(rotations3d),
    residuals: Object.freeze({ [leafId]: residual }),
    quality: Object.freeze({ kind: "reached", residual }),
  });
}

/**
 * Bounded geometric recovery for a short serial chain with interleaved free joints and legal
 * arbitrary-axis hinges. Free-led blocks are freely orientable vectors, so exact polygon reach
 * replaces repeated FABRIK attempts. A sampled interval is not a legal-pose proof: rendered
 * Euler FK and the shared hinge projector remain authoritative.
 */
export function solveInterleavedFreeSerial3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d<ClosedFormQuality> | undefined {
  if (members.length < 3 || members.length > 5) return undefined;
  const { byId, ids, leaves } = canonicalChain(members);
  if (leaves.length !== 1) return undefined;
  const chain = ids.map((id) => byId.get(id)!);
  const goal = chain[chain.length - 1]!.goal;
  if (
    goal === undefined ||
    chain[0]!.limit?.kind === "hinge" ||
    chain.some(
      (member, index) =>
        (index > 0 && member.base !== chain[index - 1]!.id) ||
        (index < chain.length - 1 && member.goal !== undefined) ||
        !(member.length > 0) ||
        member.offset.x !== 0 ||
        member.offset.y !== 0 ||
        member.offset.z !== 0 ||
        (member.limit !== undefined &&
          member.limit.kind !== "free" &&
          (member.limit.kind !== "hinge" ||
            !nonPlanarHinge3d(member.limit) ||
            member.limit.range.kind !== "range")),
    )
  )
    return undefined;
  const blocks: { free: ChainMember3d; hinges: ChainMember3d[] }[] = [];
  const hinges: ChainMember3d[] = [];
  for (const member of chain) {
    if (member.limit?.kind === "hinge") {
      blocks[blocks.length - 1]!.hinges.push(member);
    } else {
      blocks.push({ free: member, hinges: [] });
    }
  }
  if (blocks.length < 2) return undefined;
  for (const block of blocks)
    for (const member of block.hinges) hinges.push(member);
  if (hinges.length === 0) return undefined;
  const numbers = [
    root.x, root.y, root.z, root.rotation, root.rotationX, root.rotationY,
    goal.x, goal.y, goal.z,
    ...chain.map((member) => member.length),
    ...hinges.flatMap((member) => {
      const limit = member.limit!;
      return limit.kind === "hinge" && limit.range.kind === "range"
        ? [...limit.axis, limit.range.min, limit.range.max]
        : [NaN];
    }),
  ];
  if (
    !numbers.every(Number.isFinite) ||
    !Number.isFinite(chain.reduce((sum, member) => sum + member.length, 0)) ||
    hinges.some((member) => {
      const limit = member.limit!;
      return (
        limit.kind !== "hinge" ||
        limit.range.kind !== "range" ||
        Math.abs(norm3(limit.axis) - 1) > 1e-12 ||
        limit.range.max < limit.range.min ||
        limit.range.max - limit.range.min > 360
      );
    })
  )
    return undefined;
  const distance = norm3(subtract3([goal.x, goal.y, goal.z], [root.x, root.y, root.z]));
  if (!Number.isFinite(distance)) return undefined;
  // The unrestricted polygon interval is a necessary condition for every legal hinge pose.
  // Refuse distant/impossible targets without paying any grid work.
  const allLengths = chain.map((member) => member.length);
  const [minimum, maximum] = radialInterval(allLengths);
  if (distance < minimum - FABRIK_TOLERANCE || distance > maximum + FABRIK_TOLERANCE)
    return undefined;
  const grids = [[0.5], [0, 0.5, 1], [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]];
  for (const fractions of grids) {
    const angles: number[] = [];
    const visit = (depth: number): SolveResult3d<ClosedFormQuality> | undefined => {
      if (depth === hinges.length) {
        const sample = sampleBlocks(blocks, angles);
        if (sample === undefined) return undefined;
        const [minimum, maximum] = radialInterval(sample.lengths);
        if (distance < minimum - FABRIK_TOLERANCE || distance > maximum + FABRIK_TOLERANCE)
          return undefined;
        return renderCandidate(root, goal, blocks, sample, bend);
      }
      const limit = hinges[depth]!.limit!;
      if (limit.kind !== "hinge" || limit.range.kind !== "range") return undefined;
      for (const fraction of fractions) {
        angles.push(limit.range.min + fraction * (limit.range.max - limit.range.min));
        const result = visit(depth + 1);
        angles.pop();
        if (result !== undefined) return result;
      }
      return undefined;
    };
    const result = visit(0);
    if (result !== undefined) return result;
  }
  return undefined;
}
