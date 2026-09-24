import { BEND_KEY, FLIP_KEY, INSPECTION_KEY, INSPECT_KEY } from "../contract/solver-constraints";
import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableRecord } from "../domain/values";
import { readFrame } from "./frame";
import { readGoals, readMembers, readSolveMembers } from "./ik-chain";
import { solveChain } from "./ik-solve";
import { readBend } from "./ik-constraint";
import { inspectSolve } from "./ik-result";

/**
 * The `ik` plugin: its declaration and the wiring from its slots to a solve, and nothing else.
 *
 * Four questions used to share this file: slot adaptation, chain topology, strategy selection, and
 * one strategy's arithmetic. Each now has one owner, and this module only composes them in order.
 * `ik-chain.ts` reads the publisher's member states and goals into the one `SolveMember` model that
 * `ik-member.ts` declares; `ik-solve.ts` decides which strategy answers the chain and runs it;
 * `ik-analytic.ts` and `fabrik.ts` are the two strategies. A new capability lands in the owner of
 * the question it answers rather than beside the arithmetic that consumes it. See ADR-106 and
 * issue #349.
 */

/**
 * The solver node.
 *
 * `compose` returns the values it was given with `rotations` added, rather than `rotations` alone.
 * `Track.composeFrom` chains by replacement, so a bare return wipes this track's own authored keys:
 * the solver's `flip` disappears from its published patch, and so does anything co-authored beside
 * `ik` on the same node. The spread is a correctness requirement of the chaining rule, not a style
 * choice, and `IK-18` pins it.
 *
 * `inspection` is published only when the solver's own static `inspect` is exactly `true`, so its
 * presence is a function of authoring rather than of arity or strategy, and an unopted patch keeps
 * the keys and doubles it had before ADR-109. Both output names are declared in `outputs` for every
 * registration, because ownership of a name is a property of the plugin, not of one rig. The value
 * is `inspectSolve(result)`, whose shape `ik-result.ts` owns; this module only decides whether to
 * ask. `ik-inspect-malformed` refuses a non-boolean or keyframed switch at load, so the strict
 * comparison is the whole runtime reading rather than a second validator.
 *
 * `targets` is an ordinary declared slot carrying `dict: true`, which is how the goal family reaches
 * this plugin now. The slot set is enumerable again: the member ids belong to the rig, but they are
 * keys inside one declared slot rather than slot names of their own, so `requirements` answers for
 * every slot and there is no predicate and no grammar. `claimsSlot` is deleted with the derived
 * `targets[<memberId>]` identity it read. See ADR-052 and ADR-057.
 */
export const ikPlugin: PluginDefinition = {
  name: "ik",
  keys: [FLIP_KEY, BEND_KEY, INSPECT_KEY],
  requirements: {
    root: { description: "base frame of the solver chain" },
    target: { description: "target position to reach" },
    targets: { description: "one goal per chain leaf, keyed by member id", dict: true },
  },
  stage: "compose",
  outputs: ["rotations", INSPECTION_KEY],
  compose: (values, _progress, inputs) => {
    const root = readFrame(inputs.root);
    const members = readMembers(inputs.members);
    const goals = readGoals(inputs.target, members);
    const flip = readBend(values);
    const result = solveChain(root, readSolveMembers(members, goals), flip);
    return Object.freeze({
      ...values,
      rotations: Object.freeze(result.rotations as unknown as ImmutableRecord),
      ...(values[INSPECT_KEY] === true ? { [INSPECTION_KEY]: inspectSolve(result) } : {}),
    });
  },
};
