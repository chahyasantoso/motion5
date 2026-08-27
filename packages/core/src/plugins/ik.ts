import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableRecord } from "../domain/values";
import { readFrame, readNumber, type WorldFrame } from "./frame";

/** The frame a solver hangs from and the frame it reaches for are both world frames. */
export type BaseFrame = WorldFrame;

export interface MemberState {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
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
 */
export function solveTwoBone(
  root: BaseFrame,
  target: BaseFrame,
  members: readonly MemberState[],
  flip = false,
): Readonly<Record<string, number>> {
  if (members.length < 2) {
    const result: Record<string, number> = {};
    for (const m of members) result[m.id] = 0;
    return Object.freeze(result);
  }

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
 * The two-bone solver node.
 *
 * `compose` returns the values it was given with `rotations` added, rather than `rotations` alone.
 * `Track.composeFrom` chains by replacement, so a bare return wipes this track's own authored keys:
 * the solver's `flip` disappears from its published patch, and so does anything co-authored beside
 * `ik` on the same node. The spread is a correctness requirement of the chaining rule, not a style
 * choice, and `IK-18` pins it.
 */
export const ikPlugin: PluginDefinition = {
  name: "ik",
  keys: ["flip"],
  requirements: {
    root: { description: "base frame of the solver chain" },
    target: { description: "target position to reach" },
  },
  stage: "compose",
  outputs: ["rotations"],
  compose: (values, _progress, inputs) => {
    const root = readFrame(inputs.root);
    const target = readFrame(inputs.target);
    const members = readMembers(inputs.members);
    const flip = Boolean(values.flip);
    const rotations = solveTwoBone(root, target, members, flip);
    return Object.freeze({
      ...values,
      rotations: Object.freeze(rotations as unknown as ImmutableRecord),
    });
  },
};
