import { describe, expect, it } from "vitest";
import { atProgress, liveAt, sequence, span, type Time } from "@gerak/moves";

const at = (elapsed: number): Time => ({
  progress: elapsed / 3000,
  clock: { kind: "timed", elapsed, length: 3000 },
});

const tag =
  (name: string) =>
  (time: Time): string =>
    `${name}@${Math.round(time.progress * 100)}`;

describe("sequence", () => {
  const phases = [
    [span(500, 1000), tag("a")],
    [span(1200, 1600), tag("b")],
    [span(2000, 2400), tag("c")],
  ] as const;
  const play = (ms: number): string => sequence(at(ms), phases);

  it("answers the first phase at its start before it begins", () => {
    expect(play(0)).toBe("a@0");
    expect(play(499)).toBe("a@0");
  });

  it("answers each phase inside itself", () => {
    expect(play(750)).toBe("a@50");
    expect(play(1400)).toBe("b@50");
    expect(play(2200)).toBe("c@50");
  });

  it("holds the last phase that ended through a gap and after the end", () => {
    expect(play(1100)).toBe("a@100");
    expect(play(1800)).toBe("b@100");
    expect(play(3000)).toBe("c@100");
  });

  it("lets a later phase that overlaps an earlier one win once it starts", () => {
    const overlapping = [
      [span(0, 1000), tag("a")],
      [span(600, 1400), tag("b")],
    ] as const;
    expect(sequence(at(500), overlapping)).toBe("a@50");
    expect(sequence(at(600), overlapping)).toBe("b@0");
    expect(sequence(at(1000), overlapping)).toBe("b@50");
  });

  it("switches whole records between beats each written from 0", () => {
    const rise = (time: Time) => ({
      card: { y: 100 - 100 * time.progress },
      label: { opacity: 0 },
    });
    const show = (time: Time) => ({ card: { y: 0 }, label: { opacity: time.progress } });
    const beats = [
      [span(0, 1000), (time: Time) => rise(span(0, 1000).of(time))],
      [span(1000, 2000), (time: Time) => show(span(0, 500).of(time))],
    ] as const;
    expect(sequence(at(500), beats)).toEqual({ card: { y: 50 }, label: { opacity: 0 } });
    expect(sequence(at(1250), beats)).toEqual({ card: { y: 0 }, label: { opacity: 0.5 } });
  });

  it("refuses an empty list", () => {
    expect(() => sequence(at(0), [])).toThrow(RangeError);
  });

  it("refuses a time with no clock in ms", () => {
    expect(() => sequence(atProgress(0.5), phases)).toThrow(/length/);
  });

  it("answers the phase that started last, whatever the list order, and follows a live clock", () => {
    const phases = [
      [span(500, 600), () => "late"],
      [span(0, 100), () => "early"],
    ] as const;
    expect(sequence(liveAt(1000), phases)).toBe("late");
    expect(sequence(liveAt(200), phases)).toBe("early");
  });

  it("carries an ease on a timed time into a span taken inside it", () => {
    const outer = span(0, 3000);
    const eased = outer.of(
      { progress: 0.5, clock: { kind: "timed", elapsed: 1500, length: 3000 } },
      (x) => x * x,
    );
    expect(span(0, 3000).of(eased).progress).toBeCloseTo(0.25);
    expect(() => span(300, 100)).toThrow(RangeError);
    expect(() => span(Number.NaN, 5)).toThrow(RangeError);
  });
});
