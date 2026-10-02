import type { DofId, Proportions, SegmentId } from "../body/skeleton";
import { DEFAULT_PROPORTIONS, DOF_BY_ID, clampDof } from "../body/skeleton";
import { distance } from "../filler/vec";
import { actorFrame, actorPose, type ActorPose } from "./actor";
import { DEG, sub3, type Vec3 } from "./rotation";

/** A constrained end-effector the person can drag in pose mode: a wrist or an ankle. */
export type Handle = "left-hand" | "right-hand" | "left-foot" | "right-foot";

interface HandleChain {
  /** The segment whose origin is the root of the reach: the shoulder or the hip. */
  readonly root: SegmentId;
  /** The segment whose origin is the effector: the hand (wrist) or the foot (ankle). */
  readonly effector: SegmentId;
  /** Orientation of the root joint, then the hinge. */
  readonly swing: readonly [DofId, DofId];
  readonly hinge: DofId;
  readonly lengths: (body: Proportions) => readonly [number, number];
}

const arm = (side: "left" | "right"): HandleChain => ({
  root: `${side}-upper-arm`,
  effector: `${side}-hand`,
  swing: [`${side}-shoulder-flex`, `${side}-shoulder-abduct`],
  hinge: `${side}-elbow-flex`,
  lengths: (b) => [b.upperArm, b.forearm],
});
const leg = (side: "left" | "right"): HandleChain => ({
  root: `${side}-thigh`,
  effector: `${side}-foot`,
  swing: [`${side}-hip-flex`, `${side}-hip-abduct`],
  hinge: `${side}-knee-flex`,
  lengths: (b) => [b.thigh, b.shin],
});

export const HANDLES: Readonly<Record<Handle, HandleChain>> = Object.freeze({
  "left-hand": arm("left"),
  "right-hand": arm("right"),
  "left-foot": leg("left"),
  "right-foot": leg("right"),
});

/**
 * What a handle drag did, a closed union. `reached` put the effector on the target. `clamped`
 * did not, and says why: the target is farther than the limb's length (`out-of-reach`), or the
 * joints' anatomical ranges stop it (`joint-limit`). Either way the limb keeps its lengths: a drag
 * never stretches a bone, and the pose returned is the closest legal one found.
 */
export type HandleResult =
  | { readonly kind: "reached"; readonly pose: ActorPose; readonly errorM: number }
  | {
      readonly kind: "clamped";
      readonly reason: "out-of-reach" | "joint-limit";
      readonly pose: ActorPose;
      readonly errorM: number;
    };

/** Within this the effector is on the target. */
export const REACHED_M = 0.002;
const ITERATIONS = 80;
const STEP_DEG = 0.01;
const DAMPING = 0.02;

type Matrix3 = readonly [Vec3, Vec3, Vec3];

function det3([a, b, c]: Matrix3): number {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  );
}

/** Cramer's rule for `m x = rhs`; `undefined` when `m` is singular. */
function solve3(m: Matrix3, rhs: Vec3): Vec3 | undefined {
  const det = det3(m);
  if (Math.abs(det) < 1e-18) return undefined;
  const replaced = (column: number): Matrix3 =>
    m.map(
      (row, r) => row.map((value, c) => (c === column ? rhs[r]! : value)) as unknown as Vec3,
    ) as unknown as Matrix3;
  return [det3(replaced(0)) / det, det3(replaced(1)) / det, det3(replaced(2)) / det];
}

/**
 * Moves one limb so its wrist or ankle reaches `target` (scene metres), changing only that limb's
 * root swing and hinge. The hinge is first set from the law of cosines for the target's distance,
 * then damped least squares on the three angles, each held to its range after every step, settles
 * the reach; it is the truth actor's own solve, independent of the rig's IK, so the rig is never
 * judged by its own algorithm. Deterministic: the same pose and target give the same answer.
 */
export function dragHandle(
  pose: ActorPose,
  handle: Handle,
  target: Vec3,
  body: Proportions = DEFAULT_PROPORTIONS,
): HandleResult {
  const chain = HANDLES[handle];
  const dofs = [...chain.swing, chain.hinge] as const;
  const [upper, lower] = chain.lengths(body);
  const reach = upper + lower;
  const rootPoint = actorFrame(pose, body).segments[chain.root].origin;
  const span = distance(rootPoint, target);
  const angles: Record<DofId, number> = { ...pose.angles };
  const hinge = DOF_BY_ID.get(chain.hinge)!;
  const clamped = Math.min(reach, Math.max(Math.abs(upper - lower), span));
  const interior = Math.acos(
    Math.min(1, Math.max(-1, (upper ** 2 + lower ** 2 - clamped ** 2) / (2 * upper * lower))),
  );
  angles[chain.hinge] = clampDof(hinge, (Math.PI - interior) / DEG);
  const effector = (values: Record<DofId, number>) =>
    actorFrame(actorPose(values, pose.root), body).segments[chain.effector].origin;
  let best = { angles: { ...angles }, error: distance(effector(angles), target) };
  for (let iteration = 0; iteration < ITERATIONS && best.error > REACHED_M / 4; iteration += 1) {
    const here = effector(angles);
    const error = sub3(target, here);
    const jacobian = dofs.map((id) => {
      const nudged = { ...angles, [id]: angles[id]! + STEP_DEG };
      return sub3(effector(nudged), here).map((value) => value / (STEP_DEG * DEG));
    });
    // J Jᵀ + λ² I over the three angle columns of the 3x3 Jacobian.
    const entry = (r: number, c: number) =>
      jacobian.reduce((sum, column) => sum + column[r]! * column[c]!, 0) +
      (r === c ? DAMPING ** 2 : 0);
    const jjt: Matrix3 = [
      [entry(0, 0), entry(0, 1), entry(0, 2)],
      [entry(1, 0), entry(1, 1), entry(1, 2)],
      [entry(2, 0), entry(2, 1), entry(2, 2)],
    ];
    const y = solve3(jjt, error);
    if (y === undefined) break;
    dofs.forEach((id, index) => {
      const column = jacobian[index]!;
      const step = (column[0]! * y[0] + column[1]! * y[1] + column[2]! * y[2]) / DEG;
      angles[id] = clampDof(DOF_BY_ID.get(id)!, angles[id]! + step);
    });
    const now = distance(effector(angles), target);
    if (now < best.error) best = { angles: { ...angles }, error: now };
  }
  const solved = actorPose(best.angles, pose.root);
  if (best.error <= REACHED_M) return { kind: "reached", pose: solved, errorM: best.error };
  return {
    kind: "clamped",
    reason: span > reach ? "out-of-reach" : "joint-limit",
    pose: solved,
    errorM: best.error,
  };
}
