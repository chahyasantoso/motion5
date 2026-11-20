import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  ease,
  easeTo,
  eventLog,
  liveAt,
  state,
  springTo,
  type Events,
  type MotionEvent,
  type Time,
} from "@gerak/core";

const click = (at: number, target?: string): MotionEvent =>
  target === undefined ? { name: "click", at } : { name: "click", at, target };

const toggle = (current: boolean, event: MotionEvent): boolean =>
  event.name === "click" ? !current : current;

describe("state", () => {
  const clicks: Events = [click(100), click(300), click(500)];

  it("folds the events up to the time with its rule", () => {
    const flag = state(false, toggle);
    expect(flag(liveAt(50), clicks)).toBe(false);
    expect(flag(liveAt(100), clicks)).toBe(true);
    expect(flag(liveAt(299), clicks)).toBe(true);
    expect(flag(liveAt(300), clicks)).toBe(false);
    expect(flag(liveAt(900), clicks)).toBe(true);
  });

  it("gives the earlier value after a jump back", () => {
    const flag = state(false, toggle);
    expect(flag(liveAt(900), clicks)).toBe(true);
    expect(flag(liveAt(350), clicks)).toBe(false);
    expect(flag(liveAt(150), clicks)).toBe(true);
    expect(flag(liveAt(0), clicks)).toBe(false);
  });

  it("starts again when an earlier event is another object", () => {
    const flag = state(false, toggle);
    expect(flag(liveAt(900), clicks)).toBe(true);
    expect(flag(liveAt(900), [click(100), click(500)])).toBe(false);
    const same = [...clicks, click(700)];
    expect(flag(liveAt(900), clicks)).toBe(true);
    expect(flag(liveAt(900), same)).toBe(false);
  });

  it("folds only the new events when a list grows", () => {
    let calls = 0;
    const counting = state(0, (current: number) => {
      calls += 1;
      return current + 1;
    });
    const events: MotionEvent[] = [click(10), click(20)];
    counting(liveAt(100), events);
    events.push(click(30));
    expect(counting(liveAt(100), events)).toBe(3);
    expect(calls).toBe(3);
    counting(liveAt(100), events);
    expect(calls).toBe(3);
  });

  it("costs about the same per call on a long growing log as on a short one", () => {
    const counting = state(0, (current: number) => current + 1);
    const log = eventLog();
    let at = 0;
    const window = (): number => {
      const started = performance.now();
      for (let index = 0; index < 1000; index += 1) {
        at += 1;
        log.add(click(at));
        for (let read = 0; read < 10; read += 1) counting(liveAt(at), log.events);
      }
      return performance.now() - started;
    };
    window();
    const early = Math.min(window(), window(), window());
    for (let index = 0; index < 20; index += 1) window();
    const late = Math.min(window(), window(), window());
    expect(counting(liveAt(at), log.events)).toBe(at);
    expect(late).toBeLessThan(early * 3);
  });

  it("starts again when an event goes into a growing log before the last one folded, or it is emptied", () => {
    const flag = state(false, toggle);
    const log = eventLog();
    log.add(click(100));
    log.add(click(300));
    expect(flag(liveAt(900), log.events)).toBe(false);
    log.add(click(200));
    expect(flag(liveAt(900), log.events)).toBe(true);
    const sum = state(0, (current: number, event: MotionEvent) => current + event.at);
    expect(sum(liveAt(900), log.events)).toBe(600);
    log.clear();
    for (const at of [50, 60, 70, 80]) log.add(click(at));
    expect(sum(liveAt(900), log.events)).toBe(260);
  });

  it("folds every event on an untimed clock, and none after the time on a timed one", () => {
    const flag = state(false, toggle);
    const untimed: Time = { progress: 0, clock: UNTIMED };
    expect(flag(untimed, clicks)).toBe(true);
    expect(flag(liveAt(299), clicks)).toBe(true);
    expect(flag(liveAt(99), clicks)).toBe(false);
  });

  it("lists only the moments the state changed", () => {
    const capped = state(0, (current: number, event) =>
      event.name === "add" ? Math.min(2, current + 1) : current,
    );
    const events: Events = [
      { name: "add", at: 100 },
      { name: "other", at: 150 },
      { name: "add", at: 200 },
      { name: "add", at: 300 },
    ];
    expect(capped.steps(liveAt(1000), events)).toEqual([
      { at: 100, value: 1 },
      { at: 200, value: 2 },
    ]);
    expect(capped.steps(liveAt(150), events)).toEqual([{ at: 100, value: 1 }]);
  });

  it("lets only the target's events reach the rule", () => {
    const only = state(0, (current: number) => current + 1, { target: "a" });
    const events: Events = [click(10, "a"), click(20, "b"), click(30, "a"), click(40)];
    expect(only(liveAt(100), events)).toBe(2);
    const either = state(0, (current: number) => current + 1, { target: ["a", "b"] });
    expect(either(liveAt(100), events)).toBe(3);
  });
});

