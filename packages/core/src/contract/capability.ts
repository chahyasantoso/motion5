/** Open registry of structural capabilities. Plugins add entries with `declare module "@motion5/core/plugin-api"`. */
export interface CapabilityMap {}

export type CapabilityName = keyof CapabilityMap;

/** The discriminated union `readAny` answers for one slot's capability tuple. */
export type CapabilityReadOf<M, K extends keyof M> = {
  readonly [C in K]: { readonly capability: C; readonly payload: M[C] };
}[K];

/** `readAny`'s answer over the global capability map. */
export type CapabilityRead<K extends keyof CapabilityMap> = CapabilityReadOf<CapabilityMap, K>;

export function isCapabilityToken(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !value.includes(":");
}
