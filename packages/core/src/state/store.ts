interface StoreImpl {
  readonly token: object;
  readonly epoch: number;
  readonly parent: StoreImpl | undefined;
}

/** Per-player mutable store backing stateful core primitives. */
export interface RuntimeStore {
  readonly kind: "runtime-store";
}

/** Stateful cell descriptor isolated by active RuntimeStore. */
export interface StoreCell<T> {
  get(store?: RuntimeStore): T | undefined;
  set(value: T, store?: RuntimeStore): void;
  /** The value owned by `store`'s epoch: fresh when absent or `reset` says so, copied when another epoch wrote it. */
  own(
    reset: (current: T) => boolean,
    create: (previous: T | undefined) => T,
    copy: (current: T) => T,
    store?: RuntimeStore,
  ): T;
}

interface CellEntry<T> {
  readonly epoch: number;
  readonly value: T;
}

const STORES = new WeakMap<RuntimeStore, StoreImpl>();
let nextEpoch = 1;

function makeStore(parent?: StoreImpl): {
  readonly handle: RuntimeStore;
  readonly impl: StoreImpl;
} {
  const handle: RuntimeStore = Object.freeze({ kind: "runtime-store" });
  const impl: StoreImpl = {
    token: {},
    epoch: nextEpoch++,
    parent,
  };
  STORES.set(handle, impl);
  return { handle, impl };
}

const DEFAULT = makeStore();
let activeStore: RuntimeStore = DEFAULT.handle;

function implOf(store: RuntimeStore): StoreImpl {
  const impl = STORES.get(store);
  if (impl === undefined) throw new TypeError("Invalid RuntimeStore.");
  return impl;
}

function readFromChain<T>(backing: WeakMap<object, T>, start: StoreImpl): T | undefined {
  let cursor: StoreImpl | undefined = start;
  while (cursor !== undefined) {
    const value = backing.get(cursor.token);
    if (value !== undefined) return value;
    cursor = cursor.parent;
  }
  return undefined;
}

/** Allocates a fresh store for an independent player or scene run. */
export function createStore(): RuntimeStore {
  return makeStore().handle;
}

/** Returns the active RuntimeStore for this evaluation scope. */
export function storeFor(): RuntimeStore {
  return activeStore;
}

/** Runs `fn` with `store` bound as the active RuntimeStore. */
export function withStore<T>(store: RuntimeStore, fn: () => T): T {
  const previous = activeStore;
  activeStore = store;
  try {
    return fn();
  } finally {
    activeStore = previous;
  }
}

/** Runs an off-time probe in a transient copy-on-write store without mutating caller cursors. */
export function withProbeStore<T>(fn: () => T): T {
  const parent = implOf(activeStore);
  const probe = makeStore(parent);
  return withStore(probe.handle, fn);
}

/** Declares an isolated cell backed per RuntimeStore without closure mutation. */
export function storeCell<T>(): StoreCell<T> {
  const backing = new WeakMap<object, CellEntry<T>>();
  const write = (impl: StoreImpl, value: T): void => {
    backing.set(impl.token, { epoch: impl.epoch, value });
  };
  return {
    get: (store = activeStore) => readFromChain(backing, implOf(store))?.value,
    set: (value, store = activeStore) => write(implOf(store), value),
    own(reset, create, copy, store = activeStore) {
      const impl = implOf(store);
      const entry = readFromChain(backing, impl);
      if (entry === undefined || reset(entry.value)) {
        const fresh = create(entry?.value);
        write(impl, fresh);
        return fresh;
      }
      if (entry.epoch === impl.epoch) return entry.value;
      const copied = copy(entry.value);
      write(impl, copied);
      return copied;
    },
  };
}
