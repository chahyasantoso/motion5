import type { MotionDefinition, TrackDefinition } from "../contract/v5";
import { unreachable } from "../domain/exhaustive";
import { rejectAfterRollback, runRollbackSteps, runSettleSteps } from "./rollback";
import { invert, type CommitPlan, type Effect, type Settlement } from "./commit-plan";
/**
 * The one impure walk over a derived commit, and the only module in this folder that performs one.
 *
 * `commit-plan.ts` answers what a commit does; this answers when. Keeping them apart is what lets
 * the planner be tested with no spies at all, and it is also what keeps this module small enough to
 * read in one sitting: every decision left here is about failure, because every decision about
 * content was already taken upstream.
 *
 * Three orderings live here and nowhere else. Liveness is re-asked after each effect, because an
 * effect reaches injected code that can dispose this project, and it is asked after the effect has
 * been recorded rather than before, so a disposal arriving mid-flight rolls that effect back instead
 * of leaking it. Inverses run in apply order, which restores a displaced compiled Track before
 * Motion resolves it. Settlement attempts every step and collects, because an accepted graph cannot
 * be rolled back and one failing release must not skip the releases after it.
 *
 * Issue #443, phase A step 6. See ADR-031, ADR-035, ADR-045, ADR-067, ADR-069 and ADR-071.
 */

/**
 * A replacement the staging seam has already installed, with its displaced Track held for rollback.
 *
 * The runtime's `StagedTrack` as this layer needs it, declared separately because this module may
 * not depend on the runtime that calls it. `undefined` wherever a handle is expected is a stage that
 * was never taken, which is the ordinary answer when no staging seam is installed at all.
 */
export interface PlanStaged {
  commit(): void;
  rollback(): void;
}

/**
 * Every seam one plan can reach, as one total record.
 *
 * Total rather than optional, and that is the point of the type: the runtime holds its hooks as
 * optional and answers nothing for the ones a host never installed, and it collapses that question
 * to a call that does nothing before reaching here. So no member below is optional, no reader in
 * this file writes `?.`, and a seam that does nothing is a seam whose implementation does nothing
 * rather than a seam whose absence every reader has to remember.
 *
 * `assertLive`, `accept` and `adopt` are ports for the same reason the other thirteen are. This
 * module owns when each happens and owns nothing whatever about what any of them means.
 */
export interface PlanPorts {
  readonly createMotion: (definition: MotionDefinition) => void;
  readonly destroyMotion: (motionId: string) => void;
  readonly compileTrack: (track: TrackDefinition, nodeId: string) => void;
  readonly disposeTrack: (nodeId: string) => void;
  readonly stageTrack: (track: TrackDefinition, nodeId: string) => PlanStaged | undefined;
  readonly commitStaged: (staged: PlanStaged | undefined, nodeId: string) => void;
  readonly rollbackStaged: (staged: PlanStaged | undefined, nodeId: string) => void;
  readonly replaceMotionTrack: (motionId: string, nodeId: string, duration?: number) => void;
  readonly evictNode: (nodeId: string) => void;
  readonly mountNode: (nodeId: string) => void;
  readonly addMotionTrack: (motionId: string, nodeId: string, duration?: number) => void;
  readonly removeMotionTrack: (motionId: string, nodeId: string) => void;
  readonly assertLive: () => void;
  readonly accept: () => void;
  readonly adopt: () => void;
  readonly publish: (seeds: readonly string[]) => void;
}

/**
 * The stage each node's replacement produced, held for whichever of two later steps claims it.
 *
 * A stage is the one effect that answers something a later step needs, and the two steps that can
 * claim it are opposites: `commit-staged` finalizes it and `rollback-stage` releases it. Keyed by
 * node here rather than carried on the settlement, because the settlement was planned before the
 * stage existed.
 */
type StagedByNode = Map<string, PlanStaged | undefined>;

/**
 * Performs one effect, and is the one place an effect kind becomes a call.
 *
 * Total, so an eighth effect breaks the build here as well as in `invert`, which is the pair the
 * retired closure-per-effect design could not have had: a push site that forgot its port and a push
 * site that forgot its inverse were both just a shorter object literal.
 */
