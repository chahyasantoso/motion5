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
  scene,
  scrollPoint,
  stagger,
  type Drive,
  type MotionContext,
  type Scene,
  type Stage,
} from "../src";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
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
      scene(
        { length: 1000 },
        box("plain").moves(slide.in(range)),
        box("parts", { parts: true }).moves(stagger(slide, { spread: 0.3 }).in(range)),
      ),
    );
    for (const y of [0, 200, 400]) {
      expect(drivesAt(stage, y).get("plain")).toBe("scroll");
      expect(drivesAt(stage, y).get("parts")).toBe("scroll");
    }
  });

  it("a trigger beat as its own drive; a smooth scroll beat, a clock beat, a bind or a principle as more", () => {
    const stage = compiled(
      scene(
        { length: 1000 },
        box("smoothed").moves(
          slide.in(beat("smooth", { scroll: [scrollPoint(0), scrollPoint(400)], smooth: true })),
        ),
        box("clocked").moves(slide.in(beat("intro", 300))),
        box("triggered").moves(
          slide.in(beat("reveal", 300, { when: scrollPoint(100).reached, back: "stay" })),
        ),
        box("bound").moves(bind({ x: (t, e) => pointer.x(t, e) })),
        box("principled")
          .moves(slide.in(range))
          .modifies((signal) => signal),
      ),
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
      scene(
        { length: 1000 },
        box("plain").moves(slide.in(range)),
        box("events").moves(motion(readsEvents).in(range)),
        box("carry").moves(motion(readsCarry).in(range)),
        box("other").moves(motion(readsOther).in(range)),
      ),
    );
    const only = drivesAt(stage, 200);
    expect(only.get("plain")).toBe("scroll");
    for (const name of ["events", "carry", "other"]) expect(only.get(name), name).toBe("more");
  });

  it("more for an element whose motions play in two kinds of beat, or two triggers", () => {
    const stage = compiled(
      scene(
        { length: 1000 },
        box("mixed").moves(slide.in(range), slide.in(beat("intro", 300))),
        box("twoTriggers").moves(
          slide.in(beat("first", 300, { when: scrollPoint(100).reached, back: "stay" })),
          slide.in(beat("second", 300, { when: scrollPoint(200).reached, back: "stay" })),
        ),
      ),
    );
    expect(drivesAt(stage, 200).get("mixed")).toBe("more");
    expect(drivesAt(stage, 200).get("twoTriggers")).toBe("more");
  });
});
