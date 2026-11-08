import type { Ease } from "./ease";

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

/** A stretch of the scene in ms: `of` gives a move's time inside it, `at` the ms a share of it falls on. */
export interface Span {
  readonly from: number;
  readonly to: number;
  /** `time` inside this span, its progress run through `ease` when one is given. */
  of(time: Time, ease?: Ease): Time;
  /** The scene ms `share` of the way through this span, such as a move's moment. */
  at(share: number): number;
}

/** The stretch from `fromMs` to `toMs` of a scene `durationMs` long. */
export function span(fromMs: number, toMs: number, durationMs: number): Span {
  if (!(durationMs > 0))
    throw new RangeError(`span: durationMs must be above 0, not ${durationMs}.`);
  const from = fromMs / durationMs;
  const to = toMs / durationMs;
  return Object.freeze({
    from: fromMs,
    to: toMs,
    of(time: Time, curve?: Ease): Time {
      const inner = window(time, from, to);
      return curve === undefined ? inner : { ...inner, progress: curve(inner.progress) };
    },
    at: (share: number) => fromMs + (toMs - fromMs) * share,
  });
}

/** The sink of an exhaustive switch: a value TypeScript proves cannot arrive. */
export function unreachable(value: never): never {
  throw new TypeError(`Unreachable value: ${JSON.stringify(value)}`);
}
