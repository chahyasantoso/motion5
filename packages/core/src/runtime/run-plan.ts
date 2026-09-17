import type { MotionDefinition, TrackDefinition } from "../contract/v5";
import { unreachable } from "../domain/exhaustive";
import { rejectAfterRollback, runRollbackSteps, runSettleSteps } from "./rollback";
import { invert, type CommitPlan, type Effect, type Settlement } from "./commit-plan";
export interface PlanStaged {
  commit(): void;
  rollback(): void;
}
export interface PlanPorts {
  createMotion: (x: MotionDefinition) => void;
  destroyMotion: (id: string) => void;
  compileTrack: (x: TrackDefinition, id: string) => void;
  stageTrack: (x: TrackDefinition, id: string) => PlanStaged | undefined;
  replaceMotionTrack: (m: string, id: string, d?: number) => void;
  commitStaged: (x: PlanStaged | undefined, id: string) => void;
  rollbackStaged: (x: PlanStaged | undefined, id: string) => void;
  disposeTrack: (id: string) => void;
  evictNode: (id: string) => void;
  mountNode: (id: string) => void;
  addMotionTrack: (m: string, id: string, d?: number) => void;
  removeMotionTrack: (m: string, id: string) => void;
  assertLive: () => void;
  accept: () => void;
  adopt: () => void;
  publish: (x: readonly string[]) => void;
}
function apply(x: Effect, p: PlanPorts, m: Map<string, PlanStaged | undefined>): void {
  switch (x.kind) {
    case "create-motion":
      p.createMotion(x.definition);
      break;
    case "destroy-motion":
      p.destroyMotion(x.motionId);
      break;
    case "compile-track":
      p.compileTrack(x.track, x.nodeId);
      break;
    case "dispose-track":
      p.disposeTrack(x.nodeId);
      break;
    case "stage-track":
      m.set(x.nodeId, p.stageTrack(x.track, x.nodeId));
      break;
    case "rollback-stage":
      p.rollbackStaged(m.get(x.nodeId), x.nodeId);
      break;
    case "retarget-motion-track":
      p.replaceMotionTrack(x.motionId, x.nodeId, x.duration);
      break;
    default:
      unreachable(x);
  }
}
function settle(x: Settlement, p: PlanPorts, m: ReadonlyMap<string, PlanStaged | undefined>): void {
  switch (x.kind) {
    case "commit-staged":
      p.commitStaged(m.get(x.nodeId), x.nodeId);
      break;
    case "dispose-track":
      p.disposeTrack(x.nodeId);
      break;
    case "evict-node":
      p.evictNode(x.nodeId);
      break;
    case "mount-node":
      p.mountNode(x.nodeId);
      break;
    case "add-motion-track":
      p.addMotionTrack(x.motionId, x.nodeId, x.duration);
      break;
    case "remove-motion-track":
      p.removeMotionTrack(x.motionId, x.nodeId);
      break;
    case "destroy-motion":
      p.destroyMotion(x.motionId);
      break;
    case "publish":
      p.publish(x.seeds);
      break;
    default:
      unreachable(x);
  }
}
export function runPlan(x: CommitPlan, p: PlanPorts): void {
  const m = new Map<string, PlanStaged | undefined>(),
    done: Effect[] = [];
  try {
    for (const e of x.effects) {
      apply(e, p, m);
      done.push(e);
      p.assertLive();
    }
    p.accept();
  } catch (error) {
    rejectAfterRollback(error, () =>
      runRollbackSteps(
        done.flatMap((e) => {
          const i = invert(e);
          return i === undefined ? [] : [() => apply(i, p, m)];
        }),
      ),
    );
  }
  p.adopt();
  runSettleSteps(x.settle.map((e) => () => settle(e, p, m)));
}
