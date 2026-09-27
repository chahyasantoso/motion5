import type { ProjectDefinition, TrackDefinition } from "@motion5/core";

/**
 * The 2D half of the playground: one six-member chain, so the planar solve is FABRIK.
 *
 * The tentacle addresses its goal through the `targets` dict keyed by member id, the ADR-052
 * spelling. `solveChain` reads the derived shape, not an authored mode, and six members under one
 * goal dispatch to FABRIK; there is deliberately no two-member rig here, so the analytic two-bone
 * solve is not what this page demonstrates.
 *
 * Scroll animates only member weights: the scroll driver advances Motion, which seeks their
 * authored 0..1 stops, and FK remains the sole rest/solved angle blend owner (ADR-055). A drag or a
 * flip is a value-tier write that publishes at once, at whatever weight the scroll left the chain
 * (`goal-control.ts`). No graph edits.
 */

export const MOTION_ID = "rig";
/** The one page-scroll source key both playground Motions read; the host maps it once. */
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

/** The SVG stage the chain is authored into; its world frames publish in these units. */
export const STAGE_2D = { width: 560, height: 560, margin: 20 } as const;

export const TENTACLE: RigGeometry = {
  label: "FABRIK 2D tentacle",
  rootTrack: "tentacle-base",
  goalTrack: "tentacle-goal",
  solverTrack: "tentacle-solve",
  memberTracks: ["seg-1", "seg-2", "seg-3", "seg-4", "seg-5", "seg-6"],
  tipTrack: "seg-6",
  fkTailTrack: "fin",
  fkTailLength: 16,
  lengths: [42, 42, 42, 42, 42, 42],
  restRotations: [100, -20, -20, -20, -20, -20],
  root: { x: 280, y: 90 },
  goal: { x: 180, y: 290 },
};

/** A static transform frame: the root the chain hangs from, or the goal it reaches for. */
export function frameTrack(id: string, x: number, y: number): TrackDefinition {
  return {
    id,
    keyframes: { transform: { values: { x, y, rotation: 0 } } },
  };
}

/** The solver, addressing its one goal by member id through the `targets` dict. */
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

function rigTracks(rig: RigGeometry): readonly TrackDefinition[] {
  const tracks: TrackDefinition[] = [
    frameTrack(rig.rootTrack, rig.root.x, rig.root.y),
    frameTrack(rig.goalTrack, rig.goal.x, rig.goal.y),
    tentacleSolverTrack(false),
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
      tracks: rigTracks(TENTACLE),
    },
  ],
};

/**
 * Every node this document authors, kept as the oracle the suite compares the runtime's own answer
 * against rather than as the app's mount list. The app mounts from `motionIds()`, `trackIds` and
 * `freeTrackIds()` instead: a hand-written list beside the definition it copies has two owners and
 * no gate keeping them in step, and a case reading the same reader it is checking would prove
 * nothing.
 */
export const ALL_NODE_IDS: readonly string[] = [
  TENTACLE.rootTrack,
  TENTACLE.goalTrack,
  TENTACLE.solverTrack,
  ...TENTACLE.memberTracks,
  TENTACLE.fkTailTrack,
].map(nodeId);
