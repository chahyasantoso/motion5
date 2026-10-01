import type { GapDetectorOptions } from "../filler/gap-detector";
import type { FillerKind } from "../filler/gap-filler";
import { createGapPipeline } from "../filler/pipeline";
import { IMAGE_SPACE, type LandmarkSpace } from "../filler/space";
import { stabilizerFor, type StabilizerKind, type StabilizerSpec } from "../filler/stabilizer";
import { comparedFillers, calibrateDetector } from "../replay/compare";
import type { PoseRecording } from "../replay/recording";

/**
 * What the live page starts with: the relative-angle predictor on a stabilized measurement, the
 * combination that holds a still person still. `raw` stays selectable as the unprocessed reference,
 * and `none` as the unstabilized one, so the page can still show what MediaPipe measured.
 */
export const LIVE_FILLER: FillerKind = "chain-kalman";
export const LIVE_STABILIZER: StabilizerKind = "one-euro";

/**
 * Owns the user's selected filler, stabilizer and detector settings, not trust decisions. Changing
 * any of them creates a fresh pipeline so state from one setting cannot leak into another.
 * Live and replay read the same detector and stabilizer, and a failed calibration leaves both
 * unchanged.
 */
export function createExperiment(space: LandmarkSpace = IMAGE_SPACE) {
  const fillers = comparedFillers(space);
  let kind: FillerKind = LIVE_FILLER;
  let stabilizer: StabilizerSpec = stabilizerFor(LIVE_STABILIZER, space);
  let detector: GapDetectorOptions | undefined;
  const makePipeline = () => {
    const filler = fillers.find((spec) => spec.kind === kind);
    if (filler === undefined) throw new Error(`No compared filler ${kind}.`);
    return createGapPipeline({ filler, detector, stabilizer });
  };
  let pipeline = makePipeline();
  return {
    get pipeline() {
      return pipeline;
    },
    get detector() {
      return detector;
    },
    get filler(): FillerKind {
      return kind;
    },
    get stabilizer(): StabilizerSpec {
      return stabilizer;
    },
    select(next: FillerKind) {
      if (!fillers.some((spec) => spec.kind === next))
        throw new Error(`No compared filler ${next}.`);
      kind = next;
      pipeline = makePipeline();
    },
    stabilize(next: StabilizerKind) {
      stabilizer = stabilizerFor(next, space);
      pipeline = makePipeline();
    },
    calibrate(recording: PoseRecording) {
      const calibration = calibrateDetector(recording, space);
      detector = calibration.detector;
      pipeline = makePipeline();
      return calibration;
    },
  };
}
