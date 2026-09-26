/**
 * The dimension-independent topology of a solver chain: its canonical member order and the proof
 * that two members are the closed form's parent and addressed child.
 *
 * Both questions are about ids, `base` links and which member carries a goal, and neither reads a
 * coordinate, so the 2D solve and the internal 3D solve answer them through this one owner rather
 * than a copy each (ADR-106, ADR-114, ADR-122). Extracted from `fabrik.ts` and `ik-solve.ts` by
 * issue #500's fifth phase without changing a comparison, a traversal or a thrown message, so every
 * 2D byte stays where it was.
 */

/** What topology reads of a member: its id and the node it hangs from. */
export interface ChainNode {
  readonly id: string;
  readonly base: string;
}

/** What the two-bone proof reads of a member: its topology and whether it carries a goal. */
export interface AddressedNode<G> extends ChainNode {
  readonly goal?: G;
}

/**
 * Code-unit order, the same total order `graph/compare.ts` defines for qualified ids.
 *
 * Local rather than imported, because a plugin may not depend on the graph layer. It is a total
 * order on strings and not a rule that can drift: the two copies cannot disagree about an answer
 * the language defines.
 */
function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A chain read once in canonical order.
 *
 * `ids` is every member sorted by depth from the root, then by qualified id, which is the ordering
 * `resolveSolvers` already produces; both FABRIK passes and every sub-base compromise read this one
 * sequence, so permuting a solve's argument cannot change a digit. `serialDepth()` is the member
 * count of the longest root-to-leaf path, the serial depth `fabrik-cap.ts` scales the iteration cap
 * with, read off the last member in that order. It is a function rather than a field so it is
 * measured where the solve asks for it, which is where FABRIK always measured it: a self-based lone
 * member is refused by whichever guard it reached first before this owner existed, and still is. `childCount` counts each member's children inside the
 * chain and `leaves` lists the members with none, in canonical order.
 */
export interface CanonicalChain<M extends ChainNode> {
  readonly byId: ReadonlyMap<string, M>;
  readonly ids: readonly string[];
  readonly serialDepth: () => number;
  readonly childCount: ReadonlyMap<string, number>;
  readonly leaves: readonly string[];
}

/**
 * The canonical reading of `members`, or a throw naming the member where the bases cycle.
 *
 * Graph construction refuses a cycle long before a solve is reached, so the throw is an invariant
 * guard and not a validation step: it exists so a caller that broke the invariant gets a named
 * failure instead of a solve that never returns. Depths are measured lazily inside the sort and
 * again for the last member, exactly as FABRIK always measured them, so which member a cycle is
 * reported at is unchanged (`SD-` pins it).
 */
export function canonicalChain<M extends ChainNode>(members: readonly M[]): CanonicalChain<M> {
  const byId = new Map(members.map((member) => [member.id, member]));
  const depthOf = (member: M): number => {
    const seen = new Set<string>([member.id]);
    let current = member;
    let depth = 0;
    while (byId.has(current.base)) {
      if (seen.has(current.base))
        throw new Error(`Solver chain cycles at member "${current.base}".`);
      seen.add(current.base);
      current = byId.get(current.base)!;
      depth += 1;
    }
    return depth;
  };
  const ids = [...members]
    .sort((a, b) => depthOf(a) - depthOf(b) || compareCodeUnits(a.id, b.id))
    .map((member) => member.id);
  const childCount = new Map<string, number>(ids.map((id) => [id, 0]));
  for (const id of ids) {
    const base = byId.get(id)!.base;
    if (byId.has(base)) childCount.set(base, (childCount.get(base) ?? 0) + 1);
  }
  const leaves = ids.filter((id) => (childCount.get(id) ?? 0) === 0);
  // Canonical order ends at the deepest member, so its depth is the chain's serial depth.
  const serialDepth = (): number => {
    const last = ids.length > 0 ? byId.get(ids[ids.length - 1]!)! : undefined;
    return last === undefined ? 0 : depthOf(last) + 1;
  };
  return { byId, ids, serialDepth, childCount, leaves };
}

/** A proven closed-form pair: the parent, its addressed child, and the child's goal. */
export interface TwoBonePair<M, G> {
  readonly first: M;
  readonly second: M;
  readonly goal: G;
}

/**
 * The parent and the addressed child of a two-member chain, proven from the `base` relation, or
 * `undefined` when the two members are not one parent and one addressed child.
 *
 * Proven rather than read off array position. The closed form solves `first` from the root and
 * `second` from `first`'s tip, so handing it the pair in the wrong order solves a different rig:
 * before issue #349's sixth phase, `[child, parent]` solved the child as if it hung from the root
 * and published a pose whose tip missed the goal while reporting `reached`. A pair that is not a
 * parent and its addressed child (two siblings off the root, or a goal on the parent) is not the
 * closed form's shape and takes the iterative solve. See ADR-111.
 */
export function twoBonePair<G, M extends AddressedNode<G>>(
  members: readonly M[],
): TwoBonePair<M, G> | undefined {
  const [a, b] = members;
  if (members.length !== 2 || a === undefined || b === undefined) return undefined;
  return provenPair<G, M>(a, b) ?? provenPair<G, M>(b, a);
}

/**
 * `parent` and `child` as the closed form's pair, or `undefined` unless `child` hangs from
 * `parent`, `parent` hangs from neither of the two, and only `child` carries a goal.
 *
 * The second condition is what makes `twoBonePair` symmetric: both orders cannot succeed, because
 * that would need each member to hang from the other, which is a cycle this refuses. A cycle and a
 * self-based member therefore reach the iterative solve from either order, and it refuses both by
 * name. Members are read with distinct ids, which the publisher guarantees; two members sharing one
 * id are not a pair either. See ADR-111.
 */
function provenPair<G, M extends AddressedNode<G>>(
  parent: M,
  child: M,
): TwoBonePair<M, G> | undefined {
  if (child.base !== parent.id || parent.id === child.id) return undefined;
  if (parent.base === parent.id || parent.base === child.id) return undefined;
  if (parent.goal !== undefined || child.goal === undefined) return undefined;
  return { first: parent, second: child, goal: child.goal };
}
