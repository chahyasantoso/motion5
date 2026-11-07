import { isFlatRecord, type Value } from "@motion5/core/plugin-api";

export const FROM = "Motion progress where this move starts; default 0.";
export const TO = "Motion progress where this move ends at rest; default 1.";

/** Reads a numeric param, or `fallback` when the track did not author it. */
export function numberParam(param: Value | undefined, key: string, fallback: number): number {
  if (param === undefined || !isFlatRecord(param)) return fallback;
  const value = param[key];
  return typeof value === "number" ? value : fallback;
}

/** Maps `progress` inside `[from, to]` onto `[0, 1]`, holding outside it; a zero-length window steps at `from`. */
export function windowed(progress: number, from: number, to: number): number {
  if (to <= from) return progress < from ? 0 : 1;
  return Math.max(0, Math.min(1, (progress - from) / (to - from)));
}

/** The scale and pivot of a move `weight` of the way into its `squash`; the floor stays where it is. */
export function squashPose(squash: number, weight: number) {
  return {
    scaleX: 1 + 0.9 * squash * weight,
    scaleY: 1 - squash * weight,
    transformOrigin: "50% 100%",
  };
}

/** Reads a move's optional `from` and `to`, and answers its local progress. */
export function moveProgress(param: Value | undefined, progress: number): number {
  return windowed(progress, numberParam(param, "from", 0), numberParam(param, "to", 1));
}
