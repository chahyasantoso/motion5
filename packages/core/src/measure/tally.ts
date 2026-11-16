import { elapsedOf, type Time } from "../time/time";
import type { Events, MotionEvent } from "../events/event-list";

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

/** Counted events of one list: their times, held values, and the area before each, oldest first. */
interface TallyTable {
  list: Events;
  readonly taken: MotionEvent[];
  readonly times: number[];
  readonly values: number[];
  readonly areas: number[];
}

/** The area under held samples up to any time, each held until the next, from a table built once per
 * list and extended when a live list grows by appending; events oldest first. */
export function tally(options: TallyOptions): Tally {
  const valueOf = (event: MotionEvent): number | undefined => {
    if (options.target !== undefined && event.target !== options.target) return undefined;
    const held = options.on[event.name];
    if (held === "value") return event.value;
    return held;
  };
  let table: TallyTable | undefined;
  // A list grows when it holds every event the table took, by identity, at the same places.
  const grows = (kept: TallyTable, events: Events): boolean => {
    if (events.length < kept.taken.length) return false;
    if (kept.list === events) return true;
    for (let index = 0; index < kept.taken.length; index += 1)
      if (events[index] !== kept.taken[index]) return false;
    return true;
  };
  const tableOf = (events: Events): TallyTable => {
    const kept =
      table !== undefined && grows(table, events)
        ? table
        : {
            list: events,
            taken: [],
            times: [],
            values: [],
            areas: [],
          };
    for (let index = kept.taken.length; index < events.length; index += 1) {
      const event = events[index];
      if (event === undefined) break;
      kept.taken.push(event);
      const held = valueOf(event);
      if (held === undefined) continue;
      const count = kept.times.length;
      const since = count === 0 ? 0 : (kept.times[count - 1] ?? 0);
      if (event.at < since) {
        table = undefined;
        throw new RangeError(
          `tally: events must be oldest first; one at ${event.at} ms follows ${since} ms.`,
        );
      }
      const before = count === 0 ? options.start : (kept.values[count - 1] ?? 0);
      const area = count === 0 ? 0 : (kept.areas[count - 1] ?? 0);
      kept.times.push(event.at);
      kept.values.push(held);
      kept.areas.push(area + (before * (event.at - since)) / 1000);
    }
    kept.list = events;
    table = kept;
    return kept;
  };
  const total = (events: Events): number => {
    const { areas } = tableOf(events);
    return areas[areas.length - 1] ?? 0;
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
