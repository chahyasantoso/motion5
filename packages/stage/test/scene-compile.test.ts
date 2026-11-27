import { circlePath, motion, span, timeAt, type Input, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  bind,
  bindEach,
  box,
  carry,
  formatStageError,
  frame,
  listPose,
  object,
  poseOf,
  restReader,
  compileScene,
  isScene,
  scene,
  type RestAt,
  type Scene,
  shape,
  stagger,
  stayWith,
  text,
  type Stage,
} from "../src";

const at = (ms: number, length = 2000): Time =>
  timeAt({ progress: 0, clock: { kind: "timed", elapsed: 0, length } }, ms);

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function poseAt(piece: Scene, name: string, ms: number): Pose2d | undefined {
  return poseOf(frame(compiled(piece), { time: at(ms) }).targets[name]);
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
    expect(text("c").kind).toBe("text");
    expect(box("d", { parts: true }).kind).toBe("box");
    expect(box("a").name).toBe("a");
  });

  it("refuse a string on text, or split on a readout", () => {
    // @ts-expect-error the markup holds a text element's string
    expect(() => text("t", "hi")).toThrow(TypeError);
    // @ts-expect-error a readout takes no options
    expect(() => text("t", () => "x", { split: "letters" })).toThrow(TypeError);
  });

  it("accepts optional cast name type parameters on box, text, shape, and object", () => {
    type TestCast = "card" | "headline" | "clock" | "ring" | "jar";
    const typedCard = box<TestCast>("card");
    const typedTitle = text<TestCast>("headline", { split: "words" });
    const typedClock = text<TestCast>("clock", () => "0");
    const typedRing = shape<TestCast>("ring", circlePath({ cx: 0, cy: 0, r: 5 }));
    const typedJar = object<TestCast>("jar");
    const literalName: "card" = box("card").name;
    const typedCardName: TestCast = typedCard.name;
    const literalList = box("cards", { parts: true });
    const literalParts: true = literalList.parts;
    const literalObj = object("jarList", { parts: true });
    const literalObjParts: true = literalObj.parts;
    expect([literalName, typedCardName, literalParts, literalObjParts]).toEqual([
      "card",
      "card",
      true,
      true,
    ]);
    expect([
      typedCard.name,
      typedTitle.name,
      typedClock.name,
      typedRing.name,
      typedJar.name,
    ]).toEqual(["card", "headline", "clock", "ring", "jar"]);
    // @ts-expect-error unknown cast name refused on box
    box<TestCast>("typo");
    // @ts-expect-error unknown cast name refused on text
    text<TestCast>("typo", { split: "words" });
    // @ts-expect-error unknown cast name refused on text readout
    text<TestCast>("typo", () => "0");
    // @ts-expect-error unknown cast name refused on shape
    shape<TestCast>("typo", circlePath({ cx: 0, cy: 0, r: 5 }));
    // @ts-expect-error unknown cast name refused on object
    object<TestCast>("typo");
  });
});

