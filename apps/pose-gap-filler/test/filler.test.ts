import { describe, expect, it } from "vitest";
import { RollingMedian, createBoneLengthEstimator } from "../src/filler/bone-length";
import { createGapFiller, type FillerSpec } from "../src/filler/gap-filler";
import { JOINTS } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { STANDING, frameOf, trustedOf, without } from "./frames";

describe("filler factory and bone lengths", () => {
  it("GF-4 builds raw from the one factory and refuses a spec it does not name", () => {
    const raw = createGapFiller({ kind: "raw" });
    const frame = trustedOf(
      frameOf({ "left-shoulder": [1, 2], "left-elbow": [3, 4] }, 40, undefined, {
        "left-elbow": 0.1,
      }),
      ["left-shoulder"],
    );
    const filled = raw.fill(frame);
    expect(filled.tMs).toBe(40);
    // Raw is the reference: a measurement is presented whether or not it is trusted.
    expect(filled.joints["left-shoulder"]).toEqual({ kind: "measured", position: [1, 2] });
    expect(filled.joints["left-elbow"]).toEqual({ kind: "measured", position: [3, 4] });
    for (const joint of JOINTS.filter((j) => j !== "left-shoulder" && j !== "left-elbow"))
      expect(filled.joints[joint]).toEqual({ kind: "lost" });
    const unknown = { kind: "kalman" } as unknown as FillerSpec;
    expect(() => createGapFiller(unknown)).toThrow(/Unhandled filler spec/);
  });

  it("GF-5 takes a bounded median over trusted samples only", () => {
    expect(() => createBoneLengthEstimator(0)).toThrow(/positive integer/);
    const rolling = new RollingMedian(4);
    expect(rolling.value()).toBeUndefined();
    for (const sample of [3, 1, 2]) rolling.push(sample);
    expect(rolling.value()).toBe(2);
    rolling.push(4);
    expect(rolling.value()).toBe(2.5);
    // A full window evicts by arrival, not by rank: 3 leaves, the window is 1, 2, 4, 1.
    rolling.push(1);
    expect(rolling.value()).toBe(1.5);
    const estimator = createBoneLengthEstimator(3);
    expect(estimator.length("left-upper-arm")).toBeUndefined();
    for (const [index, length] of [100, 102, 400, 98, 101].entries())
      estimator.observe(
        trustedOf(frameOf({ "left-shoulder": [0, 0], "left-elbow": [0, length] }, index * 33)),
      );
    // The window holds 400, 98 and 101: the outlier the median ignores is still inside it.
    expect(estimator.length("left-upper-arm")).toBe(101);
    // A bone with an untrusted endpoint adds no sample.
    estimator.observe(
      trustedOf(frameOf({ "left-shoulder": [0, 0], "left-elbow": [0, 900] }, 200), ["left-elbow"]),
    );
    expect(estimator.length("left-upper-arm")).toBe(101);
    expect(estimator.length("left-forearm")).toBeUndefined();
    estimator.reset();
    expect(estimator.length("left-upper-arm")).toBeUndefined();
  });

  it("GF-9 composes trust, lengths and fill: an absent joint is a gap and adds no length", () => {
    const pipeline = createGapPipeline({ filler: { kind: "raw" }, lengthWindow: 5 });
    const { trusted, filled } = pipeline.step(frameOf(without(STANDING, "left-elbow"), 7));
    expect(trusted.trust["left-elbow"]).toEqual({ kind: "gap", reason: "absent" });
    expect(trusted.trust["left-shoulder"]).toEqual({
      kind: "trusted",
      position: STANDING["left-shoulder"],
      visibility: 1,
    });
    expect(filled.tMs).toBe(7);
    expect(filled.joints["left-elbow"]).toEqual({ kind: "lost" });
    expect(filled.joints["left-wrist"]).toEqual({
      kind: "measured",
      position: STANDING["left-wrist"],
    });
    // Lengths are observed before the fill, from trusted endpoints only.
    expect(pipeline.lengths.length("left-upper-arm")).toBeUndefined();
    expect(pipeline.lengths.length("right-upper-arm")).toBeCloseTo(Math.hypot(40, 70), 9);
    pipeline.reset();
    expect(pipeline.lengths.length("right-upper-arm")).toBeUndefined();
  });
});
