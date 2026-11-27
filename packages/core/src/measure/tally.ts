import { compactedBeforeOf } from "../events/event-log";
import type { Events, MotionEvent } from "../events/event-list";
import { buildState, stepMetaOf, type Step } from "../state/state";
import { ownCell, storeCell } from "../state/store";
import { atProgress, elapsedOf, type Time } from "../time/time";

/** Settings of a `tally`: `start`, `on` (a held value by event name, or `"value"` for the event's own)
 * and `target`. */
export interface TallyOptions {
  /** The value held before any event. */
  readonly start: number;
  /** The value each event's name holds until the next, or `"value"` for the event's own value; events not
   * named here, and `"value"` events with no value, are ignored. */
  readonly on: Readonly<Record<string, number | "value">>;
  /** Only events with this target count; with none, events count whatever their target. */
  readonly target?: string;
}

/** The area under held samples so far, in value-seconds: `total(events)` is the whole stream's, up to its
 * last counted event, so `tally / total` is how far through it the stream is. */
export interface Tally {
  (time: Time, events: Events): number;
  total(events: Events): number;
}

/** What is held since a counted event; a new one for each, so every counted event is a step. */
interface Held {
  readonly value: number;
}

/** Counted events of one list: retained times, held values, and cumulative area before each. */
interface Table {
  readonly sourceResetId: number | undefined;
  readonly fallbackSource: readonly Step<Held>[];
  logicalCount: number;
  anchorTime: number;
  anchorValue: number;
  anchorArea: number;
  readonly times: number[];
  readonly values: number[];
  readonly areas: number[];
}

/** The area under held samples up to any time, each held until the next: an integral over the steps of a
 * state of the held value, extended as a list grows by appending. */
export function tally(options: TallyOptions): Tally {
  const valueOf = (event: MotionEvent): number | undefined => {
    const held = options.on[event.name];
    if (held === "value") return event.value;
    return held;
  };
  const held = buildState<Held>(
    { value: options.start },
    (current, event) => {
      const value = valueOf(event);
      return value === undefined ? current : { value };
    },
    options.target === undefined ? {} : { target: options.target },
  );
  const tableSlot = storeCell<Table>();

  const tableOf = (events: Events): Table => {
    const steps = held.steps(atProgress(0), events);
    const meta = stepMetaOf(steps);
    const stepBase = meta?.base ?? 0;

    const kept = ownCell(
      tableSlot,
      (existing) =>
        meta !== undefined
          ? meta.resetId !== existing.sourceResetId
          : existing.fallbackSource !== steps,
      () => ({
        sourceResetId: meta?.resetId,
        fallbackSource: steps,
        logicalCount: 0,
        anchorTime: 0,
        anchorValue: options.start,
        anchorArea: 0,
        times: [],
        values: [],
        areas: [],
      }),
      (existing) => ({
        ...existing,
        fallbackSource: steps,
        times: existing.times.slice(),
        values: existing.values.slice(),
        areas: existing.areas.slice(),
      }),
    );

    const totalSteps = stepBase + steps.length;
    if (kept.logicalCount < stepBase) kept.logicalCount = stepBase;
    for (; kept.logicalCount < totalSteps; kept.logicalCount += 1) {
      const step = steps[kept.logicalCount - stepBase];
      if (step === undefined) break;
      const count = kept.times.length;
      const since = count === 0 ? kept.anchorTime : (kept.times[count - 1] ?? kept.anchorTime);
      if (step.at < since)
        throw new RangeError(
          `tally: events must be oldest first; one at ${step.at} ms follows ${since} ms.`,
        );
      const before = count === 0 ? kept.anchorValue : (kept.values[count - 1] ?? 0);
      const area = count === 0 ? kept.anchorArea : (kept.areas[count - 1] ?? 0);
      kept.times.push(step.at);
      kept.values.push(step.value.value);
      kept.areas.push(area + (before * (step.at - since)) / 1000);
    }

    const compactedBefore = compactedBeforeOf(events);
    if (compactedBefore !== undefined && kept.times.length > 0) {
      let trim = 0;
      while (trim < kept.times.length && (kept.times[trim] ?? Infinity) < compactedBefore) {
        trim += 1;
      }
      if (trim > 0) {
        kept.anchorTime = kept.times[trim - 1] ?? kept.anchorTime;
        kept.anchorValue = kept.values[trim - 1] ?? kept.anchorValue;
        kept.anchorArea = kept.areas[trim - 1] ?? kept.anchorArea;
        kept.times.splice(0, trim);
        kept.values.splice(0, trim);
        kept.areas.splice(0, trim);
      }
    }

    return kept;
  };

  const total = (events: Events): number => {
    const table = tableOf(events);
    return table.areas.length > 0
      ? (table.areas[table.areas.length - 1] ?? table.anchorArea)
      : table.anchorArea;
  };
  const at = (time: Time, events: Events): number => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return total(events);
    const { anchorTime, anchorValue, anchorArea, times, values, areas } = tableOf(events);
    // The last counted event at or before `now`, by bisection.
    let low = 0;
    let high = times.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if ((times[middle] ?? 0) <= now) low = middle + 1;
      else high = middle;
    }
    if (low === 0) return anchorArea + (anchorValue * Math.max(0, now - anchorTime)) / 1000;
    const index = low - 1;
    return (areas[index] ?? 0) + ((values[index] ?? 0) * (now - (times[index] ?? 0))) / 1000;
  };
  return Object.assign(at, { total });
}
