import type { Problem } from "./api";

/** The part of a page's clock the timeline drives. */
export interface TimedClock {
  play(): void;
  pause(): void;
  seek(progress: number): void;
  setRate(rate: number): void;
  setRange(fromMs?: number, toMs?: number): void;
  playing(): boolean;
  elapsed(): number | undefined;
}

/** What the canvas reads of a page's mount: its clock when timed, and a way to swap its scene. */
export interface MountView {
  readonly clock: TimedClock | undefined;
  readonly durationMs: number | undefined;
  replace(next: unknown): void;
}

const MOUNTS = Symbol.for("@gerak/dom/mounts");

function method(owner: object, name: string): ((...args: unknown[]) => unknown) | undefined {
  const found: unknown = Reflect.get(owner, name);
  if (typeof found !== "function") return undefined;
  return (...args) => Reflect.apply(found, owner, args);
}

function clockOf(driver: unknown): TimedClock | undefined {
  if (typeof driver !== "object" || driver === null) return undefined;
  const seek = method(driver, "seek");
  const play = method(driver, "play");
  const pause = method(driver, "pause");
  const setRate = method(driver, "setRate");
  const setRange = method(driver, "setRange");
  const playing = method(driver, "playing");
  const now = method(driver, "now");
  if (!seek || !play || !pause || !setRate || !setRange || !playing || !now) return undefined;
  return {
    play: () => void play(),
    pause: () => void pause(),
    seek: (progress) => void seek(progress),
    setRate: (rate) => void setRate(rate),
    setRange: (from, to) => void (from === undefined ? setRange() : setRange(from, to)),
    playing: () => playing() === true,
    elapsed() {
      const clock: unknown = Reflect.get(Object(now()), "clock");
      const elapsed: unknown = Reflect.get(Object(clock), "elapsed");
      return typeof elapsed === "number" ? elapsed : undefined;
    },
  };
}

/** The first mount a page window registered, or `undefined` before the page mounts. */
export function mountOf(win: Window | null | undefined): MountView | undefined {
  if (win === null || win === undefined) return undefined;
  const listed: unknown = Reflect.get(win, MOUNTS);
  const mounted: unknown = Array.isArray(listed) ? listed[0] : undefined;
  if (typeof mounted !== "object" || mounted === null) return undefined;
  const replace = method(mounted, "replace");
  if (replace === undefined) return undefined;
  const duration: unknown = Reflect.get(mounted, "durationMs");
  const clock = clockOf(Reflect.get(mounted, "driver"));
  return {
    clock,
    durationMs: typeof duration === "number" ? duration : undefined,
    replace: (next) => void replace(next),
  };
}

/** What a failed update says: the file and line Vite reports, or the thrown message. */
export function problemOfError(value: unknown): Problem {
  const loc: unknown = Reflect.get(Object(value), "loc");
  const file: unknown = Reflect.get(Object(loc), "file") ?? Reflect.get(Object(value), "id");
  const line: unknown = Reflect.get(Object(loc), "line");
  const message: unknown = Reflect.get(Object(value), "message");
  return {
    message: typeof message === "string" ? message : String(value),
    ...(typeof file === "string" ? { file } : {}),
    ...(typeof line === "number" ? { line } : {}),
  };
}

/** The Vite error payload of a `motion:error` event, which holds it under `err`. */
export function problemOfEvent(event: Event): Problem {
  const detail: unknown = Reflect.get(event, "detail");
  const err: unknown = Reflect.get(Object(detail), "err");
  return problemOfError(err ?? detail);
}

/** The scene a hot module hands over: its default export. */
export function sceneOf(event: Event): unknown {
  return Reflect.get(Object(Reflect.get(event, "detail")), "default");
}
