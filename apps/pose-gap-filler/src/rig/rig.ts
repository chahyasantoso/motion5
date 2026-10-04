import {
  Engine,
  PluginRegistry,
  type EngineOptions,
  type ProjectDefinition,
  type ProjectHandle,
  type TrackDefinition,
} from "@motion5/core";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { transformPlugin } from "@motion5/plugins/transform";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import { LIMBS, type LimbId } from "../filler/landmarks";
import type { Vec } from "../filler/vec";
import { unreachable } from "../filler/unreachable";
import { POSE_MOTION_ID, limbTracks, poseNodeId } from "./tracks";
import type { LimbWrite } from "./writer";

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

/**
 * Four two-bone chains on one `manual` Motion: nothing drives progress, so the only thing that
 * moves the rig is the writer's value batch (`writer.ts`). Each limb is its own chain with its own
 * root, goal and solver, never a shared-root tree.
 *
 * FK weight is authored as the constant 1: the solve is the pose, and there is no rest blend to
 * animate (the playground keyframes its weight 0..1 on scroll; this rig must not).
 */
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

/** A separate 3D project, with identical track names but no image/world state shared. */
export function worldRigProject(): ProjectDefinition {
  const tracks = LIMBS.flatMap((limb): readonly TrackDefinition[] => {
    const ids = limbTracks(limb.id);
    const point = (id: string, x: number, y: number, z: number): TrackDefinition => ({
      id,
      keyframes: { transform3d: { values: { x, y, z, rotation: 0, rotationX: 0, rotationY: 0 } } },
    });
    const member = (id: string, base: string): TrackDefinition => ({
      id,
      keyframes: {
        fk3d: {
          values: { length: INITIAL_LENGTH, weight: 1 },
          requires: { base, solver: ids.solve },
        },
      },
    });
    return [
      point(ids.root, 0, 0, 0),
      point(ids.goal, 0, INITIAL_LENGTH * 1.5, 0),
      point(ids.pole, 0, 0, INITIAL_LENGTH),
      {
        id: ids.solve,
        keyframes: { ik3d: { requires: { root: ids.root, target: ids.goal, pole: ids.pole } } },
      },
      member(ids.upper, ids.root),
      member(ids.lower, ids.upper),
    ];
  });
  return {
    schemaVersion: 5,
    projectId: "pose-gap-filler-world",
    motions: [{ id: POSE_MOTION_ID, trigger: { type: "manual" }, tracks }],
  };
}

export type RigPorts = Pick<EngineOptions, "clock" | "interpolator" | "scheduler">;

/**
 * Loads and mounts the image-space rig. A failure after load disposes the project it created, so
 * a caller owns a project only once this returns.
 */
export function loadImageRig(ports: RigPorts): ProjectHandle {
  return loadRig(ports, "image");
}

export function loadWorldRig(ports: RigPorts): ProjectHandle {
  return loadRig(ports, "world");
}

function loadRig(ports: RigPorts, space: "image" | "world"): ProjectHandle {
  const plugins = new PluginRegistry();
  let definition: ProjectDefinition;
  switch (space) {
    case "image":
      for (const plugin of [transformPlugin, fkPlugin, ikPlugin]) plugins.register(plugin);
      definition = imageRigProject();
      break;
    case "world":
      for (const plugin of [transform3dPlugin, fk3dPlugin, ik3dPlugin]) plugins.register(plugin);
      definition = worldRigProject();
      break;
    default:
      return unreachable(space, "rig space");
  }
  const project = new Engine({ ...ports, plugins }).load(definition);
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

/**
 * The solved chains that show this frame's pose: only limbs the writer placed this frame. A skipped
 * limb keeps its last solve in the project, and drawing it would present an old pose as current.
 */
export function readWrittenLimbs(
  project: ProjectHandle,
  writes: Readonly<Record<LimbId, LimbWrite>>,
  keys: readonly string[] = ["x", "y"],
): ReadonlyMap<LimbId, SolvedLimb> {
  const solved = new Map<LimbId, SolvedLimb>();
  for (const limb of LIMBS) {
    const write = writes[limb.id];
    switch (write.kind) {
      case "written": {
        const chain = readSolvedLimb(project, limb.id, keys);
        if (chain !== undefined) solved.set(limb.id, chain);
        break;
      }
      case "skipped":
        break;
      default:
        return unreachable(write, "limb write");
    }
  }
  return solved;
}
