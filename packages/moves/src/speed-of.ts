import type { Events } from "./events";
import type { Time } from "./time";
import { timeAt } from "./time-at";
import { unreachable } from "./unreachable";

function between<K extends string>(
  signal: (time: Time, events: Events) => { readonly [F in K]?: number },
  fields: readonly K[],
  time: Time,
  events: Events,
  stepMs: number,
  now: number,
  end: number,
): readonly number[] {
  const before = Math.max(0, Math.min(end, now) - stepMs / 2);
  const after = Math.min(end, before + stepMs);
  if (!(after > before)) return fields.map(() => 0);
  const a = signal(timeAt(time, before), events);
  const b = signal(timeAt(time, after), events);
  const seconds = (after - before) / 1000;
  return fields.map((field) => ((b[field] ?? 0) - (a[field] ?? 0)) / seconds);
}

/** Per second, in `fields` order, how fast each field of a signal moves at `time`, kept inside the clock. */
export function speedOf<K extends string>(
  signal: (time: Time, events: Events) => { readonly [F in K]?: number },
  fields: readonly K[],
  time: Time,
  events: Events,
  stepMs: number,
): readonly number[] {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return between(signal, fields, time, events, stepMs, clock.elapsed, clock.length);
    case "live":
      return between(signal, fields, time, events, stepMs, clock.elapsed, Infinity);
    case "untimed":
      return fields.map(() => 0);
    default:
      return unreachable(clock);
  }
}
