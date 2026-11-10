import {
  NO_EVENTS,
  atProgress,
  elapsedOf,
  mergeEvents,
  type Events,
  type MotionEvent,
  type Time,
} from "@gerak/moves";

/** What drives a scene: the time now, the events so far when it watches any, and a signal each time it moves. */
export interface Driver {
  now(): Time;
  events?(): Events;
  subscribe(listener: () => void): () => void;
  /** The options it was made with, so a host can tell a changed driver from the same one. */
  readonly options?: object;
}

/** A scene: every target's value from the time and the events so far. */
export type Scene<T extends object> = (time: Time, events: Events) => T;

/** A scene's values by target, rerun whole on each step of its driver. */
export interface Player<T extends object> {
  readonly time: Time;
  readonly values: T;
  /** Calls `listener` with the target's value now and after every step, until the returned function runs. */
  subscribe<K extends keyof T>(target: K, listener: (value: T[K]) => void): () => void;
  /** Reruns the scene at the current time, for inputs it reads from outside such as a measured layout. */
  refresh(): void;
  /** Swaps the scene, and the cues when given, then reruns at the current time; the driver and listeners stay. */
  replace(next: Scene<T>, cues?: Events): void;
  /** Calls `listener` each time forward play reaches an event of that name, a cue or the page's; a seek back calls nothing. */
  on(name: string, listener: (event: MotionEvent) => void): () => void;
  dispose(): void;
}

export interface PlayOptions {
  /** The scene's own events at known ms, such as a landing; the scene gets them merged with the page's. */
  readonly cues?: Events;
}

/** Runs `scene` against `driver`, telling each target's subscribers its value on every step. */
export function play<T extends object>(
  scene: Scene<T>,
  driver: Driver,
  options: PlayOptions = {},
): Player<T> {
  let cues = options.cues ?? NO_EVENTS;
  const events = (): Events => {
    const page = driver.events?.() ?? NO_EVENTS;
    return page.length === 0 ? cues : cues.length === 0 ? page : mergeEvents(cues, page);
  };
  let current = scene;
  let time = driver.now();
  let values = current(time, events());
  let reached = elapsedOf(time.clock);
  const listeners = new Set<() => void>();
  const handlers = new Map<string, Set<(event: MotionEvent) => void>>();
  const announce = (all: Events): void => {
    const now = elapsedOf(time.clock);
    const from = reached;
    reached = now;
    if (handlers.size === 0 || now === undefined || from === undefined || now <= from) return;
    for (const event of all)
      if (event.at > from && event.at <= now)
        for (const handler of [...(handlers.get(event.name) ?? [])]) handler(event);
  };
  const step = (): void => {
    time = driver.now();
    const all = events();
    values = current(time, all);
    for (const notify of [...listeners]) notify();
    announce(all);
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
      const notify = (): void => listener(values[target]);
      listeners.add(notify);
      notify();
      return () => {
        listeners.delete(notify);
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
    dispose() {
      leave();
      listeners.clear();
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

export function manualDriver(options: { readonly durationMs?: number } = {}): ManualDriver {
  const listeners = new Set<() => void>();
  let progress = 0;
  let beyond: number | undefined;
  const now = (): Time =>
    options.durationMs === undefined
      ? atProgress(progress)
      : {
          progress,
          clock: {
            kind: "timed",
            elapsed: beyond ?? progress * options.durationMs,
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
      beyond = undefined;
      tell();
    },
    seekMs(ms) {
      const length = options.durationMs;
      if (length === undefined || length <= 0)
        throw new RangeError("seekMs: this driver has no length in ms.");
      progress = Math.max(0, Math.min(1, ms / length));
      beyond = ms > length ? ms : undefined;
      tell();
    },
  };
}
