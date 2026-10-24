import { isStructuralEdit, isValueEdit } from "./edit-types";
import type { CheapEdit, Edit, LiveEdit, StructuralEdit } from "./edit-types";

/**
 * What one list of edits is, decided once so the runtime has exactly one path per answer.
 *
 * A list of value edits plans against one lookup and publishes once. A list of structural edits
 * plans against the candidate graph and commits once. A list that mixes the two has no single
 * correct runtime effect yet: a value edit's compiled-Track effect depends on whether a later
 * structural edit in the same list rebuilds that Track. It is reported as its own answer so the
 * runtime refuses it by name rather than guessing.
 */
export type EditBatch =
  | { readonly kind: "empty" }
  | { readonly kind: "values"; readonly edits: readonly (CheapEdit | LiveEdit)[] }
  | { readonly kind: "structural"; readonly edits: readonly StructuralEdit[] }
  | { readonly kind: "mixed" };

export function classifyBatch(edits: readonly Edit[]): EditBatch {
  const structural = edits.filter(isStructuralEdit);
  const values = edits.filter(isValueEdit);
  if (structural.length > 0 && values.length > 0) return { kind: "mixed" };
  if (structural.length > 0) return { kind: "structural", edits: structural };
  if (values.length > 0) return { kind: "values", edits: values };
  return { kind: "empty" };
}
