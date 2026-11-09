import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clockDriver, type ClockDriver, type FrameSource } from "@motion5/dom";
import { extractMarks, scrubByWheel, Timeline, type TimelineMark } from "../src/live/timeline";

function createFrameSource(): FrameSource & { run(at: number): void; readonly waiting: number } {
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

class FakeKeyboardEvent extends Event {
  readonly key: string;
  readonly targetElement: EventTarget | null;

  constructor(type: string, init?: { key?: string; target?: EventTarget | null }) {
    super(type, { bubbles: true, cancelable: true });
    this.key = init?.key ?? "";
    this.targetElement = init?.target ?? null;
  }

  override get target(): EventTarget | null {
    return this.targetElement;
  }
}

describe("extractMarks", () => {
  it("extracts cues and moments from a scene module", () => {
    const sceneModule = {
      cues: [{ name: "catch", at: 1850, target: "ball" }, { invalid: true }],
      LAND_MS: 1850,
      CROUCH_MS: 300,
      BEAT_MS: 3000,
      OUT_OF_BOUNDS_MS: 3500,
      NOT_A_NUMBER_MS: "ignored",
      regularExport: 42,
    };
    const marks = extractMarks(sceneModule, 3000);
    expect(marks).toEqual([
      { name: "catch", at: 1850, kind: "cue" },
      { name: "land", at: 1850, kind: "moment" },
      { name: "crouch", at: 300, kind: "moment" },
    ]);
  });

  it("includes BEAT_MS if its value differs from durationMs", () => {
    const sceneModule = {
      BEAT_MS: 2000,
    };
    const marks = extractMarks(sceneModule, 3000);
    expect(marks).toEqual([{ name: "beat", at: 2000, kind: "moment" }]);
  });
});

describe("scrubByWheel", () => {
  it("steps forward and backward by 16 ms", () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 1000, frames: source, autoplay: false });
    driver.seek(0.5);
    scrubByWheel(driver, 1000, 100);
    expect(driver.now().progress).toBeCloseTo(0.516, 5);
    scrubByWheel(driver, 1000, -100);
    expect(driver.now().progress).toBeCloseTo(0.5, 5);
  });

  it("clamps to zero and one", () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 1000, frames: source, autoplay: false });
    driver.seek(0.005);
    scrubByWheel(driver, 1000, -50);
    expect(driver.now().progress).toBe(0);
    driver.seek(0.995);
    scrubByWheel(driver, 1000, 50);
    expect(driver.now().progress).toBe(1);
  });

  it("ignores missing driver or non-positive duration", () => {
    expect(() => scrubByWheel(undefined, 1000, 100)).not.toThrow();
    const source = createFrameSource();
    const driver = clockDriver({ duration: 1000, frames: source, autoplay: false });
    scrubByWheel(driver, 0, 100);
    expect(driver.now().progress).toBe(0);
  });
});

