import { unreachable } from "../utility/unreachable";
import type { Contract, InputSpec, TargetOf } from "./contract";
import type { Input, InputEntry } from "./event-list";

/** A log that grows as values change or triggers fire: typed writes go through a `Contract`. */
export interface InputLog {
  readonly input: Input;
  /** Records a `"value"` entry only when `value` differs from the latest recorded for `name` and `target`. */
  set<
    V extends Record<string, InputSpec>,
    T extends Record<string, InputSpec>,
    K extends keyof V & string,
  >(
    at: number,
    contract: Contract<V, T>,
    name: K,
    value: number,
    target?: TargetOf<V[K]> | undefined,
  ): void;
  /** Records a `"trigger"` entry for `name` and `target`; `value` defaults to 1. */
  trigger<
    V extends Record<string, InputSpec>,
    T extends Record<string, InputSpec>,
    K extends keyof T & string,
  >(
    at: number,
    contract: Contract<V, T>,
    name: K,
    value?: number,
    target?: TargetOf<T[K]> | undefined,
  ): void;
  /** Empties the log. */
  clear(): void;
}

/** Metadata attached to an input list created by `inputLog` or `derivedInput`. */
interface InputRecord {
  readonly version: number;
  readonly generation: number;
  readonly serials: readonly number[] | undefined;
  readonly sourceStream: object | undefined;
}

const RECORDS = new WeakMap<Input, InputRecord>();
const DEFAULT_RECORD: InputRecord = Object.freeze({
  version: 0,
  generation: 0,
  serials: undefined,
  sourceStream: undefined,
});

function recordOf(input: Input): InputRecord {
  return RECORDS.get(input) ?? DEFAULT_RECORD;
}

/** Stream identity token preserved across `derivedInput` time-window slicing of a single log. */
export function sourceStreamOf(input: Input): object | undefined {
  return recordOf(input).sourceStream;
}

/** An `inputLog` list's count of every change, adding included, or 0 for a plain array. */
export function versionOf(input: Input): number {
  return recordOf(input).version;
}

/** An `inputLog` list's count of changes other than adding at its end, or 0 for a plain array. */
export function generationOf(input: Input): number {
  return recordOf(input).generation;
}

/** Monotonic insertion serials aligned with `input` when backed by an `inputLog`. */
export function inputSerialsOf(input: Input): readonly number[] | undefined {
  return recordOf(input).serials;
}

/** First index in `list` whose entry has `at > maxAt`. */
export function upperBoundAt(list: Input, maxAt: number): number {
  let low = 0;
  let high = list.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if ((list[mid]?.at ?? 0) <= maxAt) low = mid + 1;
    else high = mid;
  }
  return low;
}

function cueSerial(index: number): number {
  return -(1 / (index + 1));
}

interface OrderedSlice {
  readonly entries: InputEntry[];
  readonly serials: number[];
}

function mergeTwoOrderedSlice(
  cues: Input,
  cuesLimit: number,
  page: Input,
  pageLimit: number,
  pageSerials: readonly number[] | undefined,
): OrderedSlice {
  const entries: InputEntry[] = [];
  const serials: number[] = [];
  let ai = 0;
  let bi = 0;
  while (ai < cuesLimit && bi < pageLimit) {
    const ea = cues[ai];
    const eb = page[bi];
    if (ea === undefined || eb === undefined) break;
    if (ea.at <= eb.at) {
      entries.push(ea);
      serials.push(cueSerial(ai));
      ai += 1;
    } else {
      entries.push(eb);
      serials.push(pageSerials?.[bi] ?? bi + 1);
      bi += 1;
    }
  }
  while (ai < cuesLimit) {
    const ea = cues[ai];
    if (ea !== undefined) {
      entries.push(ea);
      serials.push(cueSerial(ai));
    }
    ai += 1;
  }
  while (bi < pageLimit) {
    const eb = page[bi];
    if (eb !== undefined) {
      entries.push(eb);
      serials.push(pageSerials?.[bi] ?? bi + 1);
    }
    bi += 1;
  }
  return { entries, serials };
}

function sortWithSerials(
  items: { readonly entry: InputEntry; readonly serial: number }[],
): OrderedSlice {
  const sorted = items
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => a.entry.at - b.entry.at || a.index - b.index);
  return {
    entries: sorted.map((item) => item.entry),
    serials: sorted.map((item) => item.serial),
  };
}

/** Cached derived view over input lists filtered by elapsed ms while keeping monotonic metadata. */
export interface DerivedInput {
  resolve(cues: Input, page: Input, maxAt: number | undefined): Input;
}

