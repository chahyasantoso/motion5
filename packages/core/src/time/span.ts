import { unreachable } from "../utility/unreachable";
import type { Ease } from "../ease/ease";
import { elapsedOf, type Time } from "./time";
import type { Timing } from "./timing";

/** A stretch of the scene in ms: `of` gives a move's time inside it, `at` the ms a share of it falls on. */
export interface Span extends Timing<[ease?: Ease]> {
  readonly from: number;
  readonly to: number;
  /** `time` inside this span, its progress run through `ease` when one is given; an untimed time throws. */
  of(time: Time, ease?: Ease): Time;
  /** The scene ms `share` of the way through this span, such as a move's moment. */
  at(share: number): number;
}

/** The ms a time has run, from its progress when timed; an untimed time throws, naming `who`. */
export function nowOf(time: Time, who: string): number {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return time.progress * clock.length;
    case "live": {
      const now = elapsedOf(clock);
      if (now !== undefined) return now;
      throw new RangeError(`${who}: the live clock had no elapsed ms.`);
    }
    case "untimed":
      throw new RangeError(
        `${who}: this time has no clock in ms; give its driver a length, such as scrollDriver's \`length\`.`,
      );
    default:
      return unreachable(clock);
  }
}

// A timed time is placed by its progress, so an ease or a reversal applied to it carries into a span taken inside.
/** A stretch in ms: `.of(time, ease?)` is a move's time inside it, counting from `fromMs`; `.at(share)`
 * the ms a share falls on. Throws `RangeError` on an untimed time. */
export function span(fromMs: number, toMs: number): Span {
  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs) || toMs < fromMs)
    throw new RangeError(`span: ${fromMs} to ${toMs} ms is not a stretch of time.`);
  const length = toMs - fromMs;
  return Object.freeze({
    from: fromMs,
    to: toMs,
    of(time: Time, curve?: Ease): Time {
      const now = nowOf(time, "span");
      const progress =
        length <= 0 ? (now < fromMs ? 0 : 1) : Math.max(0, Math.min(1, (now - fromMs) / length));
      const elapsed = Math.max(0, Math.min(length, now - fromMs));
      return {
        progress: curve === undefined ? progress : curve(progress),
        clock: { kind: "timed", elapsed, length },
      };
    },
    at: (share: number) => fromMs + (toMs - fromMs) * share,
  });
}
