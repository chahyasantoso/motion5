import {
  measurementOf,
  type JointObservation,
  type JointTrust,
  type LandmarkFrame,
  type TrustedFrame,
} from "../src/filler/frame";
import { jointRecord, type JointId } from "../src/filler/landmarks";
import { IMAGE_SPACE, type LandmarkSpace } from "../src/filler/space";
import type { Vec } from "../src/filler/vec";

/** A frame measuring exactly `positions`, every other joint absent. */
export function frameOf(
  positions: Partial<Record<JointId, Vec>>,
  tMs = 0,
  space: LandmarkSpace = IMAGE_SPACE,
  visibility: Partial<Record<JointId, number>> = {},
): LandmarkFrame {
  return {
    tMs,
    space,
    joints: jointRecord((joint): JointObservation => {
      const position = positions[joint];
      return position === undefined
        ? { kind: "absent" }
        : { kind: "measured", position, visibility: visibility[joint] ?? 1 };
    }),
  };
}

/** `frame` with every measured joint trusted, except those named in `gaps`, which are forced. */
export function trustedOf(frame: LandmarkFrame, gaps: readonly JointId[] = []): TrustedFrame {
  return {
    ...frame,
    trust: jointRecord((joint): JointTrust => {
      if (gaps.includes(joint)) return { kind: "gap", reason: "forced" };
      const measurement = measurementOf(frame.joints[joint]);
      return measurement === undefined
        ? { kind: "gap", reason: "absent" }
        : { kind: "trusted", position: measurement.position, visibility: measurement.visibility };
    }),
  };
}

/** A two-arm, two-leg image pose facing the camera, arms bent outward. */
export const STANDING: Readonly<Record<JointId, Vec>> = {
  "left-shoulder": [360, 140],
  "right-shoulder": [280, 140],
  "left-elbow": [400, 210],
  "right-elbow": [240, 210],
  "left-wrist": [380, 280],
  "right-wrist": [260, 280],
  "left-hip": [345, 270],
  "right-hip": [295, 270],
  "left-knee": [355, 360],
  "right-knee": [285, 360],
  "left-ankle": [352, 450],
  "right-ankle": [288, 450],
};

/** `pose` without `joint`, so a frame built from it reads that joint as absent. */
export function without(
  pose: Readonly<Record<JointId, Vec>>,
  joint: JointId,
): Partial<Record<JointId, Vec>> {
  const { [joint]: _dropped, ...rest } = pose;
  return rest;
}