describe("scene: what a chain compiles to", () => {
  const dot = shape("dot", circlePath({ cx: 0, cy: 0, r: 5 }));
  const card = box("card");
  const word = text("word", { split: "letters" });
  const chain = scene(
    card.moves(slideX(100).in(enter)).shows(enter, hold).limits({ jump: 50 }),
    dot,
    word.moves(grow(2).loop(500)),
  );

  it("is a scene that compiles to a stage", () => {
    expect(isScene(chain)).toBe(true);
    expect(isScene({ kind: "scene" })).toBe(false);
    expect(compileScene(chain).ok).toBe(true);
  });

  it("casts every element in the order of its first element call, with its meta", () => {
    const stage = compiled(chain);
    expect(stage.members.map((member) => [member.name, member.kind, member.expect])).toEqual([
      ["card", "actor", "settle"],
      ["dot", "actor", "static"],
      ["word", "list", "ambient"],
    ]);
    const cardMember = stage.members[0];
    expect(cardMember?.on).toEqual([
      [0, 400],
      [500, Number.POSITIVE_INFINITY],
    ]);
  });

  it("shows an element from a beat's start on, or from the start until a beat's end", () => {
    const stage = compiled(
      scene(
        { length: 3000 },
        box("late").shows({ from: hold }),
        box("early").shows({ until: enter }),
      ),
    );
    expect(stage.members.map((member) => member.on)).toEqual([
      [[500, Number.POSITIVE_INFINITY]],
      [[0, 400]],
    ]);
  });

  it("gathers the beats used by in and show, the length from the latest end, and the limits", () => {
    const stage = compiled(chain);
    expect(Object.keys(stage.beats)).toEqual(["enter", "hold"]);
    expect([stage.beats["hold"]?.from, stage.beats["hold"]?.to]).toEqual([500, 1100]);
    expect(stage.durationMs).toBe(1100);
    expect(stage.limits).toEqual({ card: { jump: 50 } });
  });

  it("takes the length from the options when given", () => {
    expect(compiled(scene({ length: 3000 }, box("card").shows(enter))).durationMs).toBe(3000);
  });

  it("takes cues from the builder", () => {
    const cues: Input = [{ kind: "trigger", name: "tap", at: 100, value: 1, target: "card" }];
    const compiled = compileScene(scene({ cues }, box("card").shows(enter)));
    if (!compiled.ok) throw new Error("did not compile");
    const stage = compiled.stage;
    expect(
      stage.cues.map(({ kind, name, at, value, target }) => ({ kind, name, at, value, target })),
    ).toEqual(cues);
  });
});

describe("scene: inference", () => {
  it("makes an element with no motion static, a looping one ambient and the rest settle", () => {
    const a = box("a");
    const b = box("b");
    const c = box("c");
    const d = box("d");
    const stage = compiled(
      scene(
        a.shows(enter),
        b.moves(slideX(1).in(enter)),
        c.moves(slideX(1).in(enter), grow(2).loop(900)),
        d.moves((time) => ({ x: time.progress })),
      ),
    );
    expect(stage.members.map((member) => member.expect)).toEqual([
      "static",
      "settle",
      "ambient",
      "settle",
    ]);
  });
});

describe("scene: ambient motions", () => {
  it("makes an element ambient when a motion says ambient, with no period", () => {
    const a = box("a");
    const stage = compiled(scene(a.moves(slideX(1).in(enter).ambient())));
    expect(stage.members.map((member) => member.expect)).toEqual(["ambient"]);
  });
});

