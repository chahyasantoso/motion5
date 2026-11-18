import { circlePath, linePath, rectPath } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  compileStage,
  defineStage,
  formatStageError,
  type CastBuilder,
  type StageError,
} from "../src";

const SQUARE = rectPath({ x: 0, y: 0, width: 20, height: 20 });
const OPEN_LINE = linePath({ x1: 80, y1: 0, x2: 100, y2: 0 });

describe("compileStage and StageError formatting", () => {
  it("compiles a valid stage with cues, style, design, limits, and 3d pose mode", () => {
    const def = defineStage({
      pose: "3d",
      frame: { width: 1920, height: 1080 },
      beats: { intro: [0, 400], main: [400, 1000] },
      cast: (m) => ({
        camera: m.box().ambient(),
        badge: m.text("Ready").static().watch(),
        pulse: m.stroke(circlePath({ cx: 10, cy: 10, r: 5 })),
      }),
      cues: [
        { name: "late", at: 600 },
        { name: "early", at: 200 },
      ],
      style: "snappy",
      design: { palette: "ink" },
      limits: { camera: { jump: 120, turn: 15, ratio: 0.2 } },
      scene: () => ({ camera: { z: 40, rotationY: 20 } }),
    });

    const compiled = compileStage(def);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    expect(compiled.stage.pose).toBe("3d");
    expect(compiled.stage.frame).toEqual({ width: 1920, height: 1080 });
    expect(compiled.stage.cues.map((cue) => cue.name)).toEqual(["early", "late"]);
    expect(compiled.stage.review.style).toBe("snappy");
    expect(compiled.stage.review.design).toEqual({ palette: "ink" });
    expect(compiled.stage.review.limits.camera).toEqual({ jump: 120, turn: 15, ratio: 0.2 });
    expect(compiled.stage.review.byName.get("badge")?.watch).toBe(true);
    expect(compiled.stage.review.byName.get("badge")?.expectation).toBe("static");
    expect(compiled.stage.review.byName.get("pulse")?.hasPath).toBe(true);
  });

  it("validates morph mismatches, empty layouts, invalid initial layout, and invalid definitions", () => {
    const badMorph = compileStage(
      defineStage({
        beats: { a: [0, 200] },
        cast: (m) => ({
          shape: m.morph([...SQUARE, ...OPEN_LINE], [SQUARE]),
        }),
        scene: () => ({}),
      }),
    );
    expect(badMorph.ok).toBe(false);
    if (!badMorph.ok) {
      expect(badMorph.errors.some((error) => error.kind === "morph_mismatch")).toBe(true);
    }

    const emptyLayouts = compileStage({
      beats: { a: [0, 200] },
      cast: (m: CastBuilder<"a">) => ({ a: m.box() }),
      layouts: { names: [] },
      scene: () => ({}),
    });
    expect(emptyLayouts.ok).toBe(false);
    if (!emptyLayouts.ok) {
      expect(emptyLayouts.errors.some((error) => error.kind === "empty_layouts")).toBe(true);
    }

    const missingRest = compileStage(
      defineStage({
        beats: { a: [0, 200] },
        cast: (m) => ({ a: m.box() }),
        layouts: {
          names: ["compact", "wide"],
          pick: () => "invalid" as "compact",
          rests: { compact: {} } as never,
        },
        scene: () => ({}),
      }),
    );
    expect(missingRest.ok).toBe(false);
    if (!missingRest.ok) {
      expect(
        missingRest.errors.filter((error) => error.kind === "invalid_initial_layout"),
      ).toHaveLength(2);
    }

    const badFields = compileStage({
      pose: "4d",
      frame: { width: -1, height: 10 },
      beats: {},
      cast: "nope",
      cues: [{ name: "", at: -5 }],
      style: 42,
      limits: { card: { jump: -1, nope: 2 } },
      skins: { dom: { kind: "url", css: "nope.css" } },
      scene: "not-a-fn",
    });
    expect(badFields.ok).toBe(false);
    if (!badFields.ok) {
      expect(badFields.errors.every((error) => error.kind === "invalid_definition")).toBe(true);
      expect(badFields.errors.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("formats every closed-union StageError variant cleanly", () => {
    const errors: readonly StageError[] = [
      { kind: "duplicate_member", name: "card" },
      { kind: "reserved_dot_in_name", name: "a.b" },
      { kind: "empty_on_stretches", member: "card" },
      { kind: "unknown_beat", member: "card", beat: "ghost" },
      { kind: "reversed_stretch", member: "card", from: "b", to: "a" },
      { kind: "morph_mismatch", member: "blob", reason: "piece count differs" },
      { kind: "stroke_loop", loop: ["a", "b"], behind: ["c"] },
      { kind: "invalid_initial_layout", message: "missing row rest" },
      { kind: "empty_layouts" },
      { kind: "shape_mismatch", member: "dots", reason: "expected 3 poses, got 2." },
      { kind: "invalid_definition", field: "beats", reason: "empty" },
    ];
    const messages = errors.map(formatStageError);
    expect(messages).toHaveLength(11);
    for (const message of messages) expect(message.length).toBeGreaterThan(5);
  });
});
