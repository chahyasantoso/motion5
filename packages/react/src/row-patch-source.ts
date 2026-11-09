import type { LivePatch, Patch, PatchSource } from "@motion5/core/internal";
import { selectRow, unreachable } from "@motion5/core/internal";

/**
 * One row of a named table output, projected as a patch source for one consumer-only target id.
 * Selects, renames to `as`, forwards the rest: no subscription, no cache, no ownership. */
export interface RowPatchOptions {
  /** Published node whose output holds the row. */
  readonly nodeId: string;
  /** Named output on that node; `values` is not a fallback. */
  readonly output: string;
  /** Row envelope id the caller selects. */
  readonly rowId: string;
  /** Consumer-only target id this wrapper answers to. */
  readonly as: string;
}

/**
 * Projects one row as `as`, other ids as the source; a selection failure answers `blocked`.
 * `get` never answers terminal, `subscribeNode` delivers every variant. */
export function rowPatchSource(source: PatchSource, options: RowPatchOptions): PatchSource {
  const { nodeId, output, rowId, as } = options;
  // One projection per publication, keyed by patch identity: a stable snapshot as
  // `useSyncExternalStore` requires; a new key never answers a replaced publication.
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
