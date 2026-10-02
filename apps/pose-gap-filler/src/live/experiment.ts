import type { FillerKind } from "../filler/gap-filler";
import { createGapPipeline } from "../filler/pipeline";
import { IMAGE_SPACE, type LandmarkSpace } from "../filler/space";
import { stabilizerFor, type StabilizerKind, type StabilizerSpec } from "../filler/stabilizer";
import {
  calibrateSpaces,
  comparedFillers,
  type Calibration,
  type SpaceCalibrations,
} from "../replay/compare";
import type { PoseRecording } from "../replay/recording";

/**
 * What the live page starts with: the relative-angle predictor on a stabilized measurement, the
 * combination that holds a still person still. `raw` stays selectable as the unprocessed reference,
 * and `none` as the unstabilized one, so the page can still show what MediaPipe measured.
 */
export const LIVE_FILLER: FillerKind = "chain-kalman";
export const LIVE_STABILIZER: StabilizerKind = "one-euro";

/**
 * Owns the user's selected space, filler, stabilizer and still calibration, not trust decisions.
 * Changing any of them creates a fresh pipeline so state from one setting cannot leak into another.
 * A still take calibrates every space at once and survives a space switch, so live and replay read
 * the same detector in whichever space is selected, and a failed calibration leaves all unchanged.
 */
export function createExperiment(initialSpace: LandmarkSpace = IMAGE_SPACE) {
  let space = initialSpace;
  let kind: FillerKind = LIVE_FILLER;
  let stabilizerKind: StabilizerKind = LIVE_STABILIZER;
  let calibrations: SpaceCalibrations | undefined;
  const makePipeline = () => {
    const filler = comparedFillers(space).find((spec) => spec.kind === kind);
    if (filler === undefined) throw new Error(`No compared filler ${kind}.`);
    return createGapPipeline({
      filler,
      detector: calibrations?.[space.kind].detector,
      stabilizer: stabilizerFor(stabilizerKind, space),
    });
  };
  let pipeline = makePipeline();
  return {
    get pipeline() {
      return pipeline;
    },
    get space(): LandmarkSpace {
      return space;
    },
    /** The selected space's still calibration, the replay record's noise floor; none until one. */
    get calibration(): Calibration | undefined {
      return calibrations?.[space.kind];
    },
    /** Every space's still calibration, so a replay record judges both spaces; none until one. */
    get calibrations(): SpaceCalibrations | undefined {
      return calibrations;
    },
    get filler(): FillerKind {
      return kind;
    },
    get stabilizer(): StabilizerSpec {
      return stabilizerFor(stabilizerKind, space);
    },
    select(next: FillerKind) {
      if (!comparedFillers(space).some((spec) => spec.kind === next))
        throw new Error(`No compared filler ${next}.`);
      kind = next;
      pipeline = makePipeline();
    },
    stabilize(next: StabilizerKind) {
      stabilizerKind = next;
      pipeline = makePipeline();
    },
    /** Switches space, keeping the filler, the stabilizer kind and the still calibration. */
    switchSpace(next: LandmarkSpace) {
      space = next;
      pipeline = makePipeline();
    },
    calibrate(recording: PoseRecording): SpaceCalibrations {
      const next = calibrateSpaces(recording);
      calibrations = next;
      pipeline = makePipeline();
      return next;
    },
  };
}
