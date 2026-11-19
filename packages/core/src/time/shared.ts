import type { Events } from "../events/event-list";
import type { Signal } from "./shapes";
import { unreachable } from "../utility/unreachable";
import type { Clock, Time } from "./time";

function sameClock(a: Clock, b: Clock): boolean {
  switch (a.kind) {
    case "timed":
      return b.kind === "timed" && a.elapsed === b.elapsed && a.length === b.length;
    case "live":
      return b.kind === "live" && a.elapsed === b.elapsed;
    case "untimed":
      return b.kind === "untimed";
    default:
      return unreachable(a);
  }
}

/** A signal with the values of `signal` that remembers its last call, so many readers in one frame run it once. */
export function shared<T>(signal: Signal<T>): Signal<T> {
  let last: { readonly time: Time; readonly events: Events; readonly value: T } | undefined;
  return (time, events) => {
    if (
      last !== undefined &&
      last.events === events &&
      last.time.progress === time.progress &&
      sameClock(last.time.clock, time.clock)
    )
      return last.value;
    const value = signal(time, events);
    last = { time, events, value };
    return value;
  };
}
