import {
  NO_EVENTS,
  atProgress,
  attachOnEvent,
  compactEvents,
  createStore,
  derivedEvents,
  elapsedOf,
  eventSerialsOf,
  generationOf,
  restore as restoreStore,
  snapshot as snapshotStore,
  unreachable,
  withStore,
  type Events,
  type MotionEvent,
  type RetentionPolicy,
  type RuntimeSnapshot,
  type RuntimeStore,
  type Signal,
  type Time,
} from "@gerak/core";

/** What drives a scene: the time now, the events so far when it watches any, and a signal each time it moves. */
export interface Driver {
  now(): Time;
  events?(): Events;
  subscribe(listener: () => void): () => void;
  /** The options it was made with, so a host can tell a changed driver from the same one. */
  readonly options?: object;
}

/** Immutable point-in-time capture of a player's clock time, store cells, and event state. */
export interface PlayerSnapshot {
  readonly kind: "player-snapshot";
}

/** A scene's values by target, rerun whole on each step of its driver. */
export interface Player<T extends object> {
  readonly time: Time;
  readonly values: T;
  /** Calls `listener` with the target's initial value and after each step where `Object.is` changed it. */
  subscribe<K extends keyof T>(target: K, listener: (value: T[K]) => void): () => void;
  /** Calls `listener` with `signal`'s value now and after each step that changes it, before targets' subscribers.
   * It reads the scene's time and events, so a seek back undoes later events. */
  observe<V>(signal: Signal<V>, listener: (value: V) => void): () => void;
  /** Reruns the scene at the current time, for inputs it reads from outside such as a measured layout. */
  refresh(): void;
  /** Swaps the scene, and the cues when given, then reruns at the current time; the driver and listeners stay. */
  replace(next: Signal<T>, cues?: Events): void;
  /** Calls `listener` each time forward play reaches an event of that name, a cue or the page's; a seek back calls nothing. */
  on(name: string, listener: (event: MotionEvent) => void): () => void;
  /** Captures the current player clock, store cells, and cursors as an immutable snapshot. */
  snapshot(): PlayerSnapshot;
  /** Restores player state and notifies subscribers/observers from `snap`. */
  restore(snap: PlayerSnapshot): void;
  dispose(): void;
}

/** Options of `play`: `cues`, event `retention` policy, `onEvent` stream callback, and `settleMs`. */
export interface PlayOptions {
  /** The scene's own events at known ms, such as a landing; the scene gets them merged with the page's. */
  readonly cues?: Events;
  /** Event history policy: `"all"` (default), `"live"` bounded sliding window, or `"window"` bounded rewind. */
  readonly retention?: RetentionPolicy;
  /** Synchronous callback notified for every incoming page event. */
  readonly onEvent?: (event: MotionEvent) => void;
  /** Live settle floor used to size the default `"live"` retention window (`Math.max(settleMs, 4000)`). */
  readonly settleMs?: number;
}

interface SnapshotRecord<T extends object> {
  readonly playerToken: object;
  readonly time: Time;
  readonly values: T;
  readonly reached: number | undefined;
  readonly pageWatermark: number;
  readonly deferredSerials: readonly number[];
  readonly store: RuntimeSnapshot;
}

const PLAYER_SNAPSHOTS = new WeakMap<PlayerSnapshot, SnapshotRecord<object>>();

interface WindowCheckpoint {
  readonly atMs: number;
  readonly snap: PlayerSnapshot;
}

function thinCheckpoints(list: WindowCheckpoint[], max: number): void {
  while (list.length > max) {
    const keepLast = list[list.length - 1];
    const next: WindowCheckpoint[] = [];
    for (let i = 0; i < list.length - 1; i += 2) {
      const item = list[i];
      if (item !== undefined) next.push(item);
    }
    if (keepLast !== undefined) next.push(keepLast);
    if (next.length >= list.length) {
      list.splice(1, 1);
    } else {
      list.length = 0;
      list.push(...next);
    }
  }
}

