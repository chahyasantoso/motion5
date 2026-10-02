import { LANDMARKS } from "../body/attachments";
import type { SegmentId } from "../body/skeleton";
import { segmentEnd, type ActorFrame } from "../synthetic/actor";
import type { Camera } from "../synthetic/camera";
import type { Vec3 } from "../synthetic/rotation";

/** A bone drawn between two scene points of the truth: a segment's origin and a reached point. */
type Bone = (frame: ActorFrame) => readonly [Vec3, Vec3];

const between =
  (from: SegmentId, to: SegmentId): Bone =>
  (frame) => [frame.segments[from].origin, frame.segments[to].origin];
const landmark = (name: string) => LANDMARKS.findIndex((item) => item.name === name);
const toLandmark =
  (from: SegmentId, name: string): Bone =>
  (frame) => [frame.segments[from].origin, frame.landmarks[landmark(name)]!];

/** The stick figure the views draw: every segment, ending at its child or at a landmark. */
export const BONES: readonly Bone[] = [
  (frame) => [frame.landmarks[landmark("left-hip")]!, frame.landmarks[landmark("right-hip")]!],
  (frame) => [frame.segments["left-upper-arm"].origin, frame.segments["right-upper-arm"].origin],
  (frame) => [
    midpoint(frame.segments["left-thigh"].origin, frame.segments["right-thigh"].origin),
    midpoint(frame.segments["left-upper-arm"].origin, frame.segments["right-upper-arm"].origin),
  ],
  (frame) => [frame.segments.head.origin, segmentEnd(frame, "head", -frame.body.neckToHeadCentre)],
  ...(["left", "right"] as const).flatMap((side): Bone[] => [
    between(`${side}-upper-arm`, `${side}-forearm`),
    between(`${side}-forearm`, `${side}-hand`),
    toLandmark(`${side}-hand`, `${side}-index`),
    between(`${side}-thigh`, `${side}-shin`),
    between(`${side}-shin`, `${side}-foot`),
    toLandmark(`${side}-foot`, `${side}-foot-index`),
    toLandmark(`${side}-foot`, `${side}-heel`),
  ]),
];

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

/** Where a scene point is drawn on a canvas viewed through `camera`, mapped by `display`. */
export function projector(
  camera: Camera,
  display: (point: readonly number[]) => readonly number[] = (point) => point,
): (point: Vec3) => readonly number[] | undefined {
  return (point) => {
    const pixel = camera.pixel(camera.toCamera(point));
    return pixel === undefined ? undefined : display(pixel);
  };
}

export interface SceneStyle {
  readonly bone: string;
  readonly joint: string;
  readonly width: number;
}

export const TRUTH_STYLE: SceneStyle = Object.freeze({
  bone: "#475569",
  joint: "#94a3b8",
  width: 9,
});

/**
 * Draws the truth actor as a capsule stick figure and its 33 landmarks, through `project`. A point
 * behind the camera is skipped rather than wrapped. Drawing reads the frozen truth and writes only
 * the canvas.
 */
export function drawActor(
  context: CanvasRenderingContext2D,
  frame: ActorFrame,
  project: (point: Vec3) => readonly number[] | undefined,
  style: SceneStyle = TRUTH_STYLE,
): void {
  context.lineCap = "round";
  context.strokeStyle = style.bone;
  context.lineWidth = style.width;
  for (const bone of BONES) {
    const [from, to] = bone(frame).map(project);
    if (from === undefined || to === undefined) continue;
    context.beginPath();
    context.moveTo(from[0]!, from[1]!);
    context.lineTo(to[0]!, to[1]!);
    context.stroke();
  }
  context.fillStyle = style.joint;
  for (const point of frame.landmarks) {
    const at = project(point);
    if (at === undefined) continue;
    context.beginPath();
    context.arc(at[0]!, at[1]!, 2.5, 0, 2 * Math.PI);
    context.fill();
  }
}

/** Marks the observation camera's position in a debug view, so the person sees where it looks from. */
export function drawCameraMarker(
  context: CanvasRenderingContext2D,
  observation: Camera,
  project: (point: Vec3) => readonly number[] | undefined,
): void {
  const at = project(observation.spec.position);
  const target = project(observation.spec.target);
  if (at === undefined) return;
  context.fillStyle = "#f472b6";
  context.fillRect(at[0]! - 5, at[1]! - 5, 10, 10);
  if (target === undefined) return;
  context.strokeStyle = "#f472b6";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(at[0]!, at[1]!);
  context.lineTo(target[0]!, target[1]!);
  context.stroke();
}
