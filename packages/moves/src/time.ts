/** A track's clock: milliseconds when a timed trigger drives it, none under scroll or manual control. */
export type Clock =
  | { readonly kind: "timed"; readonly elapsed: number; readonly length: number }
  | { readonly kind: "untimed" };

/** Where a move is: `progress` from 0 to 1, and the clock behind it. */
export interface Time {
  readonly progress: number;
  readonly clock: Clock;
}

export const UNTIMED: Clock = Object.freeze({ kind: "untimed" });

/** A `Time` at `progress` with no clock, for code that drives a move by hand. */
export function atProgress(progress: number): Time {
  return { progress, clock: UNTIMED };
}

/** Maps `progress` inside `[from, to]` onto `[0, 1]`, holding outside it; a zero-length window steps at `from`. */
export function windowed(progress: number, from: number, to: number): number {
  if (to <= from) return progress < from ? 0 : 1;
  return Math.max(0, Math.min(1, (progress - from) / (to - from)));
}

/** `time` seen through the window `[from, to]`: progress mapped, and a timed clock cut to the window. */
export function window(time: Time, from: number, to: number): Time {
  const progress = windowed(time.progress, from, to);
  const clock = time.clock;
  switch (clock.kind) {
    case "untimed":
      return { progress, clock };
    case "timed": {
      const length = Math.max(0, to - from) * clock.length;
      const elapsed = Math.max(0, Math.min(length, clock.elapsed - from * clock.length));
      return { progress, clock: { kind: "timed", elapsed, length } };
    }
    default:
      return unreachable(clock);
  }
}

/** The sink of an exhaustive switch: a value TypeScript proves cannot arrive. */
export function unreachable(value: never): never {
  throw new TypeError(`Unreachable value: ${JSON.stringify(value)}`);
}
