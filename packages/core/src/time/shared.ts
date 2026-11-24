import type { Events } from "../events/event-list";
import { notifyClockUse, rawTime, watchClock, watchedTime } from "../state/clock-watch";
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

/** Caches `signal`'s last value and clock-use flags so extra readers per frame replay both without rerunning it. */
export function shared<T>(signal: Signal<T>): Signal<T> {
  let last:
    | {
        readonly time: Time;
        readonly events: Events;
        readonly value: T;
        readonly usedTime: boolean;
        readonly usedMaybe: boolean;
      }
    | undefined;
  return (time, events) => {
    const raw = rawTime(time);
    if (
      last === undefined ||
      last.events !== events ||
      last.time.progress !== raw.progress ||
      !sameClock(last.time.clock, raw.clock)
    ) {
      let usedTime = false;
      let usedMaybe = false;
      const value = watchClock(
        (use) => {
          switch (use) {
            case "time":
              usedTime = true;
              break;
            case "maybe":
              usedMaybe = true;
              break;
            default:
              unreachable(use);
          }
        },
        () => signal(watchedTime(raw), events),
      );
      last = { time: raw, events, value, usedTime, usedMaybe };
    }
    if (last.usedMaybe && raw !== time) notifyClockUse("maybe");
    if (last.usedTime) notifyClockUse("time");
    return last.value;
  };
}
