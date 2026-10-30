import type { MotionDefinition, TrackDefinition } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";
import { buildOwed, type ValueState } from "./value-state";
/** Effects run before acceptance and owe an inverse; settlements run after and have none; no step is both. `planCommit` is pure; `run-plan.ts` owns the impure walk over both. */
declare const EFFECT_BRAND: unique symbol;

declare const SETTLEMENT_BRAND: unique symbol;

/** Brands close both unions: declared, never exported, never assigned, so only the mint helpers can name either key and no other module can build an `Effect` or `Settlement`. */
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

/** Republishing one Motion's child at a new duration, carrying the duration it had: the one effect whose inverse needs a payload, since by rollback a lookup would answer the new duration. */
interface RetargetMotionTrackShape {
  readonly kind: "retarget-motion-track";
  readonly motionId: string;
  readonly nodeId: string;
  readonly duration?: number;
  readonly previousDuration?: number;
}

/** The retarget's one constructor, shared by plan and `invert`, which swaps the durations. No-duration tracks omit the field, not `undefined` -> an inverse's inverse stays identical. */
function retargetEffect(
  motionId: string,
  nodeId: string,
  duration: number | undefined,
  previousDuration: number | undefined,
): MintedEffect<RetargetMotionTrackShape> {
  return mintEffect<RetargetMotionTrackShape>({
    kind: "retarget-motion-track",
    motionId,
    nodeId,
    ...(duration === undefined ? {} : { duration }),
    ...(previousDuration === undefined ? {} : { previousDuration }),
  });
}

type EffectShape =
  | CreateMotionShape
  | DestroyMotionShape
  | CompileTrackShape
  | DisposeTrackShape
  | StageTrackShape
  | RollbackStageShape
  | RetargetMotionTrackShape;

/** One thing a commit does before the candidate graph is accepted, and so one thing a rollback may owe an inverse for. */
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

/** One thing a commit does after the graph is accepted, which nothing can undo. Which list a step is in decides whether its failure rolls the commit back or is collected beside its siblings. */
export type Settlement =
  | MintedSettlement<CommitStagedShape>
  | MintedSettlement<DisposeSettledTrackShape>
  | MintedSettlement<EvictNodeShape>
  | MintedSettlement<MountNodeShape>
  | MintedSettlement<AddMotionTrackShape>
  | MintedSettlement<RemoveMotionTrackShape>
  | MintedSettlement<DestroySettledMotionShape>
  | MintedSettlement<PublishShape>;

/** Mints one effect, the program's only `Effect` producer. Generic in the shape, so every push is checked against the variant it names; the cast covers only the brand, which no value can carry. */
function mintEffect<Shape extends EffectShape>(shape: Shape): MintedEffect<Shape> {
  return Object.freeze(shape) as unknown as MintedEffect<Shape>;
}

/** Mints one settlement, on the same terms. */
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

/** One side of a commit as the planner reads it: definition, owner and value state, never a lifetime token. `#assertSameLifetimes` judges tokens before planning and owns that question alone. */
export interface CommitDocument {
  readonly tracks: ReadonlyMap<string, PlannedTrack>;
  readonly motions: ReadonlyMap<string, PlannedMotion>;
}

/** Answers `planCommit` cannot derive -> the caller filling them owns any refusal. `needsBuild` resolves via the plugin registry and can refuse the whole commit; `readers` walks the live graph. */
export interface CommitPreflight {
  readonly needsBuild: ReadonlySet<string>;
  readonly readers: ReadonlyMap<string, readonly string[]>;
  /** Binding-edited nodes: compiled inputs differ, timeline must not rebuild. A later replacement in the same recipe clears the mark, so a full build is never skipped. */
  readonly noBuild: ReadonlySet<string>;
}

/** What one commit does, what it settles afterwards, and the nodes its publication seeds. */
export interface CommitPlan {
  readonly effects: readonly Effect[];
  readonly settle: readonly Settlement[];
  readonly touched: readonly string[];
}

/** The plan that moves `retained` to `candidate`, derived whole from the final pair and never from a log. Pure; the order of the steps below is the contract, not how the loops fell out. */
export function planCommit(
  retained: CommitDocument,
  candidate: CommitDocument,
  preflight: CommitPreflight,
): CommitPlan {
  const effects: Effect[] = [];
  const settle: Settlement[] = [];
  const touched: string[] = [];
  // new Motions first, so a recipe adding a Motion and its track compiles the track against an owner that exists.
  for (const [motionId, motion] of candidate.motions)
    if (!retained.motions.has(motionId))
      effects.push(
        mintEffect<CreateMotionShape>({ kind: "create-motion", definition: motion.definition }),
      );
  // removals settle next: evict, then compiled disposal, then deregistration from their Motion, since Motion resolves compiled Tracks by id and the other order leaves a dangling one.
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
    // a departed node's readers, taken from the old graph: they are what a removal invalidates, and the accepted graph drops the edge.
    touched.push(...(preflight.readers.get(nodeId) ?? []));
  }
  // removed Motions settle after the children they owned.
  for (const motionId of retained.motions.keys())
    if (!candidate.motions.has(motionId))
      settle.push(mintSettlement<DestroySettledMotionShape>({ kind: "destroy-motion", motionId }));
  for (const [nodeId, entry] of candidate.tracks) {
    const previous = retained.tracks.get(nodeId);
    if (previous === undefined) {
      // a new track compiles as an effect and mounts as a settlement: compilation is reversible, mounting is not.
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
            ...(entry.track.duration === undefined ? {} : { duration: entry.track.duration }),
          }),
        );
      settle.push(mintSettlement<MountNodeShape>({ kind: "mount-node", nodeId }));
      touched.push(nodeId);
      continue;
    }
    // a replacement carrying the retained definition by identity plans nothing, so an all-no-op recipe ends without a candidate build.
    if (previous.track === entry.track) continue;
    if (
      (preflight.needsBuild.has(nodeId) || buildOwed(previous.valueState)) &&
      !preflight.noBuild.has(nodeId)
    )
      effects.push(
        mintEffect<StageTrackShape>({ kind: "stage-track", nodeId, track: entry.track }),
      );
    const motionId = plannedMotionId(entry);
    if (motionId !== undefined)
      effects.push(retargetEffect(motionId, nodeId, entry.track.duration, previous.track.duration));
    settle.push(mintSettlement<CommitStagedShape>({ kind: "commit-staged", nodeId }));
    touched.push(nodeId);
  }
  // publication is the last settlement, seeded by every node that changed plus the readers of every node that left.
  settle.push(
    mintSettlement<PublishShape>({ kind: "publish", seeds: Object.freeze([...touched]) }),
  );
  return Object.freeze({
    effects: Object.freeze(effects),
    settle: Object.freeze(settle),
    touched: Object.freeze(touched),
  });
}

/** The effect that undoes `effect`, or `undefined` when there is nothing to undo. Total, so an eighth effect breaks the build here rather than rolling back to nothing. */
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
      return retargetEffect(
        effect.motionId,
        effect.nodeId,
        effect.previousDuration,
        effect.duration,
      );
    // these three are their own inverses: nothing here un-destroys a Motion, un-disposes a compiled Track or un-rolls back a stage, and a fake inverse would run a host's teardown twice.
    case "destroy-motion":
    case "dispose-track":
    case "rollback-stage":
      return undefined;
    default:
      return unreachable(effect);
  }
}
