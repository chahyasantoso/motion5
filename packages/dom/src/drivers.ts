import { atProgress, elapsedOf, inputLog, unreachable, versionOf, type Time } from "@gerak/core";
import type { Driver } from "@gerak/player";
import { createLoopCycle, type LoopCycle } from "./loop-cycle";
import { pageFrames, type FrameSource } from "./frames";

/** Settings of `clockDriver`: `duration` ms, `delay`, `repeat`, `yoyo`, `autoplay`, `frames` and `reducedMotion`. */
export interface ClockOptions {
  readonly duration: number;
  readonly delay?: number;
  readonly repeat?: number;
  readonly yoyo?: boolean;
  readonly autoplay?: boolean;
  readonly frames?: FrameSource;
  /** Under the person's reduced-motion setting: `"end"` shows the last frame and never ticks; default `"end"`. */
  readonly reducedMotion?: "end" | "play";
  /** Whether the person asked for reduced motion; the page's media query when absent. */
  readonly prefersReducedMotion?: () => boolean;
}

function pagePrefersReducedMotion(): boolean {
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** Whether the clock should hold on its last frame instead of playing. */
function holdsAtEnd(options: ClockOptions): boolean {
  const mode = options.reducedMotion ?? "end";
  switch (mode) {
    case "end":
      return (options.prefersReducedMotion ?? pagePrefersReducedMotion)();
    case "play":
      return false;
    default:
      return unreachable(mode);
  }
}

/** A driver on the page's frames, timed in ms, with the delay, repeat and yoyo a `time` trigger has. */
export interface ClockDriver extends Driver {
  play(): void;
  pause(): void;
  seek(progress: number): void;
  replay(): void;
  dispose(): void;
  setRate(rate: number): void;
  setRange(fromMs?: number, toMs?: number): void;
  /** Changes the clock's length in ms, keeping its elapsed ms (clamped to the new length) and its state. */
  setDuration(ms: number): void;
  /** Whether frames are advancing it now; subscribers hear each change. */
  playing(): boolean;
  /** Calls `listener` each time the clock forgets its log: a loop that wraps, or `replay`. */
  forgets(listener: () => void): () => void;
}

/** How long a clock runs on past its end after the latest sample, for a spring to settle. */
export const SAMPLE_SETTLE_MS = 2000;

/** A timed clock on the page's frames. Under reduced motion it shows the last frame and never ticks
 * until `.play()`; `reducedMotion: "play"` opts out. */
export function clockDriver(options: ClockOptions): ClockDriver {
  const frames = options.frames ?? pageFrames();
  const listeners = new Set<() => void>();
  let duration = options.duration;
  const fresh = (delay: number | undefined): LoopCycle =>
    createLoopCycle({
      duration,
      ...(delay === undefined ? {} : { delay }),
      ...(options.repeat === undefined ? {} : { repeat: options.repeat }),
      ...(options.yoyo === undefined ? {} : { yoyo: options.yoyo }),
    });
  const still = holdsAtEnd(options);
  let cycle = fresh(options.delay);
  let progress = still ? 1 : 0;
  let handle: number | undefined;
  let previous: number | undefined;
  let rate = 1;
  let range: { readonly from: number; readonly to: number } | undefined;
  let running = false;
  let overtime = 0;
  // An input keeps it running past the end until this ms.
  let settleUntil = -Infinity;
  // Whether the clock stopped by itself at its end, so an input may start it again.
  let ended = false;
  const elapsedNow = (): number => progress * duration + overtime;
  const runsOver = (): boolean => elapsedNow() < settleUntil;
  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };
  const log = inputLog();
  const forgetters = new Set<() => void>();
  const forget = (): void => {
    log.clear();
    settleUntil = -Infinity;
    for (const listener of [...forgetters]) listener();
  };
  // A listener may pause or play during `notify`, so the next frame is asked for only after it.
  const request = (): void => {
    if (running && handle === undefined) handle = frames.requestFrame(frame);
  };
  const frame = (at: number): void => {
    handle = undefined;
    const before = elapsedNow();
    const delta = (previous === undefined ? 0 : Math.max(0, at - previous)) * rate;
    previous = at;
    if (range !== undefined) {
      let elapsed = progress * duration + delta;
      const span = range.to - range.from;
      if (span > 0 && elapsed >= range.to) {
        const wraps = Math.floor((elapsed - range.from) / span);
        if (wraps > 0) elapsed -= wraps * span;
      }
      progress = duration > 0 ? elapsed / duration : 0;
      cycle = fresh(undefined);
      cycle.advance(elapsed);
    } else if (cycle.state.kind === "finished" && runsOver()) {
      overtime += delta;
    } else {
      progress = cycle.advance(delta).progress;
    }
    if (range === undefined && cycle.state.kind === "finished" && !runsOver()) {
      running = false;
      ended = true;
      previous = undefined;
    }
    // A loop that wrapped starts a fresh pass, so what was recorded in the last one is forgotten;
    // a yoyo runs backwards on purpose and keeps its log.
    if (elapsedNow() < before && options.yoyo !== true) forget();
    notify();
    request();
  };
  const stop = (): void => {
    if (handle !== undefined) frames.cancelFrame(handle);
    handle = undefined;
    previous = undefined;
    running = false;
    ended = false;
  };
  const start = (): void => {
    ended = false;
    // Past the end while watching or settling, playing resumes the overtime; a finished clock starts again.
    if (cycle.state.kind === "finished" && runsOver() && range === undefined) {
      running = true;
      request();
      return;
    }
    if (progress >= 1 || cycle.state.kind === "finished") {
      overtime = 0;
      forget();
      cycle = fresh(undefined);
      progress = range !== undefined ? (duration > 0 ? range.from / duration : 0) : 0;
      if (range !== undefined && range.from > 0) cycle.advance(range.from);
    }
    running = true;
    request();
  };
  const extendSettle = (at: number): void => {
    settleUntil = Math.max(settleUntil, at + SAMPLE_SETTLE_MS);
    if (ended && range === undefined) {
      ended = false;
      running = true;
      request();
    }
  };
  const driver: ClockDriver = {
    now: () => ({
      progress,
      clock: { kind: "timed", elapsed: elapsedNow(), length: duration },
    }),
    input: () => log.input,
    options,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    play() {
      if (running) return;
      start();
      notify();
    },
    pause() {
      if (!running) return;
      stop();
      notify();
    },
    playing: () => running,
    set(contract, name, value, target) {
      const at = elapsedNow();
      const before = versionOf(log.input);
      log.set(at, contract, name, value, target);
      extendSettle(at);
      if (versionOf(log.input) !== before) notify();
    },
    trigger(contract, name, value, target) {
      const at = elapsedNow();
      log.trigger(at, contract, name, value, target);
      extendSettle(at);
      notify();
    },
    forgets(listener) {
      forgetters.add(listener);
      return () => {
        forgetters.delete(listener);
      };
    },
    seek(next) {
      stop();
      overtime = 0;
      progress = Math.max(0, Math.min(1, next));
      cycle = fresh(undefined);
      cycle.advance(progress * duration);
      notify();
    },
    replay() {
      stop();
      overtime = 0;
      forget();
      cycle = fresh(options.delay);
      progress = still ? 1 : 0;
      if (!still) start();
      notify();
    },
    dispose() {
      stop();
      listeners.clear();
      forgetters.clear();
    },
    setRate(next) {
      rate = Math.max(0, next);
    },
    setDuration(next) {
      const length = Math.max(0, next);
      const elapsed = Math.min(length, elapsedNow());
      duration = length;
      overtime = 0;
      if (range !== undefined) {
        const from = Math.min(range.from, length);
        const to = Math.min(range.to, length);
        range = to > from ? { from, to } : undefined;
      }
      progress = length > 0 ? elapsed / length : 0;
      cycle = fresh(undefined);
      cycle.advance(elapsed);
      notify();
    },
    setRange(fromMs?: number, toMs?: number) {
      if (fromMs !== undefined && toMs !== undefined) {
        const from = Math.max(0, Math.min(duration, fromMs));
        const to = Math.max(from, Math.min(duration, toMs));
        if (to > from) {
          range = { from, to };
          overtime = 0;
          const elapsed = progress * duration;
          if (elapsed < from || elapsed > to) {
            progress = duration > 0 ? from / duration : 0;
            cycle = fresh(undefined);
            cycle.advance(from);
            notify();
          }
          return;
        }
      }
      if (range === undefined) return;
      range = undefined;
      cycle = fresh(undefined);
      cycle.advance(progress * duration);
    },
  };
  if (options.autoplay !== false && !still) start();
  return driver;
}

