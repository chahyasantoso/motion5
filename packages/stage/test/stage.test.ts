import { describe, expect, it } from "vitest";
import { span, type Time } from "@gerak/moves";
import {
  NO_REST,
  actor,
  castNames,
  frame,
  group,
  letters,
  many,
  restOf,
  story,
  words,
} from "@gerak/stage";

const at = (elapsed: number, length: number): Time => ({
  progress: elapsed / length,
  clock: { kind: "timed", elapsed, length },
});

describe("the cast", () => {
  it("records only what each maker was given", () => {
    expect(actor()).toEqual({ kind: "actor" });
    expect(actor({ text: "Saved", watch: true })).toEqual({
      kind: "actor",
      text: "Saved",
      watch: true,
    });
    expect(many(3).items).toHaveLength(3);
    expect(Object.isFrozen(group({ a: actor() }))).toBe(true);
    expect(() => many(-1)).toThrow(RangeError);
    expect(() => many(1.5)).toThrow(RangeError);
  });

  it("splits text into one text actor per letter or word, in order", () => {
    expect(letters("ABC").items.map(({ text }) => text)).toEqual(["A", "B", "C"]);
    expect(words(" night  shift ").items.map(({ text }) => text)).toEqual(["night", "shift"]);
  });

  it("names every member, item and group, with presence taken from the nearest group", () => {
    const cast = {
      camera: group(
        {
          dot: actor(),
          word: letters("HI", { leaves: "end" }),
        },
        { enters: "start" },
      ),
      card: actor({ watch: true }),
    };
    const names = castNames(cast, ["start", "end"]);
    expect(names.map(({ name }) => name)).toEqual([
      "camera",
      "dot",
      "word",
      "word.0",
      "word.1",
      "card",
    ]);
    const byName = new Map(names.map((entry) => [entry.name, entry]));
    expect(byName.get("dot")).toMatchObject({ groups: ["camera"], enters: "start", watch: false });
    expect(byName.get("word.1")).toMatchObject({
      kind: "item",
      enters: "start",
      leaves: "end",
      text: "I",
    });
    expect(byName.get("card")).toMatchObject({ watch: true, groups: [] });
  });

  it("refuses a name used twice and a presence the story lacks", () => {
    expect(() => castNames({ a: group({ dot: actor() }), dot: actor() })).toThrow(/used twice/);
    expect(() => castNames({ dot: actor({ enters: "nope" }) }, ["start"])).toThrow(/nope/);
  });
});

describe("the story", () => {
  it("gives one span per beat, its length and its order", () => {
    const beats = story(3000, { open: [0, 1000], close: [800, 3000] });
    expect(beats.durationMs).toBe(3000);
    expect(beats.order).toEqual(["open", "close"]);
    const time = at(900, 3000);
    expect(beats.close.of(time)).toEqual(span(800, 3000).of(time));
    expect(beats.open.of(time).progress).toBeCloseTo(0.9);
  });

  it("refuses a beat that runs backwards, past the end, or takes a kept name", () => {
    expect(() => story(1000, { a: [500, 200] })).toThrow(RangeError);
    expect(() => story(1000, { a: [0, 1200] })).toThrow(RangeError);
    expect(() => story(1000, { order: [0, 100] })).toThrow(/keeps/);
    expect(() => story(0, {})).toThrow(RangeError);
  });

  it("sizes a frame and refuses an empty one", () => {
    expect(frame({ width: 400, height: 200 })).toEqual({ width: 400, height: 200 });
    expect(() => frame({ width: 0, height: 10 })).toThrow(RangeError);
  });
});

describe("where things rest", () => {
  it("answers a zero box for a name nothing measured", () => {
    expect(restOf(NO_REST, "dot")).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    expect(restOf({ dot: { x: 4, y: 5, width: 6, height: 7 } }, "dot")).toEqual({
      x: 4,
      y: 5,
      width: 6,
      height: 7,
    });
  });
});
