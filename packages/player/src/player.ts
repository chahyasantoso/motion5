import { atProgress, type Time } from "@motion5/moves";

/** What drives a scene: the time now, and a signal each time it moves. */
export interface Driver {
  now(): Time;
  subscribe(listener: () => void): () => void;
}

/** A scene's values by target, rerun whole on each step of its driver. */
export interface Player<T extends object> {
  readonly time: Time;
  readonly values: T;
  /** Calls `listener` with the target's value now and after every step, until the returned function runs. */
  subscribe<K extends keyof T>(target: K, listener: (value: T[K]) => void): () => void;
  /** Reruns the scene at the current time, for inputs it reads from outside such as a measured layout. */
  refresh(): void;
  dispose(): void;
}

/** Runs `scene` against `driver`, telling each target's subscribers its value on every step. */
export function play<T extends object>(scene: (time: Time) => T, driver: Driver): Player<T> {
  let time = driver.now();
  let values = scene(time);
  const listeners = new Set<() => void>();
  const step = (): void => {
    time = driver.now();
    values = scene(time);
    for (const notify of [...listeners]) notify();
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
    dispose() {
      leave();
      listeners.clear();
    },
  };
}

/** A driver moved by hand, timed when it knows its length in ms. */
export interface ManualDriver extends Driver {
  seek(progress: number): void;
}

export function manualDriver(options: { readonly durationMs?: number } = {}): ManualDriver {
  const listeners = new Set<() => void>();
  let progress = 0;
  const now = (): Time =>
    options.durationMs === undefined
      ? atProgress(progress)
      : {
          progress,
          clock: {
            kind: "timed",
            elapsed: progress * options.durationMs,
            length: options.durationMs,
          },
        };
  return {
    now,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    seek(next) {
      progress = Math.max(0, Math.min(1, next));
      for (const listener of [...listeners]) listener();
    },
  };
}
