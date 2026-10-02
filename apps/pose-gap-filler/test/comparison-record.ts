import type { LandmarkSpace } from "../src/filler/space";
import { calibrateDetector } from "../src/replay/compare";
import { buildComparisonRecord, type ComparisonRecord } from "../src/replay/record";
import { createSyntheticRecording, type SyntheticOptions } from "../src/replay/synthetic";
import { createRigSolver } from "../src/rig/solver";
import { fakePorts } from "./engine";

/**
 * The committed record's input, the one owner of what `docs/POSE-GAP-FILLER-COMPARISON.md`
 * measured: a still take the detector and the noise floor are calibrated on, and an exercise take
 * every filler is replayed over. Seeds differ, so calibration never sees the frames it judges.
 */
export const RECORD_STILL: SyntheticOptions = Object.freeze({
  motion: Object.freeze({ kind: "still" }),
  seed: 7,
  durationMs: 10000,
  fps: 30,
});
export const RECORD_EXERCISE: SyntheticOptions = Object.freeze({
  motion: Object.freeze({ kind: "exercise" }),
  seed: 11,
  durationMs: 12000,
  fps: 30,
});

const describeTake = (options: SyntheticOptions) =>
  `${options.motion.kind} seed ${options.seed}, ${options.durationMs} ms at ${options.fps} fps`;

/** The committed record, regenerated: the live defaults, a fresh Engine rig per row. */
export function syntheticComparisonRecord(): ComparisonRecord {
  const still = createSyntheticRecording(RECORD_STILL);
  return buildComparisonRecord({
    label: `synthetic ${describeTake(RECORD_EXERCISE)}, calibrated on synthetic ${describeTake(RECORD_STILL)}`,
    recording: createSyntheticRecording(RECORD_EXERCISE),
    stabilizer: "one-euro",
    calibrationFor: (space: LandmarkSpace) => calibrateDetector(still, space),
    createSolver: (space) => createRigSolver(fakePorts(), space),
  });
}
