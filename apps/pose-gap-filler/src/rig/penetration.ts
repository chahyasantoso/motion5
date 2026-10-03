import { add, distance, dot, norm, scale, sub, type Vec } from "../filler/vec";
import { presentedPosition, type FilledFrame } from "../filler/frame";
import { LIMBS } from "../filler/landmarks";
import type { SolvedLimb } from "./rig";
import type { LimbId } from "../filler/landmarks";

export interface Capsule {
  readonly id: string;
  readonly from: Vec;
  readonly to: Vec;
  readonly radiusMm: number;
}
export interface Penetration {
  readonly a: string;
  readonly b: string;
  readonly depthMm: number;
}
const clamp = (x: number) => Math.max(0, Math.min(1, x));

/** Convex segment distance: test the interior stationary point and all four boundary minima. */
export function segmentDistance(a: Vec, b: Vec, c: Vec, d: Vec): number {
  const u = sub(b, a),
    v = sub(d, c),
    w = sub(a, c);
  const aa = dot(u, u),
    bb = dot(u, v),
    cc = dot(v, v);
  const dd = dot(u, w),
    ee = dot(v, w);
  let best = Infinity;
  const consider = (s: number, t: number) => {
    best = Math.min(best, norm(sub(add(w, scale(u, s)), scale(v, t))));
  };
  consider(0, cc > 0 ? clamp(ee / cc) : 0);
  consider(1, cc > 0 ? clamp((ee + bb) / cc) : 0);
  consider(aa > 0 ? clamp(-dd / aa) : 0, 0);
  consider(aa > 0 ? clamp((bb - dd) / aa) : 0, 1);
  const determinant = aa * cc - bb * bb;
  if (determinant > 1e-12 * aa * cc) {
    const s = (bb * ee - cc * dd) / determinant;
    const t = (aa * ee - bb * dd) / determinant;
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) consider(s, t);
  }
  return best;
}

export function capsulePenetration(a: Capsule, b: Capsule): Penetration | undefined {
  for (const capsule of [a, b]) {
    if (
      !Number.isFinite(capsule.radiusMm) ||
      capsule.radiusMm < 0 ||
      ![capsule.from, capsule.to].every(
        (p) => p.length === 3 && p.every(Number.isFinite) && norm(p) <= 1e12,
      )
    )
      throw new Error("Capsules need finite bounded 3D points and nonnegative radii.");
  }
  const depthMm = a.radiusMm + b.radiusMm - segmentDistance(a.from, a.to, b.from, b.to);
  return depthMm > 1e-7 ? { a: a.id, b: b.id, depthMm } : undefined;
}

/** Coarse solved-rig diagnostics only. Never use simulator truth, move meshes or correct a pose. */
export function diagnosePenetration(
  frame: FilledFrame,
  solved: ReadonlyMap<LimbId, SolvedLimb>,
): readonly Penetration[] {
  const capsules: Array<Capsule & { readonly limb: LimbId; readonly lower: boolean }> = [];
  for (const limb of LIMBS) {
    const pose = solved.get(limb.id);
    const root = presentedPosition(frame.joints[limb.root]);
    if (pose === undefined || root === undefined) continue;
    capsules.push(
      { id: limb.upper, limb: limb.id, lower: false, from: root, to: pose.middle, radiusMm: 30 },
      { id: limb.lower, limb: limb.id, lower: true, from: pose.middle, to: pose.tip, radiusMm: 25 },
    );
  }
  const contacts: Penetration[] = [];
  const keep = (a: Capsule, b: Capsule) => {
    const contact = capsulePenetration(a, b);
    if (contact !== undefined) contacts.push(contact);
  };
  for (let i = 0; i < capsules.length; i++)
    for (let j = i + 1; j < capsules.length; j++)
      if (capsules[i]!.limb !== capsules[j]!.limb) keep(capsules[i]!, capsules[j]!);
  const roots = ["left-shoulder", "right-shoulder", "left-hip", "right-hip"] as const;
  const points = roots.map((id) => presentedPosition(frame.joints[id]));
  if (points.every((p) => p !== undefined)) {
    const [ls, rs, lh, rh] = points as [Vec, Vec, Vec, Vec];
    const trunk: Capsule = {
      id: "trunk",
      from: scale(add(ls, rs), 0.5),
      to: scale(add(lh, rh), 0.5),
      radiusMm: Math.min(distance(ls, rs), distance(lh, rh)) * 0.4,
    };
    // Proximal attachment intersections are intentional, not collision evidence.
    for (const capsule of capsules) if (capsule.lower) keep(capsule, trunk);
  }
  return contacts;
}
