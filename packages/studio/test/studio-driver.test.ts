import type { Events, MotionEvent } from "@gerak/core";
import type { FrameSource } from "@gerak/dom";
import { describe, expect, it } from "vitest";
import {
  scrollAt,
  studioDriver,
  SWEEP_PX_PER_MS,
  timelineLength,
  type ScrollHost,
} from "../src/canvas/studio-driver";

const scrollSample = (at: number, value: number): MotionEvent => ({ name: "scroll", at, value });
const click = (at: number): MotionEvent => ({ name: "click", at, target: "heroCta" });

function manualFrames(): FrameSource & { step(ms: number): void } {
  let next: ((time: number) => void) | undefined;
  let clock = 0;
  return {
    requestFrame(listener) {
      next = listener;
      return 1;
    },
    cancelFrame() {
      next = undefined;
    },
    step(ms) {
      clock += ms;
      const run = next;
      next = undefined;
      run?.(clock);
    },
  };
}

function host(maxScroll: number): ScrollHost & { readonly at: number[] } {
  const at: number[] = [];
  return {
    at,
    maxScroll: () => maxScroll,
    scrollTo: (_x, y) => void at.push(y),
  };
}

describe("scroll at a time", () => {
  const take: Events = [scrollSample(100, 40), scrollSample(300, 200), click(350)];

  it("follows a take's scroll samples step-wise, the last one at or before the time", () => {
    expect(scrollAt(0, take, 5000, 1000)).toBe(0);
    expect(scrollAt(99, take, 5000, 1000)).toBe(0);
    expect(scrollAt(100, take, 5000, 1000)).toBe(40);
    expect(scrollAt(299, take, 5000, 1000)).toBe(40);
    expect(scrollAt(4000, take, 5000, 1000)).toBe(200);
  });

  it("sweeps linearly from top to bottom with no scroll samples in the take", () => {
    expect(scrollAt(0, [click(10)], 4000, 800)).toBe(0);
    expect(scrollAt(2000, [], 4000, 800)).toBe(400);
    expect(scrollAt(9000, [], 4000, 800)).toBe(800);
    expect(scrollAt(500, [], 0, 800)).toBe(0);
  });
});

describe("the timeline length", () => {
  it("is the longest of the scene, the take's last event plus the settle, and the sweep", () => {
    expect(timelineLength(3000, [], 0)).toBe(3000);
    expect(timelineLength(3000, [click(4000)], 0)).toBe(6000);
    expect(timelineLength(3000, [], 900 / SWEEP_PX_PER_MS)).toBe(3000);
    expect(timelineLength(3000, [click(100)], 9000)).toBe(9000);
  });
});

describe("the studio driver", () => {
  it("hands the scene a take's inputs without its scroll samples", () => {
    const built = studioDriver({
      host: host(1000),
      length: 3000,
      take: [scrollSample(100, 40), click(350)],
      frames: manualFrames(),
    });
    expect(built.driver.events?.()).toEqual([click(350)]);
    expect(built.length).toBe(Math.max(3000, 2350, 1000 / SWEEP_PX_PER_MS));
  });

  it("scrolls the page to the take's samples as it seeks, and sweeps with no take", () => {
    const withTake = host(1000);
    const a = studioDriver({
      host: withTake,
      length: 2000,
      take: [scrollSample(500, 300)],
      frames: manualFrames(),
    });
    a.driver.seek(0.5);
    expect(withTake.at.at(-1)).toBe(300);
    a.driver.seek(0.1);
    expect(withTake.at.at(-1)).toBe(0);

    const plain = host(500);
    const b = studioDriver({ host: plain, length: 1000, take: [], frames: manualFrames() });
    b.driver.seek(0.25);
    expect(plain.at.at(-1)).toBe(250);
  });

  it("starts paused at 0 and moves with the frames it is given", () => {
    const frames = manualFrames();
    const built = studioDriver({ host: host(0), length: 1000, take: [], frames });
    expect(built.driver.playing()).toBe(false);
    built.driver.play();
    frames.step(0);
    frames.step(250);
    expect(built.driver.now().clock).toMatchObject({ kind: "timed", elapsed: 250, length: 1000 });
  });
});
