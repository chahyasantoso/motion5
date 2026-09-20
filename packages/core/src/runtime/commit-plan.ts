import type { MotionDefinition, TrackDefinition } from "../contract/v5";
import { unreachable } from "../domain/exhaustive";
import { buildOwed, type ValueState } from "./value-state";
/**
 * What one structural commit does, as two closed unions, and the one function that derives them.
 *
 * `#derive` answered a list of `SchemaEffect` records whose `apply` and optional `revert` were
 * closures over the entry the loop was standing on, and `#apply` ran them. So what a commit was
 * about to do existed only as variables captured inside functions nobody could read, print or
 * compare: an inverse was hand-paired at the push site, a settlement step was a bare `() => void`
 * beside it with nothing in either type telling the two apart, and the only way to test any of it
 * was to inject spies and assert on the order they were called in.
 *
 * So an effect is data and a settlement is data. `planCommit` is pure, `invert` is total, and
 * `run-plan.ts` owns the one impure walk over both. A commit becomes a value one case can assert on
 * whole, an inverse becomes a function of what it inverts rather than of whoever pushed it, and the
 * difference between the two lists is stated by their types instead of by which array they went in.
 *
 * The split itself is ADR-071's, restated as types: an effect ran before the graph accepted the
 * candidate and therefore owes an inverse, a settlement runs after acceptance and therefore has
 * none, and no step may be both. Two brands rather than one union with a flag, because a flag is a
 * field a reader can forget to read and a brand is a claim the compiler checks.
 *
 * Issue #443, phase A step 6. See ADR-031, ADR-035, ADR-045, ADR-051, ADR-058, ADR-064, ADR-071.
 */
declare const EFFECT_BRAND: unique symbol;

declare const SETTLEMENT_BRAND: unique symbol;

/**
 * The two mint marks, for the reason issue #387 gave: a variant declaring only its discriminant is
 * not closed, because the excess-property check reads a fresh object literal rather than a value
 * arriving through a variable. Declared, never exported and never assigned at run time, so no other
 * module can name either key and no property exists to carry. See ADR-084.
 */
interface EffectBrand {
  readonly [EFFECT_BRAND]: true;
}

interface SettlementBrand {
  readonly [SETTLEMENT_BRAND]: true;
}

type MintedEffect<Shape extends EffectShape> = Shape & EffectBrand;

type MintedSettlement<Shape extends SettlementShape> = Shape & SettlementBrand;

interface CreateMotionShape {
  readonly kind: "create-motion";
  readonly definition: MotionDefinition;
}

interface DestroyMotionShape {
  readonly kind: "destroy-motion";
  readonly motionId: string;
}

interface CompileTrackShape {
  readonly kind: "compile-track";
  readonly nodeId: string;
  readonly track: TrackDefinition;
}

interface DisposeTrackShape {
  readonly kind: "dispose-track";
  readonly nodeId: string;
}

interface StageTrackShape {
  readonly kind: "stage-track";
  readonly nodeId: string;
  readonly track: TrackDefinition;
}

interface RollbackStageShape {
  readonly kind: "rollback-stage";
  readonly nodeId: string;
}

/**
 * Republishing one Motion's child at a new duration, carrying the duration it had.
 *
 * The one effect whose inverse needs a payload rather than only a target, which is why the previous
 * duration rides the effect instead of being looked up when rollback runs: the retained definition
 * has been replaced by then, so a lookup would answer the new duration and `invert` would be the
 * identity. See ADR-045.
 */
interface RetargetMotionTrackShape {
  readonly kind: "retarget-motion-track";
  readonly motionId: string;
  readonly nodeId: string;
  readonly duration?: number;
  readonly previousDuration?: number;
}

type EffectShape =
  | CreateMotionShape
  | DestroyMotionShape
  | CompileTrackShape
  | DisposeTrackShape
  | StageTrackShape
  | RollbackStageShape
  | RetargetMotionTrackShape;

