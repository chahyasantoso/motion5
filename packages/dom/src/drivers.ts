import { atProgress, createLoopCycle, type Events, type LoopCycle, type Time } from "@gerak/moves";
import type { Driver } from "@gerak/player";
import { eventRecorder, type EventSource } from "./events";
import { pageFrames, type FrameSource } from "./frames";
import { unreachable } from "./unreachable";

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
  /** Whether frames are advancing it now; subscribers hear each change. */
  playing(): boolean;
  /** Logs the pointer events of `element` for `target` at the clock's ms, and keeps the clock running past its
   * end while any is watched; a seek keeps the log, `replay` forgets it. */
  watch(target: string, element: EventSource): () => void;
  events(): Events;
}

/** A timed clock on the page's frames. Under reduced motion it shows the last frame and never ticks
 * until `.play()`; `reducedMotion: "play"` opts out. */
export function clockDriver(options: ClockOptions): ClockDriver {
  const frames = options.frames ?? pageFrames();
  const listeners = new Set<() => void>();
  const fresh = (delay: number | undefined): LoopCycle =>
    createLoopCycle({
      duration: options.duration,
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
  // While it watches a member the clock runs on past the end, so a later hover still plays out.
  let watching = 0;
  let overtime = 0;
  const elapsedNow = (): number => progress * options.duration + overtime;
  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };
  const recorder = eventRecorder(elapsedNow, () => notify());
  // A listener may pause or play during `notify`, so the next frame is asked for only after it.
  const request = (): void => {
    if (running && handle === undefined) handle = frames.requestFrame(frame);
  };
  const frame = (at: number): void => {
    handle = undefined;
    const delta = (previous === undefined ? 0 : Math.max(0, at - previous)) * rate;
    previous = at;
    if (range !== undefined) {
      let elapsed = progress * options.duration + delta;
      const span = range.to - range.from;
      if (span > 0 && elapsed >= range.to) {
        const wraps = Math.floor((elapsed - range.from) / span);
        if (wraps > 0) elapsed -= wraps * span;
      }
      progress = options.duration > 0 ? elapsed / options.duration : 0;
      cycle = fresh(undefined);
      cycle.advance(elapsed);
    } else if (cycle.state.kind === "finished" && watching > 0) {
      overtime += delta;
    } else {
      progress = cycle.advance(delta).progress;
      if (cycle.state.kind === "finished" && watching === 0) running = false;
    }
    notify();
    request();
  };
  const stop = (): void => {
    if (handle !== undefined) frames.cancelFrame(handle);
    handle = undefined;
    previous = undefined;
    running = false;
  };
  const start = (): void => {
    if (progress >= 1 || cycle.state.kind === "finished") {
      overtime = 0;
      cycle = fresh(undefined);
      progress =
        range !== undefined ? (options.duration > 0 ? range.from / options.duration : 0) : 0;
      if (range !== undefined && range.from > 0) cycle.advance(range.from);
    }
    running = true;
    request();
  };
  const driver: ClockDriver = {
    now: () => ({
      progress,
      clock: { kind: "timed", elapsed: elapsedNow(), length: options.duration },
    }),
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
    watch(target, element) {
      const unwatch = recorder.watch(target, element);
      watching += 1;
      let watched = true;
      return () => {
        if (!watched) return;
        watched = false;
        watching -= 1;
        unwatch();
      };
    },
    events: () => recorder.log,
    seek(next) {
      stop();
      overtime = 0;
      progress = Math.max(0, Math.min(1, next));
      cycle = fresh(undefined);
      cycle.advance(progress * options.duration);
      notify();
    },
    replay() {
      stop();
      overtime = 0;
      recorder.clear();
      cycle = fresh(options.delay);
      progress = still ? 1 : 0;
      if (!still) start();
      notify();
    },
    dispose() {
      stop();
      recorder.dispose();
      listeners.clear();
    },
    setRate(next) {
      rate = Math.max(0, next);
    },
    setRange(fromMs?: number, toMs?: number) {
      if (fromMs !== undefined && toMs !== undefined) {
        const from = Math.max(0, Math.min(options.duration, fromMs));
        const to = Math.max(from, Math.min(options.duration, toMs));
        if (to > from) {
          range = { from, to };
          overtime = 0;
          const elapsed = progress * options.duration;
          if (elapsed < from || elapsed > to) {
            progress = options.duration > 0 ? from / options.duration : 0;
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
      cycle.advance(progress * options.duration);
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
  const now = (): Time => {
    const progress = span <= 0 ? 1 : Math.max(0, Math.min(1, (offset() - options.start) / span));
    return length === undefined
      ? atProgress(progress)
      : { progress, clock: { kind: "timed", elapsed: progress * length, length } };
  };
  return {
    now,
    options,
    subscribe(listener) {
      target.addEventListener("scroll", listener);
      return () => target.removeEventListener("scroll", listener);
    },
  };
}
