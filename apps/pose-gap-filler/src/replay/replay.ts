import { measurementOf, presentedPosition, type JointTrust } from "../filler/frame";
import type { GapDetectorOptions } from "../filler/gap-detector";
import type { FillerSpec } from "../filler/gap-filler";
import { LIMBS, jointRecord, type JointId, type LimbId } from "../filler/landmarks";
import { createGapPipeline, type PipelineStep } from "../filler/pipeline";
import type { LandmarkSpace } from "../filler/space";
import type { Vec } from "../filler/vec";
import type { SolvedLimb } from "../rig/rig";
import type { PoseSolver } from "../rig/solver";
import { maskedJoints, validateMask, type Mask } from "./mask";
import { replayFrame, type PoseRecording } from "./recording";

/** Where each joint is shown this frame, or `undefined` where nothing is shown. */
export type Presented = Readonly<Record<JointId, Vec | undefined>>;

/** One replayed frame, everything the metrics read. */
export interface ReplayFrame {
  readonly tMs: number;
  /** The joints the masks held out this frame. */
  readonly masked: ReadonlySet<JointId>;
  /**
   * The reference: the landmark MediaPipe measured this frame, before any mask or trust decision,
   * `undefined` only where it measured nothing. MediaPipe is the reference, not ground truth.
   */
  readonly reference: Presented;
  /** The run under test: what it trusted, and what it showed. */
  readonly trust: Readonly<Record<JointId, JointTrust>>;
  readonly presented: Presented;
}

export interface ReplayOptions {
  readonly recording: PoseRecording;
  readonly space: LandmarkSpace;
  readonly filler: FillerSpec;
  readonly masks?: readonly Mask[] | undefined;
  readonly detector?: GapDetectorOptions | undefined;
  readonly lengthWindow?: number | undefined;
  /**
   * A fresh solver for this run. With one, a limb's middle and tip are shown where the rig solved
   * them, as the live page draws them; without one, the filled joints are shown.
   */
  readonly solver?: PoseSolver | undefined;
}

/**
 * What the live page shows for each joint: a written chain's middle and tip where the rig solved
 * them, and every other joint's fill, which the overlay still draws as its marker when the limb's
 * chain was skipped.
 */
function presentedOf(
  step: PipelineStep,
  solved: ReadonlyMap<LimbId, SolvedLimb> | undefined,
): Presented {
  const shown = jointRecord((joint) => presentedPosition(step.filled.joints[joint]));
  if (solved === undefined) return shown;
  for (const limb of LIMBS) {
    const chain = solved.get(limb.id);
    if (chain === undefined) continue;
    shown[limb.middle] = chain.middle;
    shown[limb.tip] = chain.tip;
  }
  return shown;
}

/**
 * Replays a recording on a fixed clock: frame times come from the recording, never a wall clock, so
 * a replay is a pure function of its options. Masks reach the run only as `forced` trust; the
 * reference is read from the same adapted frame, so every filler is judged against one landmark.
 */
export function runReplay(options: ReplayOptions): readonly ReplayFrame[] {
  const masks = (options.masks ?? []).map(validateMask);
  const run = createGapPipeline({
    filler: options.filler,
    detector: options.detector,
    lengthWindow: options.lengthWindow,
  });
  return options.recording.frames.map((recorded, index) => {
    const frame = replayFrame(options.recording, recorded, options.space);
    const masked = maskedJoints(masks, index);
    const step = run.step(frame, masked);
    return {
      tMs: frame.tMs,
      masked,
      reference: jointRecord((joint) => measurementOf(frame.joints[joint])?.position),
      trust: step.trusted.trust,
      presented: presentedOf(step, options.solver?.solve(step, run.lengths)),
    };
  });
}
