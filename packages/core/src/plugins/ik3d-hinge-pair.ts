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
import { twoBonePair } from "./ik-topology";
import type { ChainMember3d } from "./ik3d-chain";
import { nonPlanarHinge3d } from "./ik3d-constraint";
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
