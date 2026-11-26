import { circlePath, motion, rectPath, type Pose2d } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  isScene,
  isStage,
  scene,
  shape,
  text,
  type Scene,
  type Stage,
  type StageError,
} from "../src";
import { compileDirectStage, type StageInput } from "../src/run/compile";

const SQUARE = rectPath({ x: 0, y: 0, width: 40, height: 40 });
const CIRCLE = circlePath({ cx: 20, cy: 20, r: 20 });

function compiledScene(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function compiledDirect(input: StageInput): Stage {
  const result = compileDirectStage(input);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function errorsOf(input: StageInput): readonly StageError[] {
  const result = compileDirectStage(input);
  return result.ok ? [] : result.errors;
}

const NO_INPUTS = { scroll: false, pointer: false, events: false } as const;

describe("compileScene and compileDirectStage", () => {
  it("compiles flat members with split on list members", () => {
    const enter = beat("enter", 500);
    const hold = beat("hold", 1100, { after: enter });
    const stage = compiledScene(
      scene(
        box("card").shows(enter),
        text("badge").shows(hold),
        text("word", { split: "letters" }),
        box("dust", { parts: true }),
      ),
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
  });

  it("tells a scene and a stage apart by kind, so a second copy of the package still works", () => {
    const piece = scene(box("card"));
    expect(isScene(piece)).toBe(true);
    const stage = compiledScene(piece);
    expect(isStage(stage)).toBe(true);
    expect(isStage({ ...stage })).toBe(true);
    expect(isScene(stage)).toBe(false);
  });

  it("keeps static, ambient and settle expectations per member", () => {
    const move = motion((): Pose2d => ({ x: 1 }));
    const stage = compiledScene(
      scene(
        { length: 100 },
        box("flake").moves(move.ambient()),
        box("still"),
        box("arrow").moves(move),
        box("snow", { parts: true }).moves(move.loop(50)),
      ),
    );
    expect(Object.fromEntries(stage.members.map(({ name, expect: e }) => [name, e]))).toEqual({
      flake: "ambient",
      still: "static",
      arrow: "settle",
      snow: "ambient",
    });
  });

  it("refuses every mistake at once, each with its own kind", () => {
    const errors = errorsOf({
      beats: { a: [0, 100], b: [200, 300] },
      members: [
        {
          name: "x.y",
          expect: "settle",
          watch: false,
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "dup",
          expect: "settle",
          watch: false,
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "missing", to: "missing" }],
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "late",
          expect: "settle",
          watch: false,
          inputs: NO_INPUTS,
          on: [{ kind: "beats", from: "b", to: "a" }],
          kind: "actor",
          content: { kind: "box" },
        },
        {
          name: "blob",
          expect: "settle",
          watch: false,
          inputs: NO_INPUTS,
          kind: "actor",
          content: {
            kind: "morph",
            shapes: [SQUARE, [...SQUARE, ...rectPath({ x: 90, y: 0, width: 5, height: 5 })]],
          },
        },
      ],
      scene: () => ({}),
    });
    expect(errors.map(({ kind }) => kind).sort()).toEqual([
      "morph_mismatch",
      "reserved_dot",
      "reversed_stretch",
      "unknown_beat",
    ]);
    for (const error of errors) expect(formatStageError(error)).not.toBe("");
  });

  it("refuses beats past durationMs or of no length", () => {
    expect(
      errorsOf({
        beats: { a: [0, 900] },
        durationMs: 500,
        members: [],
        scene: () => ({}),
      }),
    ).toHaveLength(1);
    const agree = errorsOf({
      beats: { a: [0, 500], empty: [500, 500] },
      members: [],
      scene: () => ({}),
    });
    expect(agree).toEqual([
      {
        kind: "invalid",
        field: "beats",
        reason: 'beat "empty" must be [from, to] ms with 0 <= from < to.',
      },
    ]);
  });

  it("matches morph outlines once, base first", () => {
    const stage = compiledDirect({
      beats: { a: [0, 100] },
      members: [
        {
          name: "blob",
          expect: "settle",
          watch: false,
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "morph", shapes: [SQUARE, CIRCLE] },
        },
      ],
      scene: () => ({}),
    });
    const blob = stage.members[0];
    if (blob?.kind !== "actor" || blob.content.kind !== "morph") throw new Error("no morph");
    expect(blob.content.shapes).toHaveLength(2);
    expect(blob.content.shapes[0]).toHaveLength(blob.content.shapes[1]?.length ?? -1);
    const fromScene = compiledScene(
      scene({ length: 100 }, shape("blob", { base: SQUARE, targets: [CIRCLE] })),
    );
    expect(fromScene.members[0]?.kind).toBe("actor");
  });

  it("gives equal signatures to stages that mount on the same elements, and different ones otherwise", () => {
    const make = (split: "letters" | "words", scale: number) =>
      compiledScene(
        scene(
          { length: 100 },
          box("card"),
          text("title", { split }).moves(motion((): Pose2d => ({ scale }))),
        ),
      ).signature;
    expect(make("letters", 1)).toBe(make("letters", 2));
    expect(make("letters", 1)).not.toBe(make("words", 1));
  });
});
