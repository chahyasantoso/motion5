import { INPUT_EVENTS, motion, scroll, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  NO_REST,
  beat,
  bind,
  box,
  boxInViewport,
  compileScene,
  formatStageError,
  frame,
  placementOf,
  poseOf,
  restReader,
  scene,
  scrollPoint,
  text,
  type Scene,
  type Stage,
} from "../src";
import { withPlacement } from "../src/render";

const at = (ms: number, length = 2000): Time => ({
  progress: length <= 0 ? 0 : ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
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
      scene(box("badge").moves(slideX(100).in(spanBeat), slideX(50).in(trigBeat))),
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
    expect(() => scene(box("card").moves(slideX(10).in(b1), slideX(20).in(b2)))).toThrow(TypeError);
    expect(() => scene(box("hero").moves(slideX(10).in(b1)))).toThrow(TypeError);
    expect(compiled(scene(heroA.moves(slideX(10).in(b1)))).members).toHaveLength(1);
  });
});

describe("single-scene element ownership", () => {
  it("refuses an element shared across two sub-scenes of one scene, naming both", () => {
    const sharedBox = box("sharedBox");
    const first = scene({ name: "firstScene" }, sharedBox);
    const second = scene({ name: "secondScene" }, sharedBox);

    expect(() => scene({ name: "page" }, first, second)).toThrow(
      /sharedBox.*firstScene.*secondScene/,
    );

    // Whitespace scene names fall back to sequential default scene labels.
    const blankTarget = box("blankTarget");
    const blank = scene({ name: "   " }, blankTarget);
    expect(() => scene(blank, blankTarget)).toThrow(/scene \d+/);
  });

  it("allows scenes to share beats, states, signals, and read-only edge references", () => {
    const sharedBeat = beat("scroll", { scroll: [scrollPoint(0), scrollPoint(400)] });
    const sharedMotion = bind({ y: (t, e) => scroll.y(t, e) * 0.5 });
    const s1 = compiled(
      scene({ name: "one" }, box("a").moves(slideX(10).in(sharedBeat), sharedMotion)),
    );
    const s2 = compiled(
      scene({ name: "two" }, box("b").moves(slideX(20).in(sharedBeat), sharedMotion)),
    );
    expect([s1.members.length, s2.members.length]).toEqual([1, 1]);

    const shared = box("shared");
    const edgeBeat = beat("edge", { scroll: [shared.top, shared.end] });
    const s3 = scene({ name: "three" }, box("c").moves(slideX(10).in(edgeBeat)));
    const s4 = scene({ name: "four" }, box("d").moves(slideX(20).in(edgeBeat)));
    const merged = compiled(scene({ name: "page" }, s3, s4));
    expect(merged.members.map((m) => m.name)).toEqual(["c", "shared", "d"]);

    // Binding `shared` in two sub-scenes of one scene still enforces single-scene ownership.
    const ownerA = scene({ name: "ownerA" }, shared);
    const ownerB = scene({ name: "ownerB" }, shared);
    expect(() => scene({ name: "ownerPage" }, ownerA, ownerB)).toThrow(/shared.*ownerA.*ownerB/);
  });

  it("re-exports boxInViewport and placementOf and resolves sticky pinStart and pinEnd edges", () => {
    const section = box("section");
    const stickyBox = withPlacement(
      { x: 640, y: 800, width: 1280, height: 400 },
      { kind: "sticky", minY: 600, maxY: 1600, pinY: 200 },
    );
    const flowBox = withPlacement({ x: 640, y: 800, width: 1280, height: 400 }, { kind: "flow" });
    const fixedBox = withPlacement({ x: 640, y: 200, width: 1280, height: 400 }, { kind: "fixed" });

    expect(placementOf(stickyBox)).toEqual({ kind: "sticky", minY: 600, maxY: 1600, pinY: 200 });
    expect(boxInViewport(stickyBox, 900)).toEqual({ x: 640, y: 200, width: 1280, height: 400 });

    const stickyRest = restReader({ section: stickyBox });
    expect(section.pinStart.at(stickyRest)).toBe(600);
    expect(section.pinEnd.at(stickyRest)).toBe(1600);
    expect(section.pinStart.plus(50).at(stickyRest)).toBe(650);
    expect(section.pinEnd.minus(100).at(stickyRest)).toBe(1500);
    expect(section.pinStart.reached.point).toBe(section.pinStart);

    for (const reader of [
      NO_REST,
      restReader({ section: flowBox }),
      restReader({ section: fixedBox }),
    ]) {
      expect(section.pinStart.at(reader)).toBe(section.top.at(reader));
      expect(section.pinEnd.at(reader)).toBe(section.end.at(reader));
    }

    const pinBeat = beat("pin", { scroll: [section.pinStart, section.pinEnd] });
    const stage = compiled(scene(box("card").moves(slideX(100).in(pinBeat))));
    expect(stage.members.map((m) => [m.name, m.expect])).toEqual([
      ["card", "settle"],
      ["section", "static"],
    ]);
    const mid = poseOf(
      frame(stage, {
        time: at(100, stage.durationMs),
        rest: stickyRest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 1100 }],
      }).targets["card"],
    );
    expect(mid?.x).toBeCloseTo(50, 9);
  });
});