/**
 * One thing a commit does before the candidate graph is accepted, and therefore one thing a
 * rollback may owe an inverse for. Every variant names its target and carries nothing it could have
 * derived from the pair the plan was built against.
 */
export type Effect =
  | MintedEffect<CreateMotionShape>
  | MintedEffect<DestroyMotionShape>
  | MintedEffect<CompileTrackShape>
  | MintedEffect<DisposeTrackShape>
  | MintedEffect<StageTrackShape>
  | MintedEffect<RollbackStageShape>
  | MintedEffect<RetargetMotionTrackShape>;

interface CommitStagedShape {
  readonly kind: "commit-staged";
  readonly nodeId: string;
}

interface DisposeSettledTrackShape {
  readonly kind: "dispose-track";
  readonly nodeId: string;
}

interface EvictNodeShape {
  readonly kind: "evict-node";
  readonly nodeId: string;
}

interface MountNodeShape {
  readonly kind: "mount-node";
  readonly nodeId: string;
}

interface AddMotionTrackShape {
  readonly kind: "add-motion-track";
  readonly motionId: string;
  readonly nodeId: string;
  readonly duration?: number;
}

interface RemoveMotionTrackShape {
  readonly kind: "remove-motion-track";
  readonly motionId: string;
  readonly nodeId: string;
}

interface DestroySettledMotionShape {
  readonly kind: "destroy-motion";
  readonly motionId: string;
}

interface PublishShape {
  readonly kind: "publish";
  readonly seeds: readonly string[];
}

type SettlementShape =
  | CommitStagedShape
  | DisposeSettledTrackShape
  | EvictNodeShape
  | MountNodeShape
  | AddMotionTrackShape
  | RemoveMotionTrackShape
  | DestroySettledMotionShape
  | PublishShape;

/**
 * One thing a commit does after the candidate graph is accepted, which nothing can undo.
 *
 * `dispose-track` and `destroy-motion` name the same work as their effect twins and are separate
 * variants anyway, because which of the two lists a step is in decides whether its failure rolls
 * the commit back or is collected and reported beside its siblings, and that is a difference the
 * type states rather than one a reader has to remember. Publication is the last settlement rather
 * than a fourth field on the plan, so the one step that must happen after everything else is
 * ordered by the same list that orders everything else. See ADR-071.
 */
export type Settlement =
  | MintedSettlement<CommitStagedShape>
  | MintedSettlement<DisposeSettledTrackShape>
  | MintedSettlement<EvictNodeShape>
  | MintedSettlement<MountNodeShape>
  | MintedSettlement<AddMotionTrackShape>
  | MintedSettlement<RemoveMotionTrackShape>
  | MintedSettlement<DestroySettledMotionShape>
  | MintedSettlement<PublishShape>;

/**
 * Mints one effect, and is the only expression in the program that produces an `Effect`.
 *
 * Generic in the shape rather than taking `object`, which is the hole this closes: the retired
 * spelling asserted an arbitrary object into the union, so a literal that misspelled a key or
 * omitted `nodeId` type-checked at its push site and failed at the port instead, and the exhaustive
 * switches downstream were exhaustive over a union nothing had checked the producers against. Every
 * push is now checked against the variant it names, and the assertion covers only the brand, which
 * is the one thing no value can carry.
 */
function mintEffect<Shape extends EffectShape>(shape: Shape): MintedEffect<Shape> {
  return Object.freeze(shape) as unknown as MintedEffect<Shape>;
}

/** Mints one settlement, on the same terms and for the same reason. */
function mintSettlement<Shape extends SettlementShape>(shape: Shape): MintedSettlement<Shape> {
  return Object.freeze(shape) as unknown as MintedSettlement<Shape>;
}

interface FreePlannedTrack {
  readonly kind: "free";
  readonly track: TrackDefinition;
  readonly valueState: ValueState;
}

interface OwnedPlannedTrack {
  readonly kind: "owned";
  readonly track: TrackDefinition;
  readonly motionId: string;
  readonly valueState: ValueState;
}

