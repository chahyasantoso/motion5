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
  readStageModule,
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

  it("refuses a name used twice, a name with a dot, and a presence the story lacks", () => {
    expect(() => castNames({ a: group({ dot: actor() }), dot: actor() })).toThrow(/used twice/);
    expect(() => castNames({ dot: actor({ enters: "nope" }) }, ["start"])).toThrow(/nope/);
    expect(() => castNames({ dust: many(2), "dust.1": actor() })).toThrow(/dot/);
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

describe("reading a stage module", () => {
  const good = {
    beats: story(1000, { go: [0, 1000] }),
    cast: { dot: actor() },
    skins: { dom: { css: "" } },
    scene: () => ({ dot: { x: 1 } }),
  };

  it("answers the module, its scene checked to answer an object", () => {
    const read = readStageModule(good);
    if ("reason" in read) throw new Error(read.reason);
    expect(read.beats.order).toEqual(["go"]);
    expect(read.scene(at(0, 1000), [], NO_REST)).toEqual({ dot: { x: 1 } });
  });

  it("answers why a value is not one, and never throws", () => {
    const why = (value: unknown) => {
      const read = readStageModule(value);
      return "reason" in read ? read.reason : "";
    };
    expect(why(undefined)).toMatch(/exports nothing/);
    expect(why({ ...good, scene: 1 })).toMatch(/scene/);
    expect(why({ ...good, beats: { durationMs: 1 } })).toMatch(/story/);
    expect(why({ ...good, cast: { dot: { kind: "shape" } } })).toMatch(/cast/);
    expect(why({ ...good, cast: { "a.b": actor() } })).toMatch(/dot/);
    expect(why({ ...good, skins: { dom: { css: 1 } } })).toMatch(/skins/);
    expect(why({ ...good, rest: { dot: { x: 1 } } })).toMatch(/rest/);
    expect(why({ ...good, frame: { width: 0, height: 1 } })).toMatch(/frame/);
  });
});
