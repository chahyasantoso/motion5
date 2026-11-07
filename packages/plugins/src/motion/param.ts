import { isFlatRecord, type Value } from "@motion5/core/plugin-api";

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

/** Reads a move's optional `from` and `to`, and answers its local progress. */
export function moveProgress(param: Value | undefined, progress: number): number {
  return windowed(progress, numberParam(param, "from", 0), numberParam(param, "to", 1));
}
