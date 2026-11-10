import { describe, expect, it } from "vitest";
import { eventDriver, type EventSource, type FrameSource, type PointerLike } from "@gerak/dom";

function frames(): FrameSource & { run(): void; readonly waiting: number } {
  let queued = new Map<number, (time: number) => void>();
  let next = 1;
  return {
    requestFrame(listener) {
      queued.set(next, listener);
      return next++;
    },
    cancelFrame(handle) {
      queued.delete(handle);
    },
    run() {
      const due = queued;
      queued = new Map();
      for (const listener of due.values()) listener(0);
    },
    get waiting() {
      return queued.size;
    },
  };
}

function element(box?: {
  readonly left: number;
  readonly top: number;
}): EventSource & { fire(type: string, event?: PointerLike): void; readonly listening: number } {
  const listeners = new Map<string, Set<(event: PointerLike) => void>>();
  return {
    addEventListener(type, listener) {
      listeners.set(type, (listeners.get(type) ?? new Set()).add(listener));
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
    fire(type, event = {}) {
      for (const listener of listeners.get(type) ?? []) listener(event);
    },
    ...(box === undefined ? {} : { getBoundingClientRect: () => box }),
    get listening() {
      return [...listeners.values()].reduce((total, set) => total + set.size, 0);
    },
  };
}

describe("eventDriver", () => {
  it("runs a live clock from its creation and logs a watched element's events with their ms", () => {
    let ms = 1000;
    const source = frames();
    const driver = eventDriver({ frames: source, clock: () => ms, settleMs: 500 });
    const card = element();
    driver.watch("card", card);
    expect(driver.now()).toEqual({ progress: 0, clock: { kind: "live", elapsed: 0 } });
    ms = 1200;
    card.fire("pointerenter");
    ms = 1300;
    card.fire("pointerleave");
    card.fire("click");
    expect(driver.events?.()).toEqual([
      { name: "enter", at: 200, target: "card" },
      { name: "leave", at: 300, target: "card" },
      { name: "click", at: 300, target: "card" },
    ]);
  });

  it("keeps frames coming until the last event has had time to settle, then stops", () => {
    let ms = 0;
    const source = frames();
    const driver = eventDriver({ frames: source, clock: () => ms, settleMs: 500 });
    let steps = 0;
    driver.subscribe(() => (steps += 1));
    expect(source.waiting).toBe(0);
    driver.emit("go");
    expect(steps).toBe(1);
    ms = 400;
    source.run();
    expect(source.waiting).toBe(1);
    ms = 600;
    source.run();
    expect(source.waiting).toBe(0);
    expect(steps).toBe(3);
  });

  it("runs frames through an intro with no event, and lets go of every element when disposed", () => {
    const source = frames();
    const driver = eventDriver({ frames: source, clock: () => 0, introMs: 800 });
    expect(source.waiting).toBe(1);
    const card = element();
    driver.watch("card", card);
    expect(card.listening).toBe(7);
    driver.dispose();
    expect(card.listening).toBe(0);
    expect(source.waiting).toBe(0);
  });

  it("logs where on the watched element a pointer event happened", () => {
    const driver = eventDriver({ frames: frames(), clock: () => 0 });
    const stage = element({ left: 100, top: 40 });
    driver.watch("stage", stage);
    stage.fire("click", { clientX: 740, clientY: 400 });
    expect(driver.events?.()).toEqual([{ name: "click", at: 0, target: "stage", x: 640, y: 360 }]);
  });
});
