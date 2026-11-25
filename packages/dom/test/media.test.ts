import { beat, box, scene } from "@gerak/stage";
import type { Driver } from "@gerak/player";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  mount,
  type ClockDriver,
  type FrameSource,
  type PageElement,
  type PageRoot,
  type PageStyle,
} from "../src";
import { mediaStep } from "../src/media";

const HELD_CLOCK = Symbol.for("@gerak/dom/held-clock");

function isClock(driver: Driver): driver is ClockDriver {
  return "seek" in driver && typeof driver.seek === "function";
}

class FakeStyle implements PageStyle {
  transform = "";
  opacity = "";
  zIndex = "";
  transformOrigin = "";
  transformBox = "";
  filter = "";
  clipPath = "";
  strokeDasharray = "";
  strokeDashoffset = "";
  visibility = "";
  display = "";
  whiteSpace = "";
  position = "";
  setProperty(): void {}
  removeProperty(): void {}
}

class FakeNode implements PageElement {
  readonly style = new FakeStyle();
  readonly attributes = new Map<string, string>();
  readonly listeners = new Map<string, Set<(event: never) => void>>();
  textContent: string | null = "";
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 320;
  offsetHeight = 180;

  constructor(readonly id: string) {}

  matches(selector: string): boolean {
    const cast = /^\[data-cast="(.*)"\]$/.exec(selector);
    return cast !== null && (this.attributes.get("data-cast") ?? this.id) === cast[1];
  }

  addEventListener(type: string, listener: (event: never) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: never) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) {
      Reflect.apply(listener, undefined, [{}]);
    }
  }
}

class FakeMediaElement extends FakeNode {
  duration = 5;
  paused = false;
  seeking = false;
  readyState = 4;
  pauseCalls = 0;
  playCalls = 0;
  seekWrites: number[] = [];
  playReject: Error | undefined = undefined;
  private time = 0;

  get currentTime(): number {
    return this.time;
  }

  set currentTime(value: number) {
    this.time = value;
    this.seekWrites.push(value);
  }

  pause(): void {
    this.paused = true;
    this.pauseCalls += 1;
  }

  play(): Promise<void> {
    this.playCalls += 1;
    if (this.playReject !== undefined) {
      return Promise.reject(this.playReject);
    }
    this.paused = false;
    return Promise.resolve();
  }
}

class FakeRoot implements PageRoot {
  constructor(readonly nodes: readonly FakeNode[]) {}

  querySelector(selector: string): PageElement | null {
    return this.nodes.find((node) => node.matches(selector)) ?? null;
  }

  querySelectorAll(selector: string): readonly PageElement[] {
    return this.nodes.filter((node) => node.matches(selector));
  }
}

function fakeFrames(): FrameSource & { tick(ms: number): void } {
  let next = 1;
  const callbacks = new Map<number, (time: number) => void>();
  return {
    requestFrame(listener) {
      const id = next;
      next += 1;
      callbacks.set(id, listener);
      return id;
    },
    cancelFrame(handle) {
      callbacks.delete(handle);
    },
    tick(ms) {
      const batch = [...callbacks.entries()];
      callbacks.clear();
      for (const [, listener] of batch) listener(ms);
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, HELD_CLOCK);
});

