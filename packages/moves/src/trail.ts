import type { Events } from "./events";
import { spring, springMemory } from "./spring";
import { elapsedOf, unreachable, type Time } from "./time";

export interface TrailOptions {
  /** Pull towards the signal, per second squared; default 170. */
  readonly stiffness?: number;
  /** Drag on the speed, per second; default 26. */
  readonly damping?: number;
  /** Ms between spring steps, 1 to 33; default 8. */
  readonly stepMs?: number;
  /** History that would move the value by less than this share of its swing is forgotten; default 0.001. */
  readonly rest?: number;
}

const LONGEST_MEMORY_MS = 4000;

/** `time` moved to `ms` on its own clock. */
function timeAt(time: Time, ms: number): Time {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return {
        progress: clock.length > 0 ? ms / clock.length : 1,
        clock: { kind: "timed", elapsed: ms, length: clock.length },
      };
    case "live":
      return { progress: time.progress, clock: { kind: "live", elapsed: ms } };
    case "untimed":
      return time;
    default:
      return unreachable(clock);
  }
}

/** A value chasing `signal` on a spring; starts from rest one spring memory ago, so a frame's cost never grows. */
export function trail(
  signal: (time: Time, events: Events) => number,
  options: TrailOptions,
): (time: Time, events: Events) => number {
  const springOptions = { stiffness: options.stiffness ?? 170, damping: options.damping ?? 26 };
  const stepMs = options.stepMs ?? 8;
  const memoryMs = springMemory(springOptions, options.rest ?? 0.001) * 1000;
  if (!(stepMs >= 1 && stepMs <= 33)) throw new RangeError("trail: stepMs must be from 1 to 33.");
  if (!(memoryMs <= LONGEST_MEMORY_MS))
    throw new RangeError("trail: the spring rings too long to forget its past; raise damping.");
  return (time, events) => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return signal(time, events);
    let at = Math.max(0, Math.floor((now - memoryMs) / stepMs) * stepMs);
    let value = signal(timeAt(time, at), events);
    let speed = 0;
    while (at < now) {
      const goal = signal(timeAt(time, at), events);
      const dt = Math.min(stepMs, now - at);
      const moved = spring(value - goal, speed, dt / 1000, springOptions);
      value = goal + moved.offset;
      speed = moved.speed;
      at += dt;
    }
    return value;
  };
}
