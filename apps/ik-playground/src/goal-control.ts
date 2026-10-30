import type { ProjectHandle, TrackDefinition } from "@motion5/core";
import { STAGE_2D, TENTACLE, nodeId } from "./ik-playground-project";
import {
  IK3D,
  IK3D_FRAME,
  IK3D_GOAL_BOUNDS,
  IK3D_GOAL_RADIUS,
  IK3D_NODE_ID,
  IK3D_VIEW,
} from "./ik3d-playground-project";
import { clampToFrame } from "./projection";
import { unreachable } from "./unreachable";

const IK3D_DEPTH = { min: IK3D_GOAL_BOUNDS.min.z, max: IK3D_GOAL_BOUNDS.max.z } as const;

/**
 * A drag's answer: where one rig's goal goes, in that rig's frame units. One exhaustive switch,
 * so a third rig cannot be dragged until this file says where its goal lives and its bound. */
export type GoalMove =
  | { readonly rig: "planar"; readonly x: number; readonly y: number }
  | { readonly rig: "spatial"; readonly x: number; readonly y: number; readonly z: number };

export interface GoalControl {
  /** Writes the goal now; the chain answers at whatever weight the scroll left it. */
  move(goal: GoalMove): void;
  /** Writes the planar solver's `flip` now, the FABRIK seed side. */
  flip(value: boolean): void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type GoalValues = NonNullable<NonNullable<TrackDefinition["input"]>["values"]>;
type GoalTable = Extract<GoalValues, readonly unknown[]>;

/** Goals are one row per member id, checked whole; a bad shape is refused, not repaired. */
function goalTable(track: TrackDefinition): GoalTable {
  const values = track.input?.values;
  if (values === undefined || !Array.isArray(values))
    throw new TypeError(`Track "${track.id}" must author its goals as one table.`);
  const seen = new Set<string>();
  for (const row of values) {
    const cells: unknown = row.cells;
    if (
      row === null ||
      typeof row !== "object" ||
      typeof row.id !== "string" ||
      row.id.length === 0 ||
      cells === null ||
      typeof cells !== "object" ||
      Array.isArray(cells)
    )
      throw new TypeError(`Track "${track.id}" has a malformed goal row.`);
    const member = (cells as Readonly<Record<string, unknown>>).memberId;
    if (typeof member !== "string" || member.length === 0)
      throw new TypeError(`Track "${track.id}" has a goal row that names no member.`);
    if (seen.has(member))
      throw new TypeError(`Track "${track.id}" names goal member "${member}" more than once.`);
    seen.add(member);
  }
  return values;
}

type GoalCoordinates = {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
};

function rewriteGoal(
  track: TrackDefinition,
  member: string,
  coordinates: GoalCoordinates,
): GoalTable {
  const table = goalTable(track);
  const matches = table.filter((row) => row.cells.memberId === member);
  if (matches.length !== 1)
    throw new TypeError(
      `Track "${track.id}" must author exactly one goal for member "${member}", found ${matches.length}.`,
    );
  return table.map((row) =>
    row.cells.memberId === member
      ? {
          ...row,
          cells: {
            ...row.cells,
            x: coordinates.x,
            y: coordinates.y,
            ...(coordinates.z === undefined ? {} : { z: coordinates.z }),
          },
        }
      : row,
  );
}

function finite(goal: GoalMove): boolean {
  switch (goal.rig) {
    case "planar":
      return Number.isFinite(goal.x) && Number.isFinite(goal.y);
    case "spatial":
      return Number.isFinite(goal.x) && Number.isFinite(goal.y) && Number.isFinite(goal.z);
    default:
      return unreachable(goal, "goal");
  }
}

/**
 * The one writer of playground intent: every gesture lands here. Writes are value-tier; non-finite
 * points drop, the rest clamp to the drawn bounds; each edit rewrites the whole goal table. */
export function createGoalControl(project: Pick<ProjectHandle, "track">): GoalControl {
  return {
    move(goal) {
      if (!finite(goal)) return;
      switch (goal.rig) {
        case "planar": {
          const { x, y } = goal;
          const handle = project.track(nodeId(TENTACLE.goalsTrack));
          handle.input.values.set(
            rewriteGoal(handle.definition, TENTACLE.tipTrack, {
              x: clamp(x, STAGE_2D.margin, STAGE_2D.width - STAGE_2D.margin),
              y: clamp(y, STAGE_2D.margin, STAGE_2D.height - STAGE_2D.margin),
            }),
          );
          return;
        }
        case "spatial": {
          const { x, y, z } = clampToFrame(
            IK3D_VIEW,
            IK3D_FRAME,
            IK3D_GOAL_RADIUS,
            IK3D_DEPTH,
            goal,
          );
          const handle = project.track(IK3D_NODE_ID(IK3D.goalsTrack));
          handle.input.values.set(rewriteGoal(handle.definition, IK3D.tipTrack, { x, y, z }));
          return;
        }
        default:
          return unreachable(goal, "goal");
      }
    },
    flip(value) {
      project.track(nodeId(TENTACLE.solverTrack)).input.values.setField({ field: "flip" }, value);
    },
  };
}
