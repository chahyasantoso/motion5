import type { ProjectHandle, ValueTransaction } from "@motion5/core";
import type { BoneLengths } from "../filler/bone-length";
import {
  presentedPosition,
  trustedPosition,
  type FilledFrame,
  type TrustedFrame,
} from "../filler/frame";
import { LIMBS, type Limb, type LimbId } from "../filler/landmarks";
import { unreachable } from "../filler/unreachable";
import { add, sub, unit, type Vec } from "../filler/vec";
import { limbTracks, poseNodeId } from "./tracks";

/** The one part of a project the writer drives, so the writer is tested without an Engine. */
export type ValueBatchPort = Pick<ProjectHandle, "values">;

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

/** The values one limb's chain holds in the project, as far as the writer has published them. */
interface Published {
  readonly upper: number | undefined;
  readonly lower: number | undefined;
  readonly flip: boolean;
}

interface LimbState {
  /** The last measured bend side: an observation, held while the middle joint is not trusted. */
  bend: boolean;
  /** What the project holds, advanced only once a batch carrying it has returned. */
  published: Published;
}

/** The authored rig: lengths are placeholders the writer has never published, flip is false. */
const AUTHORED: Published = { upper: undefined, lower: undefined, flip: false };

type LimbPlan =
  | { readonly kind: "skip"; readonly write: LimbWrite }
  | {
      readonly kind: "write";
      readonly commit: () => void;
      readonly stage: (transaction: ValueTransaction) => void;
    };

/**
 * The only caller of `project.values`. The bend side is read from the measured middle joint when it
 * is trusted and held otherwise, so an inferred elbow never decides which way the solve bends.
 *
 * Published state advances only after the batch returns: a batch that throws leaves the writer
 * believing what the project still holds, so the next frame writes the same changes again.
 */
export function createImageWriter(project: ValueBatchPort): PoseWriter {
  const states = new Map<LimbId, LimbState>(
    LIMBS.map((limb) => [limb.id, { bend: AUTHORED.flip, published: AUTHORED }]),
  );
  return createBatchWriter(project, (limb, filled, trusted, lengths) =>
    planLimb(limb, states.get(limb.id)!, filled, trusted, lengths),
  );
}

/** One batch owner for both dimensions; publication bookkeeping commits only after success. */
function createBatchWriter(
  project: ValueBatchPort,
  planLimb: (
    limb: Limb,
    filled: FilledFrame,
    trusted: TrustedFrame,
    lengths: BoneLengths,
  ) => LimbPlan,
): PoseWriter {
  return {
    write(filled, trusted, lengths) {
      const outcome = {} as Record<LimbId, LimbWrite>;
      const planned: Array<Extract<LimbPlan, { kind: "write" }>> = [];
      for (const limb of LIMBS) {
        const plan = planLimb(limb, filled, trusted, lengths);
        switch (plan.kind) {
          case "skip":
            outcome[limb.id] = plan.write;
            break;
          case "write":
            outcome[limb.id] = WRITTEN;
            planned.push(plan);
            break;
          default:
            return unreachable(plan, "limb plan");
        }
      }
      if (planned.length === 0) return outcome;
      project.values((transaction) => {
        for (const { stage } of planned) stage(transaction);
      });
      for (const { commit } of planned) commit();
      return outcome;
    },
  };
}

const WRITTEN: LimbWrite = Object.freeze({ kind: "written" });

function skip(reason: "root-lost" | "goal-lost" | "length-unknown"): LimbPlan {
  return { kind: "skip", write: { kind: "skipped", reason } };
}

function planLimb(
  limb: Limb,
  state: LimbState,
  filled: FilledFrame,
  trusted: TrustedFrame,
  lengths: BoneLengths,
): LimbPlan {
  const root = presentedPosition(filled.joints[limb.root]);
  if (root === undefined) return skip("root-lost");
  const goal = presentedPosition(filled.joints[limb.tip]);
  if (goal === undefined) return skip("goal-lost");
  const upper = lengths.length(limb.upper);
  const lower = lengths.length(limb.lower);
  if (upper === undefined || lower === undefined) return skip("length-unknown");
  const middle = trustedPosition(trusted.trust[limb.middle]);
  const flip = (middle === undefined ? undefined : imageBendFlip(root, goal, middle)) ?? state.bend;
  const { published } = state;
  const ids = limbTracks(limb.id);
  return {
    kind: "write",
    commit: () => {
      state.bend = flip;
      state.published = { upper, lower, flip };
    },
    stage: (transaction) => {
      transaction.setValues(poseNodeId(ids.root), { x: root[0]!, y: root[1]! });
      transaction.setValues(poseNodeId(ids.goal), { x: goal[0]!, y: goal[1]! });
      if (upper !== published.upper)
        transaction.setValues(poseNodeId(ids.upper), { length: upper });
      if (lower !== published.lower)
        transaction.setValues(poseNodeId(ids.lower), { length: lower });
      if (flip !== published.flip)
        transaction.track(poseNodeId(ids.solve)).setKeyframe("ik", "flip", flip);
    },
  };
}

/**
 * World bend is a held measured root-to-middle direction, never an inferred elbow.
 * Core consumes a pole POINT: translate that direction by this frame's root. No stale point.
 */
export function createWorldWriter(project: ValueBatchPort): PoseWriter {
  const states = new Map(
    LIMBS.map((limb) => [
      limb.id,
      {
        direction: undefined as Vec | undefined,
        upper: undefined as number | undefined,
        lower: undefined as number | undefined,
        pole: undefined as Vec | undefined,
      },
    ]),
  );
  return createBatchWriter(project, (limb, filled, trusted, lengths) => {
    if (filled.space.kind !== "world" || trusted.space.kind !== "world")
      throw new Error("World writer requires world frames.");
    const root = presentedPosition(filled.joints[limb.root]);
    if (root === undefined) return skip("root-lost");
    const goal = presentedPosition(filled.joints[limb.tip]);
    if (goal === undefined) return skip("goal-lost");
    const upper = lengths.length(limb.upper);
    const lower = lengths.length(limb.lower);
    if (upper === undefined || lower === undefined) return skip("length-unknown");
    const state = states.get(limb.id)!;
    const middle = trustedPosition(trusted.trust[limb.middle]);
    const measuredRoot = trustedPosition(trusted.trust[limb.root]);
    // Both endpoints must be measured: a filled root must not train a bend observation.
    const direction =
      middle !== undefined && measuredRoot !== undefined
        ? (unit(sub(middle, measuredRoot)) ?? state.direction)
        : state.direction;
    const pole = add(root, direction ?? [0, 0, 1]);
    const ids = limbTracks(limb.id);
    const point = (position: Vec) => ({ x: position[0]!, y: position[1]!, z: position[2]! });
    return {
      kind: "write",
      commit: () => {
        state.direction = direction;
        state.upper = upper;
        state.lower = lower;
        state.pole = pole;
      },
      stage: (transaction) => {
        transaction.setValues(poseNodeId(ids.root), point(root));
        transaction.setValues(poseNodeId(ids.goal), point(goal));
        if (state.pole === undefined || pole.some((value, axis) => value !== state.pole![axis]))
          transaction.setValues(poseNodeId(ids.pole), point(pole));
        if (upper !== state.upper) transaction.setValues(poseNodeId(ids.upper), { length: upper });
        if (lower !== state.lower) transaction.setValues(poseNodeId(ids.lower), { length: lower });
      },
    };
  });
}
