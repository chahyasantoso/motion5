import type { ProjectDefinition, TrackDefinition } from "@motion5/core";
type AuthoredProperty =
  | number
  | string
  | boolean
  | readonly { readonly p: number; readonly v: unknown; readonly ease?: unknown }[];

export const IK3D_MOTION_ID = "rig3d";
export const IK3D_NODE_ID = (trackId: string): string => `${IK3D_MOTION_ID}/${trackId}`;

export const IK3D = {
  label: "3D orbit rig",
  rootTrack: "root",
  goalTrack: "goal",
  poleTrack: "pole",
  solverTrack: "solve",
  memberTracks: ["upper", "fore", "hand"],
  tipTrack: "hand",
  lengths: [72, 58, 36],
  restRotations: [0, 12, -10],
} as const;

const ROOT = { x: 185, y: 185, z: 0 } as const;
const POLE = { x: 165, y: 275, z: 120 } as const;

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

const ORBIT = {
  x: [
    { p: 0, v: 285 },
    { p: 0.25, v: 245 },
    { p: 0.5, v: 165 },
    { p: 0.75, v: 125 },
    { p: 1, v: 185 },
  ],
  y: [
    { p: 0, v: 215 },
    { p: 0.25, v: 235 },
    { p: 0.5, v: 220 },
    { p: 0.75, v: 200 },
    { p: 1, v: 185 },
  ],
  z: [
    { p: 0, v: 18 },
    { p: 0.25, v: 62 },
    { p: 0.5, v: 18 },
    { p: 0.75, v: -54 },
    { p: 1, v: 18 },
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

export const ik3dPlaygroundProject: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "ik-playground-3d-v5",
  perspective: 720,
  motions: [
    {
      id: IK3D_MOTION_ID,
      trigger: { type: "manual" },
      tracks: ik3dPlaygroundTracks,
    },
  ],
};
