import type { FilledFrame, TrustedFrame } from "./frame";
import type { BoneLengths } from "./bone-length";
import { createChainKalmanFiller, type KalmanNoise } from "./chain-kalman";
import { createHoldFiller } from "./hold-filler";
import { createRawFiller } from "./raw-filler";
import { unreachable } from "./unreachable";

/**
 * Every filler the experiment compares, a closed union. `createGapFiller` is the one factory and
 * the one exhaustive switch over it, so a new filler cannot be run until it is named here. `raw`
 * is the reference every metric is judged against; `hold` is the naive baseline, and
 * `chain-kalman` predicts relative bone angles while retaining estimator-owned lengths.
 */
export type FillerSpec =
  | { readonly kind: "raw" }
  | { readonly kind: "hold" }
  | { readonly kind: "chain-kalman"; readonly noise: KalmanNoise; readonly coastMs: number };

export type FillerKind = FillerSpec["kind"];

/**
 * The one owner of "where is an untrusted joint", and nothing else. A filler reads trust from the
 * frame and never decides it. The pipeline supplies the sole estimator's read-only lengths.
 */
export interface GapFiller {
  fill(frame: TrustedFrame, lengths?: BoneLengths): FilledFrame;
  reset(): void;
}

export function createGapFiller(spec: FillerSpec): GapFiller {
  switch (spec.kind) {
    case "raw":
      return createRawFiller();
    case "hold":
      return createHoldFiller();
    case "chain-kalman":
      return createChainKalmanFiller(spec.noise, spec.coastMs);
    default:
      return unreachable(spec, "filler spec");
  }
}
