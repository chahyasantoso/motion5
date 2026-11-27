import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  inputLog,
  inputs,
  isInputEntry,
  liveAt,
  tally,
  type Input,
  type InputEntry,
} from "@gerak/core";

const samples: Input = [
  { kind: "value", name: "mouth", at: 100, value: 0.5 },
  { kind: "value", name: "mouth", at: 300, value: 1 },
  { kind: "trigger", name: "blink", at: 350, value: 1 },
  { kind: "value", name: "mouth", at: 400, value: 0 },
  { kind: "value", name: "mouth", at: 600, value: 0.25 },
  { kind: "value", name: "mouth", at: 1000, value: 0 },
];

/** The area under the held samples up to `now` ms, in value-seconds, summed one ms at a time. */
function byHand(events: Input, now: number): number {
  let total = 0;
  for (let ms = 0; ms < now; ms += 1) {
    let held = 0;
    for (const event of events) if (event.name === "mouth" && event.at <= ms) held = event.value;
    total += held / 1000;
  }
  return total;
}

/** `list` with each event behind a proxy that counts how many of its fields are read. */
function counted(list: readonly InputEntry[]): { events: Input; reads: () => number } {
  let reads = 0;
  const events = list.map(
    (event) =>
      new Proxy(event, {
        get(target, key, receiver) {
          reads += 1;
          return Reflect.get(target, key, receiver);
        },
      }),
  );
  return { events, reads: () => reads };
}

const stream = (count: number): InputEntry[] =>
  Array.from({ length: count }, (_, index) => ({
    kind: "value",
    name: "mouth",
    at: index * 48,
    value: index % 3 === 0 ? 0 : 0.5,
  }));

describe("tally", () => {
  const said = tally({ start: 0, on: { mouth: "value" } });

  it("equals the area summed by hand over the held samples, at any time", () => {
    for (const now of [0, 50, 100, 250, 300, 399, 400, 500, 999, 1000, 2000])
      expect(said(liveAt(now), samples)).toBeCloseTo(byHand(samples, now), 9);
  });

  it("answers the whole stream's area with total, so tally over total runs 0 to 1", () => {
    expect(said.total(samples)).toBeCloseTo(byHand(samples, 1000), 9);
    expect(said(liveAt(1000), samples) / said.total(samples)).toBeCloseTo(1, 9);
    expect(said(liveAt(0), samples) / said.total(samples)).toBe(0);
  });

  it("holds start before the first sample, counts a named goal, and keeps to its target", () => {
    const on = tally({ start: 1, on: { open: 1, shut: 0 }, target: "lid" });
    const lid: Input = [
      { kind: "trigger", name: "shut", at: 200, value: 1, target: "lid" },
      { kind: "trigger", name: "open", at: 500, value: 1, target: "lid" },
      { kind: "trigger", name: "shut", at: 700, value: 1, target: "eye" },
    ];
    expect(on(liveAt(1000), lid)).toBeCloseTo(0.2 + 0.5, 9);
    expect(on.total(lid)).toBeCloseTo(0.2, 9);
  });

  it("answers the whole area without a clock, and 0 with no events", () => {
    expect(said({ progress: 0, clock: UNTIMED }, samples)).toBeCloseTo(said.total(samples), 9);
    expect(said(liveAt(500), [])).toBe(0);
    expect(said.total([])).toBe(0);
  });

  it("reads each event's fields once however often it is asked, seeking or playing", () => {
    const { events, reads } = counted(stream(400));
    const sampler = tally({ start: 0, on: { mouth: "value" } });
    sampler(liveAt(100), events);
    const first = reads();
    for (let ms = 0; ms < 20000; ms += 16) sampler(liveAt(ms), events);
    sampler(liveAt(50), events);
    sampler.total(events);
    expect(reads()).toBe(first);
    expect(first).toBeLessThanOrEqual(400 * 6);
  });

  it("extends its table when a live list grows by appending, rather than rebuilding it", () => {
    let reads = 0;
    const sampler = tally({
      start: 0,
      on: {
        get mouth() {
          reads += 1;
          return "value" as const;
        },
      },
    });
    const contract = inputs({ triggers: { mouth: {} } });
    const entries = stream(800);
    const log = inputLog();
    for (const event of entries.slice(0, 400)) {
      log.trigger(event.at, contract, "mouth", event.value);
    }
    sampler(liveAt(30000), log.input);
    const before = reads;
    expect(before).toBe(400);
    for (const event of entries.slice(400)) {
      log.trigger(event.at, contract, "mouth", event.value);
    }
    expect(sampler(liveAt(30000), log.input)).toBeCloseTo(byHand(entries, 30000), 6);
    expect(reads - before).toBe(400);
  });

  it("rebuilds for a list that differs inside what it read, even with the same ends", () => {
    const sampler = tally({ start: 0, on: { a: 1, b: 0 } });
    const first: InputEntry = { kind: "trigger", name: "a", at: 0, value: 1 };
    const last: InputEntry = { kind: "trigger", name: "a", at: 2000, value: 1 };
    expect(
      sampler(liveAt(3000), [first, { kind: "trigger", name: "b", at: 1000, value: 1 }, last]),
    ).toBeCloseTo(2, 9);
    expect(
      sampler(liveAt(3000), [first, { kind: "trigger", name: "a", at: 1000, value: 1 }, last]),
    ).toBeCloseTo(3, 9);
  });

  it("refuses events out of time order", () => {
    const sampler = tally({ start: 0, on: { a: 1 } });
    const late: Input = [
      { kind: "trigger", name: "a", at: 2000, value: 1 },
      { kind: "trigger", name: "a", at: 1000, value: 1 },
    ];
    expect(() => sampler(liveAt(3000), late)).toThrow(/tally: events must be oldest first/);
  });

  it("builds a fresh table for a list that is not an extension of the last", () => {
    const sampler = tally({ start: 0, on: { mouth: "value" } });
    sampler(liveAt(2000), samples);
    const other: Input = [{ kind: "value", name: "mouth", at: 0, value: 2 }];
    expect(sampler(liveAt(500), other)).toBeCloseTo(1, 9);
  });
});

describe("isInputEntry", () => {
  it("accepts a contact's point and other, and refuses them of the wrong kind", () => {
    const point = { x: 1, y: 2, z: 3 };
    expect(
      isInputEntry({ kind: "trigger", name: "contact", at: 0, value: 1, point, other: "floor" }),
    ).toBe(true);
    expect(
      isInputEntry({ kind: "value", name: "contact", at: 0, value: 1, point: { x: 1, y: 2 } }),
    ).toBe(true);
    expect(
      isInputEntry({
        kind: "trigger",
        name: "contact",
        at: 0,
        value: 1,
        point: { x: 1, y: 2, z: "3" },
      }),
    ).toBe(false);
    expect(
      isInputEntry({ kind: "trigger", name: "contact", at: 0, value: 1, point: { x: 1 } }),
    ).toBe(false);
    expect(isInputEntry({ kind: "trigger", name: "contact", at: 0, value: 1, point: 4 })).toBe(
      false,
    );
    expect(isInputEntry({ kind: "trigger", name: "contact", at: 0, value: 1, other: 4 })).toBe(
      false,
    );
    expect(isInputEntry({ name: "contact", at: 0, value: 1 })).toBe(false);
    expect(isInputEntry({ kind: "trigger", name: "contact", at: 0 })).toBe(false);
  });
});
