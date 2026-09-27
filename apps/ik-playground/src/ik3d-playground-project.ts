import type { MotionDefinition, TrackDefinition } from "@motion5/core";
import { SCROLL_SOURCE } from "./ik-playground-project";
import { frameAround } from "./projection";

/**
 * The 3D half of the playground: a four-member chain, so the spatial solve is 3D FABRIK.
 *
 * Authored as one Motion of the playground project rather than as a project of its own, on the same
 * page-scroll source as the 2D chain, so the runtime drives both from one trigger key and there is
 * no second progress driver beside the Motion. What the scroll animates is only each member's
 * `fk3d.weight`, the rest-to-solved blend of ADR-116; the goal is a static `transform3d` frame a drag
 * rewrites through the value tier (`goal-control.ts`), and the pole is fixed. `playground-runtime.ts`
 * composes it into the one project the app loads, which is also the project the suite loads.
 *
 * Every renderer on the page draws this one rig: the CSS 3D stage and the three.js stage read the
 * same published frames, and both project them with `IK3D_VIEW` into `IK3D_FRAME` (`projection.ts`).
 */
export const IK3D_MOTION_ID = "rig3d";
export const IK3D_NODE_ID = (trackId: string): string => `${IK3D_MOTION_ID}/${trackId}`;

/**
 * The box the rig is authored into and the viewer distance it is seen from, in the pixels its
 * world frames publish. `perspective` is also the project perspective `validate-v5.ts` requires of
 * a project carrying 3D keyframes: one number for the document, the CSS stage and the three.js
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

/** The goal handle's radius in screen pixels: its 54px hit ring, drawn around the goal. */
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
  goalTrack: "goal",
  poleTrack: "pole",
  solverTrack: "solve",
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

type AuthoredScalars = Readonly<Record<string, number | boolean>>;

function frameTrack(id: string, values: AuthoredScalars): TrackDefinition {
  return { id, keyframes: { transform3d: { values } } };
}

/** Rest orientation and weight share the solver-bound `fk3d` group, as ADR-116 requires. */
function memberTrack(
  id: string,
  base: string,
  length: number,
  [rotation, rotationX, rotationY]: readonly [number, number, number],
): TrackDefinition {
  return {
    id,
    keyframes: {
      fk3d: {
        values: {
          length,
          rotation,
          rotationX,
          rotationY,
          weight: [
            { p: 0, v: 0 },
            { p: 1, v: 1 },
          ],
        },
        requires: { base, solver: IK3D.solverTrack },
      },
    },
  };
}

export const ik3dPlaygroundTracks: readonly TrackDefinition[] = [
  frameTrack(IK3D.rootTrack, IK3D.root),
  frameTrack(IK3D.goalTrack, IK3D.goal),
  frameTrack(IK3D.poleTrack, IK3D.pole),
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
  ...IK3D.memberTracks.map((id, index) =>
    memberTrack(
      id,
      index === 0 ? IK3D.rootTrack : IK3D.memberTracks[index - 1]!,
      IK3D.lengths[index]!,
      IK3D.rest[index]!,
    ),
  ),
];

export const IK3D_NODE_IDS: readonly string[] = ik3dPlaygroundTracks.map(({ id }) =>
  IK3D_NODE_ID(id),
);

export const ik3dPlaygroundMotion: MotionDefinition = {
  id: IK3D_MOTION_ID,
  trigger: { type: "scroll", source: SCROLL_SOURCE },
  tracks: ik3dPlaygroundTracks,
};
