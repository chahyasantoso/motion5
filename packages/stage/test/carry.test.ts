import { describe, expect, it } from "vitest";
import type { Events, Pose2d, Time } from "@gerak/moves";
import { carried, carry, type Box, type CarrySize } from "@gerak/stage";

const at = (elapsed: number): Time => ({
  progress: elapsed / 2000,
  clock: { kind: "timed", elapsed, length: 2000 },
});

const own: Box = { x: 100, y: 50, width: 80, height: 40 };
const from: Box = { x: 10, y: 20, width: 40, height: 20 };
const to: Box = { x: 300, y: 200, width: 160, height: 120 };

// The box the DOM draws: translate, then scale about the centre.
function drawn(pose: Pose2d, rest: Box): Box {
  return {
    x: rest.x + (pose.x ?? 0),
    y: rest.y + (pose.y ?? 0),
    width: rest.width * (pose.scaleX ?? 1),
    height: rest.height * (pose.scaleY ?? 1),
  };
}

const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
const between = (a: Box, b: Box, p: number): Box => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p),
  width: lerp(a.width, b.width, p),
  height: lerp(a.height, b.height, p),
});

describe("carry", () => {
  it("draws the interpolated box by scaling", () => {
    for (const p of [0, 0.5, 1]) {
      const box = drawn(carry(own, from, to, p), own);
      const want = between(from, to, p);
      expect(box.x).toBeCloseTo(want.x);
      expect(box.y).toBeCloseTo(want.y);
      expect(box.width).toBeCloseTo(want.width);
      expect(box.height).toBeCloseTo(want.height);
    }
  });

  it("keeps the size and puts the centre on the interpolated centre", () => {
    for (const p of [0, 0.5, 1]) {
      const pose = carry(own, from, to, p, "keep");
      const want = between(from, to, p);
      expect(pose.scaleX).toBeUndefined();
      expect(pose.scaleY).toBeUndefined();
      expect(own.x + (pose.x ?? 0)).toBeCloseTo(want.x);
      expect(own.y + (pose.y ?? 0)).toBeCloseTo(want.y);
    }
  });

  it("clips unscaled, centred, to the interpolated box", () => {
    const pose = carry(own, from, to, 0, "clip");
    expect(pose.scaleX).toBeUndefined();
    expect(own.x + (pose.x ?? 0)).toBeCloseTo(from.x);
    expect(pose.clipX).toBe(40);
    expect(pose.clipY).toBe(20);
    expect(pose.clipWidth).toBeCloseTo(Math.min(from.width, own.width));
    expect(pose.clipHeight).toBeCloseTo(Math.min(from.height, own.height));
    expect(pose.clipRadius).toBeUndefined();
    const grown = carry(own, from, to, 1, "clip");
    expect(grown.clipWidth).toBeUndefined();
  });

  it("answers the rest pose where the member rests", () => {
    const sizes: CarrySize[] = ["scale", "clip", "keep"];
    for (const size of sizes) expect(carry(own, from, own, 1, size)).toEqual({});
  });

  it("carries past `to` when an ease overshoots, never to a negative size", () => {
    const past = carry(own, from, to, 1.1, "keep");
    const at = carry(own, from, to, 1, "keep");
    expect(Math.abs((past.x ?? 0) - (at.x ?? 0))).toBeGreaterThan(0);
    const shrunk = carry(own, own, { ...own, width: 1, height: 1 }, 5);
    expect(shrunk.scaleX ?? 1).toBeGreaterThanOrEqual(0);
  });

  it("carries nothing from or to a box with no size, as a tool with no renderer measures", () => {
    const none: Box = { x: 0, y: 0, width: 0, height: 10 };
    expect(carry(own, none, to, 0)).toEqual(carry(own, to, to, 0));
    expect(carry(own, from, none, 1, "clip")).toEqual(carry(own, from, from, 1, "clip"));
    expect(carry(none, none, none, 0.5)).toEqual({});
    expect(carry(none, from, to, 0.5).scaleX).toBeUndefined();
  });
});

