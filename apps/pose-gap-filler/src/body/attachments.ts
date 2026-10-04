import { MEDIAPIPE_LANDMARK_COUNT } from "../filler/landmarks";
import type { Vec3 } from "../synthetic/rotation";
import { SIDE_SIGN, type Proportions, type SegmentId, type Side } from "./skeleton";

/**
 * How one of MediaPipe's 33 landmarks is attached to the synthetic body. `joint` is a joint centre,
 * the origin of a segment, which is what MediaPipe's shoulders, elbows, wrists, hips, knees and
 * ankles mean. `surface` is a point on a segment chosen to resemble a face, hand or foot landmark;
 * it is a synthetic approximation, not a measured anatomical position, and is labelled so.
 */
export type Attachment =
  | { readonly kind: "joint"; readonly segment: SegmentId }
  | {
      readonly kind: "surface";
      readonly segment: SegmentId;
      readonly offset: (body: Proportions) => Vec3;
    };

export interface Landmark {
  readonly index: number;
  readonly name: string;
  readonly attachment: Attachment;
}

const joint = (segment: SegmentId): Attachment => ({ kind: "joint", segment });
const surface = (segment: SegmentId, offset: (body: Proportions) => Vec3): Attachment => ({
  kind: "surface",
  segment,
  offset,
});

/** A face point in the head frame: the head centre is `neckToHeadCentre` above the neck base. */
const face = (side: Side | undefined, x: number, up: number, forward: number): Attachment =>
  surface("head", (b) => [
    (side === undefined ? 0 : SIDE_SIGN[side]) * x,
    b.neckToHeadCentre + up,
    forward,
  ]);

/** An ear on the head sphere's side, so a camera in front grazes it rather than looking through. */
const ear = (side: Side): Attachment =>
  surface("head", (b) => [SIDE_SIGN[side] * b.headRadius, b.neckToHeadCentre + 0.02, 0]);

/** A hand point in the hand frame, which hangs along -y with the palm forward and the thumb out. */
const hand = (side: Side, out: number, down: number, forward: number): Attachment =>
  surface(`${side}-hand`, () => [SIDE_SIGN[side] * out, -down, forward]);

function sided(side: Side): ReadonlyArray<readonly [string, Attachment]> {
  return [
    [`${side}-shoulder`, joint(`${side}-upper-arm`)],
    [`${side}-elbow`, joint(`${side}-forearm`)],
    [`${side}-wrist`, joint(`${side}-hand`)],
    [`${side}-pinky`, hand(side, -0.025, 0.08, 0)],
    [`${side}-index`, hand(side, 0.02, 0.09, 0)],
    [`${side}-thumb`, hand(side, 0.045, 0.06, 0.012)],
    [`${side}-hip`, joint(`${side}-thigh`)],
    [`${side}-knee`, joint(`${side}-shin`)],
    [`${side}-ankle`, joint(`${side}-foot`)],
    [`${side}-heel`, surface(`${side}-foot`, (b) => [0, -b.ankleHeight * 0.7, -b.heelBack])],
    [`${side}-foot-index`, surface(`${side}-foot`, (b) => [0, -b.ankleHeight, b.footForward])],
  ];
}

const BY_NAME = new Map<string, Attachment>([
  ["nose", face(undefined, 0, 0.01, 0.105)],
  ["left-eye-inner", face("left", 0.015, 0.04, 0.09)],
  ["left-eye", face("left", 0.032, 0.04, 0.085)],
  ["left-eye-outer", face("left", 0.05, 0.04, 0.075)],
  ["right-eye-inner", face("right", 0.015, 0.04, 0.09)],
  ["right-eye", face("right", 0.032, 0.04, 0.085)],
  ["right-eye-outer", face("right", 0.05, 0.04, 0.075)],
  ["left-ear", ear("left")],
  ["right-ear", ear("right")],
  ["mouth-left", face("left", 0.025, -0.035, 0.095)],
  ["mouth-right", face("right", 0.025, -0.035, 0.095)],
  ...sided("left").flatMap((entry, index) => [entry, sided("right")[index]!]),
]);

/**
 * MediaPipe Pose Landmarker's 33 landmarks in their published index order (model card), each with
 * its attachment. The order of `BY_NAME` is that order: face 0-10, then left/right pairs.
 */
export const LANDMARKS: readonly Landmark[] = Object.freeze(
  [...BY_NAME.entries()].map(([name, attachment], index) => ({ index, name, attachment })),
);

if (LANDMARKS.length !== MEDIAPIPE_LANDMARK_COUNT)
  throw new Error(`Expected ${MEDIAPIPE_LANDMARK_COUNT} landmark attachments.`);

const OTHER_SIDE: Readonly<Record<Side, Side>> = Object.freeze({ left: "right", right: "left" });

/**
 * The anatomical partner of a sided landmark (`left-wrist` and `right-wrist`, `mouth-left` and
 * `mouth-right`), or `undefined` for the nose: what a left/right swap exchanges.
 */
export function partnerIndex(index: number): number | undefined {
  const name = LANDMARKS[index]?.name;
  const side = name?.match(/\b(left|right)\b/)?.[1] as Side | undefined;
  if (name === undefined || side === undefined) return undefined;
  const partner = name.replace(side, OTHER_SIDE[side]);
  return LANDMARKS.findIndex((item) => item.name === partner);
}
