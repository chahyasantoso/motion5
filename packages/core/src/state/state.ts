import { notifyInputUse, rawTime, type InputChannel } from "./clock-watch";
import { epochOf, storeCell } from "./store";
import { elapsedOf, type Time } from "../time/time";
import type { Signal } from "../time/shapes";
import type { Events, MotionEvent } from "../events/event-list";
import { baseIndexOf, compactedBeforeOf, generationOf, sourceStreamOf } from "../events/event-log";

/** The moment a state changed, and what it became. */
export interface Step<S> {
  readonly at: number;
  readonly value: S;
}

/** Settings of a `state`: `target`, the event target, or targets, whose events reach the rule. */
export interface StateOptions {
  /** Only events with this target, or one of these, reach the rule; with none, every event does. */
  readonly target?: string | readonly string[];
}

/** What the scene is in at a time, given its events: a signal of that, with `start` and the `steps`. */
export interface State<S> extends Signal<S> {
  /** The state before any event. */
  readonly start: S;
  /** The moments the state changed up to `time`, oldest first. The state owns the list and grows it on later
   * calls, so copy it to keep it. */
  steps(time: Time, events: Events): readonly Step<S>[];
}

/** Monotonic compaction metadata attached to a state step list. */
export interface StepMeta {
  readonly resetId: number;
  readonly base: number;
}

const STEP_META = new WeakMap<readonly Step<unknown>[], StepMeta>();

/** Internal step stream metadata (reset generation and compacted prefix count). */
export function stepMetaOf(steps: readonly Step<unknown>[]): StepMeta | undefined {
  return STEP_META.get(steps);
}

interface StateCell<S> {
  ownerEpoch: number;
  resetId: number;
  current: S;
  anchorAt: number;
  anchorValue: S;
  steps: Step<S>[];
  stepBase: number;
  taken: MotionEvent[] | undefined;
  cursorLogical: number;
  latest: number;
  seen: Events | undefined;
  seenStream: object | undefined;
  seenGeneration: number | undefined;
}

function upperBoundStep<S>(steps: readonly Step<S>[], at: number): number {
  let low = 0;
  let high = steps.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((steps[mid]?.at ?? 0) <= at) low = mid + 1;
    else high = mid;
  }
  return low;
}

function upperBoundEvent(events: Events, at: number): number {
  let low = 0;
  let high = events.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((events[mid]?.at ?? 0) <= at) low = mid + 1;
    else high = mid;
  }
  return low;
}

function upperBoundStrictlyBefore<S>(steps: readonly Step<S>[], beforeMs: number): number {
  let low = 0;
  let high = steps.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((steps[mid]?.at ?? 0) < beforeMs) low = mid + 1;
    else high = mid;
  }
  return low;
}

