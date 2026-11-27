import {
  NO_EVENTS,
  UNTIMED,
  clamp,
  elapsedOf,
  scroll,
  span,
  springTo,
  stepMetaOf,
  storeCell,
  unreachable,
  watchClock,
  type Ease,
  type Events,
  type MotionWindow,
  type Signal,
  type Span,
  type SpringToOptions,
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

/** A scroll position or an element's edge in px, resolved against measured page rest boxes. */
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

/** Settings of a scroll beat: `[from, to]` scroll points mapping 0 to 1, and `smooth` to trail the scroll. */
export interface ScrollBeatOptions {
  readonly scroll: readonly [from: ScrollPoint, to: ScrollPoint];
  /** Progress follows a spring towards the scroll position instead of the position itself; `true` uses
   * `springTo`'s defaults. Headless, with no live clock, it reads the scroll position. */
  readonly smooth?: true | SpringToOptions;
}

/** A named window over scroll position, mapping `from` to `to` into progress 0 to 1. */
export interface ScrollBeat extends MotionWindow {
  readonly kind: "scroll-beat";
  readonly name: string;
  readonly from: ScrollPoint;
  readonly to: ScrollPoint;
  /** Whether progress trails the scroll position on a spring. */
  readonly smooth: boolean;
  /** Maps scroll position from `context.events` between `from` and `to` into untimed progress 0 to 1. */
  of(time: Time, ease?: Ease, context?: BeatContext): Time;
  /** Whether scroll has reached `from` at `time` and `context`. */
  active(time: Time, context?: BeatContext): boolean;
  /** Whether a `smooth` beat's spring is still on its way at `time`; a plain scroll beat moves only with input. */
  moving(time: Time, context?: BeatContext): boolean;
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
  /** Whether its clock part is running at `time`, so its progress changes with no new input. */
  moving(time: Time, context?: BeatContext): boolean;
  /** Which way its clock part runs at `time`: 1 forward, -1 back towards 0, 0 at rest. */
  heading(time: Time, context?: BeatContext): -1 | 0 | 1;
}

const FIXED_PX = new WeakMap<ScrollPoint, number>();
const POINT_MEASURES = new WeakMap<ScrollPoint, () => object>();

/** The element whose edge a scroll point is, or undefined for a fixed px. */
export function measuredBy(point: ScrollPoint): object | undefined {
  return POINT_MEASURES.get(point)?.();
}

/** Fixed scroll px if `point` was created with `scrollPoint(px)`, else `undefined`. */
export function fixedPxOf(point: ScrollPoint): number | undefined {
  return FIXED_PX.get(point);
}

/** Whether `value` is a `ScrollPoint` made by `scrollPoint` or an element edge. */
export function isScrollPoint(value: unknown): value is ScrollPoint {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "kind") === "scroll-point" &&
    typeof Reflect.get(value, "at") === "function"
  );
}

/** Whether `value` is a `ScrollBeat` created by `beat(name, { scroll })`. */
export function isScrollBeat(value: unknown): value is ScrollBeat {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "kind") === "scroll-beat" &&
    typeof Reflect.get(value, "name") === "string" &&
    isScrollPoint(Reflect.get(value, "from")) &&
    isScrollPoint(Reflect.get(value, "to"))
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

/** Where a motion's context keeps its events for its window to read, so that read is not counted as the motion's. */
export const WINDOW_EVENTS = Symbol.for("@gerak/stage/window-events");

function readContext(context: unknown): { readonly events: Events; readonly rest: RestReader } {
  if (typeof context !== "object" || context === null) return { events: NO_EVENTS, rest: NO_REST };
  const rawEvents: unknown = Reflect.get(context, WINDOW_EVENTS) ?? Reflect.get(context, "events");
  const rawRest: unknown = Reflect.get(context, "rest");
  return {
    events: isEvents(rawEvents) ? rawEvents : NO_EVENTS,
    rest: isRestReader(rawRest) ? rawRest : NO_REST,
  };
}

