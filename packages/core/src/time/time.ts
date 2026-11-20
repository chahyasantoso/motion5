import { unreachable } from "../utility/unreachable";

/** A clock: ms of a known length when timed, ms with no end when live, none under scroll or manual control. */
export type Clock =
  | { readonly kind: "timed"; readonly elapsed: number; readonly length: number }
  | { readonly kind: "live"; readonly elapsed: number }
  | { readonly kind: "untimed" };

/** Where a move is: `progress` from 0 to 1, and the clock behind it. */
export interface Time {
  readonly progress: number;
  readonly clock: Clock;
}

/** The untimed clock: no ms at all, as under scroll or manual control. */
export const UNTIMED: Clock = Object.freeze({ kind: "untimed" });

/** A live `Time` `elapsed` ms after the page started; it has no length, so its progress stays 0. */
export function liveAt(elapsed: number): Time {
  return { progress: 0, clock: { kind: "live", elapsed } };
}

/** The ms a clock has run, or `undefined` for a clock that has none. */
export function elapsedOf(clock: Clock): number | undefined {
  switch (clock.kind) {
    case "timed":
    case "live":
      return clock.elapsed;
    case "untimed":
      return undefined;
    default:
      return unreachable(clock);
  }
}

/** A `Time` at `progress` with no clock, for code that drives a move by hand. */
export function atProgress(progress: number): Time {
  return { progress, clock: UNTIMED };
}

/** `time` moved to `progress`: a timed clock's elapsed follows it, so a move that reads the clock is moved too. */
export function withProgress(time: Time, progress: number): Time {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return { progress, clock: { ...clock, elapsed: progress * clock.length } };
    case "live":
    case "untimed":
      return { progress, clock };
    default:
      return unreachable(clock);
  }
}
