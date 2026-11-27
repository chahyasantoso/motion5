import { describe, expect, it } from "vitest";
import {
  INPUT_EVENTS,
  NO_EVENTS,
  anticipation,
  arc,
  atProgress,
  baseIndexOf,
  baselineOf,
  compactedBeforeOf,
  createStore,
  derivedEvents,
  easeTo,
  eventLog,
  generationOf,
  keyframes,
  liveAt,
  mix,
  motion,
  pointer,
  restore,
  scroll,
  shared,
  snapshot,
  sourceStreamOf,
  span,
  springTo,
  state,
  tally,
  trail,
  trailTurn,
  transition,
  velocity,
  watchClock,
  watchedTime,
  withProbeStore,
  withStore,
  type MotionEvent,
  type Time,
} from "../src/index";

describe("RuntimeStore and live retention", () => {
  it("isolates multiple stores across shared signals without refolding", () => {
    let folds = 0;
    const counter = state(0, (current, event) => {
      folds += 1;
      return event.name === "inc" ? current + 1 : current;
    });

    const storeA = createStore();
    const storeB = createStore();
    const logA = eventLog();
    const logB = eventLog();

    logA.add({ name: "inc", at: 100 });
    logA.add({ name: INPUT_EVENTS.scroll, at: 100, value: 120 });
    logB.add({ name: "inc", at: 100 });
    logB.add({ name: "inc", at: 150 });
    logB.add({ name: INPUT_EVENTS.scroll, at: 150, value: 340 });

    const a1 = withStore(storeA, () => ({
      count: counter(liveAt(200), logA.events),
      scroll: scroll.y(liveAt(200), logA.events),
    }));
    const b1 = withStore(storeB, () => ({
      count: counter(liveAt(200), logB.events),
      scroll: scroll.y(liveAt(200), logB.events),
    }));

    expect(a1).toEqual({ count: 1, scroll: 120 });
    expect(b1).toEqual({ count: 2, scroll: 340 });
    const foldsAfterInit = folds;

    logA.add({ name: "inc", at: 250 });
    logB.add({ name: "inc", at: 260 });

    const a2 = withStore(storeA, () => counter(liveAt(300), logA.events));
    const b2 = withStore(storeB, () => counter(liveAt(300), logB.events));
    expect(a2).toBe(2);
    expect(b2).toBe(3);
    expect(folds).toBe(foldsAfterInit + 2);
  });

  it("snapshots and restores RuntimeStore cleanly across repeated restores", () => {
    const toggle = state(false, (current, event) => (event.name === "flip" ? !current : current));
    const store = createStore();
    const log = eventLog();
    log.add({ name: "flip", at: 100 });

    expect(withStore(store, () => toggle(liveAt(200), log.events))).toBe(true);
    const snap = snapshot(store);

    log.add({ name: "flip", at: 400 });
    expect(withStore(store, () => toggle(liveAt(500), log.events))).toBe(false);

    restore(store, snap);
    expect(withStore(store, () => toggle(liveAt(200), log.events))).toBe(true);

    log.add({ name: "flip", at: 600 });
    expect(withStore(store, () => toggle(liveAt(650), log.events))).toBe(true);

    restore(store, snap);
    expect(withStore(store, () => toggle(liveAt(200), log.events))).toBe(true);
  });

  it("isolates backward probes in speedOf, anticipation, arc, and trail from forward cursors", () => {
    let folds = 0;
    const count = state(0, (current, event) => {
      folds += 1;
      return event.name === "step" ? current + 10 : current;
    });
    const sig = (t: Time, events: readonly MotionEvent[]): number => count(t, events);
    const store = createStore();
    const log = eventLog();
    log.add({ name: "step", at: 100 });
    log.add({ name: "step", at: 200 });

    withStore(store, () => {
      expect(count(liveAt(300), log.events)).toBe(20);
    });
    const foldsBeforeProbe = folds;

    withStore(store, () => {
      withProbeStore(() => count(liveAt(150), log.events));
      velocity((t, e) => ({ x: sig(t, e) }), liveAt(300), log.events);
      anticipation({ share: 0.2, amount: 0.5 })((t, e) => ({ x: sig(t, e) }))(
        liveAt(300),
        log.events,
      );
      arc({ bend: 20 })((t, e) => ({ x: sig(t, e), y: 0 }))(liveAt(300), log.events);
      trail(sig, { stiffness: 120, damping: 10 })(liveAt(300), log.events);
    });

    log.add({ name: "step", at: 350 });
    const afterProbeFolds = folds;
    withStore(store, () => {
      expect(count(liveAt(400), log.events)).toBe(30);
    });
    expect(folds - afterProbeFolds).toBe(1);
    expect(afterProbeFolds).toBeGreaterThanOrEqual(foldsBeforeProbe);
  });

  it("bounds 100k events under live retention, streams via onEvent, and retains baselines", () => {
    const streamed: MotionEvent[] = [];
    const log = eventLog({
      retention: { kind: "live", windowMs: 2000 },
      onEvent: (event) => streamed.push(event),
    });

    const store = createStore();
    const sprung = springTo(scroll.y, (v) => v);
    const eased = easeTo(scroll.y, (v) => v, { ms: 120 });
    const clicks = state(0, (n, e) => (e.name === "click" ? n + 1 : n));
    const trans = transition(clicks, { ms: 100 });
    const pulse = tally({ start: 0, on: { click: 1 } });

    const start = performance.now();
    withStore(store, () => {
      for (let i = 0; i < 100_000; i += 1) {
        const at = i * 5;
        log.add({ name: INPUT_EVENTS.scroll, at, value: i });
        log.add({ name: INPUT_EVENTS.pointerX, at, value: (i % 100) / 100 });
        if (i % 500 === 0) {
          log.add({ name: "click", at });
        }
        if (i % 2500 === 0) {
          const t = liveAt(at);
          scroll.y(t, log.events);
          sprung(t, log.events);
          eased(t, log.events);
          trans(t, log.events);
          pulse(t, log.events);
        }
      }
    });
    const elapsedMs = performance.now() - start;

    expect(streamed.length).toBe(200_200);
    expect(log.events.length).toBeLessThanOrEqual(1000);
    expect(generationOf(log.events)).toBe(0);
    expect(baseIndexOf(log.events)).toBeGreaterThan(190_000);
    expect(elapsedMs).toBeLessThan(5000);

    const base = baselineOf(log.events);
    expect(base?.get(INPUT_EVENTS.scroll)).toBeGreaterThan(99_000);
    expect(base?.get(INPUT_EVENTS.scroll)).toBeLessThan(99_999);

    const lateStore = createStore();
    const lateScroll = withStore(lateStore, () => scroll.y(liveAt(500_000), log.events));
    expect(lateScroll).toBe(99_999);
    expect(withStore(lateStore, () => pointer.x(liveAt(500_000), log.events))).toBe(99 / 100);
  });

  it("supports shared() cache per RuntimeStore and preserves motion.in().loop() call order", () => {
    let evals = 0;
    const expensive = shared((time: Time) => {
      evals += 1;
      return time.progress * 10;
    });
    const s1 = createStore();
    const s2 = createStore();
    const t = { progress: 0.4, clock: { kind: "timed", elapsed: 400, length: 1000 } } as const;

    expect(withStore(s1, () => expensive(t, NO_EVENTS))).toBe(4);
    expect(withStore(s1, () => expensive(t, NO_EVENTS))).toBe(4);
    expect(evals).toBe(1);
    expect(withStore(s2, () => expensive(t, NO_EVENTS))).toBe(4);
    expect(evals).toBe(2);

    const windowedLoop = motion((time) => time.progress)
      .in(span(1000, 2000))
      .loop(300);
    expect(windowedLoop.loopsForever).toBe(false);
    expect(windowedLoop(liveAt(1000), NO_EVENTS)).toBeCloseTo(0, 6);
    expect(windowedLoop(liveAt(1150), NO_EVENTS)).toBeCloseTo(0.5, 6);
    expect(windowedLoop(liveAt(1450), NO_EVENTS)).toBeCloseTo(0.5, 6);
    expect(windowedLoop(liveAt(2000), NO_EVENTS)).toBeCloseTo(100 / 300, 6);
    expect(windowedLoop(liveAt(2500), NO_EVENTS)).toBeCloseTo(100 / 300, 6);

    const infiniteLoop = motion((time) => time.progress).loop(300);
    expect(infiniteLoop.loopsForever).toBe(true);
  });

  it("supports keyframes on UNTIMED clocks, overtime nowOf, and trail/trailTurn stillMoving past 2000ms", () => {
    const kf = keyframes(
      0,
      [
        { at: 500, to: 100 },
        { at: 1000, to: 200 },
      ],
      mix,
    );
    expect(kf(atProgress(0.25))).toBeCloseTo(50, 6);
    expect(kf(atProgress(0.75))).toBeCloseTo(150, 6);
    expect(kf(atProgress(1))).toBeCloseTo(200, 6);

    const overtime: Time = { progress: 1, clock: { kind: "timed", elapsed: 1500, length: 1000 } };
    expect(span(1000, 2000).of(overtime).progress).toBeCloseTo(0.5, 6);

    const reversedTimed: Time = {
      progress: 0.5,
      clock: { kind: "timed", elapsed: 1500, length: 1000 },
    };
    expect(span(0, 1000).of(reversedTimed).progress).toBeCloseTo(0.5, 6);

    const log = eventLog();
    log.add({ name: "go", at: 2100 });
    const step = state(0, (c, e) => (e.name === "go" ? 100 : c));
    const trailed = trail((t, e) => step(t, e), { stiffness: 120, damping: 14 });
    const turned = trailTurn((t, e) => ({ rotation: step(t, e) }), { stiffness: 120, damping: 14 });

    const uses: string[] = [];
    watchClock(
      (use) => uses.push(use),
      () => trailed(liveAt(2500), log.events),
    );
    watchClock(
      (use) => uses.push(use),
      () => turned(liveAt(2500), log.events),
    );
    expect(uses).toEqual(["time", "time"]);

    const usesSettled: string[] = [];
    watchClock(
      (use) => usesSettled.push(use),
      () => trailed(liveAt(10_000), log.events),
    );
    expect(usesSettled).toEqual([]);
  });

  it("keeps sourceStreamOf, generation, and non-continuous state intact across derivedEvents live compaction", () => {
    let folds = 0;
    const score = state(0, (current, ev) => {
      folds += 1;
      return ev.name === "point" || ev.name === "cue-bonus"
        ? current + (typeof ev.value === "number" ? ev.value : 1)
        : current;
    });
    const cues: MotionEvent[] = [
      { name: "cue-bonus", at: 200, value: 10 },
      { name: "cue-bonus", at: 4500, value: 5 },
    ];
    const log = eventLog({ retention: { kind: "live", windowMs: 1000 } });
    const merger = derivedEvents();
    const store = createStore();

    withStore(store, () => {
      log.add({ name: "point", at: 500, value: 2 });
      const m1 = merger.resolve(cues, log.events, 600);
      expect(sourceStreamOf(m1)).toBeDefined();
      const gen1 = generationOf(m1);
      expect(score(liveAt(600), m1)).toBe(12);
      const folds1 = folds;

      log.add({ name: "point", at: 2500, value: 3 });
      const m2 = merger.resolve(cues, log.events, 2600);
      expect(sourceStreamOf(m2)).toBe(sourceStreamOf(m1));
      expect(generationOf(m2)).toBe(gen1);
      expect(compactedBeforeOf(m2)).toBe(1500);
      expect(score(liveAt(2600), m2)).toBe(15);
      expect(folds).toBe(folds1 + 1);

      log.add({ name: "point", at: 4600, value: 4 });
      const m3 = merger.resolve(cues, log.events, 4600);
      expect(sourceStreamOf(m3)).toBe(sourceStreamOf(m1));
      expect(generationOf(m3)).toBe(gen1);
      expect(score(liveAt(4600), m3)).toBe(24);
    });
  });

  it("ignores late events before compactedBefore without incrementing baseIndex or double-folding", () => {
    const log = eventLog({ retention: { kind: "live", windowMs: 1000 } });
    const count = state(0, (current, ev) => (ev.name === "tap" ? current + 1 : current));
    const store = createStore();

    log.add({ name: "tap", at: 100 });
    log.add({ name: "tap", at: 500 });
    withStore(store, () => {
      expect(count(liveAt(600), log.events)).toBe(2);
    });
    log.add({ name: "tap", at: 2000 });
    const baseBeforeLate = baseIndexOf(log.events);
    withStore(store, () => {
      expect(count(liveAt(2100), log.events)).toBe(3);
    });

    // Late event strictly older than compactedBefore (1000) is dropped cleanly.
    log.add({ name: "tap", at: 400 });
    expect(baseIndexOf(log.events)).toBe(baseBeforeLate);
    withStore(store, () => {
      expect(count(liveAt(2200), log.events)).toBe(3);
      log.add({ name: "tap", at: 2250 });
      expect(count(liveAt(2300), log.events)).toBe(4);
    });
  });

  it("propagates continuous baseline jumps after skipped compaction into springTo without clobbering anchorValue", () => {
    const log = eventLog({ retention: { kind: "live", windowMs: 1000 } });
    const sprung = springTo(scroll.y, (y) => y, { stiffness: 170, damping: 26 });
    const store = createStore();

    withStore(store, () => {
      log.add({ name: INPUT_EVENTS.scroll, at: 100, value: 50 });
      expect(sprung(liveAt(2000), log.events)).toBeCloseTo(50, 2);

      // Multiple events + compaction advance log completely past previous cursor without evaluation in between.
      log.add({ name: INPUT_EVENTS.scroll, at: 5000, value: 300 });
      log.add({ name: INPUT_EVENTS.scroll, at: 9000, value: 300 });
      // At t = 8050, baseline compacted to 300 at 8000; spring must be transitioning toward 300, not stuck at 50 or snapped.
      const mid = sprung(liveAt(8050), log.events);
      expect(mid).toBeGreaterThan(50);
      expect(mid).toBeLessThan(300);

      // Fresh downstream reader started after compaction also probes anchorValue cleanly without crashing.
      const store2 = createStore();
      const freshSprung = springTo(scroll.y, (y) => y, { stiffness: 170, damping: 26 });
      log.add({ name: INPUT_EVENTS.scroll, at: 9100, value: 400 });
      const stepsBefore = scroll.y.steps(liveAt(9100), log.events);
      expect(stepsBefore.length).toBeGreaterThan(0);
      const startVal = withStore(store2, () => freshSprung(liveAt(9150), log.events));
      expect(Number.isFinite(startVal)).toBe(true);
    });
  });

  it("unwraps watchedTime and catches same-ms goal changes at now in trail and trailTurn", () => {
    const step = state(0, (c, e) => (e.name === "jump" ? 100 : c));
    const trailed = trail((t, e) => step(t, e), { stiffness: 120, damping: 14 });
    const turned = trailTurn((t, e) => ({ rotation: step(t, e) }), { stiffness: 120, damping: 14 });
    const log = eventLog();
    log.add({ name: "jump", at: 100 });

    // Settled far past memoryMs: wrapped watchedTime must NOT receive "maybe".
    const settledUses: string[] = [];
    watchClock(
      (use) => settledUses.push(use),
      () => {
        trailed(watchedTime(liveAt(10_000)), log.events);
        turned(watchedTime(liveAt(10_000)), log.events);
      },
    );
    expect(settledUses).toEqual([]);

    // On the exact ms a new jump arrives, trail and trailTurn must report stillMoving().
    log.add({ name: "jump2", at: 10_500 });
    const step2 = state(0, (c, e) => (e.name === "jump2" ? 100 : c));
    const t2 = trail((t, e) => step2(t, e), { stiffness: 120, damping: 14 });
    const r2 = trailTurn((t, e) => ({ rotation: step2(t, e) }), { stiffness: 120, damping: 14 });
    const onArriveUses: string[] = [];
    watchClock(
      (use) => onArriveUses.push(use),
      () => {
        t2(liveAt(10_500), log.events);
        r2(liveAt(10_500), log.events);
      },
    );
    expect(onArriveUses).toEqual(["time", "time"]);
  });

  it("reports loopsForever according to pipeline order between .in(Span) and .loop(ms)", () => {
    const base = motion((t): { readonly x: number } => ({ x: t.progress * 10 }));
    expect(base.in(span(0, 1000)).loop(200).loopsForever).toBe(false);
    expect(base.loop(200).in(span(0, 1000)).loopsForever).toBe(true);
    expect(base.loop(200).loopsForever).toBe(true);
  });
});
