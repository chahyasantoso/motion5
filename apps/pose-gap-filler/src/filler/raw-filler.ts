import { measurementOf, type FilledJoint } from "./frame";
import type { GapFiller } from "./gap-filler";
import { jointRecord } from "./landmarks";

/**
 * The reference, not a filler under test: whatever MediaPipe measured is presented as measured,
 * trusted or not, and an absent landmark is lost. Every metric is judged against this.
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
