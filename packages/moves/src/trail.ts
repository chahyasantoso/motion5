import type { Events } from "./events";
import { spring, springMemory } from "./spring";
import { elapsedOf, type Time } from "./time";
import { timeAt } from "./time-at";

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

const LONGEST_MEMORY_MS = 4000;

/** A value chasing `signal` on a spring; starts from rest one spring memory ago, so a frame's cost never grows. */
export function trail(
  signal: (time: Time, events: Events) => number,
  options: TrailOptions,
): (time: Time, events: Events) => number {
  const springOptions = { stiffness: options.stiffness ?? 170, damping: options.damping ?? 26 };
  const stepMs = options.stepMs ?? 8;
  const rest = options.rest ?? 0.001;
  const memoryMs = springMemory(springOptions, rest) * 1000;
  if (!(stepMs >= 1 && stepMs <= 33)) throw new RangeError("trail: stepMs must be from 1 to 33.");
  if (!(memoryMs <= LONGEST_MEMORY_MS))
    throw new RangeError("trail: the spring rings too long to forget its past; raise damping.");
  return (time, events) => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return signal(time, events);
    let at = Math.max(0, Math.floor((now - memoryMs) / stepMs) * stepMs);
    let value = signal(timeAt(time, at), events);
    let speed = 0;
    let goal = value;
    while (at < now) {
      goal = signal(timeAt(time, at), events);
      const dt = Math.min(stepMs, now - at);
      const moved = spring(value - goal, speed, dt / 1000, springOptions);
      value = goal + moved.offset;
      speed = moved.speed;
      at += dt;
    }
    const resting = Math.abs(value - goal) < rest && Math.abs(speed) < 10 * rest;
    return resting ? goal : value;
  };
}
