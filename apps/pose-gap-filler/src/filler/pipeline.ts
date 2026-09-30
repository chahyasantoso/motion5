import { createBoneLengthEstimator, type BoneLengths } from "./bone-length";
import {
  measurementOf,
  type FilledFrame,
  type JointTrust,
  type LandmarkFrame,
  type TrustedFrame,
} from "./frame";
import { createGapFiller, type FillerSpec } from "./gap-filler";
import { jointRecord } from "./landmarks";

export interface PipelineStep {
  readonly trusted: TrustedFrame;
  readonly filled: FilledFrame;
}

export interface GapPipeline {
  /** Trust, then lengths, then the fill: every stage reads the frame's own `tMs`. */
  step(frame: LandmarkFrame): PipelineStep;
  readonly lengths: BoneLengths;
  reset(): void;
}

export interface PipelineOptions {
  readonly filler: FillerSpec;
  readonly lengthWindow?: number;
}

/**
 * Phase 1 trusts every measured landmark: the gap detector, the only owner of trust, lands with the
 * replay harness in phase 2, and until then an absent landmark is the only gap.
 */
function trustMeasured(frame: LandmarkFrame): TrustedFrame {
  return {
    ...frame,
    trust: jointRecord((joint): JointTrust => {
      const measurement = measurementOf(frame.joints[joint]);
      return measurement === undefined
        ? { kind: "gap", reason: "absent" }
        : {
            kind: "trusted",
            position: measurement.position,
            visibility: measurement.visibility,
          };
    }),
  };
}

/** The one composition of trust, lengths and fill, shared by the live page and the replay. */
export function createGapPipeline(options: PipelineOptions): GapPipeline {
  const lengths = createBoneLengthEstimator(options.lengthWindow);
  const filler = createGapFiller(options.filler);
  return {
    lengths,
    step(frame) {
      const trusted = trustMeasured(frame);
      lengths.observe(trusted);
      return { trusted, filled: filler.fill(trusted) };
    },
    reset() {
      lengths.reset();
      filler.reset();
    },
  };
}
