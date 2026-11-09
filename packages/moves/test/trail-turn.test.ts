import { describe, expect, it } from "vitest";
import { elapsedOf, liveAt, trail, trailTurn, type Pose3d, type Time } from "@motion5/moves";

const ms = (time: Time) => elapsedOf(time.clock) ?? 0;
const stepTo =
  (from: number, to: number) =>
  (time: Time): Pose3d => ({ rotationY: ms(time) < 500 ? from : to });

describe("trailTurn", () => {
  it("sits on a turn that never moves", () => {
    const still = trailTurn(() => ({ rotation: 20, rotationX: 30, rotationY: 40 }), {});
    expect(still(liveAt(1200), [])).toEqual({ rotation: 20, rotationX: 30, rotationY: 40 });
  });

  it("lags a step turn, then rests exactly on it", () => {
    const tail = trailTurn(stepTo(0, 170), { damping: 20 });
    const early = tail(liveAt(540), []).rotationY ?? 0;
    expect(early).toBeGreaterThan(0);
    expect(early).toBeLessThan(170);
    expect(tail(liveAt(3500), [])).toEqual({ rotationY: 170 });
  });

  it("goes the short way round from 170 to -170", () => {
    const tail = trailTurn(stepTo(170, -170), { damping: 20 });
    for (let at = 500; at < 2000; at += 50)
      expect(Math.abs(tail(liveAt(at), []).rotationY ?? 0)).toBeGreaterThan(165);
  });

  it("follows a stiff spring on one axis as trail does, with no wrong-way swing", () => {
    const at = (time: Time) => (ms(time) > 100 ? 90 : 0);
    const options = { stiffness: 2000, damping: 100, stepMs: 33 };
    const turn = trailTurn((time) => ({ rotationY: at(time) }), options);
    const value = trail(at, options);
    for (const t of [120, 166, 200, 300, 500])
      expect(Math.abs((turn(liveAt(t), []).rotationY ?? 0) - value(liveAt(t), []))).toBeLessThan(3);
  });

  it("gives the same value whatever order frames are asked in", () => {
    const tail = trailTurn(stepTo(0, 90), { damping: 12 });
    const late = tail(liveAt(900), []);
    const early = tail(liveAt(600), []);
    const fresh = trailTurn(stepTo(0, 90), { damping: 12 });
    expect(fresh(liveAt(600), [])).toEqual(early);
    expect(fresh(liveAt(900), [])).toEqual(late);
  });

  it("costs the same at an hour as at ten seconds", () => {
    let calls = 0;
    const counted = (time: Time): Pose3d => {
      calls += 1;
      return { rotationX: Math.sin(ms(time) / 300) * 40 };
    };
    const tail = trailTurn(counted, { damping: 12 });
    tail(liveAt(10_000), []);
    const atTen = calls;
    calls = 0;
    tail(liveAt(3_600_000), []);
    expect(Math.abs(calls - atTen)).toBeLessThanOrEqual(1);
  });
});
