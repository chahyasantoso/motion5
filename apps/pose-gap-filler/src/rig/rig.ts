import {
  Engine,
  PluginRegistry,
  type EngineOptions,
  type ProjectDefinition,
  type ProjectHandle,
  type TrackDefinition,
} from "@motion5/core";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { ikPlugin } from "@motion5/core/plugins/ik";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { LIMBS, type LimbId } from "../filler/landmarks";
import type { Vec } from "../filler/vec";

/**
 * Four two-bone chains on one `manual` Motion: nothing drives progress, so the only thing that
 * moves the rig is the writer's value batch (`writer.ts`). Each limb is its own chain with its own
 * root, goal and solver, never a shared-root tree.
 *
 * FK weight is authored as the constant 1: the solve is the pose, and there is no rest blend to
 * animate (the playground keyframes its weight 0..1 on scroll; this rig must not).
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

/** Placeholder geometry until the estimator knows the person: any reachable pose loads. */
const INITIAL_LENGTH = 100;

function imageLimbTracks(limb: LimbId): readonly TrackDefinition[] {
  const ids = limbTracks(limb);
  const member = (id: string, base: string): TrackDefinition => ({
    id,
    keyframes: {
      fk: {
        values: { length: INITIAL_LENGTH, rotation: 0, weight: 1 },
        requires: { base, solver: ids.solve },
      },
    },
  });
  return [
    { id: ids.root, keyframes: { transform: { values: { x: 0, y: 0, rotation: 0 } } } },
    {
      id: ids.goal,
      keyframes: { transform: { values: { x: 0, y: INITIAL_LENGTH * 1.5, rotation: 0 } } },
    },
    {
      id: ids.solve,
      keyframes: {
        ik: { values: { flip: false }, requires: { root: ids.root, target: ids.goal } },
      },
    },
    member(ids.upper, ids.root),
    member(ids.lower, ids.upper),
  ];
}

export function imageRigProject(): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "pose-gap-filler-image",
    motions: [
      {
        id: POSE_MOTION_ID,
        trigger: { type: "manual" },
        tracks: LIMBS.flatMap((limb) => imageLimbTracks(limb.id)),
      },
    ],
  };
}

export type RigPorts = Pick<EngineOptions, "clock" | "interpolator" | "scheduler">;

/**
 * Loads and mounts the image-space rig. A failure after load disposes the project it created, so
 * a caller owns a project only once this returns.
 */
export function loadImageRig(ports: RigPorts): ProjectHandle {
  const plugins = new PluginRegistry();
  for (const plugin of [transformPlugin, fkPlugin, ikPlugin]) plugins.register(plugin);
  const project = new Engine({ ...ports, plugins }).load(imageRigProject());
  try {
    for (const node of project.motion(POSE_MOTION_ID).trackIds) project.mount(node);
    return project;
  } catch (error) {
    project.dispose();
    throw error;
  }
}

/** The solved middle and tip of one chain, read from what its members last published. */
export interface SolvedLimb {
  readonly middle: Vec;
  readonly tip: Vec;
}

function publishedTip(project: ProjectHandle, trackId: string, keys: readonly string[]) {
  const patch = project.get(poseNodeId(trackId));
  if (patch?.status !== "ready") return undefined;
  const position = keys.map((key) => patch.values[key]);
  return position.every((value): value is number => typeof value === "number")
    ? (position as Vec)
    : undefined;
}

export function readSolvedLimb(
  project: ProjectHandle,
  limb: LimbId,
  keys: readonly string[] = ["x", "y"],
): SolvedLimb | undefined {
  const ids = limbTracks(limb);
  const middle = publishedTip(project, ids.upper, keys);
  const tip = publishedTip(project, ids.lower, keys);
  return middle === undefined || tip === undefined ? undefined : { middle, tip };
}
