import { unreachable } from "../utility/unreachable";
import type { Events, MotionEvent } from "./event-list";

const CONTINUOUS_CHANNELS = new Set(["scroll", "pointer-x", "pointer-y"]);

/** How an event log retains or compacts historical events over time. */
export type RetentionPolicy =
  | { readonly kind: "all" }
  | { readonly kind: "live"; readonly windowMs?: number }
  | { readonly kind: "window"; readonly windowMs: number; readonly maxCheckpoints?: number };

/** Settings of `eventLog`: retention policy and an optional synchronous event stream callback. */
export interface EventLogOptions {
  readonly retention?: RetentionPolicy;
  readonly onEvent?: (event: MotionEvent) => void;
}

/** A log that only grows: each event goes in at its time, after any at the same ms, and none is replaced. */
export interface EventLog {
  readonly events: Events;
  /** Puts `event` in at its time; an event earlier than the last one moves the later ones along. */
  add(event: MotionEvent): void;
  /** Evicts retained events strictly older than `beforeMs`, updating continuous channel baselines. */
  compact(beforeMs: number): number;
  /** Empties the log. */
  clear(): void;
}

const GENERATION = new WeakMap<Events, number>();
const VERSION = new WeakMap<Events, number>();
const BASE_INDEX = new WeakMap<Events, number>();
const BASELINE = new WeakMap<Events, ReadonlyMap<string, number>>();
const COMPACTED_BEFORE = new WeakMap<Events, number>();
const SERIALS = new WeakMap<Events, readonly number[]>();
const COMPACTORS = new WeakMap<Events, (beforeMs: number) => number>();
const EVENT_LISTENERS = new WeakMap<Events, Set<(event: MotionEvent) => void>>();
const SOURCE_STREAM = new WeakMap<Events, object>();

/** Stream identity token preserved across `derivedEvents` time-window slicing of a single log. */
export function sourceStreamOf(events: Events): object | undefined {
  return SOURCE_STREAM.get(events);
}

/** Subscribes to every synchronous `add(event)` on the log backing `events`, returning an unsubscribe handle. */
export function attachOnEvent(
  events: Events,
  listener: (event: MotionEvent) => void,
): (() => void) | undefined {
  const listeners = EVENT_LISTENERS.get(events);
  if (listeners === undefined) return undefined;
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** An `eventLog` list's count of every change, adding included, or undefined for any other list. */
export function versionOf(events: Events): number | undefined {
  return VERSION.get(events);
}

/** An `eventLog` list's count of changes other than adding at its end, or undefined for any other list. */
export function generationOf(events: Events): number | undefined {
  return GENERATION.get(events);
}

/** Logical count of prefix events compacted away from `events`, or undefined for non-log lists. */
export function baseIndexOf(events: Events): number | undefined {
  return BASE_INDEX.get(events);
}

/** Latest sample values per continuous input channel preserved across prefix compaction. */
export function baselineOf(events: Events): ReadonlyMap<string, number> | undefined {
  return BASELINE.get(events);
}

/** Earliest ms retained in `events` after compaction (`-Infinity` if never compacted), or undefined for non-logs. */
export function compactedBeforeOf(events: Events): number | undefined {
  return COMPACTED_BEFORE.get(events);
}

/** Monotonic insertion serials aligned with `events` when backed by an `eventLog`. */
export function eventSerialsOf(events: Events): readonly number[] | undefined {
  return SERIALS.get(events);
}

/** Compacts the backing `EventLog` of `events` strictly before `beforeMs`, returning removed count. */
export function compactEvents(events: Events, beforeMs: number): number {
  const fn = COMPACTORS.get(events);
  return fn === undefined ? 0 : fn(beforeMs);
}

function recordBaseline(baseline: Map<string, number>, event: MotionEvent): void {
  if (!CONTINUOUS_CHANNELS.has(event.name)) return;
  if (typeof event.value === "number" && Number.isFinite(event.value)) {
    baseline.set(event.name, event.value);
  }
}

function lowerBoundAt(list: Events, minAt: number): number {
  let low = 0;
  let high = list.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((list[mid]?.at ?? 0) < minAt) low = mid + 1;
    else high = mid;
  }
  return low;
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
  let prevPageBase: number | undefined;
  let prevPageCompacted: number | undefined;
  let prevMaxAt: number | undefined;
  let nextHiddenAt = Infinity;
  let generation = 0;
  let version = 0;
  let mergedBase = 0;
  let cached: MotionEvent[] = [];

  const nextAfter = (list: Events, limit: number): number => list[limit]?.at ?? Infinity;

  return {
    resolve(cues, page, maxAt) {
      const cuesEmpty = cues.length === 0;
      const pageEmpty = page.length === 0;
      const pageVersion = VERSION.get(page);
      const pageGen = GENERATION.get(page);
      const pageBase = BASE_INDEX.get(page) ?? 0;
      const pageCompacted = COMPACTED_BEFORE.get(page);

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
        pageBase === prevPageBase &&
        pageCompacted === prevPageCompacted &&
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

      const effectiveCompacted =
        pageVersion !== undefined && pageCompacted !== undefined && Number.isFinite(pageCompacted)
          ? pageCompacted
          : -Infinity;
      const cuesStart = effectiveCompacted > -Infinity ? lowerBoundAt(cues, effectiveCompacted) : 0;
      const cuesLimit = Math.max(
        cuesStart,
        maxAt === undefined ? cues.length : upperBoundAt(cues, maxAt),
      );
      const pageLimit =
        maxAt === undefined
          ? page.length
          : pageVersion !== undefined
            ? upperBoundAt(page, maxAt)
            : page.length;

      const merged =
        cuesLimit <= cuesStart
          ? pageVersion !== undefined
            ? page.slice(0, pageLimit)
            : maxAt === undefined
              ? page.slice()
              : sortEvents(page.filter((e) => e.at <= maxAt))
          : pageLimit === 0
            ? cues.slice(cuesStart, cuesLimit)
            : pageVersion !== undefined
              ? mergeTwoOrderedSlice(cues, cuesStart, cuesLimit, page, pageLimit)
              : sortEvents([
                  ...cues.slice(cuesStart, cuesLimit),
                  ...(maxAt === undefined ? page : page.filter((e) => e.at <= maxAt)),
                ]);

      const cuesReset = cues !== prevCues;
      const pageSwappedOrReordered =
        page !== prevPage ||
        pageGen !== prevPageGeneration ||
        (prevMaxAt !== undefined && maxAt !== undefined && maxAt < prevMaxAt);

      let drop = 0;
      while (drop < cached.length && (cached[drop]?.at ?? Infinity) < effectiveCompacted) {
        drop += 1;
      }
      const keep = cached.length - drop;
      let prefixMatch = !cuesReset && !pageSwappedOrReordered && merged.length >= keep;
      if (prefixMatch) {
        for (let i = 0; i < keep; i += 1) {
          if (merged[i] !== cached[drop + i]) {
            prefixMatch = false;
            break;
          }
        }
      }
      if (prefixMatch) {
        mergedBase += drop;
      } else {
        generation += 1;
        mergedBase = 0;
      }
      version += 1;
      cached = merged;
      prevCues = cues;
      prevPage = page;
      prevPageVersion = pageVersion;
      prevPageGeneration = pageGen;
      prevPageBase = pageBase;
      prevPageCompacted = pageCompacted;
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
        BASE_INDEX.set(cached, pageBase);
      } else {
        SOURCE_STREAM.set(cached, streamToken);
        GENERATION.set(cached, generation);
        VERSION.set(cached, version);
        BASE_INDEX.set(cached, mergedBase);
      }
      const pageBaseline = BASELINE.get(page);
      if (pageBaseline !== undefined) BASELINE.set(cached, pageBaseline);
      if (pageCompacted !== undefined) COMPACTED_BEFORE.set(cached, pageCompacted);
      return cached;
    },
  };
}

