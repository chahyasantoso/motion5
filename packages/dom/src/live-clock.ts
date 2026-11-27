import {
  INPUT_EVENTS,
  inputLog,
  liveAt,
  pageInputs,
  versionOf,
  type Contract,
  type Input,
  type InputSpec,
  type TargetOf,
  type Time,
} from "@gerak/core";
import { createNotifier, type Driver } from "@gerak/player";
import { pageFrames, type FrameSource } from "./frames";

/** Settings of `liveClock`: `introMs` (0), `settleMs` (2000), `now`, and `frames`. */
export interface LiveClockOptions {
  /** Frames keep coming for this long after start even without input; default 0. */
  readonly introMs?: number;
  /** Frames keep coming for this long after the latest input; default 2000 ms. */
  readonly settleMs?: number;
  /** Clock time source in ms; default `performance.now`. */
  readonly now?: () => number;
  readonly frames?: FrameSource;
}

/** A live clock driver whose log keeps `max(settleMs ?? 2000, 4000)` ms of input and requests frames while active. */
export interface LiveClock extends Driver {
  dispose(): void;
}

export interface LiveClockScrollSource {
  readonly key: object;
  readonly target: string | undefined;
  readonly read: () => number;
  readonly readsScroll: () => boolean;
}

export interface LiveClockParticipant {
  beforeTick(nowMs: number): void;
  onTick(nowMs: number): void;
  needsFrame(afterMs: number): boolean;
}

export interface LiveClockControl {
  scrollSeq(): number;
  pointerSeq(): number;
  eventsSeq(): number;
  wake(): void;
  addParticipant(participant: LiveClockParticipant): () => void;
  addScrollSource(source: LiveClockScrollSource): () => void;
  seedScroll(source: LiveClockScrollSource): void;
  syncScroll(source: LiveClockScrollSource): void;
}

interface ScrollBucket {
  lastY: number;
  readonly sources: Set<LiveClockScrollSource>;
}

const CONTROLS = new WeakMap<Driver, LiveClockControl>();

export function liveClockControl(driver: Driver): LiveClockControl | undefined {
  return CONTROLS.get(driver);
}

