import { describe, expect, it } from "vitest";
import {
  INPUT_EVENTS,
  NO_EVENTS,
  UNTIMED,
  liveAt,
  pointer,
  scroll,
  springTo,
  type Events,
  type Time,
} from "@gerak/core";

const untimed: Time = { progress: 0, clock: UNTIMED };

describe("scroll state", () => {
  const session: Events = [
    { name: "click", at: 50, value: 999 },
    { name: INPUT_EVENTS.scroll, at: 100, value: 120 },
    { name: INPUT_EVENTS.scroll, at: 200 },
    { name: INPUT_EVENTS.scroll, at: 300, value: Number.NaN },
    { name: INPUT_EVENTS.scroll, at: 350, value: Infinity },
    { name: INPUT_EVENTS.scroll, at: 375, value: -Infinity },
    { name: INPUT_EVENTS.scroll, at: 400, value: 480 },
  ];

  it("starts at 0 and folds scroll samples in px up to the time asked", () => {
    expect(scroll.y.start).toBe(0);
    expect(scroll.y(liveAt(0), NO_EVENTS)).toBe(0);
    expect(scroll.y(liveAt(99), session)).toBe(0);
    expect(scroll.y(liveAt(100), session)).toBe(120);
    expect(scroll.y(liveAt(350), session)).toBe(120);
    expect(scroll.y(liveAt(375), session)).toBe(120);
    expect(scroll.y(liveAt(400), session)).toBe(480);
    expect(scroll.y(untimed, session)).toBe(480);
    expect(
      scroll.y.steps(liveAt(200), [{ name: INPUT_EVENTS.scroll, at: 100, value: -0 }]),
    ).toEqual([]);
  });

  it("replays identically when sought backwards or out of order", () => {
    const forward = [0, 100, 250, 400, 600].map((ms) => scroll.y(liveAt(ms), session));
    const backward = [600, 400, 250, 100, 0].map((ms) => scroll.y(liveAt(ms), session)).reverse();
    expect(backward).toEqual(forward);
    expect(scroll.y(liveAt(150), session)).toBe(120);
  });

  it("supports smooth scroll via springTo without jumping", () => {
    const smooth = springTo(scroll.y, (y) => y);
    const events: Events = [
      { name: INPUT_EVENTS.scroll, at: 100, value: 300 },
      { name: INPUT_EVENTS.scroll, at: 250, value: 500 },
    ];
    expect(smooth(liveAt(50), events)).toBe(0);
    const mid = smooth(liveAt(150), events);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(300);
    expect(Math.abs(smooth(liveAt(251), events) - smooth(liveAt(249), events))).toBeLessThan(20);
    expect(smooth(liveAt(4000), events)).toBe(500);
  });
});

describe("pointer state", () => {
  const session: Events = [
    { name: INPUT_EVENTS.pointerX, at: 100, value: 0.2 },
    { name: INPUT_EVENTS.pointerY, at: 150, value: -0.4 },
    { name: INPUT_EVENTS.pointerX, at: 250, value: 1.4 },
    { name: INPUT_EVENTS.pointerX, at: 400, value: 0.75 },
    { name: INPUT_EVENTS.pointerY, at: 450, value: 0.8 },
    { name: "hover", at: 500, target: "card", value: 0 },
  ];

  it("starts centred at 0.5 and clamps normalized pointer samples to 0..1", () => {
    expect(pointer.x.start).toBe(0.5);
    expect(pointer.y.start).toBe(0.5);
    expect(pointer.x(liveAt(50), NO_EVENTS)).toBe(0.5);
    expect(pointer.y(liveAt(50), NO_EVENTS)).toBe(0.5);
    expect(pointer.x(liveAt(100), session)).toBe(0.2);
    expect(pointer.y(liveAt(150), session)).toBe(0);
    expect(pointer.x(liveAt(250), session)).toBe(1);
    expect(pointer.x(liveAt(400), session)).toBe(0.75);
    expect(pointer.y(liveAt(500), session)).toBe(0.8);
  });

  it("replays pointer.x identically from a recorded session across orderings", () => {
    const times = [0, 100, 200, 250, 350, 400, 600];
    const first = times.map((ms) => pointer.x(liveAt(ms), session));
    const reversed = [...times]
      .reverse()
      .map((ms) => pointer.x(liveAt(ms), session))
      .reverse();
    const copy: Events = session.map((event) => ({ ...event }));
    const replayed = times.map((ms) => pointer.x(liveAt(ms), copy));
    expect(reversed).toEqual(first);
    expect(replayed).toEqual(first);
  });

  it("drives springTo smoothly from pointer.x", () => {
    const followX = springTo(pointer.x, (x) => x);
    expect(followX(liveAt(50), session)).toBe(0.5);
    const moving = followX(liveAt(140), session);
    expect(moving).toBeLessThan(0.5);
    expect(moving).toBeGreaterThan(0.2);
    expect(followX(liveAt(4000), session)).toBe(0.75);
  });
});
