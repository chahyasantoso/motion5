import type { ClockDriver } from "@gerak/dom";
import type { Driver } from "@gerak/player";

/** Whether a driver is a clock the timeline can play, pause and scrub. */
export function isClockDriver(
  driver: (Driver & { dispose?(): void }) | undefined,
): driver is ClockDriver {
  return (
    driver !== undefined &&
    "play" in driver &&
    typeof driver.play === "function" &&
    "pause" in driver &&
    typeof driver.pause === "function" &&
    "seek" in driver &&
    typeof driver.seek === "function" &&
    "replay" in driver &&
    typeof driver.replay === "function" &&
    "setRate" in driver &&
    typeof driver.setRate === "function" &&
    "setRange" in driver &&
    typeof driver.setRange === "function" &&
    "playing" in driver &&
    typeof driver.playing === "function" &&
    "dispose" in driver &&
    typeof driver.dispose === "function"
  );
}
