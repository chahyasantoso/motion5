import {
  INPUT_EVENTS,
  ease,
  inputLog,
  motion,
  pageInputs,
  pointer,
  scroll,
  springTo,
  type Input,
  type InputEntry,
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
  frameVisible,
  listPose,
  object,
  poseOf,
  restReader,
  scene,
  scrollPoint,
  stagger,
  stayWith,
  text,
  type Scene,
  type Stage,
} from "../src";

const at = (ms: number, length = 3000): Time => ({
  progress: length <= 0 ? 0 : ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function eventsUpTo(events: Input, ms: number): Input {
  return events.filter((event) => event.at <= ms);
}

function poseAt(piece: Scene, name: string, ms: number, events: Input = []): Pose2d | undefined {
  const stage = compiled(piece);
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
  const card = box("card");

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

  it("refuses trigger beats and bad windows in .shows(), and input beats in stayWith()", () => {
    const enter = beat("enter", 400);
    // @ts-expect-error .show takes clock beats or scroll windows, not trigger beats
    expect(() => scene({ length: 1000 }, box("tCard").shows(tb))).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error .show refuses trigger beats in { from }
      scene({ length: 1000 }, box("fromCard").shows({ from: tb })),
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error .show refuses mixing clock beats and scroll points
      scene({ length: 1000 }, box("mixCard").shows([enter, p])),
    ).toThrow(TypeError);
    expect(() =>
      scene({ length: 1000 }, box("revCard").shows([scrollPoint(500), scrollPoint(100)])),
    ).toThrow(RangeError);
    expect(() =>
      scene(
        { length: 1000 },
        box("other").moves(slideX(10)),
        card.moves(stayWith(box("other")).in(sb)),
      ),
    ).toThrow(TypeError);
    expect(() =>
      scene(
        { length: 1000 },
        box("other").moves(slideX(10)),
        card.moves(stayWith(box("other")).in(tb)),
      ),
    ).toThrow(TypeError);
  });
});

