import type { ProjectHandle } from "@motion5/core";
import type { ScrollSource } from "@motion5/core/adapters";
import { RIGS, nodeId } from "./ik-playground-project";

export interface GoalPoint {
  readonly x: number;
  readonly y: number;
}
export type PendingGoals = Readonly<Record<string, GoalPoint>>;

export function initialGoals(): PendingGoals {
  return Object.freeze(
    Object.fromEntries(RIGS.map((rig) => [rig.goalTrack, Object.freeze({ ...rig.goal })])),
  );
}

/** Owns pending intent. Only commit writes the runtime; the UI renders immutable snapshots. */
export function createScrollReach(project: Pick<ProjectHandle, "track">) {
  let goals = initialGoals();
  let appliedGoals = goals;
  const flips = new Map(RIGS.map((rig) => [rig.solverTrack, false]));
  const appliedFlips = new Map(flips);
  return {
    get goals(): PendingGoals {
      return goals;
    },
    moveGoal(track: string, x: number, y: number): PendingGoals {
      if (!Object.hasOwn(goals, track)) throw new Error(`Unknown pending goal: ${track}`);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return goals;
      if (goals[track]!.x === x && goals[track]!.y === y) return goals;
      goals = Object.freeze({ ...goals, [track]: Object.freeze({ x, y }) });
      return goals;
    },
    flip(solver: string, value: boolean): void {
      if (!flips.has(solver)) throw new Error(`Unknown pending solver: ${solver}`);
      flips.set(solver, value);
    },
    commit(): void {
      // Only pending intent is authored here. Motion owns progress and interpolated FK weights.
      // Each value write owns its invalidate; this is not a multi-track transaction.

      for (const rig of RIGS) {
        const next = goals[rig.goalTrack]!;
        const previous = appliedGoals[rig.goalTrack]!;
        if (next.x !== previous.x || next.y !== previous.y) {
          project.track(nodeId(rig.goalTrack)).setValues({ x: next.x, y: next.y });
        }
        const flip = flips.get(rig.solverTrack)!;
        if (flip !== appliedFlips.get(rig.solverTrack)) {
          project.track(nodeId(rig.solverTrack)).setKeyframe("ik", "flip", flip);
        }
      }
      appliedGoals = goals;
      for (const [id, value] of flips) appliedFlips.set(id, value);
    },
  };
}

/** Decorates the existing source with intent application, not another scroll/progress driver. */
export function bindScrollReach(source: ScrollSource, apply: () => void): ScrollSource {
  return {
    subscribe(listener) {
      return source.subscribe((progress) => {
        // The trigger port validates/normalizes first and Motion queues its progress job.
        // Pending value writes complete before that shared scheduler runs, without a new clock.
        listener(progress);
        apply();
      });
    },
  };
}
