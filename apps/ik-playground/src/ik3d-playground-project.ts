import type { MotionDefinition, TrackDefinition } from "@motion5/core";
import { SCROLL_SOURCE } from "./ik-playground-project";
import { frameAround } from "./projection";

/**
 * The 3D half of the playground: a four-member chain solved as one aggregate table.
 *
 * Authored as one Motion of the playground project rather than as a project of its own, on the same
 * page-scroll source as the 2D chain, so the runtime drives both from one trigger key and there is
 * no second progress driver beside the Motion. What the scroll animates is only each member's
 * `fk3d.weight`, the rest-to-solved blend of ADR-116; the goal is a row in the goals table a drag
 * rewrites through the value tier (`goal-control.ts`), and the pole is fixed.
 * `playground-runtime.ts` composes it into the one project the app loads, which is also the project
 * the suite loads.
 *
 * Every renderer on the page draws this one rig: the CSS 3D stage and the three.js stage read the
 * same published pose rows, and both project them with `IK3D_VIEW` into `IK3D_FRAME`
 * (`projection.ts`).
 */
export const IK3D_MOTION_ID = "rig3d";
export const IK3D_NODE_ID = (trackId: string): string => `${IK3D_MOTION_ID}/${trackId}`;

/**
 * The box the rig is authored into and the viewer distance it is seen from, in the pixels its
 * world frames publish. `perspective` is also the project perspective `validate-v5.ts` requires of
 * a project carrying 3D tracks: one number for the document, the CSS stage and the three.js
 * camera.
 */
export const IK3D_VIEW = { width: 360, height: 300, perspective: 720 } as const;
export const IK3D_PERSPECTIVE = IK3D_VIEW.perspective;

/**
 * The authored box inset by a margin, at every depth a goal may take. It sizes `IK3D_FRAME`; a drag
 * is clamped to the frame itself (`goal-control.ts`), so the whole drawn stage is reachable.
 */
export const IK3D_GOAL_BOUNDS = {
  min: { x: 12, y: 12, z: -160 },
  max: { x: IK3D_VIEW.width - 12, y: IK3D_VIEW.height - 12, z: 160 },
} as const;

/**
 * The goal handle's radius in world pixels at the box plane: its 54px hit ring, drawn around the
 * goal and scaled by perspective with it, so it spans more screen pixels toward the viewer.
 */
export const IK3D_GOAL_RADIUS = 27;

/**
 * What every 3D stage draws, in box pixels: the box widened until the goal handle stays whole
 * wherever `IK3D_GOAL_BOUNDS` reaches. A goal toward the viewer is drawn outside the box it was
 * authored in, so a stage that showed only the box clipped the handle and stopped the drag at an
 * edge nobody could see.
 */
export const IK3D_FRAME = frameAround(IK3D_VIEW, IK3D_GOAL_BOUNDS, IK3D_GOAL_RADIUS);

export const IK3D = {
  label: "FABRIK 3D chain",
  rootTrack: "root",
  bodyTrack: "body",
  goalsTrack: "goals",
  goalRowId: "goal",
  /** The consumer alias the goal row is addressed by, never a graph node. */
  goalTrack: "goal",
  poleTrack: "pole",
  solverTrack: "solve",
  poseTrack: "pose",
  memberTracks: ["upper", "fore", "wrist", "hand"],
  tipTrack: "hand",
  lengths: [50, 42, 34, 26],
  /** Local rest orientation per member, `[rotation, rotationX, rotationY]` in degrees. */
  rest: [
    [70, -8, 8],
    [18, 6, -5],
    [16, -4, 3],
    [12, 3, -2],
  ],
  root: { x: 110, y: 70, z: 0 },
  goal: { x: 205, y: 170, z: 30 },
  /** Below and toward the viewer, off the root-to-goal line, so it bends every seed plane. */
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

/** The engine nodes this Motion authors; member ids are pose-row aliases, not nodes. */
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
