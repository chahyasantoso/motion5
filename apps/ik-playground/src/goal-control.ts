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
 * A drag's answer: where one rig's goal should be, in the units that rig's frames publish.
 *
 * Closed over the two rigs the page carries, read by one exhaustive switch, so a third rig cannot be
 * dragged until this file says where its goal lives and how far it may go.
 */
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
type GoalRecord = Exclude<GoalValues, readonly unknown[]>;

function isGoalRecord(values: GoalValues): values is GoalRecord {
  return typeof values === "object" && values !== null && !Array.isArray(values);
}

/**
 * The authored goal record, narrowed here because a goal is a record and a table has no `x`.
 *
 * Not a fallback: the two rigs author a record, so a table or an absent value is a programming
 * error in the project and is refused rather than guessed at.
 */
function goalRecord(track: TrackDefinition): GoalRecord {
  const values = track.input?.values;
  if (values === undefined || !isGoalRecord(values))
    throw new TypeError(`Track "${track.id}" must author its goal as one record.`);
  return values;
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
 * The one writer of playground intent. Every gesture on every stage lands here.
 *
 * A move or a flip is a value-tier write (`TrackHandle.input.values`): one invalidate, one
 * publication, no graph replacement, and no progress change, so the chain moves immediately at
 * the member weights the scroll set. Scroll owns weight and nothing else; this owns the goal and the
 * flip and nothing else. A non-finite point is ignored rather than written, and every point is
 * clamped to what its stage draws (the planar margin box; the spatial depth range and the frame
 * with the whole handle inside it), so a drag can never park a goal where nobody can grab it back.
 */
export function createGoalControl(project: Pick<ProjectHandle, "track">): GoalControl {
  return {
    move(goal) {
      if (!finite(goal)) return;
      switch (goal.rig) {
        case "planar": {
          const { x, y } = goal;
          const handle = project.track(nodeId(TENTACLE.goalTrack));
          handle.input.values.set({
            ...goalRecord(handle.definition),
            x: clamp(x, STAGE_2D.margin, STAGE_2D.width - STAGE_2D.margin),
            y: clamp(y, STAGE_2D.margin, STAGE_2D.height - STAGE_2D.margin),
          });
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
          const handle = project.track(IK3D_NODE_ID(IK3D.goalTrack));
          handle.input.values.set({ ...goalRecord(handle.definition), x, y, z });
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
