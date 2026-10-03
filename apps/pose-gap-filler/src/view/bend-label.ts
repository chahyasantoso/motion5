import { unreachable } from "../filler/unreachable";
import type { BendReference } from "../rig/bend-policy";

/** Evidence and publication are separate: a solved fallback is not a fresh observation. */
export function bendLabel(bend: BendReference, solved: boolean): string {
  switch (bend.kind) {
    case "observed":
      return "observed";
    case "predicted":
      return `predicted (${bend.basis}, last observation ${bend.lastObservedTMs} ms)`;
    case "held":
      return `held (last observation ${bend.lastObservedTMs} ms)`;
    case "unavailable":
      return solved ? "unavailable evidence (legacy fallback)" : "unavailable (not published)";
    default:
      return unreachable(bend, "bend label");
  }
}
