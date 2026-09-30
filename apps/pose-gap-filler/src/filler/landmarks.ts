/**
 * The MediaPipe pose landmarks the four limbs use, and the limb topology over them.
 *
 * One chain per limb, never a shared-root tree: each arm is a two-bone chain from its shoulder and
 * each leg a two-bone chain from its hip, so the BENCH-IK `conflicted` multi-goal cases cannot
 * appear. The shoulder and hip widths are torso bones: they carry no chain of their own, but the
 * filler reads them to rebuild a missing root from its trusted partner and the gap detector reads
 * them as the scale of a root's speed.
 */
export const JOINTS = [
  "left-shoulder",
  "right-shoulder",
  "left-elbow",
  "right-elbow",
  "left-wrist",
  "right-wrist",
  "left-hip",
  "right-hip",
  "left-knee",
  "right-knee",
  "left-ankle",
  "right-ankle",
] as const;
export type JointId = (typeof JOINTS)[number];

/** Indices into MediaPipe Pose Landmarker's 33-landmark result, per its published model card. */
export const MEDIAPIPE_INDEX: Readonly<Record<JointId, number>> = {
  "left-shoulder": 11,
  "right-shoulder": 12,
  "left-elbow": 13,
  "right-elbow": 14,
  "left-wrist": 15,
  "right-wrist": 16,
  "left-hip": 23,
  "right-hip": 24,
  "left-knee": 25,
  "right-knee": 26,
  "left-ankle": 27,
  "right-ankle": 28,
};
export const MEDIAPIPE_LANDMARK_COUNT = 33;

export const BONES = {
  "left-upper-arm": { from: "left-shoulder", to: "left-elbow" },
  "left-forearm": { from: "left-elbow", to: "left-wrist" },
  "right-upper-arm": { from: "right-shoulder", to: "right-elbow" },
  "right-forearm": { from: "right-elbow", to: "right-wrist" },
  "left-thigh": { from: "left-hip", to: "left-knee" },
  "left-shin": { from: "left-knee", to: "left-ankle" },
  "right-thigh": { from: "right-hip", to: "right-knee" },
  "right-shin": { from: "right-knee", to: "right-ankle" },
  "shoulder-width": { from: "right-shoulder", to: "left-shoulder" },
  "hip-width": { from: "right-hip", to: "left-hip" },
} as const satisfies Record<string, { readonly from: JointId; readonly to: JointId }>;
export type BoneId = keyof typeof BONES;
export const BONE_IDS = Object.keys(BONES) as readonly BoneId[];

export type LimbId = "left-arm" | "right-arm" | "left-leg" | "right-leg";

export interface Limb {
  readonly id: LimbId;
  /** The chain root: the shoulder or hip the chain hangs from. */
  readonly root: JointId;
  /** The joint the solve places: elbow or knee. */
  readonly middle: JointId;
  /** The chain tip, which is the goal: wrist or ankle. */
  readonly tip: JointId;
  /** The partner root across the torso, the parent a missing root is rebuilt from. */
  readonly partner: JointId;
  /** The same-side root of the other girdle, the torso's long axis for this limb. */
  readonly across: JointId;
  readonly upper: BoneId;
  readonly lower: BoneId;
  /** The torso bone spanning this root and its partner. */
  readonly width: BoneId;
}

export const LIMBS: readonly Limb[] = [
  {
    id: "left-arm",
    root: "left-shoulder",
    middle: "left-elbow",
    tip: "left-wrist",
    partner: "right-shoulder",
    across: "left-hip",
    upper: "left-upper-arm",
    lower: "left-forearm",
    width: "shoulder-width",
  },
  {
    id: "right-arm",
    root: "right-shoulder",
    middle: "right-elbow",
    tip: "right-wrist",
    partner: "left-shoulder",
    across: "right-hip",
    upper: "right-upper-arm",
    lower: "right-forearm",
    width: "shoulder-width",
  },
  {
    id: "left-leg",
    root: "left-hip",
    middle: "left-knee",
    tip: "left-ankle",
    partner: "right-hip",
    across: "left-shoulder",
    upper: "left-thigh",
    lower: "left-shin",
    width: "hip-width",
  },
  {
    id: "right-leg",
    root: "right-hip",
    middle: "right-knee",
    tip: "right-ankle",
    partner: "left-hip",
    across: "right-shoulder",
    upper: "right-thigh",
    lower: "right-shin",
    width: "hip-width",
  },
];

/**
 * The bone whose length is a joint's speed scale in the gap detector: the bone ending at the joint,
 * and the torso width for a root, which has no bone ending at it.
 */
export function scaleBone(joint: JointId): BoneId {
  for (const limb of LIMBS) {
    if (limb.root === joint) return limb.width;
    if (limb.middle === joint) return limb.upper;
    if (limb.tip === joint) return limb.lower;
  }
  throw new Error(`Joint ${joint} belongs to no limb.`);
}

/** One record over every joint, built once per call so a frame never shares mutable state. */
export function jointRecord<T>(value: (joint: JointId) => T): Record<JointId, T> {
  const record = {} as Record<JointId, T>;
  for (const joint of JOINTS) record[joint] = value(joint);
  return record;
}
