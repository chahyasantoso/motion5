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
const SERIALS = new WeakMap<Events, readonly number[]>();
const SOURCE_STREAM = new WeakMap<Events, object>();

/** Stream identity token preserved across `derivedEvents` time-window slicing of a single log. */
export function sourceStreamOf(events: Events): object | undefined {
  return SOURCE_STREAM.get(events);
}

/** An `eventLog` list's count of every change, adding included, or undefined for any other list. */
export function versionOf(events: Events): number | undefined {
  return VERSION.get(events);
}

/** An `eventLog` list's count of changes other than adding at its end, or undefined for any other list. */
export function generationOf(events: Events): number | undefined {
  return GENERATION.get(events);
}

/** Monotonic insertion serials aligned with `events` when backed by an `eventLog`. */
export function eventSerialsOf(events: Events): readonly number[] | undefined {
  return SERIALS.get(events);
}

function upperBoundAt(list: Events, maxAt: number): number {
  let low = 0;
  let high = list.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((list[mid]?.at ?? 0) <= maxAt) low = mid + 1;
    else high = mid;
  }
  return low;
}

function mergeTwoOrderedSlice(
  a: Events,
  aStart: number,
  aLimit: number,
  b: Events,
  bLimit: number,
): MotionEvent[] {
  const out: MotionEvent[] = [];
  let ai = aStart;
  let bi = 0;
  while (ai < aLimit && bi < bLimit) {
    const ea = a[ai];
    const eb = b[bi];
    if (ea === undefined || eb === undefined) break;
    if (ea.at <= eb.at) {
      out.push(ea);
      ai += 1;
    } else {
      out.push(eb);
      bi += 1;
    }
  }
  while (ai < aLimit) {
    const ea = a[ai++];
    if (ea !== undefined) out.push(ea);
  }
  while (bi < bLimit) {
    const eb = b[bi++];
    if (eb !== undefined) out.push(eb);
  }
  return out;
}

function sortEvents(list: MotionEvent[]): MotionEvent[] {
  return list
    .map((event, index) => ({ event, index }))
    .sort((a, b) => a.event.at - b.event.at || a.index - b.index)
    .map((entry) => entry.event);
}

/** Cached derived view over event lists filtered by elapsed ms while keeping monotonic metadata. */
export interface DerivedEvents {
  resolve(cues: Events, page: Events, maxAt: number | undefined): Events;
}