describe("scroll beats", () => {
  const range = beat("hero-scroll", { scroll: [scrollPoint(200), scrollPoint(600)] });
  const makeCard = () => box("card");

  it("holds before from, maps 0 to 1 across the window, and holds after to", () => {
    const chain = scene({ length: 2000 }, makeCard().moves(slideX(100).in(range)));
    const scrollEvents: Input = [
      { kind: "value", name: INPUT_EVENTS.scroll, at: 100, value: 100 },
      { kind: "value", name: INPUT_EVENTS.scroll, at: 200, value: 200 },
      { kind: "value", name: INPUT_EVENTS.scroll, at: 300, value: 400 },
      { kind: "value", name: INPUT_EVENTS.scroll, at: 400, value: 600 },
      { kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 900 },
    ];
    expect(poseAt(chain, "card", 0, scrollEvents)?.x).toBe(0);
    expect(poseAt(chain, "card", 100, scrollEvents)?.x).toBe(0);
    expect(poseAt(chain, "card", 200, scrollEvents)?.x).toBe(0);
    expect(poseAt(chain, "card", 300, scrollEvents)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 400, scrollEvents)?.x).toBe(100);
    expect(poseAt(chain, "card", 500, scrollEvents)?.x).toBe(100);
  });

  it("trails the scroll with a spring when smooth, and reads the position itself headless", () => {
    const smooth = beat("smooth-scroll", {
      scroll: [scrollPoint(0), scrollPoint(400)],
      smooth: true,
    });
    const piece = scene({ length: 3000 }, makeCard().moves(slideX(100).in(smooth)));
    const jump: Input = [{ kind: "value", name: INPUT_EVENTS.scroll, at: 100, value: 400 }];
    const stage = compiled(piece);
    const xAt = (ms: number) =>
      poseOf(frame(stage, { time: at(ms, 3000), events: jump }).targets["card"])?.x ?? 0;
    expect(xAt(100)).toBe(0);
    const mid = xAt(200);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(100);
    expect(xAt(2000)).toBe(100);
    const untimed = poseOf(
      frame(stage, { time: { progress: 0, clock: { kind: "untimed" } }, events: jump }).targets[
        "card"
      ],
    );
    expect(untimed?.x).toBe(100);
    expect(() =>
      // @ts-expect-error smooth takes true or springTo options
      beat("bad", { scroll: [scrollPoint(0), scrollPoint(1)], smooth: 3 }),
    ).toThrow(/smooth/);
  });

  it("applies ease, supports take, and works with stagger and springTo", () => {
    const eased = scene({ length: 2000 }, makeCard().moves(slideX(100).in(range, ease.quadIn)));
    expect(
      poseAt(eased, "card", 300, [
        { kind: "value", name: INPUT_EVENTS.scroll, at: 300, value: 400 },
      ])?.x,
    ).toBeCloseTo(25, 9);

    const taken = scene(
      { length: 2000 },
      makeCard().moves(slideX(10), slideX(80).in(range).take()),
    );
    expect(
      poseAt(taken, "card", 100, [
        { kind: "value", name: INPUT_EVENTS.scroll, at: 100, value: 100 },
      ])?.x,
    ).toBe(0.5);
    expect(
      poseAt(taken, "card", 100, [
        { kind: "value", name: INPUT_EVENTS.scroll, at: 100, value: 400 },
      ])?.x,
    ).toBe(40);

    const makeWord = () => text("word", { split: "letters" });
    const staggeredOuter = compiled(
      scene({ length: 2000 }, makeWord().moves(stagger(slideX(100), { spread: 1 }).in(range))),
    );
    const outOuter = frame(staggeredOuter, {
      time: at(500, 2000),
      events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 400 }],
    }).targets["word"];
    expect([0, 1, 2].map((index) => listPose(outOuter, index, 3)?.x)).toEqual([100, 50, 0]);

    const staggeredInner = compiled(
      scene({ length: 2000 }, makeWord().moves(stagger(slideX(100).in(range), { spread: 1 }))),
    );
    const outInner = frame(staggeredInner, {
      time: at(500, 2000),
      events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 400 }],
    }).targets["word"];
    expect([0, 1, 2].map((index) => listPose(outInner, index, 3)?.x)).toEqual([100, 50, 0]);

    const staggeredEased = compiled(
      scene(
        { length: 2000 },
        makeWord().moves(stagger(slideX(100).in(range, ease.quadIn), { spread: 1 })),
      ),
    );
    const outEased = frame(staggeredEased, {
      time: at(500, 2000),
      events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 400 }],
    }).targets["word"];
    expect([0, 1, 2].map((index) => listPose(outEased, index, 3)?.x)).toEqual([100, 25, 0]);

    const loopingScroll = scene(
      { length: 2000 },
      makeCard().moves(slideX(100).in(range).loop(500)),
    );
    expect(() => poseAt(loopingScroll, "card", 500, [])).toThrow(RangeError);

    const smoothed = scene(
      { length: 4000 },
      makeCard().moves(bind({ y: springTo(scroll.y, (y) => y) })),
    );
    const smoothEvents: Input = [{ kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 200 }];
    expect(poseAt(smoothed, "card", 400, smoothEvents)?.y).toBe(0);
    const midY = poseAt(smoothed, "card", 550, smoothEvents)?.y ?? 0;
    expect(midY).toBeGreaterThan(0);
    expect(midY).toBeLessThan(200);
    expect(poseAt(smoothed, "card", 4000, smoothEvents)?.y).toBe(200);
  });
});

