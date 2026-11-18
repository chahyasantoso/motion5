import { circlePath, rectPath } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  compileStage,
  defineStage,
  formatStageError,
  isStage,
  isStageDefinition,
  type Stage,
  type StageError,
} from "../src";

const SQUARE = rectPath({ x: 0, y: 0, width: 40, height: 40 });
const CIRCLE = circlePath({ cx: 20, cy: 20, r: 20 });

function compiled(definition: unknown): Stage {
  const result = compileStage(definition);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function errorsOf(definition: unknown): readonly StageError[] {
  const result = compileStage(definition);
  return result.ok ? [] : result.errors;
}

describe("compileStage", () => {
  it("compiles one flat member list, parents first, with list items as contents", () => {
    const stage = compiled(
      defineStage({
        beats: { enter: [0, 500], hold: [500, 1600] },
        cast: (m) => ({
          card: m.group({ badge: m.text("READY"), word: m.letters("HI") }),
          dust: m.many(3),
        }),
        scene: () => ({}),
      }),
    );
    expect(stage.durationMs).toBe(1600);
    expect(stage.members.map(({ name, kind, parent }) => [name, kind, parent])).toEqual([
      ["card", "group", -1],
      ["badge", "actor", 0],
      ["word", "list", 0],
      ["dust", "list", -1],
    ]);
    const word = stage.members[2];
    expect(word?.kind === "list" ? word.items : undefined).toEqual([
      { kind: "text", value: "H" },
      { kind: "text", value: "I" },
    ]);
    expect(stage.layouts.names).toEqual(["main"]);
  });

  it("tells a definition and a stage apart by kind, so a second copy of the package still works", () => {
    const definition = defineStage({ beats: { a: [0, 100] }, cast: () => ({}), scene: () => ({}) });
    expect(isStageDefinition(definition)).toBe(true);
    expect(isStageDefinition({ ...definition })).toBe(true);
    const stage = compiled(definition);
    expect(isStage(stage)).toBe(true);
    expect(isStage({ ...stage })).toBe(true);
    expect(isStageDefinition(stage)).toBe(false);
  });

  it("passes ambient down to children and items, and keeps static on the group alone", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({
          weather: m.group({ flake: m.box(), still: m.box().static() }).ambient(),
          sign: m.group({ arrow: m.box() }).static(),
          snow: m.many(2).ambient(),
        }),
        scene: () => ({}),
      }),
    );
    expect(Object.fromEntries(stage.members.map(({ name, expect: e }) => [name, e]))).toEqual({
      weather: "ambient",
      flake: "ambient",
      still: "static",
      sign: "static",
      arrow: "settle",
      snow: "ambient",
    });
  });

  it("refuses every mistake at once, each with its own kind", () => {
    const errors = errorsOf(
      defineStage({
        beats: { a: [0, 100], b: [200, 300] },
        cast: (m) => ({
          "x.y": m.box(),
          g: m.group({ dup: m.box() }),
          // @ts-expect-error: "missing" is not a beat, refused at compile time too
          dup: m.box().on("missing"),
          late: m.box().on(["b", "a"]),
          blob: m.morph(SQUARE, [[...SQUARE, ...rectPath({ x: 90, y: 0, width: 5, height: 5 })]]),
        }),
        scene: () => ({}),
      }),
    );
    expect(errors.map(({ kind }) => kind).sort()).toEqual([
      "duplicate_member",
      "morph_mismatch",
      "reserved_dot",
      "reversed_stretch",
      "unknown_beat",
    ]);
    for (const error of errors) expect(formatStageError(error)).not.toBe("");
  });

  it("refuses a readout smuggled into a list, a beat past durationMs and a bad layout pick", () => {
    const readout = errorsOf({
      beats: { a: [0, 100] },
      cast: (m: {
        many: (n: number) => object;
        readout: (f: () => string) => { content: unknown };
      }) => ({
        row: { ...m.many(1), items: [m.readout(() => "x").content] },
      }),
      scene: () => ({}),
    });
    expect(readout.map(formatStageError).join()).toContain("a readout inside a list");
    expect(
      errorsOf({ beats: { a: [0, 900] }, durationMs: 500, cast: () => ({}), scene: () => ({}) }),
    ).toHaveLength(1);
    const pick = errorsOf({
      beats: { a: [0, 100] },
      cast: () => ({}),
      layouts: { names: ["one"], pick: () => "two" },
      scene: () => ({}),
    });
    expect(pick.map(formatStageError).join()).toContain("layouts");
  });

  it("refuses modifiers on a list item, which only its list can carry", () => {
    const errors = compileStage(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({ row: m.many([1], () => m.box().on("a")) }),
        scene: () => ({}),
      }),
    );
    expect(errors.ok ? "" : errors.errors.map(formatStageError).join()).toContain(
      "an item takes no modifiers",
    );
  });

  it("matches morph outlines once, base first", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({ blob: m.morph(SQUARE, [CIRCLE]) }),
        scene: () => ({}),
      }),
    );
    const blob = stage.members[0];
    if (blob?.kind !== "actor" || blob.content.kind !== "morph") throw new Error("no morph");
    expect(blob.content.shapes).toHaveLength(2);
    expect(blob.content.shapes[0]).toHaveLength(blob.content.shapes[1]?.length ?? -1);
  });

  it("gives equal signatures to stages that mount on the same elements, and different ones otherwise", () => {
    const make = (word: string, scale: number) =>
      compiled(
        defineStage({
          beats: { a: [0, 100] },
          frame: { width: 100 * scale, height: 100 },
          cast: (m) => ({ card: m.group({ title: m.text(word) }) }),
          scene: () => ({ title: { scale } }),
        }),
      ).signature;
    expect(make("Hi", 1)).toBe(make("Hi", 2));
    expect(make("Hi", 1)).not.toBe(make("Bye", 1));
  });

  it("types beat names, list poses and unknown members", () => {
    defineStage({
      beats: { enter: [0, 100] },
      // @ts-expect-error: "exit" is not a beat
      cast: (m) => ({ a: m.box().on("exit") }),
      scene: () => ({}),
    });
    defineStage({
      beats: { enter: [0, 100] },
      cast: (m) => ({ dots: m.many(3), card: m.group({ title: m.text("x") }) }),
      // @ts-expect-error: a list takes a function of the index, not an array
      scene: () => ({ dots: [{}, {}, {}] }),
    });
    defineStage({
      beats: { enter: [0, 100] },
      cast: (m) => ({ dots: m.many(3), card: m.group({ title: m.text("x") }) }),
      scene: () => ({ dots: (i) => ({ x: i }), title: { x: 1 }, card: {} }),
    });
    defineStage({
      beats: { enter: [0, 100] },
      // @ts-expect-error: a readout cannot be a list item
      cast: (m) => ({ row: m.many([1], () => m.readout(() => "x")) }),
      scene: () => ({}),
    });
    expect(true).toBe(true);
  });
});