/** Runs `scene` against `driver`, telling each target's subscribers its value on every step. */
export function play<T extends object>(
  scene: Signal<T>,
  driver: Driver,
  options: PlayOptions = {},
): Player<T> {
  const playerToken = {};
  const store: RuntimeStore = createStore();
  const eventCache = derivedEvents();
  const retention: RetentionPolicy = options.retention ?? { kind: "all" };
  let cues = options.cues ?? NO_EVENTS;
  let time = driver.now();

  let attachedPage: Events | undefined;
  let detachOnEvent: (() => void) | undefined;
  const syncOnEventAttachment = (page: Events | undefined): void => {
    if (options.onEvent === undefined || page === attachedPage) return;
    detachOnEvent?.();
    detachOnEvent = undefined;
    attachedPage = page;
    if (page !== undefined) detachOnEvent = attachOnEvent(page, options.onEvent);
  };

  const resolveEvents = (targetTime: Time = time): Events => {
    const page = driver.events?.() ?? NO_EVENTS;
    syncOnEventAttachment(page);
    return eventCache.resolve(cues, page, elapsedOf(targetTime.clock));
  };

  let current = scene;
  const initialPage = driver.events?.() ?? NO_EVENTS;
  syncOnEventAttachment(initialPage);
  let values = withStore(store, () => current(time, resolveEvents()));
  let reached = elapsedOf(time.clock);

  let seenPage: Events | undefined = initialPage;
  let seenPageGen: number | undefined = generationOf(initialPage);
  let pageWatermark = 0;
  const deferredSerials = new Set<number>();
  const initialSerials = eventSerialsOf(initialPage);
  if (initialSerials !== undefined) {
    for (let i = 0; i < initialPage.length; i += 1) {
      const event = initialPage[i];
      const serial = initialSerials[i] ?? 0;
      if (event === undefined) continue;
      if (serial > pageWatermark) pageWatermark = serial;
      if (reached !== undefined && event.at > reached) deferredSerials.add(serial);
    }
  }

  const listeners = new Set<() => void>();
  const observers = new Set<(all: Events) => void>();
  const handlers = new Map<string, Set<(event: MotionEvent) => void>>();

  const emitEvent = (event: MotionEvent): void => {
    const set = handlers.get(event.name);
    if (set === undefined || set.size === 0) return;
    for (const handler of [...set]) handler(event);
  };

  const announce = (now: number | undefined, page: Events, forcedSeekBack = false): void => {
    const from = reached;
    reached = now;
    if (now === undefined) return;
    const seekBack = forcedSeekBack || (from !== undefined && now < from);

    if (!seekBack && from !== undefined && now > from && handlers.size > 0) {
      for (const cue of cues) {
        if (cue.at > from && cue.at <= now) emitEvent(cue);
      }
    }

    const serials = eventSerialsOf(page);
    if (serials === undefined) {
      if (!seekBack && from !== undefined && now > from && handlers.size > 0) {
        for (const event of page) {
          if (event.at > from && event.at <= now) emitEvent(event);
        }
      }
      return;
    }

    const pageGen = generationOf(page);
    const sameOrderedPage = page === seenPage && pageGen !== undefined && pageGen === seenPageGen;
    if (page !== seenPage) {
      seenPage = page;
      pageWatermark = 0;
      deferredSerials.clear();
    }
    seenPageGen = pageGen;

    if (deferredSerials.size > 0) {
      for (let i = 0; i < page.length; i += 1) {
        const event = page[i];
        const serial = serials[i] ?? 0;
        if (event === undefined || !deferredSerials.has(serial)) continue;
        if (event.at <= now) {
          deferredSerials.delete(serial);
          if (!seekBack && handlers.size > 0) emitEvent(event);
        }
      }
    }

    // Collect newly inserted events (`serial > pageWatermark`), stopping immediately on ordered tail appends.
    const fresh: { readonly event: MotionEvent; readonly serial: number }[] = [];
    for (let i = page.length - 1; i >= 0; i -= 1) {
      const serial = serials[i] ?? 0;
      if (serial <= pageWatermark) {
        if (sameOrderedPage) break;
        continue;
      }
      const event = page[i];
      if (event !== undefined) fresh.push({ event, serial });
    }
    if (fresh.length === 0) return;
    fresh.reverse();
    for (const item of fresh) {
      if (item.serial > pageWatermark) pageWatermark = item.serial;
      if (item.event.at <= now) {
        if (!seekBack && handlers.size > 0) emitEvent(item.event);
      } else {
        deferredSerials.add(item.serial);
      }
    }
  };

  const captureSnapshot = (): PlayerSnapshot => {
    const snap: PlayerSnapshot = Object.freeze({ kind: "player-snapshot" });
    PLAYER_SNAPSHOTS.set(snap, {
      playerToken,
      time,
      values,
      reached,
      pageWatermark,
      deferredSerials: [...deferredSerials],
      store: snapshotStore(store),
    });
    return snap;
  };

  const applySnapshot = (snap: PlayerSnapshot): void => {
    if (snap.kind !== "player-snapshot") unreachable(snap.kind);
    const data = PLAYER_SNAPSHOTS.get(snap);
    if (data === undefined || data.playerToken !== playerToken) {
      throw new TypeError("Invalid PlayerSnapshot for this Player.");
    }
    time = data.time;
    reached = data.reached;
    pageWatermark = data.pageWatermark;
    deferredSerials.clear();
    for (const s of data.deferredSerials) deferredSerials.add(s);
    restoreStore(store, data.store);
  };

  const checkpoints: WindowCheckpoint[] = [];
  if (retention.kind === "window") {
    const startMs = elapsedOf(time.clock);
    if (startMs !== undefined) checkpoints.push({ atMs: startMs, snap: captureSnapshot() });
  }

  const runRetention = (now: number | undefined, page: Events): void => {
    if (now === undefined) return;
    switch (retention.kind) {
      case "all":
        break;
      case "live": {
        const windowMs = retention.windowMs ?? Math.max(options.settleMs ?? 0, 4000);
        const beforeMs = now - windowMs;
        if (beforeMs > 0) compactEvents(page, beforeMs);
        break;
      }
      case "window": {
        const maxCp = Math.max(2, retention.maxCheckpoints ?? 32);
        const interval = Math.max(1, Math.floor(retention.windowMs / Math.max(1, maxCp - 1)));
        const lastCp = checkpoints[checkpoints.length - 1];
        if (lastCp === undefined || now - lastCp.atMs >= interval) {
          checkpoints.push({ atMs: now, snap: captureSnapshot() });
          if (checkpoints.length > maxCp) thinCheckpoints(checkpoints, maxCp);
        }
        const floor = now - retention.windowMs;
        let anchorIdx = -1;
        for (let i = 0; i < checkpoints.length; i += 1) {
          const cp = checkpoints[i];
          if (cp !== undefined && cp.atMs <= floor) anchorIdx = i;
          else break;
        }
        if (anchorIdx >= 0) {
          const anchor = checkpoints[anchorIdx];
          if (anchorIdx > 0) checkpoints.splice(0, anchorIdx);
          if (anchor !== undefined && anchor.atMs > 0) compactEvents(page, anchor.atMs);
        }
        break;
      }
      default:
        unreachable(retention);
    }
  };

  const step = (): void => {
    const prevNow = elapsedOf(time.clock);
    const nextTime = driver.now();
    const nextNow = elapsedOf(nextTime.clock);
    const isSeekBack = nextNow !== undefined && prevNow !== undefined && nextNow < prevNow;

    if (retention.kind === "window" && isSeekBack && checkpoints.length > 0) {
      let pickIdx = 0;
      for (let i = 0; i < checkpoints.length; i += 1) {
        const cp = checkpoints[i];
        if (cp !== undefined && cp.atMs <= nextNow) pickIdx = i;
        else break;
      }
      const chosen = checkpoints[pickIdx];
      if (chosen !== undefined) {
        applySnapshot(chosen.snap);
        checkpoints.length = pickIdx + 1;
      }
    }

    time = nextTime;
    const page = driver.events?.() ?? NO_EVENTS;
    const all = resolveEvents(time);
    withStore(store, () => {
      if (Reflect.get(globalThis, "__gerakTiming") === true) {
        const started = performance.now();
        values = current(time, all);
        const scened = performance.now();
        for (const observer of [...observers]) observer(all);
        for (const notify of [...listeners]) notify();
        const written = performance.now();
        performance.measure("gerak:scene", { start: started, end: scened });
        performance.measure("gerak:write", { start: scened, end: written });
      } else {
        values = current(time, all);
        for (const observer of [...observers]) observer(all);
        for (const notify of [...listeners]) notify();
      }
    });
    announce(nextNow, page, isSeekBack);
    runRetention(nextNow, page);
  };

  const leave = driver.subscribe(step);
  return {
    get time() {
      return time;
    },
    get values() {
      return values;
    },
    subscribe(target, listener) {
      let last = values[target];
      const notify = (): void => {
        const next = values[target];
        if (Object.is(next, last)) return;
        last = next;
        listener(next);
      };
      listeners.add(notify);
      listener(last);
      return () => {
        listeners.delete(notify);
      };
    },
    observe(signal, listener) {
      let last = withStore(store, () => signal(time, resolveEvents()));
      const observer = (all: Events): void => {
        const next = signal(time, all);
        if (Object.is(next, last)) return;
        last = next;
        listener(next);
      };
      observers.add(observer);
      listener(last);
      return () => {
        observers.delete(observer);
      };
    },
    refresh: step,
    replace(next, nextCues) {
      current = next;
      if (nextCues !== undefined) cues = nextCues;
      step();
    },
    on(name, listener) {
      const set = handlers.get(name) ?? new Set();
      set.add(listener);
      handlers.set(name, set);
      return () => {
        set.delete(listener);
      };
    },
    snapshot: captureSnapshot,
    restore(snap) {
      applySnapshot(snap);
      const all = resolveEvents(time);
      withStore(store, () => {
        values = current(time, all);
        for (const observer of [...observers]) observer(all);
        for (const notify of [...listeners]) notify();
      });
    },
    dispose() {
      leave();
      detachOnEvent?.();
      listeners.clear();
      observers.clear();
      handlers.clear();
    },
  };
}

