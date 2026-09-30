import type { LimbId } from "../filler/landmarks";

/**
 * The rig's naming, and nothing else: the Motion every chain is authored on and the track ids of
 * one limb's chain. The rig authors under these names and the writer addresses them, so both read
 * them here and neither needs the other's module.
 */
export const POSE_MOTION_ID = "pose";

export const poseNodeId = (trackId: string): string => `${POSE_MOTION_ID}/${trackId}`;

/** The track ids one limb's chain is authored under. */
export interface LimbTracks {
  readonly root: string;
  readonly goal: string;
  readonly solve: string;
  readonly upper: string;
  readonly lower: string;
}

export function limbTracks(limb: LimbId): LimbTracks {
  return {
    root: `${limb}-root`,
    goal: `${limb}-goal`,
    solve: `${limb}-solve`,
    upper: `${limb}-upper`,
    lower: `${limb}-lower`,
  };
}
