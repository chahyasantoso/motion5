import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  inputs,
  liveAt,
  mergeInput,
  span,
  state,
  triggers,
  unreachable,
  value,
  type Input,
} from "@gerak/core";
import { follow, react } from "@gerak/moves";

const liftGoal = state(
  0,
  (current, entry) => {
    switch (entry.kind) {
      case "trigger":
        return entry.name === "enter" ? -8 : entry.name === "leave" ? 0 : current;
      case "value":
        return current;
      default:
        return unreachable(entry.kind);
    }
  },
  { target: "card" },
);
const lift = follow(liftGoal);
const hover = (enter: number, leave?: number): Input => [
  { kind: "trigger", name: "enter", at: enter, value: 1, target: "card" },
  ...(leave === undefined
    ? []
    : [{ kind: "trigger" as const, name: "leave", at: leave, value: 1, target: "card" }]),
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
    const at = (ms: number, events: Input) => lift(liveAt(ms), events);
    expect(at(1100, hover(1000, 1100))).toBeCloseTo(at(1100, hover(1000)), 9);
    const speedBefore = (at(1100, hover(1000)) - at(1099, hover(1000))) / 1;
    const speedAfter = (at(1101, hover(1000, 1100)) - at(1100, hover(1000, 1100))) / 1;
    expect(speedAfter).toBeCloseTo(speedBefore, 1);
    expect(at(5000, hover(1000, 1100))).toBeCloseTo(0, 4);
  });

  it("counts only its own target's events and the names it knows", () => {
    expect(
      lift(liveAt(4000), [{ kind: "trigger", name: "enter", at: 1000, value: 1, target: "other" }]),
    ).toBe(0);
    expect(
      lift(liveAt(4000), [{ kind: "trigger", name: "wave", at: 1000, value: 1, target: "card" }]),
    ).toBe(0);
  });

  it("settles at once without a clock, and refuses a spring with no pull", () => {
    expect(lift({ progress: 0, clock: UNTIMED }, hover(1000))).toBe(-8);
    expect(() => follow(liftGoal, { stiffness: 0 })).toThrow(/follow: stiffness/);
  });

  it("overdamped and critically damped springs settle without passing the goal", () => {
    const go = state(0, (current, entry) => (entry.name === "go" ? 10 : current));
    for (const damping of [2 * Math.sqrt(170), 60]) {
      const slow = follow(go, { damping });
      const path = [50, 200, 600, 5000].map((ms) =>
        slow(liveAt(ms), [{ kind: "trigger", name: "go", at: 0, value: 1 }]),
      );
      for (const item of path) expect(item).toBeLessThanOrEqual(10 + 1e-9);
      expect(path.at(-1)).toBeCloseTo(10, 2);
    }
  });

  it("follows a declared value and ignores values of another target", () => {
    const contract = inputs({ values: { level: { targets: ["card", "other"] } } });
    const follower = follow(value(contract, "level", "card"));
    expect(
      follower(liveAt(4000), [
        { kind: "value", name: "level", at: 100, value: 12, target: "other" },
      ]),
    ).toBe(0);
    const input: Input = [
      { kind: "value", name: "level", at: 100, value: 12, target: "card" },
      { kind: "value", name: "level", at: 200, value: 99, target: "other" },
    ];
    expect(follower(liveAt(50), input)).toBe(0);
    expect(follower(liveAt(150), input)).toBeGreaterThan(0);
    expect(follower(liveAt(150), input)).toBeLessThan(12);
    expect(follower(liveAt(4000), input)).toBeCloseTo(12, 4);
  });
});