/** A driver moved by hand, timed when it knows its length in ms. */
export interface ManualDriver extends Driver {
  seek(progress: number): void;
  /** Moves to `ms`; past the length, progress holds at 1 while the clock's ms runs on, for events after the end. */
  seekMs(ms: number): void;
}

/** A driver moved by hand: `.seek(progress)`, `.seekMs(ms)`. Timed when given `durationMs`, untimed otherwise. */
export function manualDriver(options: { readonly durationMs?: number } = {}): ManualDriver {
  const listeners = new Set<() => void>();
  let progress = 0;
  let exactMs: number | undefined;
  const now = (): Time =>
    options.durationMs === undefined
      ? atProgress(progress)
      : {
          progress,
          clock: {
            kind: "timed",
            elapsed: exactMs ?? progress * options.durationMs,
            length: options.durationMs,
          },
        };
  const tell = (): void => {
    for (const listener of [...listeners]) listener();
  };
  return {
    now,
    options,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    seek(next) {
      progress = Math.max(0, Math.min(1, next));
      exactMs = undefined;
      tell();
    },
    seekMs(ms) {
      const length = options.durationMs;
      if (length === undefined || length <= 0)
        throw new RangeError("seekMs: this driver has no length in ms.");
      progress = Math.max(0, Math.min(1, ms / length));
      exactMs = ms;
      tell();
    },
  };
}
