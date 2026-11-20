import { describe, expect, it } from "vitest";
import { UNTIMED, atProgress, span, type Time } from "@gerak/core";

const timed = (progress: number, length = 1000): Time => ({
  progress,
  clock: { kind: "timed", elapsed: progress * length, length },
});

describe("span progress", () => {
  it("maps a stretch onto 0 to 1 and holds outside it", () => {
    const middle = span(250, 750);
    expect(middle.of(timed(0.1)).progress).toBe(0);
    expect(middle.of(timed(0.5)).progress).toBe(0.5);
    expect(middle.of(timed(0.9)).progress).toBe(1);
  });

  it("steps at the start when it has no length", () => {
    expect(span(500, 500).of(timed(0.4)).progress).toBe(0);
    expect(span(500, 500).of(timed(0.5)).progress).toBe(1);
  });
});

describe("span clock", () => {
  it("refuses an untimed clock, which has no ms to place", () => {
    expect(() => span(250, 750).of(atProgress(0.5))).toThrow(RangeError);
    expect(UNTIMED.kind).toBe("untimed");
  });

  it("cuts a timed clock to the stretch", () => {
    expect(span(250, 750).of(timed(0.5))).toEqual({
      progress: 0.5,
      clock: { kind: "timed", elapsed: 250, length: 500 },
    });
  });

  it("holds a timed clock at the stretch edges", () => {
    expect(span(250, 750).of(timed(0.1)).clock).toEqual({ kind: "timed", elapsed: 0, length: 500 });
    expect(span(250, 750).of(timed(0.9)).clock).toEqual({
      kind: "timed",
      elapsed: 500,
      length: 500,
    });
  });
});

describe("Time", () => {
  it("lets a reader take elapsed only from a timed clock", () => {
    const time: Time = atProgress(0.5);
    // @ts-expect-error `elapsed` exists only after switching on `clock.kind`.
    expect(time.clock.elapsed).toBeUndefined();
  });
});