/** A live clock running from creation, keeping `max(settleMs ?? 2000, 4000)` ms of input and shared across mounts. */
export function liveClock(options: LiveClockOptions = {}): LiveClock {
  const frames = options.frames ?? pageFrames();
  const now = options.now ?? (() => globalThis.performance.now());
  const settleMs = options.settleMs ?? 2000;
  const introMs = options.introMs ?? 0;
  const log = inputLog({ windowMs: Math.max(settleMs, 4000) });
  const start = now();
  const elapsed = (): number => Math.max(0, now() - start);
  let until = introMs;
  let handle: number | undefined;
  let disposed = false;
  let pendingFrame = false;
  let inTick = false;
  let scrollSeq = 0;
  let pointerSeq = 0;
  let eventsSeq = 0;
  const listeners = new Set<() => void>();
  const notify = createNotifier(listeners);
  const participants = new Set<LiveClockParticipant>();
  const scrollBuckets = new Map<object, ScrollBucket>();

  const bumpChannel = (contract: unknown, name: string): void => {
    if (contract === pageInputs && name === INPUT_EVENTS.scroll) scrollSeq += 1;
    else if (
      contract === pageInputs &&
      (name === INPUT_EVENTS.pointerX || name === INPUT_EVENTS.pointerY)
    ) {
      pointerSeq += 1;
    } else {
      eventsSeq += 1;
    }
  };

  const anyNeedsFrame = (afterMs: number): boolean => {
    for (const participant of participants) {
      if (participant.needsFrame(afterMs)) return true;
    }
    return false;
  };

  const schedule = (): void => {
    if (disposed || handle !== undefined) return;
    const ms = elapsed();
    if (pendingFrame || ms < until || anyNeedsFrame(ms)) {
      handle = frames.requestFrame(tick);
    }
  };

  const recordSet = <
    V extends Record<string, InputSpec>,
    T extends Record<string, InputSpec>,
    K extends keyof V & string,
  >(
    at: number,
    contract: Contract<V, T>,
    name: K,
    value: number,
    target?: TargetOf<V[K]> | undefined,
    scheduleNext = true,
  ): void => {
    const before = versionOf(log.input);
    log.set(at, contract, name, value, target);
    if (versionOf(log.input) === before) return;
    bumpChannel(contract, name);
    if (scheduleNext) {
      until = Math.max(until, at + settleMs);
      pendingFrame = true;
      if (!inTick) schedule();
    }
  };

  const getBucket = (key: object): ScrollBucket => {
    let bucket = scrollBuckets.get(key);
    if (bucket === undefined) {
      bucket = { lastY: 0, sources: new Set() };
      scrollBuckets.set(key, bucket);
    }
    return bucket;
  };

  const tick = (): void => {
    handle = undefined;
    if (disposed) return;
    pendingFrame = false;
    const nowMs = elapsed();
    inTick = true;
    try {
      for (const participant of [...participants]) participant.beforeTick(nowMs);
      for (const bucket of scrollBuckets.values()) {
        let activeSource: LiveClockScrollSource | undefined;
        for (const source of bucket.sources) {
          if (source.readsScroll()) {
            activeSource = source;
            break;
          }
        }
        if (activeSource === undefined) continue;
        const nextY = activeSource.read();
        if (nextY !== bucket.lastY) {
          bucket.lastY = nextY;
          recordSet(nowMs, pageInputs, INPUT_EVENTS.scroll, nextY, activeSource.target);
        }
      }
    } finally {
      inTick = false;
    }
    // Inputs flushed in this tick are delivered immediately below, so only future inputs re-arm.
    pendingFrame = false;
    for (const participant of [...participants]) participant.onTick(nowMs);
    notify();
    schedule();
  };

  const driver: LiveClock = {
    now: (): Time => liveAt(elapsed()),
    input: (): Input => log.input,
    options,
    set(contract, name, value, target) {
      if (disposed) return;
      recordSet(elapsed(), contract, name, value, target);
    },
    trigger(contract, name, value, target) {
      if (disposed) return;
      const at = elapsed();
      log.trigger(at, contract, name, value, target);
      eventsSeq += 1;
      until = Math.max(until, at + settleMs);
      pendingFrame = true;
      if (!inTick) schedule();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (handle !== undefined) frames.cancelFrame(handle);
      handle = undefined;
      listeners.clear();
      participants.clear();
      scrollBuckets.clear();
      CONTROLS.delete(driver);
    },
  };

  CONTROLS.set(driver, {
    scrollSeq: () => scrollSeq,
    pointerSeq: () => pointerSeq,
    eventsSeq: () => eventsSeq,
    wake() {
      if (disposed) return;
      pendingFrame = true;
      if (!inTick) schedule();
    },
    addParticipant(participant) {
      participants.add(participant);
      return () => {
        participants.delete(participant);
      };
    },
    addScrollSource(source) {
      const bucket = getBucket(source.key);
      bucket.sources.add(source);
      return () => {
        bucket.sources.delete(source);
        if (bucket.sources.size === 0) scrollBuckets.delete(source.key);
      };
    },
    seedScroll(source) {
      const bucket = getBucket(source.key);
      const y = source.read();
      if (y !== bucket.lastY) {
        bucket.lastY = y;
        recordSet(elapsed(), pageInputs, INPUT_EVENTS.scroll, y, source.target, false);
      }
    },
    syncScroll(source) {
      const bucket = getBucket(source.key);
      const y = source.read();
      if (y !== bucket.lastY) {
        bucket.lastY = y;
        recordSet(elapsed(), pageInputs, INPUT_EVENTS.scroll, y, source.target, false);
      }
    },
  });

  schedule();
  return driver;
}
