import type { Events } from "./events";
import type { Pose2d } from "./pose";
import type { Time } from "./time";
import { timeAt } from "./time-at";
import { unreachable } from "./unreachable";

/** The difference across `stepMs` around `now`, kept inside 0 and `end` so a move is never read past its ends. */
function between(
  signal: (time: Time, events: Events) => Pose2d,
  time: Time,
  events: Events,
  stepMs: number,
  now: number,
  end: number,
): { readonly vx: number; readonly vy: number } {
  const before = Math.max(0, Math.min(end, now) - stepMs / 2);
  const after = Math.min(end, before + stepMs);
  if (!(after > before)) return { vx: 0, vy: 0 };
  const a = signal(timeAt(time, before), events);
  const b = signal(timeAt(time, after), events);
  const seconds = (after - before) / 1000;
  return { vx: ((b.x ?? 0) - (a.x ?? 0)) / seconds, vy: ((b.y ?? 0) - (a.y ?? 0)) / seconds };
}

/** Px per second a signal's `x` and `y` move at the scene's `time`, never an eased one; zero with no clock. */
export function velocity(
  signal: (time: Time, events: Events) => Pose2d,
  time: Time,
  events: Events,
  stepMs = 16,
): { readonly vx: number; readonly vy: number } {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return between(signal, time, events, stepMs, clock.elapsed, clock.length);
    case "live":
      return between(signal, time, events, stepMs, clock.elapsed, Infinity);
    case "untimed":
      return { vx: 0, vy: 0 };
    default:
      return unreachable(clock);
  }
}
