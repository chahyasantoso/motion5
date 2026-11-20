import type { Events, MotionEvent } from "./event-list";

/** A log that only grows: each event goes in at its time, after any at the same ms, and none is replaced. */
export interface EventLog {
  readonly events: Events;
  /** Puts `event` in at its time; an event earlier than the last one moves the later ones along. */
  add(event: MotionEvent): void;
  /** Empties the log. */
  clear(): void;
}

const GROWING = new WeakSet<Events>();

/** Whether `events` is an `eventLog`'s list, which no event is ever replaced in. */
export function isGrowingLog(events: Events): boolean {
  return GROWING.has(events);
}

/** A log of events that only grows, so a state reading it again checks only its last folded event. */
export function eventLog(): EventLog {
  const events: MotionEvent[] = [];
  GROWING.add(events);
  return {
    events,
    add(event) {
      let index = events.length;
      while (index > 0 && (events[index - 1]?.at ?? 0) > event.at) index -= 1;
      events.splice(index, 0, event);
    },
    clear() {
      events.length = 0;
    },
  };
}
