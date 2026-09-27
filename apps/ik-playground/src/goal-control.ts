import type { ProjectHandle } from "@motion5/core";
import { STAGE_2D, TENTACLE, nodeId } from "./ik-playground-project";
import { IK3D, IK3D_GOAL_BOUNDS, IK3D_NODE_ID } from "./ik3d-playground-project";

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

function finite(goal: GoalMove): boolean {
  switch (goal.rig) {
    case "planar":
      return Number.isFinite(goal.x) && Number.isFinite(goal.y);
    case "spatial":
      return Number.isFinite(goal.x) && Number.isFinite(goal.y) && Number.isFinite(goal.z);
    default: {
      const unhandled: never = goal;
      throw new Error(`Unhandled goal: ${JSON.stringify(unhandled)}`);
    }
  }
}

/**
 * The one writer of playground intent. Every gesture on every stage lands here.
 *
 * A move or a flip is a value-tier write (`TrackHandle.setValues` / `setKeyframe`): one invalidate,
 * one publication, no graph replacement, and no progress change, so the chain moves immediately at
 * the member weights the scroll set. Scroll owns weight and nothing else; this owns the goal and the
 * flip and nothing else. A non-finite point is ignored rather than written, and every point is
 * clamped to the box its stage draws, so a drag can never park a goal where nobody can grab it back.
 */
export function createGoalControl(project: Pick<ProjectHandle, "track">): GoalControl {
  return {
    move(goal) {
      if (!finite(goal)) return;
      switch (goal.rig) {
        case "planar":
          project.track(nodeId(TENTACLE.goalTrack)).setValues({
            x: clamp(goal.x, STAGE_2D.margin, STAGE_2D.width - STAGE_2D.margin),
            y: clamp(goal.y, STAGE_2D.margin, STAGE_2D.height - STAGE_2D.margin),
          });
          return;
        case "spatial": {
          const { min, max } = IK3D_GOAL_BOUNDS;
          project.track(IK3D_NODE_ID(IK3D.goalTrack)).setValues({
            x: clamp(goal.x, min.x, max.x),
            y: clamp(goal.y, min.y, max.y),
            z: clamp(goal.z, min.z, max.z),
          });
          return;
        }
        default: {
          const unhandled: never = goal;
          throw new Error(`Unhandled goal: ${JSON.stringify(unhandled)}`);
        }
      }
    },
    flip(value) {
      project.track(nodeId(TENTACLE.solverTrack)).setKeyframe("ik", "flip", value);
    },
  };
}
