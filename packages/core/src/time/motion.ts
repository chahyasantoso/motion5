import { loop } from "./loop";
import type { Ease } from "../ease/ease";
import type { Span } from "./span";
import { withProgress, type Time } from "./time";
import type { Timing } from "./timing";
import { unreachable } from "../utility/unreachable";

/** How a motion joins what is under it on one element: `layer` adds by each field's rule, `take` replaces. */
export type Joins = "layer" | "take";

/** A window whose progress comes from time and context, such as events, accepted by `Motion.in`. */
export interface MotionWindow {
  /** Maps scene `time` and optional `context` to the window's `Time`, eased by `ease` when given. */
  of(time: Time, ease?: Ease, context?: unknown): Time;
  /** Whether this window is active at `time` and `context`, used by `.take()`. */
  active?(time: Time, context?: unknown): boolean;
  /** Whether its time keeps changing with the clock alone at `time` and `context`, with no new input. */
  moving?(time: Time, context?: unknown): boolean;
}

/** A clock `Span` or a context-driven `MotionWindow` accepted by `Motion.in`. */
export type InWindow = Span | MotionWindow;

/** A function of time with timing attached: `in` plays it over a span or window, `loop` repeats it, `take` makes it replace. */
export interface Motion<T, C = unknown> {
  (time: Time, context?: C): T;
  /** The clock stretch it plays over, or undefined for the whole piece or a non-clock window. */
  readonly span: Span | undefined;
  /** The span or window it plays over, or undefined for the whole piece. */
  readonly window: InWindow | undefined;
  /** The repeat length in ms, or undefined when it does not loop. */
  readonly period: number | undefined;
  readonly joins: Joins;
  /** Whether a `.loop()` repeats indefinitely without any enclosing finite `Span`. */
  readonly loopsForever: boolean;
  /** Whether it keeps moving with no period, so its element is ambient. */
  readonly isAmbient: boolean;
  /** Plays over `window`: holds start before and end after, and runs `ease(progress)` inside when `ease` is given. */
  in(window: InWindow, ease?: Ease): Motion<T, C>;
  /** Repeats every `ms`, before `in` is applied. */
  loop(ms: number): Motion<T, C>;
  /** Replaces the fields it sets, from the start of its span or window on. */
  take(): Motion<T, C>;
  /** Marks it as always moving; its time is unchanged. */
  ambient(): Motion<T, C>;
}

type MotionStep =
  | { readonly kind: "in"; readonly window: InWindow; readonly ease: Ease | undefined }
  | { readonly kind: "loop"; readonly cycle: Timing; readonly period: number };

interface Traits {
  readonly steps: readonly MotionStep[];
  readonly ease: Ease | undefined;
  readonly span: Span | undefined;
  readonly window: InWindow | undefined;
  readonly period: number | undefined;
  readonly joins: Joins;
  readonly isAmbient: boolean;
}

const MOTION_BODY = Symbol.for("@gerak/core/motion-body");

function isSpan(value: unknown): value is Span {
  return (
    typeof value === "object" &&
    value !== null &&
    Number.isFinite(Reflect.get(value, "from")) &&
    Number.isFinite(Reflect.get(value, "to")) &&
    typeof Reflect.get(value, "of") === "function"
  );
}

function isMotionWindow(value: unknown): value is MotionWindow {
  if (typeof value !== "object" || value === null) return false;
  if (typeof Reflect.get(value, "of") !== "function") return false;
  const active: unknown = Reflect.get(value, "active");
  if (active !== undefined && typeof active !== "function") return false;
  const from: unknown = Reflect.get(value, "from");
  const to: unknown = Reflect.get(value, "to");
  if (typeof from === "number" || typeof to === "number")
    return Number.isFinite(from) && Number.isFinite(to);
  return true;
}

function build<T, C>(fn: (time: Time, context?: C) => T, traits: Traits): Motion<T, C> {
  const { steps } = traits;
  let hasLoop = false;
  let hasSpan = false;
  for (const step of steps) {
    switch (step.kind) {
      case "loop":
        hasLoop = true;
        break;
      case "in":
        if (isSpan(step.window)) hasSpan = true;
        break;
      default:
        unreachable(step);
    }
  }
  const loopsForever = hasLoop && !hasSpan;
  const run = (time: Time, context?: C): T => {
    let current = time;
    for (let index = 0; index < steps.length; index += 1) {
      const step = steps[index];
      if (step === undefined) break;
      switch (step.kind) {
        case "in": {
          const next = steps[index + 1];
          if (!isSpan(step.window) && next?.kind === "loop") {
            const inside = step.window.of(current, undefined, context);
            const cycled = next.cycle.of(inside);
            current =
              step.ease === undefined ? cycled : withProgress(cycled, step.ease(cycled.progress));
            index += 1;
          } else {
            current = step.window.of(current, step.ease, context);
          }
          break;
        }
        case "loop":
          current = step.cycle.of(current);
          break;
        default:
          unreachable(step);
      }
    }
    return fn(current, context);
  };
  const built = Object.assign(run, {
    span: traits.span,
    window: traits.window,
    period: traits.period,
    joins: traits.joins,
    loopsForever,
    isAmbient: traits.isAmbient,
    in(window: InWindow, ease?: Ease): Motion<T, C> {
      if (!isMotionWindow(window))
        throw new RangeError("motion.in: give a span made by `span` or `beat`.");
      return build(fn, {
        ...traits,
        steps: [...steps, { kind: "in", window, ease }],
        span: isSpan(window) ? window : undefined,
        window,
        ease,
      });
    },
    loop(ms: number): Motion<T, C> {
      const cycle = loop(ms);
      return build(fn, {
        ...traits,
        steps: [...steps, { kind: "loop", cycle, period: ms }],
        period: ms,
      });
    },
    take(): Motion<T, C> {
      return build(fn, { ...traits, joins: "take" });
    },
    ambient(): Motion<T, C> {
      return build(fn, { ...traits, isAmbient: true });
    },
  });
  Object.defineProperty(built, MOTION_BODY, {
    value: Object.freeze({ fn, ease: traits.ease, period: traits.period }),
  });
  return Object.freeze(built);
}

/** Gives `fn` the timing methods; called with no span or period it answers as `fn` does. */
export function motion<T, C = unknown>(fn: (time: Time, context?: C) => T): Motion<T, C> {
  return build(fn, {
    steps: [],
    span: undefined,
    window: undefined,
    ease: undefined,
    period: undefined,
    joins: "layer",
    isAmbient: false,
  });
}
