import { describe, expect, it } from "vitest";
import { inputLog, inputs, liveAt, triggers, watchClock, watchedTime } from "@gerak/core";
import { noise1d, react } from "../src/index";

const hits = inputs({
  values: { noise: {} },
  triggers: { land: {}, hit: {}, noise: {} },
});

describe("react stillMoving and stateless noise1d", () => {
  it("keeps calling stillMoving until reaction settles and handles large logs via binary search", () => {
    const log = inputLog();
    for (let i = 0; i < 10_000; i += 1) {
      log.trigger(i * 10, hits, "noise");
    }
    log.trigger(100_050, hits, "land");
    const recoil = react(triggers(hits, "land"), { kind: "recoil", amplitude: 10 });

    const during: string[] = [];
    const mid = watchClock(
      (u) => during.push(u),
      () => recoil(liveAt(100_100), log.input),
    );
    expect(mid).not.toBe(0);
    expect(during).toEqual(["time"]);

    const settled: string[] = [];
    const done = watchClock(
      (u) => settled.push(u),
      () => recoil(liveAt(102_000), log.input),
    );
    expect(done).toBe(0);
    expect(settled).toEqual([]);
  });

  it("evaluates noise1d deterministically in O(1) memory across arbitrary positions", () => {
    const n = noise1d(7, 250);
    const v1 = n(1234.5);
    const v2 = n(-987654.3);
    expect(n(1234.5)).toBe(v1);
    expect(n(-987654.3)).toBe(v2);
    expect(v1).toBeGreaterThanOrEqual(-1);
    expect(v1).toBeLessThanOrEqual(1);
  });

  it("unwraps watchedTime when settled and preserves shake phase across window aging", () => {
    const log = inputLog();
    log.trigger(100, hits, "hit");
    const shake = react(triggers(hits, "hit"), { kind: "shake", amplitude: 10, decay: 6 });

    const settledUses: string[] = [];
    watchClock(
      (u) => settledUses.push(u),
      () => shake(watchedTime(liveAt(5000)), log.input),
    );
    expect(settledUses).toEqual([]);

    // Two close hits: when hit #0 ages past quietMs (~1151ms), hit #1 must keep its phase seed instead of snapping.
    const shakeLog = inputLog();
    shakeLog.trigger(0, hits, "hit");
    shakeLog.trigger(1000, hits, "hit");
    const s = react(triggers(hits, "hit"), {
      kind: "shake",
      amplitude: 10,
      decay: 6,
      frequency: 4,
    });
    const justBeforeExpire = s(liveAt(1150), shakeLog.input);
    const justAfterExpire = s(liveAt(1155), shakeLog.input);
    // Contribution from expiring hit#0 at t=1150 is < 0.015; phase snap of hit#1 from seed=1 to seed=0 would jump > 1.
    expect(Math.abs(justAfterExpire - justBeforeExpire)).toBeLessThan(0.5);
  });

  it("loses no motion for triggers inside the window when an inputLog drops older entries", () => {
    const dropping = inputLog({ windowMs: 4000 });
    const full = inputLog();
    const shake = react(triggers(hits, "hit"), {
      kind: "shake",
      amplitude: 10,
      decay: 6,
      frequency: 4,
    });

    for (let frame = 0; frame <= 20 * 60; frame += 1) {
      const at = Math.round((frame * 1000) / 60);
      dropping.set(at, hits, "noise", frame);
      full.set(at, hits, "noise", frame);
      if (frame % 60 === 0 && frame > 0) {
        dropping.trigger(at, hits, "hit");
        full.trigger(at, hits, "hit");
      }
      if (at >= 16_000) {
        expect(shake(liveAt(at), dropping.input)).toBeCloseTo(shake(liveAt(at), full.input), 9);
      }
    }
    expect(dropping.input.length).toBeLessThan(full.input.length);
  });
});