/** Internal `state` builder allowing sample channels to seed initial values from compacted baselines. */
export function buildState<S>(
  start: S,
  rule: (current: S, event: MotionEvent) => S,
  options: StateOptions = {},
  initialOf?: (events: Events) => S,
  channel: InputChannel = "events",
): State<S> {
  const { target } = options;
  const accepts = (event: MotionEvent): boolean => {
    if (target === undefined) return true;
    if (typeof target === "string") return event.target === target;
    return event.target !== undefined && target.includes(event.target);
  };
  const cellSlot = storeCell<StateCell<S>>();

  const ensureOwned = (
    existing: StateCell<S> | undefined,
    epoch: number,
  ): StateCell<S> | undefined => {
    if (existing === undefined) return undefined;
    if (existing.ownerEpoch === epoch) return existing;
    const clonedSteps = existing.steps.slice();
    const next: StateCell<S> = {
      ...existing,
      ownerEpoch: epoch,
      steps: clonedSteps,
      taken: existing.taken?.slice(),
    };
    STEP_META.set(clonedSteps, { resetId: next.resetId, base: next.stepBase });
    cellSlot.set(next);
    return next;
  };

  const fold = (time: Time, events: Events): StateCell<S> => {
    notifyInputUse(channel);
    const now = elapsedOf(rawTime(time).clock);
    const generation = generationOf(events);
    const stream = sourceStreamOf(events);
    const base = baseIndexOf(events) ?? 0;
    const compactedBefore = compactedBeforeOf(events);
    const epoch = epochOf();
    const existing = cellSlot.get();
    const sameStream =
      existing !== undefined &&
      (events === existing.seen || (stream !== undefined && stream === existing.seenStream));

    // Fast path for backward probes (or seeks inside retained window) when event stream did not reorder.
    if (
      existing !== undefined &&
      now !== undefined &&
      now < existing.latest &&
      sameStream &&
      generation !== undefined &&
      generation === existing.seenGeneration &&
      now >= existing.anchorAt
    ) {
      const cutStep = upperBoundStep(existing.steps, now);
      const cutEvent = upperBoundEvent(events, now);
      const sliced = existing.steps.slice(0, cutStep);
      const resetId = existing.resetId + 1;
      const latestAt =
        cutEvent > 0 ? (events[cutEvent - 1]?.at ?? existing.anchorAt) : existing.anchorAt;
      const rewound: StateCell<S> = {
        ownerEpoch: epoch,
        resetId,
        current:
          cutStep > 0 ? (sliced[cutStep - 1]?.value ?? existing.anchorValue) : existing.anchorValue,
        anchorAt: existing.anchorAt,
        anchorValue: existing.anchorValue,
        steps: sliced,
        stepBase: existing.stepBase,
        taken: undefined,
        cursorLogical: base + cutEvent,
        latest: latestAt,
        seen: events,
        seenStream: stream,
        seenGeneration: generation,
      };
      STEP_META.set(sliced, { resetId, base: existing.stepBase });
      cellSlot.set(rewound);
      return rewound;
    }

    let resumes = existing !== undefined && (now === undefined || existing.latest <= now);
    if (resumes && existing !== undefined) {
      if (generation !== undefined) {
        if (!sameStream || generation !== existing.seenGeneration) {
          resumes = false;
        }
      } else {
        const prevTaken = existing.taken;
        if (prevTaken === undefined || events.length < prevTaken.length) {
          resumes = false;
        } else {
          for (let index = 0; index < prevTaken.length; index += 1) {
            if (events[index] !== prevTaken[index]) {
              resumes = false;
              break;
            }
          }
        }
      }
    }

    let work: StateCell<S>;
    if (!resumes || existing === undefined) {
      const initial = initialOf === undefined ? start : initialOf(events);
      const steps: Step<S>[] = [];
      const resetId = (existing?.resetId ?? 0) + 1;
      work = {
        ownerEpoch: epoch,
        resetId,
        current: initial,
        anchorAt: -Infinity,
        anchorValue: initial,
        steps,
        stepBase: 0,
        taken: generation === undefined ? [] : undefined,
        cursorLogical: generation === undefined ? 0 : base,
        latest: -Infinity,
        seen: events,
        seenStream: stream,
        seenGeneration: generation,
      };
      STEP_META.set(steps, { resetId, base: 0 });
      cellSlot.set(work);
    } else {
      work = ensureOwned(existing, epoch) ?? existing;
      work.seen = events;
      work.seenStream = stream;
      work.seenGeneration = generation;
      if (generation !== undefined && work.cursorLogical < base) {
        // Events between previous cursor and compacted base were evicted; re-seed continuous baseline if available.
        if (initialOf !== undefined) {
          work.current = initialOf(events);
          work.anchorValue = work.current;
        }
        work.cursorLogical = base;
      }
    }

    const startOffset =
      generation === undefined ? (work.taken?.length ?? 0) : work.cursorLogical - base;
    for (let offset = Math.max(0, startOffset); offset < events.length; offset += 1) {
      const event = events[offset];
      if (event === undefined) break;
      if (now !== undefined && event.at > now) break;
      if (work.taken !== undefined) work.taken.push(event);
      work.cursorLogical =
        generation === undefined ? (work.taken?.length ?? offset + 1) : base + offset + 1;
      work.latest = Math.max(work.latest, event.at);
      if (!accepts(event)) continue;
      const next = rule(work.current, event);
      if (Object.is(next, work.current)) continue;
      work.current = next;
      work.steps.push({ at: event.at, value: next });
    }

    if (compactedBefore !== undefined && compactedBefore > work.anchorAt && work.steps.length > 0) {
      const trim = upperBoundStrictlyBefore(work.steps, compactedBefore);
      if (trim > 0) {
        const lastTrimmed = work.steps[trim - 1];
        work.anchorValue = lastTrimmed === undefined ? work.anchorValue : lastTrimmed.value;
        work.anchorAt =
          lastTrimmed === undefined ? compactedBefore : Math.min(compactedBefore, lastTrimmed.at);
        work.steps.splice(0, trim);
        work.stepBase += trim;
        STEP_META.set(work.steps, { resetId: work.resetId, base: work.stepBase });
      }
    }

    return work;
  };

  const at = (time: Time, events: Events): S => fold(time, events).current;
  const listed = (time: Time, events: Events): readonly Step<S>[] => fold(time, events).steps;
  return Object.assign(at, { start, steps: listed });
}

/** The state `rule` folds the events into, from `start`, up to the time asked. Pure in time and events: it
 * folds only new events, and starts again when an earlier one differs or time goes back. */
export function state<S>(
  start: S,
  rule: (current: S, event: MotionEvent) => S,
  options: StateOptions = {},
): State<S> {
  return buildState(start, rule, options);
}
