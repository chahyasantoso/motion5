import { atProgress, createLoopCycle, type LoopCycle, type Time } from "@motion5/moves";
import type { Driver } from "@motion5/player";
import { unreachable } from "./unreachable";

/** Where frames come from: `requestAnimationFrame` on a page, a fake one in a test. */
export interface FrameSource {
  requestFrame(listener: (time: number) => void): number;
  cancelFrame(handle: number): void;
}

export function pageFrames(): FrameSource {
  return {
    requestFrame: (listener) => globalThis.requestAnimationFrame(listener),
    cancelFrame: (handle) => globalThis.cancelAnimationFrame(handle),
  };
}

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
}

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
  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };
  const frame = (at: number): void => {
    handle = undefined;
    const delta = previous === undefined ? 0 : Math.max(0, at - previous);
    previous = at;
    progress = cycle.advance(delta).progress;
    notify();
    if (cycle.state.kind === "running") handle = frames.requestFrame(frame);
  };
  const stop = (): void => {
    if (handle !== undefined) frames.cancelFrame(handle);
    handle = undefined;
    previous = undefined;
  };
  const driver: ClockDriver = {
    now: () => ({
      progress,
      clock: { kind: "timed", elapsed: progress * options.duration, length: options.duration },
    }),
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    play() {
      if (still) return;
      if (handle === undefined && cycle.state.kind === "running")
        handle = frames.requestFrame(frame);
    },
    pause: stop,
    seek(next) {
      stop();
      progress = Math.max(0, Math.min(1, next));
      cycle = fresh(undefined);
      cycle.advance(progress * options.duration);
      notify();
    },
    replay() {
      stop();
      cycle = fresh(options.delay);
      progress = still ? 1 : 0;
      notify();
      driver.play();
    },
    dispose() {
      stop();
      listeners.clear();
    },
  };
  if (options.autoplay !== false) driver.play();
  return driver;
}

/** What a scroll driver reads: a window or a scrolling element. */
export interface ScrollTarget {
  readonly scrollY?: number;
  readonly scrollTop?: number;
  addEventListener(type: "scroll", listener: () => void): void;
  removeEventListener(type: "scroll", listener: () => void): void;
}

/** A driver from 0 to 1 as the target scrolls from `start` to `end` px; it has no clock. */
export function scrollDriver(options: {
  readonly target?: ScrollTarget;
  readonly start: number;
  readonly end: number;
}): Driver {
  const target: ScrollTarget = options.target ?? {
    get scrollY() {
      return globalThis.scrollY;
    },
    addEventListener: (type, listener) => globalThis.addEventListener(type, listener),
    removeEventListener: (type, listener) => globalThis.removeEventListener(type, listener),
  };
  const offset = (): number => target.scrollY ?? target.scrollTop ?? 0;
  const span = options.end - options.start;
  const now = (): Time =>
    atProgress(span <= 0 ? 1 : Math.max(0, Math.min(1, (offset() - options.start) / span)));
  return {
    now,
    subscribe(listener) {
      target.addEventListener("scroll", listener);
      return () => target.removeEventListener("scroll", listener);
    },
  };
}