describe("carried", () => {
  const boxes: Record<string, Box> = {
    a: { x: 0, y: 0, width: 100, height: 100 },
    b: { x: 200, y: 0, width: 100, height: 100 },
    c: { x: 200, y: 300, width: 200, height: 100 },
  };
  const first = boxes.a as Box;
  const at0 = (events: Events): Box => {
    const named = events.length === 0 ? "a" : (events[events.length - 1]?.name ?? "a");
    return boxes[named] ?? first;
  };
  const events = (...list: [string, number][]): Events =>
    list.map(([name, when]) => ({ name, at: when, target: "t" }));
  const draw = (list: Events, t: number): Box =>
    drawn(carried({ own: first, at: at0, events: list, time: at(t), ms: 400 }), first);

  it("draws the old box at the event and the new one a carry later", () => {
    const list = events(["b", 1000]);
    expect(draw(list, 1000).x).toBeCloseTo(0);
    expect(draw(list, 1200).x).toBeCloseTo(100);
    expect(draw(list, 1400).x).toBeCloseTo(200);
    expect(draw(list, 1900).x).toBeCloseTo(200);
  });

  it("sets off from where it is drawn when a second change comes mid-carry", () => {
    const list = events(["b", 1000], ["c", 1100]);
    let previous = draw(list, 1090);
    let worst = 0;
    for (let t = 1100; t <= 1600; t += 10) {
      const box = draw(list, t);
      worst = Math.max(worst, Math.abs(box.x - previous.x), Math.abs(box.y - previous.y));
      previous = box;
    }
    // A single carry covers 200 px across 400 ms: 5 px a frame of 10 ms; allow its double for the turn.
    expect(worst).toBeLessThan(10);
    expect(draw(list, 1500).y).toBeCloseTo(300);
    expect(draw(list, 1500).width).toBeCloseTo(200);
  });

  it("answers a seek as it answered playing forwards", () => {
    const list = events(["b", 1000], ["c", 1100]);
    let sweep: Box | undefined;
    for (let t = 900; t <= 1250; t += 10) {
      const box = draw(list, t);
      if (t === 1250) sweep = box;
    }
    expect(draw(list, 1250)).toEqual(sweep);
    expect(draw(list, 1050)).toEqual(draw(list, 1050));
  });

  it("ignores events after the time", () => {
    const list = events(["b", 1000], ["c", 3000]);
    expect(draw(list, 2000)).toEqual(draw(events(["b", 1000]), 2000));
  });

  it("does not move for an event that leaves the box where it was", () => {
    expect(draw(events(["a", 500]), 600)).toEqual(first);
  });

  it("draws no jump for two changes at one ms, even with an ease that does not start at 0", () => {
    const lifted = (u: number) => 0.2 + 0.8 * u;
    const list = events(["b", 1000], ["a", 1000]);
    const pose = (t: number) =>
      carried({ own: first, at: at0, events: list, time: at(t), ms: 400, ease: lifted });
    expect(pose(999)).toEqual({});
    expect(pose(1000)).toEqual({});
  });

  it("asks `at` only about changes still moving, however long the history", () => {
    let asked = 0;
    const counted = (past: Events): Box => {
      asked += 1;
      return at0(past);
    };
    const long = events(
      ...Array.from({ length: 2000 }, (_, i): [string, number] => [i % 2 ? "a" : "b", i * 1000]),
    );
    carried({ own: first, at: counted, events: long, time: at(1999 * 1000 + 100), ms: 400 });
    expect(asked).toBeLessThan(10);
  });

  it("refuses a carry of no length", () => {
    expect(() => carried({ own: first, at: at0, events: [], time: at(0), ms: 0 })).toThrow(
      RangeError,
    );
  });
});
