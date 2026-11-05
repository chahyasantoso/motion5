import type { DependencySpec, SlotSpec } from "./v5";

/** Declares a slot that admits named output shapes. */
export function shape(spec: DependencySpec): SlotSpec {
  return Object.freeze({ kind: "shape", ...spec });
}

export { optional, type OptionalModel } from "./v5";
