import { describe, expect, it } from "vitest";
import { span, toCubics, type Time } from "@gerak/moves";
import {
  NO_REST,
  actor,
  castNames,
  frame,
  group,
  letters,
  many,
  pathOf,
  readStageModule,
  restOf,
  story,
  words,
  type Rest,
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

  it("splits letters by grapheme, so an accented letter or a toned emoji is one", () => {
    expect(letters("é👍🏽").items.map(({ text }) => text)).toEqual(["é", "👍🏽"]);
    expect(letters("é👍🏽").items).toHaveLength(2);
  });

  it("records a path as frozen cubics, and the cast name carries it", () => {
    const path = toCubics([
      { id: "a", x: 0, y: 0, inX: 0, inY: 0, outX: 10, outY: 0 },
      { id: "b", x: 40, y: 20, inX: -10, inY: 0, outX: 0, outY: 0 },
    ]);
    const stroke = actor({ path });
    expect(stroke.path).toEqual(path);
    expect(Object.isFrozen(pathOf(stroke.path ?? [], NO_REST)[0])).toBe(true);
    expect(castNames({ stroke }).at(0)?.path).toEqual(path);
    const strokes = many([path, path], (each) => actor({ path: each }));
    expect(castNames({ strokes }).map(({ path: own }) => own?.length)).toEqual([undefined, 1, 1]);
  });

  it("answers a path function's cubics where things rest, checked and frozen", () => {
    const under = (rest: Rest) => {
      const word = restOf(rest, "word");
      const y = word.y + word.height / 2;
      return toCubics([
        { id: "a", x: word.x - word.width / 2, y, inX: 0, inY: 0, outX: 0, outY: 0 },
        { id: "b", x: word.x + word.width / 2, y, inX: 0, inY: 0, outX: 0, outY: 0 },
      ]);
    };
    const stroke = actor({ path: under });
    expect(stroke.path).toBe(under);
    expect(castNames({ stroke }).at(0)?.path).toBe(under);
    const cubics = pathOf(under, { word: { x: 100, y: 50, width: 80, height: 20 } });
    expect([cubics[0]?.x0, cubics[0]?.y0, cubics[0]?.x3]).toEqual([60, 60, 140]);
    expect(Object.isFrozen(cubics[0])).toBe(true);
    expect(() => pathOf(() => [], NO_REST)).toThrow(/cubics/);
  });

  it("names every member, item and group, with presence taken from the nearest group", () => {
    const cast = {
      camera: group(
        {
          dot: actor(),
          word: letters("HI", { on: [["start", "end"], "late"] }),
        },
        { on: ["start"] },
      ),
      card: actor({ watch: true }),
    };
    const names = castNames(cast, ["start", "end", "late"]);
    expect(names.map(({ name }) => name)).toEqual([
      "camera",
      "dot",
      "word",
      "word.0",
      "word.1",
      "card",
    ]);
    const byName = new Map(names.map((entry) => [entry.name, entry]));
    expect(byName.get("dot")).toMatchObject({
      groups: ["camera"],
      on: [["start", "start"]],
      watch: false,
    });
    expect(byName.get("word.1")).toMatchObject({
      kind: "item",
      on: [
        ["start", "end"],
        ["late", "late"],
      ],
      text: "I",
    });
    expect(byName.get("card")).toMatchObject({ watch: true, groups: [] });
    expect(byName.get("card")?.on).toBeUndefined();
  });

  it("refuses a name used twice, a name with a dot, and a presence the story lacks", () => {
    expect(() => castNames({ a: group({ dot: actor() }), dot: actor() })).toThrow(/used twice/);
    expect(() => castNames({ dot: actor({ on: ["nope"] }) }, ["start"])).toThrow(/nope/);
    expect(() => castNames({ dot: actor({ on: [["start", "gone"]] }) }, ["start"])).toThrow(/gone/);
    expect(() => castNames({ dust: many(1, { on: ["start"] }) }, ["end"])).toThrow(/start/);
    expect(() => castNames({ dot: actor({ on: [] }) })).toThrow(/empty/);
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
    expect(why({ ...good, cast: { dot: { kind: "actor", path: "M0 0" } } })).toMatch(/path/);
    expect(why({ ...good, cast: { dot: { kind: "actor", path: [{ id: "a", x0: 0 }] } } })).toMatch(
      /path/,
    );
    expect(why({ ...good, cast: { dot: { kind: "actor", on: [["go"]] } } })).toMatch(/on/);
    const stroke = actor({
      path: [{ id: "a", x0: 0, y0: 0, x1: 1, y1: 0, x2: 2, y2: 0, x3: 3, y3: 0 }],
      on: ["go"],
    });
    expect(why({ ...good, cast: { dot: stroke } })).toBe("");
    expect(
      why({ ...good, cast: { dot: actor({ path: () => pathOf(stroke.path ?? [], NO_REST) }) } }),
    ).toBe("");
    expect(why({ ...good, skins: { dom: { css: 1 } } })).toMatch(/skins/);
    expect(why({ ...good, rest: { dot: { x: 1 } } })).toMatch(/rest/);
    expect(why({ ...good, frame: { width: 0, height: 1 } })).toMatch(/frame/);
    expect(why({ ...good, cast: { dot: { kind: "actor", enters: "go" } } })).toMatch(/enters/);
    expect(why({ ...good, cast: { dot: { kind: "actor", path: [] } } })).toMatch(/path/);
    const two = story(1000, { a: [0, 400], b: [600, 1000] });
    expect(why({ ...good, beats: two, cast: { dot: actor({ on: [["b", "a"]] }) } })).toMatch(
      /ends before it starts/,
    );
  });
});
