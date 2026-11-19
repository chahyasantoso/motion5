import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ease,
  keyframes,
  mixPose,
  taper,
  type Curve,
  type Ease,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { definePart, noise1d, partContract, squashed } from "../src";

describe("definePart", () => {
  it("returns the function itself and records its contract under it", () => {
    const half = (progress: number): number => progress / 2;
    const same = definePart({ kind: "envelope", samples: [{ run: half, at0: 0, at1: 0.5 }] }, half);
    expect(same).toBe(half);
    expect(partContract(half)?.kind).toBe("envelope");
  });

  it("answers nothing for a function that was never declared", () => {
    expect(partContract(() => 0)).toBeUndefined();
  });

  it("holds the contracts of the library's parts", () => {
    expect(partContract(squashed)?.kind).toBe("coupling");
    expect(partContract(noise1d)?.kind).toBe("signal");
  });

  it("holds no contract for a core primitive", () => {
    for (const primitive of [taper, mixPose, keyframes, ease])
      expect(partContract(primitive)).toBeUndefined();
  });
});

describe("a declared part keeps its type", () => {
  it("taper, mixPose, keyframes and ease are as they were declared", () => {
    expectTypeOf(taper).toEqualTypeOf<(options: { readonly power: number }) => Curve>();
    expectTypeOf(mixPose).toEqualTypeOf<(from: Pose2d, to: Pose2d, share: number) => Pose2d>();
    expectTypeOf(keyframes).toBeFunction();
    const moved: (time: Time) => number = keyframes(0, [], (from) => from);
    expect(moved).toBeTypeOf("function");
    const curve: Ease = ease.cubicOut;
    expect(curve(1)).toBe(1);
  });
});
