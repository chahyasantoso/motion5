import { mergeEvents, timeAt, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  NO_REST,
  ZERO_BOX,
  beatAt,
  check,
  compileStage,
  defineStage,
  formatStageError,
  frame,
  listPose,
  restReader,
  type Members,
  type Stage,
  type StageDefinition,
} from "../src";

const at = (ms: number, length = 1000): Time =>
  timeAt({ progress: 0, clock: { kind: "timed", elapsed: 0, length } }, ms);

function compiled<B extends string, M extends Members<B>, L extends string>(
  definition: StageDefinition<B, M, L>,
): Stage {
  const result = compileStage(definition);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

describe("frame", () => {
  it("returns the scene's targets untouched and lists pose items by index", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 1000] },
        cast: (m) => ({ dots: m.many(3), word: m.letters("HEY") }),
        scene: ({ time }) => ({
          dots: (i) => ({ x: i * 10 + time.progress }),
          word: (i, n) => ({ opacity: i / n }),
        }),
      }),
    );
    const out = frame(stage, { time: at(500) });
    expect(listPose(out.targets["dots"], 2, 3)).toEqual({ x: 20.5 });
    expect(listPose(out.targets["word"], 1, 3)).toEqual({ opacity: 1 / 3 });
    expect(listPose(undefined, 0, 3)).toBeUndefined();
    expect(check(stage, out.targets)).toEqual([]);
  });

  it("checks shapes in one place: arrays, non-poses, lists not given as functions, unknown names", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({ box: m.box(), dots: m.many(2), card: m.group({}) }),
        scene: () => ({}),
      }),
    );
    const errors = check(stage, { box: [], dots: [{}, {}], card: 3, ghost: {} });
    expect(errors.map(formatStageError)[1]).toBe(
      'scene: "dots" is a list: give it `(index, count) => pose`, got an array.',
    );
    expect(errors.map(({ kind }) => kind)).toEqual([
      "shape_mismatch",
      "shape_mismatch",
      "shape_mismatch",
      "unknown_target",
    ]);
    expect(check(stage, { dots: () => 7 }).map(formatStageError)).toEqual([
      'scene: "dots" answered no pose object for item 0.',
    ]);
  });

  it("shows members by their stretches, start included and end excluded, a group hiding its children, the last beat holding", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100], b: [200, 300], c: [300, 1000] },
        cast: (m) => ({
          always: m.box(),
          early: m.box().on("a"),
          gap: m.group({ child: m.box() }).on("b"),
          tail: m.box().on("c"),
        }),
        scene: () => ({}),
      }),
    );
    const shown = (ms: number) =>
      Object.entries(stage.visibleAt(ms))
        .filter(([, on]) => on)
        .map(([name]) => name);
    expect(shown(0)).toEqual(["always", "early"]);
    expect(shown(100)).toEqual(["always"]);
    expect(shown(150)).toEqual(["always"]);
    expect(shown(200)).toEqual(["always", "gap", "child"]);
    expect(shown(300)).toEqual(["always", "tail"]);
    expect(shown(5000)).toEqual(["always", "tail"]);
    expect(stage.visibleAt(150)).toBe(stage.visibleAt(160));
  });

  it("agrees with a direct reading of the stretches at every ms", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 120], b: [80, 400], c: [390, 600] },
        cast: (m) => ({
          one: m.box().on("a", "c"),
          two: m.group({ three: m.box().on("b") }).on(["a", "b"]),
        }),
        scene: () => ({}),
      }),
    );
    const within = (ranges: readonly (readonly [number, number])[], ms: number) =>
      ranges.some(([from, to]) => ms >= from && (ms < to || to >= 600));
    for (let ms = -5; ms <= 700; ms += 1) {
      const two = within([[0, 400]], ms);
      expect(stage.visibleAt(ms)).toEqual({
        one: within(
          [
            [0, 120],
            [390, 600],
          ],
          ms,
        ),
        two,
        three: two && within([[80, 400]], ms),
      });
    }
  });

  it("names the latest-started beat whose window holds a ms, as visibility reads it", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 600], b: [300, 400], c: [600, 800] },
        durationMs: 1000,
        cast: (m) => ({ shot: m.box().on("c") }),
        scene: () => ({}),
      }),
    );
    const named = (ms: number) => beatAt(stage.beats, stage.durationMs, ms);
    expect([100, 350, 400, 600, 799, 800, 900].map(named)).toEqual([
      "a",
      "b",
      "a",
      "c",
      "c",
      undefined,
      undefined,
    ]);
    expect(stage.visibleAt(800)).toEqual({ shot: false });
    expect(named(1000)).toBeUndefined();
    const held = compiled(
      defineStage({ beats: { a: [0, 500] }, cast: () => ({}), scene: () => ({}) }),
    );
    expect(beatAt(held.beats, held.durationMs, 500)).toBe("a");
    expect(beatAt(held.beats, held.durationMs, 9000)).toBe("a");
  });

  it("picks the layout from events and reads measured boxes before the piece's own rests", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 1000] },
        cast: (m) => ({ card: m.box() }),
        layouts: {
          names: ["row", "wide"],
          pick: (events) => (events.some(({ name }) => name === "wide") ? "wide" : "row"),
          rests: {
            row: { card: { x: 100, y: 100, width: 200, height: 100 } },
            wide: { card: { x: 300, y: 200, width: 400, height: 200 } },
          },
        },
        scene: ({ carry, rest }) => ({
          card: { ...carry("card", { ms: 200 }), opacity: rest.get("card").width },
        }),
      }),
    );
    const events = mergeEvents([{ name: "wide", at: 200 }]);
    const out = frame(stage, { time: at(300), events });
    expect(out.layout).toBe("wide");
    expect(out.targets["card"]).toEqual({
      x: -100,
      y: -50,
      scaleX: 0.75,
      scaleY: 0.75,
      opacity: 400,
    });
    const measured = frame(stage, {
      time: at(300),
      events,
      boxes: { row: NO_REST, wide: restReader({}) },
    });
    expect(measured.targets["card"]).toEqual({ opacity: 0 });
  });

  it("reads only the targets the scene gave, never a prototype's", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({ toString: m.box() }),
        scene: () => ({}),
      }),
    );
    expect(check(stage, {})).toEqual([]);
    expect(restReader({}).has("toString")).toBe(false);
    expect(restReader({}).get("toString")).toEqual(ZERO_BOX);
  });

  it("refuses a scene that returns no object", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: () => ({}),
        scene: () => Reflect.get({ three: 3 }, "three"),
      }),
    );
    expect(() => frame(stage, { time: at(0) })).toThrow(TypeError);
    expect(NO_REST.get("x")).toEqual(ZERO_BOX);
  });
});
