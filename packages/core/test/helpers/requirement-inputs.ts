import type { RequirementInputs } from "../../src/domain/plugins";

/** The values one requirement slot resolved to, as a plain record. */
export type SlotValues = Readonly<Record<string, unknown>>;

/**
 * Reads one plugin's requirement slot out of a composition's scoped inputs, or `{}` when the slot
 * is unbound.
 *
 * One owner, because every publisher case in this suite asks the same question and a per-file copy
 * would let two of them disagree about what an unbound slot looks like.
 */
export function slotOf(inputs: RequirementInputs, plugin: string, slot: string): SlotValues {
  const scoped: unknown = inputs[plugin]?.[slot];
  if (scoped === null || typeof scoped !== "object" || Array.isArray(scoped)) return {};
  return scoped as SlotValues;
}