describe("trigger beats", () => {
  const triggerPoint = scrollPoint(400);
  const makeCard = () => box("card");
  const session: Input = [
    { kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 450 },
    { kind: "value", name: INPUT_EVENTS.scroll, at: 1200, value: 200 },
    { kind: "value", name: INPUT_EVENTS.scroll, at: 1800, value: 500 },
  ];

  it("handles back: 'stay' without reverting or replaying", () => {
    const stay = beat("stay", 400, { when: triggerPoint.reached, back: "stay" });
    const chain = scene({ length: 3000 }, makeCard().moves(slideX(100).in(stay)));
    expect(poseAt(chain, "card", 400, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 500, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 700, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1300, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1900, session)?.x).toBe(100);

    const earlyReturn: Input = [
      { kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 450 },
      { kind: "value", name: INPUT_EVENTS.scroll, at: 600, value: 200 },
    ];
    expect(poseAt(chain, "card", 700, earlyReturn)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, earlyReturn)?.x).toBe(100);
  });

  it("handles back: 'reverse' from completion and mid-flight without jumping", () => {
    const reverse = beat("reverse", 400, { when: triggerPoint.reached, back: "reverse" });
    const chain = scene({ length: 3000 }, makeCard().moves(slideX(100).in(reverse)));
    expect(poseAt(chain, "card", 400, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 700, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1200, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1400, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 1600, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 1700, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 2000, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 2200, session)?.x).toBe(100);

    const midReturn: Input = [
      { kind: "value", name: INPUT_EVENTS.scroll, at: 500, value: 450 },
      { kind: "value", name: INPUT_EVENTS.scroll, at: 700, value: 200 },
    ];
    expect(poseAt(chain, "card", 700, midReturn)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 800, midReturn)?.x).toBeCloseTo(25, 9);
    expect(poseAt(chain, "card", 900, midReturn)?.x).toBe(0);

    const eased = scene({ length: 3000 }, makeCard().moves(slideX(100).in(reverse, ease.cubicOut)));
    expect(poseAt(eased, "card", 700, midReturn)?.x).toBeCloseTo(100 * ease.cubicOut(0.5), 9);
    expect(poseAt(eased, "card", 800, midReturn)?.x).toBeCloseTo(100 * ease.cubicOut(0.25), 9);
  });

  it("handles back: 'replay' by resetting on return and playing again on re-entry", () => {
    const replay = beat("replay", 400, { when: triggerPoint.reached, back: "replay" });
    const chain = scene({ length: 3000 }, makeCard().moves(slideX(100).in(replay)));
    expect(poseAt(chain, "card", 400, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 700, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 900, session)?.x).toBe(100);
    expect(poseAt(chain, "card", 1200, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 1500, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 1800, session)?.x).toBe(0);
    expect(poseAt(chain, "card", 2000, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(chain, "card", 2200, session)?.x).toBe(100);
  });

  it("scrubs identically out of order for all three back modes and supports take(), stagger and loop()", () => {
    const times = [0, 400, 500, 700, 900, 1200, 1400, 1600, 1800, 2000, 2200];
    for (const back of ["stay", "reverse", "replay"] as const) {
      const trig = beat(`t-${back}`, 400, { when: triggerPoint.reached, back });
      const piece = scene({ length: 3000 }, makeCard().moves(slideX(100).in(trig)));
      const stage = compiled(piece);
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
    const taken = scene({ length: 3000 }, makeCard().moves(slideX(10), slideX(90).in(trig).take()));
    expect(poseAt(taken, "card", 400, session)?.x).toBeCloseTo((400 / 3000) * 10, 9);
    expect(poseAt(taken, "card", 700, session)?.x).toBeCloseTo(45, 9);
    expect(poseAt(taken, "card", 1200, session)?.x).toBeCloseTo((1200 / 3000) * 10, 9);

    const revTrig = beat("take-rev", 400, { when: triggerPoint.reached, back: "reverse" });
    const takenRev = scene(
      { length: 3000 },
      makeCard().moves(slideX(10), slideX(90).in(revTrig).take()),
    );
    expect(poseAt(takenRev, "card", 1400, session)?.x).toBeCloseTo(45, 9);
    expect(poseAt(takenRev, "card", 1600, session)?.x).toBeCloseTo((1600 / 3000) * 10, 9);

    const stayTrig = beat("take-stay", 400, { when: triggerPoint.reached, back: "stay" });
    const takenStay = scene(
      { length: 3000 },
      makeCard().moves(slideX(10), slideX(90).in(stayTrig).take()),
    );
    expect(poseAt(takenStay, "card", 1300, session)?.x).toBe(90);

    const zeroTrig = beat("zero-trig", 400, { when: scrollPoint(0).reached, back: "stay" });
    const zeroScene = scene({ length: 1000 }, makeCard().moves(slideX(100).in(zeroTrig)));
    expect(poseAt(zeroScene, "card", 200, [])?.x).toBeCloseTo(50, 9);

    const longTrig = beat("long-trig", 1000, { when: triggerPoint.reached, back: "stay" });
    const loopedDirect = scene(
      { length: 3000 },
      makeCard().moves(slideX(100).in(longTrig).loop(500)),
    );
    expect(poseAt(loopedDirect, "card", 750, session)?.x).toBeCloseTo(50, 9);
    expect(poseAt(loopedDirect, "card", 1250, session)?.x).toBeCloseTo(50, 9);

    const word = text("word", { split: "letters" });
    const staggeredTrig = compiled(
      scene({ length: 3000 }, word.moves(stagger(slideX(100).in(stayTrig), { spread: 1 }))),
    );
    const outTrig = frame(staggeredTrig, {
      time: at(700, 3000),
      events: eventsUpTo(session, 700),
    }).targets["word"];
    expect([0, 1, 2].map((index) => listPose(outTrig, index, 3)?.x)).toEqual([100, 50, 0]);
  });
});

