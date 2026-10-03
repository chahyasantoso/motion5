import type { Axis, Vec3 } from "../synthetic/rotation";

/**
 * The synthetic human's articulation: one tree of rigid segments, each rotating at its own origin
 * relative to its parent by its own degrees of freedom. The scene frame is right-handed with +y up;
 * the actor stands on y = 0 facing +z at rest, so its left is +x, the side a camera in front of it
 * (at +z, looking along -z) sees on the image's right, as MediaPipe's world axes have it.
 *
 * This is the truth the simulator measures from, owned here once; MediaPipe's 33 landmarks are
 * attached to it in `attachments.ts`, and nothing here knows MediaPipe.
 */
export const SEGMENTS = [
  "pelvis",
  "torso",
  "head",
  "left-upper-arm",
  "left-forearm",
  "left-hand",
  "right-upper-arm",
  "right-forearm",
  "right-hand",
  "left-thigh",
  "left-shin",
  "left-foot",
  "right-thigh",
  "right-shin",
  "right-foot",
] as const;
export type SegmentId = (typeof SEGMENTS)[number];

export type Side = "left" | "right";
/** +1 for the actor's left (+x at rest), -1 for its right: mirrors every lateral quantity. */
export const SIDE_SIGN: Readonly<Record<Side, 1 | -1>> = Object.freeze({ left: 1, right: -1 });

/**
 * Body proportions in metres. The defaults are the legacy synthetic subject's bones
 * (`replay/synthetic.ts`), so the twelve limb joints keep the lengths the gap filler was proven on,
 * plus the segments that subject did not have.
 */
export interface Proportions {
  readonly hipToShoulder: number;
  readonly shoulderWidth: number;
  readonly hipWidth: number;
  readonly upperArm: number;
  readonly forearm: number;
  readonly hand: number;
  readonly thigh: number;
  readonly shin: number;
  readonly ankleHeight: number;
  readonly footForward: number;
  readonly heelBack: number;
  readonly neckToHeadCentre: number;
}

export const DEFAULT_PROPORTIONS: Proportions = Object.freeze({
  hipToShoulder: 0.5,
  shoulderWidth: 0.38,
  hipWidth: 0.28,
  upperArm: 0.3,
  forearm: 0.27,
  hand: 0.18,
  thigh: 0.45,
  shin: 0.43,
  ankleHeight: 0.07,
  footForward: 0.19,
  heelBack: 0.06,
  neckToHeadCentre: 0.17,
});

/** Where a segment's origin sits in its parent's frame, from the proportions. */
export interface SegmentDefinition {
  readonly id: SegmentId;
  /** `undefined` only for the pelvis, whose frame is the root's. */
  readonly parent: SegmentId | undefined;
  readonly offset: (body: Proportions) => Vec3;
  /** The segment's length along its own axis, 0 for segments that are not a bone. */
  readonly length: (body: Proportions) => number;
}

function limb(side: Side): readonly SegmentDefinition[] {
  const s = SIDE_SIGN[side];
  return [
    {
      id: `${side}-upper-arm`,
      parent: "torso",
      offset: (b) => [(s * b.shoulderWidth) / 2, b.hipToShoulder, 0],
      length: (b) => b.upperArm,
    },
    {
      id: `${side}-forearm`,
      parent: `${side}-upper-arm`,
      offset: (b) => [0, -b.upperArm, 0],
      length: (b) => b.forearm,
    },
    {
      id: `${side}-hand`,
      parent: `${side}-forearm`,
      offset: (b) => [0, -b.forearm, 0],
      length: (b) => b.hand,
    },
    {
      id: `${side}-thigh`,
      parent: "pelvis",
      offset: (b) => [(s * b.hipWidth) / 2, 0, 0],
      length: (b) => b.thigh,
    },
    {
      id: `${side}-shin`,
      parent: `${side}-thigh`,
      offset: (b) => [0, -b.thigh, 0],
      length: (b) => b.shin,
    },
    {
      id: `${side}-foot`,
      parent: `${side}-shin`,
      offset: (b) => [0, -b.shin, 0],
      length: (b) => b.footForward,
    },
  ];
}

/** Parent before child, so forward kinematics is one pass in this order. */
export const SEGMENT_TREE: readonly SegmentDefinition[] = Object.freeze([
  { id: "pelvis", parent: undefined, offset: () => [0, 0, 0], length: () => 0 },
  { id: "torso", parent: "pelvis", offset: () => [0, 0, 0], length: (b) => b.hipToShoulder },
  {
    id: "head",
    parent: "torso",
    offset: (b) => [0, b.hipToShoulder, 0],
    length: (b) => b.neckToHeadCentre,
  },
  ...limb("left"),
  ...limb("right"),
]);

