import { unreachable } from "../utility/unreachable";

type StoreCapture = (store: StoreImpl) => RestoreEntry | undefined;
type RestoreEntry = (target: StoreImpl) => void;

interface StoreImpl {
  token: object;
  epoch: number;
  readonly parent: StoreImpl | undefined;
  readonly recordTouched: boolean;
  touched: Set<StoreCapture>;
}

interface SnapshotData {
  readonly epoch: number;
  readonly entries: readonly RestoreEntry[];
}

/** Per-player mutable store backing stateful core primitives. */
export interface RuntimeStore {
  readonly kind: "runtime-store";
}

/** Immutable point-in-time capture of a RuntimeStore. */
export interface RuntimeSnapshot {
  readonly kind: "runtime-snapshot";
}

/** Stateful cell descriptor isolated by active RuntimeStore. */
export interface StoreCell<T> {
  get(store?: RuntimeStore): T | undefined;
  set(value: T, store?: RuntimeStore): void;
}

const STORES = new WeakMap<RuntimeStore, StoreImpl>();
const SNAPSHOTS = new WeakMap<RuntimeSnapshot, SnapshotData>();

let nextEpoch = 1;

function makeStore(
  recordTouched: boolean,
  parent?: StoreImpl,
): {
  readonly handle: RuntimeStore;
  readonly impl: StoreImpl;
} {
  const handle: RuntimeStore = Object.freeze({ kind: "runtime-store" });
  const impl: StoreImpl = {
    token: {},
    epoch: nextEpoch++,
    parent,
    recordTouched,
    touched: new Set(),
  };
  STORES.set(handle, impl);
  return { handle, impl };
}

const DEFAULT = makeStore(false);
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
  return makeStore(true).handle;
}

/** Returns the active RuntimeStore for this evaluation scope. */
export function storeFor(): RuntimeStore {
  return activeStore;
}

/** Current mutation epoch of `store` (bumped on snapshot, restore, and probe). */
export function epochOf(store: RuntimeStore = activeStore): number {
  return implOf(store).epoch;
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
  const probe = makeStore(false, parent);
  return withStore(probe.handle, fn);
}

/** Captures every cell populated in `store` as an immutable snapshot. */
export function snapshot(store: RuntimeStore): RuntimeSnapshot {
  const impl = implOf(store);
  const entries: RestoreEntry[] = [];
  for (const capture of impl.touched) {
    const entry = capture(impl);
    if (entry !== undefined) entries.push(entry);
  }
  impl.epoch = nextEpoch++;
  const snap: RuntimeSnapshot = Object.freeze({ kind: "runtime-snapshot" });
  SNAPSHOTS.set(snap, { epoch: impl.epoch, entries });
  return snap;
}

/** Restores `store` to the state captured in `snap`. */
export function restore(store: RuntimeStore, snap: RuntimeSnapshot): void {
  if (snap.kind !== "runtime-snapshot") unreachable(snap.kind);
  const impl = implOf(store);
  const data = SNAPSHOTS.get(snap);
  if (data === undefined) throw new TypeError("Invalid RuntimeSnapshot.");
  impl.epoch = nextEpoch++;
  impl.token = {};
  impl.touched = new Set();
  for (const entry of data.entries) entry(impl);
}

/** Declares an isolated cell backed per RuntimeStore without closure mutation. */
export function storeCell<T>(): StoreCell<T> {
  const backing = new WeakMap<object, T>();
  const capture: StoreCapture = (owner) => {
    const saved = readFromChain(backing, owner);
    if (saved === undefined) return undefined;
    return (target) => {
      backing.set(target.token, saved);
      target.touched.add(capture);
    };
  };
  return {
    get: (store = activeStore) => readFromChain(backing, implOf(store)),
    set: (value, store = activeStore) => {
      const impl = implOf(store);
      backing.set(impl.token, value);
      if (impl.recordTouched) impl.touched.add(capture);
    },
  };
}