/** A log of events that only grows, supporting optional retention compaction and synchronous streaming. */
export function eventLog(options: EventLogOptions = {}): EventLog {
  const retention: RetentionPolicy = options.retention ?? { kind: "all" };
  const onEvent = options.onEvent;
  const events: MotionEvent[] = [];
  const serials: number[] = [];
  const baseline = new Map<string, number>();
  const listeners = new Set<(event: MotionEvent) => void>();
  const streamToken = {};
  let generation = 0;
  let version = 0;
  let baseIndex = 0;
  let compactedBefore = -Infinity;
  let nextSerial = 1;

  const syncMeta = (): void => {
    SOURCE_STREAM.set(events, streamToken);
    GENERATION.set(events, generation);
    VERSION.set(events, version);
    BASE_INDEX.set(events, baseIndex);
    BASELINE.set(events, baseline);
    COMPACTED_BEFORE.set(events, compactedBefore);
    SERIALS.set(events, serials);
    EVENT_LISTENERS.set(events, listeners);
  };
  syncMeta();

  const bumped = (): void => {
    version += 1;
    VERSION.set(events, version);
  };
  const changed = (): void => {
    generation += 1;
    GENERATION.set(events, generation);
  };

  const compact = (beforeMs: number): number => {
    if (!Number.isFinite(beforeMs)) return 0;
    if (beforeMs > compactedBefore) {
      compactedBefore = beforeMs;
      COMPACTED_BEFORE.set(events, compactedBefore);
    }
    if (events.length === 0 || (events[0]?.at ?? Infinity) >= compactedBefore) return 0;
    let cut = 0;
    while (cut < events.length) {
      const event = events[cut];
      if (event === undefined || event.at >= compactedBefore) break;
      recordBaseline(baseline, event);
      cut += 1;
    }
    if (cut === 0) return 0;
    if (cut === 1) {
      events.shift();
      serials.shift();
    } else {
      events.splice(0, cut);
      serials.splice(0, cut);
    }
    baseIndex += cut;
    BASE_INDEX.set(events, baseIndex);
    return cut;
  };
  COMPACTORS.set(events, compact);

  return {
    events,
    compact,
    add(event) {
      onEvent?.(event);
      for (const listener of [...listeners]) listener(event);
      if (event.at < compactedBefore) return;
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
      switch (retention.kind) {
        case "all":
        case "window":
          break;
        case "live": {
          const windowMs = retention.windowMs ?? 4000;
          const latestAt = events[events.length - 1]?.at ?? event.at;
          const cutoff = latestAt - windowMs;
          if (cutoff > -Infinity && (events[0]?.at ?? Infinity) < cutoff) {
            compact(cutoff);
          }
          break;
        }
        default:
          unreachable(retention);
      }
    },
    clear() {
      changed();
      events.length = 0;
      serials.length = 0;
      baseIndex = 0;
      compactedBefore = -Infinity;
      baseline.clear();
      BASE_INDEX.set(events, baseIndex);
      COMPACTED_BEFORE.set(events, compactedBefore);
      bumped();
    },
  };
}