/**
 * One rotational degree of freedom: a right-handed rotation of `sign * angle` about its segment's
 * local `axis`. A segment's rotation is the product of its degrees of freedom in listed order, so
 * the last one listed acts first (twist about the bone, then abduction, then flexion). `min` and
 * `max` are the anatomical range in degrees the pose and the handles are held to.
 */
export interface Dof {
  readonly id: string;
  readonly segment: SegmentId;
  readonly axis: Axis;
  readonly sign: 1 | -1;
  readonly min: number;
  readonly max: number;
  readonly label: string;
}

function sideDofs(side: Side): readonly Dof[] {
  const s = SIDE_SIGN[side];
  const dof = (
    name: string,
    segment: SegmentId,
    axis: Axis,
    sign: 1 | -1,
    min: number,
    max: number,
    label: string,
  ): Dof => ({ id: `${side}-${name}`, segment, axis, sign, min, max, label: `${side} ${label}` });
  return [
    // Flexion raises a limb forward (+z); a bone hanging along -y reaches +z under -x rotation.
    dof("shoulder-flex", `${side}-upper-arm`, "x", -1, -60, 180, "shoulder flexion"),
    dof("shoulder-abduct", `${side}-upper-arm`, "z", s, -30, 180, "shoulder abduction"),
    dof("shoulder-twist", `${side}-upper-arm`, "y", s, -90, 90, "shoulder twist"),
    dof("elbow-flex", `${side}-forearm`, "x", -1, 0, 150, "elbow flexion"),
    dof("wrist-flex", `${side}-hand`, "x", -1, -70, 70, "wrist flexion"),
    dof("hip-flex", `${side}-thigh`, "x", -1, -30, 120, "hip flexion"),
    dof("hip-abduct", `${side}-thigh`, "z", s, -30, 60, "hip abduction"),
    dof("hip-twist", `${side}-thigh`, "y", s, -45, 45, "hip twist"),
    // The knee bends the shin backward (-z), the other way from the elbow.
    dof("knee-flex", `${side}-shin`, "x", 1, 0, 150, "knee flexion"),
    dof("ankle-flex", `${side}-foot`, "x", -1, -45, 30, "ankle flexion"),
  ];
}

export const DOFS: readonly Dof[] = Object.freeze([
  { id: "root-yaw", segment: "pelvis", axis: "y", sign: 1, min: -180, max: 180, label: "turn" },
  { id: "root-pitch", segment: "pelvis", axis: "x", sign: -1, min: -90, max: 90, label: "lean" },
  { id: "root-roll", segment: "pelvis", axis: "z", sign: 1, min: -90, max: 90, label: "tilt" },
  {
    id: "spine-flex",
    segment: "torso",
    axis: "x",
    sign: -1,
    min: -30,
    max: 70,
    label: "spine flexion",
  },
  {
    id: "spine-bend",
    segment: "torso",
    axis: "z",
    sign: 1,
    min: -35,
    max: 35,
    label: "spine side bend",
  },
  {
    id: "spine-twist",
    segment: "torso",
    axis: "y",
    sign: 1,
    min: -45,
    max: 45,
    label: "spine twist",
  },
  {
    id: "neck-flex",
    segment: "head",
    axis: "x",
    sign: -1,
    min: -45,
    max: 60,
    label: "neck flexion",
  },
  {
    id: "neck-bend",
    segment: "head",
    axis: "z",
    sign: 1,
    min: -40,
    max: 40,
    label: "neck side bend",
  },
  { id: "neck-twist", segment: "head", axis: "y", sign: 1, min: -70, max: 70, label: "neck twist" },
  ...sideDofs("left"),
  ...sideDofs("right"),
]);

export type DofId = string;

/** The degrees of freedom of each segment, in the order their rotations compose. */
export const SEGMENT_DOFS: Readonly<Record<SegmentId, readonly Dof[]>> = (() => {
  const bySegment = {} as Record<SegmentId, readonly Dof[]>;
  for (const segment of SEGMENTS)
    bySegment[segment] = DOFS.filter((dof) => dof.segment === segment);
  return Object.freeze(bySegment);
})();

export const DOF_BY_ID: ReadonlyMap<DofId, Dof> = new Map(DOFS.map((dof) => [dof.id, dof]));

/** `angle` held to `dof`'s anatomical range. */
export function clampDof(dof: Dof, angle: number): number {
  return Math.min(dof.max, Math.max(dof.min, angle));
}
