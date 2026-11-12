import type { Events } from "./events";
import { spring, springMemory } from "./spring";
import { elapsedOf, type Time } from "./time";
import { timeAt } from "./time-at";

/** Settings of a `trail`: `stiffness` (default 170), `damping` (26), `stepMs` (1 to 33, default 8) and
 * `rest`, the distance under which it sits on the signal. */
export interface TrailOptions {
  /** Pull towards the signal, per second squared; default 170. */
  readonly stiffness?: number;
  /** Drag on the speed, per second; default 26. */
  readonly damping?: number;
  /** Ms between spring steps, 1 to 33; default 8. */
  readonly stepMs?: number;
  /** Closer than this and slower than ten times it a second, it rests on the signal; also how far history fades. */
  readonly rest?: number;
}

/** A trailing spring's checked settings, shared by every trail. */
export interface TrailSettings {
  readonly spring: { readonly stiffness: number; readonly damping: number };
  readonly stepMs: number;
  readonly rest: number;
  readonly memoryMs: number;
}

const LONGEST_MEMORY_MS = 4000;

export function trailSettings(options: TrailOptions, name: string): TrailSettings {
  const springOptions = { stiffness: options.stiffness ?? 170, damping: options.damping ?? 26 };
  const stepMs = options.stepMs ?? 8;
  const rest = options.rest ?? 0.001;
  const memoryMs = springMemory(springOptions, rest) * 1000;
  if (!(stepMs >= 1 && stepMs <= 33)) throw new RangeError(`${name}: stepMs must be from 1 to 33.`);
  if (!(memoryMs <= LONGEST_MEMORY_MS))
    throw new RangeError(
      `${name}: the spring rings ${Math.round(memoryMs)} ms, longer than ${LONGEST_MEMORY_MS}; raise damping, or raise rest (now ${rest}) so a smaller swing counts as settled.`,
    );
  return { spring: springOptions, stepMs, rest, memoryMs };
}

/** The ms a trail starts from at rest: one spring memory before `now`, on the step grid. */
export function trailStart(now: number, settings: TrailSettings): number {
  return Math.max(0, Math.floor((now - settings.memoryMs) / settings.stepMs) * settings.stepMs);
}

/** A value chasing `signal(time, events)` on a spring, for follow-through and drag. Pass the scene's
 * time: the signal applies its own spans and eases. */
export function trail(
  signal: (time: Time, events: Events) => number,
  options: TrailOptions,
): (time: Time, events: Events) => number {
  const settings = trailSettings(options, "trail");
  return (time, events) => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return signal(time, events);
    let at = trailStart(now, settings);
    let value = signal(timeAt(time, at), events);
    let speed = 0;
    let goal = value;
    while (at < now) {
      goal = signal(timeAt(time, at), events);
      const dt = Math.min(settings.stepMs, now - at);
      const moved = spring(value - goal, speed, dt / 1000, settings.spring);
      value = goal + moved.offset;
      speed = moved.speed;
      at += dt;
    }
    const resting = Math.abs(value - goal) < settings.rest && Math.abs(speed) < 10 * settings.rest;
    return resting ? goal : value;
  };
}
