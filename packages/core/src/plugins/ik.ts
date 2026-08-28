import { readGoalSlot } from "../contract/solver-slots";
import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableRecord } from "../domain/values";
import { solveFabrik, type FabrikMember } from "./fabrik";
import { readFrame, readNumber, type WorldFrame } from "./frame";

/** The frame a solver hangs from and the frame it reaches for are both world frames. */
export type BaseFrame = WorldFrame;

export interface MemberState {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
  /**
   * The frame this member reaches toward, present only on a chain leaf the author gave a goal.
   *
   * Delivered per member rather than through one slot, because the publisher writes a source's
   * values as `collected[plugin][slot]`: two goals sharing one slot name would overwrite each other
   * and the last one authored would be the only one that arrived, with no diagnostic. The join is
   * `GraphPublisher`'s, off `SolveMember.goal`, so the plugin never sees a keyframe or an authored
   * id. See issue #195.
   */
  readonly goal?: Readonly<Record<string, unknown>>;
}

/**
 * The member states the publisher delivered, or a throw.
 *
 * Refused rather than defaulted. A solver with no members has nothing to solve, and returning an
 * empty list would publish an empty `rotations` record: every member would fall back to its own
 * authored rotation and the rig would hold a broken pose with no diagnostic. `resolveSolvers`
 * already refuses that shape at load time as `ik-solver-no-members`, so reaching here at all is a
 * publisher invariant violation and it is thrown, not absorbed.
 */
export function readMembers(membersInput: unknown): readonly MemberState[] {
  if (!Array.isArray(membersInput) || membersInput.length === 0) {
    throw new Error("ikPlugin requires non-empty members array in inputs.");
  }
  return membersInput as readonly MemberState[];
}

/**
 * The chain's leaves: the members no member of the same chain hangs from.
 *
 * Derived from the `base` fields the publisher joined on rather than from a second walk of the
 * graph. `resolveSolvers` derives the same set at load time and refuses the shapes that make a
 * goal unanswerable, so this read never disagrees with it; it exists because the bare `target`
 * slot names no member and something has to say which member it is a goal for.
 */
function chainLeaves(members: readonly MemberState[]): readonly string[] {
  const based = new Set(members.map((member) => member.base));
  return members.filter((member) => !based.has(member.id)).map((member) => member.id);
}

/**
 * Every goal this solve reaches toward, keyed by the member it belongs to.
 *
 * One normalised map, whichever way the author addressed their goals, so the dispatch below reads a
 * count rather than two spellings and the solvers read a frame rather than a keyframe. Both
 * spellings survive on purpose: `target` is exactly the degenerate case of the goal dict, so
 * retiring it would re-author every existing rig to buy one spelling, and `ik-goal-conflict`
 * already refuses a solver that authored both.
 *
 * A bare `target` names no member, so it is joined onto the chain's one leaf. That is a guarantee
 * while a chain has exactly one leaf and nothing more, which is why a branching chain binding the
 * bare slot is `ik-target-not-single-leaf` at load: the throw here is the invariant guard behind
 * that rule rather than a validation step, in the same spirit as `readMembers`. See issue #195.
 */
