import type { FilledJoint } from "./frame";
import type { GapFiller } from "./gap-filler";
import { jointRecord, type JointId } from "./landmarks";
import { unreachable } from "./unreachable";
import type { Vec } from "./vec";

interface Held {
  readonly position: Vec;
  /** When the current gap began, or `undefined` while the joint is trusted. */
  sinceMs: number | undefined;
}

/**
 * The naive baseline anything smarter must beat: a trusted joint is presented as measured, and an
 * untrusted one repeats its last trusted position as `inferred` for as long as the gap lasts. A
 * joint never trusted since the last reset is `lost`.
 */
export function createHoldFiller(): GapFiller {
  const held = new Map<JointId, Held>();
  return {
    fill(frame) {
      return {
        tMs: frame.tMs,
        space: frame.space,
        joints: jointRecord((joint): FilledJoint => {
          const trust = frame.trust[joint];
          switch (trust.kind) {
            case "trusted":
              held.set(joint, { position: trust.position, sinceMs: undefined });
              return { kind: "measured", position: trust.position };
            case "gap": {
              const last = held.get(joint);
              if (last === undefined) return { kind: "lost" };
              last.sinceMs ??= frame.tMs;
              return { kind: "inferred", position: last.position, sinceMs: last.sinceMs };
            }
            default:
              return unreachable(trust, "joint trust");
          }
        }),
      };
    },
    reset() {
      held.clear();
    },
  };
}
