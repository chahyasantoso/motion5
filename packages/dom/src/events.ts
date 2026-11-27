import {
  inputLog,
  inputs,
  liveAt,
  pageInputs,
  type Input,
  type Point2d,
  type Time,
} from "@gerak/core";
import type { Driver } from "@gerak/player";
import { pageFrames, type FrameSource } from "./frames";

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

const WATCHED_TRIGGERS = [
  ["pointerenter", "enter"],
  ["pointerleave", "leave"],
  ["pointerdown", "down"],
  ["pointerup", "up"],
  ["click", "click"],
  ["focusin", "focus"],
  ["focusout", "blur"],
] as const;

const pointerTriggers = inputs({
  triggers: {
    enter: {},
    leave: {},
    down: {},
    up: {},
    click: {},
    focus: {},
    blur: {},
  },
});

/** The page events a watched element turns into triggers, and the name each gets. */
export const WATCHED: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(WATCHED_TRIGGERS),
);

/** A log of input entries, in order of `at`, and the watching that fills it. */
export interface EventRecorder {
  readonly log: Input;
  /** Logs an event by hand at `at` or the ms `now` gives, and tells `onRecord` that ms. */
  record(name: string, target?: string, point?: Point2d, at?: number): void;
  /** Logs a sample of a live number at `at` or the ms `now` gives, and tells `onRecord` that ms. */
  sample(name: string, value: number, target?: string, at?: number): void;
  /** Logs `WATCHED` events on `element` for `target`; the returned function stops it. */
  watch(target: string, element: EventSource): () => void;
  /** Forgets every entry logged. */
  clear(): void;
  /** Stops every watch. */
  dispose(): void;
}

/** A log of input entries stamped with `now()`, filled by hand or by watching elements. */
export function eventRecorder(
  now: () => number,
  onRecord: (at: number) => void = () => undefined,
  options?: { readonly windowMs?: number },
): EventRecorder {
  const log = inputLog(
    options?.windowMs === undefined ? undefined : { windowMs: options.windowMs },
  );
  const unwatch = new Set<() => void>();
  const record = (name: string, target?: string, point?: Point2d, explicitAt?: number): void => {
    const at = explicitAt ?? now();
    log.add({
      kind: "trigger",
      name,
      at,
      value: 1,
      ...(target === undefined ? {} : { target }),
      ...(point === undefined ? {} : { point }),
    });
    onRecord(at);
  };
  return {
    log: log.input,
    record,
    sample(name, value, target, explicitAt) {
      if (!Number.isFinite(value))
        throw new RangeError(`sample "${name}": the value must be a finite number, not ${value}.`);
      const at = explicitAt ?? now();
      if (name === "scroll" || name === "pointer-x" || name === "pointer-y") {
        log.set(at, pageInputs, name, value, target);
        onRecord(at);
        return;
      }
      log.add({
        kind: "value",
        name,
        at,
        value,
        ...(target === undefined ? {} : { target }),
      });
      onRecord(at);
    },
    watch(target, element) {
      const removers = WATCHED_TRIGGERS.map(([type, triggerName]) => {
        const listener = () => {
          const at = now();
          log.trigger(at, pointerTriggers, triggerName, 1, target);
          onRecord(at);
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
    clear() {
      log.clear();
    },
    dispose() {
      for (const stop of [...unwatch]) stop();
    },
  };
}

/** Settings of `eventDriver`: `settleMs` (default 2000 ms), `introMs` (0), `frames`, and `clock`. */
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
  emit(name: string, target?: string, point?: Point2d): void;
  dispose(): void;
}

/** A live clock that logs events: `.watch`, `.watchView` and `.emit`. `introMs` keeps frames coming for
 * an intro, `settleMs` after the last event. */
export function eventDriver(options: EventDriverOptions = {}): EventDriver {
  const frames = options.frames ?? pageFrames();
  const clock = options.clock ?? (() => globalThis.performance.now());
  const settleMs = options.settleMs ?? 2000;
  const windowMs = Math.max(settleMs, 4000);
  const start = clock();
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
  const recorder = eventRecorder(
    elapsed,
    (at) => {
      until = Math.max(until, at + settleMs);
      notify();
      run();
    },
    { windowMs },
  );
  const emit = (name: string, target?: string, point?: Point2d): void =>
    recorder.record(name, target, point);
  const driver: EventDriver = {
    now: (): Time => liveAt(elapsed()),
    events: (): Input => recorder.log,
    options,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    watch: recorder.watch,
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
      recorder.dispose();
      for (const stop of [...unwatch]) stop();
      listeners.clear();
    },
  };
  run();
  return driver;
}
