import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  ease,
  easeTo,
  inputLog,
  inputs,
  liveAt,
  state,
  springTo,
  transition,
  watchClock,
  watchedTime,
  type ClockUse,
  type Input,
  type InputEntry,
  type Time,
} from "@gerak/core";

const testInputs = inputs({
  values: { set: {}, zone: {} },
  triggers: { click: {}, open: {}, close: {}, reset: {}, add: {}, other: {}, hover: {} },
});

const click = (at: number, target?: string): InputEntry =>
  target === undefined
    ? { kind: "trigger", name: "click", at, value: 1 }
    : { kind: "trigger", name: "click", at, value: 1, target };

const toggle = (current: boolean, event: InputEntry): boolean =>
  event.name === "click" ? !current : current;

describe("state", () => {
  const clicks: Input = [click(100), click(300), click(500)];

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
    const log = inputLog();
    log.trigger(10, testInputs, "click");
    log.trigger(20, testInputs, "click");
    counting(liveAt(100), log.input);
    log.trigger(30, testInputs, "click");
    expect(counting(liveAt(100), log.input)).toBe(3);
    expect(calls).toBe(3);
    counting(liveAt(100), log.input);
    expect(calls).toBe(3);
  });

  it("costs about the same per call on a long growing log as on a short one", () => {
    const counting = state(0, (current: number) => current + 1);
    const log = inputLog();
    let at = 0;
    const window = (): number => {
      const started = performance.now();
      for (let index = 0; index < 1000; index += 1) {
        at += 1;
        log.trigger(at, testInputs, "click");
        for (let read = 0; read < 10; read += 1) counting(liveAt(at), log.input);
      }
      return performance.now() - started;
    };
    window();
    const early = Math.min(window(), window(), window());
    for (let index = 0; index < 20; index += 1) window();
    const late = Math.min(window(), window(), window());
    expect(counting(liveAt(at), log.input)).toBe(at);
    expect(late).toBeLessThan(early * 4);
  });

  it("starts again when an event goes into a growing log before the last one folded, or it is emptied", () => {
    const flag = state(false, toggle);
    const log = inputLog();
    log.trigger(100, testInputs, "click");
    log.trigger(300, testInputs, "click");
    expect(flag(liveAt(900), log.input)).toBe(false);
    log.trigger(200, testInputs, "click");
    expect(flag(liveAt(900), log.input)).toBe(true);
    const repeated = inputLog();
    repeated.trigger(100, testInputs, "click");
    repeated.trigger(300, testInputs, "click");
    repeated.trigger(300, testInputs, "click");
    const count = state(0, (current: number) => current + 1);
    expect(count(liveAt(900), repeated.input)).toBe(3);
    repeated.trigger(200, testInputs, "click");
    expect(count(liveAt(900), repeated.input)).toBe(4);
    const sum = state(0, (current: number, event: InputEntry) => current + event.at);
    expect(sum(liveAt(900), log.input)).toBe(600);
    log.clear();
    for (const at of [50, 60, 70, 80]) log.trigger(at, testInputs, "click");
    expect(sum(liveAt(900), log.input)).toBe(260);
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
    const events: Input = [
      { kind: "trigger", name: "add", at: 100, value: 1 },
      { kind: "trigger", name: "other", at: 150, value: 1 },
      { kind: "trigger", name: "add", at: 200, value: 1 },
      { kind: "trigger", name: "add", at: 300, value: 1 },
    ];
    expect(capped.steps(liveAt(1000), events)).toEqual([
      { at: 100, value: 1 },
      { at: 200, value: 2 },
    ]);
    expect(capped.steps(liveAt(150), events)).toEqual([{ at: 100, value: 1 }]);
  });

  it("lets only the target's events reach the rule", () => {
    const only = state(0, (current: number) => current + 1, { target: "a" });
    const events: Input = [click(10, "a"), click(20, "b"), click(30, "a"), click(40)];
    expect(only(liveAt(100), events)).toBe(2);
    const either = state(0, (current: number) => current + 1, { target: ["a", "b"] });
    expect(either(liveAt(100), events)).toBe(3);
  });
});

const level = state(0, (_current: number, event) => event.value);
const jumps: Input = [
  { kind: "value", name: "set", at: 1000, value: 10 },
  { kind: "value", name: "set", at: 1100, value: -4 },
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
    const first: InputEntry = { kind: "value", name: "set", at: 1000, value: 3 };
    const events: Input = [first, { kind: "value", name: "set", at: 1100, value: 9 }];
    expect(sign(liveAt(5000), events)).toBe(1);
    expect(sign(liveAt(1050), events)).toBeCloseTo(sign(liveAt(1050), [first]), 9);
  });

  it("refuses a spring with no pull", () => {
    expect(() => springTo(level, (value) => value, { stiffness: 0 })).toThrow(RangeError);
  });
});

