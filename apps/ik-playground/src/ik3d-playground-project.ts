import type { MotionDefinition, TrackDefinition } from "@motion5/core";
import { SCROLL_SOURCE } from "./ik-playground-project";
import { frameAround } from "./projection";

/**
 * 3D playground: four-member chain solved as one aggregate table on the 2D chain's scroll source.
 * Scroll animates `fk3d.weight`; goal is a goals-table row a drag rewrites. */
export const IK3D_MOTION_ID = "rig3d";
export const IK3D_NODE_ID = (trackId: string): string => `${IK3D_MOTION_ID}/${trackId}`;

/**
 * Authored box and viewer distance in world pixels; `perspective` is the project perspective
 * `validate-v5.ts` requires of every 3D project; document, CSS stage and three.js camera agree. */
export const IK3D_VIEW = { width: 360, height: 300, perspective: 720 } as const;
export const IK3D_PERSPECTIVE = IK3D_VIEW.perspective;

/** Authored box inset by a margin; sizes `IK3D_FRAME`, which is what a drag clamps to. */
export const IK3D_GOAL_BOUNDS = {
  min: { x: 12, y: 12, z: -160 },
  max: { x: IK3D_VIEW.width - 12, y: IK3D_VIEW.height - 12, z: 160 },
} as const;

/** Goal handle radius in world pixels at the box plane: half its 54px hit ring, scaled with perspective. */
export const IK3D_GOAL_RADIUS = 27;

/** Every 3D stage draws this, in box pixels: the view widened so the goal handle stays whole at every bound. */
export const IK3D_FRAME = frameAround(IK3D_VIEW, IK3D_GOAL_BOUNDS, IK3D_GOAL_RADIUS);

export const IK3D = {
  label: "FABRIK 3D chain",
  rootTrack: "root",
  bodyTrack: "body",
  goalsTrack: "goals",
  goalRowId: "goal",
  /** Consumer alias addressing the goal row; never a graph node. */
  goalTrack: "goal",
  poleTrack: "pole",
  solverTrack: "solve",
  poseTrack: "pose",
  memberTracks: ["upper", "fore", "wrist", "hand"],
  tipTrack: "hand",
  lengths: [50, 42, 34, 26],
  /** Local rest orientation per member as `[rotation, rotationX, rotationY]`, degrees. */
  rest: [
    [70, -8, 8],
    [18, 6, -5],
    [16, -4, 3],
    [12, 3, -2],
  ],
  root: { x: 110, y: 70, z: 0 },
  goal: { x: 205, y: 170, z: 30 },
  /** Below and toward the viewer, off the root-to-goal line: bends every seed plane. */
  pole: { x: 70, y: 200, z: 90 },
} as const;

function bodyTrack(): TrackDefinition {
  return {
    id: IK3D.bodyTrack,
    input: {
      values: IK3D.memberTracks.map((id, index) => {
        const [rotation, rotationX, rotationY] = IK3D.rest[index]!;
        return {
          id,
          cells: {
            ...(index === 0 ? {} : { parentId: IK3D.memberTracks[index - 1]! }),
            length: IK3D.lengths[index]!,
            rotation,
            rotationX,
            rotationY,
            weight: [
              { p: 0, v: 0 },
              { p: 1, v: 1 },
            ],
          },
        };
      }),
    },
  };
}

function goalsTrack(): TrackDefinition {
  return {
    id: IK3D.goalsTrack,
    input: {
      values: [
        {
          id: IK3D.goalRowId,
          cells: { memberId: IK3D.tipTrack, x: IK3D.goal.x, y: IK3D.goal.y, z: IK3D.goal.z },
        },
      ],
    },
  };
}

export const ik3dPlaygroundTracks: readonly TrackDefinition[] = [
  {
    id: IK3D.rootTrack,
    input: {
      values: {
        x: IK3D.root.x,
        y: IK3D.root.y,
        z: IK3D.root.z,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
      },
    },
  },
  {
    id: IK3D.poleTrack,
    input: { values: { x: IK3D.pole.x, y: IK3D.pole.y, z: IK3D.pole.z } },
  },
  bodyTrack(),
  goalsTrack(),
  {
    id: IK3D.solverTrack,
    plugin: "ik3d",
    input: {
      values: { inspect: true },
      requires: {
        chain: IK3D.bodyTrack,
        goals: IK3D.goalsTrack,
        base: IK3D.rootTrack,
        pole: IK3D.poleTrack,
      },
    },
  },
  {
    id: IK3D.poseTrack,
    plugin: "fk3d",
    input: {
      values: {},
      requires: {
        chain: IK3D.bodyTrack,
        solved: IK3D.solverTrack,
        base: IK3D.rootTrack,
      },
    },
  },
];

/** Engine nodes this Motion authors; member ids are pose-row aliases, not nodes. */
export const IK3D_NODE_IDS: readonly string[] = [
  IK3D.rootTrack,
  IK3D.poleTrack,
  IK3D.bodyTrack,
  IK3D.goalsTrack,
  IK3D.solverTrack,
  IK3D.poseTrack,
].map(IK3D_NODE_ID);

export const ik3dPlaygroundMotion: MotionDefinition = {
  id: IK3D_MOTION_ID,
  trigger: { type: "scroll", source: SCROLL_SOURCE },
  tracks: ik3dPlaygroundTracks,
};
