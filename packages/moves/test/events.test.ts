import { describe, expect, it } from "vitest";
import { UNTIMED, follow, liveAt, mergeEvents, react, span, type Events } from "@gerak/moves";

const lift = follow({ start: 0, on: { enter: -8, leave: 0 }, target: "card" });
const hover = (enter: number, leave?: number): Events => [
  { name: "enter", at: enter, target: "card" },
  ...(leave === undefined ? [] : [{ name: "leave", at: leave, target: "card" }]),
];

describe("follow", () => {
  it("holds its start before any event, and ignores events still to come", () => {
    expect(lift(liveAt(500), [])).toBe(0);
    expect(lift(liveAt(500), hover(800))).toBe(0);
  });

  it("springs to an event's goal and settles there", () => {
    expect(lift(liveAt(1000 + 16), hover(1000))).toBeLessThan(0);
    expect(lift(liveAt(1000 + 16), hover(1000))).toBeGreaterThan(-8);
    expect(lift(liveAt(4000), hover(1000))).toBeCloseTo(-8, 4);
  });

  it("reverses from where it is and as fast as it goes when left half way, with no jump", () => {
    const at = (ms: number, events: Events) => lift(liveAt(ms), events);
    expect(at(1100, hover(1000, 1100))).toBeCloseTo(at(1100, hover(1000)), 9);
    const speedBefore = (at(1100, hover(1000)) - at(1099, hover(1000))) / 1;
    const speedAfter = (at(1101, hover(1000, 1100)) - at(1100, hover(1000, 1100))) / 1;
    expect(speedAfter).toBeCloseTo(speedBefore, 1);
    expect(at(5000, hover(1000, 1100))).toBeCloseTo(0, 4);
  });

  it("counts only its own target's events and the names it knows", () => {
    expect(lift(liveAt(4000), [{ name: "enter", at: 1000, target: "other" }])).toBe(0);
    expect(lift(liveAt(4000), [{ name: "wave", at: 1000, target: "card" }])).toBe(0);
  });

  it("settles at once without a clock, and refuses a spring with no pull", () => {
    expect(lift({ progress: 0, clock: UNTIMED }, hover(1000))).toBe(-8);
    expect(() => follow({ start: 0, on: {}, stiffness: 0 })).toThrow(/follow: stiffness/);
  });

  it("overdamped and critically damped springs settle without passing the goal", () => {
    for (const damping of [2 * Math.sqrt(170), 60]) {
      const slow = follow({ start: 0, on: { go: 10 }, damping });
      const path = [50, 200, 600, 5000].map((ms) => slow(liveAt(ms), [{ name: "go", at: 0 }]));
      for (const value of path) expect(value).toBeLessThanOrEqual(10 + 1e-9);
      expect(path.at(-1)).toBeCloseTo(10, 2);
    }
  });
});

