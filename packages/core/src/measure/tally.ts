import type { Events, MotionEvent } from "../events/event-list";
import { buildState, stepMetaOf, type Step } from "../state/state";
import { storeCell } from "../state/store";
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

/** Counted events of one list: times, held values, and cumulative area before each. */
interface Table {
  readonly sourceResetId: number | undefined;
  readonly fallbackSource: readonly Step<Held>[];
  count: number;
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

    const kept = tableSlot.own(
      (existing) =>
        meta !== undefined
          ? meta.resetId !== existing.sourceResetId
          : existing.fallbackSource !== steps,
      () => ({
        sourceResetId: meta?.resetId,
        fallbackSource: steps,
        count: 0,
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

    for (; kept.count < steps.length; kept.count += 1) {
      const step = steps[kept.count];
      if (step === undefined) break;
      const count = kept.times.length;
      const since = count === 0 ? 0 : (kept.times[count - 1] ?? 0);
      if (step.at < since)
        throw new RangeError(
          `tally: events must be oldest first; one at ${step.at} ms follows ${since} ms.`,
        );
      const before = count === 0 ? options.start : (kept.values[count - 1] ?? 0);
      const area = count === 0 ? 0 : (kept.areas[count - 1] ?? 0);
      kept.times.push(step.at);
      kept.values.push(step.value.value);
      kept.areas.push(area + (before * (step.at - since)) / 1000);
    }

    return kept;
  };

  const total = (events: Events): number => {
    const table = tableOf(events);
    return table.areas.length > 0 ? (table.areas[table.areas.length - 1] ?? 0) : 0;
  };
  const at = (time: Time, events: Events): number => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return total(events);
    const { times, values, areas } = tableOf(events);
    // The last counted event at or before `now`, by bisection.
    let low = 0;
    let high = times.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if ((times[middle] ?? 0) <= now) low = middle + 1;
      else high = middle;
    }
    if (low === 0) return (options.start * Math.max(0, now)) / 1000;
    const index = low - 1;
    return (areas[index] ?? 0) + ((values[index] ?? 0) * (now - (times[index] ?? 0))) / 1000;
  };
  return Object.assign(at, { total });
}
