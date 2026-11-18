import { describe, expect, it } from "vitest";
import { compileBeats, presentAt } from "../src";

describe("beats", () => {
  it("compiles ordered beat spans and derives durationMs", () => {
    const result = compileBeats({
      intro: [0, 300],
      milestone: [300, 300],
      main: [300, 900],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.beats.order).toEqual(["intro", "milestone", "main"]);
    expect(result.beats.durationMs).toBe(900);
    expect(result.beats.intro).toMatchObject({ from: 0, to: 300 });
    expect(result.beats.milestone).toMatchObject({ from: 300, to: 300 });
    expect(result.beats.main).toMatchObject({ from: 300, to: 900 });
    expect(Object.isFrozen(result.beats)).toBe(true);
  });

  it("supports explicit durationMs beyond the final beat for trailing holds", () => {
    const result = compileBeats({ intro: [0, 400] }, 1000);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.beats.durationMs).toBe(1000);
  });

  it("rejects invalid beat shapes, bounds, reserved names, and overrun durations", () => {
    const reserved = compileBeats({ durationMs: [0, 100] });
    expect(reserved).toEqual({
      ok: false,
      field: "beats",
      reason: 'beat name "durationMs" is reserved by CompiledBeats.',
    });

    const reversed = compileBeats({ bad: [400, 200] });
    expect(reversed.ok).toBe(false);

    const negative = compileBeats({ bad: [-10, 100] });
    expect(negative.ok).toBe(false);

    const zeroTotal = compileBeats({ empty: [0, 0] });
    expect(zeroTotal.ok).toBe(false);

    const badDuration = compileBeats({ intro: [0, 200] }, 0);
    expect(badDuration).toMatchObject({ ok: false, field: "durationMs" });

    const overrun = compileBeats({ intro: [0, 500] }, 300);
    expect(overrun.ok).toBe(false);
  });

  it("determines stretch visibility and holds past durationMs only when reaching durationMs", () => {
    const result = compileBeats({ a: [0, 200], b: [400, 700] }, 700);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const spanOf = (name: string) =>
      result.beats.order.includes(name)
        ? result.beats[name as keyof typeof result.beats & ("a" | "b")]
        : undefined;

    expect(presentAt([["a", "a"]], spanOf, result.beats.durationMs, 0)).toBe(true);
    expect(presentAt([["a", "a"]], spanOf, result.beats.durationMs, 200)).toBe(true);
    expect(presentAt([["a", "a"]], spanOf, result.beats.durationMs, 250)).toBe(false);
    expect(presentAt([["b", "b"]], spanOf, result.beats.durationMs, 750)).toBe(true);
  });
});