export function readGoals(
  target: unknown,
  members: readonly MemberState[],
): ReadonlyMap<string, WorldFrame> {
  const goals = new Map<string, WorldFrame>();
  for (const member of members) {
    if (member.goal !== undefined) goals.set(member.id, readFrame(member.goal));
  }
  if (target === undefined) return goals;
  const leaves = chainLeaves(members);
  if (leaves.length !== 1) {
    throw new Error(
      `ikPlugin cannot address the bare target slot over a chain with ${leaves.length} leaves.`,
    );
  }
  goals.set(leaves[0]!, readFrame(target));
  return goals;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * The analytic two-bone solve, in `fk`'s own degrees and rotate-then-translate convention.
 *
 * Both members' rotations are local, so the returned angles are exactly what `fk` substitutes for
 * an authored `rotation`: the first is measured from the root's own rotation, the second from the
 * first bone's world direction.
 *
 * The default elbow is the positive branch. `flip: false` takes `phi + alpha`, so the worked rig
 * (root `200,300`, target `320,340`, lengths `80` and `60`) solves to `40.168` and `-51.318`, and
 * `flip: true` is its mirror across the root-to-target line. Both configurations put the tip on
 * the target exactly, so the convention has to be pinned by the two numbers rather than by a
 * reachability assertion that either branch satisfies. `IK-1` owns the default and `IK-3` owns the
 * mirror.
 *
 * An unreachable target is clamped into `[|l1 - l2|, l1 + l2]` rather than refused, so the chain
 * extends toward it instead of producing `NaN` out of `acos`.
 *
 * Exactly two members, and `solveChain` is the one caller that decides so. A `members.length < 2`
 * branch used to answer a one-member chain with zeros; it is deleted rather than kept, because the
 * dispatcher owns arity now and a one-member chain is a real solve that points at its goal.
 */
export function solveTwoBone(
  root: BaseFrame,
  target: BaseFrame,
  members: readonly MemberState[],
  flip = false,
): Readonly<Record<string, number>> {
  const m1 = members[0]!;
  const m2 = members[1]!;
  const l1 = Math.max(0, readNumber(m1.values.length));
  const l2 = Math.max(0, readNumber(m2.values.length));

  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.hypot(dx, dy);
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (l1 <= 0 && l2 <= 0) {
    return Object.freeze({
      [m1.id]: targetAngle - root.rotation,
      [m2.id]: 0,
    });
  }

  if (l1 <= 0) {
    return Object.freeze({
      [m1.id]: 0,
      [m2.id]: targetAngle - root.rotation,
    });
  }

  if (l2 <= 0) {
    return Object.freeze({
      [m1.id]: targetAngle - root.rotation,
      [m2.id]: 0,
    });
  }

  const minReach = Math.abs(l1 - l2);
  const maxReach = l1 + l2;
  const clampedD = clamp(d, minReach, maxReach);

  if (clampedD <= 0) {
    return Object.freeze({
      [m1.id]: 0,
      [m2.id]: 0,
    });
  }

  const cosAlpha = clamp((l1 * l1 + clampedD * clampedD - l2 * l2) / (2 * l1 * clampedD), -1, 1);
  const alpha = (Math.acos(cosAlpha) * 180) / Math.PI;

  const cosBeta = clamp((l1 * l1 + l2 * l2 - clampedD * clampedD) / (2 * l1 * l2), -1, 1);
  const beta = (Math.acos(cosBeta) * 180) / Math.PI;

  let r1: number;
  let r2: number;

  if (!flip) {
    r1 = targetAngle + alpha - root.rotation;
    r2 = beta - 180;
  } else {
    r1 = targetAngle - alpha - root.rotation;
    r2 = 180 - beta;
  }

  return Object.freeze({
    [m1.id]: r1,
    [m2.id]: r2,
  });
}

/**
 * The member states as the iterative solve reads them.
 *
 * `readNumber` rather than a second guard, because `fk` reads the same authored `length` through the
 * same reader: a value one half of a composition refuses and the other accepts is one authored
 * number meaning two things inside one tick, which is how the two private copies of this reader
 * drifted before `plugins/frame.ts` existed.
 */
function fabrikMembers(
  members: readonly MemberState[],
  goals: ReadonlyMap<string, WorldFrame>,
): readonly FabrikMember[] {
  return members.map((member) => {
    const length = readNumber(member.values.length);
    const goal = goals.get(member.id);
    return goal === undefined
      ? { id: member.id, base: member.base, length }
      : { id: member.id, base: member.base, length, goal };
  });
}

/**
 * The dispatcher: which solve answers for this chain.
 *
 * Two members and one goal take the closed form, and everything else takes FABRIK. Dispatch is on
 * derived shape rather than on an authored mode, so nothing new is authorable and no rig chooses its
 * own solver.
 *
 * FABRIK cannot simply replace the analytic path. `IK-1` and `IK-3` pin `40.168` and `-51.318` for
 * the worked rig, an iterative solve reaches a goal within a tolerance rather than exactly, and
 * `flip` at arity two selects an exact branch rather than a basin, so replacing it would move
 * published values for every rig that already solves. The two paths therefore publish one
 * convention by assertion rather than by construction: `FB-2` holds FABRIK to the closed form's own
 * numbers on ADR-051's worked rig, for both elbow branches.
 *
 * A solve with no goal at all is thrown rather than answered with the seed pose. Every load-time
 * shape that could produce one is refused (`ik-solver-no-members`, `ik-leaf-without-goal`), so
 * reaching here is a publisher invariant violation, and returning a pose would publish a rig that
 * reaches for nothing with status `ready`. See issue #195.
 */
export function solveChain(
  root: BaseFrame,
  members: readonly MemberState[],
  goals: ReadonlyMap<string, WorldFrame>,
  flip = false,
): Readonly<Record<string, number>> {
  if (goals.size === 0) {
    throw new Error(`ikPlugin requires at least one goal; ${members.length} members received none.`);
  }
  if (members.length === 2 && goals.size === 1) {
    const [target] = goals.values();
    return solveTwoBone(root, target!, members, flip);
  }
  // `tips` and `convergence` are deliberately dropped rather than published. The analytic path
  // carries neither, so publishing them here would make a solver's patch shape a function of its
  // arity and would move every existing solver's published keys, which `FB-9` pins as unchanged.
  // Roughly four percent of ordinary reachable rigs do not reach tolerance before the cap, so a
  // per-tick report would be noise on rigs nobody would call broken. `FB-13` pins the shape and
  // `docs/DECISIONS.md` records the decision under ADR-051.
  return solveFabrik(root, fabrikMembers(members, goals), flip).rotations;
}

/**
 * The solver node.
 *
 * `compose` returns the values it was given with `rotations` added, rather than `rotations` alone.
 * `Track.composeFrom` chains by replacement, so a bare return wipes this track's own authored keys:
 * the solver's `flip` disappears from its published patch, and so does anything co-authored beside
 * `ik` on the same node. The spread is a correctness requirement of the chaining rule, not a style
 * choice, and `IK-18` pins it.
 *
 * `claimsSlot` is how the goal family reaches this plugin at all. The slot set stops being
 * enumerable once a goal is addressed by member id, because the member ids belong to the rig rather
 * than to the plugin; `requirements` keeps sole ownership of `root` and `target`, and only the
 * predicate answers for the open family. It reads the shared grammar rather than a private copy of
 * the syntax, which is how `readNumber` drifted between `fk` and `ik`. See issue #195.
 */
export const ikPlugin: PluginDefinition = {
  name: "ik",
  keys: ["flip"],
  requirements: {
    root: { description: "base frame of the solver chain" },
    target: { description: "target position to reach" },
  },
  claimsSlot: (slot) => readGoalSlot(slot) !== undefined,
  stage: "compose",
  outputs: ["rotations"],
  compose: (values, _progress, inputs) => {
    const root = readFrame(inputs.root);
    const members = readMembers(inputs.members);
    const goals = readGoals(inputs.target, members);
    const flip = Boolean(values.flip);
    const rotations = solveChain(root, members, goals, flip);
    return Object.freeze({
      ...values,
      rotations: Object.freeze(rotations as unknown as ImmutableRecord),
    });
  },
};
