import { INPUT_EVENTS, motion, scroll, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  NO_REST,
  beat,
  bind,
  box,
  compileScene,
  formatStageError,
  frame,
  poseOf,
  restReader,
  sceneBuilder,
  scrollPoint,
  text,
  type SceneBuilder,
  type Stage,
} from "../src";

const at = (ms: number, length = 2000): Time => ({
  progress: length <= 0 ? 0 : ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const slideX = (distance: number) =>
  motion((time: Time): Pose2d => ({ x: distance * time.progress }));

describe("an element's edges", () => {
  it("resolve top, end, plus, minus and reached from its rest box", () => {
    const hero = box("hero");
    expect(hero.top.at(NO_REST)).toBe(0);
    expect(hero.end.at(NO_REST)).toBe(0);
    const rest = restReader({ hero: { x: 640, y: 360, width: 1280, height: 720 } });
    expect(hero.top.at(rest)).toBe(0);
    expect(hero.end.at(rest)).toBe(720);
    expect(hero.top.plus(100).at(rest)).toBe(100);
    expect(hero.end.minus(120).at(rest)).toBe(600);
    expect(hero.end.reached.point).toBe(hero.end);
    expect(hero.top.plus(50).reached.point.at(rest)).toBe(50);
  });

  it("add the element to the piece when a scroll or trigger beat reads them", () => {
    const hero = box("hero");
    const story = box("story");
    const spanBeat = beat("span", { scroll: [hero.top.plus(50), story.top.minus(50)] });
    const trigBeat = beat("trig", 400, { when: story.end.minus(100).reached, back: "stay" });

    const stage = compiled(
      sceneBuilder()
        .element(box("badge"))
        .motion(slideX(100).in(spanBeat), slideX(50).in(trigBeat)),
    );
    expect(stage.members.map((member) => [member.name, member.expect, member.node])).toEqual([
      ["badge", "settle", '[data-cast="badge"]'],
      ["hero", "static", '[data-cast="hero"]'],
      ["story", "static", '[data-cast="story"]'],
    ]);

    const rest = restReader({
      hero: { x: 640, y: 360, width: 1280, height: 720 },
      story: { x: 640, y: 1420, width: 1280, height: 1400 },
    });
    // story.top = 720; beat range is [50, 670] px. At scrollY = 360: (360 - 50) / 620 = 0.5 -> x = 50.
    const pose = poseOf(
      frame(stage, {
        time: at(100, stage.durationMs),
        rest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 360 }],
      }).targets["badge"],
    );
    expect(pose?.x).toBeCloseTo(50, 9);
  });

  it("refuse two elements of one name, whether given motions or read for their edges", () => {
    const heroA = box("hero");
    const heroB = box("hero");
    const b1 = beat("b1", { scroll: [heroA.top, heroA.end] });
    const b2 = beat("b2", { scroll: [heroB.top, heroB.end] });
    expect(() =>
      sceneBuilder().element(box("card")).motion(slideX(10).in(b1), slideX(20).in(b2)),
    ).toThrow(TypeError);
    expect(() => sceneBuilder().element(box("hero")).motion(slideX(10).in(b1))).toThrow(TypeError);
    expect(compiled(sceneBuilder().element(heroA).motion(slideX(10).in(b1))).members).toHaveLength(
      1,
    );
  });
});

describe("single-scene element ownership", () => {
  it("allows reusing an element inside one chain and branching from the same scene root", () => {
    const hero = box("hero");
    const enter = beat("enter", 400);
    const root = sceneBuilder({ name: "landing" }).element(hero);
    const branchA = root.motion(slideX(10).in(enter));
    const branchB = root.element(box("cta")).element(hero).motion(slideX(20).in(enter));

    expect(compiled(branchA).members).toHaveLength(1);
    expect(compiled(branchB).members).toHaveLength(2);
  });

  it("refuses an element shared across two different scenes, naming both", () => {
    const sharedBox = box("sharedBox");
    sceneBuilder({ name: "firstScene" }).element(sharedBox);

    expect(() => sceneBuilder({ name: "secondScene" }).element(sharedBox)).toThrow(
      /sharedBox.*firstScene.*secondScene/,
    );

    // Whitespace scene names fall back to sequential default scene labels.
    const blankTarget = box("blankTarget");
    sceneBuilder({ name: "   " }).element(blankTarget);
    expect(() => sceneBuilder().element(blankTarget)).toThrow(/scene \d+/);
  });

  it("allows scenes to share beats, states and signals, but not an element read for its edges", () => {
    const sharedBeat = beat("scroll", { scroll: [scrollPoint(0), scrollPoint(400)] });
    const sharedMotion = bind({ y: (t, e) => scroll.y(t, e) * 0.5 });
    const s1 = compiled(
      sceneBuilder({ name: "one" })
        .element(box("a"))
        .motion(slideX(10).in(sharedBeat), sharedMotion),
    );
    const s2 = compiled(
      sceneBuilder({ name: "two" })
        .element(box("b"))
        .motion(slideX(20).in(sharedBeat), sharedMotion),
    );
    expect([s1.members.length, s2.members.length]).toEqual([1, 1]);

    const shared = box("shared");
    const edgeBeat = beat("edge", { scroll: [shared.top, shared.end] });
    sceneBuilder({ name: "three" }).element(box("c")).motion(slideX(10).in(edgeBeat));
    expect(() =>
      sceneBuilder({ name: "four" }).element(box("d")).motion(slideX(10).in(edgeBeat)),
    ).toThrow(/shared.*three.*four/);
  });
});
