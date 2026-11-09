import { describe, expect, it } from "vitest";
import { UNTIMED, atProgress, window, windowed, type Time } from "@motion5/moves";

describe("windowed", () => {
  it("maps a window onto 0 to 1 and holds outside it", () => {
    expect(windowed(0.1, 0.25, 0.75)).toBe(0);
    expect(windowed(0.5, 0.25, 0.75)).toBe(0.5);
    expect(windowed(0.9, 0.25, 0.75)).toBe(1);
  });

  it("steps at the window when it has no length", () => {
    expect(windowed(0.4, 0.5, 0.5)).toBe(0);
    expect(windowed(0.5, 0.5, 0.5)).toBe(1);
  });
});

describe("window", () => {
  it("keeps an untimed clock untimed", () => {
    expect(window(atProgress(0.5), 0.25, 0.75)).toEqual({ progress: 0.5, clock: UNTIMED });
  });

  it("cuts a timed clock to the window", () => {
    const time: Time = { progress: 0.5, clock: { kind: "timed", elapsed: 500, length: 1000 } };
    expect(window(time, 0.25, 0.75)).toEqual({
      progress: 0.5,
      clock: { kind: "timed", elapsed: 250, length: 500 },
    });
  });

  it("holds a timed clock at the window's edges", () => {
    const before: Time = { progress: 0.1, clock: { kind: "timed", elapsed: 100, length: 1000 } };
    const after: Time = { progress: 0.9, clock: { kind: "timed", elapsed: 900, length: 1000 } };
    expect(window(before, 0.25, 0.75).clock).toEqual({ kind: "timed", elapsed: 0, length: 500 });
    expect(window(after, 0.25, 0.75).clock).toEqual({ kind: "timed", elapsed: 500, length: 500 });
  });
});

describe("Time", () => {
  it("lets a reader take elapsed only from a timed clock", () => {
    const time: Time = atProgress(0.5);
    // @ts-expect-error `elapsed` exists only after switching on `clock.kind`.
    expect(time.clock.elapsed).toBeUndefined();
  });
});