/** What a scroll driver reads: a window or a scrolling element. */
export interface ScrollTarget {
  readonly scrollY?: number;
  readonly scrollTop?: number;
  addEventListener(type: "scroll", listener: () => void): void;
  removeEventListener(type: "scroll", listener: () => void): void;
}

/** A driver from 0 to 1 as the target scrolls from `start` to `end` px; untimed unless given a `length` in ms. */
export function scrollDriver(options: {
  readonly target?: ScrollTarget;
  readonly start: number;
  readonly end: number;
  readonly length?: number;
}): Driver {
  const length = options.length;
  if (length !== undefined && !(length > 0))
    throw new RangeError(`scrollDriver: length must be above 0 ms, not ${length}.`);
  const target: ScrollTarget = options.target ?? {
    get scrollY() {
      return globalThis.scrollY;
    },
    addEventListener: (type, listener) => globalThis.addEventListener(type, listener),
    removeEventListener: (type, listener) => globalThis.removeEventListener(type, listener),
  };
  const offset = (): number => target.scrollY ?? target.scrollTop ?? 0;
  const span = options.end - options.start;
  const log = inputLog();
  const listeners = new Set<() => void>();
  const now = (): Time => {
    const progress = span <= 0 ? 1 : Math.max(0, Math.min(1, (offset() - options.start) / span));
    return length === undefined
      ? atProgress(progress)
      : { progress, clock: { kind: "timed", elapsed: progress * length, length } };
  };
  const elapsedMs = (): number => (length === undefined ? 0 : (elapsedOf(now().clock) ?? 0));
  const tell = (): void => {
    for (const listener of [...listeners]) listener();
  };
  return {
    now,
    input: () => log.input,
    options,
    set(contract, name, value, targetName) {
      const before = versionOf(log.input);
      log.set(elapsedMs(), contract, name, value, targetName);
      if (versionOf(log.input) !== before) tell();
    },
    trigger(contract, name, value, targetName) {
      log.trigger(elapsedMs(), contract, name, value, targetName);
      tell();
    },
    subscribe(listener) {
      if (listeners.size === 0) target.addEventListener("scroll", tell);
      listeners.add(listener);
      return () => {
        if (!listeners.delete(listener)) return;
        if (listeners.size === 0) target.removeEventListener("scroll", tell);
      };
    },
  };
}
