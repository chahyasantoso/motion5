import { INPUT_EVENTS, motion, scroll, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  NO_REST,
  beat,
  bind,
  box,
  compileScene,
  el,
  formatStageError,
  frame,
  group,
  poseOf,
  restReader,
  sceneBuilder,
  scrollPoint,
  section,
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

describe("section", () => {
  it("validates name and NodeBinding, and resolves top, end, plus, minus, and reached", () => {
    expect(() => section("", el("#hero"))).toThrow(TypeError);
    expect(() => section("   ", el("#hero"))).toThrow(TypeError);
    expect(() => section("cards.0", el("#hero"))).toThrow(TypeError);
    // @ts-expect-error section requires a NodeBinding from el(selector)
    expect(() => section("hero", "#hero")).toThrow(TypeError);

    const hero = section("hero", el("#hero"));
    expect(hero.kind).toBe("section");
    expect(hero.name).toBe("hero");
    expect(hero.node).toEqual({ kind: "node", selector: "#hero" });
    expect(Object.isFrozen(hero)).toBe(true);

    expect(hero.top.at(NO_REST)).toBe(0);
    expect(hero.end.at(NO_REST)).toBe(0);

    const rest = restReader({
      hero: { x: 640, y: 360, width: 1280, height: 720 },
      story: { x: 640, y: 1800, width: 1280, height: 1440 },
    });
    expect(hero.top.at(rest)).toBe(0);
    expect(hero.end.at(rest)).toBe(720);
    expect(hero.top.plus(100).at(rest)).toBe(100);
    expect(hero.end.minus(120).at(rest)).toBe(600);
    expect(hero.end.reached.point).toBe(hero.end);
    expect(hero.top.plus(50).reached.point.at(rest)).toBe(50);
  });

  it("collects referenced sections onto Stage.sections from scroll and trigger beats", () => {
    const hero = section("hero", el("#hero"));
    const story = section("story", el("#story"));
    const spanBeat = beat("span", { scroll: [hero.top.plus(50), story.top.minus(50)] });
    const trigBeat = beat("trig", 400, { when: story.end.minus(100).reached, back: "stay" });

    const stage = compiled(
      sceneBuilder()
        .element(box("badge", { node: el("#badge") }))
        .motion(slideX(100).in(spanBeat), slideX(50).in(trigBeat)),
    );
    expect(stage.sections).toEqual([
      { name: "hero", node: "#hero" },
      { name: "story", node: "#story" },
    ]);

    const boxes = {
      main: restReader({
        hero: { x: 640, y: 360, width: 1280, height: 720 },
        story: { x: 640, y: 1420, width: 1280, height: 1400 },
      }),
    };
    // story.top = 720; beat range is [50, 670] px. At scrollY = 360: (360 - 50) / 620 = 0.5 -> x = 50.
    const pose = poseOf(
      frame(stage, {
        time: at(100, stage.durationMs),
        boxes,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 360 }],
      }).targets["badge"],
    );
    expect(pose?.x).toBeCloseTo(50, 9);
  });

  it("refuses conflicting sections or element/section name collisions with different selectors", () => {
    const heroA = section("hero", el("#hero"));
    const heroB = section("hero", el(".hero-alt"));
    const b1 = beat("b1", { scroll: [heroA.top, heroA.end] });
    const b2 = beat("b2", { scroll: [heroB.top, heroB.end] });

    expect(() =>
      sceneBuilder()
        .element(box("card", { node: el("#card") }))
        .motion(slideX(10).in(b1), slideX(20).in(b2)),
    ).toThrow(RangeError);

    expect(() =>
      sceneBuilder()
        .element(box("hero", { node: el("#card") }))
        .motion(slideX(10).in(b1)),
    ).toThrow(TypeError);

    expect(() =>
      sceneBuilder()
        .element(box("other", { node: el("#other") }))
        .motion(slideX(10).in(b1))
        .element(box("hero", { node: el("#card") })),
    ).toThrow(TypeError);

    // A scene using sections alone applies page-scene checks (requires node on elements, rejects skin).
    const unlinkedResult = compileScene(
      sceneBuilder().element(box("unlinked")).motion(slideX(10).in(b1)),
    );
    expect(unlinkedResult.ok).toBe(false);
    const skinnedResult = compileScene(
      sceneBuilder()
        .element(box("hero", { node: el("#hero") }))
        .motion(slideX(10).in(b1)),
      { skin: { css: "" } },
    );
    expect(skinnedResult.ok).toBe(false);

    expect(() =>
      compiled(
        sceneBuilder()
          .element(box("hero", { node: el("#hero") }))
          .motion(slideX(10).in(b1)),
      ),
    ).not.toThrow();
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

  it("refuses an element shared across two different scenes, directly or inside a group, naming both", () => {
    const sharedBox = box("sharedBox");
    sceneBuilder({ name: "firstScene" }).element(sharedBox);

    expect(() => sceneBuilder({ name: "secondScene" }).element(sharedBox)).toThrow(
      /sharedBox.*firstScene.*secondScene/,
    );

    const nested = text("nestedText", "Hi");
    sceneBuilder({ name: "alpha" }).element(group("wrap", [nested]));
    const freshSibling = box("freshSibling");
    expect(() =>
      sceneBuilder({ name: "beta" }).element(group("otherWrap", [freshSibling, nested])),
    ).toThrow(/nestedText.*alpha.*beta/);

    // Atomic rollback: failed registration must not claim freshSibling for beta.
    expect(() => sceneBuilder({ name: "gamma" }).element(freshSibling)).not.toThrow();

    // Whitespace scene names fall back to sequential default scene labels.
    const blankTarget = box("blankTarget");
    sceneBuilder({ name: "   " }).element(blankTarget);
    expect(() => sceneBuilder().element(blankTarget)).toThrow(/scene \d+/);
  });

  it("allows scenes to share beats, states, signals, and sections", () => {
    const sharedSection = section("shared", el("#shared"));
    const sharedBeat = beat("scroll", { scroll: [sharedSection.top, sharedSection.end] });
    const sharedMotion = bind({ y: (t, e) => scroll.y(t, e) * 0.5 });

    const s1 = compiled(
      sceneBuilder({ name: "one" })
        .element(box("a", { node: el("#a") }))
        .motion(slideX(10).in(sharedBeat), sharedMotion),
    );
    const s2 = compiled(
      sceneBuilder({ name: "two" })
        .element(box("b", { node: el("#b") }))
        .motion(slideX(20).in(sharedBeat), sharedMotion),
    );
    expect(s1.sections).toEqual([{ name: "shared", node: "#shared" }]);
    expect(s2.sections).toEqual([{ name: "shared", node: "#shared" }]);
  });
});