/** Creates a cached `Events` merger/filter that avoids rebuilding unchanged windows across frames. */
export function derivedEvents(): DerivedEvents {
  const streamToken = {};
  let prevCues: Events | undefined;
  let prevPage: Events | undefined;
  let prevPageVersion: number | undefined;
  let prevPageGeneration: number | undefined;
  let prevMaxAt: number | undefined;
  let nextHiddenAt = Infinity;
  let generation = 0;
  let version = 0;
  let cached: MotionEvent[] = [];

  const nextAfter = (list: Events, limit: number): number => list[limit]?.at ?? Infinity;

  return {
    resolve(cues, page, maxAt) {
      const cuesEmpty = cues.length === 0;
      const pageEmpty = page.length === 0;
      const pageVersion = VERSION.get(page);
      const pageGen = GENERATION.get(page);

      if (cuesEmpty) {
        if (maxAt === undefined || pageEmpty) return page;
        const pageOrdered = pageVersion !== undefined;
        if (pageOrdered && (page[page.length - 1]?.at ?? 0) <= maxAt) return page;
      }
      if (pageEmpty && cuesEmpty) return cues;

      const sameInputs =
        cues === prevCues &&
        page === prevPage &&
        pageVersion === prevPageVersion &&
        pageGen === prevPageGeneration &&
        !(pageVersion === undefined && prevPage !== undefined) &&
        !(VERSION.get(cues) === undefined && cues !== prevCues);

      const samePlainPage =
        pageVersion === undefined && sameInputs && prevPage === page && prevCues === cues;
      if (
        (pageVersion !== undefined ? sameInputs : samePlainPage) &&
        maxAt !== undefined &&
        prevMaxAt !== undefined &&
        maxAt >= prevMaxAt &&
        maxAt < nextHiddenAt
      ) {
        return cached;
      }
      if (sameInputs && maxAt === undefined && prevMaxAt === undefined) {
        return cached;
      }

      const cuesLimit = maxAt === undefined ? cues.length : upperBoundAt(cues, maxAt);
      const pageLimit =
        maxAt === undefined
          ? page.length
          : pageVersion !== undefined
            ? upperBoundAt(page, maxAt)
            : page.length;

      const merged =
        cuesLimit === 0
          ? pageVersion !== undefined
            ? page.slice(0, pageLimit)
            : maxAt === undefined
              ? page.slice()
              : sortEvents(page.filter((e) => e.at <= maxAt))
          : pageLimit === 0
            ? cues.slice(0, cuesLimit)
            : pageVersion !== undefined
              ? mergeTwoOrderedSlice(cues, 0, cuesLimit, page, pageLimit)
              : sortEvents([
                  ...cues.slice(0, cuesLimit),
                  ...(maxAt === undefined ? page : page.filter((e) => e.at <= maxAt)),
                ]);

      const cuesReset = cues !== prevCues;
      const pageSwappedOrReordered =
        page !== prevPage ||
        pageGen !== prevPageGeneration ||
        (prevMaxAt !== undefined && maxAt !== undefined && maxAt < prevMaxAt);

      const keep = cached.length;
      let prefixMatch = !cuesReset && !pageSwappedOrReordered && merged.length >= keep;
      if (prefixMatch) {
        for (let i = 0; i < keep; i += 1) {
          if (merged[i] !== cached[i]) {
            prefixMatch = false;
            break;
          }
        }
      }
      if (!prefixMatch) {
        generation += 1;
      }
      version += 1;
      cached = merged;
      prevCues = cues;
      prevPage = page;
      prevPageVersion = pageVersion;
      prevPageGeneration = pageGen;
      prevMaxAt = maxAt;

      let hidden = nextAfter(cues, cuesLimit);
      if (maxAt !== undefined) {
        if (pageVersion !== undefined) {
          hidden = Math.min(hidden, nextAfter(page, pageLimit));
        } else {
          for (const e of page) {
            if (e.at > maxAt && e.at < hidden) hidden = e.at;
          }
        }
      }
      nextHiddenAt = hidden;

      if (cuesEmpty && pageVersion !== undefined) {
        const inheritedGen = pageGen ?? generation;
        const pageStream = SOURCE_STREAM.get(page);
        if (pageStream !== undefined) SOURCE_STREAM.set(cached, pageStream);
        GENERATION.set(cached, inheritedGen);
        VERSION.set(cached, version);
      } else {
        SOURCE_STREAM.set(cached, streamToken);
        GENERATION.set(cached, generation);
        VERSION.set(cached, version);
      }
      return cached;
    },
  };
}

/** A log of events that only grows. */
export function eventLog(): EventLog {
  const events: MotionEvent[] = [];
  const serials: number[] = [];
  const streamToken = {};
  let generation = 0;
  let version = 0;
  let nextSerial = 1;

  SOURCE_STREAM.set(events, streamToken);
  GENERATION.set(events, generation);
  VERSION.set(events, version);
  SERIALS.set(events, serials);

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
      const serial = nextSerial++;
      let index = events.length;
      if (index === 0 || (events[index - 1]?.at ?? -Infinity) <= event.at) {
        events.push(event);
        serials.push(serial);
      } else {
        while (index > 0 && (events[index - 1]?.at ?? 0) > event.at) index -= 1;
        changed();
        events.splice(index, 0, event);
        serials.splice(index, 0, serial);
      }
      bumped();
    },
    clear() {
      changed();
      events.length = 0;
      serials.length = 0;
      bumped();
    },
  };
}