describe("recorded session replay and beat names", () => {
  it("replays pointer.x identically from recorded cues across runs and seeks", () => {
    const cues: Input = [
      { kind: "value", name: INPUT_EVENTS.pointerX, at: 100, value: 0.25 },
      { kind: "value", name: INPUT_EVENTS.pointerX, at: 400, value: 0.9 },
    ];
    const dot = box("dot");
    const piece = scene(
      { length: 1000, cues },
      dot.moves(bind({ x: (t, e) => pointer.x(t, e) * 200 })),
    );
    const stageA = compiled(piece);
    const stageB = compiled(piece);
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

    expect(() =>
      scene(
        { length: 1000 },
        box("a").moves(slideX(10).in(sameScroll)),
        box("b").moves(slideX(20).in(sameScroll)),
      ),
    ).not.toThrow();

    expect(() =>
      scene(
        { length: 1000 },
        box("a").moves(slideX(10).in(sameScroll)),
        box("b").moves(slideX(20).in(otherScroll)),
      ),
    ).toThrow(RangeError);

    expect(() =>
      scene({ length: 1000 }, box("a").shows(clockBeat), box("b").moves(slideX(20).in(sameScroll))),
    ).toThrow(RangeError);
  });
});

describe("trigger beats over a long session", () => {
  type Back = "reverse" | "stay" | "replay";
  const threshold = 500;
  const ms = 400;

  function expected(back: Back, events: Input, now: number): number {
    let y = 0;
    let reached = false;
    let started: number | undefined;
    let progress = 0;
    let since = 0;
    for (const event of events) {
      if (event.at > now || typeof event.value !== "number") continue;
      if (event.value === y) continue;
      y = event.value;
      const next = y >= threshold;
      switch (back) {
        case "stay":
          if (started === undefined && next) started = event.at;
          break;
        case "replay":
          if (next !== reached) started = next ? event.at : undefined;
          reached = next;
          break;
        case "reverse":
          if (next === reached) break;
          progress = Math.min(
            1,
            Math.max(0, progress + (reached ? 1 : -1) * ((event.at - since) / ms)),
          );
          since = event.at;
          reached = next;
          break;
      }
    }
    if (back === "reverse")
      return Math.min(1, Math.max(0, progress + (reached ? 1 : -1) * ((now - since) / ms)));
    return started === undefined ? 0 : Math.min(1, Math.max(0, (now - started) / ms));
  }

  function sceneFor(back: Back) {
    const trigger = beat(`t-${back}`, ms, { when: scrollPoint(threshold).reached, back });
    return compiled(scene({ length: 100000 }, box("card").moves(slideX(100).in(trigger))));
  }

  it.each(["reverse", "stay", "replay"] as const)(
    "gives the same progress as folding every step again (%s)",
    (back) => {
      const stage = sceneFor(back);
      let seed = 7;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      let events: InputEntry[] = [];
      for (let at = 10; at < 6000; at += 10 + Math.floor(random() * 40)) {
        events = [
          ...events,
          { kind: "value", name: INPUT_EVENTS.scroll, at, value: Math.round(random() * 1000) },
        ];
        const now = at + Math.floor(random() * 30);
        const x = poseOf(
          frame(stage, { time: { progress: 0, clock: { kind: "live", elapsed: now } }, events })
            .targets["card"],
        )?.x;
        expect(x ?? 0).toBeCloseTo(100 * expected(back, events, now), 9);
      }
      const back300 = poseOf(
        frame(stage, { time: { progress: 0, clock: { kind: "live", elapsed: 300 } }, events })
          .targets["card"],
      )?.x;
      expect(back300 ?? 0).toBeCloseTo(100 * expected(back, events, 300), 9);
    },
  );

  it("costs about the same per frame after many scroll steps as after a few", () => {
    const stage = sceneFor("reverse");
    const log = inputLog();
    const frames = (from: number, count: number): number => {
      const started = performance.now();
      for (let index = from; index < from + count; index += 1) {
        log.set(index, pageInputs, "scroll", index % 2 === 0 ? 0 : 1000);
        frame(stage, {
          time: { progress: 0, clock: { kind: "live", elapsed: index } },
          events: log.input,
        });
      }
      return performance.now() - started;
    };
    let next = 1;
    const window = (): number => {
      const spent = frames(next, 1000);
      next += 1000;
      return spent;
    };
    window();
    const early = Math.min(window(), window(), window());
    frames(next, 20000);
    next += 20000;
    const late = Math.min(window(), window(), window());
    expect(late).toBeLessThan(early * 4);
  });
});