/** Creates a cached `Input` merger/filter that avoids rebuilding unchanged windows across frames. */
export function derivedInput(): DerivedInput {
  const streamToken = {};
  let prevCues: Input | undefined;
  let prevCuesVersion: number | undefined;
  let prevCuesGeneration: number | undefined;
  let prevPage: Input | undefined;
  let prevPageVersion: number | undefined;
  let prevPageGeneration: number | undefined;
  let prevMaxAt: number | undefined;
  let nextHiddenAt = Infinity;
  let generation = 0;
  let version = 0;
  let cached: InputEntry[] = [];

  const nextAfter = (list: Input, limit: number): number => list[limit]?.at ?? Infinity;

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

      const slicePageWithSerials = (): OrderedSlice => {
        if (pageOrdered) {
          return {
            entries: page.slice(0, pageLimit),
            serials:
              pageRecord.serials?.slice(0, pageLimit) ??
              Array.from({ length: pageLimit }, (_, i) => i + 1),
          };
        }
        if (maxAt === undefined) {
          return {
            entries: page.slice(),
            serials:
              pageRecord.serials?.slice() ?? Array.from({ length: page.length }, (_, i) => i + 1),
          };
        }
        const kept: { readonly entry: InputEntry; readonly serial: number }[] = [];
        for (let i = 0; i < page.length; i += 1) {
          const entry = page[i];
          if (entry !== undefined && entry.at <= maxAt) {
            kept.push({ entry, serial: pageRecord.serials?.[i] ?? i + 1 });
          }
        }
        return sortWithSerials(kept);
      };

      const resolved: OrderedSlice =
        cuesLimit === 0
          ? slicePageWithSerials()
          : pageLimit === 0
            ? {
                entries: cues.slice(0, cuesLimit),
                serials: Array.from({ length: cuesLimit }, (_, i) => cueSerial(i)),
              }
            : pageOrdered
              ? mergeTwoOrderedSlice(cues, cuesLimit, page, pageLimit, pageRecord.serials)
              : sortWithSerials([
                  ...cues.slice(0, cuesLimit).map((entry, i) => ({ entry, serial: cueSerial(i) })),
                  ...page.flatMap((entry, i) =>
                    maxAt === undefined || entry.at <= maxAt
                      ? [{ entry, serial: pageRecord.serials?.[i] ?? i + 1 }]
                      : [],
                  ),
                ]);
      const merged = resolved.entries;

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
          serials: resolved.serials,
          sourceStream: pageRecord.sourceStream,
        });
      } else {
        RECORDS.set(cached, {
          version,
          generation,
          serials: resolved.serials,
          sourceStream: streamToken,
        });
      }
      return cached;
    },
  };
}

/** Cached view shifting an input list by `fromMs` while extending in place on appends. */
export interface ShiftedInput {
  resolve(events: Input, fromMs: number): Input;
}

/** Creates a cached `Input` shifter for a shot start, extending in place on appends and preserving serials. */
export function shiftedInput(): ShiftedInput {
  const streamToken = {};
  let prevEvents: Input | undefined;
  let prevVersion: number | undefined;
  let prevGeneration: number | undefined;
  let prevFromMs: number | undefined;
  let prevLength = 0;
  let version = 0;
  let generation = 0;
  let moved: InputEntry[] = [];
  let serials: number[] = [];

  return {
    resolve(events, fromMs) {
      const rec = recordOf(events);
      const sameSource =
        events === prevEvents ||
        (rec.sourceStream !== undefined &&
          prevEvents !== undefined &&
          rec.sourceStream === recordOf(prevEvents).sourceStream);

      if (
        events === prevEvents &&
        rec.version === prevVersion &&
        rec.generation === prevGeneration &&
        fromMs === prevFromMs
      ) {
        return moved;
      }

      const canAppend =
        sameSource &&
        rec.sourceStream !== undefined &&
        rec.generation === prevGeneration &&
        fromMs === prevFromMs &&
        events.length >= prevLength;

      if (canAppend) {
        let added = false;
        for (let i = prevLength; i < events.length; i += 1) {
          const entry = events[i];
          if (entry === undefined || entry.at < fromMs) continue;
          moved.push({ ...entry, at: entry.at - fromMs });
          serials.push(rec.serials?.[i] ?? i + 1);
          added = true;
        }
        prevEvents = events;
        prevVersion = rec.version;
        prevLength = events.length;
        if (added) {
          version += 1;
          RECORDS.set(moved, {
            version,
            generation,
            serials,
            sourceStream: streamToken,
          });
        }
        return moved;
      }

      generation += 1;
      version += 1;
      moved = [];
      serials = [];
      for (let i = 0; i < events.length; i += 1) {
        const entry = events[i];
        if (entry === undefined || entry.at < fromMs) continue;
        moved.push({ ...entry, at: entry.at - fromMs });
        serials.push(rec.serials?.[i] ?? i + 1);
      }
      prevEvents = events;
      prevVersion = rec.version;
      prevGeneration = rec.generation;
      prevFromMs = fromMs;
      prevLength = events.length;
      RECORDS.set(moved, {
        version,
        generation,
        serials,
        sourceStream: streamToken,
      });
      return moved;
    },
  };
}

