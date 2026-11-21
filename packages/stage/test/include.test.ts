import { motion, timeAt, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  poseOf,
  sceneBuilder,
  type SceneBuilder,
  type Stage,
} from "../src";

const at = (ms: number, length = 2000): Time =>
  timeAt({ progress: 0, clock: { kind: "timed", elapsed: 0, length } }, ms);

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const slide = (to: number) => motion((time: Time): Pose2d => ({ x: to * time.progress }));

describe("sceneBuilder: .include", () => {
  it("merges another scene's elements, beats and motions onto one clock", () => {
    const enter = beat("enter", 400);
    const later = beat("later", 400, { after: enter });
    const hero = sceneBuilder().element(box("title")).motion(slide(100).in(enter));
    const page = sceneBuilder({ length: 1000 })
      .element(box("card"))
      .motion(slide(50).in(later))
      .include(hero);
    const stage = compiled(page);
    expect(stage.members.map((member) => member.name)).toEqual(["card", "title"]);
    expect(Object.keys(stage.beats).sort()).toEqual(["enter", "later"]);
    const out = frame(stage, { time: at(800, 1000) }).targets;
    expect(poseOf(out["title"])?.x).toBeCloseTo(100);
    expect(poseOf(out["card"])?.x).toBeCloseTo(50);
  });

  it("lets the including scene give motions to an included scene's element", () => {
    const enter = beat("enter", 400);
    const title = box("title");
    const hero = sceneBuilder().element(title);
    const page = sceneBuilder().include(hero).element(title).motion(slide(80).in(enter));
    expect(poseOf(frame(compiled(page), { time: at(400) }).targets["title"])?.x).toBeCloseTo(80);
  });

  it("refuses two scenes whose elements share a name, naming both", () => {
    const one = sceneBuilder({ name: "one" }).element(box("card"));
    const two = sceneBuilder({ name: "two" }).element(box("card"));
    expect(() => one.include(two)).toThrow(
      /"card" \(box\) of scene "two" takes the name of "card"/,
    );
  });

  it("refuses a scene that sets what only the mounted scene sets", () => {
    const hero = sceneBuilder({ name: "hero", length: 900 }).element(box("title"));
    expect(() => sceneBuilder().include(hero)).toThrow(/scene "hero" sets `length`/);
  });

  it("refuses a scene included twice", () => {
    const hero = sceneBuilder({ name: "hero" }).element(box("title"));
    sceneBuilder({ name: "page" }).include(hero);
    expect(() => sceneBuilder().include(hero)).toThrow(/already included in "page"/);
  });

  it("refuses a beat that means two windows across scenes", () => {
    const hero = sceneBuilder().element(box("a")).show(beat("enter", 400));
    const page = sceneBuilder().element(box("b")).show(beat("enter", 600));
    expect(() => page.include(hero)).toThrow(/beat "enter"/);
  });
});
