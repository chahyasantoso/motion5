import { createBoneLengthEstimator, type BoneLengths } from "./bone-length";
import type { FilledFrame, LandmarkFrame, TrustedFrame } from "./frame";
import { createGapDetector, NO_FORCED, type GapDetectorOptions } from "./gap-detector";
import { createGapFiller, type FillerSpec } from "./gap-filler";
import type { JointId } from "./landmarks";

export interface PipelineStep {
  readonly trusted: TrustedFrame;
  readonly filled: FilledFrame;
}

export interface GapPipeline {
  /**
   * Trust, then lengths, then the fill: every stage reads the frame's own `tMs`. `forced` names the
   * joints a hotkey or a replay mask holds out this frame.
   */
  step(frame: LandmarkFrame, forced?: ReadonlySet<JointId>): PipelineStep;
  readonly lengths: BoneLengths;
  reset(): void;
}

export interface PipelineOptions {
  readonly filler: FillerSpec;
  readonly detector?: GapDetectorOptions | undefined;
  readonly lengthWindow?: number | undefined;
}

/**
 * The one composition of trust, lengths and fill, shared by the live page and the replay. The
 * detector reads the lengths earlier frames measured, then the estimator observes this frame's
 * trusted joints, so no stage reads what it wrote this frame.
 */
export function createGapPipeline(options: PipelineOptions): GapPipeline {
  const detector = createGapDetector(options.detector);
  const lengths = createBoneLengthEstimator(options.lengthWindow);
  const filler = createGapFiller(options.filler);
  return {
    lengths,
    step(frame, forced = NO_FORCED) {
      const trusted = detector.detect(frame, forced, lengths);
      lengths.observe(trusted);
      return { trusted, filled: filler.fill(trusted) };
    },
    reset() {
      detector.reset();
      lengths.reset();
      filler.reset();
    },
  };
}
