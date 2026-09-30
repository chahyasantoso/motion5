import type { FilledFrame, TrustedFrame } from "./frame";
import { createRawFiller } from "./raw-filler";
import { unreachable } from "./unreachable";

/**
 * Every filler the experiment compares, a closed union. `createGapFiller` is the one factory and
 * the one exhaustive switch over it, so a new filler cannot be run until it is named here.
 */
export type FillerSpec = { readonly kind: "raw" };

/**
 * The one owner of "where is an untrusted joint", and nothing else. A filler reads trust from the
 * frame and never decides it. A filler that needs bone lengths receives them when it lands.
 */
export interface GapFiller {
  fill(frame: TrustedFrame): FilledFrame;
  reset(): void;
}

export function createGapFiller(spec: FillerSpec): GapFiller {
  switch (spec.kind) {
    case "raw":
      return createRawFiller();
    default:
      return unreachable(spec.kind, "filler spec");
  }
}
