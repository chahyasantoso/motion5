import { unreachable } from "../utility/unreachable";
import { timeAt } from "../time/time-at";
import type { Time } from "../time/time";
import type { Events } from "../events/event-list";
import { compactedBeforeOf } from "../events/event-log";
import { ownCell, storeCell, withProbeStore } from "./store";
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
 * The list grows in place, so a reader reads it during the call and keeps none. */
export function changesOf<S, V = number>(
  source: State<S>,
  pick: (state: S) => V,
): (time: Time, events: Events) => Changes<V> {
  const cellSlot = storeCell<ChangesCell<V>>();

  return (time, events) => {
    const now = source.steps(time, events);
    const meta = stepMetaOf(now);
    const stepBase = meta?.base ?? 0;

    const cell = ownCell(
      cellSlot,
      (existing) =>
        meta !== undefined
          ? meta.resetId !== existing.seenStepResetId
          : now !== existing.seenStepRef || now.length < existing.countedLogical,
      (existing) => {
        let start: V;
        if (meta !== undefined && meta.base > 0) {
          if (now.length === 0) {
            start = withProbeStore(() => pick(source(time, events)));
          } else {
            switch (time.clock.kind) {
              case "timed":
              case "live": {
                const probeAt = Number.isFinite(meta.anchorAt)
                  ? meta.anchorAt
                  : (now[0]?.at ?? 0) - 0.0001;
                start = withProbeStore(() => pick(source(timeAt(time, probeAt), events)));
                break;
              }
              case "untimed":
                start = pick(source.start);
                break;
              default:
                return unreachable(time.clock);
            }
          }
        } else {
          start = pick(source.start);
        }
        const resetId = (existing?.resetId ?? 0) + 1;
        const list: Change<V>[] = [];
        CHANGE_META.set(list, { resetId, base: 0 });
        return {
          resetId,
          seenStepResetId: meta?.resetId,
          seenStepRef: now,
          start,
          list,
          listBase: 0,
          countedLogical: 0,
          last: start,
        };
      },
      (existing) => {
        const list = existing.list.slice();
        CHANGE_META.set(list, { resetId: existing.resetId, base: existing.listBase });
        return { ...existing, seenStepRef: now, list };
      },
    );
    cell.seenStepRef = now;

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
