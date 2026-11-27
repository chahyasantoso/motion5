import type { Time } from "../time/time";
import type { Events } from "../events/event-list";
import { storeCell } from "./store";
import { stepMetaOf, type State } from "./state";

/** A moment a picked value changed, and the value it changed to. */
export interface Change<V = number> {
  readonly at: number;
  readonly to: V;
}

/** The picked value before any event, and each moment it changed after, oldest first. */
export interface Changes<V = number> {
  readonly start: V;
  readonly list: readonly Change<V>[];
}

export interface ChangeMeta {
  readonly resetId: number;
}

const CHANGE_META = new WeakMap<readonly Change<unknown>[], ChangeMeta>();

/** Internal change list metadata for downstream cursors (`springTo`, `easeTo`). */
export function changeMetaOf(list: readonly Change<unknown>[]): ChangeMeta | undefined {
  return CHANGE_META.get(list);
}

interface ChangesCell<V> {
  resetId: number;
  seenStepResetId: number | undefined;
  start: V;
  list: Change<V>[];
  counted: number;
  last: V;
}

/** The changes of what `pick` reads from `source`; a step that leaves it `Object.is` the same is none.
 * The list grows in place, so a reader reads it during the call and keeps none. */
export function changesOf<S, V = number>(
  source: State<S>,
  pick: (state: S) => V,
): (time: Time, events: Events) => Changes<V> {
  const cellSlot = storeCell<ChangesCell<V>>();

  return (time, events) => {
    const now = source.steps(time, events);
    const meta = stepMetaOf(now);

    const cell = cellSlot.own(
      (existing) => meta?.resetId !== existing.seenStepResetId,
      (existing) => {
        const start = pick(source.start);
        const resetId = (existing?.resetId ?? 0) + 1;
        const list: Change<V>[] = [];
        CHANGE_META.set(list, { resetId });
        return {
          resetId,
          seenStepResetId: meta?.resetId,
          start,
          list,
          counted: 0,
          last: start,
        };
      },
      (existing) => {
        const list = existing.list.slice();
        CHANGE_META.set(list, { resetId: existing.resetId });
        return { ...existing, list };
      },
    );

    for (; cell.counted < now.length; cell.counted += 1) {
      const step = now[cell.counted];
      if (step === undefined) break;
      const to = pick(step.value);
      if (Object.is(to, cell.last)) continue;
      cell.list.push({ at: step.at, to });
      cell.last = to;
    }

    return { start: cell.start, list: cell.list };
  };
}
