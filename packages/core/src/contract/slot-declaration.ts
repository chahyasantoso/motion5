import { isModel, isOptionalModel, type PluginRequirement, type SlotSpec } from "./v5";
import { unreachable } from "../lang/exhaustive";

/** Normalizes every authored slot form to the two admitted kinds. */
export function slotDeclaration(requirement: PluginRequirement): SlotSpec {
  if (isModel(requirement))
    return Object.freeze({ kind: "model", model: requirement, binding: "single" });
  if (isOptionalModel(requirement))
    return Object.freeze({
      kind: "model",
      model: requirement.model,
      optional: true,
      binding: requirement.binding ?? "single",
    });
  return requirement;
}

/** Whether a normalized slot is optional. */
export function isOptionalSlot(slot: SlotSpec): boolean {
  return slot.optional === true;
}

/** Whether a normalized slot never delivers a structure. */
export function isShapeSlot(slot: SlotSpec): boolean {
  return slot.kind === "shape";
}

/** Whether a required slot can deliver a structure; only a model with `parse` can. */
export function needsSlotStructure(slot: SlotSpec): boolean {
  if (slot.optional === true) return false;
  switch (slot.kind) {
    case "model":
      return slot.model.parse !== undefined;
    case "shape":
      return false;
    default:
      return unreachable(slot);
  }
}
