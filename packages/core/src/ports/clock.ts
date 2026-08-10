export interface ClockTick {
  readonly tick: number;
  readonly time: number;
  readonly delta: number;
}

export interface Clock {
  subscribe(listener: (event: ClockTick) => void): () => void;
}

export function assertClock(clock: unknown, context = "Clock"): asserts clock is Clock {
  if (!clock || typeof (clock as { subscribe?: unknown }).subscribe !== "function") {
    throw new TypeError(`${context} requires subscribe(listener).`);
  }
}

export function createManualClock(): Clock & {
  readonly tickNumber: number;
  readonly time: number;
  tick(delta?: number): number;
  dispose(): void;
} {
  const listeners = new Set<(event: ClockTick) => void>();
  let tickNumber = 0;
  let time = 0;
  let disposed = false;

  return {
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("Clock listener must be a function.");
      if (disposed) throw new Error("Clock is disposed.");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    tick(delta = 0) {
      if (disposed) throw new Error("Clock is disposed.");
      if (!Number.isFinite(delta) || delta < 0) {
        throw new TypeError("Clock delta must be a finite non-negative number.");
      }
      tickNumber += 1;
      time += delta;
      const event = Object.freeze({ tick: tickNumber, time, delta });
      for (const listener of [...listeners]) listener(event);
      return tickNumber;
    },
    get tickNumber() {
      return tickNumber;
    },
    get time() {
      return time;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.clear();
    },
  };
}
