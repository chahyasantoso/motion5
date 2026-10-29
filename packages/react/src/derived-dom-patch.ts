import { useCallback, useEffect, useMemo, type RefCallback } from "react";
import type { DomPatchAdapter } from "@motion5/core/adapters";
import { patchRender, selectRecord, unreachable } from "@motion5/core/internal";
import type { PatchSource } from "@motion5/core/internal";
import { useDomBinding } from "./dom-binding";

/**
 * The composed values of one source node, as a derivation receives them.
 *
 * A derivation reads a flat record. A published `values` output may also be a table, which has no
 * key space to derive geometry from, and the binding treats that like any other unusable status:
 * the target is hidden. A row-derived consumer reads one selected row through the row projection
 * below, rather than giving this derivation a table it could not interpret.
 */
export type PatchValues = Readonly<Record<string, unknown>>;

/**
 * A consumer's geometry, as a pure function of its source nodes' values.
 *
 * Returns the renderable record to write, or `undefined` for nothing to draw from these values,
 * which the binding writes as a hidden target rather than as an unmount. Positional, in the order
 * the ids were named. It is called on every publication of every node it reads, so keep it pure, and
 * keep its identity stable: declare it at module scope, or memoize it.
 */
export type PatchDerivation = (
  values: readonly PatchValues[],
) => Readonly<Record<string, unknown>> | undefined;

// Absence, as the one write a derivation cannot express itself. A bound element cannot unmount
// itself, and removing the geometry alone would collapse a line onto the origin rather than hide it,
// so the binding writes the hide and the adapter's omitted-key removal takes it back on the first
// frame that derives again. See ADR-075.
const NOT_DERIVABLE: Readonly<Record<string, unknown>> = Object.freeze({ visibility: "hidden" });

/**
 * Binds a derivation over one or more published nodes to one DOM or SVG target.
 *
 * `useDomPatch` writes one node's pose. Every consumer that combines two nodes, or maps one node's
 * values onto its element's own geometry, was left on `usePatch` and therefore on a React render per
 * published patch, at tick rate. This hook owns the fan-in and nothing else: geometry stays with the
 * consumer in the derivation, and translating a record into writes stays with
 * `createDomPatchAdapter`, through `applyValues`, so transform composition, dirty diffing and
 * omitted-key removal have one owner for one node and for many.
 *
 * Liveness is this binding's rule, unlike `useDomPatch`'s: a derivation is a function of every node
 * it names, so one input that is blocked, errored or destroyed makes the whole result meaningless,
 * and the target is hidden until every input is ready again. That is what lets a derivation take
 * values and never a status, which is what keeps the rule out of every consumer.
 *
 * Values are read from the source on each delivery rather than accumulated here, so the registry
 * stays the only owner of what a node currently holds and no batch order can leave the target
 * composed from a mix that outlives its own batch. No scheduler: a batch that delivers twice writes
 * twice, and the adapter's dirty diff makes the second one nothing.
 *
 * `PatchSource` is all this takes. A derivation authors its own keys, so there is no plugin output to
 * serialize and no metadata channel to require. See ADR-075.
 */
export function useDerivedDomPatch<T extends Element>(
  source: PatchSource,
  nodeIds: readonly string[],
  derive: PatchDerivation,
): RefCallback<T> {
  // The ids are the subscription, so a fresh array literal on every render must not be a new one.
  // Serialized rather than joined, so that no separator has to be a character an id cannot hold, and
  // readable as the label this binding writes under.
  const key = JSON.stringify(nodeIds);
  const ids = useMemo(() => JSON.parse(key) as readonly string[], [key]);
  const pose = useCallback(
    (adapter: DomPatchAdapter) => {
      const values: PatchValues[] = [];
      for (const id of ids) {
        const patch = source.get(id);
        const decision = patchRender(patch);
        if (decision.kind !== "render") {
          adapter.applyValues(key, NOT_DERIVABLE);
          return;
        }
        const picked = selectRecord(decision.patch.outputs.values);
        switch (picked.kind) {
          case "record":
            values.push(picked.values);
            break;
          case "missing-output":
          case "wrong-kind":
            adapter.applyValues(key, NOT_DERIVABLE);
            return;
          default:
            return unreachable(picked);
        }
      }
      adapter.applyValues(key, derive(values) ?? NOT_DERIVABLE);
    },
    [derive, ids, key, source],
  );
  const binding = useDomBinding<T>(undefined, pose);

  // Subscribe to every source before the first write, for the reason the one-node binding does it in
  // that order too: a publication between the two would otherwise be lost.
  useEffect(() => {
    const releases = ids.map((id) => source.subscribeNode(id, () => pose(binding.adapter)));
    pose(binding.adapter);
    return () => {
      for (const release of releases) release();
    };
  }, [binding, ids, pose, source]);

  return binding.ref;
}
