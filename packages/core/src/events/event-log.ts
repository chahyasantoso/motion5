import type { Events, MotionEvent } from "./event-list";

/** A log that only grows: each event goes in at its time, after any at the same ms, and none is replaced. */
export interface EventLog {
  readonly events: Events;
  /** Puts `event` in at its time; an event earlier than the last one moves the later ones along. */
  add(event: MotionEvent): void;
  /** Empties the log. */
  clear(): void;
}

const GENERATION = new WeakMap<Events, number>();
const VERSION = new WeakMap<Events, number>();

/** An `eventLog` list's count of every change, adding included, or undefined for any other list. */
export function versionOf(events: Events): number | undefined {
  return VERSION.get(events);
}

/** An `eventLog` list's count of changes other than adding at its end, or undefined for any other list. */
export function generationOf(events: Events): number | undefined {
  return GENERATION.get(events);
}

/** A log of events that only grows, so a state reading it again folds only the events added at its end. */
export function eventLog(): EventLog {
  const events: MotionEvent[] = [];
  let generation = 0;
  let version = 0;
  GENERATION.set(events, generation);
  VERSION.set(events, version);
  const bumped = (): void => {
    version += 1;
    VERSION.set(events, version);
  };
  const changed = (): void => {
    generation += 1;
    GENERATION.set(events, generation);
  };
  return {
    events,
    add(event) {
      let index = events.length;
      while (index > 0 && (events[index - 1]?.at ?? 0) > event.at) index -= 1;
      if (index < events.length) changed();
      events.splice(index, 0, event);
      bumped();
    },
    clear() {
      changed();
      events.length = 0;
      bumped();
    },
  };
}
