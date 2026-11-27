import { describe, expect, it } from "vitest";
import {
  INPUT_EVENTS,
  NO_INPUT,
  anticipation,
  arc,
  atProgress,
  createStore,
  inputLog,
  inputs,
  keyframes,
  liveAt,
  mix,
  motion,
  pageInputs,
  scroll,
  shared,
  span,
  state,
  trail,
  trailTurn,
  velocity,
  watchClock,
  watchedTime,
  withProbeStore,
  withStore,
  type Input,
  type Time,
} from "../src/index";

const testInputs = inputs({
  values: {},
  triggers: { inc: {}, step: {}, go: {}, jump: {}, jump2: {} },
});

describe("RuntimeStore, probe isolation, and motion pipeline", () => {
  it("isolates multiple stores across shared signals without refolding", () => {
    let folds = 0;
    const counter = state(0, (current, event) => {
      folds += 1;
      return event.name === "inc" ? current + 1 : current;
    });

    const storeA = createStore();
    const storeB = createStore();
    const logA = inputLog();
    const logB = inputLog();

    logA.trigger(100, testInputs, "inc");
    logA.set(100, pageInputs, INPUT_EVENTS.scroll, 120);
    logB.trigger(100, testInputs, "inc");
    logB.trigger(150, testInputs, "inc");
    logB.set(150, pageInputs, INPUT_EVENTS.scroll, 340);

    const a1 = withStore(storeA, () => ({
      count: counter(liveAt(200), logA.input),
      scroll: scroll.y(liveAt(200), logA.input),
    }));
    const b1 = withStore(storeB, () => ({
      count: counter(liveAt(200), logB.input),
      scroll: scroll.y(liveAt(200), logB.input),
    }));

    expect(a1).toEqual({ count: 1, scroll: 120 });
    expect(b1).toEqual({ count: 2, scroll: 340 });
    const foldsAfterInit = folds;

    logA.trigger(250, testInputs, "inc");
    logB.trigger(260, testInputs, "inc");

    const a2 = withStore(storeA, () => counter(liveAt(300), logA.input));
    const b2 = withStore(storeB, () => counter(liveAt(300), logB.input));
    expect(a2).toBe(2);
    expect(b2).toBe(3);
    expect(folds).toBe(foldsAfterInit + 2);
  });

  it("isolates backward probes in velocity, anticipation, arc, and trail from forward cursors", () => {
    let folds = 0;
    const count = state(0, (current, event) => {
      folds += 1;
      return event.name === "step" ? current + 10 : current;
    });
    const sig = (t: Time, events: Input): number => count(t, events);
    const store = createStore();
    const log = inputLog();
    log.trigger(100, testInputs, "step");
    log.trigger(200, testInputs, "step");

    withStore(store, () => {
      expect(count(liveAt(300), log.input)).toBe(20);
    });
    const foldsBeforeProbe = folds;

    withStore(store, () => {
      withProbeStore(() => count(liveAt(150), log.input));
      velocity((t, e) => ({ x: sig(t, e) }), liveAt(300), log.input);
      anticipation({ share: 0.2, amount: 0.5 })((t, e) => ({ x: sig(t, e) }))(
        liveAt(300),
        log.input,
      );
      arc({ bend: 20 })((t, e) => ({ x: sig(t, e), y: 0 }))(liveAt(300), log.input);
      trail(sig, { stiffness: 120, damping: 10 })(liveAt(300), log.input);
    });

    log.trigger(350, testInputs, "step");
    const afterProbeFolds = folds;
    withStore(store, () => {
      expect(count(liveAt(400), log.input)).toBe(30);
    });
    expect(folds - afterProbeFolds).toBe(1);
    expect(afterProbeFolds).toBeGreaterThanOrEqual(foldsBeforeProbe);
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

    expect(withStore(s1, () => expensive(t, NO_INPUT))).toBe(4);
    expect(withStore(s1, () => expensive(t, NO_INPUT))).toBe(4);
    expect(evals).toBe(1);
    expect(withStore(s2, () => expensive(t, NO_INPUT))).toBe(4);
    expect(evals).toBe(2);

    const windowedLoop = motion((time) => time.progress)
      .in(span(1000, 2000))
      .loop(300);
    expect(windowedLoop.loopsForever).toBe(false);
    expect(windowedLoop(liveAt(1000), NO_INPUT)).toBeCloseTo(0, 6);
    expect(windowedLoop(liveAt(1150), NO_INPUT)).toBeCloseTo(0.5, 6);
    expect(windowedLoop(liveAt(1450), NO_INPUT)).toBeCloseTo(0.5, 6);
    expect(windowedLoop(liveAt(2000), NO_INPUT)).toBeCloseTo(100 / 300, 6);
    expect(windowedLoop(liveAt(2500), NO_INPUT)).toBeCloseTo(100 / 300, 6);

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

    const log = inputLog();
    log.trigger(2100, testInputs, "go");
    const step = state(0, (c, e) => (e.name === "go" ? 100 : c));
    const trailed = trail((t, e) => step(t, e), { stiffness: 120, damping: 14 });
    const turned = trailTurn((t, e) => ({ rotation: step(t, e) }), { stiffness: 120, damping: 14 });

    const uses: string[] = [];
    watchClock(
      (use) => uses.push(use),
      () => trailed(liveAt(2500), log.input),
    );
    watchClock(
      (use) => uses.push(use),
      () => turned(liveAt(2500), log.input),
    );
    expect(uses).toEqual(["time", "time"]);

    const usesSettled: string[] = [];
    watchClock(
      (use) => usesSettled.push(use),
      () => trailed(liveAt(10_000), log.input),
    );
    expect(usesSettled).toEqual([]);
  });

  it("unwraps watchedTime and catches same-ms goal changes at now in trail and trailTurn", () => {
    const step = state(0, (c, e) => (e.name === "jump" ? 100 : c));
    const trailed = trail((t, e) => step(t, e), { stiffness: 120, damping: 14 });
    const turned = trailTurn((t, e) => ({ rotation: step(t, e) }), { stiffness: 120, damping: 14 });
    const log = inputLog();
    log.trigger(100, testInputs, "jump");

    const settledUses: string[] = [];
    watchClock(
      (use) => settledUses.push(use),
      () => {
        trailed(watchedTime(liveAt(10_000)), log.input);
        turned(watchedTime(liveAt(10_000)), log.input);
      },
    );
    expect(settledUses).toEqual([]);

    log.trigger(10_500, testInputs, "jump2");
    const step2 = state(0, (c, e) => (e.name === "jump2" ? 100 : c));
    const t2 = trail((t, e) => step2(t, e), { stiffness: 120, damping: 14 });
    const r2 = trailTurn((t, e) => ({ rotation: step2(t, e) }), { stiffness: 120, damping: 14 });
    const onArriveUses: string[] = [];
    watchClock(
      (use) => onArriveUses.push(use),
      () => {
        t2(liveAt(10_500), log.input);
        r2(liveAt(10_500), log.input);
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
