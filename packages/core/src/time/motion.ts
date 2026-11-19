import { loop } from "./loop";
import type { Span } from "./span";
import type { Time } from "./time";

/** How a motion joins what is under it on one element: `layer` adds by each field's rule, `take` replaces. */
type Joins = "layer" | "take";

/** A function of time with timing attached: `in` plays it over a span, `loop` repeats it, `take` makes it replace. */
export interface Motion<T, C = unknown> {
  (time: Time, context?: C): T;
  /** The stretch it plays over, or undefined for the whole piece. */
  readonly span: Span | undefined;
  /** The repeat length in ms, or undefined when it does not loop. */
  readonly period: number | undefined;
  readonly joins: Joins;
  /** Plays over `span`: progress 0 before it, 1 after it. */
  in(span: Span): Motion<T, C>;
  /** Repeats every `ms`, before `in` is applied. */
  loop(ms: number): Motion<T, C>;
  /** Replaces the fields it sets, from the start of its span on. */
  take(): Motion<T, C>;
}

interface Traits {
  readonly span: Span | undefined;
  readonly period: number | undefined;
  readonly joins: Joins;
}

function isSpan(value: unknown): value is Span {
  return (
    typeof value === "object" &&
    value !== null &&
    Number.isFinite(Reflect.get(value, "from")) &&
    Number.isFinite(Reflect.get(value, "to")) &&
    typeof Reflect.get(value, "of") === "function"
  );
}

function build<T, C>(fn: (time: Time, context?: C) => T, traits: Traits): Motion<T, C> {
  const cycle = traits.period === undefined ? undefined : loop(traits.period);
  const run = (time: Time, context?: C): T => {
    const cycled = cycle === undefined ? time : cycle.of(time);
    return fn(traits.span === undefined ? cycled : traits.span.of(cycled), context);
  };
  return Object.freeze(
    Object.assign(run, {
      span: traits.span,
      period: traits.period,
      joins: traits.joins,
      in(span: Span): Motion<T, C> {
        if (!isSpan(span)) throw new RangeError("motion.in: give a span made by `span` or `beat`.");
        return build(fn, { ...traits, span });
      },
      loop(ms: number): Motion<T, C> {
        loop(ms);
        return build(fn, { ...traits, period: ms });
      },
      take(): Motion<T, C> {
        return build(fn, { ...traits, joins: "take" });
      },
    }),
  );
}

/** Gives `fn` the timing methods; called with no span or period it answers as `fn` does. */
export function motion<T, C = unknown>(fn: (time: Time, context?: C) => T): Motion<T, C> {
  return build(fn, { span: undefined, period: undefined, joins: "layer" });
}
