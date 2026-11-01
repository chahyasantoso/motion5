import { unreachable } from "@motion5/core/plugin-api";
import { solveFabrik } from "./fabrik";
import type { WorldFrame } from "./frame";
import { solveTwoBone } from "./ik-analytic";
import type { SolveMember } from "./ik-member";
import type { SolveResult } from "./ik-result";
import { restoreResult, scaleRig, solveMagnitude } from "./ik-scale";
import { twoBonePair } from "./ik-topology";

/** Which solve answers for a chain: closed form for `two-bone`, FABRIK for `tree` and `constrained`.
 * Derived, never authored; one exhaustive `switch` reads it. */
export type ChainShape =
  | {
      readonly kind: "two-bone";
      readonly first: SolveMember;
      readonly second: SolveMember;
      readonly goal: WorldFrame;
    }
  | { readonly kind: "tree"; readonly members: readonly SolveMember[] }
  | { readonly kind: "constrained"; readonly members: readonly SolveMember[] };

/** One chain's shape, or a throw when no member carries a goal.
 * Any limit → `constrained` (FABRIK even at two bones); else `twoBonePair` → `two-bone`, else `tree`. */
export function chainShape(members: readonly SolveMember[]): ChainShape {
  const goals = members.flatMap((member) => (member.goal === undefined ? [] : [member.goal]));
  const [goal] = goals;
  if (goal === undefined) {
    throw new Error(
      `ikPlugin requires at least one goal; ${members.length} members received none.`,
    );
  }
  if (members.some((member) => member.limit !== undefined)) return { kind: "constrained", members };
  const pair = twoBonePair<WorldFrame, SolveMember>(members);
  if (pair !== undefined) return { kind: "two-bone", ...pair };
  return { kind: "tree", members };
}

/** One local rotation per member, from the strategy the chain's shape names; total on finite rigs, pure.
 * `ik-scale.ts` rescales oversized rigs by an exact power of two, then restores distances. */
export function solveChain(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
): SolveResult {
  const magnitude = solveMagnitude(root, members);
  switch (magnitude.kind) {
    case "native":
      return solveShape(root, members, flip);
    case "rescaled": {
      const image = scaleRig(root, members, magnitude.exponent);
      return restoreResult(solveShape(image.root, image.members, flip), magnitude.exponent);
    }
    default:
      return unreachable(magnitude);
  }
}

/** Shape decision alone, so magnitude and shape are each one `switch`; `ik-scale.ts` owns magnitude. */
function solveShape(root: WorldFrame, members: readonly SolveMember[], flip: boolean): SolveResult {
  const shape = chainShape(members);
  switch (shape.kind) {
    case "two-bone":
      return solveTwoBone(root, shape.goal, shape.first, shape.second, flip);
    case "tree":
    case "constrained": {
      // Constrained shares FABRIK's body: limits read there; only `quality`/`residuals` join `rotations`; `pivots`/`tips` would make result shape depend on arity.
      const { rotations, residuals, quality } = solveFabrik(root, shape.members, flip);
      return Object.freeze({ rotations, residuals, quality });
    }
    default:
      return unreachable(shape);
  }
}
