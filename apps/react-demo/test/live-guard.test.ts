import { describe, expect, it } from "vitest";
import { elapsedOf, NO_EVENTS, type Time } from "@motion5/moves";
import { manualDriver, play } from "@motion5/player";
import { guard } from "../src/live/guard";

function timed(elapsed: number, length: number): Time {
  return {
    progress: length > 0 ? Math.min(1, elapsed / length) : 0,
    clock: { kind: "timed", elapsed, length },
  };
}

describe("live guard", () => {
  it("keeps returning the last good values after a throw and reports once", () => {
    const reports: string[] = [];
    const scene = (time: Time) => {
      const ms = elapsedOf(time.clock) ?? 0;
      if (ms >= 1000) throw new Error("broken at 1000 ms");
      return { offset: ms };
    };
    const guarded = guard(scene, (message) => reports.push(message));

    const good = guarded(timed(900, 3000), NO_EVENTS);
    expect(good).toEqual({ offset: 900 });
    expect(reports).toHaveLength(0);

    const firstThrow = guarded(timed(1000, 3000), NO_EVENTS);
    expect(firstThrow).toEqual({ offset: 900 });
    expect(reports).toEqual(["broken at 1000 ms"]);

    const secondThrow = guarded(timed(1200, 3000), NO_EVENTS);
    expect(secondThrow).toEqual({ offset: 900 });
    expect(reports).toEqual(["broken at 1000 ms"]);
  });

  it("reports each distinct error message once while retaining last good values", () => {
    const reports: string[] = [];
    let failure = "first error";
    const scene = (time: Time) => {
      const ms = elapsedOf(time.clock) ?? 0;
      if (ms >= 1000) throw new Error(failure);
      return { count: ms };
    };
    const guarded = guard(scene, (message) => reports.push(message));

    guarded(timed(500, 3000), NO_EVENTS);
    guarded(timed(1000, 3000), NO_EVENTS);
    expect(reports).toEqual(["first error"]);

    failure = "second error";
    const afterSecond = guarded(timed(1200, 3000), NO_EVENTS);
    expect(afterSecond).toEqual({ count: 500 });
    expect(reports).toEqual(["first error", "second error"]);

    const afterRepeat = guarded(timed(1300, 3000), NO_EVENTS);
    expect(afterRepeat).toEqual({ count: 500 });
    expect(reports).toEqual(["first error", "second error"]);
  });

  it("re-throws on first frame when no good values exist yet", () => {
    const reports: string[] = [];
    const scene = () => {
      throw new Error("immediate failure without fallback");
    };
    const guarded = guard(scene, (message) => reports.push(message));

    expect(() => guarded(timed(0, 1000), NO_EVENTS)).toThrow("immediate failure without fallback");
    expect(reports).toEqual(["immediate failure without fallback"]);
  });

  it("integrates with player and manualDriver", () => {
    const reports: string[] = [];
    const scene = (time: Time) => {
      const ms = elapsedOf(time.clock) ?? 0;
      if (ms > 500) throw new Error("limit exceeded");
      return { x: ms };
    };
    const driver = manualDriver({ durationMs: 1000 });
    const player = play(
      guard(scene, (msg) => reports.push(msg)),
      driver,
    );

    driver.seek(0.4);
    expect(player.values).toEqual({ x: 400 });

    driver.seek(0.8);
    expect(player.values).toEqual({ x: 400 });
    expect(reports).toEqual(["limit exceeded"]);
  });
});
