import { useCallback, useMemo, useRef, type RefCallback } from "react";
import {
  createDomPatchAdapter,
  type DomPatchAdapter,
  type DomTarget,
} from "@motion5/core/adapters";
import type { RenderMetadata } from "@motion5/core/internal";

// A single-element binding has no stage. `perspective` is a project-level property a composition
// root applies once, and the injected resolver answers every write, so this object is never written
// to and never resolved as a target.
const NO_STAGE: DomTarget = { style: {} };

// One cast, at the one seam where a typed DOM class meets the adapter's dynamic-property contract.
// `DomTarget` carries an index signature because writing renderer-neutral keys is what the adapter
// exists to do, and a class instance can never satisfy an index signature, so the choice is one
// adaptation here or one in every consumer. It is named rather than hidden. See ADR-073.
function asDomTarget(element: Element): DomTarget {
  return element as unknown as DomTarget;
}

export interface DomBinding<T extends Element> {
  /** The one adapter this binding writes through, for the caller's own deliveries. */
  readonly adapter: DomPatchAdapter;
  /** The callback ref that attaches, releases, and re-poses the target. */
  readonly ref: RefCallback<T>;
}

/**
 * The ref lifecycle and the one adapter every DOM binding in this package shares.
 *
 * Binding one node and binding a derivation over several are one lifecycle with two subscription
 * strategies, not two copies of the same eleven lines. What lives here is the target reference, one
 * adapter per binding, adapter cleanup when React hands over a different element, and re-posing a
 * fresh element from whatever the caller can currently write. What deliberately does not live here
 * is the subscription, which is the half the two hooks genuinely differ in. See ADR-075.
 */
export function useDomBinding<T extends Element>(
  metadata: RenderMetadata | undefined,
  pose: (adapter: DomPatchAdapter) => void,
): DomBinding<T> {
  const target = useRef<DomTarget | undefined>(undefined);
  const adapter = useMemo(
    () => createDomPatchAdapter(NO_STAGE, undefined, () => target.current, undefined, metadata),
    [metadata],
  );
  // Detach through `null` rather than a returned cleanup: this package supports React 18, where a
  // ref callback that returns a function is warned about and never called back.
  const ref = useCallback(
    (element: T | null) => {
      const next = element === null ? undefined : asDomTarget(element);
      const previous = target.current;
      if (previous !== undefined && previous !== next) adapter.clear(previous);
      target.current = next;
      if (next !== undefined) pose(adapter);
    },
    [adapter, pose],
  );
  return useMemo(() => ({ adapter, ref }), [adapter, ref]);
}
