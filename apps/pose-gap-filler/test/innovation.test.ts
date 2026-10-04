import { describe, expect, it } from "vitest";
import { createGapDetector, NO_FORCED } from "../src/filler/gap-detector";
import type { BoneLengths } from "../src/filler/bone-length";
import { createGapPipeline } from "../src/filler/pipeline";
import { WORLD_SPACE } from "../src/filler/space";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { IMAGE_ONE_EURO, WORLD_ONE_EURO } from "../src/filler/stabilizer";
import { jointRecord, LIMBS } from "../src/filler/landmarks";
import { scale } from "../src/filler/vec";
import { syntheticWorldPose } from "../src/replay/synthetic";
import {
  DEFAULT_INNOVATION,
  innovationStep,
  type InnovationState,
} from "../src/filler/innovation-gate";
import { STANDING, frameOf, without } from "./frames";

const UNKNOWN: BoneLengths = { length: () => undefined };
const known = (length: number): BoneLengths => ({ length: () => length });
const image = (dx: number, t: number) => frameOf({ ...STANDING, "left-wrist": [380 + dx, 280] }, t);

describe("pre-filter innovation rejection", () => {
  it("rejects a high-confidence 60px spike even below the detector speed limit", () => {
    const detector = createGapDetector();
    detector.detect(image(0, 0), NO_FORCED, known(100));
    const spike = detector.detect(image(60, 33), NO_FORCED, known(100));
    expect(spike.trust["left-wrist"].kind).toBe("gap");
    expect(spike.joints["left-wrist"]).toEqual(image(60, 33).joints["left-wrist"]);
    expect(detector.detect(image(0, 66), NO_FORCED, known(100)).trust["left-wrist"].kind).toBe(
      "trusted",
    );
  });

  it("rejects world depth spikes and gates before lengths are learned", () => {
    for (const lengths of [known(300), UNKNOWN]) {
      const detector = createGapDetector();
      detector.detect(frameOf({ "left-wrist": [0, 0, 0] }, 0, WORLD_SPACE), NO_FORCED, lengths);
      const spike = detector.detect(
        frameOf({ "left-wrist": [0, 0, 300] }, 100, WORLD_SPACE),
        NO_FORCED,
        lengths,
      );
      expect(spike.trust["left-wrist"].kind).toBe("gap");
    }
  });

  it("keeps rejected samples out of One Euro, lengths, body state and Chain Kalman", () => {
    const options = {
      filler: { kind: "chain-kalman" as const, noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
      stabilizer: IMAGE_ONE_EURO,
    };
    const control = createGapPipeline(options),
      corrupted = createGapPipeline(options);
    for (const t of [0, 33, 66]) {
      control.step(image(0, t));
      corrupted.step(image(0, t));
    }
    const rejected = corrupted.step(image(60, 99));
    const missing = control.step(frameOf(without(STANDING, "left-wrist"), 99));
    expect(rejected.trusted.trust["left-wrist"].kind).toBe("gap");
    expect(rejected.filled).toEqual(missing.filled);
    expect(corrupted.lengths.length("left-forearm")).toBe(control.lengths.length("left-forearm"));
    expect(corrupted.step(image(0, 132))).toEqual(control.step(image(0, 132)));
  });

  it("accepts coherent motion and recovers a persistent relocation without trusting one spike", () => {
    const detector = createGapDetector();
    for (let n = 0; n < 10; n++)
      expect(
        detector.detect(image(n * 4, n * 33), NO_FORCED, known(100)).trust["left-wrist"].kind,
      ).toBe("trusted");
    expect(detector.detect(image(120, 330), NO_FORCED, known(100)).trust["left-wrist"].kind).toBe(
      "gap",
    );
    expect(detector.detect(image(120, 363), NO_FORCED, known(100)).trust["left-wrist"].kind).toBe(
      "gap",
    );
    expect(detector.detect(image(120, 396), NO_FORCED, known(100)).trust["left-wrist"].kind).toBe(
      "trusted",
    );
    detector.reset();
    expect(detector.detect(image(-500, 0), NO_FORCED, known(100)).trust["left-wrist"].kind).toBe(
      "trusted",
    );
  });

  it("refuses malformed positions and visibility before downstream filters", () => {
    const detector = createGapDetector();
    for (const position of [
      [NaN, 0],
      [Infinity, 0],
      [1, 2, 3],
    ]) {
      const result = detector.detect(frameOf({ "left-wrist": position }, 0), NO_FORCED, UNKNOWN);
      expect(result.trust["left-wrist"].kind).toBe("gap");
      detector.reset();
    }
    expect(
      detector.detect(frameOf(STANDING, 0, undefined, { "left-wrist": NaN }), NO_FORCED, UNKNOWN)
        .trust["left-wrist"].kind,
    ).toBe("gap");
  });

  it("is filler/smoother independent and preserves raw reference semantics on rejection", () => {
    const runs = [
      createGapPipeline({ filler: { kind: "raw" } }),
      createGapPipeline({ filler: { kind: "hold" }, stabilizer: IMAGE_ONE_EURO }),
      createGapPipeline({
        filler: { kind: "chain-kalman", noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
      }),
    ];
    for (const run of runs) run.step(image(0, 0));
    const steps = runs.map((run) => run.step(image(60, 33)));
    for (const step of steps) {
      expect(step.trusted.trust["left-wrist"]).toEqual({ kind: "gap", reason: "gate" });
      expect(step.trusted.rejections?.["left-wrist"]).toMatchObject({
        kind: "outlier",
        reason: "speed",
        candidates: 1,
      });
    }
    expect(steps[0]!.filled.joints["left-wrist"]).toEqual({
      kind: "measured",
      position: [440, 280],
    });
    expect(steps[1]!.filled.joints["left-wrist"].kind).toBe("inferred");
  });

  it("keeps world root outliers out of the body owner and all learned lengths", () => {
    const options = {
      filler: { kind: "chain-kalman" as const, noise: DEFAULT_WORLD_KALMAN_NOISE, coastMs: 500 },
      stabilizer: WORLD_ONE_EURO,
    };
    const a = createGapPipeline(options),
      b = createGapPipeline(options);
    const points = jointRecord((joint) =>
      scale(syntheticWorldPose({ kind: "exercise" }, 400)[joint], 1000),
    );
    for (const t of [0, 33, 66]) {
      a.step(frameOf(points, t, WORLD_SPACE));
      b.step(frameOf(points, t, WORLD_SPACE));
    }
    const bad = {
      ...points,
      "left-shoulder": [
        points["left-shoulder"][0]!,
        points["left-shoulder"][1]!,
        points["left-shoulder"][2]! + 300,
      ],
    };
    const spike = a.step(frameOf(bad, 99, WORLD_SPACE));
    const gap = b.step(frameOf(without(points, "left-shoulder"), 99, WORLD_SPACE));
    expect(spike.trusted.trust["left-shoulder"].kind).toBe("gap");
    expect(spike.filled).toEqual(gap.filled);
    expect(a.step(frameOf(points, 132, WORLD_SPACE)).filled).toEqual(
      b.step(frameOf(points, 132, WORLD_SPACE)).filled,
    );
    for (const limb of LIMBS)
      for (const bone of [limb.upper, limb.lower])
        expect(a.lengths.length(bone)).toBe(b.lengths.length(bone));
  });

  it("does not confirm sporadic outliers across absent frames or long gaps", () => {
    const detector = createGapDetector();
    detector.detect(image(0, 0), NO_FORCED, known(100));
    for (const t of [33, 300, 600]) {
      const result = detector.detect(image(100, t), NO_FORCED, known(100));
      expect(result.trust["left-wrist"].kind).toBe("gap");
      expect(result.rejections?.["left-wrist"]).toMatchObject({ candidates: 1 });
    }
    detector.detect(frameOf(without(STANDING, "left-wrist"), 633), NO_FORCED, known(100));
    expect(
      detector.detect(image(100, 666), NO_FORCED, known(100)).rejections?.["left-wrist"],
    ).toMatchObject({ candidates: 1 });
  });

  it("rejects invalid time/space before mutation and snapshots gate options", () => {
    const options = { ...DEFAULT_INNOVATION };
    const detector = createGapDetector({ threshold: 0.5, gate: 20, innovation: options });
    detector.detect(image(0, 0), NO_FORCED, UNKNOWN);
    for (const time of [0, -1, NaN, Infinity])
      expect(() => detector.detect(image(60, time), NO_FORCED, UNKNOWN)).toThrow(/time/);
    expect(() =>
      detector.detect(frameOf({ "left-wrist": [0, 0, 0] }, 33, WORLD_SPACE), NO_FORCED, UNKNOWN),
    ).toThrow(/space/);
    options.imageFloorPx = 10000;
    expect(detector.detect(image(60, 33), NO_FORCED, UNKNOWN).trust["left-wrist"].kind).toBe("gap");
    expect(detector.detect(image(0, 66), NO_FORCED, UNKNOWN).trust["left-wrist"].kind).toBe(
      "trusted",
    );
  });

  it("consumes per-joint invalid observations as gaps without poisoning accepted processing vectors", () => {
    const detector = createGapDetector();
    const frame = image(0, 0);
    const accepted = detector.detect(frame, NO_FORCED, UNKNOWN);
    const raw = frame.joints["left-wrist"];
    if (raw.kind !== "measured") throw new Error("Expected measurement");
    (raw.position as number[])[0] = 9000;
    expect(accepted.trust["left-wrist"]).toMatchObject({ position: [380, 280] });
    for (const [index, visibility] of [-0.1, 1.01, 2, NaN].entries()) {
      const invalid = detector.detect(
        frameOf(STANDING, 33 * (index + 1), undefined, { "left-wrist": visibility }),
        NO_FORCED,
        UNKNOWN,
      );
      expect(invalid.trust["left-wrist"]).toEqual({ kind: "gap", reason: "invalid" });
      expect(invalid.rejections?.["left-wrist"]).toEqual({ kind: "invalid" });
      expect(invalid.trust["right-wrist"].kind).toBe("trusted");
    }
    // An invalid JOINT is a consumed FRAME, just like an absent joint. Other joints keep moving.
    expect(() => detector.detect(image(0, 132), NO_FORCED, UNKNOWN)).toThrow(/time/);
    expect(detector.detect(image(0, 165), NO_FORCED, UNKNOWN).trust["left-wrist"].kind).toBe(
      "trusted",
    );
  });

  it("validates direct innovation-helper samples before mutating accepted or candidate state", () => {
    const state: InnovationState = {};
    for (const sample of [
      { tMs: NaN, position: [0, 0] },
      { tMs: 0, position: [NaN, 0] },
      { tMs: 0, position: [0, 0, 0] },
    ]) {
      expect(() =>
        innovationStep(state, sample, { kind: "image" }, undefined, false, DEFAULT_INNOVATION),
      ).toThrow();
      expect(state).toEqual({});
    }
    innovationStep(
      state,
      { tMs: 0, position: [0, 0] },
      { kind: "image" },
      undefined,
      false,
      DEFAULT_INNOVATION,
    );
    const saved = structuredClone(state);
    expect(() =>
      innovationStep(
        state,
        { tMs: 0, position: [100, 0] },
        { kind: "image" },
        undefined,
        false,
        DEFAULT_INNOVATION,
      ),
    ).toThrow(/time/);
    expect(state).toEqual(saved);
  });

  it("rejects finite overflowing coordinates before bootstrap or temporal confirmation", () => {
    const run = createGapPipeline({
      filler: { kind: "hold" },
      stabilizer: IMAGE_ONE_EURO,
      detector: { threshold: 0.5, gate: Infinity },
    });
    const state: InnovationState = {};
    for (let n = 0; n < 4; n++) {
      const step = run.step(frameOf({ "left-wrist": [1e308, 0] }, n * 33));
      expect(step.trusted.trust["left-wrist"]).toEqual({ kind: "gap", reason: "invalid" });
      expect(step.filled.joints["left-wrist"].kind).toBe("lost");
      expect(() =>
        innovationStep(
          state,
          { tMs: n * 33, position: [1e308, 0] },
          { kind: "image" },
          undefined,
          false,
          DEFAULT_INNOVATION,
        ),
      ).toThrow(/safe finite/);
      expect(state).toEqual({});
    }
    expect(run.step(image(0, 132)).trusted.trust["left-wrist"].kind).toBe("trusted");
  });
});
