import { describe, expect, it } from "vitest";
import { inputs } from "@gerak/core";
import { play } from "@gerak/player";
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

  it("keeps its elapsed ms when its length changes, clamped to the new length", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, autoplay: false, frames: source });
    driver.seek(0.4);
    driver.setDuration(2000);
    expect(driver.now().clock).toEqual({ kind: "timed", elapsed: 400, length: 2000 });
    expect(driver.now().progress).toBe(0.2);
    driver.setDuration(300);
    expect(driver.now().clock).toEqual({ kind: "timed", elapsed: 300, length: 300 });
  });

  it("keeps playing and its range inside the new length when its length changes", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source });
    source.run(0);
    source.run(400);
    driver.setDuration(2000);
    expect(driver.playing()).toBe(true);
    source.run(500);
    expect(driver.now().clock).toEqual({ kind: "timed", elapsed: 500, length: 2000 });
    driver.setRange(600, 1800);
    driver.setDuration(1000);
    expect(driver.now().clock).toMatchObject({ length: 1000 });
    source.run(1500);
    expect(driver.now().clock).toEqual({ kind: "timed", elapsed: 800, length: 1000 });
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

  it("reports a timed clock when it is given a length, and records inputs at its elapsed ms or 0", () => {
    const page = { scrollY: 150, addEventListener() {}, removeEventListener() {} };
    const timed = scrollDriver({ target: page, start: 100, end: 300, length: 2000 });
    expect(timed.now()).toEqual({
      progress: 0.25,
      clock: { kind: "timed", elapsed: 500, length: 2000 },
    });
    const contract = inputs({ values: { level: {} }, triggers: { ping: {} } });
    timed.set(contract, "level", 3);
    timed.trigger(contract, "ping");
    expect(timed.input()).toEqual([
      { kind: "value", name: "level", at: 500, value: 3 },
      { kind: "trigger", name: "ping", at: 500, value: 1 },
    ]);

    const untimed = scrollDriver({ target: page, start: 100, end: 300 });
    untimed.set(contract, "level", 7);
    expect(untimed.input()).toEqual([{ kind: "value", name: "level", at: 0, value: 7 }]);
  });
});

describe("clockDriver input port", () => {
  const voice = inputs({
    values: { mouthOpen: {}, blink: {} },
    triggers: { click: { targets: ["card"] }, enter: { targets: ["card"] } },
  });
  const seen = (driver: ReturnType<typeof clockDriver>) =>
    play((_time, events) => ({ names: events.map(({ name }) => name) }), driver).values.names;

  it("keeps inputs across a seek, shows them only from their ms, and forgets them on replay", () => {
    const source = frames();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    driver.seek(0.5);
    driver.trigger(voice, "enter", 1, "card");
    expect(driver.input()).toEqual([
      { kind: "trigger", name: "enter", at: 1000, value: 1, target: "card" },
    ]);
    driver.seek(0.75);
    expect(seen(driver)).toEqual(["enter"]);
    driver.seek(0.25);
    expect(seen(driver)).toEqual([]);
    expect(driver.input()).toHaveLength(1);
    driver.seek(0.75);
    expect(seen(driver)).toEqual(["enter"]);
    driver.replay();
    driver.pause();
    driver.seek(0.75);
    expect(driver.input()).toEqual([]);
    expect(seen(driver)).toEqual([]);
  });

  it("forgets its log when a loop wraps and notifies forgets listeners", () => {
    const looping = frames();
    const loop = clockDriver({ duration: 1000, frames: looping, repeat: 3, reducedMotion: "play" });
    let forgotten = 0;
    const stop = loop.forgets(() => {
      forgotten += 1;
    });
    looping.run(0);
    looping.run(600);
    loop.trigger(voice, "click", 1, "card");
    expect(loop.input()).toHaveLength(1);
    looping.run(1200);
    expect(loop.input()).toEqual([]);
    expect(forgotten).toBe(1);
    stop();
  });

  it("logs a value at its ms and runs on past its end until it settles", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source, reducedMotion: "play" });
    source.run(0);
    source.run(1200);
    expect(driver.playing()).toBe(false);
    driver.set(voice, "mouthOpen", 0.6);
    expect(driver.input()).toEqual([{ kind: "value", name: "mouthOpen", at: 1000, value: 0.6 }]);
    expect(driver.playing()).toBe(true);
    source.run(2000);
    source.run(2500);
    expect(driver.now().clock).toEqual({ kind: "timed", elapsed: 1500, length: 1000 });
    source.run(4100);
    expect(driver.playing()).toBe(false);
    expect(() => driver.set(voice, "mouthOpen", Number.NaN)).toThrow(/finite/);
  });

  it("forgets its values on replay, and stops at the end of the next run", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source, reducedMotion: "play" });
    source.run(0);
    driver.set(voice, "blink", 1);
    driver.replay();
    expect(driver.input()).toEqual([]);
    source.run(5000);
    source.run(6100);
    expect(driver.playing()).toBe(false);
  });

  it("stops at its end when no input arrived", () => {
    const source = frames();
    const driver = clockDriver({ duration: 1000, frames: source, reducedMotion: "play" });
    source.run(0);
    source.run(1200);
    expect(driver.playing()).toBe(false);
  });

  it("tells subscribers when an input is recorded", () => {
    const driver = clockDriver({ duration: 2000, frames: frames(), autoplay: false });
    let heard = 0;
    driver.subscribe(() => (heard += 1));
    driver.trigger(voice, "click", 1, "card");
    expect(heard).toBe(1);
    driver.dispose();
  });
});