describe("stagger", () => {
  const makeWord = () => text("word", { split: "letters" });
  const run = beat("run", 1000);
  const win = beat("win", 1000, { at: 1000 });
  const ramp = motion((time: Time): Pose2d => ({ x: time.progress }));
  const xs = (definition: Scene, ms: number): (number | undefined)[] => {
    const out = frame(compiled(definition), { time: at(ms, 3000) }).targets;
    return [0, 1, 2].map((index) => listPose(out["word"], index, 3)?.x);
  };

  it("gives the first and last part their lanes, from the start", () => {
    const chain = scene({ length: 3000 }, makeWord().moves(stagger(ramp, { spread: 1 }).in(run)));
    expect(xs(chain, 0)).toEqual([0, 0, 0]);
    expect(xs(chain, 500)).toEqual([1, 0.5, 0]);
    expect(xs(chain, 1000)).toEqual([1, 1, 1]);
  });

  it("starts from the end, the centre and the edges when asked", () => {
    const from = (order: "end" | "center" | "edges") =>
      xs(
        scene(
          { length: 3000 },
          makeWord().moves(stagger(ramp, { spread: 1, from: order }).in(run)),
        ),
        500,
      );
    expect(from("end")).toEqual([0, 0.5, 1]);
    expect(from("center")).toEqual([0, 1, 0]);
    expect(from("edges")).toEqual([1, 0, 1]);
  });

  it("stays inside the span of the motion it plays", () => {
    const chain = scene({ length: 3000 }, makeWord().moves(stagger(ramp.in(win), { spread: 1 })));
    expect(Object.keys(compiled(chain).beats)).toEqual(["win"]);
    expect(xs(chain, 500)).toEqual([0, 0, 0]);
    expect(xs(chain, 1500)).toEqual([1, 0.5, 0]);
    expect(xs(chain, 2500)).toEqual([1, 1, 1]);
  });

  it("plays the motion unchanged on an element without parts", () => {
    const chain = scene({ length: 2000 }, box("a").moves(stagger(ramp, { spread: 1 })));
    expect(poseAt(chain, "a", 1000)?.x).toBe(0.5);
    const inside = scene({ length: 3000 }, box("a").moves(stagger(ramp.in(win), { spread: 1 })));
    expect(poseAt(inside, "a", 1500)?.x).toBe(0.5);
  });

  it("builds each part's motion from its index and plays it in that part's lane", () => {
    const chain = scene(
      { length: 3000 },
      makeWord().moves(stagger((index) => slideX(index + 1), { spread: 1 }).in(run)),
    );
    expect(xs(chain, 500)).toEqual([1, 1, 0]);
    expect(xs(chain, 1000)).toEqual([1, 2, 3]);
  });

  it("takes the span of a motion built from its index", () => {
    const chain = scene(
      { length: 3000 },
      makeWord().moves(stagger(() => ramp.in(win), { spread: 1 })),
    );
    expect(Object.keys(compiled(chain).beats)).toEqual(["win"]);
    expect(xs(chain, 1500)).toEqual([1, 0.5, 0]);
  });

  it("keeps a loop, so its element is ambient, and a take", () => {
    const stage = compiled(
      scene({ length: 3000 }, makeWord().moves(stagger(ramp.loop(500), { spread: 1 }))),
    );
    expect(stage.members[0]?.expect).toBe("ambient");
    expect(stagger(ramp.take(), { spread: 1 }).joins).toBe("take");
  });
});

describe("bindEach", () => {
  it("binds a field of each part to the signal of its index", () => {
    const dots = box("dots", { parts: true });
    const chain = scene(
      { length: 2000 },
      dots.moves(
        bindEach({
          y: (index) => (time) => time.progress * 10 * (index + 1),
          rotation: () => () => 9,
        }),
      ),
    );
    const out = frame(compiled(chain), { time: at(1000) }).targets;
    expect([0, 1, 2].map((index) => listPose(out["dots"], index, 3)?.y)).toEqual([5, 10, 15]);
    expect(listPose(out["dots"], 1, 3)?.rotation).toBe(9);
  });

  it("refuses an element without parts", () => {
    const chain = scene({ length: 2000 }, box("a").moves(bindEach({ y: () => () => 1 })));
    expect(() => poseAt(chain, "a", 0)).toThrow(TypeError);
  });
});

describe("show with two beats", () => {
  it("compiles [from, to] to one stretch and still takes separate beats", () => {
    const late = beat("late", 100, { at: 2000 });
    const stage = compiled(scene(box("a").shows([enter, hold]), box("b").shows(late)));
    expect(stage.members[0]?.on).toEqual([[0, 1100]]);
    expect(Object.keys(stage.beats)).toEqual(["enter", "hold", "late"]);
    const mixed = compiled(scene(box("a").shows([enter, hold], late)));
    expect(mixed.members[0]?.on).toEqual([
      [0, 1100],
      [2000, Number.POSITIVE_INFINITY],
    ]);
  });
});

