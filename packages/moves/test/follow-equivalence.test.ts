import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  elapsedOf,
  liveAt,
  spring,
  type Input,
  type InputEntry,
  type Time,
} from "@gerak/core";
import { follow, type FollowOptions } from "@gerak/moves";

interface Kept {
  readonly index: number;
  readonly goal: number;
  readonly value: number;
  readonly speed: number;
  readonly since: number;
}

/** A frozen copy of the replaying follow this one must keep matching. */
function oldFollow(options: FollowOptions): (time: Time, events: Input) => number {
  const stiffness = options.stiffness ?? 170;
  const damping = options.damping ?? 26;
  const rest = options.rest ?? 0.001;
  const goalOf = (event: InputEntry): number | undefined => {
    if (options.target !== undefined && event.target !== options.target) return undefined;
    const goal = options.on[event.name];
    if (goal === "value") return event.value;
    return goal;
  };
  let kept: Kept | undefined;
  let taken: InputEntry[] = [];
  const sameStart = (events: Input, count: number): boolean => {
    if (events.length < count) return false;
    for (let index = 0; index < count; index += 1) if (events[index] !== taken[index]) return false;
    return true;
  };
  return (time, events) => {
    const now = elapsedOf(time.clock);
    const resumes =
      kept !== undefined &&
      (now === undefined || kept.since <= now) &&
      sameStart(events, kept.index);
    let state = resumes ? kept : undefined;
    const from = state?.index ?? 0;
    for (let index = state?.index ?? 0; index < events.length; index += 1) {
      const event = events[index];
      if (event === undefined) continue;
      const next = goalOf(event);
      if (next === undefined) continue;
      if (now !== undefined && event.at > now) break;
      let value = state?.value ?? options.start;
      let speed = state?.speed ?? 0;
      if (state !== undefined) {
        const moved = spring(
          state.value - state.goal,
          state.speed,
          (event.at - state.since) / 1000,
          {
            stiffness,
            damping,
          },
        );
        value = state.goal + moved.offset;
        speed = moved.speed;
      }
      state = { index: index + 1, goal: next, value, speed, since: event.at };
    }
    if (state === undefined) taken = [];
    else if (from === 0) taken = events.slice(0, state.index);
    else taken.push(...events.slice(from, state.index));
    kept = state;
    if (state === undefined) return options.start;
    if (now === undefined) return state.goal;
    const moved = spring(state.value - state.goal, state.speed, (now - state.since) / 1000, {
      stiffness,
      damping,
    });
    return Math.abs(moved.offset) < rest && Math.abs(moved.speed) < 10 * rest
      ? state.goal
      : state.goal + moved.offset;
  };
}

const TIMES = Array.from({ length: 190 }, (_, index) => index * 16);

/** Both followers read at the same times, in order, over the same lists; their values must agree. */
function agree(options: FollowOptions, lists: readonly Input[], times: readonly number[] = TIMES) {
  const before = oldFollow(options);
  const now = follow(options);
  for (const events of lists)
    for (const ms of times)
      expect(now(liveAt(ms), events), `${ms} ms`).toBeCloseTo(before(liveAt(ms), events), 9);
}

const hover: Input = [
  { kind: "trigger", name: "enter", at: 300, value: 1, target: "card" },
  { kind: "trigger", name: "leave", at: 900, value: 1, target: "card" },
  { kind: "trigger", name: "enter", at: 1100, value: 1, target: "card" },
];

describe("follow keeps the values it had", () => {
  it("matches over a plain hover, with other targets and names in the log", () => {
    const events: Input = [
      { kind: "trigger", name: "enter", at: 200, value: 1, target: "other" },
      ...hover,
      { kind: "trigger", name: "wave", at: 1300, value: 1, target: "card" },
    ];
    agree({ start: 0, on: { enter: -8, leave: 0 }, target: "card" }, [events]);
  });

  it("matches with two events of the same goal in a row", () => {
    const events: Input = [
      { kind: "trigger", name: "enter", at: 300, value: 1 },
      { kind: "trigger", name: "enter", at: 500, value: 1 },
      { kind: "trigger", name: "enter", at: 520, value: 1 },
      { kind: "trigger", name: "leave", at: 1500, value: 1 },
    ];
    agree({ start: 1, on: { enter: -8, leave: 0 } }, [events]);
  });

  it("matches with value events, including repeated values", () => {
    const events: Input = [
      { kind: "value", name: "mouth", at: 100, value: 0.5 },
      { kind: "value", name: "mouth", at: 400, value: 0.5 },
      { kind: "value", name: "mouth", at: 700, value: 1 },
      { kind: "value", name: "mouth", at: 760, value: 0 },
    ];
    agree({ start: 0, on: { mouth: "value" }, stiffness: 300, damping: 20 }, [events]);
  });

  it("matches after a jump back in time and a jump forward again", () => {
    const options: FollowOptions = { start: 0, on: { enter: -8, leave: 0 }, target: "card" };
    const before = oldFollow(options);
    const now = follow(options);
    for (const ms of [0, 400, 1000, 1200, 2000, 500, 100, 950, 2900, 1050, 0, 2800]) {
      expect(now(liveAt(ms), hover), `${ms} ms`).toBeCloseTo(before(liveAt(ms), hover), 9);
    }
  });

  it("matches on an untimed clock", () => {
    const options: FollowOptions = { start: 3, on: { enter: -8, leave: 0 }, target: "card" };
    const untimed: Time = { progress: 0, clock: UNTIMED };
    expect(follow(options)(untimed, hover)).toBe(oldFollow(options)(untimed, hover));
    expect(follow(options)(untimed, [])).toBe(3);
  });

  it("matches while a list grows by appending, and when it is replaced", () => {
    const options: FollowOptions = { start: 0, on: { enter: -8, leave: 0 } };
    const before = oldFollow(options);
    const now = follow(options);
    const all: Input = [
      { kind: "trigger", name: "enter", at: 200, value: 1 },
      { kind: "trigger", name: "leave", at: 600, value: 1 },
      { kind: "trigger", name: "enter", at: 900, value: 1 },
      { kind: "trigger", name: "leave", at: 1400, value: 1 },
    ];
    for (let count = 0; count <= all.length; count += 1)
      for (const ms of TIMES) {
        const events = all.slice(0, count);
        expect(now(liveAt(ms), events), `${count} events, ${ms} ms`).toBeCloseTo(
          before(liveAt(ms), events),
          9,
        );
      }
    const other: Input = [{ kind: "trigger", name: "enter", at: 100, value: 1 }];
    for (const ms of TIMES)
      expect(now(liveAt(ms), other)).toBeCloseTo(before(liveAt(ms), other), 9);
  });
});
