import type { Input } from "../events/event-list";
import { versionOf } from "../events/event-log";
import {
  notifyClockUse,
  notifyInputUse,
  rawTime,
  watchClock,
  watchedTime,
  watchInputs,
  type InputChannel,
  type InputRead,
} from "../state/clock-watch";
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

interface SharedRead {
  readonly channel: InputChannel;
  readonly read: InputRead;
}

interface SharedCell<T> {
  readonly time: Time;
  readonly events: Input;
  readonly version: number | undefined;
  readonly value: T;
  readonly usedTime: boolean;
  readonly usedMaybe: boolean;
  readonly usedScroll: boolean;
  readonly usedPointer: boolean;
  readonly usedEvents: boolean;
  readonly reads: readonly SharedRead[];
}

/** Caches `signal`'s last value and clock/input flags per RuntimeStore so extra readers replay all. */
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
      let usedScroll = false;
      let usedPointer = false;
      let usedEvents = false;
      const reads = new Map<string, SharedRead>();
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
        () =>
          watchInputs(
            (channel, read) => {
              if (read !== undefined) {
                const key = `${channel}\0${read.kind}\0${read.name}\0${read.target ?? ""}`;
                if (!reads.has(key)) reads.set(key, { channel, read });
                return;
              }
              switch (channel) {
                case "scroll":
                  usedScroll = true;
                  break;
                case "pointer":
                  usedPointer = true;
                  break;
                case "events":
                  usedEvents = true;
                  break;
                default:
                  unreachable(channel);
              }
            },
            () => signal(watchedTime(raw), events),
          ),
      );
      last = {
        time: raw,
        events,
        version,
        value,
        usedTime,
        usedMaybe,
        usedScroll,
        usedPointer,
        usedEvents,
        reads: [...reads.values()],
      };
      lastSlot.set(last);
    }
    if (last.usedMaybe && raw !== time) notifyClockUse("maybe");
    if (last.usedTime) notifyClockUse("time");
    if (last.usedScroll) notifyInputUse("scroll");
    if (last.usedPointer) notifyInputUse("pointer");
    if (last.usedEvents) notifyInputUse("events");
    for (const entry of last.reads) notifyInputUse(entry.channel, entry.read);
    return last.value;
  };
}
