import {
  circlePath,
  mergeEvents,
  motion,
  span,
  timeAt,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  bind,
  box,
  carry,
  compileStage,
  formatStageError,
  frame,
  group,
  isStageDefinition,
  listPose,
  many,
  poseOf,
  sceneBuilder,
  shape,
  stayWith,
  text,
  type Stage,
  type StageDefinition,
} from "../src";

const at = (ms: number, length = 2000): Time =>
  timeAt({ progress: 0, clock: { kind: "timed", elapsed: 0, length } }, ms);

function compiled(definition: StageDefinition): Stage {
  const result = compileStage(definition);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function poseAt(definition: StageDefinition, name: string, ms: number): Pose2d | undefined {
  return poseOf(frame(compiled(definition), { time: at(ms) }).targets[name]);
}

const slideX = (distance: number) =>
  motion((time: Time): Pose2d => ({ x: distance * time.progress }));
const grow = (to: number) =>
  motion((time: Time): Pose2d => ({ scale: 1 + (to - 1) * time.progress }));

const enter = beat("enter", 400);
const hold = beat("hold", 600, { after: enter, gap: 100 });

describe("beat", () => {
  it("is a named span, at 0 by default, after another with a gap", () => {
    expect([enter.name, enter.from, enter.to]).toEqual(["enter", 0, 400]);
    expect([hold.from, hold.to]).toEqual([500, 1100]);
    expect(beat("late", 100, { at: 900 }).from).toBe(900);
    expect(enter.of(at(200)).progress).toBe(0.5);
  });

  it("refuses a length that is not above 0", () => {
    expect(() => beat("none", 0)).toThrow(RangeError);
    expect(() => beat("bad", Number.NaN)).toThrow(RangeError);
  });
});

describe("elements", () => {
  it("hold a name and a kind", () => {
    expect(box("a").kind).toBe("box");
    expect(shape("b", circlePath({ cx: 0, cy: 0, r: 5 })).kind).toBe("shape");
    expect(text("c", "hi").kind).toBe("text");
    expect(many("d", 3).kind).toBe("many");
    expect(group("e", [box("f")]).kind).toBe("group");
    expect(box("a").name).toBe("a");
  });

  it("refuse split on text a function writes", () => {
    expect(() => text("t", () => "x", { split: "letters" })).toThrow(TypeError);
  });
});

describe("sceneBuilder: what a chain compiles to", () => {
  const dot = shape("dot", circlePath({ cx: 0, cy: 0, r: 5 }));
  const card = box("card", { pivot: { x: 4, y: 6 }, watch: true });
  const word = text("word", "HEY", { split: "letters" });
  const chain = sceneBuilder({ frame: { width: 800, height: 400 } })
    .element(card)
    .motion(slideX(100).in(enter))
    .show(enter, hold)
    .limits({ jump: 50 })
    .element(dot)
    .element(word)
    .motion(grow(2).loop(500));

  it("is a stage definition every tool reads", () => {
    expect(isStageDefinition(chain)).toBe(true);
    expect(chain.kind).toBe("stage-definition");
    expect(compileStage(chain).ok).toBe(true);
  });

  it("casts every element in the order of its first element call, with its meta", () => {
    const stage = compiled(chain);
    expect(stage.members.map((member) => [member.name, member.kind, member.expect])).toEqual([
      ["card", "actor", "settle"],
      ["dot", "actor", "static"],
      ["word", "list", "ambient"],
    ]);
    const cardMember = stage.members[0];
    expect(cardMember?.watch).toBe(true);
    expect(cardMember?.pivot).toEqual({ x: 4, y: 6 });
    expect(cardMember?.on).toEqual([
      [0, 400],
      [500, Number.POSITIVE_INFINITY],
    ]);
    expect(stage.frame).toEqual({ width: 800, height: 400 });
  });

  it("gathers the beats used by in and show, the length from the latest end, and the limits", () => {
    const stage = compiled(chain);
    expect(Object.keys(stage.beats)).toEqual(["enter", "hold"]);
    expect([stage.beats["hold"]?.from, stage.beats["hold"]?.to]).toEqual([500, 1100]);
    expect(stage.durationMs).toBe(1100);
    expect(stage.limits).toEqual({ card: { jump: 50 } });
  });

  it("takes the length from the options when given", () => {
    expect(compiled(sceneBuilder({ length: 3000 }).element(card).show(enter)).durationMs).toBe(
      3000,
    );
  });

  it("nests group children and keeps them flat in the scene", () => {
    const left = box("left");
    const rig = group("rig", [left, box("right")]);
    const stage = compiled(
      sceneBuilder()
        .element(rig)
        .motion(slideX(10).in(enter))
        .element(left)
        .motion(grow(3).in(enter)),
    );
    expect(stage.members.map((member) => [member.name, member.parent])).toEqual([
      ["rig", -1],
      ["left", 0],
      ["right", 0],
    ]);
    const out = frame(stage, { time: at(400) }).targets;
    expect(poseOf(out["rig"])?.x).toBe(10);
    expect(poseOf(out["left"])?.scale).toBe(3);
    expect(out["right"]).toBeUndefined();
  });

  it("passes skins, cues and layouts from the options", () => {
    const cues: Events = [{ name: "tap", at: 100, target: "card" }];
    const layouts = { names: ["one", "two"] as [string, string], pick: () => "two" };
    const stage = compiled(
      sceneBuilder({ skins: { dom: { css: "a{}" } }, cues, layouts })
        .element(card)
        .show(enter),
    );
    expect(stage.skins.dom).toEqual({ kind: "inline", css: "a{}" });
    expect(stage.layouts.names).toEqual(["one", "two"]);
    expect(stage.cues).toEqual(mergeEvents(cues));
  });
});

describe("sceneBuilder: inference", () => {
  it("makes an element with no motion static, a looping one ambient and the rest settle", () => {
    const a = box("a");
    const b = box("b");
    const c = box("c");
    const d = box("d");
    const stage = compiled(
      sceneBuilder()
        .element(a)
        .show(enter)
        .element(b)
        .motion(slideX(1).in(enter))
        .element(c)
        .motion(slideX(1).in(enter), grow(2).loop(900))
        .element(d)
        .motion((time) => ({ x: time.progress })),
    );
    expect(stage.members.map((member) => member.expect)).toEqual([
      "static",
      "settle",
      "ambient",
      "settle",
    ]);
  });
});

describe("sceneBuilder: layering", () => {
  const a = box("a");

  it("adds x and multiplies scale across layer motions", () => {
    const chain = sceneBuilder()
      .element(a)
      .motion(slideX(100).in(enter), slideX(40).in(enter), grow(2).in(enter), grow(3).in(enter));
    expect(poseAt(chain, "a", 0)).toEqual({ x: 0, scale: 1 });
    expect(poseAt(chain, "a", 400)).toEqual({ x: 140, scale: 6 });
    expect(poseAt(chain, "a", 200)).toEqual({ x: 70, scale: 1.5 * 2 });
  });

  it("holds an animation's start before its beat and its end after it", () => {
    const chain = sceneBuilder().element(a).motion(slideX(100).in(hold)).show(enter);
    expect(poseAt(chain, "a", 100)?.x).toBe(0);
    expect(poseAt(chain, "a", 1500)?.x).toBe(100);
  });

  it("lets a take motion replace only its fields, only from the start of its span", () => {
    const chain = sceneBuilder()
      .element(a)
      .motion(
        slideX(100).in(enter),
        grow(2).in(enter),
        motion((): Pose2d => ({ x: -5 }))
          .in(hold)
          .take(),
      );
    expect(poseAt(chain, "a", 400)).toEqual({ x: 100, scale: 2 });
    expect(poseAt(chain, "a", 499)).toEqual({ x: 100, scale: 2 });
    expect(poseAt(chain, "a", 500)).toEqual({ x: -5, scale: 2 });
    expect(poseAt(chain, "a", 1500)).toEqual({ x: -5, scale: 2 });
  });

  it("wraps everything above a modify and not what follows", () => {
    const chain = sceneBuilder()
      .element(a)
      .motion(slideX(100).in(enter))
      .modify((signal) => (time, events) => {
        const pose = signal(time, events);
        return { ...pose, x: (pose.x ?? 0) * 2 };
      })
      .motion(slideX(10).in(enter));
    expect(poseAt(chain, "a", 400)?.x).toBe(210);
  });
});

describe("sceneBuilder: lists", () => {
  it("gives a list element's poses per index and count", () => {
    const dots = many("dots", 3);
    const word = text("word", "ABC", { split: "letters" });
    const chain = sceneBuilder({ length: 2000 })
      .element(dots)
      .motion((time, context) => ({ x: (context.index ?? 0) * 10 + (context.count ?? 0) }))
      .element(word)
      .motion((time, context) => ({ y: (context.index ?? 0) + time.progress }));
    const stage = compiled(chain);
    const out = frame(stage, { time: at(1000) }).targets;
    expect([0, 1, 2].map((index) => listPose(out["dots"], index, 3)?.x)).toEqual([3, 13, 23]);
    expect([0, 1, 2].map((index) => listPose(out["word"], index, 3)?.y)).toEqual([0.5, 1.5, 2.5]);
  });

  it("takes items from a list of data", () => {
    const rows = many("rows", ["a", "b"], (item) => text("ignored", item));
    const stage = compiled(sceneBuilder().element(rows).motion(slideX(1).in(enter)));
    expect(stage.members[0]?.kind).toBe("list");
  });
});

describe("sceneBuilder: reading another element", () => {
  const hand = box("hand");
  const ball = box("ball");

  it("stayWith adds the travel of the read element since the start of its own span", () => {
    const chain = sceneBuilder()
      .element(hand)
      .motion(slideX(100).in(span(0, 1000)))
      .element(ball)
      .motion(grow(1).in(enter), stayWith(hand).in(span(500, 1000)));
    expect(poseAt(chain, "ball", 400)?.x).toBe(0);
    expect(poseAt(chain, "ball", 500)?.x).toBe(0);
    expect(poseAt(chain, "ball", 750)?.x).toBe(25);
    expect(poseAt(chain, "ball", 1000)?.x).toBe(50);
    expect(poseAt(chain, "hand", 1000)?.x).toBe(100);
  });

  it("lets a motion read another element's pose through the context", () => {
    const chain = sceneBuilder({ length: 2000 })
      .element(hand)
      .motion(slideX(100).in(span(0, 1000)))
      .element(ball)
      .motion((time, context) => ({ y: (context.read(hand).x ?? 0) + 1 }));
    expect(poseAt(chain, "ball", 500)?.y).toBe(51);
  });

  it("reads a pose a modify changed", () => {
    const chain = sceneBuilder({ length: 2000 })
      .element(hand)
      .motion(slideX(100).in(span(0, 1000)))
      .modify((signal) => (time, events) => ({ x: (signal(time, events).x ?? 0) + 7 }))
      .element(ball)
      .motion(stayWith(hand).in(span(0, 1000)));
    expect(poseAt(chain, "ball", 1000)?.x).toBe(100);
  });

  it("binds fields to signals at scene time", () => {
    const chain = sceneBuilder({ length: 2000 })
      .element(ball)
      .motion(bind({ y: (time) => time.progress * 100, rotation: () => 9 }));
    expect(poseAt(chain, "ball", 1000)).toEqual({ y: 50, rotation: 9 });
  });

  it("carries the element through the scene's carry", () => {
    const chain = sceneBuilder({
      length: 2000,
      layouts: { names: ["a", "b"], pick: () => "a" },
    })
      .element(ball)
      .motion(carry({ ms: 300 }));
    expect(poseAt(chain, "ball", 100)).toBeDefined();
  });
});

describe("sceneBuilder: refusals", () => {
  it("refuses a second element with a name already used, naming both", () => {
    const chain = sceneBuilder().element(box("x"));
    expect(() => chain.element(text("x", "hi"))).toThrow(/"x" \(box\).*"x" \(text\)/);
  });

  it("accepts the same element again, selected later", () => {
    const x = box("x");
    expect(() => sceneBuilder().element(x).element(box("y")).element(x)).not.toThrow();
  });

  it("refuses a duplicate name inside a group", () => {
    expect(() => sceneBuilder().element(group("g", [box("x"), box("x")]))).toThrow(/"x"/);
  });

  it("refuses a loop of reads at build, naming every element in it", () => {
    const a = box("a");
    const b = box("b");
    const c = box("c");
    const chain = sceneBuilder()
      .element(a)
      .motion(stayWith(b))
      .element(b)
      .motion(stayWith(c))
      .element(c);
    expect(() => chain.motion(stayWith(a))).toThrow(/a.*b.*c|a.*c.*b/);
    expect(() => sceneBuilder().element(a).motion(stayWith(a))).toThrow(/"?a"?/);
  });

  it("refuses a read of an element the chain never selects when compiled", () => {
    const result = compileStage(
      sceneBuilder()
        .element(box("a"))
        .motion(stayWith(box("ghost")))
        .show(enter),
    );
    expect(result.ok).toBe(false);
  });

  it("refuses a limit field set twice on one element", () => {
    const x = box("x");
    expect(() => sceneBuilder().element(x).limits({ jump: 1 }).limits({ jump: 2 })).toThrow(/jump/);
    expect(() => sceneBuilder().element(x).limits({ jump: 1 }).limits({ turn: 2 })).not.toThrow();
  });

  it("refuses a beat name used for two different spans", () => {
    const x = box("x");
    expect(() => sceneBuilder().element(x).show(enter).show(beat("enter", 999))).toThrow(/enter/);
  });
});

describe("sceneBuilder: order", () => {
  it("does not offer motion, modify, show or limits before an element", () => {
    // @ts-expect-error a motion needs an element first
    expect(() => sceneBuilder().motion(slideX(1))).toThrow();
  });

  it("is immutable: each call returns a new builder", () => {
    const base = sceneBuilder().element(box("a")).show(enter);
    const more = base.element(box("b"));
    expect(compiled(base).members).toHaveLength(1);
    expect(compiled(more).members).toHaveLength(2);
  });
});
