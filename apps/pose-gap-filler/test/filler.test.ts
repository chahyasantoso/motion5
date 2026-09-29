import { describe, expect, it } from "vitest";
import { createBoneLengthEstimator, median } from "../src/filler/bone-length";
import { createGapFiller, type FillerSpec } from "../src/filler/gap-filler";
import { JOINTS } from "../src/filler/landmarks";
import { frameOf, trustedOf } from "./support";

describe("filler factory and bone lengths", () => {
  it("GF-4 builds raw from the one factory and refuses a spec it does not name", () => {
    const lengths = createBoneLengthEstimator();
    const raw = createGapFiller({ kind: "raw" }, { lengths });
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
    expect(() => createGapFiller(unknown, { lengths })).toThrow(/Unhandled filler spec/);
  });

  it("GF-5 takes a bounded median over trusted samples only", () => {
    expect(() => createBoneLengthEstimator(0)).toThrow(/positive integer/);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
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
});