describe("mediaStep", () => {
  it("seeks exactly when held and off by more than 0.0005 s", () => {
    expect(
      mediaStep({
        held: true,
        visible: true,
        target: 1.25,
        previousTarget: 1.0,
        realDt: 16,
        currentTime: 1.0,
        paused: false,
      }),
    ).toEqual({ seek: 1.25, playback: "pause" });

    expect(
      mediaStep({
        held: true,
        visible: true,
        target: 1.25,
        previousTarget: 1.25,
        realDt: 16,
        currentTime: 1.2503,
        paused: true,
      }),
    ).toEqual({ playback: "keep" });
  });

  it("pauses when hidden even on a held clock", () => {
    expect(
      mediaStep({
        held: true,
        visible: false,
        target: 0.5,
        previousTarget: 0.4,
        realDt: 16,
        currentTime: 0.1,
        paused: false,
      }),
    ).toEqual({ playback: "pause" });
  });

  it("plays when running forward and corrects drift over 1/30 s", () => {
    expect(
      mediaStep({
        held: false,
        visible: true,
        target: 0.516,
        previousTarget: 0.5,
        realDt: 16,
        currentTime: 0.5,
        paused: true,
      }),
    ).toEqual({ seek: 0.516, playback: "play" });

    expect(
      mediaStep({
        held: false,
        visible: true,
        target: 0.532,
        previousTarget: 0.516,
        realDt: 16,
        currentTime: 0.52,
        paused: false,
      }),
    ).toEqual({ playback: "keep" });

    expect(
      mediaStep({
        held: false,
        visible: true,
        target: 0.532,
        previousTarget: 0.516,
        realDt: 16,
        currentTime: 0.6,
        paused: false,
      }),
    ).toEqual({ seek: 0.532, playback: "keep" });
  });

  it("pauses and seeks on a jump or scrub", () => {
    expect(
      mediaStep({
        held: false,
        visible: true,
        target: 2.0,
        previousTarget: 0.5,
        realDt: 16,
        currentTime: 0.5,
        paused: false,
      }),
    ).toEqual({ seek: 2.0, playback: "pause" });
  });
});

