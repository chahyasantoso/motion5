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
  type Vec3,
  type WorldFrame3d,
} from "./frame3d";
import { bendBasis3d, rereadPole3d, UNBOUND_POLE3D, type Pole3d } from "./ik3d-analytic";
import { canonicalChain, twoBonePair } from "./ik-topology";
import type { ChainMember3d } from "./ik3d-chain";
import { limitLocal3d, nonPlanarHinge3d } from "./ik3d-constraint";
import type { SolveResult3d } from "./ik3d-result";
import type { ClosedFormQuality } from "./ik-result";

/**
 * Closed geometric recovery for a free parent and one non-planar hinge child. If the hinge
 * rotates about unit axis a, its second direction has +x component a.x² + (1-a.x²) cos(theta).
 * The distance equation therefore determines at most two signed legal hinge angles. A free
 * parent can carry either resulting local two-link vector to the target; `bendBasis3d` fixes its
 * remaining roll by the same pole side as the ordinary closed form. This is an opt-in fallback,
 * never a replacement for an already converged tree solve. No offset, additional goal, or other
 * constraint may be hidden in this special case.
 */
export function solveHingePairRecovery3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d<ClosedFormQuality> | undefined {
  const pair = twoBonePair<WorldFrame3d, ChainMember3d>(members);
  if (pair === undefined) return undefined;
  const { first, second, goal } = pair;
  if (
    (first.limit !== undefined && first.limit.kind !== "free") ||
    second.limit?.kind !== "hinge" ||
    !nonPlanarHinge3d(second.limit) ||
    second.limit.range.kind !== "range" ||
    !(first.length > 0 && second.length > 0) ||
    ![first, second].every(({ offset }) => offset.x === 0 && offset.y === 0 && offset.z === 0)
  )
    return undefined;
  const { axis, range } = second.limit;
  const axisLength = norm3(axis);
  const numbers = [
    root.x,
    root.y,
    root.z,
    goal.x,
    goal.y,
    goal.z,
    first.length,
    second.length,
    ...axis,
    range.min,
    range.max,
  ];
  // This conservative recovery declines ill-conditioned/extreme rigs; the tree solver remains
  // the magnitude-aware owner of their result rather than publishing a misleading exact claim.
  if (!numbers.every(Number.isFinite) || Math.abs(axisLength - 1) > 1e-12) return undefined;
  const rootMatrix = matrixFromEuler3d(root);
  const pivot: Vec3 = [root.x, root.y, root.z];
  const delta: Vec3 = subtract3([goal.x, goal.y, goal.z], pivot);
  const distance = norm3(delta);
  const extent = Math.max(first.length, second.length, distance);
  if (!(extent > 0 && Number.isFinite(extent))) return undefined;
  const l1 = first.length / extent;
  const l2 = second.length / extent;
  const d = distance / extent;
  const radial = 2 * l1 * l2 * (1 - axis[0] * axis[0]);
  if (!(radial > 0)) return undefined;
  const cosine = (d * d - l1 * l1 - l2 * l2 - 2 * l1 * l2 * axis[0] * axis[0]) / radial;
  // Roundoff at a shell endpoint may move cosine by a few ulps; the rendered FK check below
  // remains authoritative and refuses a target genuinely outside tolerance.
  if (cosine < -1 - 64 * Number.EPSILON || cosine > 1 + 64 * Number.EPSILON) return undefined;
  const angle = (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
  const candidates = [-angle, angle].filter((value) => value >= range.min && value <= range.max);
  if (candidates.length === 0) return undefined;
  // The centre only breaks the two equal-radius legal roots; it is not the limit's origin.
  const centre = (range.min + range.max) / 2;
  candidates.sort((a, b) => Math.abs(a - centre) - Math.abs(b - centre) || a - b);
  const localChild = rotationAboutAxis3d(axis, candidates[0]!);
  const elbowVector = add3(
    scale3([1, 0, 0], first.length),
    scale3(axisX3(localChild), second.length),
  );
  const localDirection = normalize3(elbowVector, [1, 0, 0]);
  const projection = dot3([1, 0, 0], localDirection);
  const side = subtract3([1, 0, 0], scale3(localDirection, projection));
  // A straight elbow names no side; choose a deterministic transverse basis for its free roll.
  const localSide =
    norm3(side) > 1e-9
      ? normalize3(side, [0, 1, 0])
      : normalize3(subtract3([0, 1, 0], scale3(localDirection, localDirection[1])), [0, 0, 1]);
  const localNormal = cross3(localDirection, localSide);
  const { e1, e2, normal } = bendBasis3d(rootMatrix, delta, distance, pivot, rereadPole3d(bend));
  const localBasis = [
    localDirection[0],
    localSide[0],
    localNormal[0],
    localDirection[1],
    localSide[1],
    localNormal[1],
    localDirection[2],
    localSide[2],
    localNormal[2],
  ] as const;
  const worldBasis = [
    e1[0],
    e2[0],
    normal[0],
    e1[1],
    e2[1],
    normal[1],
    e1[2],
    e2[2],
    normal[2],
  ] as const;
  const firstWorld = multiplyMatrix3(worldBasis, transposeMatrix3(localBasis));
  const firstLocal = eulerFromMatrix3d(multiplyMatrix3(transposeMatrix3(rootMatrix), firstWorld));
  const childLocal = eulerFromMatrix3d(localChild);
  // Judge the published Euler image, not the ideal matrix, so a converged claim is verifiable by FK.
  const renderedFirst = multiplyMatrix3(rootMatrix, matrixFromEuler3d(firstLocal));
  const renderedChild = multiplyMatrix3(renderedFirst, matrixFromEuler3d(childLocal));
  const tip = add3(
    add3(pivot, scale3(axisX3(renderedFirst), first.length)),
    scale3(axisX3(renderedChild), second.length),
  );
  const residual = norm3(subtract3(tip, [goal.x, goal.y, goal.z]));
  if (!(residual <= FABRIK_TOLERANCE)) return undefined;
  return Object.freeze({
    rotations3d: Object.freeze({
      [first.id]: Object.freeze(firstLocal),
      [second.id]: Object.freeze(childLocal),
    }),
    residuals: Object.freeze({ [second.id]: residual }),
    quality: Object.freeze({ kind: "reached", residual }),
  });
}

/**
 * A free first member may rotate the entire serial hinge tail without changing its endpoint
 * radius. Bracket the target radius between two legal tail poses on a fixed grid, bisect a
 * continuous legal path between them, then align the free member to the goal. Only rendered
 * Euler FK within tolerance is accepted. This is a bounded fallback, not a complete IK solver.
 */
export function solveFreeRootHingeTail3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d<ClosedFormQuality> | undefined {
  if (members.length < 3 || members.length > 5) return undefined;
  const { byId, ids, leaves } = canonicalChain(members);
  if (leaves.length !== 1) return undefined;
  const chain = ids.map((id) => byId.get(id)!);
  const [first, ...tail] = chain;
  const goal = chain[chain.length - 1]!.goal;
  if (
    goal === undefined ||
    (first!.limit !== undefined && first!.limit.kind !== "free") ||
    chain.some(
      (member, index) =>
        (index > 0 && member.base !== chain[index - 1]!.id) ||
        (index < chain.length - 1 && member.goal !== undefined) ||
        !(member.length > 0) ||
        member.offset.x !== 0 ||
        member.offset.y !== 0 ||
        member.offset.z !== 0,
    ) ||
    tail.some(
      (member) =>
        member.limit?.kind !== "hinge" ||
        !nonPlanarHinge3d(member.limit) ||
        member.limit.range.kind !== "range",
    )
  )
    return undefined;
  const hinges = tail.map((member) => {
    const limit = member.limit!;
    if (limit.kind !== "hinge" || limit.range.kind !== "range") return undefined;
    return { member, axis: limit.axis, range: limit.range };
  });
  if (hinges.some((hinge) => hinge === undefined)) return undefined;
  const legal = hinges as {
    member: ChainMember3d;
    axis: Vec3;
    range: { kind: "range"; min: number; max: number };
  }[];
  const numbers = [
    root.x, root.y, root.z, goal.x, goal.y, goal.z,
    ...chain.map((member) => member.length),
    ...legal.flatMap(({ axis, range }) => [...axis, range.min, range.max]),
  ];
  if (
    !numbers.every(Number.isFinite) ||
    legal.some(
      ({ axis, range }) =>
        Math.abs(norm3(axis) - 1) > 1e-12 ||
        range.max < range.min ||
        range.max - range.min > 360,
    )
  )
    return undefined;
  const rootMatrix = matrixFromEuler3d(root);
  const origin: Vec3 = [root.x, root.y, root.z];
  const delta = subtract3([goal.x, goal.y, goal.z], origin);
  const distance = norm3(delta);
  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(chain.reduce((sum, member) => sum + member.length, 0))
  )
    return undefined;
  const identity = rotationAboutAxis3d([0, 0, 1], 0);
  const vectorAt = (angles: readonly number[]): Vec3 => {
    let frame = identity;
    let vector = scale3(axisX3(frame), first!.length);
    for (let index = 0; index < legal.length; index += 1) {
      const { member, axis } = legal[index]!;
      frame = multiplyMatrix3(frame, rotationAboutAxis3d(axis, angles[index]!));
      vector = add3(vector, scale3(axisX3(frame), member.length));
    }
    return vector;
  };
  type Sample = { angles: readonly number[]; radius: number };
  let low: Sample | undefined;
  let high: Sample | undefined;
  // Maximum 3^4 + 7^4 grid evaluations, with early exit at the first bracket.
  for (const fractions of [[0, 0.5, 1], [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]]) {
    const visit = (angles: number[], depth: number): void => {
      if (low !== undefined && high !== undefined) return;
      if (depth === legal.length) {
        const radius = norm3(vectorAt(angles));
        if (!Number.isFinite(radius)) return;
        const sample = { angles: [...angles], radius };
        if (radius <= distance && (low === undefined || radius > low.radius)) low = sample;
        if (radius >= distance && (high === undefined || radius < high.radius)) high = sample;
        return;
      }
      const { min, max } = legal[depth]!.range;
      for (const fraction of fractions) {
        angles.push(min + fraction * (max - min));
        visit(angles, depth + 1);
        angles.pop();
        if (low !== undefined && high !== undefined) return;
      }
    };
    visit([], 0);
    if (low !== undefined && high !== undefined) break;
  }
  if (low === undefined || high === undefined) return undefined;
  for (let step = 0; step < 48 && high.radius - low.radius > FABRIK_TOLERANCE / 8; step += 1) {
    const angles: number[] = low.angles.map((angle, index) => (angle + high!.angles[index]!) / 2);
    const radius = norm3(vectorAt(angles));
    if (!Number.isFinite(radius)) return undefined;
    if (radius <= distance) low = { angles, radius };
    else high = { angles, radius };
  }
  const angles = distance - low.radius < high.radius - distance ? low.angles : high.angles;
  const direction = normalize3(vectorAt(angles), [1, 0, 0]);
  const projection = dot3([1, 0, 0], direction);
  const side = subtract3([1, 0, 0], scale3(direction, projection));
  const localSide =
    norm3(side) > 1e-9
      ? normalize3(side, [0, 1, 0])
      : normalize3(subtract3([0, 1, 0], scale3(direction, direction[1])), [0, 0, 1]);
  const localNormal = cross3(direction, localSide);
  const { e1, e2, normal } = bendBasis3d(rootMatrix, delta, distance, origin, rereadPole3d(bend));
  const localBasis = [
    direction[0], localSide[0], localNormal[0],
    direction[1], localSide[1], localNormal[1],
    direction[2], localSide[2], localNormal[2],
  ] as const;
  const worldBasis = [
    e1[0], e2[0], normal[0],
    e1[1], e2[1], normal[1],
    e1[2], e2[2], normal[2],
  ] as const;
  const firstWorld = multiplyMatrix3(worldBasis, transposeMatrix3(localBasis));
  const firstLocal = eulerFromMatrix3d(multiplyMatrix3(transposeMatrix3(rootMatrix), firstWorld));
  const rotations3d: Record<string, typeof firstLocal> = { [first!.id]: firstLocal };
  let frame = multiplyMatrix3(rootMatrix, matrixFromEuler3d(firstLocal));
  let tip = add3(origin, scale3(axisX3(frame), first!.length));
  for (let index = 0; index < legal.length; index += 1) {
    const { member, axis } = legal[index]!;
    const limit = member.limit!;
    if (limit.kind !== "hinge") return undefined;
    const ideal = rotationAboutAxis3d(axis, angles[index]!);
    const local = eulerFromMatrix3d(ideal);
    const rendered = matrixFromEuler3d(local);
    if (rendered.some((value, at) => Math.abs(value - ideal[at]!) > 1e-9)) return undefined;
    const projected = limitLocal3d(limit, () => rendered);
    if (
      projected.kind !== "moved" ||
      projected.local.some((value, at) => Math.abs(value - rendered[at]!) > 1e-9)
    )
      return undefined;
    rotations3d[member.id] = local;
    frame = multiplyMatrix3(frame, rendered);
    tip = add3(tip, scale3(axisX3(frame), member.length));
  }
  const residual = norm3(subtract3(tip, [goal.x, goal.y, goal.z]));
  if (!(residual <= FABRIK_TOLERANCE)) return undefined;
  return Object.freeze({
    rotations3d: Object.freeze(rotations3d),
    residuals: Object.freeze({ [chain[chain.length - 1]!.id]: residual }),
    quality: Object.freeze({ kind: "reached", residual }),
  });
}
