import { spring } from "./spring";
import { elapsedOf, type Time } from "./time";
import { unreachable } from "./unreachable";

/** Something that happened at `at` ms on the scene's clock: a hover, a press, a landing, or a sample of a
 * live number; `target` names where. */
export interface MotionEvent {
  readonly name: string;
  readonly at: number;
  readonly target?: string;
  /** Where a pointer event happened, in px from the watched element's top left corner. */
  readonly x?: number;
  readonly y?: number;
  /** A sample's number, such as how far a mouth is open; `follow` reads it with `"value"`. */
  readonly value?: number;
  /** Where a contact touched, in the scene's units: px in 2D, with `z` in 3D. */
  readonly point?: EventPoint;
  /** The other body or collider a contact touched. */
  readonly other?: string;
}

/** A point an event happened at, in the scene's units; `z` only in 3D. */
export interface EventPoint {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
}

/** Every event so far, oldest first; a scene reads it beside its time. */
export type Events = readonly MotionEvent[];

/** Whether `value` is a `MotionEvent`: a `name`, an `at` and, when given, a `target`, an `x`, `y`, a
 * `value`, a `point` of numbers and an `other`. */
export function isMotionEvent(value: unknown): value is MotionEvent {
  if (typeof value !== "object" || value === null) return false;
  const optional = (key: string, kind: "string" | "number") => {
    const field: unknown = Reflect.get(value, key);
    return field === undefined || typeof field === kind;
  };
  return (
    typeof Reflect.get(value, "name") === "string" &&
    typeof Reflect.get(value, "at") === "number" &&
    optional("target", "string") &&
    optional("x", "number") &&
    optional("y", "number") &&
    optional("value", "number") &&
    isOptionalPoint(Reflect.get(value, "point")) &&
    optional("other", "string")
  );
}

function isOptionalPoint(point: unknown): boolean {
  if (point === undefined) return true;
  if (typeof point !== "object" || point === null) return false;
  const z: unknown = Reflect.get(point, "z");
  return (
    typeof Reflect.get(point, "x") === "number" &&
    typeof Reflect.get(point, "y") === "number" &&
    (z === undefined || typeof z === "number")
  );
}

/** The empty event list; share it rather than allocating one. */
export const NO_EVENTS: Events = Object.freeze([]);

/** Settings of a `follow`: `start`, `on` (goal by event name, or `"value"` for the event's own),
 * `target`, `stiffness` (default 170), `damping` (26) and `rest` (0.001). */
export interface FollowOptions {
  /** The value before any event. */
  readonly start: number;
  /** The goal each event's name sends the spring towards, or `"value"` for the event's own value; events
   * not named here, and `"value"` events with no value, are ignored. */
  readonly on: Readonly<Record<string, number | "value">>;
  /** Only events with this target count; with none, events count whatever their target. */
  readonly target?: string;
  /** Pull towards the goal, per second squared; default 170. */
  readonly stiffness?: number;
  /** Drag on the speed, per second; default 26. */
  readonly damping?: number;
  /** Closer to its goal than this, and slower than ten times this a second, it is at rest; default 0.001. */
  readonly rest?: number;
}

/** The spring of a `follow` just after the event at `index - 1` set its goal at `since` ms. */
interface FollowState {
  readonly index: number;
  readonly goal: number;
  readonly value: number;
  readonly speed: number;
  readonly since: number;
}

/** A spring each named event sends towards its goal, or a sample's own with `"value"`, turning back with
 * no jump; pure in time and events, a later call goes on from the last. */
export function follow(options: FollowOptions): (time: Time, events: Events) => number {
  const stiffness = options.stiffness ?? 170;
  const damping = options.damping ?? 26;
  const rest = options.rest ?? 0.001;
  if (!(stiffness > 0) || !(damping >= 0))
    throw new RangeError("follow: stiffness must be above 0 and damping at least 0.");
  const goalOf = (event: MotionEvent): number | undefined => {
    if (options.target !== undefined && event.target !== options.target) return undefined;
    const goal = options.on[event.name];
    if (goal === "value") return event.value;
    return goal;
  };
  let kept: FollowState | undefined;
  // The events before `kept.index` it was built from, by identity; a log that differs there starts again.
  let taken: MotionEvent[] = [];
  const sameStart = (events: Events, count: number): boolean => {
    if (events.length < count) return false;
    for (let index = 0; index < count; index += 1) if (events[index] !== taken[index]) return false;
    return true;
  };
  return (time, events) => {
    const now = elapsedOf(time.clock);
    // The kept spring holds when every event it took is still where it was, and none is in the future.
    const resumes =
      kept !== undefined &&
      (now === undefined || kept.since <= now) &&
      sameStart(events, kept.index);
    let state = resumes ? kept : undefined;
    const from = state?.index ?? 0;
    for (let index = state?.index ?? 0; index < events.length; index += 1) {
      const event = events[index];
      if (event === undefined) continue;
      const next = goalOf(event);
      if (next === undefined) continue;
      if (now !== undefined && event.at > now) break;
      let value = state?.value ?? options.start;
      let speed = state?.speed ?? 0;
      if (state !== undefined) {
        const moved = spring(
          state.value - state.goal,
          state.speed,
          (event.at - state.since) / 1000,
          {
            stiffness,
            damping,
          },
        );
        value = state.goal + moved.offset;
        speed = moved.speed;
      }
      state = { index: index + 1, goal: next, value, speed, since: event.at };
    }
    if (state === undefined) taken = [];
    else if (from === 0) taken = events.slice(0, state.index);
    else taken.push(...events.slice(from, state.index));
    kept = state;
    if (state === undefined) return options.start;
    if (now === undefined) return state.goal;
    const moved = spring(state.value - state.goal, state.speed, (now - state.since) / 1000, {
      stiffness,
      damping,
    });
    return Math.abs(moved.offset) < rest && Math.abs(moved.speed) < 10 * rest
      ? state.goal
      : state.goal + moved.offset;
  };
}

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
  read: number;
  first: MotionEvent | undefined;
  last: MotionEvent | undefined;
  readonly times: number[];
  readonly values: number[];
  readonly areas: number[];
}

