import {
  NO_EVENTS,
  UNTIMED,
  clamp,
  elapsedOf,
  scroll,
  span,
  unreachable,
  type Ease,
  type Events,
  type MotionWindow,
  type Span,
  type Time,
} from "@gerak/core";
import { NO_REST, type RestReader } from "./layout";

/** A named stretch of the piece in ms: a core `Span` that also says what it is called. */
export interface Beat extends Span {
  readonly name: string;
}

/** Where a clock beat starts: at a ms (default 0), or after another beat with an optional gap. */
export type BeatPlace = { readonly at?: number } | { readonly after: Beat; readonly gap?: number };

/** Context a scroll or trigger beat reads when mapping time: events so far and measured rests. */
export interface BeatContext {
  readonly events?: Events | undefined;
  readonly rest?: RestReader | undefined;
}

/** A trigger condition that fires when scroll passes `point`. */
export interface ScrollReached {
  readonly kind: "scroll-reached";
  readonly point: ScrollPoint;
}

/** A scroll position or section edge in px, resolved against measured page rest boxes. */
export interface ScrollPoint {
  readonly kind: "scroll-point";
  /** The scroll position in px, resolved against `rest` when measured from the page. */
  at(rest?: RestReader): number;
  /** A scroll point `px` further down the page. */
  plus(px: number): ScrollPoint;
  /** A scroll point `px` further up the page. */
  minus(px: number): ScrollPoint;
  /** Trigger condition firing when scroll first passes this point. */
  readonly reached: ScrollReached;
}

/** What scrolling back past a trigger point does: reverse cleanly, stay at its end, or reset to replay. */
export type TriggerBack = "reverse" | "stay" | "replay";

/** Settings of a triggered clock beat: `when` scroll passes a point, and what scrolling `back` does. */
export interface TriggerPlace {
  readonly when: ScrollReached;
  readonly back: TriggerBack;
}

/** Settings of a scroll beat: `[from, to]` scroll points mapping 0 to 1. */
export interface ScrollBeatOptions {
  readonly scroll: readonly [from: ScrollPoint, to: ScrollPoint];
}

/** A named window over scroll position, mapping `from` to `to` into progress 0 to 1. */
export interface ScrollBeat extends MotionWindow {
  readonly kind: "scroll-beat";
  readonly name: string;
  readonly from: ScrollPoint;
  readonly to: ScrollPoint;
  /** Maps scroll position from `context.events` between `from` and `to` into untimed progress 0 to 1. */
  of(time: Time, ease?: Ease, context?: BeatContext): Time;
  /** Whether scroll has reached `from` at `time` and `context`. */
  active(time: Time, context?: BeatContext): boolean;
}

/** A named clock beat started when scroll passes `when.point`, with explicit `back` behaviour. */
export interface TriggerBeat extends MotionWindow {
  readonly kind: "trigger-beat";
  readonly name: string;
  readonly ms: number;
  readonly when: ScrollReached;
  readonly back: TriggerBack;
  /** Progress 0 to 1 across `ms` since `when` fired, folding `context.events` with `back`. */
  of(time: Time, ease?: Ease, context?: BeatContext): Time;
  /** Whether this trigger has started or holds non-zero progress at `time` and `context`. */
  active(time: Time, context?: BeatContext): boolean;
}

const FIXED_PX = new WeakMap<ScrollPoint, number>();

function isScrollPoint(value: unknown): value is ScrollPoint {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "kind") === "scroll-point" &&
    typeof Reflect.get(value, "at") === "function"
  );
}

function isScrollReached(value: unknown): value is ScrollReached {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "kind") === "scroll-reached" &&
    isScrollPoint(Reflect.get(value, "point"))
  );
}

function isTriggerBack(value: unknown): value is TriggerBack {
  return value === "reverse" || value === "stay" || value === "replay";
}

function isClockBeat(value: unknown): value is Beat {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "name") === "string" &&
    typeof Reflect.get(value, "from") === "number" &&
    typeof Reflect.get(value, "to") === "number" &&
    typeof Reflect.get(value, "of") === "function"
  );
}

function isRestReader(value: unknown): value is RestReader {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "get") === "function" &&
    typeof Reflect.get(value, "has") === "function" &&
    typeof Reflect.get(value, "keys") === "function"
  );
}

function isEvents(value: unknown): value is Events {
  return Array.isArray(value);
}

function readContext(context: unknown): { readonly events: Events; readonly rest: RestReader } {
  if (typeof context !== "object" || context === null) return { events: NO_EVENTS, rest: NO_REST };
  const rawEvents: unknown = Reflect.get(context, "events");
  const rawRest: unknown = Reflect.get(context, "rest");
  return {
    events: isEvents(rawEvents) ? rawEvents : NO_EVENTS,
    rest: isRestReader(rawRest) ? rawRest : NO_REST,
  };
}

