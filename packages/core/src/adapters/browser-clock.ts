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
    let firstError: unknown;
    let hasError = false;
    try {
      // Every listener gets its turn, and the next frame is requested in `finally` before any
      // error leaves this callback. A listener's own bug used to end the loop for good: the
      // reschedule sat after the dispatch, so one throw meant no further frame was ever
      // requested and every animation on the page stopped. The same policy as
      // PatchRegistry.closeBatch applies here, first error rethrown once state is settled.
      for (const listener of [...listeners]) {
        try {
          listener(event);
        } catch (error) {
          if (!hasError) {
            hasError = true;
            firstError = error;
          }
        }
      }
    } finally {
      if (!disposed) handle = source.requestFrame(frame);
    }
    if (hasError) throw firstError;
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
