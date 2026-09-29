import { createBoneLengthEstimator, type BoneLengths } from "./bone-length";
import type { FilledFrame, LandmarkFrame, TrustedFrame } from "./frame";
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
    trust: jointRecord((joint) => {
      const observation = frame.joints[joint];
      switch (observation.kind) {
        case "measured":
          return {
            kind: "trusted",
            position: observation.position,
            visibility: observation.visibility,
          };
        case "absent":
          return { kind: "gap", reason: "absent" };
        default: {
          const unhandled: never = observation;
          throw new Error(`Unhandled observation: ${JSON.stringify(unhandled)}`);
        }
      }
    }),
  };
}

/** The one composition of trust, lengths and fill, shared by the live page and the replay. */
export function createGapPipeline(options: PipelineOptions): GapPipeline {
  const lengths = createBoneLengthEstimator(options.lengthWindow);
  const filler = createGapFiller(options.filler, { lengths });
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
