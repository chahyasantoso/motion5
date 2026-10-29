import { rowPatchSource } from "@motion5/react";
import type { PatchDerivation, PatchSource, PatchValues } from "@motion5/react";

/** A published frame's position, with an absent key read as `0` as every frame reader does. */
export function point(values: PatchValues): { x: number; y: number } {
  return { x: Number(values.x ?? 0), y: Number(values.y ?? 0) };
}

/** The position-only projection keeps marker children, including labels, in their own frame. */
export const nodePosition: PatchDerivation = ([node = {}]) => point(node);

/**
 * The walker's bone aliases, mapped onto the two tables that publish them.
 *
 * This mapping is the demo's, not a shared contract: the rig splits its pose across `walk/pose` and
 * `walk/arms-pose`, while the scene names each bone as its own marker target. Every alias is one
 * generic row projection, and anything this mapping does not name — `walk/pelvis` included, because
 * it is a published node of its own — reaches the underlying source unchanged.
 */
const POSE_BONES = [
  "chest",
  "head",
  "legL_thigh",
  "legL_shin",
  "legL_foot",
  "legR_thigh",
  "legR_shin",
  "legR_foot",
] as const;
const ARM_BONES = ["armL_upper", "armL_lower", "armR_upper", "armR_lower"] as const;

export function createWalkerRowSource(source: PatchSource): PatchSource {
  const aliases = new Map<string, PatchSource>();
  const bind = (bone: string, nodeId: string): void => {
    aliases.set(
      `walk/${bone}`,
      rowPatchSource(source, { nodeId, output: "values", rowId: bone, as: `walk/${bone}` }),
    );
  };
  for (const bone of POSE_BONES) bind(bone, "walk/pose");
  for (const bone of ARM_BONES) bind(bone, "walk/arms-pose");

  return {
    get(nodeId) {
      const alias = aliases.get(nodeId);
      return alias === undefined ? source.get(nodeId) : alias.get(nodeId);
    },
    subscribeNode(nodeId, listener) {
      const alias = aliases.get(nodeId);
      return alias === undefined
        ? source.subscribeNode(nodeId, listener)
        : alias.subscribeNode(nodeId, listener);
    },
  };
}
