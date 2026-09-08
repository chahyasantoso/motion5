import type { ProjectDefinition, TrackDefinition } from "@motion5/core";

/**
 * Two rigs, two goal spellings, two solvers: one project.
 *
 * The arm binds the bare `target` slot, the degenerate single-leaf case from ADR-051, and its
 * derived shape (two members, one goal) dispatches to the analytic two-bone solve. The tentacle
 * addresses its goal through the `targets` dict keyed by member id, the ADR-052 spelling, and its
 * six members dispatch to FABRIK. `solveChain` reads the derived shape, not an authored mode, so
 * neither rig names its solver and neither rig could choose the other one.
 *
 * Only member weights animate: the scroll driver advances Motion, which seeks their authored
 * 0..1 stops. FK remains the sole rest/solved angle blend owner (ADR-055). Drags and flips
 * stage intent; accepted scroll emissions apply it through value-tier writes. No graph edits.
 */

export const MOTION_ID = "rig";
export const SCROLL_SOURCE = "ik-scroll";

/** Authored track ids qualify with the motion prefix once loaded, so renderers address nodes. */
export const nodeId = (trackId: string): string => `${MOTION_ID}/${trackId}`;

export interface RigGeometry {
  readonly label: string;
  readonly rootTrack: string;
  readonly goalTrack: string;
  readonly solverTrack: string;
  readonly memberTracks: readonly string[];
  readonly tipTrack: string;
  readonly fkTailTrack: string;
  readonly fkTailLength: number;
  readonly lengths: readonly number[];
  readonly restRotations: readonly number[];
  readonly root: { readonly x: number; readonly y: number };
  readonly goal: { readonly x: number; readonly y: number };
}

export const ARM: RigGeometry = {
  label: "2-bone arm",
  rootTrack: "arm-shoulder",
  goalTrack: "arm-goal",
  solverTrack: "arm-solve",
  memberTracks: ["upper-arm", "forearm"],
  tipTrack: "forearm",
  fkTailTrack: "hand",
  fkTailLength: 22,
  lengths: [80, 60],
  restRotations: [110, -55],
  root: { x: 250, y: 300 },
  goal: { x: 365, y: 360 },
};

export const TENTACLE: RigGeometry = {
  label: "FABRIK tentacle",
  rootTrack: "tentacle-base",
  goalTrack: "tentacle-goal",
  solverTrack: "tentacle-solve",
  memberTracks: ["seg-1", "seg-2", "seg-3", "seg-4", "seg-5", "seg-6"],
  tipTrack: "seg-6",
  fkTailTrack: "fin",
  fkTailLength: 16,
  lengths: [45, 45, 45, 45, 45, 45],
  restRotations: [150, -30, -30, -30, -30, -30],
  root: { x: 820, y: 180 },
  goal: { x: 870, y: 420 },
};

export const RIGS = [ARM, TENTACLE] as const;

/** A static transform frame: the root a chain hangs from, or the goal it reaches for. */
export function frameTrack(id: string, x: number, y: number): TrackDefinition {
  return {
    id,
    keyframes: { transform: { values: { x, y, rotation: 0 } } },
  };
}

/** The arm's initial solver, on the bare `target` slot. Runtime flips retain these bindings. */
export function armSolverTrack(flip: boolean): TrackDefinition {
  return {
    id: ARM.solverTrack,
    keyframes: {
      ik: {
        values: { flip },
        requires: { root: ARM.rootTrack, target: ARM.goalTrack },
      },
    },
  };
}

/** The tentacle's solver, addressing its one goal by member id through the `targets` dict. */
export function tentacleSolverTrack(flip: boolean): TrackDefinition {
  return {
    id: TENTACLE.solverTrack,
    keyframes: {
      ik: {
        values: { flip },
        requires: {
          root: TENTACLE.rootTrack,
          targets: { [TENTACLE.tipTrack]: TENTACLE.goalTrack },
        },
      },
    },
  };
}

/** Rest rotation and weight share the solver-bound FK group, as ADR-055 requires. */
function memberTrack(
  id: string,
  base: string,
  solver: string,
  length: number,
  rotation: number,
): TrackDefinition {
  return {
    id,
    keyframes: {
      fk: {
        values: {
          length,
          rotation,
          weight: [
            { p: 0, v: 0 },
            { p: 1, v: 1 },
          ],
        },
        requires: { base, solver },
      },
    },
  };
}

/** An ordinary FK bone below the chain, unaware any solve happened above it. */
function fkTailTrack(id: string, base: string, length: number): TrackDefinition {
  return {
    id,
    keyframes: { fk: { values: { length }, requires: { base } } },
  };
}

function rigTracks(
  rig: RigGeometry,
  solverTrack: (flip: boolean) => TrackDefinition,
): readonly TrackDefinition[] {
  const tracks: TrackDefinition[] = [
    frameTrack(rig.rootTrack, rig.root.x, rig.root.y),
    frameTrack(rig.goalTrack, rig.goal.x, rig.goal.y),
    solverTrack(false),
  ];
  let base = rig.rootTrack;
  rig.memberTracks.forEach((id, index) => {
    tracks.push(
      memberTrack(id, base, rig.solverTrack, rig.lengths[index]!, rig.restRotations[index]!),
    );
    base = id;
  });
  tracks.push(fkTailTrack(rig.fkTailTrack, base, rig.fkTailLength));
  return tracks;
}

export const ikPlaygroundProject: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "ik-playground-v5",
  motions: [
    {
      id: MOTION_ID,
      trigger: { type: "scroll", source: SCROLL_SOURCE },
      tracks: [...rigTracks(ARM, armSolverTrack), ...rigTracks(TENTACLE, tentacleSolverTrack)],
    },
  ],
};

export const ALL_NODE_IDS: readonly string[] = RIGS.flatMap((rig) => [
  rig.rootTrack,
  rig.goalTrack,
  rig.solverTrack,
  ...rig.memberTracks,
  rig.fkTailTrack,
]).map(nodeId);
