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

describe("a live clock", () => {
  it("places a span by its ms", () => {
    const intro = span(200, 600, 1000);
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
