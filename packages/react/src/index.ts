import { useMemo, useSyncExternalStore } from "react";
import type { LivePatch, PatchSource } from "@motion5/core/internal";
import { createPatchStore } from "./patch-store";

// A consumer must be able to type the hook's argument and result from this entry alone.
// Re-exporting the observation contract keeps @motion5/core/internal a private channel
// between the two packages instead of a required import for anyone using the hook.
//
// `LivePatch` joins the list on exactly that rule rather than as a convenience: it is what `get` and
// this hook answer now, and a consumer that cannot name the type a member returns cannot hold it in
// a variable. `Patch` stays, because `subscribeNode` and `PatchListener` still carry all four
// variants and a consumer implementing a source has to name what it publishes.
export type {
  LivePatch,
  Patch,
  PatchListener,
  PatchSource,
  RenderMetadata,
  RenderMetadataSource,
} from "@motion5/core/internal";
/**
 * The collapse an implementor of `PatchSource` owes, re-exported for the reason the types above are.
 *
 * `get` answers `LivePatch | undefined` while `subscribeNode` delivers every variant, so a source
 * built over a wire that carries a terminal patch has to turn one into absence. A consumer that can
 * satisfy this package's contract from this entry alone has to be able to satisfy that part of it
 * too, without importing `@motion5/core/internal` and without re-deriving which variants are live.
 */
export { liveOrAbsent } from "@motion5/core/internal";

/**
 * Subscribe to one published node from a React component.
 *
 * `LivePatch | undefined` rather than `Patch | undefined`, which costs a reader nothing because
 * `LivePatch` is assignable to `Patch`, and tells one it will never be handed a `destroyed` patch
 * here. The store this reads collapses the terminal publication to absence, so a component sees the
 * node stop existing as the absence it renders rather than as a status it has to know to check. A
 * consumer that wants the terminal event itself subscribes through `PatchSource` instead.
 */
export function usePatch(source: PatchSource, nodeId: string): LivePatch | undefined {
  const store = useMemo(() => createPatchStore(source, nodeId), [source, nodeId]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export { useDomPatch } from "./dom-patch";
export { useDerivedDomPatch } from "./derived-dom-patch";
export type { PatchDerivation, PatchValues } from "./derived-dom-patch";
