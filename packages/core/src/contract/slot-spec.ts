import type { BindingMode, DataType, DependencySpec, SlotSpec, TypedSlotSpec } from "./v5";

export interface SlotOptions {
  readonly optional?: true;
  readonly binding?: BindingMode;
}

/** Declares a slot that admits only the named data type. */
export function typed(type: DataType<unknown, unknown>, options: SlotOptions = {}): TypedSlotSpec {
  return Object.freeze({
    kind: "typed",
    type,
    ...(options.optional === undefined ? {} : { optional: options.optional }),
    ...(options.binding === undefined ? {} : { binding: options.binding }),
  });
}

/** Declares a slot that admits named output shapes. */
export function shape(spec: DependencySpec): SlotSpec {
  return Object.freeze({ kind: "shape", ...spec });
}
