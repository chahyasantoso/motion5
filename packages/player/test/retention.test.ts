import { describe, expect, it, vi } from "vitest";
import {
  INPUT_EVENTS,
  easeTo,
  eventLog,
  liveAt,
  pointer,
  scroll,
  shared,
  springTo,
  state,
  tally,
  type Events,
  type MotionEvent,
  type Time,
} from "@gerak/core";
import { manualDriver, play, type Driver } from "../src/index";

describe("Player retention, snapshots, and event announcements", () => {
  it("isolates concurrent Players reading scroll, pointer, and state", () => {
    let stateFolds = 0;
    const clicks = state(0, (n, e) => {
      stateFolds += 1;
      return e.name === "click" ? n + 1 : n;
    });
    const scene = (t: Time, events: Events) => ({
      y: scroll.y(t, events),
      px: pointer.x(t, events),
      clicks: clicks(t, events),
    });

    const logA = eventLog();
    const logB = eventLog();
    const dA = manualDriver({ durationMs: 2000 });
    const dB = manualDriver({ durationMs: 2000 });
    const driverA: Driver = { ...dA, events: () => logA.events };
    const driverB: Driver = { ...dB, events: () => logB.events };

    const pA = play(scene, driverA);
    const pB = play(scene, driverB);

    logA.add({ name: INPUT_EVENTS.scroll, at: 100, value: 100 });
    logA.add({ name: "click", at: 100 });
    dA.seekMs(200);

    logB.add({ name: INPUT_EVENTS.scroll, at: 100, value: 500 });
    logB.add({ name: "click", at: 100 });
    logB.add({ name: "click", at: 150 });
    dB.seekMs(200);

    expect(pA.values).toEqual({ y: 100, px: 0.5, clicks: 1 });
    expect(pB.values).toEqual({ y: 500, px: 0.5, clicks: 2 });
    const foldsAfterInit = stateFolds;

    logA.add({ name: "click", at: 300 });
    dA.seekMs(400);
    expect(pA.values.clicks).toBe(2);
    expect(pB.values.clicks).toBe(2);
    expect(stateFolds).toBe(foldsAfterInit + 1);
  });

  it("matches full-history rewind under window retention", () => {
    const mode = state("idle", (_cur, e) => (e.name === "mode" ? (e.other ?? "idle") : _cur));
    const sharedScroll = shared((t, e) => scroll.y(t, e) * 0.5);
    const springY = springTo(scroll.y, (v) => v, { stiffness: 140, damping: 20 });
    const easeMode = easeTo(mode, (v) => (v === "active" ? 100 : 0), { ms: 200 });
    const count = tally({ start: 0, on: { mode: 1 } });

    const scene = (t: Time, events: Events) => ({
      scroll: sharedScroll(t, events),
      springY: springY(t, events),
      easeMode: easeMode(t, events),
      count: count(t, events),
      mode: mode(t, events),
    });

    const logFull = eventLog();
    const logWin = eventLog();
    const dFull = manualDriver({ durationMs: 4000 });
    const dWin = manualDriver({ durationMs: 4000 });

    const pFull = play(
      scene,
      { ...dFull, events: () => logFull.events },
      { retention: { kind: "all" } },
    );
    const pWin = play(
      scene,
      { ...dWin, events: () => logWin.events },
      { retention: { kind: "window", windowMs: 1000, maxCheckpoints: 8 } },
    );

    for (let ms = 0; ms <= 3000; ms += 50) {
      if (ms % 200 === 0) {
        logFull.add({ name: INPUT_EVENTS.scroll, at: ms, value: ms });
        logWin.add({ name: INPUT_EVENTS.scroll, at: ms, value: ms });
      }
      if (ms === 300 || ms === 1200 || ms === 2150) {
        const other = ms === 1200 ? "idle" : "active";
        logFull.add({ name: "mode", at: ms, other });
        logWin.add({ name: "mode", at: ms, other });
      }
      dFull.seekMs(ms);
      dWin.seekMs(ms);
    }

    expect(logWin.events.length).toBeLessThan(logFull.events.length);

    for (const target of [2200, 2550, 2800, 2050]) {
      dFull.seekMs(target);
      dWin.seekMs(target);
      expect(pWin.values.mode).toBe(pFull.values.mode);
      expect(pWin.values.scroll).toBeCloseTo(pFull.values.scroll, 6);
      expect(pWin.values.easeMode).toBeCloseTo(pFull.values.easeMode, 4);
      expect(pWin.values.springY).toBeCloseTo(pFull.values.springY, 4);
    }
  });

  it("supports Player.snapshot() / restore() and Object.is subscriber deduplication", () => {
    const clicks = state(0, (n, e) => (e.name === "click" ? n + 1 : n));
    const scene = (t: Time, events: Events) => ({
      clicks: clicks(t, events),
      constant: 42,
    });
    const log = eventLog();
    const md = manualDriver({ durationMs: 2000 });
    const player = play(scene, { ...md, events: () => log.events });

    const seenConst: number[] = [];
    player.subscribe("constant", (v) => seenConst.push(v));

    log.add({ name: "click", at: 100 });
    md.seekMs(200);
    expect(player.values.clicks).toBe(1);
    const snap = player.snapshot();

    log.add({ name: "click", at: 400 });
    md.seekMs(500);
    expect(player.values.clicks).toBe(2);
    expect(seenConst).toEqual([42]);

    player.restore(snap);
    expect(player.values.clicks).toBe(1);
  });

  it("announces same-ms bursts and events arriving at current elapsed ms via player.on", () => {
    let now = 500;
    const listeners = new Set<() => void>();
    const log = eventLog();
    const driver: Driver = {
      now: () => liveAt(now),
      events: () => log.events,
      subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
    };

    const hits: MotionEvent[] = [];
    const player = play((_t, _e) => ({ x: 0 }), driver);
    player.on("hit", (event) => hits.push(event));

    // Events arriving at exact current `now` when `now` has not yet advanced
    log.add({ name: "hit", at: 500, value: 1 });
    log.add({ name: "hit", at: 500, value: 2 });
    for (const fn of listeners) fn();

    expect(hits.map((e) => e.value)).toEqual([1, 2]);

    now = 600;
    log.add({ name: "hit", at: 600, value: 3 });
    for (const fn of listeners) fn();

    expect(hits.map((e) => e.value)).toEqual([1, 2, 3]);
  });

  it("streams 100k events in live retention mode with bounded memory and flat runtime", () => {
    const log = eventLog();
    const md = manualDriver({ durationMs: 600_000 });
    const streamed: MotionEvent[] = [];
    const clicks = state(0, (n, e) => (e.name === "click" ? n + 1 : n));
    const player = play(
      (t, e) => ({ y: scroll.y(t, e), clicks: clicks(t, e) }),
      { ...md, events: () => log.events },
      {
        retention: { kind: "live", windowMs: 2000 },
        onEvent: (event) => streamed.push(event),
      },
    );

    const start = performance.now();
    for (let i = 0; i < 100_000; i += 1) {
      const at = i * 5;
      log.add({ name: INPUT_EVENTS.scroll, at, value: i });
      if (i % 1000 === 0) {
        log.add({ name: "click", at });
        md.seekMs(at);
      }
    }
    md.seekMs(99_999 * 5);
    const elapsedMs = performance.now() - start;

    expect(streamed.length).toBe(100_100);
    expect(log.events.length).toBeLessThanOrEqual(500);
    expect(player.values.clicks).toBe(100);
    expect(player.values.y).toBe(99_999);
    expect(elapsedMs).toBeLessThan(5000);
    vi.fn();
  });

  it("does not announce player.on handlers when seeking backward across a checkpoint under window retention", () => {
    const md = manualDriver({ durationMs: 2000 });
    const log = eventLog();
    const hits: string[] = [];
    const player = play(
      (t, ev) => ({ clicks: state(0, (n, e) => (e.name === "pageHit" ? n + 1 : n))(t, ev) }),
      { ...md, events: () => log.events },
      { retention: { kind: "window", windowMs: 1200, maxCheckpoints: 3 } },
    );
    player.on("cueHit", (ev) => hits.push(`cue@${ev.at}`));
    player.on("pageHit", (ev) => hits.push(`page@${ev.at}`));
    player.replace(
      (t, ev) => ({ clicks: state(0, (n, e) => (e.name === "pageHit" ? n + 1 : n))(t, ev) }),
      [
        { name: "cueHit", at: 200 },
        { name: "cueHit", at: 700 },
      ],
    );

    log.add({ name: "pageHit", at: 250 });
    md.seekMs(400);
    md.seekMs(800);
    expect(hits).toEqual(["cue@200", "page@250", "cue@700"]);

    // Seeking backward across checkpoint@0 to 750ms must replay state internally without re-firing events in (0, 750].
    hits.length = 0;
    md.seekMs(750);
    expect(hits).toEqual([]);
    expect(player.values.clicks).toBe(1);
  });
});
