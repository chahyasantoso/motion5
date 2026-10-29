import type { ProjectDefinition, TrackDefinition } from "@motion5/core";

/**
 * The 2D half of the playground: one six-member chain solved as one aggregate table.
 *
 * The body publishes every member as a row, the goals table addresses the leaf by `memberId`, and
 * the solve and pose tracks run the Phase 5 `ik` then `fk` pipeline. Scroll animates only member
 * weights: the scroll driver advances Motion, which seeks their authored 0..1 stops, and FK remains
 * the sole rest/solved angle blend owner (ADR-055). A drag or a flip is a value-tier write that
 * publishes at once, at whatever weight the scroll left the chain (`goal-control.ts`). No graph
 * edits.
 */

export const MOTION_ID = "rig";
/** The one page-scroll source key both playground Motions read; the host maps it once. */
export const SCROLL_SOURCE = "ik-scroll";

/** Authored track ids qualify with the motion prefix once loaded, so renderers address nodes. */
export const nodeId = (trackId: string): string => `${MOTION_ID}/${trackId}`;

export interface RigGeometry {
  readonly label: string;
  readonly rootTrack: string;
  /** The one body table every member row belongs to. */
  readonly bodyTrack: string;
  /** The one goals table; its single row addresses the chain leaf by `memberId`. */
  readonly goalsTrack: string;
  /** The consumer alias the goal row is addressed by, never a graph node. */
  readonly goalTrack: string;
  readonly goalRowId: string;
  readonly solverTrack: string;
  readonly poseTrack: string;
  /** Member row ids, which renderers read as consumer aliases rather than graph nodes. */
  readonly memberTracks: readonly string[];
  readonly tipTrack: string;
  readonly finLength: number;
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
  bodyTrack: "tentacle-body",
  goalsTrack: "tentacle-goals",
  goalTrack: "tentacle-goal",
  goalRowId: "goal",
  solverTrack: "tentacle-solve",
  poseTrack: "tentacle-pose",
  memberTracks: ["seg-1", "seg-2", "seg-3", "seg-4", "seg-5", "seg-6"],
  tipTrack: "seg-6",
  finLength: 16,
  lengths: [42, 42, 42, 42, 42, 42],
  restRotations: [100, -20, -20, -20, -20, -20],
  root: { x: 280, y: 90 },
  goal: { x: 180, y: 290 },
};

/** The rest pose of the chain, one row per member in parent-first order. */
function bodyTrack(rig: RigGeometry): TrackDefinition {
  return {
    id: rig.bodyTrack,
    input: {
      values: rig.memberTracks.map((id, index) => ({
        id,
        cells: {
          ...(index === 0 ? {} : { parentId: rig.memberTracks[index - 1]! }),
          length: rig.lengths[index]!,
          rotation: rig.restRotations[index]!,
          weight: [
            { p: 0, v: 0 },
            { p: 1, v: 1 },
          ],
        },
      })),
    },
  };
}

/** The chain's goal, addressed to the leaf member the solver reaches for. */
function goalsTrack(rig: RigGeometry): TrackDefinition {
  return {
    id: rig.goalsTrack,
    input: {
      values: [
        {
          id: rig.goalRowId,
          cells: { memberId: rig.tipTrack, x: rig.goal.x, y: rig.goal.y },
        },
      ],
    },
  };
}

function rigTracks(rig: RigGeometry): readonly TrackDefinition[] {
  return [
    {
      id: rig.rootTrack,
      input: { values: { x: rig.root.x, y: rig.root.y, rotation: 0 } },
    },
    bodyTrack(rig),
    goalsTrack(rig),
    {
      id: rig.solverTrack,
      plugin: "ik",
      input: {
        values: { flip: false, inspect: true },
        requires: {
          chain: rig.bodyTrack,
          goals: rig.goalsTrack,
          base: rig.rootTrack,
        },
      },
    },
    {
      id: rig.poseTrack,
      plugin: "fk",
      input: {
        values: {},
        requires: {
          chain: rig.bodyTrack,
          solved: rig.solverTrack,
          base: rig.rootTrack,
        },
      },
    },
  ];
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
 * against rather than as the app's mount list. Member ids are aliases over pose rows, not nodes.
 */
export const ALL_NODE_IDS: readonly string[] = [
  TENTACLE.rootTrack,
  TENTACLE.bodyTrack,
  TENTACLE.goalsTrack,
  TENTACLE.solverTrack,
  TENTACLE.poseTrack,
].map(nodeId);
