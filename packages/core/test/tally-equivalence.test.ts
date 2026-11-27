import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  elapsedOf,
  liveAt,
  tally,
  type Input,
  type InputEntry,
  type Time,
} from "@gerak/core";

interface Options {
  readonly start: number;
  readonly on: Readonly<Record<string, number | "value">>;
  readonly target?: string;
}

/** A frozen copy of the table-building tally this one must keep matching. */
function oldTally(options: Options) {
  const valueOf = (event: InputEntry): number | undefined => {
    if (options.target !== undefined && event.target !== options.target) return undefined;
    const held = options.on[event.name];
    return held === "value" ? event.value : held;
  };
  const build = (events: Input) => {
    const times: number[] = [];
    const values: number[] = [];
    const areas: number[] = [];
    for (const event of events) {
      const held = valueOf(event);
      if (held === undefined) continue;
      const count = times.length;
      const since = count === 0 ? 0 : (times[count - 1] ?? 0);
      if (event.at < since) throw new RangeError("tally: events must be oldest first");
      const before = count === 0 ? options.start : (values[count - 1] ?? 0);
      const area = count === 0 ? 0 : (areas[count - 1] ?? 0);
      times.push(event.at);
      values.push(held);
      areas.push(area + (before * (event.at - since)) / 1000);
    }
    return { times, values, areas };
  };
  const total = (events: Input): number => build(events).areas.at(-1) ?? 0;
  const at = (time: Time, events: Input): number => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return total(events);
    const { times, values, areas } = build(events);
    let index = -1;
    for (let each = 0; each < times.length; each += 1) if ((times[each] ?? 0) <= now) index = each;
    if (index < 0) return (options.start * Math.max(0, now)) / 1000;
    return (areas[index] ?? 0) + ((values[index] ?? 0) * (now - (times[index] ?? 0))) / 1000;
  };
  return { at, total };
}

const TIMES = Array.from({ length: 190 }, (_, index) => index * 16);

function agree(options: Options, lists: readonly Input[]) {
  const before = oldTally(options);
  const now = tally(options);
  for (const events of lists) {
    for (const ms of TIMES)
      expect(now(liveAt(ms), events), `${ms} ms`).toBeCloseTo(before.at(liveAt(ms), events), 9);
    expect(now.total(events)).toBeCloseTo(before.total(events), 9);
  }
}

const samples: Input = [
  { kind: "value", name: "mouth", at: 100, value: 0.5 },
  { kind: "trigger", name: "blink", at: 350, value: 1 },
  { kind: "value", name: "mouth", at: 400, value: 0.5 },
  { kind: "value", name: "mouth", at: 600, value: 0.25 },
  { kind: "value", name: "mouth", at: 1000, value: 0 },
  { kind: "value", name: "mouth", at: 1000, value: 2 },
  { kind: "value", name: "mouth", at: 2500, value: 1 },
];

describe("tally keeps the values it had", () => {
  it("matches over value events, including two of the same value in a row", () => {
    agree({ start: 0.2, on: { mouth: "value" } }, [samples, []]);
  });

  it("matches with named goals and a target filter", () => {
    const events: Input = [
      { kind: "trigger", name: "shut", at: 200, value: 1, target: "lid" },
      { kind: "trigger", name: "open", at: 500, value: 1, target: "lid" },
      { kind: "trigger", name: "shut", at: 700, value: 1, target: "eye" },
      { kind: "trigger", name: "shut", at: 900, value: 1, target: "lid" },
    ];
    agree({ start: 1, on: { open: 1, shut: 0 }, target: "lid" }, [events]);
  });

  it("matches after a jump back in time", () => {
    const options: Options = { start: 0, on: { mouth: "value" } };
    const before = oldTally(options);
    const now = tally(options);
    for (const ms of [0, 2000, 300, 1200, 50, 2900, 400])
      expect(now(liveAt(ms), samples)).toBeCloseTo(before.at(liveAt(ms), samples), 9);
  });

  it("matches on an untimed clock", () => {
    const options: Options = { start: 0, on: { mouth: "value" } };
    const untimed: Time = { progress: 0, clock: UNTIMED };
    expect(tally(options)(untimed, samples)).toBeCloseTo(oldTally(options).at(untimed, samples), 9);
  });

  it("matches while a list grows by appending", () => {
    const options: Options = { start: 0, on: { mouth: "value" } };
    const before = oldTally(options);
    const now = tally(options);
    for (let count = 0; count <= samples.length; count += 1) {
      const events = samples.slice(0, count);
      for (const ms of TIMES.filter((_, index) => index % 7 === 0))
        expect(now(liveAt(ms), events)).toBeCloseTo(before.at(liveAt(ms), events), 9);
    }
  });
});