describe("follow on a stream of samples", () => {
  const mouthContract = inputs({ values: { mouthOpen: {} } });
  const stream = (count: number, step = 33): Input =>
    Array.from({ length: count }, (_, index) => ({
      kind: "value",
      name: "mouthOpen",
      at: index * step,
      value: (Math.sin(index * 0.7) + 1) / 2,
    }));
  const fresh = () => follow(value(mouthContract, "mouthOpen"));

  it("springs to each sample's own value, and ignores unset streams", () => {
    const mouth = fresh();
    expect(
      mouth(liveAt(4000), [{ kind: "value", name: "mouthOpen", at: 0, value: 0.6 }]),
    ).toBeCloseTo(0.6, 4);
    expect(mouth(liveAt(4000), [])).toBe(0);
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
    let log = [...stream(200)];
    const kept = fresh();
    for (let ms = 0; ms < 6600; ms += 16) {
      while (log.length < 400 && (log.at(-1)?.at ?? 0) < ms)
        log = [
          ...log,
          { kind: "value", name: "mouthOpen", at: (log.at(-1)?.at ?? 0) + 33, value: ms % 7 },
        ];
      expect(kept(liveAt(ms), log)).toBe(fresh()(liveAt(ms), log));
    }
    const other = stream(50, 20);
    expect(kept(liveAt(900), other)).toBe(fresh()(liveAt(900), other));
  });

  it("starts again on a log that shares its last event but differs before it", () => {
    const last = { kind: "value" as const, name: "mouthOpen", at: 1000, value: 0 };
    const kept = fresh();
    const up: Input = [{ kind: "value", name: "mouthOpen", at: 0, value: 5 }, last];
    const down: Input = [{ kind: "value", name: "mouthOpen", at: 0, value: -5 }, last];
    kept(liveAt(1100), up);
    expect(kept(liveAt(1100), down)).toBe(fresh()(liveAt(1100), down));
    const edited = [...up];
    kept(liveAt(1100), edited);
    const replaced = [
      { kind: "value" as const, name: "mouthOpen", at: 0, value: 2 },
      ...edited.slice(1),
    ];
    expect(kept(liveAt(1100), replaced)).toBe(fresh()(liveAt(1100), replaced));
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
      const each = (time: Parameters<ReturnType<typeof fresh>>[0], events: Input) =>
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
    const enter = state(0, (current, entry) => (entry.name === "enter" ? -8 : current));
    const liftSpring = follow(enter);
    const at = (ms: number) =>
      liftSpring(liveAt(ms), [{ kind: "trigger", name: "enter", at: 0, value: 1 }]);
    expect(at(3000)).toBe(-8);
    expect(at(3016)).toBe(-8);
    expect(at(100)).not.toBe(-8);
  });
});

describe("react", () => {
  const hits = inputs({
    triggers: {
      land: { targets: ["ball", "cup"] },
      jump: { targets: ["ball"] },
    },
  });
  const land = (...at: number[]): Input =>
    at.map((ms) => ({ kind: "trigger", name: "land", at: ms, value: 1, target: "ball" }));
  const at = (ms: number) => ({
    progress: 0,
    clock: { kind: "timed" as const, elapsed: ms, length: 5000 },
  });

  it("is exactly 0 before its event and once the response has died", () => {
    const recoil = react(triggers(hits, "land"), { kind: "recoil", amplitude: 10 });
    expect(recoil(at(999), land(1000))).toBe(0);
    expect(recoil(at(1000), land(1000))).toBeCloseTo(10, 9);
    expect(recoil(at(4000), land(1000))).toBe(0);
  });

  it("starts each kind where it should: recoil full, wobble and shake at rest, flash full and fading", () => {
    const start = (kind: "recoil" | "wobble" | "flash" | "shake") =>
      react(triggers(hits, "land"), { kind, amplitude: 1 })(at(1000), land(1000));
    expect([start("recoil"), start("wobble"), start("flash")]).toEqual([1, 0, 1]);
    expect(Math.abs(start("shake"))).toBeLessThan(1);
    const flash = react(triggers(hits, "land"), { kind: "flash", amplitude: 1 });
    expect(flash(at(1100), land(1000))).toBeLessThan(flash(at(1050), land(1000)));
  });

  it("adds the responses to several events, and ignores triggers of another name or target", () => {
    const wobble = react(triggers(hits, "land", "ball"), { kind: "wobble", amplitude: 1 });
    const one = wobble(at(1100), land(1000));
    const other = wobble(at(1100), land(1050));
    expect(wobble(at(1100), mergeInput(land(1050), land(1000)))).toBeCloseTo(one + other, 9);
    expect(
      wobble(at(1100), [{ kind: "trigger", name: "land", at: 1000, value: 1, target: "cup" }]),
    ).toBe(0);
    expect(
      wobble(at(1100), [{ kind: "trigger", name: "jump", at: 1000, value: 1, target: "ball" }]),
    ).toBe(0);
  });
});
