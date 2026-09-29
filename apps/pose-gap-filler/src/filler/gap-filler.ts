import type { BoneLengths } from "./bone-length";
import type { FilledFrame, TrustedFrame } from "./frame";
import { createRawFiller } from "./raw-filler";

/**
 * Every filler the experiment compares, a closed union. `createGapFiller` is the one factory and
 * the one exhaustive switch over it, so a new filler cannot be run until it is named here.
 */
export type FillerSpec = { readonly kind: "raw" };

/** What a filler may read besides the frame: bone lengths, owned by the estimator. */
export interface FillerContext {
  readonly lengths: BoneLengths;
}

/**
 * The one owner of "where is an untrusted joint", and nothing else. A filler reads trust from the
 * frame and lengths from the context, and never decides either.
 */
export interface GapFiller {
  fill(frame: TrustedFrame): FilledFrame;
  reset(): void;
}

export function createGapFiller(spec: FillerSpec, _context: FillerContext): GapFiller {
  switch (spec.kind) {
    case "raw":
      return createRawFiller();
    default: {
      const unhandled: never = spec.kind;
      throw new Error(`Unhandled filler spec: ${JSON.stringify(unhandled)}`);
    }
  }
}
