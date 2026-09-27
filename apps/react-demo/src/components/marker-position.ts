import type { PatchDerivation, PatchValues } from "@motion5/react";

/** A published frame's position, with an absent key read as `0` as every frame reader does. */
export function point(values: PatchValues): { x: number; y: number } {
  return { x: Number(values.x ?? 0), y: Number(values.y ?? 0) };
}

/** The position-only projection keeps marker children, including labels, in their own frame. */
export const nodePosition: PatchDerivation = ([node = {}]) => point(node);
