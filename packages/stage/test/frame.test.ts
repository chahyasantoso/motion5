import { timeAt, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  NO_REST,
  ZERO_BOX,
  beatAt,
  check,
  formatStageError,
  frame,
  listPose,
  restReader,
  type RestAt,
  type Stage,
} from "../src";
import { compileDirectStage, type StageInput } from "../src/run/compile";

const at = (ms: number, length = 1000): Time =>
  timeAt({ progress: 0, clock: { kind: "timed", elapsed: 0, length } }, ms);

const NO_INPUTS = { scroll: false, pointer: false, events: false } as const;

function compiled(input: StageInput): Stage {
  const result = compileDirectStage(input);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

describe("frame", () => {
  it("returns the scene's targets untouched and lists pose items by index", () => {
    const stage = compiled({
      beats: { a: [0, 1000] },
      members: [
        { name: "dots", expect: "settle", inputs: NO_INPUTS, kind: "list" },
        {
          name: "word",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "list",
          split: "letters",
        },
      ],
      scene: ({ time }) => ({
        dots: (i: number) => ({ x: i * 10 + time.progress }),
        word: (i: number, n: number) => ({ opacity: i / n }),
      }),
    });
    const out = frame(stage, { time: at(500) });
    expect(listPose(out.targets["dots"], 2, 3)).toEqual({ x: 20.5 });
    expect(listPose(out.targets["word"], 1, 3)).toEqual({ opacity: 1 / 3 });
    expect(listPose(undefined, 0, 3)).toBeUndefined();
    expect(check(stage, out.targets, { dots: 3, word: 3 })).toEqual([]);
  });

  it("checks shapes in one place: arrays, non-poses, lists not given as functions, unknown names", () => {
    const stage = compiled({
      beats: { a: [0, 100] },
      members: [
        {
          name: "box",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
        { name: "dots", expect: "settle", inputs: NO_INPUTS, kind: "list" },
        {
          name: "card",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: () => ({}),
    });
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

  it("shows members by their stretches, start included and end excluded, the last beat holding", () => {
    const stage = compiled({
      beats: { a: [0, 100], b: [200, 300], c: [300, 1000] },
      members: [
        {
          name: "always",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "early",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "a", to: "a" }],
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "gap",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "b", to: "b" }],
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "tail",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "c", to: "c" }],
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: () => ({}),
    });
    const shown = (ms: number) =>
      Object.entries(stage.visibleAt(ms))
        .filter(([, on]) => on)
        .map(([name]) => name);
    expect(shown(0)).toEqual(["always", "early"]);
    expect(shown(100)).toEqual(["always"]);
    expect(shown(150)).toEqual(["always"]);
    expect(shown(200)).toEqual(["always", "gap"]);
    expect(shown(300)).toEqual(["always", "tail"]);
    expect(shown(5000)).toEqual(["always", "tail"]);
    expect(stage.visibleAt(150)).toBe(stage.visibleAt(160));
  });

  it("agrees with a direct reading of the stretches at every ms", () => {
    const stage = compiled({
      beats: { a: [0, 120], b: [80, 400], c: [390, 600] },
      members: [
        {
          name: "one",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [
            { kind: "beats", from: "a", to: "a" },
            { kind: "beats", from: "c", to: "c" },
          ],
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "two",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "a", to: "b" }],
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "three",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "b", to: "b" }],
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: () => ({}),
    });
    const within = (ranges: readonly (readonly [number, number])[], ms: number) =>
      ranges.some(([from, to]) => ms >= from && (ms < to || to >= 600));
    for (let ms = -5; ms <= 700; ms += 1) {
      expect(stage.visibleAt(ms)).toEqual({
        one: within(
          [
            [0, 120],
            [390, 600],
          ],
          ms,
        ),
        two: within([[0, 400]], ms),
        three: within([[80, 400]], ms),
      });
    }
  });

  it("names the latest-started beat whose window holds a ms, as visibility reads it", () => {
    const stage = compiled({
      beats: { a: [0, 600], b: [300, 400], c: [600, 800] },
      durationMs: 1000,
      members: [
        {
          name: "shot",
          expect: "settle",
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "c", to: "c" }],
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: () => ({}),
    });
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
    const held = compiled({ beats: { a: [0, 500] }, members: [], scene: () => ({}) });
    expect(beatAt(held.beats, held.durationMs, 500)).toBe("a");
    expect(beatAt(held.beats, held.durationMs, 9000)).toBe("a");
  });

  it("reads measured rest boxes and carries a member across re-measures", () => {
    const stage = compiled({
      beats: { a: [0, 1000] },
      members: [
        {
          name: "card",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: ({ carry, rest }) => ({
        card: { ...carry("card", { ms: 200 }), opacity: rest.get("card").width },
      }),
    });
    const row = restReader({ card: { x: 100, y: 100, width: 200, height: 100 } });
    const wide = restReader({ card: { x: 300, y: 200, width: 400, height: 200 } });
    const measures: readonly RestAt[] = [
      { at: 0, rest: row },
      { at: 200, rest: wide },
    ];
    const out = frame(stage, { time: at(300), rest: wide, measures });
    expect(out.targets["card"]).toEqual({
      x: -100,
      y: -50,
      scaleX: 0.75,
      scaleY: 0.75,
      opacity: 400,
    });
    const unmeasured = frame(stage, { time: at(300) });
    expect(unmeasured.targets["card"]).toEqual({ opacity: 0 });
  });

  it("reads only the targets the scene gave, never a prototype's", () => {
    const stage = compiled({
      beats: { a: [0, 100] },
      members: [
        {
          name: "toString",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: () => ({}),
    });
    expect(check(stage, {})).toEqual([]);
    expect(restReader({}).has("toString")).toBe(false);
    expect(restReader({}).get("toString")).toEqual(ZERO_BOX);
  });

  it("refuses a scene that returns no object", () => {
    const stage = compiled({
      beats: { a: [0, 100] },
      members: [],
      scene: () => Reflect.get({ three: 3 }, "three"),
    });
    expect(() => frame(stage, { time: at(0) })).toThrow(TypeError);
    expect(NO_REST.get("x")).toEqual(ZERO_BOX);
  });
});
