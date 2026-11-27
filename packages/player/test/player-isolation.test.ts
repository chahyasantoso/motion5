import { describe, expect, it } from "vitest";
import {
  INPUT_EVENTS,
  inputLog,
  inputs,
  liveAt,
  pageInputs,
  pointer,
  scroll,
  state,
  type Input,
  type InputEntry,
  type Time,
} from "@gerak/core";
import { manualDriver, play, type Driver } from "../src/index";

const playerInputs = inputs({
  values: {},
  triggers: { click: {}, hit: {} },
});

describe("Player isolation, deduplication, and event announcements", () => {
  it("isolates concurrent Players reading scroll, pointer, and state", () => {
    let stateFolds = 0;
    const clicks = state(0, (n, e) => {
      stateFolds += 1;
      return e.name === "click" ? n + 1 : n;
    });
    const scene = (t: Time, events: Input) => ({
      y: scroll.y(t, events),
      px: pointer.x(t, events),
      clicks: clicks(t, events),
    });

    const logA = inputLog();
    const logB = inputLog();
    const dA = manualDriver({ durationMs: 2000 });
    const dB = manualDriver({ durationMs: 2000 });
    const driverA: Driver = { ...dA, input: () => logA.input };
    const driverB: Driver = { ...dB, input: () => logB.input };

    const pA = play(scene, driverA);
    const pB = play(scene, driverB);

    logA.set(100, pageInputs, INPUT_EVENTS.scroll, 100);
    logA.trigger(100, playerInputs, "click");
    dA.seekMs(200);

    logB.set(100, pageInputs, INPUT_EVENTS.scroll, 500);
    logB.trigger(100, playerInputs, "click");
    logB.trigger(150, playerInputs, "click");
    dB.seekMs(200);

    expect(pA.values).toEqual({ y: 100, px: 0.5, clicks: 1 });
    expect(pB.values).toEqual({ y: 500, px: 0.5, clicks: 2 });
    const foldsAfterInit = stateFolds;

    logA.trigger(300, playerInputs, "click");
    dA.seekMs(400);
    expect(pA.values.clicks).toBe(2);
    expect(pB.values.clicks).toBe(2);
    expect(stateFolds).toBe(foldsAfterInit + 1);
  });

  it("deduplicates player.subscribe notifications with Object.is", () => {
    const clicks = state(0, (n, e) => (e.name === "click" ? n + 1 : n));
    const scene = (t: Time, events: Input) => ({
      clicks: clicks(t, events),
      constant: 42,
    });
    const log = inputLog();
    const md = manualDriver({ durationMs: 2000 });
    const player = play(scene, { ...md, input: () => log.input });

    const seenConst: number[] = [];
    player.subscribe("constant", (v) => seenConst.push(v));

    log.trigger(100, playerInputs, "click");
    md.seekMs(200);
    expect(player.values.clicks).toBe(1);

    log.trigger(400, playerInputs, "click");
    md.seekMs(500);
    expect(player.values.clicks).toBe(2);
    expect(seenConst).toEqual([42]);
  });

  it("announces same-ms bursts and events arriving at current elapsed ms via player.on", () => {
    let now = 500;
    const listeners = new Set<() => void>();
    const log = inputLog();
    const driver: Driver = {
      now: () => liveAt(now),
      input: () => log.input,
      set: (contract, name, value, target) => log.set(now, contract, name, value, target),
      trigger: (contract, name, value, target) => log.trigger(now, contract, name, value, target),
      subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
    };

    const hits: InputEntry[] = [];
    const player = play((_t, _e) => ({ x: 0 }), driver);
    player.on("hit", (event) => hits.push(event));

    log.trigger(500, playerInputs, "hit", 1);
    log.trigger(500, playerInputs, "hit", 2);
    for (const fn of listeners) fn();

    expect(hits.map((e) => e.value)).toEqual([1, 2]);

    now = 600;
    log.trigger(600, playerInputs, "hit", 3);
    for (const fn of listeners) fn();

    expect(hits.map((e) => e.value)).toEqual([1, 2, 3]);
  });
});
