import {
  NO_INPUT,
  atProgress,
  createStore,
  derivedInput,
  elapsedOf,
  generationOf,
  inputLog,
  inputSerialsOf,
  unreachable,
  versionOf,
  withStore,
  type Clock,
  type Contract,
  type Input,
  type InputEntry,
  type InputSpec,
  type RuntimeStore,
  type Signal,
  type TargetOf,
  type Time,
} from "@gerak/core";
import { createNotifier } from "./notify";

function sameClock(a: Clock, b: Clock): boolean {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case "timed":
      return b.kind === "timed" && Object.is(a.elapsed, b.elapsed) && Object.is(a.length, b.length);
    case "live":
      return b.kind === "live" && Object.is(a.elapsed, b.elapsed);
    case "untimed":
      return true;
    default:
      return unreachable(a);
  }
}

function sameTime(a: Time, b: Time): boolean {
  return Object.is(a.progress, b.progress) && sameClock(a.clock, b.clock);
}

/** What drives a scene: the time now, the input log, typed input writers, and a signal each time it moves. */
export interface Driver {
  now(): Time;
  input(): Input;
  set<
    V extends Record<string, InputSpec>,
    T extends Record<string, InputSpec>,
    K extends keyof V & string,
  >(
    contract: Contract<V, T>,
    name: K,
    value: number,
    target?: TargetOf<V[K]> | undefined,
  ): void;
  trigger<
    V extends Record<string, InputSpec>,
    T extends Record<string, InputSpec>,
    K extends keyof T & string,
  >(
    contract: Contract<V, T>,
    name: K,
    value?: number,
    target?: TargetOf<T[K]> | undefined,
  ): void;
  subscribe(listener: () => void): () => void;
  /** The options it was made with, so a host can tell a changed driver from the same one. */
  readonly options?: object;
}

/** A scene's values by target, rerun whole on each step of its driver. */
export interface Player<T extends object> {
  readonly time: Time;
  readonly values: T;
  /** Calls `listener` with the target's initial value and after each step where `Object.is` changed it. */
  subscribe<K extends keyof T>(target: K, listener: (value: T[K]) => void): () => void;
  /** Calls `listener` with `signal`'s value now and after each step that changes it, before targets' subscribers.
   * It reads the scene's time and input, so a seek back undoes later entries. */
  observe<V>(signal: Signal<V>, listener: (value: V) => void): () => void;
  /** Reruns the scene at the current time, for inputs it reads from outside such as a measured layout. */
  refresh(): void;
  /** Swaps the scene, and the cues when given, then reruns at the current time; the driver and listeners stay. */
  replace(next: Signal<T>, cues?: Input): void;
  /** Calls `listener` each time forward play reaches an entry of that name, a cue or the page's; a seek back calls nothing. */
  on(name: string, listener: (event: InputEntry) => void): () => void;
  dispose(): void;
}

/** Options of `play`: `cues`. */
export interface PlayOptions {
  /** The scene's own entries at known ms, such as a landing; the scene gets them merged with the page's. */
  readonly cues?: Input;
}

/** Runs `scene` against `driver`, telling each target's subscribers its value on every step. */
export function play<T extends object>(
  scene: Signal<T>,
  driver: Driver,
  options: PlayOptions = {},
): Player<T> {
  const store: RuntimeStore = createStore();
  const eventCache = derivedInput();
  let cues = options.cues ?? NO_INPUT;
  let time = driver.now();

  const resolveEvents = (targetTime: Time = time): Input =>
    eventCache.resolve(cues, driver.input(), elapsedOf(targetTime.clock));

  let current = scene;
  const initialPage = driver.input();
  const initialAll = resolveEvents();
  let values = withStore(store, () => current(time, initialAll));
  let reached = elapsedOf(time.clock);
  let lastTime = time;
  let lastAll = initialAll;
  let lastAllVersion = versionOf(initialAll);
  let lastAllGeneration = generationOf(initialAll);

  let seenPage: Input | undefined = initialPage;
  let seenPageGen: number | undefined = generationOf(initialPage);
  let pageWatermark = 0;
  const deferredSerials = new Set<number>();
  const initialSerials = inputSerialsOf(initialPage);
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
  const observers = new Set<(all: Input) => void>();
  const handlers = new Map<string, Set<(event: InputEntry) => void>>();

  const emitEvent = (event: InputEntry): void => {
    const set = handlers.get(event.name);
    if (set === undefined || set.size === 0) return;
    for (const handler of [...set]) handler(event);
  };

  const announce = (now: number | undefined, page: Input): void => {
    const from = reached;
    reached = now;
    if (now === undefined) return;
    const seekBack = from !== undefined && now < from;

    if (!seekBack && from !== undefined && now > from && handlers.size > 0) {
      for (const cue of cues) {
        if (cue.at > from && cue.at <= now) emitEvent(cue);
      }
    }

    const serials = inputSerialsOf(page);
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

    // Collect newly inserted entries (`serial > pageWatermark`), stopping immediately on ordered tail appends.
    const fresh: { readonly event: InputEntry; readonly serial: number }[] = [];
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

  const runStep = (force: boolean): void => {
    const nextTime = driver.now();
    const nextNow = elapsedOf(nextTime.clock);
    const page = driver.input();
    const all = eventCache.resolve(cues, page, nextNow);
    const allVersion = versionOf(all);
    const allGeneration = generationOf(all);
    if (
      !force &&
      sameTime(nextTime, lastTime) &&
      all === lastAll &&
      allVersion === lastAllVersion &&
      allGeneration === lastAllGeneration
    ) {
      return;
    }
    time = nextTime;
    lastTime = nextTime;
    lastAll = all;
    lastAllVersion = allVersion;
    lastAllGeneration = allGeneration;
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
    announce(nextNow, page);
  };

  const leave = driver.subscribe(() => runStep(false));
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
      const observer = (all: Input): void => {
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
    refresh: () => runStep(true),
    replace(next, nextCues) {
      current = next;
      if (nextCues !== undefined) cues = nextCues;
      runStep(true);
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
  const log = inputLog();
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
  const elapsedMs = (): number => elapsedOf(now().clock) ?? 0;
  const tell = createNotifier(listeners);
  return {
    now,
    input: () => log.input,
    options,
    set(contract, name, value, target) {
      const before = versionOf(log.input);
      log.set(elapsedMs(), contract, name, value, target);
      if (versionOf(log.input) !== before) tell();
    },
    trigger(contract, name, value, target) {
      log.trigger(elapsedMs(), contract, name, value, target);
      tell();
    },
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