describe("scene: layering", () => {
  it("adds x and multiplies scale across layer motions", () => {
    const chain = scene(
      box("a").moves(
        slideX(100).in(enter),
        slideX(40).in(enter),
        grow(2).in(enter),
        grow(3).in(enter),
      ),
    );
    expect(poseAt(chain, "a", 0)).toEqual({ x: 0, scale: 1 });
    expect(poseAt(chain, "a", 400)).toEqual({ x: 140, scale: 6 });
    expect(poseAt(chain, "a", 200)).toEqual({ x: 70, scale: 1.5 * 2 });
  });

  it("holds an animation's start before its beat and its end after it", () => {
    const chain = scene(box("a").moves(slideX(100).in(hold)).shows(enter));
    expect(poseAt(chain, "a", 100)?.x).toBe(0);
    expect(poseAt(chain, "a", 1500)?.x).toBe(100);
  });

  it("lets a take motion replace only its fields, only from the start of its span", () => {
    const chain = scene(
      box("a").moves(
        slideX(100).in(enter),
        grow(2).in(enter),
        motion((): Pose2d => ({ x: -5 }))
          .in(hold)
          .take(),
      ),
    );
    expect(poseAt(chain, "a", 400)).toEqual({ x: 100, scale: 2 });
    expect(poseAt(chain, "a", 499)).toEqual({ x: 100, scale: 2 });
    expect(poseAt(chain, "a", 500)).toEqual({ x: -5, scale: 2 });
    expect(poseAt(chain, "a", 1500)).toEqual({ x: -5, scale: 2 });
  });

  it("wraps everything above a modify and not what follows", () => {
    const chain = scene(
      box("a")
        .moves(slideX(100).in(enter))
        .modifies((signal) => (time, events) => {
          const pose = signal(time, events);
          return { ...pose, x: (pose.x ?? 0) * 2 };
        })
        .moves(slideX(10).in(enter)),
    );
    expect(poseAt(chain, "a", 400)?.x).toBe(210);
  });
});

describe("scene: lists", () => {
  it("gives a list element's poses per index and count", () => {
    const dots = box("dots", { parts: true });
    const word = text("word", { split: "letters" });
    const chain = scene(
      { length: 2000 },
      dots.moves((time, context) => ({ x: (context.index ?? 0) * 10 + (context.count ?? 0) })),
      word.moves((time, context) => ({ y: (context.index ?? 0) + time.progress })),
    );
    const stage = compiled(chain);
    const out = frame(stage, { time: at(1000) }).targets;
    expect([0, 1, 2].map((index) => listPose(out["dots"], index, 3)?.x)).toEqual([3, 13, 23]);
    expect([0, 1, 2].map((index) => listPose(out["word"], index, 3)?.y)).toEqual([0.5, 1.5, 2.5]);
  });
});

describe("scene: reading another element", () => {
  it("stayWith adds the travel of the read element since the start of its own span", () => {
    const hand = box("hand");
    const ball = box("ball");
    const chain = scene(
      hand.moves(slideX(100).in(span(0, 1000))),
      ball.moves(grow(1).in(enter), stayWith(hand).in(span(500, 1000))),
    );
    expect(poseAt(chain, "ball", 400)?.x).toBe(0);
    expect(poseAt(chain, "ball", 500)?.x).toBe(0);
    expect(poseAt(chain, "ball", 750)?.x).toBe(25);
    expect(poseAt(chain, "ball", 1000)?.x).toBe(50);
    expect(poseAt(chain, "hand", 1000)?.x).toBe(100);
  });

  it("lets a motion read another element's pose through the context", () => {
    const hand = box("hand");
    const chain = scene(
      { length: 2000 },
      hand.moves(slideX(100).in(span(0, 1000))),
      box("ball").moves((time, context) => ({ y: (context.read(hand).x ?? 0) + 1 })),
    );
    expect(poseAt(chain, "ball", 500)?.y).toBe(51);
  });

  it("reads a pose a modify changed", () => {
    const hand = box("hand");
    const chain = scene(
      { length: 2000 },
      hand
        .moves(slideX(100).in(span(0, 1000)))
        .modifies((signal) => (time, events) => ({ x: (signal(time, events).x ?? 0) + 7 })),
      box("ball").moves(stayWith(hand).in(span(0, 1000))),
    );
    expect(poseAt(chain, "ball", 1000)?.x).toBe(100);
  });

  it("binds fields to signals at scene time", () => {
    const chain = scene(
      { length: 2000 },
      box("ball").moves(bind({ y: (time) => time.progress * 100, rotation: () => 9 })),
    );
    expect(poseAt(chain, "ball", 1000)).toEqual({ y: 50, rotation: 9 });
  });

  it("carries the element through the scene's carry", () => {
    const chain = scene({ length: 2000 }, box("ball").moves(carry({ ms: 300 })));
    expect(poseAt(chain, "ball", 100)).toBeDefined();
  });

  it("carries a part of a list from the box named after the element and the part", () => {
    const dots = box("dots", { parts: true });
    const chain = scene({ length: 2000 }, dots.moves(carry({ ms: 200 })));
    const row = restReader({ "dots.1": { x: 100, y: 100, width: 200, height: 100 } });
    const wide = restReader({ "dots.1": { x: 300, y: 200, width: 400, height: 200 } });
    const measures: readonly RestAt[] = [
      { at: 0, rest: row },
      { at: 200, rest: wide },
    ];
    const out = frame(compiled(chain), {
      time: at(300),
      rest: wide,
      measures,
    }).targets["dots"];
    expect([0, 1].map((index) => listPose(out, index, 2))).toEqual([
      {},
      { x: -100, y: -50, scaleX: 0.75, scaleY: 0.75 },
    ]);
  });
});

