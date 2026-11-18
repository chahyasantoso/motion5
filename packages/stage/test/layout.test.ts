import { isMotionEvent, mergeEvents, type MotionEvent } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_FRAME,
  NO_REST_READER,
  ZERO_BOX,
  compileStage,
  defineStage,
  evaluateFrame,
  restReader,
  type Box,
  type LayoutSpec,
} from "../src";
import { createCarry } from "../src/layout/index";

const ROW_REST = {
  card: { x: 100, y: 100, width: 200, height: 100 },
  slotA: { x: 100, y: 100, width: 200, height: 100 },
  slotB: { x: 500, y: 200, width: 100, height: 50 },
};

const WIDE_REST = {
  card: { x: 300, y: 200, width: 400, height: 200 },
  slotA: { x: 500, y: 200, width: 100, height: 50 },
  slotB: { x: 100, y: 100, width: 200, height: 100 },
};

function ev(name: string, at: number, target?: string): MotionEvent {
  return target === undefined ? { name, at } : { name, at, target };
}

function makeLayoutSpec(): LayoutSpec<"row" | "wide"> {
  return {
    kind: "multi",
    names: ["row", "wide"],
    pick: (events) => {
      const toggles = events.filter((entry) => entry.name === "flip").length;
      return toggles % 2 === 0 ? "row" : "wide";
    },
    rests: { row: ROW_REST, wide: WIDE_REST },
  };
}

describe("layout, restReader, and createCarry", () => {
  it("provides ZERO_BOX and prototype-safe RestReader lookup", () => {
    expect(DEFAULT_FRAME).toEqual({ width: 1280, height: 720 });
    expect(NO_REST_READER.keys()).toEqual([]);
    expect(NO_REST_READER.has("missing")).toBe(false);
    expect(NO_REST_READER.get("missing")).toEqual(ZERO_BOX);

    const reader = restReader(ROW_REST);
    expect(reader.has("card")).toBe(true);
    expect(reader.has("toString")).toBe(false);
    expect(reader.get("toString")).toEqual(ZERO_BOX);
    expect(reader.get("card")).toEqual(ROW_REST.card);
  });

  it("carries position and size smoothly in scale, keep, and clip modes and handles interruption deterministically", () => {
    const spec = makeLayoutSpec();
    const readers = { row: restReader(ROW_REST), wide: restReader(WIDE_REST) };
    const events = mergeEvents([ev("flip", 200), ev("flip", 400)]);

    // At t = 300ms (25% through 400ms first flip from row to wide), only flip@200 happened.
    const quarter = createCarry(spec, readers.wide, readers, events, {
      progress: 0.3,
      clock: { kind: "timed", elapsed: 300, length: 1000 },
    });
    const scaleMid = quarter("card", { ms: 400, mode: "scale" });
    expect(scaleMid.x).toBe(-150);
    expect(scaleMid.y).toBe(-75);
    expect(scaleMid.scaleX).toBe(0.625);
    expect(scaleMid.scaleY).toBe(0.625);

    const keepMid = quarter("card", { ms: 400, mode: "keep" });
    expect(keepMid.x).toBe(-150);
    expect(keepMid.y).toBe(-75);
    expect(keepMid.scaleX).toBeUndefined();

    const clipReader = restReader(WIDE_REST);
    const clipQuarter = createCarry(spec, clipReader, readers, mergeEvents([ev("flip", 200)]), {
      progress: 0.3,
      clock: { kind: "timed", elapsed: 300, length: 1000 },
    });
    const clipPose = clipQuarter("card", { ms: 400, mode: "clip" });
    expect(clipPose.clipWidth).toBe(250);
    expect(clipPose.clipHeight).toBe(125);
    expect(clipPose.clipX).toBe(200);
    expect(clipPose.clipY).toBe(100);

    // At t = 400ms (50% of 400ms carry, at x=200, w=300), the second flip reverses back to row.
    // At t = 600ms (50% of reverse carry), drawn is halfway between (200, 300) and (100, 200) -> x=150, w=250.
    const interrupted = createCarry(spec, readers.row, readers, events, {
      progress: 0.6,
      clock: { kind: "timed", elapsed: 600, length: 1000 },
    });
    const backMid = interrupted("card", { ms: 400, mode: "scale" });
    expect(backMid.x).toBe(50);
    expect(backMid.scaleX).toBe(1.25);

    // Seeking deterministically back to t = 300ms matches the earlier sample identically.
    const resampled = createCarry(spec, readers.wide, readers, events, {
      progress: 0.3,
      clock: { kind: "timed", elapsed: 300, length: 1000 },
    })("card", { ms: 400, mode: "scale" });
    expect(resampled).toEqual(scaleMid);
  });

  it("supports custom target resolvers and rejects non-positive carry durations", () => {
    const spec = makeLayoutSpec();
    const readers = { row: restReader(ROW_REST), wide: restReader(WIDE_REST) };
    const events = mergeEvents([ev("flip", 100)]);
    const carry = createCarry(spec, readers.wide, readers, events, {
      progress: 0.2,
      clock: { kind: "timed", elapsed: 200, length: 1000 },
    });
    const reordered = carry("slotA", {
      ms: 200,
      target: (past, reader): Box =>
        reader.get(past.some((item) => item.name === "flip") ? "slotB" : "slotA"),
    });
    expect(reordered.x).toBe(-400);
    expect(reordered.y).toBe(-100);
    expect(() => carry("card", { ms: 0 })).toThrow(RangeError);
  });

  it("wires stage-level multi-layout selection and carry through evaluateFrame", () => {
    const def = defineStage({
      beats: { whole: [0, 1000] },
      cast: (m) => ({ card: m.box() }),
      layouts: {
        names: ["row", "wide"],
        pick: (events) => (events.some((entry) => entry.name === "wide") ? "wide" : "row"),
        rests: {
          row: { card: ROW_REST.card },
          wide: { card: WIDE_REST.card },
        },
      },
      scene: ({ carry }) => ({ card: carry("card", { ms: 200 }) }),
    });
    const compiled = compileStage(def);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const frame = evaluateFrame(compiled.stage, {
      time: { progress: 0.3, clock: { kind: "timed", elapsed: 300, length: 1000 } },
      events: mergeEvents([{ name: "wide", at: 200 }].filter(isMotionEvent)),
    });
    expect(frame.ok).toBe(true);
    if (!frame.ok) return;
    expect(frame.layout).toBe("wide");
    expect(frame.poses.card).toEqual({ x: -100, y: -50, scaleX: 0.75, scaleY: 0.75 });
  });
});
