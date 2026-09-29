import type { ProjectHandle, ValueTransaction } from "@motion5/core";
import type { BoneLengths } from "../filler/bone-length";
import {
  presentedPosition,
  trustedPosition,
  type FilledFrame,
  type TrustedFrame,
} from "../filler/frame";
import { LIMBS, type Limb, type LimbId } from "../filler/landmarks";
import { sub, type Vec } from "../filler/vec";
import { limbTracks, poseNodeId } from "./rig";

/** What the writer did for one limb this frame, a closed union. */
export type LimbWrite =
  | { readonly kind: "written" }
  | { readonly kind: "skipped"; readonly reason: "root-lost" | "goal-lost" | "length-unknown" };

export interface PoseWriter {
  /**
   * Writes one frame as one `project.values` batch: every limb's root and goal, its two lengths
   * when they changed, and its bend side when it changed. A limb whose root or goal is lost, or
   * whose lengths the estimator does not know yet, is skipped and keeps its last pose.
   */
  write(
    filled: FilledFrame,
    trusted: TrustedFrame,
    lengths: BoneLengths,
  ): Record<LimbId, LimbWrite>;
}

/**
 * The 2D bend side: `flip` is false when the middle joint lies on the positive side of the
 * root-to-goal line, measured as the z of `(goal - root) x (middle - root)` in stage pixels (y
 * down). Pinned by GF-6 against the solver itself, so a convention change in the solve fails there.
 */
export function imageBendFlip(root: Vec, goal: Vec, middle: Vec): boolean | undefined {
  const reach = sub(goal, root);
  const bend = sub(middle, root);
  const side = reach[0]! * bend[1]! - reach[1]! * bend[0]!;
  return side === 0 ? undefined : side < 0;
}

interface LimbState {
  upper: number | undefined;
  lower: number | undefined;
  flip: boolean;
  flipWritten: boolean;
}

/**
 * The only caller of `project.values`. The bend side is read from the measured middle joint when it
 * is trusted and held otherwise, so an inferred elbow never decides which way the solve bends.
 */
export function createImageWriter(project: ProjectHandle): PoseWriter {
  const states = new Map<LimbId, LimbState>(
    LIMBS.map((limb) => [
      limb.id,
      { upper: undefined, lower: undefined, flip: false, flipWritten: true },
    ]),
  );
  return {
    write(filled, trusted, lengths) {
      const outcome = {} as Record<LimbId, LimbWrite>;
      const staged: Array<(transaction: ValueTransaction) => void> = [];
      for (const limb of LIMBS) {
        const state = states.get(limb.id)!;
        const decision = planLimb(limb, state, filled, trusted, lengths);
        outcome[limb.id] = decision.write;
        if (decision.stage !== undefined) staged.push(decision.stage);
      }
      if (staged.length > 0)
        project.values((transaction) => {
          for (const stage of staged) stage(transaction);
        });
      return outcome;
    },
  };
}

function planLimb(
  limb: Limb,
  state: LimbState,
  filled: FilledFrame,
  trusted: TrustedFrame,
  lengths: BoneLengths,
): { write: LimbWrite; stage?: (transaction: ValueTransaction) => void } {
  const root = presentedPosition(filled.joints[limb.root]);
  if (root === undefined) return { write: { kind: "skipped", reason: "root-lost" } };
  const goal = presentedPosition(filled.joints[limb.tip]);
  if (goal === undefined) return { write: { kind: "skipped", reason: "goal-lost" } };
  const upper = lengths.length(limb.upper);
  const lower = lengths.length(limb.lower);
  if (upper === undefined || lower === undefined)
    return { write: { kind: "skipped", reason: "length-unknown" } };
  const middle = trustedPosition(trusted.trust[limb.middle]);
  const measuredFlip = middle === undefined ? undefined : imageBendFlip(root, goal, middle);
  if (measuredFlip !== undefined && measuredFlip !== state.flip) {
    state.flip = measuredFlip;
    state.flipWritten = false;
  }
  const ids = limbTracks(limb.id);
  const writeUpper = upper !== state.upper;
  const writeLower = lower !== state.lower;
  const writeFlip = !state.flipWritten;
  state.upper = upper;
  state.lower = lower;
  state.flipWritten = true;
  const flip = state.flip;
  return {
    write: { kind: "written" },
    stage: (transaction) => {
      transaction.setValues(poseNodeId(ids.root), { x: root[0]!, y: root[1]! });
      transaction.setValues(poseNodeId(ids.goal), { x: goal[0]!, y: goal[1]! });
      if (writeUpper) transaction.setValues(poseNodeId(ids.upper), { length: upper });
      if (writeLower) transaction.setValues(poseNodeId(ids.lower), { length: lower });
      if (writeFlip) transaction.track(poseNodeId(ids.solve)).setKeyframe("ik", "flip", flip);
    },
  };
}
