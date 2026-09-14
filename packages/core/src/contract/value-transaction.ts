import type { AuthoredValues, TrackHandle } from "./track-handle";
import type { PatchBatch } from "./v5";

/**
 * The value authoring surface one batch is handed, and the whole of what a batch is for.
 *
 * `ProjectHandle.values(recipe)` opens one batch, hands this to the recipe, and publishes once when
 * the recipe returns. Every verb reached inside it still applies its own write immediately and still
 * refuses on its own terms, so "each step individually correct" is unchanged; what changes is that
 * publication is a separate thing from the write. `n` writes across `n` nodes cost one invalidate,
 * one notification per affected node and one sequence move, where the same sequence spelled one
 * write at a time costs `n` of each.
 *
 * Every member here is a projection of a verb this runtime already has, deliberately: a second
 * implementation of `setValues` would be a second owner of what a live write costs, and the whole
 * point of the tier is that there is one. What the interface buys is the narrowing, and only that.
 * It is not a fence, for the reason `SchemaTransaction`'s own record gives: a recipe closes over the
 * `ProjectHandle` it was called on, so what it may not do while a batch is open is answered by the
 * verbs themselves. Everything that publishes or mounts refuses by name with
 * `value-batch-immediate`, and every structural verb refuses with `value-batch-structural` at the
 * one member all of them reach.
 *
 * `track` and `tryTrack` answer the ordinary `TrackHandle`, whose value members join this batch
 * exactly as the three node-addressed verbs above do. That is why no node-addressed `setKeyframe` is
 * projected here: a `(nodeId, plugin, key, value)` spelling would lose the lifetime token the handle
 * captured, which is the staleness gate ADR-056 made total, and it would be a second owner of a verb
 * `TrackHandle` already owns.
 *
 * What a staged verb answers in the meantime is the deferred batch: its own node as the seed, no
 * patches, and one `value-batch-deferred` warning saying the publication was queued. Answering
 * nothing instead was refused, because `TrackHandle` is one interface across batched and unbatched
 * use, and a member with two return contracts, a nullable nobody checks, or a second narrowed handle
 * interface are all shapes this project refuses by name.
 *
 * Declared in `contract/` rather than in `runtime/`, on the rule the declaration-surface gate
 * enforces: the entry may not name a `runtime/` or a `graph/` module, and `ProjectHandle.values`
 * takes a function of this type, so a caller that cannot import it cannot write the recipe at all.
 * See ADR-078.
 */
export interface ValueTransaction {
  /**
   * Scrubs one leaf to `progress`, staging its publication rather than performing it.
   *
   * The verb `ProjectHandle.seek` is, unchanged, including that a driver-backed Motion overwrites a
   * seeked value on its next emission.
   */
  seek(nodeId: string, progress: number): PatchBatch;
  /**
   * Rewrites one node's authored values, so its retained definition moves with them.
   *
   * `ProjectHandle.setValues` with its publication deferred, and nothing else about it moves: the
   * refusals, the mask, the animated escalation and the retained definition are all where ADR-059
   * and ADR-060 put them.
   */
  setValues(nodeId: string, values: AuthoredValues): PatchBatch;
  /** The revertible half, leaving the authored definition exactly as it was. See ADR-060. */
  overrideValues(nodeId: string, values: AuthoredValues): PatchBatch;
  /**
   * Resolves one track by qualified node id, refusing an id this project does not have.
   *
   * The ordinary handle, so `setValues`, `overrideValues`, `setKeyframe` and `removeKeyframe` on it
   * join this batch while its structural members refuse.
   */
  track(nodeId: string): TrackHandle;
  /** The same lookup without the refusal, for a caller whose miss is expected. */
  tryTrack(nodeId: string): TrackHandle | undefined;
}
