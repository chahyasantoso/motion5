/**
 * Dimension-independent chain topology: canonical member order and the closed form's
 * parent/addressed-child proof. Both read ids, `base` links and goals, never a coordinate. */

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
 * Code-unit order, matching `graph/compare.ts`; local since a plugin cannot import the graph layer.
 * The language fixes the answer, so the copies cannot drift. */
function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Chain read in canonical order: `ids` sorted by depth then id, as `resolveSolvers` emits.
 * `serialDepth` = longest root-to-leaf member count, measured on demand; `leaves` = childless. */
export interface CanonicalChain<M extends ChainNode> {
  readonly byId: ReadonlyMap<string, M>;
  readonly ids: readonly string[];
  readonly serialDepth: () => number;
  readonly childCount: ReadonlyMap<string, number>;
  readonly leaves: readonly string[];
}

/**
 * Canonical reading of `members`, or a throw naming the member where `base` links cycle. Depths are
 * measured lazily, so the reported member holds. A guard, not validation. */
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
  // Canonical order ends at the deepest member, so its depth is the serial depth.
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
 * Parent and addressed child of a two-member chain, proven from `base`, or `undefined`.
 * `first` solves from root, `second` from its tip; siblings or a parent goal use the iterative solve. */
export function twoBonePair<G, M extends AddressedNode<G>>(
  members: readonly M[],
): TwoBonePair<M, G> | undefined {
  const [a, b] = members;
  if (members.length !== 2 || a === undefined || b === undefined) return undefined;
  return provenPair<G, M>(a, b) ?? provenPair<G, M>(b, a);
}

/**
 * `parent` and `child` as the pair, or `undefined` unless `child` hangs from `parent`, `parent`
 * hangs from neither, and only `child` carries a goal; both orders holding would be a cycle. */
function provenPair<G, M extends AddressedNode<G>>(
  parent: M,
  child: M,
): TwoBonePair<M, G> | undefined {
  if (child.base !== parent.id || parent.id === child.id) return undefined;
  if (parent.base === parent.id || parent.base === child.id) return undefined;
  if (parent.goal !== undefined || child.goal === undefined) return undefined;
  return { first: parent, second: child, goal: child.goal };
}
