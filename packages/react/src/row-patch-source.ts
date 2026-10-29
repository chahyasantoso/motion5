import type { LivePatch, Patch, PatchSource } from "@motion5/core/internal";
import { selectRow, unreachable } from "@motion5/core/internal";

/**
 * One row of one named table output, projected as a patch source for one consumer-only target id.
 *
 * A row is not a published node. The pose table belongs to the node that evaluated it, and a marker,
 * a bone label or a joint handle that reads one row is a consumer projection over that node rather
 * than a graph node of its own. This wrapper is the whole of that projection: it selects one row
 * through the core selector, renames the result to the consumer's alias and forwards everything
 * else unchanged. It adds no subscription of its own, no cache, and no engine state, so releasing one
 * subscriber cannot release another and creating the wrapper cannot acquire engine ownership.
 *
 * The mapping is captured at construction. Replacing it means constructing another source and
 * letting the existing hook lifecycle release the old subscription, which is also why an alias is
 * routed by configuration and never by asking the underlying source whether the alias exists.
 */
export interface RowPatchOptions {
  /** The published node whose output holds the row. */
  readonly nodeId: string;
  /** The named output on that node. `values` is not a fallback; it has to be named. */
  readonly output: string;
  /** The row envelope id the caller selects. */
  readonly rowId: string;
  /** The consumer-only target id this wrapper answers to. */
  readonly as: string;
}

/**
 * Projects one row as `as`, leaving every other node id on the underlying source.
 *
 * A ready selection keeps the source revision, progress, source revisions and diagnostics, and
 * exposes only `{ values: cells }`, with the cells reference preserved: a consumer view is not a new
 * engine publication and acquires no revision. Any selection failure on a ready patch answers as a
 * `blocked` patch carrying alias identity, the source revision and the source diagnostics, which is
 * what makes `useDerivedDomPatch` hide the target rather than draw a stale row. The refusal is local
 * and is never written back to the engine.
 *
 * Blocked and error patches forward with their status and diagnostics intact; a destroyed event
 * forwards as an alias destroyed patch carrying identity only. `get` answers the live union and so
 * never returns a terminal patch, while `subscribeNode` delivers every variant: the asymmetry is the
 * source contract's, not this wrapper's to change.
 */
export function rowPatchSource(source: PatchSource, options: RowPatchOptions): PatchSource {
  const { nodeId, output, rowId, as } = options;
  // One projection per source publication, so `getSnapshot` is referentially stable between
  // publications as `useSyncExternalStore` requires. This is identity memoization and not a
  // last-good row: the source patch is the key, and a removed or replaced publication is never
  // answered from the map because a new key is a new projection.
  const projected = new WeakMap<LivePatch, LivePatch>();

  function project(patch: LivePatch): LivePatch;
  function project(patch: Patch): Patch;
  function project(patch: Patch): Patch {
    switch (patch.status) {
      case "ready": {
        const value = Object.prototype.hasOwnProperty.call(patch.outputs, output)
          ? patch.outputs[output]
          : undefined;
        const picked = selectRow(value, rowId);
        switch (picked.kind) {
          case "row":
            return {
              nodeId: as,
              revision: patch.revision,
              status: "ready",
              outputs: { values: picked.cells },
              sourceProgress: patch.sourceProgress,
              sourceRevisions: patch.sourceRevisions,
              diagnostics: patch.diagnostics,
            };
          case "missing-row":
          case "missing-output":
          case "wrong-kind":
            return {
              nodeId: as,
              revision: patch.revision,
              status: "blocked",
              diagnostics: patch.diagnostics,
            };
          default:
            return unreachable(picked);
        }
      }
      case "blocked":
      case "error":
        return { ...patch, nodeId: as };
      case "destroyed":
        return { nodeId: as, revision: patch.revision, status: "destroyed" };
      default:
        return unreachable(patch);
    }
  }

  function projectLive(patch: LivePatch): LivePatch {
    const cached = projected.get(patch);
    if (cached !== undefined) return cached;
    const next = project(patch);
    projected.set(patch, next);
    return next;
  }

  return {
    get(requested) {
      if (requested !== as) return source.get(requested);
      const patch = source.get(nodeId);
      return patch === undefined ? undefined : projectLive(patch);
    },
    subscribeNode(requested, listener) {
      if (requested !== as) return source.subscribeNode(requested, listener);
      return source.subscribeNode(nodeId, (patch) =>
        listener(patch.status === "destroyed" ? project(patch) : projectLive(patch)),
      );
    },
  };
}