/** Creates a scroll point from a resolver and optional fixed px; shared by `scrollPoint` and sections. */
export function makeScrollPoint(
  resolve: (rest: RestReader) => number,
  fixed?: number,
): ScrollPoint {
  const shift = (delta: number, label: string): ScrollPoint => {
    if (!Number.isFinite(delta))
      throw new RangeError(`${label}: offset must be a finite number of px, not ${delta}.`);
    return makeScrollPoint(
      (rest) => resolve(rest) + delta,
      fixed === undefined ? undefined : fixed + delta,
    );
  };
  let point: ScrollPoint;
  const reached: ScrollReached = Object.freeze({
    kind: "scroll-reached",
    get point() {
      return point;
    },
  });
  point = Object.freeze({
    kind: "scroll-point",
    at: (rest: RestReader = NO_REST) => resolve(rest),
    plus: (px: number) => shift(px, "scrollPoint.plus"),
    minus: (px: number) => shift(-px, "scrollPoint.minus"),
    reached,
  });
  if (fixed !== undefined) FIXED_PX.set(point, fixed);
  return point;
}

/** A scroll position in `px`, with `.plus(px)`, `.minus(px)` and `.reached`. */
export function scrollPoint(px: number): ScrollPoint {
  if (!Number.isFinite(px))
    throw new RangeError(`scrollPoint: position must be a finite number of px, not ${px}.`);
  return makeScrollPoint(() => px, px);
}

function makeScrollBeat(name: string, from: ScrollPoint, to: ScrollPoint): ScrollBeat {
  return Object.freeze({
    kind: "scroll-beat",
    name,
    from,
    to,
    of(time: Time, ease?: Ease, context?: BeatContext): Time {
      const { events, rest } = readContext(context);
      const y = scroll.y(time, events);
      const start = from.at(rest);
      const end = to.at(rest);
      const raw = end <= start ? (y <= start ? 0 : 1) : clamp((y - start) / (end - start), 0, 1);
      return { progress: ease === undefined ? raw : ease(raw), clock: UNTIMED };
    },
    active(time: Time, context?: BeatContext): boolean {
      const { events, rest } = readContext(context);
      return scroll.y(time, events) >= from.at(rest);
    },
  });
}

function triggerState(
  time: Time,
  events: Events,
  threshold: number,
  ms: number,
  back: TriggerBack,
): { readonly raw: number; readonly active: boolean } {
  const now = elapsedOf(time.clock);
  const initial = scroll.y.start >= threshold;
  switch (back) {
    case "stay": {
      const steps = scroll.y.steps(time, events);
      if (now === undefined) {
        const reached = initial || steps.some((step) => step.value >= threshold);
        return { raw: reached ? 1 : 0, active: reached };
      }
      const started = initial ? 0 : steps.find((step) => step.value >= threshold)?.at;
      if (started === undefined) return { raw: 0, active: false };
      return { raw: clamp(now - started, 0, ms) / ms, active: true };
    }
    case "replay": {
      if (now === undefined) {
        const reached = scroll.y(time, events) >= threshold;
        return { raw: reached ? 1 : 0, active: reached };
      }
      let reached = initial;
      let started: number | undefined = initial ? 0 : undefined;
      for (const step of scroll.y.steps(time, events)) {
        const next = step.value >= threshold;
        if (next === reached) continue;
        reached = next;
        started = next ? step.at : undefined;
      }
      if (started === undefined) return { raw: 0, active: false };
      return { raw: clamp(now - started, 0, ms) / ms, active: true };
    }
    case "reverse": {
      if (now === undefined) {
        const reached = scroll.y(time, events) >= threshold;
        return { raw: reached ? 1 : 0, active: reached };
      }
      let reached = initial;
      let progress = 0;
      let since = 0;
      let active = initial;
      for (const step of scroll.y.steps(time, events)) {
        const next = step.value >= threshold;
        if (next === reached) continue;
        progress = clamp(progress + (reached ? 1 : -1) * (Math.max(0, step.at - since) / ms), 0, 1);
        since = step.at;
        reached = next;
        if (next) active = true;
      }
      progress = clamp(progress + (reached ? 1 : -1) * (Math.max(0, now - since) / ms), 0, 1);
      if (!reached && progress <= 0) active = false;
      return { raw: progress, active };
    }
    default:
      return unreachable(back);
  }
}

