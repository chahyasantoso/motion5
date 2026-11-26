import { timeAt } from "../time/time-at";
import type { Time } from "../time/time";
import type { Events } from "../events/event-list";
import { compactedBeforeOf } from "../events/event-log";
import { epochOf, storeCell, withProbeStore } from "./store";
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
  readonly base: number;
}

const CHANGE_META = new WeakMap<readonly Change<unknown>[], ChangeMeta>();

/** Internal change list metadata for downstream cursors (`springTo`, `easeTo`). */
export function changeMetaOf(list: readonly Change<unknown>[]): ChangeMeta | undefined {
  return CHANGE_META.get(list);
}

interface ChangesCell<V> {
  ownerEpoch: number;
  resetId: number;
  seenStepResetId: number | undefined;
  seenStepRef: readonly unknown[] | undefined;
  start: V;
  list: Change<V>[];
  listBase: number;
  countedLogical: number;
  last: V;
}

/** The changes of what `pick` reads from `source`; a step that leaves it `Object.is` the same is none.
 * Isolated per RuntimeStore and compacts settled prefixes safely under live retention. */
export function changesOf<S, V = number>(
  source: State<S>,
  pick: (state: S) => V,
): (time: Time, events: Events) => Changes<V> {
  const cellSlot = storeCell<ChangesCell<V>>();

  return (time, events) => {
    const now = source.steps(time, events);
    const meta = stepMetaOf(now);
    const stepBase = meta?.base ?? 0;
    const epoch = epochOf();
    const existing = cellSlot.get();

    const resets =
      existing === undefined ||
      (meta !== undefined
        ? meta.resetId !== existing.seenStepResetId
        : now !== existing.seenStepRef || now.length < existing.countedLogical);

    let cell: ChangesCell<V>;
    if (resets || existing === undefined) {
      const start =
        meta !== undefined && meta.base > 0
          ? now.length === 0
            ? withProbeStore(() => pick(source(time, events)))
            : time.clock.kind !== "untimed"
              ? withProbeStore(() => pick(source(timeAt(time, (now[0]?.at ?? 0) - 0.0001), events)))
              : pick(source.start)
          : pick(source.start);
      const list: Change<V>[] = [];
      const resetId = (existing?.resetId ?? 0) + 1;
      cell = {
        ownerEpoch: epoch,
        resetId,
        seenStepResetId: meta?.resetId,
        seenStepRef: now,
        start,
        list,
        listBase: 0,
        countedLogical: 0,
        last: start,
      };
      CHANGE_META.set(list, { resetId, base: 0 });
      cellSlot.set(cell);
    } else if (existing.ownerEpoch !== epoch) {
      const clonedList = existing.list.slice();
      cell = {
        ...existing,
        ownerEpoch: epoch,
        seenStepRef: now,
        list: clonedList,
      };
      CHANGE_META.set(clonedList, { resetId: cell.resetId, base: cell.listBase });
      cellSlot.set(cell);
    } else {
      cell = existing;
      cell.seenStepRef = now;
    }

    const totalSteps = stepBase + now.length;
    if (cell.countedLogical < stepBase) cell.countedLogical = stepBase;
    for (; cell.countedLogical < totalSteps; cell.countedLogical += 1) {
      const step = now[cell.countedLogical - stepBase];
      if (step === undefined) break;
      const to = pick(step.value);
      if (Object.is(to, cell.last)) continue;
      cell.list.push({ at: step.at, to });
      cell.last = to;
    }

    const compactedBefore = compactedBeforeOf(events);
    if (compactedBefore !== undefined && cell.list.length > 2) {
      let trim = 0;
      const limit = cell.list.length - 2;
      while (trim < limit && (cell.list[trim]?.at ?? Infinity) < compactedBefore) {
        trim += 1;
      }
      if (trim > 0) {
        cell.start = cell.list[trim - 1]?.to ?? cell.start;
        cell.list.splice(0, trim);
        cell.listBase += trim;
        CHANGE_META.set(cell.list, { resetId: cell.resetId, base: cell.listBase });
      }
    }

    return { start: cell.start, list: cell.list };
  };
}
