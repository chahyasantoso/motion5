import type { Clock, Time } from "../time/time";

/** How a value can change with the clock alone: `time` while it is still on its way; `maybe` when code
 * read the clock and nothing says whether it settles. */
export type ClockUse = "time" | "maybe";

const RAW = Symbol.for("@gerak/core/raw-time");

let told: ((use: ClockUse) => void) | undefined;

/** Runs `run`, telling `onUse` each time what it works out can change with the clock alone. */
export function watchClock<T>(onUse: (use: ClockUse) => void, run: () => T): T {
  const outer = told;
  told = onUse;
  try {
    return run();
  } finally {
    told = outer;
  }
}

/** A time that tells the watcher `maybe` when its clock or progress is read; `rawTime` reads it untold. */
export function watchedTime(time: Time): Time {
  const watched = {
    get progress(): number {
      told?.("maybe");
      return time.progress;
    },
    get clock(): Clock {
      told?.("maybe");
      return time.clock;
    },
  };
  Object.defineProperty(watched, RAW, { value: time });
  return watched;
}

/** The time a `watchedTime` stands for, read without telling the watcher; any other time as it is. */
export function rawTime(time: Time): Time {
  const raw: unknown = Reflect.get(time, RAW);
  return isTime(raw) ? raw : time;
}

function isTime(value: unknown): value is Time {
  if (typeof value !== "object" || value === null) return false;
  const clock: unknown = Reflect.get(value, "clock");
  return (
    typeof Reflect.get(value, "progress") === "number" &&
    typeof clock === "object" &&
    clock !== null &&
    typeof Reflect.get(clock, "kind") === "string"
  );
}

/** Tells the watcher that a value is still on its way with the clock, such as a spring not yet at rest. */
export function stillMoving(): void {
  told?.("time");
}

/** Replays a recorded `ClockUse` to the active `watchClock` listener, if any. */
export function notifyClockUse(use: ClockUse): void {
  told?.(use);
}
