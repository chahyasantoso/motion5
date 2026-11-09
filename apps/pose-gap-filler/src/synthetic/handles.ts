import type { Dof, DofId, Proportions, SegmentId } from "../body/skeleton";
import { DEFAULT_PROPORTIONS, DOF_BY_ID, SEGMENT_TREE, clampDof } from "../body/skeleton";
import { distance, dot, norm, unit } from "../filler/vec";
import { actorFrame, actorPose, type ActorPose } from "./actor";
import {
  DEG,
  apply,
  axisRotation,
  cross3,
  scale3,
  sub3,
  transpose,
  type Axis,
  type Vec3,
} from "./rotation";

/** Draggable constrained effector: a wrist or an ankle. */
export type Handle = "left-hand" | "right-hand" | "left-foot" | "right-foot";

interface HandleChain {
  /** Segment whose origin is the reach root: shoulder or hip. */
  readonly root: SegmentId;
  /** Segment whose origin is the effector: wrist or ankle. */
  readonly effector: SegmentId;
  /** Root orientation dofs, then the hinge. */
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

/** Drag outcome. `reached`: effector on target. `clamped`: closest legal pose, stopped by
 * `out-of-reach` (target past limb length) or `joint-limit` (ranges). Lengths never stretch. */
export type HandleResult =
  | { readonly kind: "reached"; readonly pose: ActorPose; readonly errorM: number }
  | {
      readonly kind: "clamped";
      readonly reason: "out-of-reach" | "joint-limit";
      readonly pose: ActorPose;
      readonly errorM: number;
    };

/** Metres within which the effector counts as on target. */
export const REACHED_M = 0.002;
const ITERATIONS = 80;
const STEP_DEG = 0.01;
const DAMPING = 0.02;
const STALL_M = 1e-6;

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

const AXES: Readonly<Record<Axis, Vec3>> = Object.freeze({
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
});

/** `angle` plus whole turns, whichever sits in `dof`'s range or nearest it. */
function inRange(dof: Dof, angle: number): number {
  const wrapped = ((((angle + 180) % 360) + 360) % 360) - 180;
  const turns = [wrapped, wrapped + 360, wrapped - 360];
  const outside = (value: number) => Math.abs(value - clampDof(dof, value));
  return turns.reduce((best, value) => (outside(value) < outside(best) ? value : best));
}

/** Swing degrees turning rest vector `w` onto `d` (equal length, root's parent frame) per
 * `R(outer) R(inner) w = d`; two branches, inner fixed per branch. Unclamped; caller clamps. */
function swingBranches(w: Vec3, d: Vec3, outer: Dof, inner: Dof): (readonly [number, number])[] {
  const a1 = AXES[outer.axis];
  const a2 = AXES[inner.axis];
  const a = dot(a2, d);
  const b = -dot(a2, cross3(a1, d));
  const radius = Math.hypot(a, b);
  const base = Math.atan2(b, a);
  const spread = radius === 0 ? 0 : Math.acos(Math.min(1, Math.max(-1, dot(a2, w) / radius)));
  const offAxis = (v: Vec3) => sub3(v, scale3(a2, dot(a2, v)));
  return [base + spread, base - spread].map((alpha) => {
    const u = offAxis(apply(axisRotation(outer.axis, -alpha), d));
    const v = offAxis(w);
    const beta = Math.atan2(dot(a2, cross3(v, u)), dot(v, u));
    return [
      inRange(outer, alpha / (outer.sign * DEG)),
      inRange(inner, beta / (inner.sign * DEG)),
    ] as const;
  });
}

/** Turns one limb's swing and hinge so its wrist or ankle reaches `target` (scene metres):
 * hinge by law of cosines, analytic swing, damping within ranges; deterministic, closest seed wins. */
export function dragHandle(
  pose: ActorPose,
  handle: Handle,
  target: Vec3,
  body: Proportions = DEFAULT_PROPORTIONS,
): HandleResult {
  const chain = HANDLES[handle];
  const [outer, inner] = chain.swing.map((id) => DOF_BY_ID.get(id)!) as [Dof, Dof];
  const dofs = [...chain.swing, chain.hinge] as const;
  const [upper, lower] = chain.lengths(body);
  const reach = upper + lower;
  const effector = (values: Readonly<Record<DofId, number>>) =>
    actorFrame(actorPose(values, pose.root), body).segments[chain.effector].origin;
  const start = actorFrame(pose, body);
  const rootPoint = start.segments[chain.root].origin;
  const parent = start.segments[PARENT.get(chain.root)!].rotation;
  const span = distance(rootPoint, target);
  const clamped = Math.min(reach, Math.max(Math.abs(upper - lower), span));
  const interior = Math.acos(
    Math.min(1, Math.max(-1, (upper ** 2 + lower ** 2 - clamped ** 2) / (2 * upper * lower))),
  );
  const bent = {
    ...pose.angles,
    [chain.hinge]: clampDof(DOF_BY_ID.get(chain.hinge)!, (Math.PI - interior) / DEG),
  };
  // Limb, swing at rest, in the parent frame: what the swing turns onto target direction.
  const rest = { ...bent, [outer.id]: 0, [inner.id]: 0 };
  const w = apply(transpose(parent), sub3(effector(rest), rootPoint));
  const toward = unit(apply(transpose(parent), sub3(target, rootPoint)));
  const seeds: (readonly [number, number])[] = [[pose.angles[outer.id]!, pose.angles[inner.id]!]];
  if (toward !== undefined)
    seeds.unshift(...swingBranches(w, scale3(toward, norm(w)), outer, inner));
  let best: { angles: Record<DofId, number>; error: number } | undefined;
  for (const [outerAngle, innerAngle] of seeds) {
    const angles: Record<DofId, number> = {
      ...bent,
      [outer.id]: clampDof(outer, outerAngle),
      [inner.id]: clampDof(inner, innerAngle),
    };
    const settled = settle(angles, dofs, target, effector);
    if (best === undefined || settled.error < best.error) best = settled;
    if (best.error <= REACHED_M / 4) break;
  }
  const solved = actorPose(best!.angles, pose.root);
  const errorM = best!.error;
  if (errorM <= REACHED_M) return { kind: "reached", pose: solved, errorM };
  return {
    kind: "clamped",
    reason: span > reach ? "out-of-reach" : "joint-limit",
    pose: solved,
    errorM,
  };
}

const PARENT: ReadonlyMap<SegmentId, SegmentId> = new Map(
  SEGMENT_TREE.flatMap((segment) =>
    segment.parent === undefined ? [] : [[segment.id, segment.parent] as const],
  ),
);

/** Damped least squares from `angles` over `dofs`, each clamped per step; best step kept. */
function settle(
  angles: Record<DofId, number>,
  dofs: readonly DofId[],
  target: Vec3,
  effector: (values: Readonly<Record<DofId, number>>) => Vec3,
): { angles: Record<DofId, number>; error: number } {
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
    // Gain under a micrometre: a range or the reach stopped it, so settled.
    const gained = best.error - now;
    if (now < best.error) best = { angles: { ...angles }, error: now };
    if (gained < STALL_M) break;
  }
  return best;
}
