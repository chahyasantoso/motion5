import { describe, expect, it } from "vitest";
import { UNTIMED, isMotionEvent, liveAt, tally, type Events, type MotionEvent } from "@gerak/moves";

const samples: Events = [
  { name: "mouth", at: 100, value: 0.5 },
  { name: "mouth", at: 300, value: 1 },
  { name: "blink", at: 350 },
  { name: "mouth", at: 400, value: 0 },
  { name: "mouth", at: 600, value: 0.25 },
  { name: "mouth", at: 1000, value: 0 },
];

/** The area under the held samples up to `now` ms, in value-seconds, summed one ms at a time. */
function byHand(events: Events, now: number): number {
  let total = 0;
  for (let ms = 0; ms < now; ms += 1) {
    let held = 0;
    for (const event of events)
      if (event.name === "mouth" && event.at <= ms) held = event.value ?? held;
    total += held / 1000;
  }
  return total;
}

/** `list` behind a proxy that counts how many of its events are read. */
function counted(list: readonly MotionEvent[]): { events: Events; reads: () => number } {
  let reads = 0;
  const events = new Proxy(list, {
    get(target, key, receiver) {
      if (typeof key === "string" && /^\d+$/.test(key)) reads += 1;
      return Reflect.get(target, key, receiver);
    },
  });
  return { events, reads: () => reads };
}

const stream = (count: number): MotionEvent[] =>
  Array.from({ length: count }, (_, index) => ({
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
    const lid: Events = [
      { name: "shut", at: 200, target: "lid" },
      { name: "open", at: 500, target: "lid" },
      { name: "shut", at: 700, target: "eye" },
    ];
    expect(on(liveAt(1000), lid)).toBeCloseTo(0.2 + 0.5, 9);
    expect(on.total(lid)).toBeCloseTo(0.2, 9);
  });

  it("answers the whole area without a clock, and 0 with no events", () => {
    expect(said({ progress: 0, clock: UNTIMED }, samples)).toBeCloseTo(said.total(samples), 9);
    expect(said(liveAt(500), [])).toBe(0);
    expect(said.total([])).toBe(0);
  });

  it("reads each event once however often it is asked, seeking or playing", () => {
    const { events, reads } = counted(stream(400));
    const sampler = tally({ start: 0, on: { mouth: "value" } });
    sampler(liveAt(100), events);
    const first = reads();
    for (let ms = 0; ms < 20000; ms += 16) sampler(liveAt(ms), events);
    sampler(liveAt(50), events);
    sampler.total(events);
    expect(reads() - first).toBeLessThanOrEqual(2 * 1300);
    expect(first).toBeLessThanOrEqual(400 + 4);
  });

  it("extends its table when a live list grows by appending, rather than rebuilding it", () => {
    const sampler = tally({ start: 0, on: { mouth: "value" } });
    const all = stream(800);
    sampler(liveAt(0), all.slice(0, 400));
    const { events, reads } = counted(all);
    expect(sampler(liveAt(30000), events)).toBeCloseTo(byHand(all, 30000), 6);
    expect(reads()).toBeLessThanOrEqual(400 + 8);
  });

  it("builds a fresh table for a list that is not an extension of the last", () => {
    const sampler = tally({ start: 0, on: { mouth: "value" } });
    sampler(liveAt(2000), samples);
    const other: Events = [{ name: "mouth", at: 0, value: 2 }];
    expect(sampler(liveAt(500), other)).toBeCloseTo(1, 9);
  });
});

describe("isMotionEvent", () => {
  it("accepts a contact's z and other, and refuses them of the wrong kind", () => {
    expect(isMotionEvent({ name: "contact", at: 0, x: 1, y: 2, z: 3, other: "floor" })).toBe(true);
    expect(isMotionEvent({ name: "contact", at: 0, z: "3" })).toBe(false);
    expect(isMotionEvent({ name: "contact", at: 0, other: 4 })).toBe(false);
  });
});
