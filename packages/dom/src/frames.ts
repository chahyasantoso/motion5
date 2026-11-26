import type { Driver } from "@gerak/player";

/** Page tools set this while holding a paused fake clock. */
export const HELD_CLOCK = Symbol.for("@gerak/dom/held-clock");
/** A host sets a function `(info) => Driver | undefined` here; a live mount then runs on the driver it returns. */
export const DRIVER_HOOK = Symbol.for("@gerak/dom/driver");
const HELD_FRAMES = Symbol.for("@gerak/dom/held-frames");
const HELD_STEP = Symbol.for("@gerak/dom/held-step");

type FrameListener = (time: number) => void;

let nextHeldHandle = 1;

function heldQueue(): Map<unknown, unknown> {
  const existing: unknown = Reflect.get(globalThis, HELD_FRAMES);
  if (existing instanceof Map) return existing;
  const created = new Map<unknown, unknown>();
  Reflect.set(globalThis, HELD_FRAMES, created);
  return created;
}

function stepHeldFrames(): void {
  const raw: unknown = Reflect.get(globalThis, HELD_FRAMES);
  if (!(raw instanceof Map)) return;
  const listeners: unknown[] = [...raw.values()];
  raw.clear();
  const now = globalThis.performance.now();
  for (const listener of listeners) {
    if (typeof listener === "function") Reflect.apply(listener, undefined, [now]);
  }
}

/** Where frames come from: `requestAnimationFrame` on a page, a fake one in a test. */
export interface FrameSource {
  requestFrame(listener: (time: number) => void): number;
  cancelFrame(handle: number): void;
}

export function pageFrames(): FrameSource {
  if (Reflect.get(globalThis, HELD_CLOCK) === true) {
    if (typeof Reflect.get(globalThis, HELD_STEP) !== "function") {
      Reflect.set(globalThis, HELD_STEP, stepHeldFrames);
    }
    return {
      requestFrame: (listener) => {
        const queue = heldQueue();
        while (queue.has(nextHeldHandle)) nextHeldHandle += 1;
        const handle = nextHeldHandle;
        nextHeldHandle += 1;
        queue.set(handle, listener);
        return handle;
      },
      cancelFrame: (handle) => {
        const queue: unknown = Reflect.get(globalThis, HELD_FRAMES);
        if (queue instanceof Map) queue.delete(handle);
      },
    };
  }
  return {
    requestFrame: (listener) => globalThis.requestAnimationFrame(listener),
    cancelFrame: (handle) => globalThis.cancelAnimationFrame(handle),
  };
}

/** What a host's driver hook is told of the mount asking: the scene's length in ms and its root. */
export interface HostDriverInfo {
  readonly length: number;
  readonly root: unknown;
}

function isDriver(value: unknown): value is Driver {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "now") === "function" &&
    typeof Reflect.get(value, "subscribe") === "function"
  );
}

/** The driver the host's hook hands this mount, or undefined when there is no hook or it hands none. */
export function hostDriver(info: HostDriverInfo): Driver | undefined {
  const hook: unknown = Reflect.get(globalThis, DRIVER_HOOK);
  if (typeof hook !== "function") return undefined;
  const handed: unknown = Reflect.apply(hook, undefined, [info]);
  return isDriver(handed) ? handed : undefined;
}