describe("Timeline component", () => {
  let mockWindowTarget: EventTarget;

  beforeEach(() => {
    mockWindowTarget = new EventTarget();
    Reflect.set(globalThis, "window", mockWindowTarget);
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("renders time display, playhead, and handles play/pause toggle", async () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    let root: ReactTestRenderer | undefined;

    await act(async () => {
      root = create(
        createElement(Timeline, {
          driver,
          durationMs: 2000,
          marks: [{ name: "land", at: 800, kind: "moment" }],
        }),
      );
    });

    if (root === undefined) throw new Error("Render failed");

    const timeElement = root.root.findByProps({ "data-live-time": true });
    expect(timeElement.props["data-ms"]).toBe(0);
    expect(timeElement.children).toEqual(["0", " ms / ", "2000", " ms"]);

    const playButton = root.root.findByProps({ "data-live-play": true });
    expect(playButton.children).toEqual(["Play"]);

    await act(async () => {
      playButton.props.onClick();
    });
    expect(playButton.children).toEqual(["Pause"]);
    expect(source.waiting).toBe(1);

    await act(async () => {
      playButton.props.onClick();
    });
    expect(playButton.children).toEqual(["Play"]);
    expect(source.waiting).toBe(0);
  });

  it("changes speed when rate buttons are clicked", async () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    let root: ReactTestRenderer | undefined;

    await act(async () => {
      root = create(createElement(Timeline, { driver, durationMs: 2000, marks: [] }));
    });

    if (root === undefined) throw new Error("Render failed");

    const rateHalf = root.root.findByProps({ "data-live-rate": "0.5" });
    await act(async () => {
      rateHalf.props.onClick();
    });

    driver.play();
    source.run(0);
    source.run(1000);
    expect(driver.now().clock).toEqual({
      kind: "timed",
      elapsed: 500,
      length: 2000,
    });
  });

  it("seeks on scrubber pointerdown and pointermove", async () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    let root: ReactTestRenderer | undefined;

    await act(async () => {
      root = create(createElement(Timeline, { driver, durationMs: 2000, marks: [] }));
    });

    if (root === undefined) throw new Error("Render failed");

    const scrubber = root.root.findByProps({ "data-live-scrubber": true });

    await act(async () => {
      scrubber.props.onPointerDown({
        clientX: 200,
        pointerId: 1,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 400 }),
          setPointerCapture: () => {},
        },
      });
    });

    expect(driver.now().progress).toBe(0.5);

    await act(async () => {
      scrubber.props.onPointerMove({
        clientX: 300,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 400 }),
        },
      });
    });

    expect(driver.now().progress).toBe(0.75);

    await act(async () => {
      scrubber.props.onPointerUp({
        currentTarget: {
          releasePointerCapture: () => {},
        },
      });
    });

    await act(async () => {
      scrubber.props.onWheel({ deltaY: 100 });
    });
    expect(driver.now().progress).toBeCloseTo(0.758, 3);
  });

  it("sets loop range when dragging on the range track", async () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    let root: ReactTestRenderer | undefined;

    await act(async () => {
      root = create(createElement(Timeline, { driver, durationMs: 2000, marks: [] }));
    });

    if (root === undefined) throw new Error("Render failed");

    const rangeTrack = root.root.findByProps({ "data-live-range": true });

    await act(async () => {
      rangeTrack.props.onPointerDown({
        clientX: 100,
        pointerId: 1,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 400 }),
          setPointerCapture: () => {},
        },
      });
      rangeTrack.props.onPointerMove({
        clientX: 300,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 400 }),
        },
      });
      rangeTrack.props.onPointerUp({
        clientX: 300,
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, width: 400 }),
          releasePointerCapture: () => {},
        },
      });
    });

    // 100/400 * 2000 = 500, 300/400 * 2000 = 1500
    expect(driver.now().clock).toEqual({
      kind: "timed",
      elapsed: 500,
      length: 2000,
    });
  });

  it("seeks to mark when clicked", async () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    const mark: TimelineMark = { name: "cue-point", at: 1200, kind: "cue" };
    let root: ReactTestRenderer | undefined;

    await act(async () => {
      root = create(createElement(Timeline, { driver, durationMs: 2000, marks: [mark] }));
    });

    if (root === undefined) throw new Error("Render failed");

    const markElement = root.root.findByProps({ "data-live-mark": "cue-point" });
    await act(async () => {
      markElement.props.onClick({ stopPropagation: () => {} });
    });

    expect(driver.now().progress).toBe(1200 / 2000);
  });

  it("handles keyboard shortcuts for play/pause, stepping, and loop toggle", async () => {
    const source = createFrameSource();
    const driver = clockDriver({ duration: 2000, frames: source, autoplay: false });
    let root: ReactTestRenderer | undefined;

    await act(async () => {
      root = create(createElement(Timeline, { driver, durationMs: 2000, marks: [] }));
    });

    if (root === undefined) throw new Error("Render failed");

    // Space toggles play
    await act(async () => {
      mockWindowTarget.dispatchEvent(new FakeKeyboardEvent("keydown", { key: " " }));
    });
    expect(source.waiting).toBe(1);

    // ArrowRight steps +16 ms and pauses
    await act(async () => {
      mockWindowTarget.dispatchEvent(new FakeKeyboardEvent("keydown", { key: "ArrowRight" }));
    });
    expect(source.waiting).toBe(0);
    expect(driver.now().progress).toBe(16 / 2000);

    // ArrowLeft steps -16 ms
    await act(async () => {
      mockWindowTarget.dispatchEvent(new FakeKeyboardEvent("keydown", { key: "ArrowLeft" }));
    });
    expect(driver.now().progress).toBe(0);

    // L toggles loop range
    await act(async () => {
      mockWindowTarget.dispatchEvent(new FakeKeyboardEvent("keydown", { key: "l" }));
    });
    // Default range is [0, durationMs]
    expect(driver.now().progress).toBe(0);

    // Toggle loop off
    await act(async () => {
      mockWindowTarget.dispatchEvent(new FakeKeyboardEvent("keydown", { key: "l" }));
    });

    // Keys are ignored when target is an input
    const inputElement = new EventTarget();
    Reflect.set(inputElement, "tagName", "INPUT");
    await act(async () => {
      mockWindowTarget.dispatchEvent(
        new FakeKeyboardEvent("keydown", { key: " ", target: inputElement }),
      );
    });
    // Should still be paused
    expect(source.waiting).toBe(0);
  });
});
