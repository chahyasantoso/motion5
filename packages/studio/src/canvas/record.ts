import { isMotionEvent, type Events, type MotionEvent } from "@gerak/core";

const TAKE = /^take-(\d+)$/;

/** The next free `take-<n>`: one more than the largest `take-<n>` among `names`. */
export function nextTakeName(names: readonly string[]): string {
  let largest = 0;
  for (const name of names) {
    const found = TAKE.exec(name);
    if (found?.[1] !== undefined) largest = Math.max(largest, Number(found[1]));
  }
  return `take-${largest + 1}`;
}

/** What a log holds past its first `start` entries. */
export function sliceSince(log: readonly unknown[], start: number): readonly unknown[] {
  return log.slice(Math.max(0, start));
}

/** The motion events of `entries`, in order; anything else is dropped. */
export function onlyEvents(entries: readonly unknown[]): Events {
  return entries.filter(isMotionEvent);
}

/** The events a recording that started at log length `start` captured. */
export function recordingOf(log: readonly unknown[], start: number): Events {
  return onlyEvents(sliceSince(log, start));
}

/** A tick's tooltip: `<name>[:target] @<at>ms`. */
export function eventLabel(event: MotionEvent): string {
  const where = event.target === undefined ? "" : `:${event.target}`;
  return `${event.name}${where} @${Math.round(event.at)}ms`;
}
