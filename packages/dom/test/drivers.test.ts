import { describe, expect, it } from "vitest";
import { clockDriver, scrollDriver, type FrameSource } from "@gerak/dom";

function frames(): FrameSource & { run(at: number): void; readonly waiting: number } {
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
    run(at) {
      const due = queued;
      queued = new Map();
      for (const listener of due.values()) listener(at);
    },
    get waiting() {
      return queued.size;
    },
  };
}

describe("clockDriver under reduced motion", () => {
  it("shows the end and asks for no frame when the person prefers reduced motion", () => {
    const source = frames();
    const driver = clockDriver({
      duration: 1000,
      frames: source,
      prefersReducedMotion: () => true,
    });
    expect(driver.now().progress).toBe(1);
    expect(driver.now().clock).toEqual({ kind: "timed", elapsed: 1000, length: 1000 });
    expect(source.waiting).toBe(0);
    driver.replay();
    expect(driver.now().progress).toBe(1);
    expect(source.waiting).toBe(0);
  });

  it("plays as usual when the scene opts out, or when nobody asked", () => {
    for (const driver of [
      clockDriver({
        duration: 1000,
        frames: frames(),
        prefersReducedMotion: () => true,
        reducedMotion: "play",
      }),
      clockDriver({ duration: 1000, frames: frames(), prefersReducedMotion: () => false }),
    ])
      expect(driver.now().progress).toBe(0);
  });

  it("still seeks when the person scrubs", () => {
    const driver = clockDriver({
      duration: 1000,
      frames: frames(),
      prefersReducedMotion: () => true,
    });
    driver.seek(0.5);
    expect(driver.now().progress).toBe(0.5);
  });

  it("plays from the start when driver.play() is called directly", () => {
    const source = frames();
    const driver = clockDriver({
      duration: 1000,
      frames: source,
      prefersReducedMotion: () => true,
    });
    expect(driver.now().progress).toBe(1);
    expect(source.waiting).toBe(0);
    driver.play();
    expect(driver.now().progress).toBe(0);
    expect(source.waiting).toBe(1);
    source.run(0);
    source.run(250);
    expect(driver.now().progress).toBe(0.25);
  });
});

describe("clockDriver", () => {
  it("advances by the frames' own time from the first frame, and stops at the end", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source });
    source.run(5000);
    expect(driver.now().progress).toBe(0);
    source.run(5250);
    expect(driver.now()).toEqual({
      progress: 0.25,
      clock: { kind: "timed", elapsed: 250, length: 1000 },
    });
    source.run(6500);
    expect(driver.now().progress).toBe(1);
    expect(source.waiting).toBe(0);
  });

  it("holds at the start through its delay", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, delay: 500, frames: source });
    source.run(0);
    source.run(400);
    expect(driver.now().progress).toBe(0);
    source.run(750);
    expect(driver.now().progress).toBe(0.25);
  });

  it("tells subscribers on each frame", () => {
    const source = frames();
    const driver = clockDriver({ duration: 100, frames: source });
    const seen: number[] = [];
    driver.subscribe(() => seen.push(driver.now().progress));
    source.run(0);
    source.run(50);
    expect(seen).toEqual([0, 0.5]);
  });

  it("replays from the start, and seeks while paused", () => {
    const source = frames();
    const driver = clockDriver({ duration: 100, frames: source });
    source.run(0);
    source.run(100);
    driver.replay();
    source.run(1000);
    expect(driver.now().progress).toBe(0);
    driver.pause();
    driver.seek(0.6);
    expect(driver.now().progress).toBe(0.6);
    expect(source.waiting).toBe(0);
  });

  it("waits for play when it does not start on its own", () => {
    const source = frames();
    const driver = clockDriver({ duration: 100, frames: source, autoplay: false });
    expect(source.waiting).toBe(0);
    driver.play();
    expect(source.waiting).toBe(1);
  });

  it("says whether it is playing, and tells subscribers each time that changes", () => {
    const source = frames();
    const driver = clockDriver({ duration: 100, frames: source });
    const seen: boolean[] = [];
    driver.subscribe(() => seen.push(driver.playing()));
    expect(driver.playing()).toBe(true);
    driver.pause();
    driver.pause();
    driver.play();
    driver.play();
    expect(seen).toEqual([false, true]);
    driver.seek(0.5);
    expect(driver.playing()).toBe(false);
    driver.play();
    source.run(0);
    source.run(100);
    expect(driver.now().progress).toBe(1);
    expect(seen.at(-1)).toBe(false);
    expect(driver.playing()).toBe(false);
    driver.replay();
    expect(seen.at(-1)).toBe(true);
  });

  it("stops when a subscriber pauses it during a frame", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source });
    driver.subscribe(() => {
      if (driver.now().progress >= 0.25) driver.pause();
    });
    source.run(0);
    source.run(250);
    expect(source.waiting).toBe(0);
    expect(driver.playing()).toBe(false);
  });

  it("keeps its delay when a range that was never set is cleared", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, delay: 500, frames: source });
    driver.setRange();
    source.run(0);
    source.run(400);
    expect(driver.now().progress).toBe(0);
  });

  it("advances at half speed when rate is 0.5", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source });
    driver.setRate(0.5);
    source.run(0);
    expect(driver.now().progress).toBe(0);
    source.run(1000);
    expect(driver.now()).toEqual({
      progress: 0.5,
      clock: { kind: "timed", elapsed: 500, length: 1000 },
    });
  });

  it("loops within a range and wraps back to fromMs exactly", () => {
    const source = frames();
    const driver = clockDriver({ duration: 2000, frames: source });
    driver.setRange(800, 1600);
    expect(driver.now().clock).toEqual({
      kind: "timed",
      elapsed: 800,
      length: 2000,
    });
    expect(driver.now().progress).toBe(800 / 2000);
    source.run(0);
    source.run(800);
    expect(driver.now().progress).toBe(800 / 2000);
    expect(driver.now().clock).toEqual({
      kind: "timed",
      elapsed: 800,
      length: 2000,
    });
    expect(source.waiting).toBe(1);
  });
});

describe("scrollDriver", () => {
  it("runs from 0 to 1 between two scroll offsets, untimed", () => {
    const listeners = new Set<() => void>();
    const page = {
      scrollY: 0,
      addEventListener(_: "scroll", listener: () => void) {
        listeners.add(listener);
      },
      removeEventListener(_: "scroll", listener: () => void) {
        listeners.delete(listener);
      },
    };
    const driver = scrollDriver({ target: page, start: 100, end: 300 });
    const seen: number[] = [];
    const leave = driver.subscribe(() => seen.push(driver.now().progress));
    page.scrollY = 200;
    for (const listener of listeners) listener();
    expect(driver.now()).toEqual({ progress: 0.5, clock: { kind: "untimed" } });
    page.scrollY = 999;
    for (const listener of listeners) listener();
    expect(seen).toEqual([0.5, 1]);
    leave();
    expect(listeners.size).toBe(0);
  });
});