/** A log of input entries; when given `windowMs`, older entries drop in batches past twice the window except each name-and-target's latest. */
export function inputLog(options?: { readonly windowMs?: number }): InputLog {
  const windowMs = options?.windowMs;
  if (windowMs !== undefined && (!Number.isFinite(windowMs) || windowMs < 0)) {
    throw new RangeError(`inputLog: windowMs must be a finite number 0 or more, not ${windowMs}.`);
  }
  const input: InputEntry[] = [];
  const serials: number[] = [];
  const streamToken = {};
  const latestByName = new Map<
    string,
    Map<string | undefined, { readonly at: number; readonly serial: number }>
  >();
  const latestValueByName = new Map<
    string,
    Map<string | undefined, { readonly at: number; readonly value: number }>
  >();
  let oldestDroppableAt = Infinity;
  let generation = 0;
  let version = 0;
  let nextSerial = 1;

  const syncRecord = (): void => {
    RECORDS.set(input, {
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

  const insert = (entry: InputEntry): void => {
    const serial = nextSerial++;
    let index = input.length;
    if (index === 0 || (input[index - 1]?.at ?? -Infinity) <= entry.at) {
      input.push(entry);
      serials.push(serial);
    } else {
      while (index > 0 && (input[index - 1]?.at ?? 0) > entry.at) index -= 1;
      changed();
      input.splice(index, 0, entry);
      serials.splice(index, 0, serial);
    }
    switch (entry.kind) {
      case "value": {
        let byTarget = latestValueByName.get(entry.name);
        if (byTarget === undefined) {
          byTarget = new Map();
          latestValueByName.set(entry.name, byTarget);
        }
        const prev = byTarget.get(entry.target);
        if (prev === undefined || entry.at >= prev.at) {
          byTarget.set(entry.target, { at: entry.at, value: entry.value });
        }
        break;
      }
      case "trigger":
        break;
      default:
        return unreachable(entry.kind);
    }
    if (windowMs !== undefined) {
      let byTarget = latestByName.get(entry.name);
      if (byTarget === undefined) {
        byTarget = new Map();
        latestByName.set(entry.name, byTarget);
      }
      const prev = byTarget.get(entry.target);
      if (prev === undefined || entry.at >= prev.at) {
        byTarget.set(entry.target, { at: entry.at, serial });
        if (prev !== undefined && prev.at < oldestDroppableAt) oldestDroppableAt = prev.at;
      } else if (entry.at < oldestDroppableAt) {
        oldestDroppableAt = entry.at;
      }
      const newestAt = input[input.length - 1]?.at ?? entry.at;
      if (oldestDroppableAt < newestAt - 2 * windowMs) {
        const cutoff = newestAt - windowMs;
        let write = 0;
        let nextOldest = Infinity;
        let dropped = false;
        for (let i = 0; i < input.length; i += 1) {
          const item = input[i];
          const itemSerial = serials[i];
          if (item === undefined || itemSerial === undefined) continue;
          const isLatest = latestByName.get(item.name)?.get(item.target)?.serial === itemSerial;
          if (item.at < cutoff && !isLatest) {
            dropped = true;
            continue;
          }
          if (!isLatest && item.at < nextOldest) nextOldest = item.at;
          if (write !== i) {
            input[write] = item;
            serials[write] = itemSerial;
          }
          write += 1;
        }
        input.length = write;
        serials.length = write;
        oldestDroppableAt = nextOldest;
        if (dropped) generation += 1;
      }
    }
    bumped();
  };

  return {
    input,
    set(at, _contract, name, value, target) {
      if (!Number.isFinite(value))
        throw new RangeError(`set "${name}": the value must be a finite number, not ${value}.`);
      const prev = latestValueByName.get(name)?.get(target);
      if (prev !== undefined && (Object.is(prev.value, value) || prev.value === value)) {
        return;
      }
      const entry: InputEntry =
        target === undefined
          ? { kind: "value", name, at, value }
          : { kind: "value", name, at, value, target };
      insert(entry);
    },
    trigger(at, _contract, name, value = 1, target) {
      if (!Number.isFinite(value))
        throw new RangeError(`trigger "${name}": the value must be a finite number, not ${value}.`);
      const entry: InputEntry =
        target === undefined
          ? { kind: "trigger", name, at, value }
          : { kind: "trigger", name, at, value, target };
      insert(entry);
    },
    clear() {
      changed();
      input.length = 0;
      serials.length = 0;
      latestByName.clear();
      latestValueByName.clear();
      oldestDroppableAt = Infinity;
      bumped();
    },
  };
}
