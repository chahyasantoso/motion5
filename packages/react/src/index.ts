import { useMemo, useSyncExternalStore } from "react";
import type { LivePatch, PatchSource } from "@motion5/core/internal";
import { createPatchStore } from "./patch-store";

// Callers type the hook from this entry alone, so the observation contract stays private.
// `LivePatch` is what `get` and `usePatch` answer; `Patch` carries all four source variants.
export { patchRender } from "@motion5/core/internal";
export type {
  LivePatch,
  Patch,
  PatchRender,
  PatchListener,
  PatchSource,
  RenderMetadata,
  RenderMetadataSource,
} from "@motion5/core/internal";
/** Collapse a terminal patch to absence, as `PatchSource.get` requires. */
export { liveOrAbsent } from "@motion5/core/internal";

/**
 * Subscribe to one published node from a React component; answers `LivePatch | undefined` because the store collapses the terminal `destroyed` publication to absence.
 */
export function usePatch(source: PatchSource, nodeId: string): LivePatch | undefined {
  const store = useMemo(() => createPatchStore(source, nodeId), [source, nodeId]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export { rowPatchSource } from "./row-patch-source";
export type { RowPatchOptions } from "./row-patch-source";
export { useDomPatch } from "./dom-patch";
export { useDerivedDomPatch } from "./derived-dom-patch";
export type { PatchDerivation, PatchValues } from "./derived-dom-patch";
