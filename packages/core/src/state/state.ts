import { notifyInputUse, rawTime, type InputChannel } from "./clock-watch";
import { storeCell } from "./store";
import { elapsedOf, type Time } from "../time/time";
import type { Signal } from "../time/shapes";
import type { Input, InputEntry } from "../events/event-list";
import { generationOf, sourceStreamOf } from "../events/event-log";

/** The moment a state changed, and what it became. */
export interface Step<S> {
  readonly at: number;
  readonly value: S;
}

/** Settings of a `state`: `target`, the entry target, or targets, whose entries reach the rule. */
export interface StateOptions {
  /** Only entries with this target, or one of these, reach the rule; with none, every entry does. */
  readonly target?: string | readonly string[];
}

/** What the scene is in at a time, given its input: a signal of that, with `start` and the `steps`. */
export interface State<S> extends Signal<S> {
  /** The state before any entry. */
  readonly start: S;
  /** The moments the state changed up to `time`, oldest first. The state owns the list and grows it on later
   * calls, so copy it to keep it. */
  steps(time: Time, input: Input): readonly Step<S>[];
}

/** Step stream metadata tracking reset generation across rewinds and stream changes. */
export interface StepMeta {
  readonly resetId: number;
}

const STEP_META = new WeakMap<readonly Step<unknown>[], StepMeta>();

/** Internal step stream metadata (reset generation). */
export function stepMetaOf(steps: readonly Step<unknown>[]): StepMeta | undefined {
  return STEP_META.get(steps);
}

interface StateCell<S> {
  resetId: number;
  current: S;
  steps: Step<S>[];
  cursor: number;
  latest: number;
  seen: Input | undefined;
  seenStream: object | undefined;
  seenGeneration: number;
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

function upperBoundEvent(events: Input, at: number): number {
  let low = 0;
  let high = events.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((events[mid]?.at ?? 0) <= at) low = mid + 1;
    else high = mid;
  }
  return low;
}

/** Internal `state` builder tagging reads with an input channel for per-channel frame routing. */
export function buildState<S>(
  start: S,
  rule: (current: S, entry: InputEntry) => S,
  options: StateOptions = {},
  channel: InputChannel = "events",
): State<S> {
  const { target } = options;
  const accepts = (event: InputEntry): boolean => {
    if (target === undefined) return true;
    if (typeof target === "string") return event.target === target;
    return event.target !== undefined && target.includes(event.target);
  };
  const cellSlot = storeCell<StateCell<S>>();

  const fold = (time: Time, events: Input): StateCell<S> => {
    notifyInputUse(channel);
    const now = elapsedOf(rawTime(time).clock);
    const generation = generationOf(events);
    const stream = sourceStreamOf(events);

    const sameStream = (cell: StateCell<S>): boolean =>
      events === cell.seen || (stream !== undefined && stream === cell.seenStream);

    const canRewind = (cell: StateCell<S>, at: number): boolean =>
      at < cell.latest && sameStream(cell) && generation === cell.seenGeneration;

    const canResume = (cell: StateCell<S>): boolean => {
      if (now !== undefined && cell.latest > now) return false;
      return sameStream(cell) && generation === cell.seenGeneration;
    };

    const work = cellSlot.own(
      (existing) => !canResume(existing),
      (existing) => {
        // Fast path for backward probes or seeks when event stream did not reorder.
        if (existing !== undefined && now !== undefined && canRewind(existing, now)) {
          const cutStep = upperBoundStep(existing.steps, now);
          const cutEvent = upperBoundEvent(events, now);
          const sliced = existing.steps.slice(0, cutStep);
          const resetId = existing.resetId + 1;
          const latestAt = cutEvent > 0 ? (events[cutEvent - 1]?.at ?? -Infinity) : -Infinity;
          STEP_META.set(sliced, { resetId });
          return {
            resetId,
            current: cutStep > 0 ? (sliced[cutStep - 1]?.value ?? start) : start,
            steps: sliced,
            cursor: cutEvent,
            latest: latestAt,
            seen: events,
            seenStream: stream,
            seenGeneration: generation,
          };
        }
        const steps: Step<S>[] = [];
        const resetId = (existing?.resetId ?? 0) + 1;
        STEP_META.set(steps, { resetId });
        return {
          resetId,
          current: start,
          steps,
          cursor: 0,
          latest: -Infinity,
          seen: events,
          seenStream: stream,
          seenGeneration: generation,
        };
      },
      (existing) => {
        const clonedSteps = existing.steps.slice();
        STEP_META.set(clonedSteps, { resetId: existing.resetId });
        return {
          ...existing,
          steps: clonedSteps,
        };
      },
    );

    work.seen = events;
    work.seenStream = stream;
    work.seenGeneration = generation;

    for (let offset = work.cursor; offset < events.length; offset += 1) {
      const event = events[offset];
      if (event === undefined) break;
      if (now !== undefined && event.at > now) break;
      work.cursor = offset + 1;
      work.latest = Math.max(work.latest, event.at);
      if (!accepts(event)) continue;
      const next = rule(work.current, event);
      if (Object.is(next, work.current)) continue;
      work.current = next;
      work.steps.push({ at: event.at, value: next });
    }

    return work;
  };

  const at = (time: Time, events: Input): S => fold(time, events).current;
  const listed = (time: Time, events: Input): readonly Step<S>[] => fold(time, events).steps;
  return Object.assign(at, { start, steps: listed });
}

/** The state `rule` folds the input into, from `start`, up to the time asked. Pure in time and input: it
 * folds only new entries, and starts again when an earlier one differs or time goes back. */
export function state<S>(
  start: S,
  rule: (current: S, entry: InputEntry) => S,
  options: StateOptions = {},
): State<S> {
  return buildState(start, rule, options);
}
