import { describe, expect, it } from "vitest";
import { atProgress, defineMove, type Time } from "@gerak/moves";

const slide = defineMove({
  role: "enter",
  example: { options: { distance: 100 } },
  id: "slide",
  description: "Slides along x.",
  options: {
    distance: { kind: "number", min: 0, description: "How far, in px." },
    fade: { kind: "boolean", default: false, description: "Fade in on the way." },
    side: {
      kind: "string",
      enum: ["left", "right"],
      default: "left",
      description: "Where it starts.",
    },
  },
  moments: ({ side }) => ({ crossing: side === "left" ? 0.25 : 0.75 }),
  run(options, time: Time) {
    const sign = options.side === "left" ? -1 : 1;
    return {
      x: sign * options.distance * (1 - time.progress),
      ...(options.fade ? { opacity: time.progress } : {}),
    };
  },
});

describe("a move's declaration", () => {
  it("fills defaults for options the caller left out", () => {
    expect(slide({ distance: 10 }, atProgress(0))).toEqual({ x: -10 });
  });

  it("runs on the options it read", () => {
    expect(slide({ distance: 100, side: "right" }, atProgress(0.25))).toEqual({ x: 75 });
  });

  it("states its moments for the options it read, defaults filled", () => {
    expect(slide.moments({ distance: 1 })).toEqual({ crossing: 0.25 });
    expect(slide.moments({ distance: 1, side: "right" }).crossing).toBe(0.75);
    expect(() => slide.moments({ distance: -1 })).toThrow(/slide: option "distance"/);
  });

  it("refuses a missing required option by name", () => {
    // @ts-expect-error `distance` is required.
    expect(() => slide({}, atProgress(0))).toThrow(/slide: option "distance" is required/);
  });

  it("refuses an option of the wrong kind", () => {
    // @ts-expect-error `distance` is a number.
    expect(() => slide({ distance: "far" }, atProgress(0))).toThrow(
      /slide: option "distance" must be a number/,
    );
  });

  it("refuses an option outside its range", () => {
    expect(() => slide({ distance: -1 }, atProgress(0))).toThrow(
      /slide: option "distance" must be at least 0/,
    );
  });

  it("refuses a string outside its enum", () => {
    // @ts-expect-error `side` is one of its enum.
    expect(() => slide({ distance: 1, side: "up" }, atProgress(0))).toThrow(
      /slide: option "side" must be one of left, right/,
    );
  });

  it("ignores keys it does not declare, so a wider record can carry it", () => {
    const wider = { distance: 1, count: 3 };
    expect(slide(wider, atProgress(0))).toEqual({ x: -1 });
  });

  it("refuses a record that is not one", () => {
    // @ts-expect-error options are a record.
    expect(() => slide(undefined, atProgress(0))).toThrow(/slide: options must be a record/);
  });

  it("types options from the declaration", () => {
    // @ts-expect-error `distanse` is not a declared option.
    expect(() => slide({ distanse: 1 }, atProgress(0))).toThrow();
    // @ts-expect-error `distance` is required.
    expect(() => slide({}, atProgress(0))).toThrow();
    // @ts-expect-error `side` is one of its enum.
    expect(() => slide({ distance: 1, side: "up" }, atProgress(0))).toThrow();
  });
});
