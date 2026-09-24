import { unreachable } from "../lang/exhaustive";

/**
 * A solver plugin's declared chain capability, and the one owner of which derived chains a solver
 * can answer. The graph derives membership and depth for every solver alike (ADR-051), then asks
 * this module whether the shape it derived is one the solver's plugin declares, so a plugin's
 * supported arity is a contract fact read at load rather than a throw at composition. See ADR-114.
 *
 * The union is closed. `any` is every 2D `ik` chain, which dispatches on derived shape and so
 * refuses none (issue #195 deleted the arity rule that used to). `unbranched` is a single path of
 * exactly `members` members from the root to one leaf, which is all the phase 8 `ik3d` closed form
 * solves. A plugin missing from the table is `any`, because a solver that declares nothing has
 * promised nothing narrower than the graph's own rules.
 */
export type SolverChainShape =
  | Readonly<{ kind: "any" }>
  | Readonly<{ kind: "unbranched"; members: number }>;

const ANY: SolverChainShape = Object.freeze({ kind: "any" });

const SOLVER_CHAIN_SHAPES: Readonly<Record<string, SolverChainShape>> = Object.freeze({
  ik3d: Object.freeze({ kind: "unbranched", members: 2 }),
});

/** The chain shape `plugin` declares, `any` when it declares none. */
export function solverChainShape(plugin: string): SolverChainShape {
  return SOLVER_CHAIN_SHAPES[plugin] ?? ANY;
}

/**
 * Whether member depths derived under one solver describe a chain `shape` accepts. A depth is the
 * number of `base` hops from a member to the root, so `members` members form one unbranched path
 * exactly when their depths are `1` through `members`, each once.
 */
export function acceptsChain(shape: SolverChainShape, depths: readonly number[]): boolean {
  switch (shape.kind) {
    case "any":
      return true;
    case "unbranched": {
      if (depths.length !== shape.members) return false;
      const seen = new Set(depths);
      for (let depth = 1; depth <= shape.members; depth += 1) if (!seen.has(depth)) return false;
      return true;
    }
    default:
      return unreachable(shape);
  }
}

/** The refusal message for a derived chain `shape` does not accept. */
export function describeChainShape(shape: SolverChainShape): string {
  switch (shape.kind) {
    case "any":
      return "any chain";
    case "unbranched":
      return `exactly ${String(shape.members)} unbranched members`;
    default:
      return unreachable(shape);
  }
}
