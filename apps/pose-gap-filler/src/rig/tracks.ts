import type { LimbId } from "../filler/landmarks";

export const POSE_MOTION_ID = "pose";

export const poseNodeId = (trackId: string): string => `${POSE_MOTION_ID}/${trackId}`;

export interface LimbTracks {
  readonly root: string;
  readonly body: string;
  readonly goal: string;
  readonly pole: string;
  readonly solve: string;
  readonly pose: string;
  readonly upper: string;
  readonly lower: string;
}

export function limbTracks(limb: LimbId): LimbTracks {
  return {
    root: `${limb}-root`,
    body: `${limb}-body`,
    goal: `${limb}-goal`,
    pole: `${limb}-pole`,
    solve: `${limb}-solve`,
    pose: `${limb}-pose`,
    upper: `${limb}-upper`,
    lower: `${limb}-lower`,
  };
}
