import { LANDMARKS, type Attachment } from "../body/attachments";
import {
  DEFAULT_PROPORTIONS,
  DOFS,
  SEGMENT_DOFS,
  SEGMENT_TREE,
  clampDof,
  type DofId,
  type Proportions,
  type SegmentId,
} from "../body/skeleton";
import { unreachable } from "../filler/unreachable";
import {
  DEG,
  IDENTITY,
  add3,
  apply,
  axisRotation,
  multiply,
  type Mat3,
  type Vec3,
} from "./rotation";

/**
 * One instant of the synthetic human: where its pelvis is in the scene and every degree of freedom
 * in degrees. Angles are held to their anatomical ranges when a pose is made (`actorPose`), so a
 * pose is always one a body can take.
 */
export interface ActorPose {
  readonly root: Vec3;
  readonly angles: Readonly<Record<DofId, number>>;
}

/** Standing with the pelvis at leg height above the floor, feet on y = 0, every angle zero. */
export function standingRoot(body: Proportions = DEFAULT_PROPORTIONS): Vec3 {
  return [0, body.thigh + body.shin + body.ankleHeight, 0];
}

/** A pose from partial angles: every unnamed degree of freedom is 0 and every one is clamped. */
export function actorPose(
  angles: Readonly<Record<DofId, number>> = {},
  root: Vec3 = standingRoot(),
): ActorPose {
  for (const id of Object.keys(angles))
    if (!DOFS.some((dof) => dof.id === id)) throw new Error(`Unknown degree of freedom ${id}.`);
  for (const value of [...Object.values(angles), ...root])
    if (!Number.isFinite(value)) throw new Error("Actor pose values must be finite.");
  return Object.freeze({
    root: Object.freeze([...root]) as unknown as Vec3,
    angles: Object.freeze(
      Object.fromEntries(DOFS.map((dof) => [dof.id, clampDof(dof, angles[dof.id] ?? 0)])),
    ),
  });
}

/** One segment's frame in the scene: its origin and its rotation from the scene frame. */
export interface SegmentFrame {
  readonly origin: Vec3;
  readonly rotation: Mat3;
}

/** The truth at one instant: every segment's frame and MediaPipe's 33 landmarks in the scene. */
export interface ActorFrame {
  readonly pose: ActorPose;
  readonly body: Proportions;
  readonly segments: Readonly<Record<SegmentId, SegmentFrame>>;
  /** Index-aligned with MediaPipe's 33 landmarks, scene metres. */
  readonly landmarks: readonly Vec3[];
}

function segmentRotation(segment: SegmentId, pose: ActorPose): Mat3 {
  return SEGMENT_DOFS[segment].reduce(
    (rotation, dof) =>
      multiply(rotation, axisRotation(dof.axis, dof.sign * pose.angles[dof.id]! * DEG)),
    IDENTITY,
  );
}

function attach(
  attachment: Attachment,
  frames: Record<SegmentId, SegmentFrame>,
  body: Proportions,
): Vec3 {
  const frame = frames[attachment.segment];
  switch (attachment.kind) {
    case "joint":
      return frame.origin;
    case "surface":
      return add3(frame.origin, apply(frame.rotation, attachment.offset(body)));
    default:
      return unreachable(attachment, "landmark attachment");
  }
}

/**
 * Forward kinematics, the one owner of where the truth is: each segment's frame is its parent's,
 * translated by the segment's offset and rotated by its own degrees of freedom, in tree order. The
 * result is frozen, so nothing downstream (an observation edit, a corruption, the page) can move
 * the truth it was measured from.
 */
export function actorFrame(pose: ActorPose, body: Proportions = DEFAULT_PROPORTIONS): ActorFrame {
  const segments = {} as Record<SegmentId, SegmentFrame>;
  for (const definition of SEGMENT_TREE) {
    const parent: SegmentFrame =
      definition.parent === undefined
        ? { origin: pose.root, rotation: IDENTITY }
        : segments[definition.parent];
    const origin = add3(parent.origin, apply(parent.rotation, definition.offset(body)));
    const rotation = multiply(parent.rotation, segmentRotation(definition.id, pose));
    segments[definition.id] = Object.freeze({
      origin: Object.freeze(origin),
      rotation: Object.freeze(rotation),
    });
  }
  const landmarks = LANDMARKS.map((landmark) =>
    Object.freeze(attach(landmark.attachment, segments, body)),
  );
  return Object.freeze({
    pose,
    body,
    segments: Object.freeze(segments),
    landmarks: Object.freeze(landmarks),
  });
}

/** The scene point a segment's far end reaches: its origin plus its length along its own -y. */
export function segmentEnd(frame: ActorFrame, segment: SegmentId, length: number): Vec3 {
  const { origin, rotation } = frame.segments[segment];
  return add3(origin, apply(rotation, [0, -length, 0]));
}

/** The midpoint of the hips, which MediaPipe's world landmarks are centred on. */
export function hipMidpoint(frame: ActorFrame): Vec3 {
  const left = frame.segments["left-thigh"].origin;
  const right = frame.segments["right-thigh"].origin;
  return [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2, (left[2] + right[2]) / 2];
}