describe("mount media bindings", () => {
  it("refuses a non-media node with media: true", () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    const node = new FakeNode("clip");
    const root = new FakeRoot([node]);
    const piece = scene({ length: 1000 }, box("clip", { media: true }));
    expect(() => mount(piece, { root, clock: "timed", frames: fakeFrames() })).toThrow(
      'mount: "clip" has media: true but [data-cast="clip"] is not a <video> or <audio>.',
    );
  });

  it("pauses on bind, seeks precisely on a held clock, and pauses while hidden", () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    Reflect.set(globalThis, HELD_CLOCK, true);
    const video = new FakeMediaElement("clip");
    video.duration = 0.8;
    const root = new FakeRoot([video]);
    const show = beat("show", 1000, { at: 500 });
    const piece = scene({ length: 2000 }, box("clip", { media: true }).shows(show));
    let driver: Driver | undefined;
    const mounted = mount(piece, {
      root,
      clock: "timed",
      frames: fakeFrames(),
      onDriver: (d) => {
        driver = d;
      },
    });
    expect(video.pauseCalls).toBeGreaterThanOrEqual(1);
    expect(video.paused).toBe(true);
    expect(driver !== undefined && isClock(driver)).toBe(true);
    if (driver === undefined || !isClock(driver)) return;

    driver.seek(0.1);
    expect(video.paused).toBe(true);
    expect(video.style.visibility).toBe("hidden");

    driver.seek(0.5);
    expect(video.style.visibility).toBe("");
    expect(video.currentTime).toBeCloseTo(0.5);
    expect(video.paused).toBe(true);

    driver.seek(0.7);
    expect(video.currentTime).toBeCloseTo(0.8);

    driver.seek(0.8);
    expect(video.style.visibility).toBe("hidden");
    expect(video.paused).toBe(true);

    mounted.dispose();
  });

  it("plays forward on a running clock, corrects drift, and pauses on a scrub jump", async () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    const video = new FakeMediaElement("clip");
    const root = new FakeRoot([video]);
    const frames = fakeFrames();
    let clockNow = 0;
    const piece = scene({ length: 3000 }, box("clip", { media: true }));
    let driver: Driver | undefined;
    const mounted = mount(piece, {
      root,
      clock: "timed",
      frames,
      now: () => clockNow,
      onDriver: (d) => {
        driver = d;
      },
    });
    expect(video.paused).toBe(true);
    expect(driver !== undefined && isClock(driver)).toBe(true);
    if (driver === undefined || !isClock(driver)) return;

    clockNow = 0;
    frames.tick(0);
    clockNow = 16;
    frames.tick(16);
    expect(video.paused).toBe(false);
    expect(video.playCalls).toBe(1);
    expect(video.currentTime).toBeCloseTo(0.016);

    video.currentTime = 0.25;
    clockNow = 32;
    frames.tick(32);
    expect(video.paused).toBe(false);
    expect(video.currentTime).toBeCloseTo(0.032);

    clockNow = 48;
    driver.seek(0.8);
    expect(video.paused).toBe(true);
    expect(video.currentTime).toBeCloseTo(2.4);

    mounted.dispose();
    expect(video.paused).toBe(true);
    expect(video.currentTime).toBeCloseTo(2.4);
  });

  it("swallows a rejected play promise and falls back to seeking", async () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    const video = new FakeMediaElement("clip");
    video.playReject = new Error("NotAllowedError");
    const root = new FakeRoot([video]);
    const frames = fakeFrames();
    let clockNow = 0;
    const piece = scene({ length: 1000 }, box("clip", { media: true }));
    const mounted = mount(piece, {
      root,
      clock: "timed",
      frames,
      now: () => clockNow,
    });
    frames.tick(0);
    clockNow = 16;
    frames.tick(16);
    await Promise.resolve();
    expect(video.paused).toBe(true);
    expect(video.currentTime).toBeCloseTo(0.016);
    mounted.dispose();
  });

  it("settled resolves at once without media, and waits for loadeddata and seeked with media", async () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    const plain = new FakeNode("card");
    const plainMount = mount(scene({ length: 500 }, box("card")), {
      root: new FakeRoot([plain]),
      clock: "timed",
      frames: fakeFrames(),
    });
    await expect(plainMount.settled()).resolves.toBeUndefined();
    plainMount.dispose();

    const video = new FakeMediaElement("clip");
    video.readyState = 0;
    video.seeking = true;
    const mounted = mount(scene({ length: 1000 }, box("clip", { media: true })), {
      root: new FakeRoot([video]),
      clock: "timed",
      frames: fakeFrames(),
    });
    let resolved = false;
    const pending = mounted.settled().then(() => {
      resolved = true;
    });
    await Promise.resolve();
    expect(resolved).toBe(false);

    video.readyState = 2;
    video.fire("loadeddata");
    await Promise.resolve();
    expect(resolved).toBe(false);

    video.seeking = false;
    video.fire("seeked");
    await pending;
    expect(resolved).toBe(true);
    mounted.dispose();
  });

  it("reports media clips with clipMs, from, and to", () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    const a = new FakeMediaElement("a");
    a.duration = 2.5;
    const b = new FakeMediaElement("b");
    b.duration = Number.NaN;
    const showA = beat("showA", 900, { at: 300 });
    const mounted = mount(
      scene({ length: 2000 }, box("a", { media: true }).shows(showA), box("b", { media: true })),
      {
        root: new FakeRoot([a, b]),
        clock: "timed",
        frames: fakeFrames(),
      },
    );
    expect(mounted.media()).toEqual([
      { name: "a", clipMs: 2500, from: 300, to: 1200 },
      { name: "b", clipMs: undefined, from: 0, to: 2000 },
    ]);
    mounted.dispose();
  });

  it("drives a media element on a live clock even with no motions", () => {
    vi.stubGlobal("HTMLMediaElement", FakeMediaElement);
    const video = new FakeMediaElement("clip");
    const frames = fakeFrames();
    let clockNow = 0;
    const mounted = mount(scene({ length: 2000 }, box("clip", { media: true })), {
      root: new FakeRoot([video]),
      clock: "live",
      frames,
      now: () => clockNow,
    });
    expect(video.paused).toBe(true);
    clockNow = 16;
    frames.tick(16);
    expect(video.paused).toBe(false);
    expect(video.currentTime).toBeCloseTo(0.016);
    mounted.dispose();
    expect(video.paused).toBe(true);
  });
});
