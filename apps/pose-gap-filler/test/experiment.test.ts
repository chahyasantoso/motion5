import { describe, expect, it } from "vitest";
import { createExperiment } from "../src/live/experiment";
import { createSyntheticRecording } from "../src/replay/synthetic";

describe("live calibration composition", () => {
  it("GF-31 shares calibrated settings with live and replay and preserves state on failure", () => {
    const experiment = createExperiment();
    const before = experiment.pipeline;
    const recording = createSyntheticRecording({
      motion: { kind: "still" },
      seed: 3,
      durationMs: 1000,
      fps: 30,
    });
    const result = experiment.calibrate(recording);
    expect(experiment.calibration).toEqual(result);
    expect(experiment.pipeline).not.toBe(before);
    const calibrated = experiment.pipeline;
    expect(() => experiment.calibrate({ ...recording, frames: [] })).toThrow(/Calibration/);
    expect(experiment.pipeline).toBe(calibrated);
    expect(experiment.calibration).toEqual(result);
    experiment.select("hold");
    expect(experiment.pipeline).not.toBe(calibrated);
    expect(experiment.calibration).toEqual(result);
  });
});