/** The area under held samples up to any time: each counted event holds its value until the next, read
 * from a table built once per list and extended when a live list grows by appending. */
export function tally(options: TallyOptions): Tally {
  const valueOf = (event: MotionEvent): number | undefined => {
    if (options.target !== undefined && event.target !== options.target) return undefined;
    const held = options.on[event.name];
    if (held === "value") return event.value;
    return held;
  };
  let table: TallyTable | undefined;
  const grows = (kept: TallyTable, events: Events): boolean => {
    if (kept.list === events) return events.length >= kept.read;
    if (events.length < kept.read || kept.read === 0) return false;
    return events[0] === kept.first && events[kept.read - 1] === kept.last;
  };
  const tableOf = (events: Events): TallyTable => {
    const kept =
      table !== undefined && grows(table, events)
        ? table
        : {
            list: events,
            read: 0,
            first: undefined,
            last: undefined,
            times: [],
            values: [],
            areas: [],
          };
    for (let index = kept.read; index < events.length; index += 1) {
      const event = events[index];
      if (event === undefined) continue;
      if (index === 0) kept.first = event;
      kept.last = event;
      const held = valueOf(event);
      if (held === undefined) continue;
      const count = kept.times.length;
      const since = count === 0 ? 0 : (kept.times[count - 1] ?? 0);
      const before = count === 0 ? options.start : (kept.values[count - 1] ?? 0);
      const area = count === 0 ? 0 : (kept.areas[count - 1] ?? 0);
      kept.times.push(event.at);
      kept.values.push(held);
      kept.areas.push(area + (before * (event.at - since)) / 1000);
    }
    kept.read = events.length;
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

/** Several event lists as one, oldest first; a scene's own cues joined with the page's events. */
export function mergeEvents(...lists: readonly Events[]): Events {
  return lists.flat().sort((a, b) => a.at - b.at);
}

/** How a response to one event moves: from a full start, from rest, as a fade, or as a shake. */
export type ReactionKind = "recoil" | "wobble" | "flash" | "shake";

/** Settings of a `react`: event names `on`, `target`, `kind`, `amplitude`, `decay` (default 6 a second)
 * and `frequency` (4 a second). */
export interface ReactOptions {
  /** The event names this answers. */
  readonly on: readonly string[];
  readonly target?: string;
  readonly kind: ReactionKind;
  /** The response's size at its largest. */
  readonly amplitude: number;
  /** How fast it dies away, per second; default 6. */
  readonly decay?: number;
  /** Swings a second, for `recoil`, `wobble` and `shake`; default 4. */
  readonly frequency?: number;
}

/** One response `seconds` after its event, the `index`th it answered, before its amplitude. */
function shape(
  kind: ReactionKind,
  seconds: number,
  decay: number,
  frequency: number,
  index: number,
): number {
  const fade = Math.exp(-decay * seconds);
  const turn = 2 * Math.PI * frequency * seconds;
  switch (kind) {
    case "recoil":
      return fade * Math.cos(turn);
    case "wobble":
      return fade * Math.sin(turn);
    case "flash":
      return fade;
    case "shake":
      return fade * (0.6 * Math.sin(turn + index * 2.1) + 0.4 * Math.sin(2.7 * turn + index * 4.3));
    default:
      return unreachable(kind);
  }
}

/** A damped answer to each past event by `kind` (`recoil`, `wobble`, `flash` or `shake`); 0 before the
 * first and once all have died. */
export function react(options: ReactOptions): (time: Time, events: Events) => number {
  const decay = options.decay ?? 6;
  const frequency = options.frequency ?? 4;
  if (!(decay > 0)) throw new RangeError("react: decay must be above 0.");
  const quiet = Math.log(1000) / decay;
  return (time, events) => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return 0;
    let total = 0;
    let index = 0;
    for (const event of events) {
      if (!options.on.includes(event.name)) continue;
      if (options.target !== undefined && event.target !== options.target) continue;
      const seconds = (now - event.at) / 1000;
      if (seconds >= 0 && seconds < quiet)
        total += options.amplitude * shape(options.kind, seconds, decay, frequency, index);
      index += 1;
    }
    return total;
  };
}
