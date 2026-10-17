import type { CacheLookup, CacheProvider, CacheSnapshot, CacheSpec, CacheWrite } from "./cache";

interface SlotEntry<K, V> {
  readonly key: K;
  readonly value: V;
}

class BoundedCacheSnapshot<K, V> implements CacheSnapshot<K, V> {
  readonly #slots: ReadonlyMap<string, SlotEntry<K, V>>;
  readonly #spec: CacheSpec<K>;
  readonly #onMapCopy?: (() => void) | undefined;

  constructor(
    slots: ReadonlyMap<string, SlotEntry<K, V>>,
    spec: CacheSpec<K>,
    onMapCopy?: (() => void) | undefined,
  ) {
    this.#slots = slots;
    this.#spec = spec;
    this.#onMapCopy = onMapCopy;
    Object.freeze(this);
  }

  lookup(slot: string, key: K): CacheLookup<V> {
    if (typeof slot !== "string") {
      throw new TypeError("Cache slot must be a string.");
    }
    const entry = this.#slots.get(slot);
    if (entry === undefined) {
      return Object.freeze({ kind: "miss" });
    }
    if (this.#spec.equals(entry.key, key)) {
      return Object.freeze({ kind: "hit", value: entry.value });
    }
    return Object.freeze({ kind: "miss" });
  }

  remember(writes: readonly CacheWrite<K, V>[]): CacheSnapshot<K, V> {
    if (!Array.isArray(writes)) {
      throw new TypeError("Cache writes must be an array.");
    }
    if (writes.length === 0) {
      return this;
    }
    for (let i = 0; i < writes.length; i++) {
      const write = writes[i];
      if (!write || typeof write !== "object") {
        throw new TypeError(`CacheWrite at index ${i} must be an object.`);
      }
      if (typeof write.slot !== "string") {
        throw new TypeError(`CacheWrite at index ${i} slot must be a string.`);
      }
    }

    this.#onMapCopy?.();
    const nextMap = new Map(this.#slots);

    for (let i = 0; i < writes.length; i++) {
      const write = writes[i]!;
      const slot = write.slot;
      const entry: SlotEntry<K, V> = Object.freeze({ key: write.key, value: write.value });

      if (nextMap.has(slot)) {
        nextMap.set(slot, entry);
      } else {
        while (nextMap.size >= this.#spec.maxSlots) {
          const oldestSlot = nextMap.keys().next().value;
          if (oldestSlot === undefined) break;
          nextMap.delete(oldestSlot);
        }
        nextMap.set(slot, entry);
      }
    }

    return new BoundedCacheSnapshot(nextMap, this.#spec, this.#onMapCopy);
  }
}

export interface BoundedCacheProviderOptions {
  readonly onMapCopy?: (() => void) | undefined;
}

export function createBoundedCacheProvider(
  options?: BoundedCacheProviderOptions | undefined,
): CacheProvider {
  return Object.freeze({
    create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V> {
      if (!spec || typeof spec !== "object") {
        throw new TypeError("CacheSpec must be an object.");
      }
      if (typeof spec.equals !== "function") {
        throw new TypeError("CacheSpec equals must be a function.");
      }
      if (
        !Number.isFinite(spec.maxSlots) ||
        !Number.isInteger(spec.maxSlots) ||
        spec.maxSlots <= 0
      ) {
        throw new TypeError("CacheSpec maxSlots must be a finite positive integer.");
      }
      return new BoundedCacheSnapshot<K, V>(new Map(), spec, options?.onMapCopy);
    },
  });
}

export const DEFAULT_CACHE_PROVIDER: CacheProvider = createBoundedCacheProvider();

class NoCacheSnapshot<K, V> implements CacheSnapshot<K, V> {
  constructor() {
    Object.freeze(this);
  }

  lookup(_slot: string, _key: K): CacheLookup<V> {
    return Object.freeze({ kind: "miss" });
  }

  remember(writes: readonly CacheWrite<K, V>[]): CacheSnapshot<K, V> {
    if (!Array.isArray(writes)) {
      throw new TypeError("Cache writes must be an array.");
    }
    for (let i = 0; i < writes.length; i++) {
      const write = writes[i];
      if (!write || typeof write !== "object") {
        throw new TypeError(`CacheWrite at index ${i} must be an object.`);
      }
      if (typeof write.slot !== "string") {
        throw new TypeError(`CacheWrite at index ${i} slot must be a string.`);
      }
    }
    return this;
  }
}

const NO_CACHE_SNAPSHOT = new NoCacheSnapshot<any, any>();

export const NO_CACHE_PROVIDER: CacheProvider = Object.freeze({
  create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V> {
    if (!spec || typeof spec !== "object") {
      throw new TypeError("CacheSpec must be an object.");
    }
    if (typeof spec.equals !== "function") {
      throw new TypeError("CacheSpec equals must be a function.");
    }
    if (!Number.isFinite(spec.maxSlots) || !Number.isInteger(spec.maxSlots) || spec.maxSlots <= 0) {
      throw new TypeError("CacheSpec maxSlots must be a finite positive integer.");
    }
    return NO_CACHE_SNAPSHOT;
  },
});

export function createAggressiveEvictingCacheProvider(): CacheProvider {
  return Object.freeze({
    create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V> {
      if (!spec || typeof spec !== "object") {
        throw new TypeError("CacheSpec must be an object.");
      }
      if (typeof spec.equals !== "function") {
        throw new TypeError("CacheSpec equals must be a function.");
      }
      if (
        !Number.isFinite(spec.maxSlots) ||
        !Number.isInteger(spec.maxSlots) ||
        spec.maxSlots <= 0
      ) {
        throw new TypeError("CacheSpec maxSlots must be a finite positive integer.");
      }
      return new BoundedCacheSnapshot<K, V>(new Map(), { ...spec, maxSlots: 1 });
    },
  });
}
