import { describe, expect, it } from "vitest";
import { createBoneLengthEstimator, type BoneLengths } from "../src/filler/bone-length";
import { createGapDetector, jointSpeed, NO_FORCED } from "../src/filler/gap-detector";
import { createGapFiller } from "../src/filler/gap-filler";
import type { JointId } from "../src/filler/landmarks";
import { createGapPipeline } from "../src/filler/pipeline";
import { createForcedJoints } from "../src/live/hotkeys";
import { STANDING, frameOf, trustedOf, without } from "./frames";

/** Every bone 100 units long, so a speed of `n` units per second is `n / 100` bone lengths. */
const HUNDRED: BoneLengths = { length: () => 100 };
const UNKNOWN: BoneLengths = { length: () => undefined };

const moved = (dx: number) => ({
  ...STANDING,
  "left-wrist": [STANDING["left-wrist"][0]! + dx, STANDING["left-wrist"][1]!],
});

describe("gap detector", () => {
  it("GF-17 decides absent, then forced, then low visibility, then the gate", () => {
    // This case isolates the legacy speed gate; innovation is covered independently.
    const detector = createGapDetector({ threshold: 0.5, gate: 10, innovation: false });
    const frame = frameOf(without(STANDING, "left-elbow"), 0, undefined, {
      "left-knee": 0.49,
      "right-knee": 0.5,
      "left-ankle": 0.2,
    });
    const forced = new Set<JointId>(["left-elbow", "left-ankle"]);
    const { trust } = detector.detect(frame, forced, HUNDRED);
    expect(trust["left-elbow"]).toEqual({ kind: "gap", reason: "absent" });
    expect(trust["left-ankle"]).toEqual({ kind: "gap", reason: "forced" });
    expect(trust["left-knee"]).toEqual({ kind: "gap", reason: "low-visibility" });
    expect(trust["right-knee"]).toEqual({
      kind: "trusted",
      position: STANDING["right-knee"],
      visibility: 0.5,
    });
    // 10 bone lengths per second is the gate: 999 units in 1 s passes, 1500 in the next 1 s does not.
    expect(
      detector.detect(frameOf(moved(999), 1000), NO_FORCED, HUNDRED).trust["left-wrist"].kind,
    ).toBe("trusted");
    const jump = detector.detect(frameOf(moved(999 + 1500), 2000), NO_FORCED, HUNDRED);
    expect(jump.trust["left-wrist"]).toEqual({ kind: "gap", reason: "gate" });
    // A gated joint keeps its last trusted sample, so the same position is re-accepted once enough
    // time has passed for the move to be under the gate.
    expect(
      detector.detect(frameOf(moved(999 + 1500), 2100), NO_FORCED, HUNDRED).trust["left-wrist"]
        .kind,
    ).toBe("gap");
    expect(
      detector.detect(frameOf(moved(999 + 1500), 2600), NO_FORCED, HUNDRED).trust["left-wrist"]
        .kind,
    ).toBe("trusted");
    // No length known yet: no scale, so no gate; after reset, no previous sample, so no gate.
    const fresh = createGapDetector({ threshold: 0.5, gate: 10, innovation: false });
    fresh.detect(frameOf(STANDING, 0), NO_FORCED, UNKNOWN);
    expect(fresh.detect(frameOf(moved(5000), 1), NO_FORCED, UNKNOWN).trust["left-wrist"].kind).toBe(
      "trusted",
    );
    fresh.reset();
    expect(
      fresh.detect(frameOf(moved(-5000), 2), NO_FORCED, HUNDRED).trust["left-wrist"].kind,
    ).toBe("trusted");
    expect(jointSpeed({ position: [0, 0], tMs: 5 }, { position: [1, 0], tMs: 5 }, 1)).toBe(
      Infinity,
    );
    expect(jointSpeed({ position: [0, 0], tMs: 5 }, { position: [0, 0], tMs: 5 }, 1)).toBe(0);
    for (const bad of [
      { threshold: 1.1, gate: 1 },
      { threshold: Number.NaN, gate: 1 },
      { threshold: 0.5, gate: 0 },
    ])
      expect(() => createGapDetector(bad)).toThrow(/Gap (threshold|gate)/);
  });

  it("GF-18 is the pipeline's trust owner: low visibility and hotkeys reach the filler as gaps", () => {
    const pipeline = createGapPipeline({ filler: { kind: "hold" } });
    pipeline.step(frameOf(STANDING, 0));
    const dim = pipeline.step(frameOf(STANDING, 33, undefined, { "right-wrist": 0.1 }));
    expect(dim.trusted.trust["right-wrist"]).toEqual({ kind: "gap", reason: "low-visibility" });
    expect(dim.filled.joints["right-wrist"]).toEqual({
      kind: "inferred",
      position: STANDING["right-wrist"],
      sinceMs: 33,
    });
    const keys = createForcedJoints();
    expect(keys.toggle("W")).toBe(true);
    expect(keys.toggle("x")).toBe(false);
    const held = pipeline.step(frameOf(moved(30), 66), keys.joints);
    expect(held.trusted.trust["left-wrist"]).toEqual({ kind: "gap", reason: "forced" });
    expect(held.filled.joints["left-wrist"]).toMatchObject({
      kind: "inferred",
      position: STANDING["left-wrist"],
    });
    // A forced joint adds no length sample: the estimator only reads trusted endpoints.
    expect(pipeline.lengths.length("left-forearm")).toBeCloseTo(Math.hypot(20, 70), 9);
    keys.toggle("w");
    expect(keys.joints.size).toBe(0);
    expect(
      pipeline.step(frameOf(moved(30), 99), keys.joints).trusted.trust["left-wrist"].kind,
    ).toBe("trusted");
  });

  it("GF-19 holds the last trusted position through a gap, from the gap's start, and loses the unseen", () => {
    const hold = createGapFiller({ kind: "hold" });
    const first = hold.fill(trustedOf(frameOf(STANDING, 0), ["left-knee"]));
    expect(first.joints["left-knee"]).toEqual({ kind: "lost" });
    expect(first.joints["left-wrist"]).toEqual({
      kind: "measured",
      position: STANDING["left-wrist"],
    });
    for (const tMs of [33, 66, 99]) {
      const gap = hold.fill(trustedOf(frameOf(moved(50), tMs), ["left-wrist"]));
      expect(gap.joints["left-wrist"]).toEqual({
        kind: "inferred",
        position: STANDING["left-wrist"],
        sinceMs: 33,
      });
    }
    const back = hold.fill(trustedOf(frameOf(moved(50), 132)));
    expect(back.joints["left-wrist"]).toEqual({
      kind: "measured",
      position: moved(50)["left-wrist"],
    });
    // A new gap starts its own clock.
    expect(
      hold.fill(trustedOf(frameOf(STANDING, 165), ["left-wrist"])).joints["left-wrist"],
    ).toMatchObject({
      sinceMs: 165,
    });
    hold.reset();
    expect(
      hold.fill(trustedOf(frameOf(STANDING, 198), ["left-wrist"])).joints["left-wrist"],
    ).toEqual({
      kind: "lost",
    });
    // The estimator is untouched by the filler: it has its own owner.
    expect(createBoneLengthEstimator().length("left-forearm")).toBeUndefined();
  });
});
