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
  /** Records an entry with no contract. */
  add(entry: InputEntry): void;
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

function upperBoundAt(list: Input, maxAt: number): number {
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
  a: Input,
  aStart: number,
  aLimit: number,
  b: Input,
  bLimit: number,
): InputEntry[] {
  const out: InputEntry[] = [];
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

function sortEntries(list: InputEntry[]): InputEntry[] {
  return list
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => a.entry.at - b.entry.at || a.index - b.index)
    .map((item) => item.entry);
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

      const merged =
        cuesLimit === 0
          ? pageOrdered
            ? page.slice(0, pageLimit)
            : maxAt === undefined
              ? page.slice()
              : sortEntries(page.filter((e) => e.at <= maxAt))
          : pageLimit === 0
            ? cues.slice(0, cuesLimit)
            : pageOrdered
              ? mergeTwoOrderedSlice(cues, 0, cuesLimit, page, pageLimit)
              : sortEntries([
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
    if (entry.kind === "value") {
      let byTarget = latestValueByName.get(entry.name);
      if (byTarget === undefined) {
        byTarget = new Map();
        latestValueByName.set(entry.name, byTarget);
      }
      const prev = byTarget.get(entry.target);
      if (prev === undefined || entry.at >= prev.at) {
        byTarget.set(entry.target, { at: entry.at, value: entry.value });
      }
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
      const entry: InputEntry =
        target === undefined
          ? { kind: "trigger", name, at, value }
          : { kind: "trigger", name, at, value, target };
      insert(entry);
    },
    /** Records an entry with no contract. */
    add(entry) {
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
