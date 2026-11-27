import { mergeInput, type Input, type InputEntry, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { restReader, type Box, type RestAt } from "../src";
import { carryFor } from "../src/run/carry";

const ROW = restReader({
  card: { x: 100, y: 100, width: 200, height: 100 },
  slotA: { x: 100, y: 100, width: 200, height: 100 },
  slotB: { x: 500, y: 200, width: 100, height: 50 },
});
const WIDE = restReader({
  card: { x: 300, y: 200, width: 400, height: 200 },
  slotA: { x: 500, y: 200, width: 100, height: 50 },
  slotB: { x: 100, y: 100, width: 200, height: 100 },
});
const flip = (at: number): InputEntry => ({ kind: "trigger", name: "flip", at, value: 1 });
const time = (ms: number): Time => ({
  progress: ms / 1000,
  clock: { kind: "timed", elapsed: ms, length: 1000 },
});

describe("carry", () => {
  it("carries position and size in scale, keep and clip modes", () => {
    const measures: readonly RestAt[] = [
      { at: 0, rest: ROW },
      { at: 200, rest: WIDE },
    ];
    const quarter = carryFor(WIDE, measures, [], time(300));
    expect(quarter("card", { ms: 400, mode: "scale" })).toEqual({
      x: -150,
      y: -75,
      scaleX: 0.625,
      scaleY: 0.625,
    });
    expect(quarter("card", { ms: 400, mode: "keep" })).toEqual({ x: -150, y: -75 });
    const clip = carryFor(WIDE, measures, [], time(300))("card", { ms: 400, mode: "clip" });
    expect(clip).toMatchObject({ clipWidth: 250, clipHeight: 125, clipX: 200, clipY: 100 });
  });

  it("turns back mid-flight from where it is, and seeks to the same pose", () => {
    const measures: readonly RestAt[] = [
      { at: 0, rest: ROW },
      { at: 200, rest: WIDE },
      { at: 400, rest: ROW },
    ];
    const back = carryFor(ROW, measures, [], time(600))("card", { ms: 400 });
    expect(back.x).toBe(50);
    expect(back.scaleX).toBe(1.25);
    const again = carryFor(WIDE, measures.slice(0, 2), [], time(300))("card", { ms: 400 });
    expect(again).toEqual(carryFor(WIDE, measures.slice(0, 2), [], time(300))("card", { ms: 400 }));
  });

  it("follows a target box of the author's choosing and refuses a length of 0", () => {
    const measures: readonly RestAt[] = [{ at: 0, rest: WIDE }];
    const carry = carryFor(WIDE, measures, mergeInput([flip(100)]), time(200));
    const target = (past: Input, reader: { get(name: string): Box }): Box =>
      reader.get(past.some(({ name }) => name === "flip") ? "slotB" : "slotA");
    expect(carry("slotA", { ms: 200, target })).toMatchObject({ x: -200, y: -50 });
    expect(() => carry("card", { ms: 0 })).toThrow(RangeError);
  });
});
