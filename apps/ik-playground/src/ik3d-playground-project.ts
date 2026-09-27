import type { MotionDefinition, TrackDefinition } from "@motion5/core";

type AuthoredProperty =
  | number
  | string
  | boolean
  | readonly { readonly p: number; readonly v: unknown; readonly ease?: unknown }[];

/**
 * The 3D arm, authored as one Motion of the playground project rather than as a project of its own.
 *
 * It rides the same page scroll as the 2D rigs through its own trigger source, so the runtime drives
 * its goal orbit from the trigger exactly as it drives the 2D weights: no second progress driver
 * beside the Motion. `playground-runtime.ts` composes it into the one project the app loads, which
 * is also the project the suite loads, so a composition the runtime refuses cannot pass the suite.
 */
export const IK3D_MOTION_ID = "rig3d";
export const IK3D_SCROLL_SOURCE = "ik3d-scroll";
/** The project perspective 3D keyframes require, and the stage's CSS perspective: one number. */
export const IK3D_PERSPECTIVE = 720;
export const IK3D_NODE_ID = (trackId: string): string => `${IK3D_MOTION_ID}/${trackId}`;

export const IK3D = {
  label: "3D orbit rig",
  rootTrack: "root",
  goalTrack: "goal",
  poleTrack: "pole",
  solverTrack: "solve",
  memberTracks: ["upper", "fore", "hand"],
  tipTrack: "hand",
  lengths: [52, 40, 26],
  restRotations: [0, 12, -10],
} as const;

/** The stage box the rig is authored into, in the same pixels its world frames publish. */
export const IK3D_WORLD = { height: 190 } as const;

const ROOT = { x: 95, y: 60, z: 0 } as const;
/** Below, behind the goal's sweep and toward the viewer, off every orbit line through the root. */
const POLE = { x: 45, y: 120, z: 70 } as const;

function frameTrack(
  id: string,
  values: Readonly<Record<string, AuthoredProperty>>,
): TrackDefinition {
  return { id, keyframes: { transform3d: { values } } };
}

function memberTrack(
  id: string,
  base: string,
  length: number,
  rotation: number,
  rotationX: number,
  rotationY: number,
): TrackDefinition {
  return {
    id,
    keyframes: {
      fk3d: {
        values: { length, rotation, rotationX, rotationY },
        requires: { base, solver: IK3D.solverTrack },
      },
    },
  };
}

/** A closed loop around the root, every stop inside the 118px reach and inside the stage box. */
const ORBIT = {
  x: [
    { p: 0, v: 190 },
    { p: 0.25, v: 150 },
    { p: 0.5, v: 80 },
    { p: 0.75, v: 35 },
    { p: 1, v: 190 },
  ],
  y: [
    { p: 0, v: 95 },
    { p: 0.25, v: 135 },
    { p: 0.5, v: 150 },
    { p: 0.75, v: 115 },
    { p: 1, v: 95 },
  ],
  z: [
    { p: 0, v: 20 },
    { p: 0.25, v: 50 },
    { p: 0.5, v: 15 },
    { p: 0.75, v: -45 },
    { p: 1, v: 20 },
  ],
} as const;

export const ik3dPlaygroundTracks: readonly TrackDefinition[] = [
  frameTrack(IK3D.rootTrack, ROOT),
  frameTrack(IK3D.goalTrack, ORBIT),
  frameTrack(IK3D.poleTrack, POLE),
  {
    id: IK3D.solverTrack,
    keyframes: {
      ik3d: {
        values: { inspect: true },
        requires: {
          root: IK3D.rootTrack,
          target: IK3D.goalTrack,
          pole: IK3D.poleTrack,
        },
      },
    },
  },
  memberTrack(IK3D.memberTracks[0], IK3D.rootTrack, IK3D.lengths[0], IK3D.restRotations[0], -8, 8),
  memberTrack(
    IK3D.memberTracks[1],
    IK3D.memberTracks[0],
    IK3D.lengths[1],
    IK3D.restRotations[1],
    6,
    -5,
  ),
  memberTrack(
    IK3D.memberTracks[2],
    IK3D.memberTracks[1],
    IK3D.lengths[2],
    IK3D.restRotations[2],
    -4,
    3,
  ),
];

export const IK3D_NODE_IDS: readonly string[] = ik3dPlaygroundTracks.map(({ id }) =>
  IK3D_NODE_ID(id),
);

export const ik3dPlaygroundMotion: MotionDefinition = {
  id: IK3D_MOTION_ID,
  trigger: { type: "scroll", source: IK3D_SCROLL_SOURCE },
  tracks: ik3dPlaygroundTracks,
};
