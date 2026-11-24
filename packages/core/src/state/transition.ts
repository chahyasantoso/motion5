import { ease, type Ease } from "../ease/ease";
import type { Events } from "../events/event-list";
import { clamp } from "../utility/clamp";
import type { Signal } from "../time/shapes";
import { elapsedOf, type Time } from "../time/time";
import { changesOf } from "./changes";
import { rawTime, stillMoving } from "./clock-watch";
import type { State } from "./state";

/** A discrete transition's current and prior value, eased progress (`0..1`), and active flag. */
export interface Transition<S> {
  readonly current: S;
  readonly previous: S;
  readonly progress: number;
  readonly active: boolean;
}

/** Settings of `transition`: duration in ms (or per `(from, to)`) and an optional easing curve. */
export interface TransitionOptions<S> {
  readonly ms: number | ((from: S, to: S) => number);
  readonly ease?: Ease | undefined;
}

function validMs(ms: number): number {
  if (!(ms >= 0 && Number.isFinite(ms)))
    throw new RangeError("transition: ms must be a finite number of ms, 0 or more.");
  return ms;
}

function buildTransition<S, V>(
  source: State<S>,
  pick: (state: S) => V,
  options: TransitionOptions<V>,
): Signal<Transition<V>> {
  const curve = options.ease ?? ease.linear;
  if (typeof options.ms === "number") validMs(options.ms);
  const changes = changesOf(source, pick);

  return (watched: Time, events: Events): Transition<V> => {
    const time = rawTime(watched);
    const { start, list } = changes(time, events);

    const latest = list.at(-1);
    if (latest === undefined)
      return { current: start, previous: start, progress: 1, active: false };
    const previous = list.at(-2)?.to ?? start;
    const now = elapsedOf(time.clock);
    if (now === undefined) return { current: latest.to, previous, progress: 1, active: false };

    const duration = validMs(
      typeof options.ms === "function" ? options.ms(previous, latest.to) : options.ms,
    );
    const elapsed = Math.max(0, now - latest.at);
    if (duration <= 0 || elapsed >= duration)
      return { current: latest.to, previous, progress: 1, active: false };

    stillMoving();
    return {
      current: latest.to,
      previous,
      progress: curve(clamp(elapsed / duration, 0, 1)),
      active: true,
    };
  };
}

/** Eased transition progress across discrete changes of `source` (or `pick(source)`). */
export function transition<S>(
  source: State<S>,
  options: TransitionOptions<S>,
): Signal<Transition<S>>;
export function transition<S, V>(
  source: State<S>,
  pick: (state: S) => V,
  options: TransitionOptions<V>,
): Signal<Transition<V>>;
export function transition<S, V>(
  source: State<S>,
  pickOrOptions: ((state: S) => V) | TransitionOptions<S>,
  maybeOptions?: TransitionOptions<V>,
): Signal<Transition<S> | Transition<V>> {
  if (typeof pickOrOptions === "function") {
    if (maybeOptions === undefined)
      throw new TypeError("transition: missing options after `pick`.");
    return buildTransition(source, pickOrOptions, maybeOptions);
  }
  return buildTransition(source, (value) => value, pickOrOptions);
}
