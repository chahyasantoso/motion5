import { ease, type Ease } from "../ease/ease";
import { mix } from "../blend/mix";
import { span, type Span } from "../time/span";
import { timeAt } from "../time/time-at";
import { elapsedOf } from "../time/time";
import type { Signal } from "../time/shapes";
import { changesOf, type Change } from "./changes";
import type { State } from "./state";

/** A time in ms, or one for a change upwards and one for a change downwards. */
export type UpDown = number | { readonly up: number; readonly down: number };

/** Settings of an `easeTo`: `ms`, `delayMs` (default 0) and `ease` (default linear). */
export interface EaseToOptions {
  /** How long a change takes. */
  readonly ms: UpDown;
  /** How long after the change it starts; default 0. */
  readonly delayMs?: UpDown;
  readonly ease?: Ease;
}

/** The motion since the change before `index`, from `from` to `to` over `stretch`. */
interface Run {
  readonly list: readonly Change[];
  index: number;
  from: number;
  to: number;
  stretch: Span;
}

const sideOf = (value: UpDown, rising: boolean): number => {
  if (typeof value === "number") return value;
  return rising ? value.up : value.down;
};

/** The number `pick` reads from `state`, easing at each change from where it is to the new number, `delayMs`
 * later and over `ms`; without a clock, the latest number. */
export function easeTo<S>(
  source: State<S>,
  pick: (state: S) => number,
  options: EaseToOptions,
): Signal<number> {
  const curve = options.ease ?? ease.linear;
  for (const [name, value] of [
    ["ms", options.ms],
    ["delayMs", options.delayMs ?? 0],
  ] as const)
    for (const side of [sideOf(value, true), sideOf(value, false)])
      if (!(side >= 0 && Number.isFinite(side)))
        throw new RangeError(`easeTo: ${name} must be a finite number of ms, 0 or more.`);
  const changes = changesOf(source, pick);
  let run: Run | undefined;
  return (time, events) => {
    const { start, list } = changes(time, events);
    if (elapsedOf(time.clock) === undefined) return list[list.length - 1]?.to ?? start;
    const kept: Run =
      run !== undefined && run.list === list
        ? run
        : { list, index: 0, from: start, to: start, stretch: span(0, 1) };
    run = kept;
    for (; kept.index < list.length; kept.index += 1) {
      const change = list[kept.index];
      if (change === undefined) break;
      const rising = change.to > kept.to;
      kept.from = mix(kept.from, kept.to, kept.stretch.of(timeAt(time, change.at), curve).progress);
      kept.to = change.to;
      const begin = change.at + sideOf(options.delayMs ?? 0, rising);
      kept.stretch = span(begin, begin + sideOf(options.ms, rising));
    }
    return mix(kept.from, kept.to, kept.stretch.of(time, curve).progress);
  };
}