describe("scroll-window .shows()", () => {
  it("shows elements and objects during ScrollBeat, [from, to], { from }, and { until } windows", () => {
    const sec = box("sec");
    const sb = beat("sb", { scroll: [sec.top, sec.end] });
    const stage = compiled(
      scene(
        { length: 1000 },
        object("viaBeat").shows(sb),
        box("viaPair").shows(
          [scrollPoint(100), scrollPoint(300)],
          [scrollPoint(500), scrollPoint(700)],
        ),
        object("viaFrom").shows({ from: sec.end }),
        box("viaUntil").shows({ until: scrollPoint(250) }),
        box("combined").shows(beat("early", 500), [scrollPoint(100), scrollPoint(300)]),
      ),
    );
    const rest = restReader({ sec: { x: 500, y: 300, width: 1000, height: 200 } });
    // `sec.top` = 200, `sec.end` = 400.
    const checkAt = (ms: number, y: number) => {
      const out = frame(stage, {
        time: at(ms, 1000),
        rest,
        events: y === 0 ? [] : [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: y }],
      });
      expect(frameVisible(out.targets)).toEqual(out.visible);
      expect(Object.keys(out.targets)).not.toContain("frameVisible");
      return out.visible;
    };

    expect(checkAt(100, 0)).toEqual({
      sec: true,
      viaBeat: false,
      viaPair: false,
      viaFrom: false,
      viaUntil: true,
      combined: false,
    });
    expect(checkAt(100, 200)).toEqual({
      sec: true,
      viaBeat: true,
      viaPair: true,
      viaFrom: false,
      viaUntil: true,
      combined: true,
    });
    expect(checkAt(100, 300)).toEqual({
      sec: true,
      viaBeat: true,
      viaPair: false,
      viaFrom: false,
      viaUntil: false,
      combined: false,
    });
    expect(checkAt(100, 400)).toEqual({
      sec: true,
      viaBeat: false,
      viaPair: false,
      viaFrom: true,
      viaUntil: false,
      combined: false,
    });
    expect(checkAt(600, 200)).toEqual({
      sec: true,
      viaBeat: true,
      viaPair: true,
      viaFrom: false,
      viaUntil: true,
      combined: false,
    });
    expect(checkAt(100, 550).viaPair).toBe(true);
    expect(checkAt(100, 700).viaPair).toBe(false);
  });

  it("registers edge elements referenced by scroll .shows() as read-only across sub-scenes", () => {
    const sharedSec = box("sharedSec");
    const ownerScene = scene(sharedSec.moves(slideX(40).in(beat("intro", 500))));
    const followerScene = scene(object("prop").shows([sharedSec.top, sharedSec.end]));
    const combined = compiled(scene(ownerScene, followerScene));
    expect(combined.members.filter((m) => m.name === "sharedSec")).toHaveLength(1);
    const rest = restReader({ sharedSec: { x: 500, y: 300, width: 1000, height: 200 } });
    expect(frame(combined, { time: at(250, 500), rest }).visible["prop"]).toBe(false);
    expect(
      frame(combined, {
        time: at(250, 500),
        rest,
        events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: 250 }],
      }).visible["prop"],
    ).toBe(true);

    // Two scenes giving `.shows()` to the same element remain refused.
    const dup = box("dup");
    const dupShowA = scene(dup.shows({ from: scrollPoint(10) }));
    expect(() => {
      const dupShowB = scene(dup.shows({ from: scrollPoint(20) }));
      scene(dupShowA, dupShowB);
    }).toThrow(/already belongs/);
  });

  it("keeps clock-only stages returning stage.visibleAt(ms) directly", () => {
    const stage = compiled(scene({ length: 1000 }, box("a").shows(beat("enter", 400))));
    const out = frame(stage, { time: at(100, 1000) });
    expect(out.visible).toBe(stage.visibleAt(100));
  });
});
