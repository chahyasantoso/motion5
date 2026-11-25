/** Page tools set this while holding a paused fake clock. */
export const HELD_CLOCK = Symbol.for("@gerak/dom/held-clock");
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
