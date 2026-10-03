import { createBoneLengthEstimator, type BoneLengths } from "./bone-length";
import type { FilledFrame, LandmarkFrame, TrustedFrame } from "./frame";
import { createGapDetector, NO_FORCED, type GapDetectorOptions } from "./gap-detector";
import { createGapFiller, type FillerSpec } from "./gap-filler";
import type { JointId } from "./landmarks";
import { createStabilizer, NO_STABILIZER, type StabilizerSpec } from "./stabilizer";
import { createBodyStateOwner } from "../body/state";
import { DEFAULT_WORLD_KALMAN_NOISE } from "./world-chain";
import { DEFAULT_COAST_MS } from "./chain-kalman";

export interface PipelineStep {
  /** The detector's trust, with every trusted position as the stabilizer denoised it. */
  readonly trusted: TrustedFrame;
  readonly filled: FilledFrame;
}

export interface GapPipeline {
  /**
   * Trust, then the stabilizer, then lengths, then the fill: every stage reads the frame's own `tMs`. `forced` names the
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
  /** Defaults to `none`, so a pipeline is unsmoothed unless its caller chose a stabilizer. */
  readonly stabilizer?: StabilizerSpec | undefined;
}

/**
 * The one composition of trust, stabilizer, lengths and fill, shared by the live page and the
 * replay. The detector decides trust on the raw measurement (its gate reads raw speed against the
 * lengths earlier frames measured); the stabilizer then denoises only the joints it trusted, so the
 * estimator, the filler, the writer's bend observations and the camera fit all read one denoised
 * measurement and no stage reads what it wrote this frame.
 */
export function createGapPipeline(options: PipelineOptions): GapPipeline {
  const detector = createGapDetector(options.detector);
  const lengths = createBoneLengthEstimator(options.lengthWindow);
  const filler = createGapFiller(options.filler);
  const stabilizer = createStabilizer(options.stabilizer ?? NO_STABILIZER);
  const body = createBodyStateOwner(
    options.filler.kind === "chain-kalman" ? options.filler.noise : DEFAULT_WORLD_KALMAN_NOISE,
    options.filler.kind === "chain-kalman" ? options.filler.coastMs : DEFAULT_COAST_MS,
  );
  return {
    lengths,
    step(frame, forced = NO_FORCED) {
      let trusted = stabilizer.stabilize(detector.detect(frame, forced, lengths));
      lengths.observe(trusted);
      if (frame.space.kind === "world") trusted = { ...trusted, body: body.step(trusted, lengths) };
      const filled = filler.fill(trusted, lengths);
      return {
        trusted,
        filled: trusted.body === undefined ? filled : { ...filled, body: trusted.body },
      };
    },
    reset() {
      detector.reset();
      stabilizer.reset();
      lengths.reset();
      filler.reset();
      body.reset();
    },
  };
}
