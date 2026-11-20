import { INPUT_EVENTS, motion, pointer, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  bind,
  box,
  compileScene,
  formatStageError,
  frame,
  listPose,
  many,
  sceneBuilder,
  scrollPoint,
  stagger,
  type MotionContext,
  type SceneBuilder,
  type Stage,
} from "../src";

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const live = (ms: number): Time => ({ progress: 0, clock: { kind: "live", elapsed: ms } });
const slide = motion((t: Time): Pose2d => ({ x: 100 * t.progress }));
const range = beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] });

function scrollOnlyAt(stage: Stage, y: number): ReadonlyMap<string, boolean> {
  const scrollOnly = new Map<string, boolean>();
  const { targets } = frame(stage, {
    time: live(1000),
    events: [{ name: INPUT_EVENTS.scroll, at: 0, value: y }],
    scrollOnly,
  });
  // A list's parts run when its answer is asked for each part.
  for (const member of stage.members)
    if (member.kind === "list")
      for (let index = 0; index < member.items.length; index += 1)
        listPose(targets[member.name], index, member.items.length);
  return scrollOnly;
}

describe("what a frame reports as reading only the scroll position", () => {
  it("a motion in a plain scroll beat, staggered parts included", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("plain"))
        .motion(slide.in(range))
        .element(many("parts", 3))
        .motion(stagger(slide, { spread: 0.3 }).in(range)),
    );
    for (const y of [0, 200, 400]) {
      expect(scrollOnlyAt(stage, y).get("plain")).toBe(true);
      expect(scrollOnlyAt(stage, y).get("parts")).toBe(true);
    }
  });

  it("not a smooth scroll beat, a clock beat, a trigger beat, a bind or a principle", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("smoothed"))
        .motion(
          slide.in(beat("smooth", { scroll: [scrollPoint(0), scrollPoint(400)], smooth: true })),
        )
        .element(box("clocked"))
        .motion(slide.in(beat("intro", 300)))
        .element(box("triggered"))
        .motion(slide.in(beat("reveal", 300, { when: scrollPoint(100).reached, back: "stay" })))
        .element(box("bound"))
        .motion(bind({ x: (t, e) => pointer.x(t, e) }))
        .element(box("principled"))
        .motion(slide.in(range))
        .modify((signal) => signal),
    );
    const only = scrollOnlyAt(stage, 200);
    for (const name of ["smoothed", "clocked", "triggered", "bound", "principled"])
      expect(only.get(name), name).toBe(false);
  });

  it("not a scroll-beat motion that reads events, carry or another element", () => {
    const readsEvents = (t: Time, context?: MotionContext): Pose2d => ({
      x: t.progress + (context?.events.length ?? 0),
    });
    const readsCarry = (t: Time, context?: MotionContext): Pose2d => {
      void context?.carry;
      return { x: t.progress };
    };
    const readsOther = (t: Time, context?: MotionContext): Pose2d => ({
      x: t.progress + (context?.read("plain").x ?? 0),
    });
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("plain"))
        .motion(slide.in(range))
        .element(box("events"))
        .motion(motion(readsEvents).in(range))
        .element(box("carry"))
        .motion(motion(readsCarry).in(range))
        .element(box("other"))
        .motion(motion(readsOther).in(range)),
    );
    const only = scrollOnlyAt(stage, 200);
    expect(only.get("plain")).toBe(true);
    for (const name of ["events", "carry", "other"]) expect(only.get(name), name).toBe(false);
  });

  it("one motion outside a scroll beat is enough to rule an element out", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("mixed"))
        .motion(slide.in(range), slide.in(beat("intro", 300))),
    );
    expect(scrollOnlyAt(stage, 200).get("mixed")).toBe(false);
  });
});
