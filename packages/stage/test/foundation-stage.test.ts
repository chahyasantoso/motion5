import { describe, expect, it } from "vitest";
import { provenanceOf } from "../src/provenance/index";
import {
  INPUT_EVENTS,
  createStore,
  eventLog,
  liveAt,
  motion,
  pointer,
  scroll,
  span,
  state,
  withStore,
  type MotionEvent,
  type Pose2d,
} from "@gerak/core";
import {
  beat,
  bind,
  bindEach,
  box,
  compileScene,
  frame,
  listPose3d,
  object,
  partCounts,
  placementOf,
  poseOf,
  restReader,
  scene,
  scrollPoint,
  shot,
  stagger,
  stayWith,
  travel,
  withPlacement,
  type Drive,
  type InputNeed,
  type MotionContext,
  type Moves,
  type Stage,
} from "../src/index";
import { drawStrokes } from "../src/render";

function compile(s: ReturnType<typeof scene>): Stage {
  const res = compileScene(s);
  if (!res.ok) throw new Error(JSON.stringify(res.errors));
  return res.stage;
}

describe("Slice 2 foundation stage contracts", () => {
  it("reuses elements across independent scenes and sequential shots while shifting shot cues", () => {
    const hero = box("hero");
    const a = compile(
      scene(
        { name: "sceneA", cues: [{ name: "cue", at: 100 }] },
        hero.moves(motion((t): Pose2d => ({ x: t.progress * 100 })).in(beat("enter", 500))),
      ),
    );
    const b = compile(
      scene(
        { name: "sceneB" },
        hero.moves(motion((t): Pose2d => ({ y: t.progress * 200 })).in(beat("enter", 500))),
      ),
    );

    const outA = frame(a, {
      time: { progress: 1, clock: { kind: "timed", elapsed: 500, length: 500 } },
    });
    const outB = frame(b, {
      time: { progress: 1, clock: { kind: "timed", elapsed: 500, length: 500 } },
    });
    expect(outA.targets["hero"]).toEqual({ x: 100 });
    expect(outB.targets["hero"]).toEqual({ y: 200 });

    const s1 = scene(
      { length: 400, cues: [{ name: "ping", at: 50 }] },
      hero.moves(motion((t): Pose2d => ({ x: 100 * t.progress })).in(beat("in", 400))),
    );
    const s2 = scene(
      { length: 600, cues: [{ name: "pong", at: 100 }] },
      hero.moves(motion((t): Pose2d => ({ y: 50 * t.progress })).in(beat("move", 600))),
    );
    const reel = compile(scene(shot(s1, { name: "one" }), shot(s2, { name: "two" })));
    expect(reel.durationMs).toBe(1000);
    expect(reel.cues).toEqual([
      { name: "ping", at: 50 },
      { name: "pong", at: 500 },
    ]);
    expect(frame(reel, { time: liveAt(200) }).targets["hero"]).toEqual({ x: 50 });
    expect(frame(reel, { time: liveAt(700) }).targets["hero"]).toEqual({ x: 100, y: 25 });
  });

  it("allows sub-scenes in multiple independent parent scenes while refusing duplicate inclusion in one scene", () => {
    const badge = box("badge");
    const sub = scene({ name: "sharedSub" }, badge.moves(motion((): Pose2d => ({ x: 10 }))));
    const p1 = compile(scene({ name: "p1" }, sub));
    const p2 = compile(scene({ name: "p2" }, sub));
    expect(p1.members.map((m) => m.name)).toEqual(["badge"]);
    expect(p2.members.map((m) => m.name)).toEqual(["badge"]);
    expect(() => scene({ name: "dup" }, sub, sub)).toThrow(TypeError);
  });

  it("isolates TriggerBeat per RuntimeStore", () => {
    const trig = beat("reveal", 300, { when: scrollPoint(100).reached, back: "stay" });
    const storeA = createStore();
    const storeB = createStore();
    const logA = eventLog();
    const logB = eventLog();

    logA.add({ name: INPUT_EVENTS.scroll, at: 100, value: 200 });
    logB.add({ name: INPUT_EVENTS.scroll, at: 100, value: 20 });

    const activeA1 = withStore(storeA, () => trig.active(liveAt(200), { events: logA.events }));
    const activeB1 = withStore(storeB, () => trig.active(liveAt(200), { events: logB.events }));
    expect(activeA1).toBe(true);
    expect(activeB1).toBe(false);

    logA.add({ name: INPUT_EVENTS.scroll, at: 2500, value: 0 });
    const activeA2 = withStore(storeA, () => trig.active(liveAt(2600), { events: logA.events }));
    expect(activeA2).toBe(true);
  });

  it("reports ScrollBeat.moving via stillMoving even when smoothed spring crosses target with non-zero velocity", () => {
    const sb = beat("scroll", {
      scroll: [scrollPoint(0), scrollPoint(500)],
      smooth: { stiffness: 120, damping: 10 },
    });
    const log = eventLog();
    log.add({ name: INPUT_EVENTS.scroll, at: 0, value: 0 });
    log.add({ name: INPUT_EVENTS.scroll, at: 10, value: 400 });
    // Even if spring temporarily settles or moves near target, moving reflects watchClock("time").
    expect(sb.moving(liveAt(50), { events: log.events })).toBe(true);
    expect(sb.moving(liveAt(5000), { events: log.events })).toBe(false);
  });

  it("isolates stayWith probes so finished beats settle cleanly with no idle moves", () => {
    const leader = box("leader");
    const follower = box("follower");
    const enter = beat("enter", 500);
    const stg = compile(
      scene(
        { length: 2000 },
        leader.moves(motion((t): Pose2d => ({ x: 100 * t.progress })).in(enter)),
        follower.moves(stayWith(leader).in(enter)),
      ),
    );
    const moves = new Map<string, Moves>();
    const out = frame(stg, {
      time: { progress: 1, clock: { kind: "timed", elapsed: 1500, length: 2000 } },
      moves,
    });
    expect(out.targets["follower"]).toEqual({ x: 100 });
    expect(moves.get("leader")).toBeUndefined();
    expect(moves.get("follower")).toBeUndefined();
  });

  it("passes windowed _time to bind/bindEach and memoizes bindEach index signals", () => {
    const items = box("items", { parts: true });
    let builds = 0;
    const w = beat("grow", 1000, { at: 500 });
    const stg = compile(
      scene(
        { length: 2000 },
        items.moves(
          bindEach({
            x: (index) => {
              builds += 1;
              return (time) => time.progress * 100 + index;
            },
          }).in(w),
        ),
        box("solo").moves(bind({ y: (time) => time.progress * 50 }).in(w)),
      ),
    );

    const out1 = frame(stg, { time: liveAt(1000), counts: { items: 2 } });
    const fn = out1.targets["items"] as (i: number, n: number) => Pose2d;
    expect(fn(0, 2)).toEqual({ x: 50 });
    expect(fn(1, 2)).toEqual({ x: 51 });
    expect(out1.targets["solo"]).toEqual({ y: 25 });
    const buildsAfterFrame1 = builds;

    const out2 = frame(stg, { time: liveAt(1500), counts: { items: 2 } });
    const fn2 = out2.targets["items"] as (i: number, n: number) => Pose2d;
    expect(fn2(0, 2)).toEqual({ x: 100 });
    expect(fn2(1, 2)).toEqual({ x: 101 });
    expect(builds).toBe(buildsAfterFrame1);
  });

  it("handles unversioned plain arrays in shotEvents without returning stale cache", () => {
    const badge = box("badge");
    const clicks = state(0, (n, e) => (e.name === "click" ? n + 1 : n));
    const s1 = scene(
      { length: 500 },
      box("a").moves(motion((): Pose2d => ({ x: 1 })).in(beat("a", 500))),
    );
    const s2 = scene({ length: 500 }, badge.moves(bind({ x: (t, ev) => clicks(t, ev) * 10 })));
    const stg = compile(scene(shot(s1, { name: "one" }), shot(s2, { name: "two" })));
    let events: MotionEvent[] = [{ name: "click", at: 600 }];
    expect(frame(stg, { time: liveAt(700), events }).targets["badge"]).toEqual({ x: 10 });
    events = [...events, { name: "click", at: 650 }];
    expect(frame(stg, { time: liveAt(700), events }).targets["badge"]).toEqual({ x: 20 });
  });

  it("preserves .travel on 3D stagger, counts 3D object parts, and preserves ObjectRest in drawStrokes", () => {
    const slot = box("slot");
    const canvas = box("canvas");
    const lens = { x: 0, y: 0, z: 5, fov: 45 };
    const coins = object("coins", { parts: true, view: { canvas, lens } });
    const b = beat("fly", 1000);
    const stg = compile(
      scene(slot, canvas, coins.moves(stagger(travel({ to: slot }).in(b), { spread: 0.4 }))),
    );
    const rest = restReader(
      {
        slot: { x: 200, y: 150, width: 40, height: 40 },
        canvas: { x: 200, y: 150, width: 400, height: 300 },
      },
      {
        "coins.0": { width: 1, height: 1, depth: 1 },
        "coins.1": { width: 1, height: 1, depth: 1 },
      },
    );
    expect(partCounts(stg, rest)).toEqual({ coins: 2 });
    const drawn = drawStrokes(stg, rest);
    if (!drawn.ok) throw new Error("draw failed");
    expect(drawn.strokes.rest.object("coins.0")).toEqual({ width: 1, height: 1, depth: 1 });

    const out = frame(stg, {
      time: { progress: 0.5, clock: { kind: "timed", elapsed: 500, length: 1000 } },
      rest,
      counts: { coins: 2 },
    });
    const pose0 = listPose3d(out.targets["coins"], 0, 2);
    expect(pose0).toBeDefined();
    expect(typeof pose0?.x).toBe("number");
  });

  it("stores Box.placement directly on Box and survives spread and JSON clone", () => {
    const placed = withPlacement(
      { x: 10, y: 20, width: 100, height: 50 },
      { kind: "sticky", minY: 100, maxY: 500, pinY: 40 },
    );
    expect(placed.placement).toEqual({ kind: "sticky", minY: 100, maxY: 500, pinY: 40 });
    expect(placementOf({ ...placed })).toEqual({ kind: "sticky", minY: 100, maxY: 500, pinY: 40 });
    expect(placementOf(JSON.parse(JSON.stringify(placed)))).toEqual({
      kind: "sticky",
      minY: 100,
      maxY: 500,
      pinY: 40,
    });
  });

  it("treats finite windowed loops as settling rather than ambient and tracks InputNeed per member", () => {
    const finite = box("finite");
    const scroller = box("scroller");
    const pointerBox = box("pointerBox");
    const clickBox = box("clickBox");
    const clockBox = box("clockBox");
    const clicks = state(0, (n, e) => (e.name === "tap" ? n + 1 : n));
    const stg = compile(
      scene(
        { length: 1000 },
        finite.moves(
          motion((t): Pose2d => ({ x: t.progress * 20 }))
            .in(span(0, 500))
            .loop(100),
        ),
        scroller.moves(bind({ y: (t, ev) => scroll.y(t, ev) })),
        pointerBox.moves(bind({ x: (t, ev) => pointer.x(t, ev) })),
        clickBox.moves(bind({ opacity: (t, ev) => clicks(t, ev) })),
        clockBox.moves(motion((t): Pose2d => ({ x: t.progress * 10 })).in(span(0, 500))),
      ),
    );
    const finiteMember = stg.members.find((m) => m.name === "finite");
    expect(finiteMember?.expect).toBe("settle");

    const moves = new Map<string, Moves>();
    const inputs = new Map<string, InputNeed>();
    frame(stg, {
      time: { progress: 1, clock: { kind: "timed", elapsed: 800, length: 1000 } },
      moves,
      inputs,
    });
    expect(moves.get("finite")).toBeUndefined();
    expect(inputs.get("scroller")).toEqual({ scroll: true, pointer: false, events: false });
    expect(inputs.get("pointerBox")).toEqual({ scroll: false, pointer: true, events: false });
    expect(inputs.get("clickBox")).toEqual({ scroll: false, pointer: false, events: true });
    expect(inputs.get("clockBox")).toEqual({ scroll: false, pointer: false, events: false });
  });

  it("propagates InputNeed and marks MORE drive through stayWith and historical context.read without polluting moves", () => {
    const a = box("a");
    const b = box("b");
    const followB = beat("followB", 400);
    const readB = beat("readB", 400);
    const scrollBeat = beat("sc", { scroll: [scrollPoint(0), scrollPoint(500)] });
    const stg = compile(
      scene(
        { length: 1000 },
        a.moves(bind({ x: (t, ev) => scroll.y(t, ev) })),
        b.moves(
          stayWith(a).in(followB),
          motion<Pose2d, MotionContext>((t, ctx) => {
            const past = ctx?.read(a, { time: t });
            return { y: (past?.x ?? 0) * 0.5 };
          }).in(readB),
        ),
      ),
    );
    expect(scrollBeat).toBeDefined();

    const moves = new Map<string, Moves>();
    const drives = new Map<string, Drive>();
    const inputs = new Map<string, InputNeed>();
    const log = eventLog();
    log.add({ name: INPUT_EVENTS.scroll, at: 100, value: 80 });

    const out = frame(stg, {
      time: { progress: 1, clock: { kind: "timed", elapsed: 1000, length: 1000 } },
      events: log.events,
      moves,
      drives,
      inputs,
    });
    expect(out.targets.b).toEqual({ x: 80, y: 40 });
    expect(moves.get("b")).toBeUndefined();
    expect(drives.get("b")?.kind).toBe("more");
    expect(inputs.get("b")).toEqual({ scroll: true, pointer: false, events: false });
  });

  it("shifts multi-shot element context.read probes by the active shot clock and records per-step provenance shot names", () => {
    const target = box("target");
    const reader = box("reader");
    const b1 = beat("b1", 500);
    const b2 = beat("b2", 500);

    const shot1 = scene(
      { name: "s1", length: 500 },
      target.moves(motion((t): Pose2d => ({ x: 100 * t.progress })).in(b1)),
      reader.moves(
        motion<Pose2d, MotionContext>((t, ctx) => {
          const readPrev = ctx?.read(target, { time: t });
          return { x: readPrev?.x ?? 0 };
        }).in(b1),
      ),
    );
    const shot2 = scene(
      { name: "s2", length: 500 },
      target.moves(motion((t): Pose2d => ({ x: 200 * t.progress })).in(b2)),
      reader.moves(
        motion<Pose2d, MotionContext>((t, ctx) => {
          const readPrev = ctx?.read(target, { time: t });
          return { y: readPrev?.x ?? 0 };
        }).in(b2),
      ),
    );
    const combined = scene({}, shot(shot1, { name: "intro" }), shot(shot2, { name: "outro" }));
    const prov = provenanceOf(combined);
    expect(
      prov.members.reader?.steps
        .filter((s) => s.kind === "motion")
        .map((s) => (s.kind === "motion" && s.window?.kind === "beat" ? s.window.beat : undefined)),
    ).toEqual(["intro.b1", "outro.b2"]);

    const stg = compile(combined);
    const halfIntro = frame(stg, {
      time: { progress: 0.25, clock: { kind: "timed", elapsed: 250, length: 1000 } },
    });
    expect(poseOf(halfIntro.targets.reader)?.x).toBeCloseTo(50, 6);

    const halfOutro = frame(stg, {
      time: { progress: 0.75, clock: { kind: "timed", elapsed: 750, length: 1000 } },
    });
    // At scene 750ms, shot2 reads target at 750ms (shot1 rested 100 + shot2 half 100 = 200).
    expect(poseOf(halfOutro.targets.reader)?.y).toBeCloseTo(200, 6);
  });
});