const level = state(0, (_current: number, event) => event.value ?? 0);
const jumps: Events = [
  { name: "set", at: 1000, value: 10 },
  { name: "set", at: 1100, value: -4 },
];

describe("springTo", () => {
  it("holds the start, and settles at the goal", () => {
    const signal = springTo(level, (value) => value);
    expect(signal(liveAt(500), jumps)).toBe(0);
    expect(signal(liveAt(1010), jumps)).toBeGreaterThan(0);
    expect(signal(liveAt(1010), jumps)).toBeLessThan(10);
    expect(signal(liveAt(6000), jumps)).toBe(-4);
  });

  it("turns from where it is when the goal changes, with no jump", () => {
    const signal = springTo(level, (value) => value);
    const at = (ms: number) => signal(liveAt(ms), jumps);
    expect(Math.abs(at(1101) - at(1099))).toBeLessThan(1);
    expect(at(1100.001)).toBeCloseTo(at(1099.999), 1);
  });

  it("answers the latest goal untimed", () => {
    const signal = springTo(level, (value) => value);
    expect(signal({ progress: 0, clock: UNTIMED }, jumps)).toBe(-4);
  });

  it("follows what pick reads, and skips events that leave it the same", () => {
    const sign = springTo(level, (value) => (value > 0 ? 1 : 0));
    const first: MotionEvent = { name: "set", at: 1000, value: 3 };
    const events: Events = [first, { name: "set", at: 1100, value: 9 }];
    expect(sign(liveAt(5000), events)).toBe(1);
    expect(sign(liveAt(1050), events)).toBeCloseTo(sign(liveAt(1050), [first]), 9);
  });

  it("refuses a spring with no pull", () => {
    expect(() => springTo(level, (value) => value, { stiffness: 0 })).toThrow(RangeError);
  });
});

describe("easeTo", () => {
  const rising = state(0, (_current: number, event) => event.value ?? 0);
  const options = { ms: { up: 200, down: 100 }, delayMs: { up: 50, down: 0 } };

  it("holds the start, waits the delay when rising, and runs over its time", () => {
    const signal = easeTo(rising, (value) => value, options);
    const events: Events = [{ name: "set", at: 1000, value: 1 }];
    expect(signal(liveAt(900), events)).toBe(0);
    expect(signal(liveAt(1050), events)).toBe(0);
    expect(signal(liveAt(1150), events)).toBeCloseTo(0.5, 9);
    expect(signal(liveAt(1250), events)).toBe(1);
    expect(signal(liveAt(9000), events)).toBe(1);
  });

  it("falls with no delay over its down time", () => {
    const signal = easeTo(rising, (value) => value, options);
    const events: Events = [
      { name: "set", at: 0, value: 1 },
      { name: "set", at: 1000, value: 0 },
    ];
    expect(signal(liveAt(999), events)).toBe(1);
    expect(signal(liveAt(1050), events)).toBeCloseTo(0.5, 9);
    expect(signal(liveAt(1100), events)).toBe(0);
  });

  it("starts from where it is when the goal changes mid-motion, with no jump", () => {
    const signal = easeTo(rising, (value) => value, { ms: 400 });
    const events: Events = [
      { name: "set", at: 1000, value: 1 },
      { name: "set", at: 1200, value: 0 },
    ];
    const at = (ms: number) => signal(liveAt(ms), events);
    expect(at(1200)).toBeCloseTo(0.5, 9);
    expect(Math.abs(at(1201) - at(1199))).toBeLessThan(0.01);
    expect(at(1700)).toBe(0);
  });

  it("uses its ease, and answers the latest value untimed", () => {
    const signal = easeTo(rising, (value) => value, { ms: 100, ease: ease.cubicOut });
    const events: Events = [{ name: "set", at: 0, value: 1 }];
    expect(signal(liveAt(50), events)).toBeCloseTo(ease.cubicOut(0.5), 9);
    expect(signal({ progress: 0, clock: UNTIMED }, events)).toBe(1);
  });
});

describe("refused settings", () => {
  const source = state(0, (current: number) => current + 1);
  const pick = (value: number): number => value;

  it("springTo refuses a stiffness that is not a finite positive number, and a rest that is not positive", () => {
    for (const options of [
      { stiffness: Infinity },
      { stiffness: 0 },
      { damping: -1 },
      { rest: Number.NaN },
      { rest: 0 },
    ])
      expect(() => springTo(source, pick, options)).toThrow(RangeError);
  });

  it("easeTo refuses a negative or non-finite time when it is built, not when it plays", () => {
    for (const options of [
      { ms: -50 },
      { ms: Number.NaN },
      { ms: { up: 100, down: -1 } },
      { ms: 100, delayMs: -1 },
    ])
      expect(() => easeTo(source, pick, options)).toThrow(/easeTo/);
  });
});
