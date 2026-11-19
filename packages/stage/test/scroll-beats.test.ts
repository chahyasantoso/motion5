import {
  INPUT_EVENTS,
  ease,
  motion,
  pointer,
  scroll,
  springTo,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  bind,
  box,
  compileScene,
  formatStageError,
  frame,
  listPose,
  poseOf,
  sceneBuilder,
  scrollPoint,
  stagger,
  text,
  type SceneBuilder,
  type Stage,
} from "../src";

const at = (ms: number, length = 3000): Time => ({
  progress: length <= 0 ? 0 : ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function eventsUpTo(events: Events, ms: number): Events {
  return events.filter((event) => event.at <= ms);
}

function poseAt(
  scene: SceneBuilder,
  name: string,
  ms: number,
  events: Events = [],
): Pose2d | undefined {
  const stage = compiled(scene);
  return poseOf(
    frame(stage, { time: at(ms, stage.durationMs), events: eventsUpTo(events, ms) }).targets[name],
  );
}

const slideX = (distance: number) =>
  motion((time: Time): Pose2d => ({ x: distance * time.progress }));

describe("scrollPoint", () => {
  it("resolves px and offsets with plus and minus, refusing non-finite values", () => {
    const start = scrollPoint(200);
    expect(start.at()).toBe(200);
    expect(start.plus(50).at()).toBe(250);
    expect(start.minus(80).at()).toBe(120);
    expect(start.reached.point).toBe(start);
    expect(() => scrollPoint(Number.NaN)).toThrow(RangeError);
    expect(() => start.plus(Infinity)).toThrow(RangeError);
    expect(() => start.minus(Number.NaN)).toThrow(RangeError);
  });
});

describe("beat type and runtime refusals", () => {
  const p = scrollPoint(400);
  const sb = beat("scroll-only", { scroll: [scrollPoint(0), scrollPoint(500)] });
  const tb = beat("trigger-only", 300, { when: p.reached, back: "stay" });

  it("refuses ms in scroll beats at type level and at runtime", () => {
    // @ts-expect-error a scroll beat takes scroll points, not ms
    expect(() => beat("bad", { scroll: [0, 500] })).toThrow(TypeError);
    // @ts-expect-error a scroll beat takes scroll points, not ms
    expect(() => beat("bad", { scroll: [scrollPoint(0), 500] })).toThrow(TypeError);
  });

  it("refuses scroll points and scroll/trigger beats in clock beats at type level and runtime", () => {
    // @ts-expect-error a clock beat takes ms, not a scroll point
    expect(() => beat("bad", p)).toThrow(TypeError);
    // @ts-expect-error clock at takes ms, not a scroll point
    expect(() => beat("bad", 500, { at: p })).toThrow(TypeError);
    // @ts-expect-error clock after takes a clock beat, not a scroll beat
    expect(() => beat("bad", 500, { after: sb })).toThrow(TypeError);
    // @ts-expect-error clock after takes a clock beat, not a trigger beat
    expect(() => beat("bad", 500, { after: tb })).toThrow(TypeError);
  });

  it("refuses missing back or non-reached when on trigger beats at type level and runtime", () => {
    // @ts-expect-error back has no default
    expect(() => beat("bad", 400, { when: p.reached })).toThrow(TypeError);
    // @ts-expect-error when needs point.reached
    expect(() => beat("bad", 400, { when: 400, back: "stay" })).toThrow(TypeError);
    // @ts-expect-error when needs point.reached
    expect(() => beat("bad", 400, { when: p, back: "stay" })).toThrow(TypeError);
  });

  it("refuses fixed scroll ranges that do not increase", () => {
    expect(() => beat("reversed", { scroll: [scrollPoint(500), scrollPoint(200)] })).toThrow(
      RangeError,
    );
    expect(() => beat("empty", { scroll: [scrollPoint(400), scrollPoint(400)] })).toThrow(
      RangeError,
    );
  });
});

describe("scroll beats", () => {
  const range = beat("hero-scroll", { scroll: [scrollPoint(200), scrollPoint(600)] });
  const card = box("card");

  it("holds before from, maps 0 to 1 across the window, and holds after to", () => {
    const chain = sceneBuilder({ length: 2000 }).element(card).motion(slideX(100).in(range));
    const scrollEvents: Events = [
      { name: INPUT_EVENTS.scroll, at: 100, value: 100 },
      { name: INPUT_EVENTS.scroll, at: 200, value: 200 },
      { name: INPUT_EVENTS.scroll, at: 300, value: 400 },
      { name: INPUT_EVENTS.scroll, at: 400, value: 600 },
      { name: INPUT_EVENTS.scroll, at: 500, value: 900 },
    ];
    expect(poseAt(chain, "card", 0, scrollEvents)?.x).toBe(0);
    expect(poseAt(chain, "card", 100, scrollEvents)?.x).toBe(0);
    expect(poseAt(chain, "card", 200, scrollEvents)?.x).toBe(0);
    expect(poseAt(chain, "card", 300, scrollEvents)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 400, scrollEvents)?.x).toBe(100);
    expect(poseAt(chain, "card", 500, scrollEvents)?.x).toBe(100);
  });

  it("applies ease, supports take, and works with stagger and springTo", () => {
    const eased = sceneBuilder({ length: 2000 })
      .element(card)
      .motion(slideX(100).in(range, ease.quadIn));
    expect(
      poseAt(eased, "card", 300, [{ name: INPUT_EVENTS.scroll, at: 300, value: 400 }])?.x,
    ).toBeCloseTo(25, 9);

    const taken = sceneBuilder({ length: 2000 })
      .element(card)
      .motion(slideX(10), slideX(80).in(range).take());
    expect(
      poseAt(taken, "card", 100, [{ name: INPUT_EVENTS.scroll, at: 100, value: 100 }])?.x,
    ).toBe(0.5);
    expect(
      poseAt(taken, "card", 100, [{ name: INPUT_EVENTS.scroll, at: 100, value: 400 }])?.x,
    ).toBe(40);

    const word = text("word", "ABC", { split: "letters" });
    const staggeredOuter = compiled(
      sceneBuilder({ length: 2000 })
        .element(word)
        .motion(stagger(slideX(100), { spread: 1 }).in(range)),
    );
    const outOuter = frame(staggeredOuter, {
      time: at(500, 2000),
      events: [{ name: INPUT_EVENTS.scroll, at: 500, value: 400 }],
    }).targets["word"];
    expect([0, 1, 2].map((index) => listPose(outOuter, index, 3)?.x)).toEqual([100, 50, 0]);

    const staggeredInner = compiled(
      sceneBuilder({ length: 2000 })
        .element(word)
        .motion(stagger(slideX(100).in(range), { spread: 1 })),
    );
    const outInner = frame(staggeredInner, {
      time: at(500, 2000),
      events: [{ name: INPUT_EVENTS.scroll, at: 500, value: 400 }],
    }).targets["word"];
    expect([0, 1, 2].map((index) => listPose(outInner, index, 3)?.x)).toEqual([100, 50, 0]);

    const smoothed = sceneBuilder({ length: 4000 })
      .element(card)
      .motion(bind({ y: springTo(scroll.y, (y) => y) }));
    const smoothEvents: Events = [{ name: INPUT_EVENTS.scroll, at: 500, value: 200 }];
    expect(poseAt(smoothed, "card", 400, smoothEvents)?.y).toBe(0);
    const midY = poseAt(smoothed, "card", 550, smoothEvents)?.y ?? 0;
    expect(midY).toBeGreaterThan(0);
    expect(midY).toBeLessThan(200);
    expect(poseAt(smoothed, "card", 4000, smoothEvents)?.y).toBe(200);
  });
});

describe("trigger beats", () => {
  const triggerPoint = scrollPoint(400);
  const card = box("card");
  const session: Events = [
    { name: INPUT_EVENTS.scroll, at: 500, value: 450 },
    { name: INPUT_EVENTS.scroll, at: 1200, value: 200 },
    { name: INPUT_EVENTS.scroll, at: 1800, value: 500 },
  ];

  it("handles back: 'stay' without reverting or replaying", () => {
    const stay = beat("stay", 400, { when: triggerPoint.reached, back: "stay" });
    const chain = sceneBuilder({ length: 3000 }).element(card).motion(slideX(100).in(stay));
    expect(poseAt(chain, "card", 400, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 500, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 700, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1300, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1900, session)?.x).toBe(100);

    const earlyReturn: Events = [
      { name: INPUT_EVENTS.scroll, at: 500, value: 450 },
      { name: INPUT_EVENTS.scroll, at: 600, value: 200 },
    ];
    expect(poseAt(chain, "card", 700, earlyReturn)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, earlyReturn)?.x).toBe(100);
  });

  it("handles back: 'reverse' from completion and mid-flight without jumping", () => {
    const reverse = beat("reverse", 400, { when: triggerPoint.reached, back: "reverse" });
    const chain = sceneBuilder({ length: 3000 }).element(card).motion(slideX(100).in(reverse));
    expect(poseAt(chain, "card", 400, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 700, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1200, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1400, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 1600, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 1700, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 2000, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 2200, session)?.x).toBe(100);

    const midReturn: Events = [
      { name: INPUT_EVENTS.scroll, at: 500, value: 450 },
      { name: INPUT_EVENTS.scroll, at: 700, value: 200 },
    ];
    expect(poseAt(chain, "card", 700, midReturn)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 800, midReturn)?.x).toBeCloseTo(25, 9);
    expect(poseAt(chain, "card", 900, midReturn)?.x).toBe(0);

    const eased = sceneBuilder({ length: 3000 })
      .element(card)
      .motion(slideX(100).in(reverse, ease.cubicOut));
    expect(poseAt(eased, "card", 700, midReturn)?.x).toBeCloseTo(100 * ease.cubicOut(0.5), 9);
    expect(poseAt(eased, "card", 800, midReturn)?.x).toBeCloseTo(100 * ease.cubicOut(0.25), 9);
  });

  it("handles back: 'replay' by resetting on return and playing again on re-entry", () => {
    const replay = beat("replay", 400, { when: triggerPoint.reached, back: "replay" });
    const chain = sceneBuilder({ length: 3000 }).element(card).motion(slideX(100).in(replay));
    expect(poseAt(chain, "card", 400, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 700, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1200, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 1500, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 1800, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 2000, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 2200, session)?.x).toBe(100);
  });

  it("scrubs identically out of order for all three back modes and supports take()", () => {
    const times = [0, 400, 500, 700, 900, 1200, 1400, 1600, 1800, 2000, 2200];
    for (const back of ["stay", "reverse", "replay"] as const) {
      const trig = beat(`t-${back}`, 400, { when: triggerPoint.reached, back });
      const scene = sceneBuilder({ length: 3000 }).element(card).motion(slideX(100).in(trig));
      const stage = compiled(scene);
      const forward = times.map(
        (ms) =>
          poseOf(
            frame(stage, { time: at(ms, 3000), events: eventsUpTo(session, ms) }).targets["card"],
          )?.x,
      );
      const backward = [...times]
        .reverse()
        .map(
          (ms) =>
            poseOf(
              frame(stage, { time: at(ms, 3000), events: eventsUpTo(session, ms) }).targets["card"],
            )?.x,
        )
        .reverse();
      expect(backward).toEqual(forward);
    }

    const trig = beat("take-trig", 400, { when: triggerPoint.reached, back: "replay" });
    const taken = sceneBuilder({ length: 3000 })
      .element(card)
      .motion(slideX(10), slideX(90).in(trig).take());
    expect(poseAt(taken, "card", 400, session)?.x).toBeCloseTo((400 / 3000) * 10, 9);
    expect(poseAt(taken, "card", 700, session)?.x).toBeCloseTo(45, 9);
    expect(poseAt(taken, "card", 1200, session)?.x).toBeCloseTo((1200 / 3000) * 10, 9);
  });
});