/** Creates a scroll point from a resolver, an optional fixed px, and the element whose edge it is. */
export function makeScrollPoint(
  resolve: (rest: RestReader) => number,
  fixed?: number,
  measures?: () => object,
): ScrollPoint {
  const shift = (delta: number, label: string): ScrollPoint => {
    if (!Number.isFinite(delta))
      throw new RangeError(`${label}: offset must be a finite number of px, not ${delta}.`);
    return makeScrollPoint(
      (rest) => resolve(rest) + delta,
      fixed === undefined ? undefined : fixed + delta,
      measures,
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
  if (measures !== undefined) POINT_MEASURES.set(point, measures);
  return point;
}

/** A scroll position in `px`, with `.plus(px)`, `.minus(px)` and `.reached`. */
export function scrollPoint(px: number): ScrollPoint {
  if (!Number.isFinite(px))
    throw new RangeError(`scrollPoint: position must be a finite number of px, not ${px}.`);
  return makeScrollPoint(() => px, px);
}

function makeScrollBeat(
  name: string,
  from: ScrollPoint,
  to: ScrollPoint,
  smooth: true | SpringToOptions | undefined,
): ScrollBeat {
  const position: Signal<number> =
    smooth === undefined ? scroll.y : springTo(scroll.y, (y) => y, smooth === true ? {} : smooth);
  return Object.freeze({
    kind: "scroll-beat",
    name,
    from,
    to,
    smooth: smooth !== undefined,
    of(time: Time, ease?: Ease, context?: BeatContext): Time {
      const { events, rest } = readContext(context);
      const y = position(time, events);
      const start = from.at(rest);
      const end = to.at(rest);
      const raw = end <= start ? (y <= start ? 0 : 1) : clamp((y - start) / (end - start), 0, 1);
      return { progress: ease === undefined ? raw : ease(raw), clock: UNTIMED };
    },
    active(time: Time, context?: BeatContext): boolean {
      const { events, rest } = readContext(context);
      return position(time, events) >= from.at(rest);
    },
    moving(time: Time, context?: BeatContext): boolean {
      if (smooth === undefined) return false;
      const { events } = readContext(context);
      let active = false;
      watchClock(
        (use) => {
          if (use === "time") active = true;
        },
        () => position(time, events),
      );
      return active;
    },
  });
}

type TriggerFold = (
  time: Time,
  events: Events,
  threshold: number,
) => {
  readonly raw: number;
  readonly active: boolean;
  readonly moving: boolean;
  readonly heading: -1 | 0 | 1;
};

interface TriggerCell {
  readonly resetId: number | undefined;
  readonly fallbackList: readonly unknown[] | undefined;
  limit: number;
  doneLogical: number;
  reached: boolean;
  started: number | undefined;
  progress: number;
  since: number;
  active: boolean;
}

/** One trigger's reading of `scroll.y` stored per `RuntimeStore`, folding new scroll steps incrementally. */
function triggerFold(ms: number, back: TriggerBack): TriggerFold {
  const cellSlot = storeCell<TriggerCell>();
  return (time, events, threshold) => {
    const now = elapsedOf(time.clock);
    const steps = scroll.y.steps(time, events);
    const meta = stepMetaOf(steps);
    const stepBase = meta?.base ?? 0;

    const cell = cellSlot.own(
      (existing) =>
        threshold !== existing.limit ||
        (meta !== undefined
          ? meta.resetId !== existing.resetId
          : steps !== existing.fallbackList || steps.length < existing.doneLogical),
      () => {
        const initial = scroll.y.start >= threshold;
        return {
          resetId: meta?.resetId,
          fallbackList: steps,
          limit: threshold,
          doneLogical: 0,
          reached: initial,
          started: initial ? 0 : undefined,
          progress: 0,
          since: 0,
          active: initial,
        };
      },
      (existing) => ({ ...existing, fallbackList: steps }),
    );

    const totalSteps = stepBase + steps.length;
    if (cell.doneLogical < stepBase) cell.doneLogical = stepBase;
    for (; cell.doneLogical < totalSteps; cell.doneLogical += 1) {
      const step = steps[cell.doneLogical - stepBase];
      if (step === undefined) break;
      const next = step.value >= threshold;
      switch (back) {
        case "stay":
          if (cell.started === undefined && next) cell.started = step.at;
          break;
        case "replay":
          if (next === cell.reached) break;
          cell.reached = next;
          cell.started = next ? step.at : undefined;
          break;
        case "reverse":
          if (next === cell.reached) break;
          cell.progress = clamp(
            cell.progress + (cell.reached ? 1 : -1) * (Math.max(0, step.at - cell.since) / ms),
            0,
            1,
          );
          cell.since = step.at;
          cell.reached = next;
          if (next) cell.active = true;
          break;
        default:
          return unreachable(back);
      }
    }
    switch (back) {
      case "stay": {
        if (now === undefined) {
          const shown = cell.started !== undefined;
          return { raw: shown ? 1 : 0, active: shown, moving: false, heading: 0 };
        }
        if (cell.started === undefined) return { raw: 0, active: false, moving: false, heading: 0 };
        const raw = clamp(now - cell.started, 0, ms) / ms;
        return { raw, active: true, moving: raw < 1, heading: raw < 1 ? 1 : 0 };
      }
      case "replay": {
        if (now === undefined) {
          const shown = scroll.y(time, events) >= threshold;
          return { raw: shown ? 1 : 0, active: shown, moving: false, heading: 0 };
        }
        if (cell.started === undefined) return { raw: 0, active: false, moving: false, heading: 0 };
        const raw = clamp(now - cell.started, 0, ms) / ms;
        return { raw, active: true, moving: raw < 1, heading: raw < 1 ? 1 : 0 };
      }
      case "reverse": {
        if (now === undefined) {
          const shown = scroll.y(time, events) >= threshold;
          return { raw: shown ? 1 : 0, active: shown, moving: false, heading: 0 };
        }
        const raw = clamp(
          cell.progress + (cell.reached ? 1 : -1) * (Math.max(0, now - cell.since) / ms),
          0,
          1,
        );
        const moving = cell.reached ? raw < 1 : raw > 0;
        return {
          raw,
          active: cell.active && (cell.reached || raw > 0),
          moving,
          heading: !moving ? 0 : cell.reached ? 1 : -1,
        };
      }
      default:
        return unreachable(back);
    }
  };
}

function makeTriggerBeat(
  name: string,
  ms: number,
  when: ScrollReached,
  back: TriggerBack,
): TriggerBeat {
  const fold = triggerFold(ms, back);
  return Object.freeze({
    kind: "trigger-beat",
    name,
    ms,
    when,
    back,
    of(time: Time, ease?: Ease, context?: BeatContext): Time {
      const { events, rest } = readContext(context);
      const { raw } = fold(time, events, when.point.at(rest));
      const progress = ease === undefined ? raw : ease(raw);
      const clock =
        elapsedOf(time.clock) === undefined
          ? UNTIMED
          : ({ kind: "timed", elapsed: raw * ms, length: ms } as const);
      return { progress, clock };
    },
    active(time: Time, context?: BeatContext): boolean {
      const { events, rest } = readContext(context);
      return fold(time, events, when.point.at(rest)).active;
    },
    moving(time: Time, context?: BeatContext): boolean {
      const { events, rest } = readContext(context);
      return fold(time, events, when.point.at(rest)).moving;
    },
    heading(time: Time, context?: BeatContext): -1 | 0 | 1 {
      const { events, rest } = readContext(context);
      return fold(time, events, when.point.at(rest)).heading;
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
    const smooth: unknown = Reflect.get(second, "smooth");
    if (smooth !== undefined && smooth !== true && (typeof smooth !== "object" || smooth === null))
      throw new TypeError(`beat "${name}": \`smooth\` takes true or springTo options.`);
    return makeScrollBeat(name, from, to, second.smooth);
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
