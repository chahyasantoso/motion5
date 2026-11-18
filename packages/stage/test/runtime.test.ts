import { describe, expect, it } from "vitest";
import {
  compileStage,
  defineStage,
  evaluateFrame,
  isStageDefinition,
  validateSceneOutput,
  type PoseFor,
} from "../src";

describe("runtime defineStage, evaluateFrame, and shape contracts", () => {
  it("marks genuine StageDefinitions with isStageDefinition and refuses forged objects", () => {
    const def = defineStage({
      beats: { intro: [0, 200] },
      cast: (m) => ({ card: m.box() }),
      scene: () => ({ card: { x: 1 } }),
    });
    expect(isStageDefinition(def)).toBe(true);
    expect(Object.isFrozen(def)).toBe(true);
    expect(isStageDefinition({ kind: "stage-definition" })).toBe(false);
    expect(isStageDefinition(null)).toBe(false);
  });

  it("evaluates visibility inheritance, readouts, extraTargets, and readout errors", () => {
    const def = defineStage({
      beats: { a: [0, 200], b: [200, 500] },
      durationMs: 600,
      cast: (m) => ({
        panel: m
          .group({
            title: m.text("Hi").on("a"),
            items: m.many(2).on(["a", "b"]),
          })
          .on("a"),
        counter: m.readout((time) => {
          if (time.progress > 0.8) throw new Error("boom");
          return `${Math.round(time.progress * 10)}`;
        }),
        steady: m.box().on("b"),
      }),
      scene: ({ time }) => ({
        title: { x: time.progress * 10 },
        ghost: { x: 99 },
      }),
    });

    const compiled = compileStage(def);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const at100 = evaluateFrame(compiled.stage, {
      time: { progress: 0.2, clock: { kind: "timed", elapsed: 100, length: 600 } },
    });
    expect(at100.ok).toBe(true);
    if (!at100.ok) return;
    expect(at100.visibility.panel).toBe(true);
    expect(at100.visibility.title).toBe(true);
    expect(at100.visibility.items).toBe(true);
    expect(at100.visibility["items.0"]).toBe(true);
    expect(at100.visibility.steady).toBe(false);
    expect(at100.readouts.counter).toBe("2");
    expect(at100.readoutErrors).toEqual([]);
    expect(at100.extraTargets).toEqual(["ghost"]);

    const at300 = evaluateFrame(compiled.stage, {
      time: { progress: 0.9, clock: { kind: "timed", elapsed: 300, length: 600 } },
    });
    expect(at300.ok).toBe(true);
    if (!at300.ok) return;
    expect(at300.visibility.panel).toBe(false);
    expect(at300.visibility.items).toBe(false);
    expect(at300.visibility["items.0"]).toBe(false);
    expect(at300.visibility.steady).toBe(true);
    expect(at300.readoutErrors).toHaveLength(1);
    expect(at300.readoutErrors[0]?.member).toBe("counter");
  });

  it("enforces shape_mismatch on actor arrays, list non-arrays, wrong list lengths, and nested list shapes", () => {
    const def = defineStage({
      beats: { whole: [0, 500] },
      cast: (m) => ({
        card: m.box(),
        holder: m.group({
          dots: m.many(2),
        }),
      }),
      scene: () => ({}),
    });
    const compiled = compileStage(def);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const badRoot = validateSceneOutput(compiled.stage.members, null);
    expect(badRoot.ok).toBe(false);

    const badShapes = validateSceneOutput(compiled.stage.members, {
      card: [{ x: 1 }],
      holder: [{ x: 2 }],
      dots: [{ x: 3 }],
    });
    expect(badShapes.ok).toBe(false);
    if (!badShapes.ok) {
      expect(badShapes.errors.map((error) => error.member)).toEqual(["card", "holder", "dots"]);
    }

    const badItem = validateSceneOutput(compiled.stage.members, {
      dots: [{ x: 1 }, "not-a-pose"],
    });
    expect(badItem.ok).toBe(false);
    if (!badItem.ok) {
      expect(badItem.errors[0]?.member).toBe("dots.1");
    }
  });

  it("rejects invalid stage shapes at compile time via TypeScript type inference", () => {
    defineStage({
      beats: { intro: [0, 100], main: [100, 300] },
      cast: (m) => ({
        // @ts-expect-error readouts are disallowed inside lists
        badList: m.many([1], () => m.readout(() => "1")),
        // @ts-expect-error unknown beat name is rejected in .on()
        badBeat: m.box().on("missing"),
      }),
      scene: () => ({}),
    });

    defineStage({
      beats: { intro: [0, 100], main: [100, 300] },
      cast: (m) => ({
        bg: m.box().static(),
        card: m.box(),
        panel: m.group({ inside: m.box() }),
        dots: m.many(2),
      }),
      scene: () => ({
        // @ts-expect-error static members cannot receive a scene pose
        bg: { x: 1 },
        // @ts-expect-error actor cannot receive an array of poses
        card: [{ x: 1 }],
        // @ts-expect-error group cannot receive an array of poses
        panel: [{ x: 1 }],
        // @ts-expect-error list cannot receive a single pose object
        dots: { x: 1 },
      }),
    });

    defineStage({
      pose: "2d",
      beats: { whole: [0, 100] },
      cast: (m) => ({ a: m.box() }),
      scene: () => ({
        a: {
          // @ts-expect-error 3D-only field `z` is rejected on a 2d stage
          z: 5,
        },
      }),
    });

    defineStage({
      pose: "3d",
      beats: { whole: [0, 100] },
      cast: (m) => ({ cube: m.box() }),
      scene: () => ({
        cube: {
          // @ts-expect-error 2D-only field `skewX` is rejected on a 3d stage
          skewX: 10,
        },
      }),
    });

    const pose3d: PoseFor<"3d"> = {
      z: 10,
      rotationY: 45,
      // @ts-expect-error PoseFor<"3d"> rejects 2D-only `skewX` even alongside 3D fields
      skewX: 10,
    };

    expect(Boolean(pose3d)).toBe(true);
  });
});
