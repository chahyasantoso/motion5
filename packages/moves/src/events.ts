import { elapsedOf, unreachable, type Time } from "./time";

/** Something that happened at `at` ms on the scene's clock: a hover, a press, a landing; `target` names where. */
export interface MotionEvent {
  readonly name: string;
  readonly at: number;
  readonly target?: string;
}

/** Every event so far, oldest first; a scene reads it beside its time. */
export type Events = readonly MotionEvent[];

export const NO_EVENTS: Events = Object.freeze([]);

export interface FollowOptions {
  /** The value before any event. */
  readonly start: number;
  /** The value each event's name sends the spring towards; events not named here are ignored. */
  readonly on: Readonly<Record<string, number>>;
  /** Only events with this target count; with none, events count whatever their target. */
  readonly target?: string;
  /** Pull towards the goal, per second squared; default 170. */
  readonly stiffness?: number;
  /** Drag on the speed, per second; default 26. */
  readonly damping?: number;
  /** Closer to its goal than this, and slower than ten times this a second, it is at rest; default 0.001. */
  readonly rest?: number;
}

/** Where a unit-mass spring is, `seconds` after it left `offset` from its goal at `speed`, and how fast it goes. */
function spring(
  offset: number,
  speed: number,
  seconds: number,
  stiffness: number,
  damping: number,
): { readonly offset: number; readonly speed: number } {
  const natural = Math.sqrt(stiffness);
  const ratio = damping / (2 * natural);
  if (ratio < 1) {
    const ringing = natural * Math.sqrt(1 - ratio * ratio);
    const decay = Math.exp(-ratio * natural * seconds);
    const cos = Math.cos(ringing * seconds);
    const sin = Math.sin(ringing * seconds);
    const b = (speed + ratio * natural * offset) / ringing;
    return {
      offset: decay * (offset * cos + b * sin),
      speed:
        decay *
        ((b * ringing - ratio * natural * offset) * cos -
          (offset * ringing + ratio * natural * b) * sin),
    };
  }
  if (ratio === 1) {
    const decay = Math.exp(-natural * seconds);
    const b = speed + natural * offset;
    return {
      offset: (offset + b * seconds) * decay,
      speed: (b - natural * (offset + b * seconds)) * decay,
    };
  }
  const root = natural * Math.sqrt(ratio * ratio - 1);
  const fast = -ratio * natural - root;
  const slow = -ratio * natural + root;
  const a = (speed - slow * offset) / (fast - slow);
  const b = offset - a;
  return {
    offset: a * Math.exp(fast * seconds) + b * Math.exp(slow * seconds),
    speed: a * fast * Math.exp(fast * seconds) + b * slow * Math.exp(slow * seconds),
  };
}

/** A value springing to each named event's goal from where it is and how fast it goes; pure in time and events. */
export function follow(options: FollowOptions): (time: Time, events: Events) => number {
  const stiffness = options.stiffness ?? 170;
  const damping = options.damping ?? 26;
  const rest = options.rest ?? 0.001;
  if (!(stiffness > 0) || !(damping >= 0))
    throw new RangeError("follow: stiffness must be above 0 and damping at least 0.");
  return (time, events) => {
    const now = elapsedOf(time.clock);
    let goal = options.start;
    let value = options.start;
    let speed = 0;
    let since: number | undefined;
    for (const event of events) {
      const next = options.on[event.name];
      if (next === undefined) continue;
      if (options.target !== undefined && event.target !== options.target) continue;
      if (now !== undefined && event.at > now) break;
      if (since !== undefined) {
        const moved = spring(value - goal, speed, (event.at - since) / 1000, stiffness, damping);
        value = goal + moved.offset;
        speed = moved.speed;
      }
      goal = next;
      since = event.at;
    }
    if (since === undefined) return options.start;
    if (now === undefined) return goal;
    const moved = spring(value - goal, speed, (now - since) / 1000, stiffness, damping);
    return Math.abs(moved.offset) < rest && Math.abs(moved.speed) < 10 * rest
      ? goal
      : goal + moved.offset;
  };
}

/** Several event lists as one, oldest first; a scene's own cues joined with the page's events. */
export function mergeEvents(...lists: readonly Events[]): Events {
  return lists.flat().sort((a, b) => a.at - b.at);
}

/** How a response to one event moves: from a full start, from rest, as a fade, or as a shake. */
export type ReactionKind = "recoil" | "wobble" | "flash" | "shake";

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

/** A damped answer to each past named event, added together; exactly 0 before the first and once all have died. */
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
