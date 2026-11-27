import type { Events, MotionEvent } from "./event-list";

/** A log that only grows: each event goes in at its time, after any at the same ms, and none is replaced. */
export interface EventLog {
  readonly events: Events;
  /** Puts `event` in at its time; an event earlier than the last one moves the later ones along. */
  add(event: MotionEvent): void;
  /** Empties the log. */
  clear(): void;
}

/** Metadata attached to an event list created by `eventLog` or `derivedEvents`. */
interface EventRecord {
  readonly version: number;
  readonly generation: number;
  readonly serials: readonly number[] | undefined;
  readonly sourceStream: object | undefined;
}

const RECORDS = new WeakMap<Events, EventRecord>();
const DEFAULT_RECORD: EventRecord = Object.freeze({
  version: 0,
  generation: 0,
  serials: undefined,
  sourceStream: undefined,
});

function recordOf(events: Events): EventRecord {
  return RECORDS.get(events) ?? DEFAULT_RECORD;
}

/** Stream identity token preserved across `derivedEvents` time-window slicing of a single log. */
export function sourceStreamOf(events: Events): object | undefined {
  return recordOf(events).sourceStream;
}

/** An `eventLog` list's count of every change, adding included, or 0 for a plain array. */
export function versionOf(events: Events): number {
  return recordOf(events).version;
}

/** An `eventLog` list's count of changes other than adding at its end, or 0 for a plain array. */
export function generationOf(events: Events): number {
  return recordOf(events).generation;
}

/** Monotonic insertion serials aligned with `events` when backed by an `eventLog`. */
export function eventSerialsOf(events: Events): readonly number[] | undefined {
  return recordOf(events).serials;
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
  let prevCuesVersion: number | undefined;
  let prevCuesGeneration: number | undefined;
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
      const cuesRecord = recordOf(cues);
      const pageRecord = recordOf(page);
      const pageOrdered = pageRecord.sourceStream !== undefined;

      if (cuesEmpty) {
        if (maxAt === undefined || pageEmpty) return page;
        if (pageOrdered && (page[page.length - 1]?.at ?? 0) <= maxAt) return page;
      }
      if (pageEmpty && cuesEmpty) return cues;

      const sameInputs =
        cues === prevCues &&
        cuesRecord.version === prevCuesVersion &&
        cuesRecord.generation === prevCuesGeneration &&
        page === prevPage &&
        pageRecord.version === prevPageVersion &&
        pageRecord.generation === prevPageGeneration;

      if (
        sameInputs &&
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
        maxAt === undefined ? page.length : pageOrdered ? upperBoundAt(page, maxAt) : page.length;

      const merged =
        cuesLimit === 0
          ? pageOrdered
            ? page.slice(0, pageLimit)
            : maxAt === undefined
              ? page.slice()
              : sortEvents(page.filter((e) => e.at <= maxAt))
          : pageLimit === 0
            ? cues.slice(0, cuesLimit)
            : pageOrdered
              ? mergeTwoOrderedSlice(cues, 0, cuesLimit, page, pageLimit)
              : sortEvents([
                  ...cues.slice(0, cuesLimit),
                  ...(maxAt === undefined ? page : page.filter((e) => e.at <= maxAt)),
                ]);

      const cuesReset = cues !== prevCues || cuesRecord.generation !== prevCuesGeneration;
      const pageSwappedOrReordered =
        page !== prevPage ||
        pageRecord.generation !== prevPageGeneration ||
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
      prevCuesVersion = cuesRecord.version;
      prevCuesGeneration = cuesRecord.generation;
      prevPage = page;
      prevPageVersion = pageRecord.version;
      prevPageGeneration = pageRecord.generation;
      prevMaxAt = maxAt;

      let hidden = nextAfter(cues, cuesLimit);
      if (maxAt !== undefined) {
        if (pageOrdered) {
          hidden = Math.min(hidden, nextAfter(page, pageLimit));
        } else {
          for (const e of page) {
            if (e.at > maxAt && e.at < hidden) hidden = e.at;
          }
        }
      }
      nextHiddenAt = hidden;

      if (cuesEmpty && pageOrdered) {
        RECORDS.set(cached, {
          version,
          generation: pageRecord.generation,
          serials: pageRecord.serials?.slice(0, pageLimit),
          sourceStream: pageRecord.sourceStream,
        });
      } else {
        RECORDS.set(cached, {
          version,
          generation,
          serials: undefined,
          sourceStream: streamToken,
        });
      }
      return cached;
    },
  };
}

/** A log of events; when given `windowMs`, older entries drop in batches past twice the window except each name-and-target's latest. */
export function eventLog(options?: { readonly windowMs?: number }): EventLog {
  const windowMs = options?.windowMs;
  if (windowMs !== undefined && (!Number.isFinite(windowMs) || windowMs < 0)) {
    throw new RangeError(`eventLog: windowMs must be a finite number 0 or more, not ${windowMs}.`);
  }
  const events: MotionEvent[] = [];
  const serials: number[] = [];
  const streamToken = {};
  const latestByName = new Map<
    string,
    Map<string | undefined, { readonly at: number; readonly serial: number }>
  >();
  let oldestDroppableAt = Infinity;
  let generation = 0;
  let version = 0;
  let nextSerial = 1;

  const syncRecord = (): void => {
    RECORDS.set(events, {
      version,
      generation,
      serials,
      sourceStream: streamToken,
    });
  };
  syncRecord();

  const bumped = (): void => {
    version += 1;
    syncRecord();
  };
  const changed = (): void => {
    generation += 1;
    syncRecord();
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
      if (windowMs !== undefined) {
        let byTarget = latestByName.get(event.name);
        if (byTarget === undefined) {
          byTarget = new Map();
          latestByName.set(event.name, byTarget);
        }
        const prev = byTarget.get(event.target);
        if (prev === undefined || event.at >= prev.at) {
          byTarget.set(event.target, { at: event.at, serial });
          if (prev !== undefined && prev.at < oldestDroppableAt) oldestDroppableAt = prev.at;
        } else if (event.at < oldestDroppableAt) {
          oldestDroppableAt = event.at;
        }
        const newestAt = events[events.length - 1]?.at ?? event.at;
        if (oldestDroppableAt < newestAt - 2 * windowMs) {
          const cutoff = newestAt - windowMs;
          let write = 0;
          let nextOldest = Infinity;
          let dropped = false;
          for (let i = 0; i < events.length; i += 1) {
            const entry = events[i];
            const entrySerial = serials[i];
            if (entry === undefined || entrySerial === undefined) continue;
            const isLatest =
              latestByName.get(entry.name)?.get(entry.target)?.serial === entrySerial;
            if (entry.at < cutoff && !isLatest) {
              dropped = true;
              continue;
            }
            if (!isLatest && entry.at < nextOldest) nextOldest = entry.at;
            if (write !== i) {
              events[write] = entry;
              serials[write] = entrySerial;
            }
            write += 1;
          }
          events.length = write;
          serials.length = write;
          oldestDroppableAt = nextOldest;
          if (dropped) generation += 1;
        }
      }
      bumped();
    },
    clear() {
      changed();
      events.length = 0;
      serials.length = 0;
      latestByName.clear();
      oldestDroppableAt = Infinity;
      bumped();
    },
  };
}
