import type { Clock, ClockTick } from "../ports/clock";

export interface FrameSource {
  requestFrame(listener: (time: number) => void): number;
  cancelFrame(handle: number): void;
}

export function createBrowserClock(source: FrameSource): Clock & { dispose(): void } {
  const listeners = new Set<(event: ClockTick) => void>();
  let handle: number | undefined;
  let tick = 0;
  let previous = 0;
  let disposed = false;
  const frame = (time: number): void => {
    if (disposed) return;
    const delta = Math.max(0, time - previous);
    previous = time;
    tick += 1;
    const event = Object.freeze({ tick, time, delta });
    for (const listener of [...listeners]) listener(event);
    handle = source.requestFrame(frame);
  };
  handle = source.requestFrame(frame);
  return {
    subscribe(listener) {
      if (disposed) throw new Error("Clock is disposed.");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (handle !== undefined) source.cancelFrame(handle);
      listeners.clear();
    },
  };
}