describe("scene: refusals", () => {
  it("refuses a second element with a name already used, naming both", () => {
    expect(() => scene(box("x"), text("x"))).toThrow(/"x" \(box\).*"x" \(text\)/);
  });

  it("refuses a loop of reads at build, naming every element in it", () => {
    const a = box("a");
    const b = box("b");
    const c = box("c");
    expect(() => scene(a.moves(stayWith(b)), b.moves(stayWith(c)), c.moves(stayWith(a)))).toThrow(
      /a.*b.*c|a.*c.*b/,
    );
    expect(() => scene(a.moves(stayWith(a)))).toThrow(/"?a"?/);
  });

  it("refuses a read of an element the chain never selects when compiled", () => {
    const result = compileScene(
      scene(
        box("a")
          .moves(stayWith(box("ghost")))
          .shows(enter),
      ),
    );
    expect(result.ok).toBe(false);
  });

  it("refuses a limit field set twice on one element", () => {
    expect(() => scene(box("x").limits({ jump: 1 }).limits({ jump: 2 }))).toThrow(/jump/);
    expect(() => scene(box("x").limits({ jump: 1 }).limits({ turn: 2 }))).not.toThrow();
  });

  it("refuses a beat name used for two different spans", () => {
    expect(() => scene(box("x").shows(enter).shows(beat("enter", 999)))).toThrow(/enter/);
  });
});

describe("scene: across copies and chains", () => {
  it("reads a scene another copy of the package made, by its global key", () => {
    const made = scene({ length: 500 }, box("a"));
    const key = Symbol.for("@gerak/stage/scene");
    const elsewhere = Object.freeze(
      Object.defineProperty({ kind: "scene" }, key, { value: Reflect.get(made, key) }),
    );
    expect(isScene(elsewhere)).toBe(true);
    expect(isScene({ kind: "scene" })).toBe(false);
  });

  it("computes each read element once per time in a frame, so a chain of stayWith grows linearly", () => {
    let calls = 0;
    const counted = motion((time: Time): Pose2d => {
      calls += 1;
      return { x: 100 * time.progress };
    });
    const span = beat("span", 1000);
    const links = Array.from({ length: 14 }, (_, index) => box(`link${index}`));
    const [first, ...rest] = links;
    if (first === undefined) throw new Error("no links");
    const chain = scene(
      { length: 1000 },
      first.moves(counted.in(span)),
      ...rest.map((link, index) => link.moves(stayWith(links[index] ?? first).in(span))),
    );
    const result = compileScene(chain);
    if (!result.ok) throw new Error("did not compile");
    calls = 0;
    frame(result.stage, { time: at(500, 1000) });
    expect(calls).toBeLessThan(60);
  });
});
