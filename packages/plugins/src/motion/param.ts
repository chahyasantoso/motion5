import { isFlatRecord, type Value } from "@motion5/core/plugin-api";
import { windowed } from "@motion5/moves";

export const FROM = "Motion progress where this move starts; default 0.";
export const TO = "Motion progress where this move ends at rest; default 1.";

/** Reads a numeric param, or `fallback` when the track did not author it. */
export function numberParam(param: Value | undefined, key: string, fallback: number): number {
  if (param === undefined || !isFlatRecord(param)) return fallback;
  const value = param[key];
  return typeof value === "number" ? value : fallback;
}

/** Reads a move's optional `from` and `to`, and answers its local progress. */
export function moveProgress(param: Value | undefined, progress: number): number {
  return windowed(progress, numberParam(param, "from", 0), numberParam(param, "to", 1));
}

/** Reads a string param, or `fallback` when the track did not author it. */
export function stringParam(param: Value | undefined, key: string, fallback: string): string {
  if (param === undefined || !isFlatRecord(param)) return fallback;
  const value = param[key];
  return typeof value === "string" ? value : fallback;
}
