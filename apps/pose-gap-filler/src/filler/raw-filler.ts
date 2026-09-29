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
        joints: jointRecord((joint) => {
          const observation = frame.joints[joint];
          switch (observation.kind) {
            case "measured":
              return { kind: "measured", position: observation.position };
            case "absent":
              return { kind: "lost" };
            default: {
              const unhandled: never = observation;
              throw new Error(`Unhandled observation: ${JSON.stringify(unhandled)}`);
            }
          }
        }),
      };
    },
    reset() {},
  };
}
