import type { ProjectHandle } from "@motion5/core";
import { ARM, TENTACLE, nodeId } from "./ik-playground-project";

export interface GoalPoint {
  readonly x: number;
  readonly y: number;
}
export type PendingGoals = Readonly<Record<string, GoalPoint>>;
const RIGS = [ARM, TENTACLE] as const;

export function initialGoals(): PendingGoals {
  return Object.freeze(
    Object.fromEntries(RIGS.map((rig) => [rig.goalTrack, Object.freeze({ ...rig.goal })])),
  );
}

export function scrollWeight(position: number, range: number): number {
  if (!Number.isFinite(position) || !Number.isFinite(range) || range <= 0) return 0;
  return Math.min(1, Math.max(0, position / range));
}

/** Owns pending intent. Only commit writes the runtime; the UI renders immutable snapshots. */
export function createScrollReach(project: ProjectHandle) {
  let goals = initialGoals();
  let appliedGoals = goals;
  const flips = new Map(RIGS.map((rig) => [rig.solverTrack, false]));
  const appliedFlips = new Map(flips);
  let appliedWeight = 0;
  return {
    get goals(): PendingGoals {
      return goals;
    },
    moveGoal(track: string, x: number, y: number): PendingGoals {
      if (!Object.hasOwn(goals, track)) throw new Error(`Unknown pending goal: ${track}`);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return goals;
      goals = Object.freeze({ ...goals, [track]: Object.freeze({ x, y }) });
      return goals;
    },
    flip(solver: string, value: boolean): void {
      if (!flips.has(solver)) throw new Error(`Unknown pending solver: ${solver}`);
      flips.set(solver, value);
    },
    commit(progress: number): number {
      const weight = scrollWeight(progress, 1);
      // Value writes are synchronous and each owns its invalidate. There is no public multi-track
      // value transaction; do not use schema edit(), add a second clock, or claim one patch batch.
      // All writes finish in this scroll handler before the browser paints.
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
        if (weight !== appliedWeight) {
          for (const member of rig.memberTracks) {
            project.track(nodeId(member)).setKeyframe("fk", "weight", weight);
          }
        }
      }
      appliedGoals = goals;
      for (const [id, value] of flips) appliedFlips.set(id, value);
      appliedWeight = weight;
      return weight;
    },
  };
}

interface ScrollSource {
  readonly scrollY: number;
  addEventListener(
    type: "scroll" | "resize",
    listener: () => void,
    options?: AddEventListenerOptions,
  ): void;
  removeEventListener(type: "scroll" | "resize", listener: () => void): void;
}

/** Actual position, not wheel deltas. Resize never commits pending intent. */
export function bindScrollReach(
  source: ScrollSource,
  range: () => number,
  apply: (weight: number) => void,
): () => void {
  let previousY = source.scrollY;
  const onScroll = () => {
    if (source.scrollY === previousY) return;
    previousY = source.scrollY;
    apply(scrollWeight(previousY, range()));
  };
  const onResize = () => {
    previousY = source.scrollY;
  };
  // A restored nonzero page position starts at the corresponding weight, with the initial goals.
  apply(scrollWeight(previousY, range()));
  source.addEventListener("scroll", onScroll, { passive: true });
  source.addEventListener("resize", onResize);
  return () => {
    source.removeEventListener("scroll", onScroll);
    source.removeEventListener("resize", onResize);
  };
}
