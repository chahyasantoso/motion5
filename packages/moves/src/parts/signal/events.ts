import {
  elapsedOf,
  notifyInputUse,
  rawTime,
  springTo,
  stillMoving,
  unreachable,
  type Signal,
  type State,
  type Trigger,
} from "@gerak/core";

/** Settings of a `follow`: `stiffness` (default 170), `damping` (26) and `rest` (0.001). */
export interface FollowOptions {
  /** Pull towards the goal, per second squared; default 170. */
  readonly stiffness?: number;
  /** Drag on the speed, per second; default 26. */
  readonly damping?: number;
  /** Closer to its goal than this, and slower than ten times this a second, it is at rest; default 0.001. */
  readonly rest?: number;
}

/** A spring chasing `source`'s number, turning back with no jump; pure in time and input. */
export function follow(source: State<number>, options: FollowOptions = {}): Signal<number> {
  const { stiffness, damping, rest } = options;
  if ((stiffness !== undefined && !(stiffness > 0)) || (damping !== undefined && !(damping >= 0)))
    throw new RangeError("follow: stiffness must be above 0 and damping at least 0.");
  if (rest !== undefined && !(rest > 0 && Number.isFinite(rest)))
    throw new RangeError("follow: rest must be a finite number above 0.");
  return springTo(source, (current) => current, options);
}

/** How a response to one trigger moves: from a full start, from rest, as a fade, or as a shake. */
export type ReactionKind = "recoil" | "wobble" | "flash" | "shake";

/** Settings of a `react`: `kind`, `amplitude`, `decay` (default 6 a second) and `frequency` (4 a second). */
export interface ReactOptions {
  readonly kind: ReactionKind;
  /** The response's size at its largest. */
  readonly amplitude: number;
  /** How fast it dies away, per second; default 6. */
  readonly decay?: number;
  /** Swings a second, for `recoil`, `wobble` and `shake`; default 4. */
  readonly frequency?: number;
}

/** One response `seconds` after its trigger, seeded by its arrival `serial`, before its amplitude. */
function shape(
  kind: ReactionKind,
  seconds: number,
  decay: number,
  frequency: number,
  seed: number,
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
      return fade * (0.6 * Math.sin(turn + seed * 2.1) + 0.4 * Math.sin(2.7 * turn + seed * 4.3));
    default:
      return unreachable(kind);
  }
}

/** A damped answer to each trigger from `source` by `kind` (`recoil`, `wobble`, `flash` or `shake`); 0 before the first and once all have died. */
export function react(source: Signal<readonly Trigger[]>, options: ReactOptions): Signal<number> {
  const decay = options.decay ?? 6;
  const frequency = options.frequency ?? 4;
  if (!(decay > 0)) throw new RangeError("react: decay must be above 0.");
  const quiet = Math.log(1000) / decay;
  const quietMs = quiet * 1000;
  return (time, events) => {
    notifyInputUse("events");
    const items = source(time, events);
    const now = elapsedOf(rawTime(time).clock);
    if (now === undefined) return 0;
    const minAt = now - quietMs;
    let total = 0;
    let moving = false;
    for (let i = 0; i < items.length; i += 1) {
      const trigger = items[i];
      if (trigger === undefined) break;
      if (trigger.at <= minAt || trigger.at > now) continue;
      const seconds = (now - trigger.at) / 1000;
      if (seconds >= 0 && seconds < quiet) {
        total +=
          options.amplitude * shape(options.kind, seconds, decay, frequency, trigger.serial - 1);
        moving = true;
      }
    }
    if (moving) stillMoving();
    return total;
  };
}