describe("follow on a stream of samples", () => {
  const stream = (count: number, step = 33): Events =>
    Array.from({ length: count }, (_, index) => ({
      name: "mouthOpen",
      at: index * step,
      value: (Math.sin(index * 0.7) + 1) / 2,
    }));
  const fresh = () => follow({ start: 0, on: { mouthOpen: "value" } });

  it("springs to each sample's own value, and skips a sample with none", () => {
    const mouth = fresh();
    expect(mouth(liveAt(4000), [{ name: "mouthOpen", at: 0, value: 0.6 }])).toBeCloseTo(0.6, 4);
    expect(mouth(liveAt(4000), [{ name: "mouthOpen", at: 0 }])).toBe(0);
    const near = mouth(liveAt(66), stream(3));
    expect(near).toBeGreaterThan(0);
    expect(near).toBeLessThan(1);
  });

  it("answers what a run from the start gives, forwards, backwards and at random", () => {
    const log = stream(300);
    const kept = fresh();
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 10_000;
    const times = [
      ...Array.from({ length: 200 }, (_, index) => index * 16),
      3000,
      1200,
      ...Array.from({ length: 200 }, random),
    ];
    for (const ms of times) expect(kept(liveAt(ms), log)).toBe(fresh()(liveAt(ms), log));
  });

  it("goes on from its last answer as the log grows, and starts again on another log", () => {
    const log = [...stream(200)];
    const kept = fresh();
    for (let ms = 0; ms < 6600; ms += 16) {
      while (log.length < 400 && (log.at(-1)?.at ?? 0) < ms)
        log.push({ name: "mouthOpen", at: (log.at(-1)?.at ?? 0) + 33, value: ms % 7 });
      expect(kept(liveAt(ms), log)).toBe(fresh()(liveAt(ms), log));
    }
    const other = stream(50, 20);
    expect(kept(liveAt(900), other)).toBe(fresh()(liveAt(900), other));
  });

  it("starts again on a log that shares its last event but differs before it", () => {
    const last = { name: "mouthOpen", at: 1000, value: 0 };
    const kept = fresh();
    const up: Events = [{ name: "mouthOpen", at: 0, value: 5 }, last];
    const down: Events = [{ name: "mouthOpen", at: 0, value: -5 }, last];
    kept(liveAt(1100), up);
    expect(kept(liveAt(1100), down)).toBe(fresh()(liveAt(1100), down));
    const edited = [...up];
    kept(liveAt(1100), edited);
    edited[0] = { name: "mouthOpen", at: 0, value: 2 };
    expect(kept(liveAt(1100), edited)).toBe(fresh()(liveAt(1100), edited));
  });

  it("over 10 000 samples costs a frame a small share of springing through them from the start", () => {
    const long = stream(10_000);
    const frameCost = (follower: () => ReturnType<typeof fresh>) => {
      const kept = follower();
      const from = (long.at(-1)?.at ?? 0) - 3300;
      kept(liveAt(from), long);
      const start = performance.now();
      for (let ms = from; ms < from + 3300; ms += 16) kept(liveAt(ms), long);
      return performance.now() - start;
    };
    const best = (follower: () => ReturnType<typeof fresh>) =>
      Math.min(...[0, 1, 2].map(() => frameCost(follower)));
    const fromStart = () => {
      const each = (time: Parameters<ReturnType<typeof fresh>>[0], events: Events) =>
        fresh()(time, events);
      return each;
    };
    expect(best(fresh)).toBeLessThan(best(fromStart) / 10);
  });
});

describe("a live clock", () => {
  it("places a span by its ms", () => {
    const intro = span(200, 600);
    expect(intro.of(liveAt(400)).progress).toBeCloseTo(0.5, 9);
    expect(intro.of(liveAt(5000)).progress).toBe(1);
  });
});

describe("a spring at rest", () => {
  it("stops exactly on its goal once it is that close and that slow", () => {
    const lift = follow({ start: 0, on: { enter: -8 } });
    const at = (ms: number) => lift(liveAt(ms), [{ name: "enter", at: 0 }]);
    expect(at(3000)).toBe(-8);
    expect(at(3016)).toBe(-8);
    expect(at(100)).not.toBe(-8);
  });
});

describe("react", () => {
  const land = (...at: number[]): Events =>
    at.map((ms) => ({ name: "land", at: ms, target: "ball" }));
  const at = (ms: number) => ({
    progress: 0,
    clock: { kind: "timed" as const, elapsed: ms, length: 5000 },
  });

  it("is exactly 0 before its event and once the response has died", () => {
    const recoil = react({ on: ["land"], kind: "recoil", amplitude: 10 });
    expect(recoil(at(999), land(1000))).toBe(0);
    expect(recoil(at(1000), land(1000))).toBeCloseTo(10, 9);
    expect(recoil(at(4000), land(1000))).toBe(0);
  });

  it("starts each kind where it should: recoil full, wobble and shake at rest, flash full and fading", () => {
    const start = (kind: "recoil" | "wobble" | "flash" | "shake") =>
      react({ on: ["land"], kind, amplitude: 1 })(at(1000), land(1000));
    expect([start("recoil"), start("wobble"), start("flash")]).toEqual([1, 0, 1]);
    expect(Math.abs(start("shake"))).toBeLessThan(1);
    const flash = react({ on: ["land"], kind: "flash", amplitude: 1 });
    expect(flash(at(1100), land(1000))).toBeLessThan(flash(at(1050), land(1000)));
  });

  it("adds the responses to several events, and answers only its names and target", () => {
    const wobble = react({ on: ["land"], target: "ball", kind: "wobble", amplitude: 1 });
    const one = wobble(at(1100), land(1000));
    const other = wobble(at(1100), land(1050));
    expect(wobble(at(1100), mergeEvents(land(1050), land(1000)))).toBeCloseTo(one + other, 9);
    expect(wobble(at(1100), [{ name: "land", at: 1000, target: "cup" }])).toBe(0);
    expect(wobble(at(1100), [{ name: "jump", at: 1000, target: "ball" }])).toBe(0);
  });
});
