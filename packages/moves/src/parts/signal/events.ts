import {
  elapsedOf,
  inputSerialsOf,
  notifyInputUse,
  rawTime,
  springTo,
  state,
  stillMoving,
  unreachable,
  type Input,
  type Time,
} from "@gerak/core";

/** Settings of a `follow`: `start`, `on` (goal by event name, or `"value"` for the event's own),
 * `target`, `stiffness` (default 170), `damping` (26) and `rest` (0.001). */
export interface FollowOptions {
  /** The value before any event. */
  readonly start: number;
  /** The goal each event's name sends the spring towards, or `"value"` for the event's own value; events
   * not named here are ignored. */
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

/** A spring each named event sends towards its goal, or a sample's own with `"value"`, turning back with
 * no jump; pure in time and input, a later call goes on from the last. */
export function follow(options: FollowOptions): (time: Time, input: Input) => number {
  const { stiffness, damping } = options;
  if ((stiffness !== undefined && !(stiffness > 0)) || (damping !== undefined && !(damping >= 0)))
    throw new RangeError("follow: stiffness must be above 0 and damping at least 0.");
  const goal = state(
    options.start,
    (current, event) => {
      const named = options.on[event.name];
      return (named === "value" ? event.value : named) ?? current;
    },
    options.target === undefined ? {} : { target: options.target },
  );
  return springTo(goal, (value) => value, options);
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

function firstAfter(events: Input, minAt: number): number {
  let low = 0;
  let high = events.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((events[mid]?.at ?? 0) <= minAt) low = mid + 1;
    else high = mid;
  }
  return low;
}

/** A damped answer to each past event by `kind` (`recoil`, `wobble`, `flash` or `shake`); 0 before the
 * first and once all have died. */
export function react(options: ReactOptions): (time: Time, input: Input) => number {
  const decay = options.decay ?? 6;
  const frequency = options.frequency ?? 4;
  if (!(decay > 0)) throw new RangeError("react: decay must be above 0.");
  const quiet = Math.log(1000) / decay;
  const quietMs = quiet * 1000;
  return (time, events) => {
    notifyInputUse("events");
    const now = elapsedOf(rawTime(time).clock);
    if (now === undefined) return 0;
    const serials = inputSerialsOf(events);
    const start = firstAfter(events, now - quietMs);
    let total = 0;
    let moving = false;
    for (let i = start; i < events.length; i += 1) {
      const event = events[i];
      if (event === undefined) break;
      if (event.at > now) break;
      if (!options.on.includes(event.name)) continue;
      if (options.target !== undefined && event.target !== options.target) continue;
      const seconds = (now - event.at) / 1000;
      const seed = serials !== undefined ? (serials[i] ?? i + 1) - 1 : i;
      if (seconds >= 0 && seconds < quiet) {
        total += options.amplitude * shape(options.kind, seconds, decay, frequency, seed);
        moving = true;
      }
    }
    if (moving) stillMoving();
    return total;
  };
}
