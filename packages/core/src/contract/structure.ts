import type { Structure } from "./v5";

/** Core-only acceptance: freezes a domain structure and gives it the unforgeable brand. */
export function brandStructure<S>(structure: S): Structure<S> {
  return Object.freeze(structure) as Structure<S>;
}
