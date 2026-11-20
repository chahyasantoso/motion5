import { elapsedOf, type Time } from "../time/time";
import type { Signal } from "../time/shapes";
import type { Events, MotionEvent } from "../events/event-list";
import { generationOf } from "../events/event-log";

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

/** The state `rule` folds the events into, from `start`, up to the time asked. Pure in time and events: it
 * folds only new events, and starts again when an earlier one differs or time goes back. */
export function state<S>(
  start: S,
  rule: (current: S, event: MotionEvent) => S,
  options: StateOptions = {},
): State<S> {
  const { target } = options;
  const accepts = (event: MotionEvent): boolean => {
    if (target === undefined) return true;
    if (typeof target === "string") return event.target === target;
    return event.target !== undefined && target.includes(event.target);
  };
  let current = start;
  let steps: Step<S>[] = [];
  let taken: MotionEvent[] = [];
  let latest = -Infinity;
  let seen: Events | undefined;
  let seenGeneration: number | undefined;
  const fold = (time: Time, events: Events): void => {
    const now = elapsedOf(time.clock);
    let resumes = (now === undefined || latest <= now) && events.length >= taken.length;
    // A growing log counts every change other than adding at its end, so an unchanged count means only that.
    const generation = generationOf(events);
    if (!(resumes && events === seen && generation !== undefined && generation === seenGeneration))
      for (let index = 0; resumes && index < taken.length; index += 1)
        if (events[index] !== taken[index]) resumes = false;
    seen = events;
    seenGeneration = generation;
    if (!resumes) {
      current = start;
      steps = [];
      taken = [];
      latest = -Infinity;
    }
    for (let index = taken.length; index < events.length; index += 1) {
      const event = events[index];
      if (event === undefined) break;
      if (now !== undefined && event.at > now) break;
      taken.push(event);
      latest = Math.max(latest, event.at);
      if (!accepts(event)) continue;
      const next = rule(current, event);
      if (Object.is(next, current)) continue;
      current = next;
      steps.push({ at: event.at, value: next });
    }
  };
  const at = (time: Time, events: Events): S => {
    fold(time, events);
    return current;
  };
  const listed = (time: Time, events: Events): readonly Step<S>[] => {
    fold(time, events);
    return steps;
  };
  return Object.assign(at, { start, steps: listed });
}
