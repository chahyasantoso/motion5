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
  sceneBuilder,
  scrollPoint,
  stagger,
  type Drive,
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

function drivesAt(stage: Stage, y: number): ReadonlyMap<string, Drive["kind"]> {
  const drives = new Map<string, Drive>();
  const { targets } = frame(stage, {
    time: live(1000),
    events: [{ name: INPUT_EVENTS.scroll, at: 0, value: y }],
    drives,
  });
  // A list's parts run when its answer is asked for each part.
  for (const member of stage.members)
    if (member.kind === "list")
      for (let index = 0; index < 3; index += 1) listPose(targets[member.name], index, 3);
  return new Map([...drives].map(([name, drive]) => [name, drive.kind]));
}

describe("what a frame reports as driving each element", () => {
  it("scroll for a motion in a plain scroll beat, staggered parts included", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("plain"))
        .motion(slide.in(range))
        .element(box("parts", { parts: true }))
        .motion(stagger(slide, { spread: 0.3 }).in(range)),
    );
    for (const y of [0, 200, 400]) {
      expect(drivesAt(stage, y).get("plain")).toBe("scroll");
      expect(drivesAt(stage, y).get("parts")).toBe("scroll");
    }
  });

  it("a trigger beat as its own drive; a smooth scroll beat, a clock beat, a bind or a principle as more", () => {
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
    const only = drivesAt(stage, 200);
    expect(only.get("triggered")).toBe("trigger");
    for (const name of ["smoothed", "clocked", "bound", "principled"])
      expect(only.get(name), name).toBe("more");
  });

  it("more for a scroll-beat motion that reads events, carry or another element", () => {
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
    const only = drivesAt(stage, 200);
    expect(only.get("plain")).toBe("scroll");
    for (const name of ["events", "carry", "other"]) expect(only.get(name), name).toBe("more");
  });

  it("more for an element whose motions play in two kinds of beat, or two triggers", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("mixed"))
        .motion(slide.in(range), slide.in(beat("intro", 300)))
        .element(box("twoTriggers"))
        .motion(
          slide.in(beat("first", 300, { when: scrollPoint(100).reached, back: "stay" })),
          slide.in(beat("second", 300, { when: scrollPoint(200).reached, back: "stay" })),
        ),
    );
    expect(drivesAt(stage, 200).get("mixed")).toBe("more");
    expect(drivesAt(stage, 200).get("twoTriggers")).toBe("more");
  });
});