function perform(effect: Effect, ports: PlanPorts, staged: StagedByNode): void {
  switch (effect.kind) {
    case "create-motion":
      return ports.createMotion(effect.definition);
    case "destroy-motion":
      return ports.destroyMotion(effect.motionId);
    case "compile-track":
      return ports.compileTrack(effect.track, effect.nodeId);
    case "dispose-track":
      return ports.disposeTrack(effect.nodeId);
    case "stage-track":
      return void staged.set(effect.nodeId, ports.stageTrack(effect.track, effect.nodeId));
    case "rollback-stage":
      return ports.rollbackStaged(staged.get(effect.nodeId), effect.nodeId);
    case "retarget-motion-track":
      return ports.replaceMotionTrack(effect.motionId, effect.nodeId, effect.duration);
    default:
      return unreachable(effect);
  }
}

/** Performs one settlement, on the same terms. Nothing here has an inverse or may be retried. */
function settleOne(
  settlement: Settlement,
  ports: PlanPorts,
  staged: ReadonlyMap<string, PlanStaged | undefined>,
): void {
  switch (settlement.kind) {
    case "commit-staged":
      return ports.commitStaged(staged.get(settlement.nodeId), settlement.nodeId);
    case "dispose-track":
      return ports.disposeTrack(settlement.nodeId);
    case "evict-node":
      return ports.evictNode(settlement.nodeId);
    case "mount-node":
      return ports.mountNode(settlement.nodeId);
    case "add-motion-track":
      return ports.addMotionTrack(settlement.motionId, settlement.nodeId, settlement.duration);
    case "remove-motion-track":
      return ports.removeMotionTrack(settlement.motionId, settlement.nodeId);
    case "destroy-motion":
      return ports.destroyMotion(settlement.motionId);
    case "publish":
      return ports.publish(settlement.seeds);
    default:
      return unreachable(settlement);
  }
}

/**
 * The inverses owed for what was applied, in apply order, skipping the effects that have none.
 *
 * Read off `invert` rather than paired at a push site, so a rollback cannot disagree with the effect
 * it is rolling back, and built here rather than inline in the `catch` so the ordering is a
 * declaration rather than a detail of a `flatMap`. See ADR-035 and ADR-045.
 */
function inversesOf(
  applied: readonly Effect[],
  ports: PlanPorts,
  staged: StagedByNode,
): readonly (() => void)[] {
  const steps: (() => void)[] = [];
  for (const effect of applied) {
    const inverse = invert(effect);
    if (inverse !== undefined) steps.push(() => perform(inverse, ports, staged));
  }
  return steps;
}

/**
 * Runs one plan: apply, accept, adopt, settle, and restore anything applied before a failure.
 *
 * `accept` is the seam between reversible and irreversible. Everything before it owes an inverse, so
 * a failure there restores what was applied and rethrows through `rejectAfterRollback`, and no step
 * after it runs at all: adoption never happens and settlement never happens. Everything from
 * `adopt` on has no inverse, so every settlement is attempted and the failures are collected into
 * one report rather than letting the first of them skip the rest.
 *
 * `adopt` sits outside the collector deliberately. It is a pointer move over maps this module was
 * handed and cannot throw, and putting it inside would make which pair the runtime retains depend on
 * whether a host's release threw. See ADR-064, ADR-067 and ADR-071.
 */
export function runPlan(plan: CommitPlan, ports: PlanPorts): void {
  const staged: StagedByNode = new Map();
  const applied: Effect[] = [];
  try {
    for (const effect of plan.effects) {
      perform(effect, ports, staged);
      applied.push(effect);
      ports.assertLive();
    }
    ports.accept();
  } catch (rejection) {
    rejectAfterRollback(rejection, () => runRollbackSteps(inversesOf(applied, ports, staged)));
  }
  ports.adopt();
  runSettleSteps(plan.settle.map((settlement) => () => settleOne(settlement, ports, staged)));
}
