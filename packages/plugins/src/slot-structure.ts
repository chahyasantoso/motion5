import type { SourceStructures, Structure } from "@motion5/core/plugin-api";

/** Reads the structure a model slot delivered; the slot's declaration names the model. */
export function structureOf<T>(
  structures: SourceStructures,
  slot: string,
): Structure<T> | undefined {
  return structures[slot] as Structure<T> | undefined;
}

/** Reads a required slot's structure or refuses a transform that ran without a commit parse. */
export function requireStructure<T>(
  structures: SourceStructures | undefined,
  slot: string,
  owner: string,
): Structure<T> {
  const structure = structureOf<T>(structures ?? {}, slot);
  if (structure === undefined)
    throw new TypeError(`${owner} requires a committed structure for slot '${slot}'.`);
  return structure;
}
