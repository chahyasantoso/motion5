import { useCallback, useEffect, useMemo, useRef, type RefCallback } from "react";
import { createDomPatchAdapter, type DomTarget } from "@motion5/core/adapters";
import type { PatchSource, RenderMetadata, RenderMetadataSource } from "@motion5/core/internal";

// A one-node binding has no stage. `perspective` is a project-level property a composition root
// applies once, and the injected resolver answers every `apply`, so this object is never written to
// and never resolved as a target.
const NO_STAGE: DomTarget = { style: {} };
const NO_SERIALIZERS: RenderMetadata["outputSerializers"] = Object.freeze({});

// One cast, at the one seam where a typed DOM class meets the adapter's dynamic-property contract.
// `DomTarget` carries an index signature because writing renderer-neutral keys is what the adapter
// exists to do, and a class instance can never satisfy an index signature, so the choice is one
// adaptation here or one in every consumer. It is named rather than hidden. See ADR-073.
function asDomTarget(element: Element): DomTarget {
  return element as unknown as DomTarget;
}

/**
 * Binds one published node to one DOM or SVG target and returns the callback ref that attaches it.
 *
 * React owns the subscription and the ref lifecycle. `createDomPatchAdapter` remains the single
 * owner of which published values are renderable and how they are applied, so a new plugin output
 * reaches the target without this hook or a consumer learning its key. Values are written outside
 * React: no state, no render per publication, and no second scheduler beside the registry's batch.
 *
 * A patch that is not ready is a no-op in the adapter, so a blocked, errored, or destroyed node
 * leaves its target at the last applied pose. Reach for `usePatch` when absence must be rendered,
 * when markup is derived from more than one node, or for a diagnostic readout. See ADR-073.
 */
export function useDomPatch<T extends Element>(
  source: PatchSource & RenderMetadataSource,
  nodeId: string,
): RefCallback<T> {
  const target = useRef<DomTarget | undefined>(undefined);
  const adapter = useMemo(() => {
    // A live view rather than a snapshot: a recompiled node resolves to a new plugin chain, and a
    // serializer record captured at construction would write the next output raw.
    const metadata: RenderMetadata = {
      get outputSerializers() {
        return source.renderMetadata(nodeId)?.outputSerializers ?? NO_SERIALIZERS;
      },
    };
    return createDomPatchAdapter(NO_STAGE, undefined, () => target.current, undefined, metadata);
  }, [nodeId, source]);

  // Subscribe, then read the retained patch, so a value published between the two is applied rather
  // than lost and an already-published node renders on mount.
  useEffect(() => {
    const unsubscribe = source.subscribeNode(nodeId, (patch) => {
      adapter.apply(patch);
    });
    const retained = source.get(nodeId);
    if (retained) adapter.apply(retained);
    return unsubscribe;
  }, [adapter, nodeId, source]);

  // Detach through `null` rather than a returned cleanup: this package supports React 18, where a
  // ref callback that returns a function is warned about and never called back.
  return useCallback(
    (element: T | null) => {
      const next = element === null ? undefined : asDomTarget(element);
      const previous = target.current;
      if (previous !== undefined && previous !== next) adapter.clear(previous);
      target.current = next;
      if (next === undefined) return;
      const retained = source.get(nodeId);
      if (retained) adapter.apply(retained);
    },
    [adapter, nodeId, source],
  );
}
