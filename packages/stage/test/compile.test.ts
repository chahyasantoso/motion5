import { circlePath, rectPath } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { formatStageError, isStage, type Stage, type StageError } from "../src";
import { compileStage } from "../src/run/compile";
import { defineStage, isStageDefinition, type StageDefinition } from "../src/author/stage";
import type { Members } from "../src/author/cast";

const SQUARE = rectPath({ x: 0, y: 0, width: 40, height: 40 });
const CIRCLE = circlePath({ cx: 20, cy: 20, r: 20 });

function compiled<B extends string, M extends Members<B>, L extends string>(
  definition: StageDefinition<B, M, L>,
): Stage {
  const result = compileStage(definition);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function errorsOf<B extends string, M extends Members<B>, L extends string>(
  definition: StageDefinition<B, M, L>,
): readonly StageError[] {
  const result = compileStage(definition);
  return result.ok ? [] : result.errors;
}

describe("defineStage options", () => {
  it("takes no design and no style", () => {
    const base = { beats: { enter: [0, 500] }, cast: () => ({}), scene: () => ({}) } as const;
    // @ts-expect-error design is not a stage option
    defineStage({ ...base, design: { card: {} } });
    // @ts-expect-error style is not a stage option
    defineStage({ ...base, style: "showreel" });
    const stage = compiled(defineStage(base));
    expect("design" in stage).toBe(false);
    expect("style" in stage).toBe(false);
  });
});

describe("compileStage", () => {
  it("compiles flat members with split on list members", () => {
    const stage = compiled(
      defineStage({
        beats: { enter: [0, 500], hold: [500, 1600] },
        cast: (m) => ({
          card: m.box(),
          badge: m.text(),
          word: m.letters(),
          dust: m.many(),
        }),
        scene: () => ({}),
      }),
    );
    expect(stage.durationMs).toBe(1600);
    expect(stage.members.map(({ name, kind }) => [name, kind])).toEqual([
      ["card", "actor"],
      ["badge", "actor"],
      ["word", "list"],
      ["dust", "list"],
    ]);
    const word = stage.members[2];
    expect(word?.kind === "list" ? word.split : undefined).toBe("letters");
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

  it("keeps static, ambient and settle expectations per member", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({
          flake: m.box().ambient(),
          still: m.box().static(),
          arrow: m.box(),
          snow: m.many().ambient(),
        }),
        scene: () => ({}),
      }),
    );
    expect(Object.fromEntries(stage.members.map(({ name, expect: e }) => [name, e]))).toEqual({
      flake: "ambient",
      still: "static",
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
          // @ts-expect-error: "missing" is not a beat, refused at compile time too
          dup: m.box().on("missing"),
          late: m.box().on(["b", "a"]),
          blob: m.morph(SQUARE, [[...SQUARE, ...rectPath({ x: 90, y: 0, width: 5, height: 5 })]]),
        }),
        scene: () => ({}),
      }),
    );
    expect(errors.map(({ kind }) => kind).sort()).toEqual([
      "morph_mismatch",
      "reserved_dot",
      "reversed_stretch",
      "unknown_beat",
    ]);
    for (const error of errors) expect(formatStageError(error)).not.toBe("");
  });

  it("refuses beats past durationMs or of no length, and a bad layout pick", () => {
    expect(
      errorsOf(
        defineStage({
          beats: { a: [0, 900] },
          durationMs: 500,
          cast: () => ({}),
          scene: () => ({}),
        }),
      ),
    ).toHaveLength(1);
    const agree = errorsOf(
      defineStage({
        beats: { a: [0, 500], empty: [500, 500] },
        cast: () => ({}),
        scene: () => ({}),
      }),
    );
    expect(agree).toEqual([
      {
        kind: "invalid",
        field: "beats",
        reason: 'beat "empty" must be [from, to] ms with 0 <= from < to.',
      },
    ]);
    const pick = errorsOf(
      defineStage({
        beats: { a: [0, 100] },
        cast: () => ({}),
        layouts: { names: ["one"], pick: () => Reflect.get({ two: "two" }, "two") },
        scene: () => ({}),
      }),
    );
    expect(pick.map(formatStageError).join()).toContain("layouts");
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
    const make = (split: "letters" | "words", scale: number) =>
      compiled(
        defineStage({
          beats: { a: [0, 100] },
          cast: (m) => ({
            card: m.box(),
            title: split === "letters" ? m.letters() : m.words(),
          }),
          scene: () => ({ title: () => ({ scale }) }),
        }),
      ).signature;
    expect(make("letters", 1)).toBe(make("letters", 2));
    expect(make("letters", 1)).not.toBe(make("words", 1));
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
      cast: (m) => ({ dots: m.many(), card: m.box(), title: m.text() }),
      // @ts-expect-error: a list takes a function of the index, not an array
      scene: () => ({ dots: [{}, {}, {}] }),
    });
    defineStage({
      beats: { enter: [0, 100] },
      cast: (m) => ({ dots: m.many(), card: m.box(), title: m.text() }),
      scene: () => ({ dots: (i) => ({ x: i }), title: { x: 1 }, card: {} }),
    });
    defineStage({
      beats: { enter: [0, 100] },
      cast: (m) => ({ card: m.box(), row: m.letters() }),
      scene: () => ({ row: (i) => ({ x: i }), card: { y: 1 } }),
    });
    defineStage({
      beats: { enter: [0, 100] },
      cast: (m) => ({ row: m.letters() }),
      // @ts-expect-error: a list takes a function of the index
      scene: () => ({ row: { x: 1 } }),
    });
    expect(true).toBe(true);
  });
});
