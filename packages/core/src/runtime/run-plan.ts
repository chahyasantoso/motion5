import type { MotionDefinition, TrackDefinition } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";
import { rejectAfterRollback, runSteps } from "./report";
import { invert, type CommitPlan, type Effect, type Settlement } from "./commit-plan";
import type { StagedTrack } from "./project-ports";
/** Sole impure walk over a derived commit. Liveness re-asked after each recorded effect, so mid-flight disposal rolls it back; inverses in apply order; settlement attempts all, collects failures. */

/** Every seam one plan can reach, none optional: absent host hooks arrive as no-ops. */
export interface PlanPorts {
  readonly createMotion: (definition: MotionDefinition) => void;
  readonly destroyMotion: (motionId: string) => void;
  readonly compileTrack: (track: TrackDefinition, nodeId: string) => void;
  readonly disposeTrack: (nodeId: string) => void;
  readonly stageTrack: (track: TrackDefinition, nodeId: string) => StagedTrack | undefined;
  readonly commitStaged: (staged: StagedTrack | undefined, nodeId: string) => void;
  readonly rollbackStaged: (staged: StagedTrack | undefined, nodeId: string) => void;
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

// Stage produced by each node's replacement, held for whichever later step claims it.
type StagedByNode = Map<string, StagedTrack | undefined>;

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

/** Applies one settlement: no inverse, never retried. */
function settleOne(
  settlement: Settlement,
  ports: PlanPorts,
  staged: ReadonlyMap<string, StagedTrack | undefined>,
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

// In apply order, read off `invert` so a rollback cannot disagree with the effect it undoes.
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

/** Runs one plan: apply, accept, adopt, settle.
 * Failure before adopt restores applied effects; after, every settlement attempts and collects.
 * adopt cannot throw: outside the collector. */
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
    rejectAfterRollback(rejection, () => runSteps("rollback", inversesOf(applied, ports, staged)));
  }
  ports.adopt();
  runSteps(
    "settle",
    plan.settle.map((settlement) => () => settleOne(settlement, ports, staged)),
  );
}
