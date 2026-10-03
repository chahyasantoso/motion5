import { describe, expect, it } from "vitest";
import { createGapDetector, NO_FORCED } from "../src/filler/gap-detector";
import type { BoneLengths } from "../src/filler/bone-length";
import { createGapPipeline } from "../src/filler/pipeline";
import { WORLD_SPACE } from "../src/filler/space";
import { DEFAULT_WORLD_KALMAN_NOISE } from "../src/filler/world-chain";
import { IMAGE_ONE_EURO } from "../src/filler/stabilizer";
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
});
