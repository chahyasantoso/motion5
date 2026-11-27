import { spring } from "../ease/spring";
import { rawTime, stillMoving } from "./clock-watch";
import { storeCell } from "./store";
import { elapsedOf } from "../time/time";
import type { Signal } from "../time/shapes";
import { changeMetaOf, changesOf } from "./changes";
import type { State } from "./state";

/** Settings of a `springTo`: `stiffness` (default 170), `damping` (26) and `rest` (0.001). */
export interface SpringToOptions {
  /** Pull towards the goal, per second squared; default 170. */
  readonly stiffness?: number;
  /** Drag on the speed, per second; default 26. */
  readonly damping?: number;
  /** Closer to its goal than this, and slower than ten times this a second, it is at rest; default 0.001. */
  readonly rest?: number;
}

/** The spring just after the change before `index` set its goal at `since` ms. */
interface Run {
  readonly changesResetId: number | undefined;
  readonly fallbackList: readonly unknown[];
  index: number;
  goal: number;
  value: number;
  speed: number;
  since: number;
}

/** A spring towards the number `pick` reads from `state`, turning at each change from where it is and as
 * fast as it goes, with no jump; without a clock, the latest goal. */
export function springTo<S>(
  source: State<S>,
  pick: (state: S) => number,
  options: SpringToOptions = {},
): Signal<number> {
  const stiffness = options.stiffness ?? 170;
  const damping = options.damping ?? 26;
  const rest = options.rest ?? 0.001;
  if (!(stiffness > 0 && Number.isFinite(stiffness)) || !(damping >= 0 && Number.isFinite(damping)))
    throw new RangeError(
      "springTo: stiffness must be a finite number above 0 and damping at least 0.",
    );
  if (!(rest > 0 && Number.isFinite(rest)))
    throw new RangeError("springTo: rest must be a finite number above 0.");
  const changes = changesOf(source, pick);
  const runSlot = storeCell<Run>();
  return (watched, events) => {
    const time = rawTime(watched);
    const now = elapsedOf(time.clock);
    const { start, list } = changes(time, events);
    if (now === undefined) return list[list.length - 1]?.to ?? start;
    const meta = changeMetaOf(list);

    const kept = runSlot.own(
      (existing) =>
        meta !== undefined
          ? meta.resetId !== existing.changesResetId
          : existing.fallbackList !== list,
      () => ({
        changesResetId: meta?.resetId,
        fallbackList: list,
        index: 0,
        goal: start,
        value: start,
        speed: 0,
        since: 0,
      }),
      (existing) => ({ ...existing, fallbackList: list }),
    );

    for (; kept.index < list.length; kept.index += 1) {
      const change = list[kept.index];
      if (change === undefined) break;
      const moved = spring(kept.value - kept.goal, kept.speed, (change.at - kept.since) / 1000, {
        stiffness,
        damping,
      });
      kept.value = kept.goal + moved.offset;
      kept.speed = moved.speed;
      kept.goal = change.to;
      kept.since = change.at;
    }
    const moved = spring(kept.value - kept.goal, kept.speed, (now - kept.since) / 1000, {
      stiffness,
      damping,
    });
    if (Math.abs(moved.offset) < rest && Math.abs(moved.speed) < 10 * rest) return kept.goal;
    stillMoving();
    return kept.goal + moved.offset;
  };
}
