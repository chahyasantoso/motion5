import type { GapDetectorOptions } from "../filler/gap-detector";
import type { FillerKind } from "../filler/gap-filler";
import { createGapPipeline } from "../filler/pipeline";
import { IMAGE_SPACE } from "../filler/space";
import { COMPARED_FILLERS, calibrateDetector } from "../replay/compare";
import type { PoseRecording } from "../replay/recording";

/**
 * Owns the user's selected filler and detector settings, not trust decisions. Changing either
 * creates a fresh pipeline so measurements from one calibration cannot leak into another.
 * Live and replay read the same detector, and a failed calibration leaves both unchanged.
 */
export function createExperiment() {
  let kind: FillerKind = COMPARED_FILLERS[0]!.kind;
  let detector: GapDetectorOptions | undefined;
  const makePipeline = () => {
    const filler = COMPARED_FILLERS.find((spec) => spec.kind === kind);
    if (filler === undefined) throw new Error(`No compared filler ${kind}.`);
    return createGapPipeline({ filler, detector });
  };
  let pipeline = makePipeline();
  return {
    get pipeline() {
      return pipeline;
    },
    get detector() {
      return detector;
    },
    select(next: FillerKind) {
      if (!COMPARED_FILLERS.some((spec) => spec.kind === next))
        throw new Error(`No compared filler ${next}.`);
      kind = next;
      pipeline = makePipeline();
    },
    calibrate(recording: PoseRecording) {
      const calibration = calibrateDetector(recording, IMAGE_SPACE);
      detector = calibration.detector;
      pipeline = makePipeline();
      return calibration;
    },
  };
}
