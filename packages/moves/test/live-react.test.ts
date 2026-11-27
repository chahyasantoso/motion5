import { describe, expect, it } from "vitest";
import { eventLog, liveAt, watchClock, watchedTime } from "@gerak/core";
import { noise1d, react } from "../src/index";

describe("react stillMoving and stateless noise1d", () => {
  it("keeps calling stillMoving until reaction settles and handles large logs via binary search", () => {
    const log = eventLog();
    for (let i = 0; i < 10_000; i += 1) {
      log.add({ name: "noise", at: i * 10 });
    }
    log.add({ name: "land", at: 100_050 });
    const recoil = react({ on: ["land"], kind: "recoil", amplitude: 10 });

    const during: string[] = [];
    const mid = watchClock(
      (u) => during.push(u),
      () => recoil(liveAt(100_100), log.events),
    );
    expect(mid).not.toBe(0);
    expect(during).toEqual(["time"]);

    const settled: string[] = [];
    const done = watchClock(
      (u) => settled.push(u),
      () => recoil(liveAt(102_000), log.events),
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
    const log = eventLog();
    log.add({ name: "hit", at: 100 });
    const shake = react({ on: ["hit"], kind: "shake", amplitude: 10, decay: 6 });

    const settledUses: string[] = [];
    watchClock(
      (u) => settledUses.push(u),
      () => shake(watchedTime(liveAt(5000)), log.events),
    );
    expect(settledUses).toEqual([]);

    // Two close hits: when hit #0 ages past quietMs (~1151ms), hit #1 must keep its phase seed instead of snapping.
    const shakeLog = eventLog();
    shakeLog.add({ name: "hit", at: 0 });
    shakeLog.add({ name: "hit", at: 1000 });
    const s = react({ on: ["hit"], kind: "shake", amplitude: 10, decay: 6, frequency: 4 });
    const justBeforeExpire = s(liveAt(1150), shakeLog.events);
    const justAfterExpire = s(liveAt(1155), shakeLog.events);
    // Contribution from expiring hit#0 at t=1150 is < 0.015; phase snap of hit#1 from seed=1 to seed=0 would jump > 1.
    expect(Math.abs(justAfterExpire - justBeforeExpire)).toBeLessThan(0.5);
  });
});
