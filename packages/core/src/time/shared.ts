import type { Events } from "../events/event-list";
import { versionOf } from "../events/event-log";
import { notifyClockUse, rawTime, watchClock, watchedTime } from "../state/clock-watch";
import { storeCell } from "../state/store";
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

interface SharedCell<T> {
  readonly time: Time;
  readonly events: Events;
  readonly version: number | undefined;
  readonly value: T;
  readonly usedTime: boolean;
  readonly usedMaybe: boolean;
}

/** Caches `signal`'s last value and clock-use flags per RuntimeStore so extra readers per frame replay both. */
export function shared<T>(signal: Signal<T>): Signal<T> {
  const lastSlot = storeCell<SharedCell<T>>();
  return (time, events) => {
    const raw = rawTime(time);
    const version = versionOf(events);
    let last = lastSlot.get();
    if (
      last === undefined ||
      last.events !== events ||
      last.version !== version ||
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
      last = { time: raw, events, version, value, usedTime, usedMaybe };
      lastSlot.set(last);
    }
    if (last.usedMaybe && raw !== time) notifyClockUse("maybe");
    if (last.usedTime) notifyClockUse("time");
    return last.value;
  };
}
