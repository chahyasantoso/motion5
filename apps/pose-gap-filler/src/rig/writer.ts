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
import {
  decidingMiddle,
  decideBend,
  LEGACY_BEND_POLICY,
  validateBendPolicy,
  type BendPolicy,
  type BendReference,
  type BendState,
} from "./bend-policy";

export { decidingMiddle, MIN_BEND_SINE } from "./bend-policy";

/** The one part of a project the writer drives, so the writer is tested without an Engine. */
export type ValueBatchPort = Pick<ProjectHandle, "values">;

/** What the writer did for one limb this frame, a closed union. */
export type LimbWrite =
  | { readonly kind: "written"; readonly bend?: BendReference }
  | {
      readonly kind: "skipped";
      readonly reason: "root-lost" | "goal-lost" | "length-unknown" | "bend-lost";
    };

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

/**
 * The smallest |sin| of the angle at the root between the reach (root to goal) and the measured
 * middle for that middle to overturn a held bend observation: about 5.7 degrees. Below it the limb
 * is measured nearly straight and the side it bends to is mostly noise, so a still, straight arm
 * whose measured elbow wobbles across the reach line would otherwise flip the solved elbow from one
 * side to the other every few frames. Real bends far exceed it.
 */

/**
 * Hysteresis on the bend observation, one rule for the 2D flip and the 3D pole direction: the
 * measured middle, when it may decide the bend, or `undefined` to keep what is held. The first
 * measured middle always decides (a slight true bend lands on its measured side); after that only a
 * decisive one, at least `MIN_BEND_SINE` off the reach line, may change the held observation. An
 * absent or degenerate middle never decides.
 */

/** The values one limb's chain holds in the project, as far as the writer has published them. */
interface Published {
  readonly upper: number | undefined;
  readonly lower: number | undefined;
  readonly flip: boolean;
}

interface LimbState {
  /**
   * The last deciding bend side: an observation, held while the middle joint is untrusted or not
   * decisive; `undefined` until the first one, when the authored side is written.
   */
  bend: boolean | undefined;
  /** What the project holds, advanced only once a batch carrying it has returned. */
  published: Published;
}

/** The authored rig: lengths are placeholders the writer has never published, flip is false. */
const AUTHORED: Published = { upper: undefined, lower: undefined, flip: false };

type LimbPlan =
  | { readonly kind: "skip"; readonly write: LimbWrite }
  | {
      readonly kind: "write";
      readonly write?: LimbWrite;
      readonly commit: () => void;
      readonly stage: (transaction: ValueTransaction) => void;
    };

/**
 * The only caller of `project.values`. The bend side is read from the measured middle joint when it
 * is trusted and deciding (`decidingMiddle`) and held otherwise, so neither an inferred elbow nor a
 * straight limb's noise decides which way the solve bends.
 *
 * Published state advances only after the batch returns: a batch that throws leaves the writer
 * believing what the project still holds, so the next frame writes the same changes again.
 */
export function createImageWriter(project: ValueBatchPort): PoseWriter {
  const states = new Map<LimbId, LimbState>(
    LIMBS.map((limb) => [limb.id, { bend: undefined, published: AUTHORED }]),
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
            outcome[limb.id] = plan.write ?? WRITTEN;
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

function skip(reason: "root-lost" | "goal-lost" | "length-unknown" | "bend-lost"): LimbPlan {
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
  const deciding = decidingMiddle(root, goal, middle, state.bend !== undefined);
  const bend =
    (deciding === undefined ? undefined : imageBendFlip(root, goal, deciding)) ?? state.bend;
  const flip = bend ?? AUTHORED.flip;
  const { published } = state;
  const ids = limbTracks(limb.id);
  return {
    kind: "write",
    commit: () => {
      state.bend = bend;
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
 * World bend is a held measured root-to-middle direction, never an inferred elbow, updated only by
 * a deciding middle (`decidingMiddle`): a straight limb's direction is nearly the reach itself, so
 * its noise would otherwise spin the bend plane about the reach.
 * Core consumes a pole POINT: translate that direction by this frame's root. No stale point.
 */
export function createWorldWriter(
  project: ValueBatchPort,
  policy: BendPolicy = LEGACY_BEND_POLICY,
): PoseWriter {
  validateBendPolicy(policy);
  // Snapshot caller settings: mutations must not change a writer mid-session.
  policy = Object.freeze({ ...policy });
  const states = new Map(
    LIMBS.map((limb) => [
      limb.id,
      {
        direction: undefined as Vec | undefined,
        upper: undefined as number | undefined,
        lower: undefined as number | undefined,
        pole: undefined as Vec | undefined,
        bendState: {} as BendState,
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
    const middle = decidingMiddle(
      root,
      goal,
      trustedPosition(trusted.trust[limb.middle]),
      state.direction !== undefined,
    );
    const measuredRoot = trustedPosition(trusted.trust[limb.root]);
    // Both endpoints must be measured: a filled root must not train a bend observation.
    const direction =
      middle !== undefined && measuredRoot !== undefined
        ? (unit(sub(middle, measuredRoot)) ?? state.direction)
        : state.direction;
    let bend: BendReference | undefined;
    let nextBendState = state.bendState;
    switch (policy.kind) {
      case "legacy":
        break;
      case "predict": {
        if (filled.tMs !== trusted.tMs) throw new Error("World bend frame timestamps differ.");
        const decision = decideBend(policy, state.bendState, {
          tMs: filled.tMs,
          root,
          goal,
          measuredRoot,
          measuredMiddle: trustedPosition(trusted.trust[limb.middle]),
          filledMiddle: filled.joints[limb.middle],
        });
        bend = decision.reference;
        nextBendState = decision.next;
        if (bend.kind === "unavailable") return skip("bend-lost");
        break;
      }
      default:
        return unreachable(policy, "world bend policy");
    }
    const pole = add(
      root,
      bend === undefined || bend.kind === "unavailable" ? (direction ?? [0, 0, 1]) : bend.direction,
    );
    const ids = limbTracks(limb.id);
    const point = (position: Vec) => ({ x: position[0]!, y: position[1]!, z: position[2]! });
    return {
      kind: "write",
      ...(bend === undefined ? {} : { write: { kind: "written" as const, bend } }),
      commit: () => {
        state.direction = direction;
        state.bendState = nextBendState;
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