/** One track's committed facts, which is every part of a `TrackEntry` a plan may read. */
type PlannedTrack = FreePlannedTrack | OwnedPlannedTrack;

function plannedMotionId(entry: PlannedTrack): string | undefined {
  switch (entry.kind) {
    case "free":
      return undefined;
    case "owned":
      return entry.motionId;
    default:
      return unreachable(entry);
  }
}

/** One motion's committed facts, which is its retained definition and nothing beside it. */
interface PlannedMotion {
  readonly definition: MotionDefinition;
}

/**
 * One side of a commit: the retained pair, or the candidate pair, as the planner reads them.
 *
 * Structural rather than nominal, and deliberately narrower than the runtime's own entries. A plan
 * reads the definition, the owner and the value state, and it cannot read a lifetime token. That is
 * not tidiness: `#assertSameLifetimes` judges tokens before planning begins, and a second reader of
 * them here would be a second owner of the one question about whether an id was removed and
 * recreated inside a single transaction. See ADR-056 and ADR-061.
 */
export interface CommitDocument {
  readonly tracks: ReadonlyMap<string, PlannedTrack>;
  readonly motions: ReadonlyMap<string, PlannedMotion>;
}

/**
 * The two answers the planner cannot derive for itself, asked of the runtime before it runs.
 *
 * `needsBuild` is `#needsTimelineBuild`'s answer for each replaced node and `readers` is
 * `#readersOf`'s for each removed one. Both reach code this layer does not own: the first resolves
 * a candidate through the injected plugin registry and can refuse the whole commit, and the second
 * walks the live graph. Asking them here is what makes `planCommit` pure, and that is the boundary
 * this type exists to draw: everything upstream of it may call out and may throw, and nothing
 * downstream of it does either. A planner that resolved its own inputs would be a planner no case
 * can drive without a registry and a graph. See ADR-051, ADR-062 and `RA-105`.
 */
export interface CommitPreflight {
  readonly needsBuild: ReadonlySet<string>;
  readonly readers: ReadonlyMap<string, readonly string[]>;
}

/** What one commit does, what it settles afterwards, and the nodes its publication seeds. */
export interface CommitPlan {
  readonly effects: readonly Effect[];
  readonly settle: readonly Settlement[];
  readonly touched: readonly string[];
}

/**
 * The plan that moves `retained` to `candidate`, derived from the final pair and never from a log.
 *
 * Pure, and the order below is the contract rather than an artefact of how the loops fell out, so
 * it is stated once here instead of at the twelve pushes.
 *
 * New Motions are created first, so a recipe that added a Motion and a track for it compiles the
 * track against an owner that already exists. Removals settle next, as eviction, then compiled
 * disposal, then deregistration from their Motion, because Motion resolves compiled Tracks by id
 * and releasing in the other order would leave it holding a dangling one. Removed Motions settle
 * after the children they owned. A new track compiles as an effect and mounts as a settlement,
 * because compilation is reversible and mounting is not. A replacement stages only when a build is
 * owed, republishes its Motion child before acceptance, and finalizes the stage after it.
 * Publication is the last settlement, seeded by every node that changed plus the readers of every
 * node that left.
 *
 * A replacement whose candidate definition is the retained one by identity plans nothing at all,
 * which is what lets a recipe of nothing but no-ops end without a candidate build. See ADR-051,
 * ADR-058, ADR-064 and ADR-066.
 */