describe("easeTo", () => {
  const rising = state(0, (_current: number, event) => event.value);
  const options = { ms: { up: 200, down: 100 }, delayMs: { up: 50, down: 0 } };

  it("holds the start, waits the delay when rising, and runs over its time", () => {
    const signal = easeTo(rising, (value) => value, options);
    const events: Input = [{ kind: "value", name: "set", at: 1000, value: 1 }];
    expect(signal(liveAt(900), events)).toBe(0);
    expect(signal(liveAt(1050), events)).toBe(0);
    expect(signal(liveAt(1150), events)).toBeCloseTo(0.5, 9);
    expect(signal(liveAt(1250), events)).toBe(1);
    expect(signal(liveAt(9000), events)).toBe(1);
  });

  it("falls with no delay over its down time", () => {
    const signal = easeTo(rising, (value) => value, options);
    const events: Input = [
      { kind: "value", name: "set", at: 0, value: 1 },
      { kind: "value", name: "set", at: 1000, value: 0 },
    ];
    expect(signal(liveAt(999), events)).toBe(1);
    expect(signal(liveAt(1050), events)).toBeCloseTo(0.5, 9);
    expect(signal(liveAt(1100), events)).toBe(0);
  });

  it("starts from where it is when the goal changes mid-motion, with no jump", () => {
    const signal = easeTo(rising, (value) => value, { ms: 400 });
    const events: Input = [
      { kind: "value", name: "set", at: 1000, value: 1 },
      { kind: "value", name: "set", at: 1200, value: 0 },
    ];
    const at = (ms: number) => signal(liveAt(ms), events);
    expect(at(1200)).toBeCloseTo(0.5, 9);
    expect(Math.abs(at(1201) - at(1199))).toBeLessThan(0.01);
    expect(at(1700)).toBe(0);
  });

  it("uses its ease, and answers the latest value untimed", () => {
    const signal = easeTo(rising, (value) => value, { ms: 100, ease: ease.cubicOut });
    const events: Input = [{ kind: "value", name: "set", at: 0, value: 1 }];
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

describe("transition", () => {
  type Phase = "idle" | "open" | "closed";

  const watchUses = <T>(fn: () => T): { readonly value: T; readonly uses: readonly ClockUse[] } => {
    const uses: ClockUse[] = [];
    const value = watchClock((use) => uses.push(use), fn);
    return { value, uses };
  };

  it("holds start settled, eases across active transitions with stillMoving(), and settles at ms", () => {
    const phase = state<Phase>("idle", (_cur, ev) =>
      ev.name === "open" ? "open" : ev.name === "close" ? "closed" : _cur,
    );
    const sig = transition(phase, { ms: 400, ease: ease.cubicOut });
    const events: Input = [{ kind: "trigger", name: "open", at: 1000, value: 1 }];

    const before = watchUses(() => sig(watchedTime(liveAt(900)), events));
    expect(before.value).toEqual({
      current: "idle",
      previous: "idle",
      progress: 1,
      active: false,
    });
    expect(before.uses).toEqual([]);

    const mid = watchUses(() => sig(watchedTime(liveAt(1200)), events));
    expect(mid.value.current).toBe("open");
    expect(mid.value.previous).toBe("idle");
    expect(mid.value.active).toBe(true);
    expect(mid.value.progress).toBeCloseTo(ease.cubicOut(0.5), 9);
    expect(mid.uses).toEqual(["time"]);

    const done = watchUses(() => sig(watchedTime(liveAt(1400)), events));
    expect(done.value).toEqual({
      current: "open",
      previous: "idle",
      progress: 1,
      active: false,
    });
    expect(done.uses).toEqual([]);
  });

  it("handles mid-transition interruptions, asymmetric durations, 0 ms steps, return-to-start, timed clocks, and backward seeking", () => {
    const phase = state<Phase>("idle", (_cur, ev) =>
      ev.name === "open"
        ? "open"
        : ev.name === "close"
          ? "closed"
          : ev.name === "reset"
            ? "idle"
            : _cur,
    );
    const sig = transition(phase, {
      ms: (from, to) =>
        from === "idle" && to === "open" ? 500 : to === "idle" && from === "open" ? 0 : 200,
    });
    const events: Input = [
      { kind: "trigger", name: "open", at: 100, value: 1 },
      { kind: "trigger", name: "close", at: 300, value: 1 },
      { kind: "trigger", name: "open", at: 1000, value: 1 },
      { kind: "trigger", name: "reset", at: 1500, value: 1 },
    ];

    expect(sig(liveAt(200), events)).toEqual({
      current: "open",
      previous: "idle",
      progress: 0.2,
      active: true,
    });
    // Interrupted mid-flight at 300 -> starts closed transition cleanly at progress 0 -> 0.5 at 400.
    expect(sig(liveAt(400), events)).toEqual({
      current: "closed",
      previous: "open",
      progress: 0.5,
      active: true,
    });
    // Works identically on timed clocks.
    expect(
      sig({ progress: 400 / 2000, clock: { kind: "timed", elapsed: 400, length: 2000 } }, events),
    ).toEqual({
      current: "closed",
      previous: "open",
      progress: 0.5,
      active: true,
    });
    // Seeking backward stays pure in (time, input).
    expect(sig(liveAt(200), events)).toEqual({
      current: "open",
      previous: "idle",
      progress: 0.2,
      active: true,
    });
    // Seeking forward again sees settled closed before third event, active 3rd event, then return to start.
    expect(sig(liveAt(600), events)).toEqual({
      current: "closed",
      previous: "open",
      progress: 1,
      active: false,
    });
    expect(sig(liveAt(1100), events)).toEqual({
      current: "open",
      previous: "closed",
      progress: 0.5,
      active: true,
    });
    expect(sig(liveAt(1500), events)).toEqual({
      current: "idle",
      previous: "open",
      progress: 1,
      active: false,
    });

    const instant = transition(phase, { ms: () => 0 });
    const res = watchUses(() =>
      instant(watchedTime(liveAt(100)), [{ kind: "trigger", name: "open", at: 100, value: 1 }]),
    );
    expect(res.value).toEqual({
      current: "open",
      previous: "idle",
      progress: 1,
      active: false,
    });
    expect(res.uses).toEqual([]);
  });

  it("resets cleanly on out-of-order inputLog insertion and refuses missing options after pick", () => {
    const phase = state<Phase>("idle", (_cur, ev) => (ev.name === "open" ? "open" : _cur));
    const sig = transition(phase, { ms: 400 });
    const log = inputLog();
    log.trigger(200, testInputs, "open");
    expect(sig(liveAt(400), log.input)).toEqual({
      current: "open",
      previous: "idle",
      progress: 0.5,
      active: true,
    });
    // Inserting an earlier event alters the step list identity and recomputes from the new timestamp.
    log.trigger(100, testInputs, "open");
    expect(sig(liveAt(400), log.input)).toEqual({
      current: "open",
      previous: "idle",
      progress: 0.75,
      active: true,
    });
    expect(() => Reflect.apply(transition, undefined, [phase, (s: Phase) => s])).toThrow(TypeError);
  });

  it("supports the pick overload, ignores unchanged picked values, and settles on untimed clocks", () => {
    const compound = state({ zone: 0, hover: false }, (cur, ev) => {
      if (ev.name === "hover") return { ...cur, hover: true };
      if (ev.name === "zone" && typeof ev.value === "number") return { ...cur, zone: ev.value };
      return cur;
    });
    const sig = transition(compound, (s) => s.zone, { ms: 200 });
    const events: Input = [
      { kind: "value", name: "zone", at: 100, value: 2 },
      { kind: "trigger", name: "hover", at: 150, value: 1 },
    ];

    // Hover event changes `compound` at 150, but `pick` stays 2, so transition keeps started-at 100!
    expect(sig(liveAt(200), events)).toEqual({
      current: 2,
      previous: 0,
      progress: 0.5,
      active: true,
    });

    const untimed = watchUses(() => sig({ progress: 0.2, clock: UNTIMED }, events));
    expect(untimed.value).toEqual({
      current: 2,
      previous: 0,
      progress: 1,
      active: false,
    });
    expect(untimed.uses).toEqual([]);
  });

  it("refuses negative or non-finite ms upfront and from callbacks", () => {
    const phase = state("a", (_c, e) => e.name);
    for (const ms of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => transition(phase, { ms })).toThrow(RangeError);
    }
    const badCb = transition(phase, { ms: () => -5 });
    expect(() => badCb(liveAt(20), [{ kind: "trigger", name: "b", at: 10, value: 1 }])).toThrow(
      RangeError,
    );
  });
});
