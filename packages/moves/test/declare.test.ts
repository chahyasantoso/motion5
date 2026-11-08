import { describe, expect, it } from "vitest";
import { atProgress, defineMove, type Time } from "@motion5/moves";

const slide = defineMove({
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
  inputs: {},
  output: "pose2d",
  extras: {},
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
    expect(slide.read({ distance: 10 })).toEqual({ distance: 10, fade: false, side: "left" });
  });

  it("runs on the options it read", () => {
    expect(slide({ distance: 100, side: "right" }, atProgress(0.25))).toEqual({ x: 75 });
  });

  it("refuses a missing required option by name", () => {
    expect(() => slide.read({})).toThrow(/slide: option "distance" is required/);
  });

  it("refuses an option of the wrong kind", () => {
    expect(() => slide.read({ distance: "far" })).toThrow(
      /slide: option "distance" must be a number/,
    );
  });

  it("refuses an option outside its range", () => {
    expect(() => slide.read({ distance: -1 })).toThrow(
      /slide: option "distance" must be at least 0/,
    );
  });

  it("refuses a string outside its enum", () => {
    expect(() => slide.read({ distance: 1, side: "up" })).toThrow(
      /slide: option "side" must be one of left, right/,
    );
  });

  it("ignores keys it does not declare, so a wider record can carry it", () => {
    expect(slide.read({ distance: 1, count: 3 })).toEqual({
      distance: 1,
      fade: false,
      side: "left",
    });
  });

  it("refuses a record that is not one", () => {
    expect(() => slide.read(undefined)).toThrow(/slide: options must be a record/);
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
