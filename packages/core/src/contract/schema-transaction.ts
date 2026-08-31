import type { MotionHandle } from "./motion-handle";
import type { TrackHandle } from "./track-handle";
import type { MotionDefinition, TrackDefinition } from "./v5";

/**
 * The structural authoring surface one recipe is handed, and the whole of what a recipe is for.
 *
 * `ProjectHandle.edit(recipe)` opens one transaction, hands this to the recipe, and commits once the
 * recipe returns. Each op validates on entry, so "each step individually correct" is unchanged; what
 * changes is that commit is a separate verb from edit. `n` ops across `m` tracks cost one candidate
 * build, one graph replacement, one `ObservationState` commit and one flush, where the same sequence
 * spelled one op at a time costs `n` of each.
 *
 * Every member here is a projection of the member `ProjectHandle` already has, deliberately: a second
 * implementation of `addTrack` is a second owner of what an add costs, and the whole point of this
 * slice is that there is one. What the interface buys is the narrowing. `mount`, `seek`, `subscribe`
 * and `dispose` are not reachable through it, because none of them is a structural change and none of
 * them can be undone by a recipe that throws.
 *
 * The handles it returns are the ordinary ones, and their tier 0 and tier 2 members refuse while a
 * recipe is open with `schema-transaction-immediate`. That refusal is the mechanism rather than the
 * type, because `TrackHandle` is one interface across both tiers and splitting it is a change of its
 * own; what a caller may reach is stated here and what it may reach through a handle is refused by
 * name. See ADR-064.
 *
 * Declared in `contract/` rather than in `runtime/`, on the rule the declaration-surface gate
 * enforces: the entry may not name a `runtime/` or a `graph/` module, and `ProjectHandle.edit` takes
 * a function of this type, so a caller that cannot import it cannot write the recipe at all.
 */
export interface SchemaTransaction {
  /**
   * Creates a Motion inside this transaction and returns the handle to it.
   *
   * The same refusals `ProjectHandle.addMotion` has, all of them answered on entry: a trigger the
   * contract rejects, a non-empty `tracks`, and an id this project already carries. The driver itself
   * is built when the transaction commits, so a trigger that cannot be created refuses the whole
   * recipe rather than half of it.
   */
  addMotion(definition: MotionDefinition): MotionHandle;
  /** Resolves one Motion, refusing an id this project does not have. */
  motion(motionId: string): MotionHandle;
  /** The same lookup without the refusal, for a caller whose miss is expected. */
  tryMotion(motionId: string): MotionHandle | undefined;
  /**
   * Adds a track inside this transaction and returns the handle to it.
   *
   * The handle is live for the rest of the recipe, so the next op can read and edit what this one
   * wrote, and it is never live if the recipe throws, because only the commit registers its token.
   */
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
  /**
   * Resolves one track by qualified node id, including one this recipe added.
   *
   * Reads resolve against the staged plan rather than against the retained definitions, which is what
   * makes a two-step edit possible at all: the second step of an edit has to be able to see the
   * first.
   */
  track(nodeId: string): TrackHandle;
  /** The same lookup without the refusal, for a caller whose miss is expected. */
  tryTrack(nodeId: string): TrackHandle | undefined;
}
