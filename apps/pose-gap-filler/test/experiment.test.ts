import { describe, expect, it } from "vitest";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";
import { stabilizerFor } from "../src/filler/stabilizer";
import { calibrateDetector, calibrateSpaces } from "../src/replay/compare";
import { createExperiment } from "../src/live/experiment";
import { createSyntheticRecording } from "../src/replay/synthetic";

const STILL = createSyntheticRecording({
  motion: { kind: "still" },
  seed: 3,
  durationMs: 1000,
  fps: 30,
});

describe("live calibration composition", () => {
  it("GF-31 shares calibrated settings with live and replay and preserves state on failure", () => {
    const experiment = createExperiment();
    const before = experiment.pipeline;
    const result = experiment.calibrate(STILL);
    expect(experiment.calibrations).toEqual(result);
    expect(experiment.calibration).toEqual(result.image);
    expect(experiment.pipeline).not.toBe(before);
    const calibrated = experiment.pipeline;
    expect(() => experiment.calibrate({ ...STILL, frames: [] })).toThrow(/Calibration/);
    expect(experiment.pipeline).toBe(calibrated);
    expect(experiment.calibrations).toEqual(result);
    experiment.select("hold");
    expect(experiment.pipeline).not.toBe(calibrated);
    expect(experiment.calibration).toEqual(result.image);
  });

  it("GF-78 one still take calibrates both spaces and survives a space switch", () => {
    const calibrations = calibrateSpaces(STILL);
    expect(calibrations.image).toEqual(calibrateDetector(STILL, IMAGE_SPACE));
    expect(calibrations.world).toEqual(calibrateDetector(STILL, WORLD_SPACE));
    const experiment = createExperiment(IMAGE_SPACE);
    experiment.select("hold");
    experiment.stabilize("none");
    experiment.switchSpace(WORLD_SPACE);
    // Before any still take, neither space is calibrated.
    expect(experiment.calibration).toBeUndefined();
    expect(experiment.calibrate(STILL)).toEqual(calibrations);
    const world = experiment.pipeline;
    experiment.switchSpace(IMAGE_SPACE);
    expect(experiment.space).toBe(IMAGE_SPACE);
    expect(experiment.pipeline).not.toBe(world);
    expect(experiment.calibration).toEqual(calibrations.image);
    expect(experiment.calibrations).toEqual(calibrations);
    // The selection carries across the switch; only the space-native tuning changes.
    expect(experiment.filler).toBe("hold");
    expect(experiment.stabilizer).toBe(stabilizerFor("none", IMAGE_SPACE));
    experiment.stabilize("one-euro");
    experiment.switchSpace(WORLD_SPACE);
    expect(experiment.stabilizer).toBe(stabilizerFor("one-euro", WORLD_SPACE));
    expect(experiment.calibration).toEqual(calibrations.world);
  });
});
