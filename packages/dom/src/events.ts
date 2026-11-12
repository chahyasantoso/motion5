import { liveAt, type Events, type MotionEvent, type Time } from "@gerak/moves";
import type { Driver } from "@gerak/player";
import { pageFrames, type FrameSource } from "./drivers";

/** What a pointer event says about where it happened. */
export interface PointerLike {
  readonly clientX?: number;
  readonly clientY?: number;
}

/** Something that sends DOM events: an element, or a stand-in in a test. */
export interface EventSource {
  addEventListener(type: string, listener: (event: PointerLike) => void): void;
  removeEventListener(type: string, listener: (event: PointerLike) => void): void;
  getBoundingClientRect?(): { readonly left: number; readonly top: number };
}

/** The page events a watched element turns into motion events, and the name each gets. */
export const WATCHED: Readonly<Record<string, string>> = Object.freeze({
  pointerenter: "enter",
  pointerleave: "leave",
  pointerdown: "down",
  pointerup: "up",
  click: "click",
  focusin: "focus",
  focusout: "blur",
});

/** Settings of `eventDriver`: `settleMs` (default 2000 ms), `introMs` (0), `frames` and `clock`. */
export interface EventDriverOptions {
  /** How long frames keep coming after the last event, for a response to settle; default 2000 ms. */
  readonly settleMs?: number;
  /** Frames keep coming until this ms even with no event, for an intro placed with `span`; default 0. */
  readonly introMs?: number;
  readonly frames?: FrameSource;
  /** The page's clock in ms; default `performance.now`. */
  readonly clock?: () => number;
}

/** A live driver: its clock runs from creation, and it logs the events of the elements it watches. */
export interface EventDriver extends Driver {
  /** Logs `enter`, `leave`, `down`, `up`, `click`, `focus` and `blur` on `element` as events for `target`. */
  watch(target: string, element: EventSource): () => void;
  /** Logs `in-view` and `out-of-view` for `target` as `element` crosses `threshold` of itself in view. */
  watchView(target: string, element: Element, threshold?: number): () => void;
  /** Logs an event by hand, such as a key press the page handles itself, at a point when it has one. */
  emit(name: string, target?: string, point?: { readonly x: number; readonly y: number }): void;
  dispose(): void;
}

/** A live clock that logs events: `.watch`, `.watchView` and `.emit`. `introMs` keeps frames coming for
 * an intro, `settleMs` after the last event. */
export function eventDriver(options: EventDriverOptions = {}): EventDriver {
  const frames = options.frames ?? pageFrames();
  const clock = options.clock ?? (() => globalThis.performance.now());
  const settleMs = options.settleMs ?? 2000;
  const start = clock();
  const log: MotionEvent[] = [];
  const listeners = new Set<() => void>();
  const unwatch = new Set<() => void>();
  let until = options.introMs ?? 0;
  let handle: number | undefined;
  const elapsed = (): number => clock() - start;
  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };
  const frame = (): void => {
    handle = undefined;
    notify();
    if (elapsed() < until) handle = frames.requestFrame(frame);
  };
  const run = (): void => {
    if (handle === undefined && elapsed() < until) handle = frames.requestFrame(frame);
  };
  const emit = (
    name: string,
    target?: string,
    point?: { readonly x: number; readonly y: number },
  ): void => {
    const at = elapsed();
    log.push({ name, at, ...(target === undefined ? {} : { target }), ...(point ?? {}) });
    until = Math.max(until, at + settleMs);
    notify();
    run();
  };
  const driver: EventDriver = {
    now: (): Time => liveAt(elapsed()),
    events: (): Events => log,
    options,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    watch(target, element) {
      const removers = Object.entries(WATCHED).map(([type, name]) => {
        const listener = (event: PointerLike) => {
          const box = element.getBoundingClientRect?.();
          const point =
            box === undefined || event.clientX === undefined || event.clientY === undefined
              ? undefined
              : { x: event.clientX - box.left, y: event.clientY - box.top };
          emit(name, target, point);
        };
        element.addEventListener(type, listener);
        return () => element.removeEventListener(type, listener);
      });
      const stop = () => {
        for (const remove of removers) remove();
        unwatch.delete(stop);
      };
      unwatch.add(stop);
      return stop;
    },
    watchView(target, element, threshold = 0.5) {
      let inside = false;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const now = entry.intersectionRatio >= threshold;
            if (now !== inside) emit(now ? "in-view" : "out-of-view", target);
            inside = now;
          }
        },
        { threshold: [0, threshold, 1] },
      );
      observer.observe(element);
      const stop = () => {
        observer.disconnect();
        unwatch.delete(stop);
      };
      unwatch.add(stop);
      return stop;
    },
    emit,
    dispose() {
      if (handle !== undefined) frames.cancelFrame(handle);
      handle = undefined;
      for (const stop of [...unwatch]) stop();
      listeners.clear();
    },
  };
  run();
  return driver;
}