function makeTriggerBeat(
  name: string,
  ms: number,
  when: ScrollReached,
  back: TriggerBack,
): TriggerBeat {
  return Object.freeze({
    kind: "trigger-beat",
    name,
    ms,
    when,
    back,
    of(time: Time, ease?: Ease, context?: BeatContext): Time {
      const { events, rest } = readContext(context);
      const { raw } = triggerState(time, events, when.point.at(rest), ms, back);
      const progress = ease === undefined ? raw : ease(raw);
      const clock =
        elapsedOf(time.clock) === undefined
          ? UNTIMED
          : ({ kind: "timed", elapsed: raw * ms, length: ms } as const);
      return { progress, clock };
    },
    active(time: Time, context?: BeatContext): boolean {
      const { events, rest } = readContext(context);
      return triggerState(time, events, when.point.at(rest), ms, back).active;
    },
  });
}

/** Whether `value` is a `ScrollBeat` or `TriggerBeat` created by `beat`. */
export function isInputBeat(value: unknown): value is ScrollBeat | TriggerBeat {
  if (typeof value !== "object" || value === null) return false;
  const kind: unknown = Reflect.get(value, "kind");
  return (
    (kind === "scroll-beat" || kind === "trigger-beat") &&
    typeof Reflect.get(value, "name") === "string" &&
    typeof Reflect.get(value, "of") === "function"
  );
}

/** A clock beat `ms` long, a triggered beat `{ when, back }`, or a scroll window `{ scroll: [from, to] }`. */
export function beat(name: string, ms: number, place?: BeatPlace): Beat;
export function beat(name: string, ms: number, trigger: TriggerPlace): TriggerBeat;
export function beat(name: string, options: ScrollBeatOptions): ScrollBeat;
export function beat(
  name: string,
  second: number | ScrollBeatOptions,
  third?: BeatPlace | TriggerPlace,
): Beat | ScrollBeat | TriggerBeat {
  if (typeof name !== "string" || name === "") throw new TypeError("beat: a beat needs a name.");
  if (typeof second === "object" && second !== null && "scroll" in second) {
    if (third !== undefined)
      throw new TypeError(`beat "${name}": a scroll beat takes no third argument.`);
    const pair: unknown = second.scroll;
    if (!Array.isArray(pair) || pair.length !== 2)
      throw new TypeError(`beat "${name}": scroll needs [from, to] scroll points.`);
    const from: unknown = pair[0];
    const to: unknown = pair[1];
    if (!isScrollPoint(from) || !isScrollPoint(to))
      throw new TypeError(`beat "${name}": scroll beat takes scroll points, not ms.`);
    const fixedFrom = FIXED_PX.get(from);
    const fixedTo = FIXED_PX.get(to);
    if (fixedFrom !== undefined && fixedTo !== undefined && fixedTo <= fixedFrom)
      throw new RangeError(
        `beat "${name}": scroll range ${fixedFrom} to ${fixedTo} px must increase.`,
      );
    return makeScrollBeat(name, from, to);
  }
  if (typeof second !== "number")
    throw new TypeError(`beat "${name}": expected a length in ms or { scroll: [from, to] }.`);
  if (!Number.isFinite(second) || second <= 0)
    throw new RangeError(`beat "${name}": a length of ${second} ms is not above 0.`);
  if (third !== undefined) {
    if (typeof third !== "object" || third === null)
      throw new TypeError(`beat "${name}": expected a beat placement or trigger.`);
    if ("when" in third || "back" in third) {
      const when: unknown = Reflect.get(third, "when");
      const back: unknown = Reflect.get(third, "back");
      if (!isScrollReached(when))
        throw new TypeError(`beat "${name}": trigger \`when\` needs a point's \`.reached\`.`);
      if (!isTriggerBack(back))
        throw new TypeError(
          `beat "${name}": trigger needs \`back: "reverse" | "stay" | "replay"\`.`,
        );
      return makeTriggerBeat(name, second, when, back);
    }
    if ("after" in third && !isClockBeat(Reflect.get(third, "after")))
      throw new TypeError(`beat "${name}": \`after\` needs a clock beat.`);
    if ("at" in third) {
      const atValue: unknown = Reflect.get(third, "at");
      if (atValue !== undefined && typeof atValue !== "number")
        throw new TypeError(`beat "${name}": \`at\` needs a time in ms.`);
    }
  }
  const place = third ?? {};
  const from = "after" in place ? place.after.to + (place.gap ?? 0) : (place.at ?? 0);
  if (!Number.isFinite(from) || from < 0)
    throw new RangeError(`beat "${name}": it cannot start at ${from} ms.`);
  return Object.freeze({ ...span(from, from + second), name });
}
