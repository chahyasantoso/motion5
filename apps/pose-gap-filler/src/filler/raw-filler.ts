import { measurementOf, type FilledJoint } from "./frame";
import type { GapFiller } from "./gap-filler";
import { jointRecord } from "./landmarks";

/**
 * The reference, not a filler under test: whatever MediaPipe measured is presented as measured,
 * trusted or not, and an absent landmark is lost. It reads observations, never trust, on purpose:
 * a forced or gated joint is still a measurement, and showing it as one is what "no filler" means.
 * Presenting a measurement as measured is not a fill, so invariant 5 holds.
 */
export function createRawFiller(): GapFiller {
  return {
    fill(frame) {
      return {
        tMs: frame.tMs,
        space: frame.space,
        joints: jointRecord((joint): FilledJoint => {
          const measurement = measurementOf(frame.joints[joint]);
          return measurement === undefined
            ? { kind: "lost" }
            : { kind: "measured", position: measurement.position };
        }),
      };
    },
    reset() {},
  };
}