export function planCommit(
  retained: CommitDocument,
  candidate: CommitDocument,
  preflight: CommitPreflight,
): CommitPlan {
  const effects: Effect[] = [];
  const settle: Settlement[] = [];
  const touched: string[] = [];
  for (const [motionId, motion] of candidate.motions)
    if (!retained.motions.has(motionId))
      effects.push(
        mintEffect<CreateMotionShape>({ kind: "create-motion", definition: motion.definition }),
      );
  for (const [nodeId, entry] of retained.tracks) {
    if (candidate.tracks.has(nodeId)) continue;
    settle.push(
      mintSettlement<EvictNodeShape>({ kind: "evict-node", nodeId }),
      mintSettlement<DisposeSettledTrackShape>({ kind: "dispose-track", nodeId }),
    );
    const motionId = plannedMotionId(entry);
    if (motionId !== undefined)
      settle.push(
        mintSettlement<RemoveMotionTrackShape>({
          kind: "remove-motion-track",
          motionId,
          nodeId,
        }),
      );
    // The readers of a node that left, taken from the old graph, because they are what a removal
    // invalidates and the accepted graph no longer names the edge.
    touched.push(...(preflight.readers.get(nodeId) ?? []));
  }
  for (const motionId of retained.motions.keys())
    if (!candidate.motions.has(motionId))
      settle.push(mintSettlement<DestroySettledMotionShape>({ kind: "destroy-motion", motionId }));
  for (const [nodeId, entry] of candidate.tracks) {
    const previous = retained.tracks.get(nodeId);
    if (previous === undefined) {
      effects.push(
        mintEffect<CompileTrackShape>({ kind: "compile-track", nodeId, track: entry.track }),
      );
      const motionId = plannedMotionId(entry);
      if (motionId !== undefined)
        settle.push(
          mintSettlement<AddMotionTrackShape>({
            kind: "add-motion-track",
            motionId,
            nodeId,
            duration: entry.track.duration,
          }),
        );
      settle.push(mintSettlement<MountNodeShape>({ kind: "mount-node", nodeId }));
      touched.push(nodeId);
      continue;
    }
    if (previous.track === entry.track) continue;
    if (preflight.needsBuild.has(nodeId) || buildOwed(previous.valueState))
      effects.push(
        mintEffect<StageTrackShape>({ kind: "stage-track", nodeId, track: entry.track }),
      );
    const motionId = plannedMotionId(entry);
    if (motionId !== undefined)
      effects.push(
        mintEffect<RetargetMotionTrackShape>({
          kind: "retarget-motion-track",
          motionId,
          nodeId,
          duration: entry.track.duration,
          previousDuration: previous.track.duration,
        }),
      );
    settle.push(mintSettlement<CommitStagedShape>({ kind: "commit-staged", nodeId }));
    touched.push(nodeId);
  }
  settle.push(
    mintSettlement<PublishShape>({ kind: "publish", seeds: Object.freeze([...touched]) }),
  );
  return Object.freeze({
    effects: Object.freeze(effects),
    settle: Object.freeze(settle),
    touched: Object.freeze(touched),
  });
}

/**
 * The effect that undoes `effect`, or `undefined` when there is nothing to undo.
 *
 * Total, so an eighth effect owes a decision here rather than silently rolling back to nothing,
 * which is the failure a hand-paired `revert` closure could not be checked for: a push site that
 * forgot one was indistinguishable from a step that genuinely had none. Three variants answer
 * `undefined` because they are inverses themselves. Nothing in this layer can un-destroy a Motion,
 * un-dispose a compiled Track or un-roll-back a stage, and a rollback that pretended otherwise
 * would run a host's teardown twice. See ADR-031, ADR-035 and ADR-045.
 */
export function invert(effect: Effect): Effect | undefined {
  switch (effect.kind) {
    case "create-motion":
      return mintEffect<DestroyMotionShape>({
        kind: "destroy-motion",
        motionId: effect.definition.id,
      });
    case "compile-track":
      return mintEffect<DisposeTrackShape>({ kind: "dispose-track", nodeId: effect.nodeId });
    case "stage-track":
      return mintEffect<RollbackStageShape>({ kind: "rollback-stage", nodeId: effect.nodeId });
    case "retarget-motion-track":
      return mintEffect<RetargetMotionTrackShape>({
        kind: "retarget-motion-track",
        motionId: effect.motionId,
        nodeId: effect.nodeId,
        duration: effect.previousDuration,
        previousDuration: effect.duration,
      });
    case "destroy-motion":
    case "dispose-track":
    case "rollback-stage":
      return undefined;
    default:
      return unreachable(effect);
  }
}
