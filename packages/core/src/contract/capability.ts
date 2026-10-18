/** Open registry of structural capabilities. Plugins add entries with `declare module "@motion5/core/plugin-api"`. */
export interface CapabilityMap {}

export type CapabilityName = keyof CapabilityMap;

export function isCapabilityToken(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !value.includes(":");
}
