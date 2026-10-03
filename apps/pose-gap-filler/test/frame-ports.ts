import type { FramePorts } from "../src/live/playback";

/** Animation frames run by hand: `advance(ms)` moves the clock, `frame()` runs one frame. */
export function manualFrames() {
  let now = 0;
  let nextId = 1;
  const pending = new Map<number, () => void>();
  const ports: FramePorts = {
    requestFrame(callback) {
      const id = nextId++;
      pending.set(id, callback);
      return id;
    },
    cancelFrame(id) {
      pending.delete(id);
    },
    now: () => now,
  };
  return {
    ports,
    get pending() {
      return pending.size;
    },
    advance(ms: number) {
      now += ms;
    },
    /** Runs every callback requested before this frame, as one browser animation frame does. */
    frame() {
      const callbacks = [...pending.values()];
      pending.clear();
      for (const callback of callbacks) callback();
    },
  };
}