describe("recorded session replay and beat names", () => {
  it("replays pointer.x identically from recorded cues across runs and seeks", () => {
    const cues: Events = [
      { name: INPUT_EVENTS.pointerX, at: 100, value: 0.25 },
      { name: INPUT_EVENTS.pointerX, at: 400, value: 0.9 },
    ];
    const dot = box("dot");
    const scene = sceneBuilder({ length: 1000, cues })
      .element(dot)
      .motion(bind({ x: (t, e) => pointer.x(t, e) * 200 }));
    const stageA = compiled(scene);
    const stageB = compiled(scene);
    const times = [0, 100, 250, 400, 800];
    const runA = times.map(
      (ms) =>
        poseOf(
          frame(stageA, { time: at(ms, 1000), events: eventsUpTo(stageA.cues, ms) }).targets["dot"],
        )?.x,
    );
    const runB = [...times]
      .reverse()
      .map(
        (ms) =>
          poseOf(
            frame(stageB, { time: at(ms, 1000), events: eventsUpTo(stageB.cues, ms) }).targets[
              "dot"
            ],
          )?.x,
      )
      .reverse();
    expect(runA).toEqual([100, 50, 50, 180, 180]);
    expect(runB).toEqual(runA);
  });

  it("refuses two distinct beats sharing a name, while allowing reuse of the same beat", () => {
    const sameScroll = beat("shared", { scroll: [scrollPoint(0), scrollPoint(200)] });
    const otherScroll = beat("shared", { scroll: [scrollPoint(100), scrollPoint(300)] });
    const clockBeat = beat("shared", 400);
    const a = box("a");
    const b = box("b");

    expect(() =>
      sceneBuilder({ length: 1000 })
        .element(a)
        .motion(slideX(10).in(sameScroll))
        .element(b)
        .motion(slideX(20).in(sameScroll)),
    ).not.toThrow();

    expect(() =>
      sceneBuilder({ length: 1000 })
        .element(a)
        .motion(slideX(10).in(sameScroll))
        .element(b)
        .motion(slideX(20).in(otherScroll)),
    ).toThrow(RangeError);

    expect(() =>
      sceneBuilder({ length: 1000 })
        .element(a)
        .show(clockBeat)
        .element(b)
        .motion(slideX(20).in(sameScroll)),
    ).toThrow(RangeError);
  });
});
