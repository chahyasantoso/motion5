import {
  Engine,
  PluginCatalog,
  type EngineOptions,
  type ProjectDefinition,
  type ProjectHandle,
  type TrackDefinition,
} from "@motion5/core";
import { selectRow } from "@motion5/core/plugin-api";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { unreachable } from "../filler/unreachable";
import { LIMBS, type LimbId } from "../filler/landmarks";
import type { Vec } from "../filler/vec";
import { POSE_MOTION_ID, limbTracks, poseNodeId } from "./tracks";
import type { LimbWrite } from "./writer";

const INITIAL_LENGTH = 100;

function imageLimbTracks(limb: LimbId): readonly TrackDefinition[] {
  const ids = limbTracks(limb);
  return [
    {
      id: ids.root,
      input: { values: { x: 0, y: 0, rotation: 0 } },
    },
    {
      id: ids.body,
      input: {
        values: [
          { id: ids.upper, cells: { length: INITIAL_LENGTH, rotation: 0, weight: 1 } },
          {
            id: ids.lower,
            cells: { parentId: ids.upper, length: INITIAL_LENGTH, rotation: 0, weight: 1 },
          },
        ],
      },
    },
    {
      id: ids.goal,
      input: {
        values: [{ id: ids.goal, cells: { memberId: ids.lower, x: 0, y: INITIAL_LENGTH * 1.5 } }],
      },
    },
    {
      id: ids.solve,
      plugin: "ik",
      input: {
        values: { flip: false },
        requires: {
          chain: ids.body,
          goals: ids.goal,
          base: ids.root,
        },
      },
    },
    {
      id: ids.pose,
      plugin: "fk",
      input: {
        values: {},
        requires: {
          chain: ids.body,
          solved: ids.solve,
          base: ids.root,
        },
      },
    },
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

function worldLimbTracks(limb: LimbId): readonly TrackDefinition[] {
  const ids = limbTracks(limb);
  return [
    {
      id: ids.root,
      input: {
        values: {
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
        },
      },
    },
    {
      id: ids.body,
      input: {
        values: [
          {
            id: ids.upper,
            cells: {
              length: INITIAL_LENGTH,
              rotation: 0,
              rotationX: 0,
              rotationY: 0,
              weight: 1,
            },
          },
          {
            id: ids.lower,
            cells: {
              parentId: ids.upper,
              length: INITIAL_LENGTH,
              rotation: 0,
              rotationX: 0,
              rotationY: 0,
              weight: 1,
            },
          },
        ],
      },
    },
    {
      id: ids.goal,
      input: {
        values: [
          {
            id: ids.goal,
            cells: {
              memberId: ids.lower,
              x: 0,
              y: INITIAL_LENGTH * 1.5,
              z: 0,
            },
          },
        ],
      },
    },
    {
      id: ids.pole,
      input: {
        values: { x: 0, y: 0, z: INITIAL_LENGTH, rotation: 0, rotationX: 0, rotationY: 0 },
      },
    },
    {
      id: ids.solve,
      plugin: "ik3d",
      input: {
        values: {},
        requires: {
          chain: ids.body,
          goals: ids.goal,
          base: ids.root,
          pole: ids.pole,
        },
      },
    },
    {
      id: ids.pose,
      plugin: "fk3d",
      input: {
        values: {},
        requires: {
          chain: ids.body,
          solved: ids.solve,
          base: ids.root,
        },
      },
    },
  ];
}

export function worldRigProject(): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "pose-gap-filler-world",
    motions: [
      {
        id: POSE_MOTION_ID,
        trigger: { type: "manual" },
        tracks: LIMBS.flatMap((limb) => worldLimbTracks(limb.id)),
      },
    ],
  };
}

export type RigPorts = Pick<EngineOptions, "clock" | "interpolator" | "scheduler">;

export function loadImageRig(ports: RigPorts): ProjectHandle {
  return loadRig(ports, "image");
}

export function loadWorldRig(ports: RigPorts): ProjectHandle {
  return loadRig(ports, "world");
}

function loadRig(ports: RigPorts, space: "image" | "world"): ProjectHandle {
  const plugins = new PluginCatalog();
  let definition: ProjectDefinition;
  switch (space) {
    case "image":
      plugins.registerAll([fkPlugin, ikPlugin]);
      definition = imageRigProject();
      break;
    case "world":
      plugins.registerAll([fk3dPlugin, ik3dPlugin]);
      definition = worldRigProject();
      break;
    default:
      throw new Error(`Invalid rig space: ${space}`);
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

export interface SolvedLimb {
  readonly middle: Vec;
  readonly tip: Vec;
}

function rowCells(
  project: ProjectHandle,
  poseTrackId: string,
  rowId: string,
): Readonly<Record<string, unknown>> | undefined {
  const patch = project.get(poseNodeId(poseTrackId));
  if (patch?.status !== "ready") return undefined;
  const picked = selectRow(patch.outputs.values, rowId);
  switch (picked.kind) {
    case "row":
      return picked.cells;
    case "missing-row":
    case "missing-output":
    case "wrong-kind":
      return undefined;
    default:
      return unreachable(picked, "pose row selection");
  }
}

function rowVector(
  cells: Readonly<Record<string, unknown>>,
  keys: readonly string[],
): Vec | undefined {
  const position = keys.map((key) => cells[key]);
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
  const upperCells = rowCells(project, ids.pose, ids.upper);
  const lowerCells = rowCells(project, ids.pose, ids.lower);
  if (upperCells === undefined || lowerCells === undefined) return undefined;
  const middle = rowVector(upperCells, keys);
  const tip = rowVector(lowerCells, keys);
  return middle === undefined || tip === undefined ? undefined : { middle, tip };
}

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
        throw new Error(`Invalid limb write: ${(write as { kind: string }).kind}`);
    }
  }
  return solved;
}
