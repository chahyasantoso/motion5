import { unreachable } from "../lang/exhaustive";

/**
 * A solver plugin's declared chain capability, and the one owner of which derived chains a solver
 * can answer. The graph derives membership and depth for every solver alike (ADR-051), then asks
 * this module whether the chain it derived is one the solver's plugin declares, so a plugin's
 * supported shape is a contract fact read at load rather than a throw at composition. See ADR-114.
 *
 * The union is closed. `unbranched` is a single path of exactly `members` members from the root to
 * one leaf, every one bound to the solver through `memberPlugin`, which is all the phase 8 `ik3d`
 * closed form solves. `any` is every other solver, the 2D `ik` among them, which dispatches on the
 * derived shape and so refuses no count or branching (issue #195 deleted the arity rule that used
 * to). A plugin missing from the table is `any`, because a solver that declares nothing has
 * promised nothing narrower than the graph's own rules.
 *
 * A member plugin an `unbranched` shape names is dedicated to that shape: it publishes nothing a
 * solver of another shape reads, so an `fk3d` member under a 2D `ik` solver would compose identity
 * on every tick without a symptom. The dedicated set is derived from the table rather than stated
 * beside it, so declaring a new dedicated member plugin is one table entry.
 */
export type SolverChainShape =
  | Readonly<{ kind: "any" }>
  | Readonly<{ kind: "unbranched"; members: number; memberPlugin: string }>;

/**
 * One member as the graph derived it under a solver: its `base` hop count to the root, and every
 * plugin through which it binds that solver's `solver` slot, sorted, normally exactly one.
 */
export type DerivedChainMember = Readonly<{ depth: number; plugins: readonly string[] }>;

const ANY: SolverChainShape = Object.freeze({ kind: "any" });

const SOLVER_CHAIN_SHAPES: Readonly<Record<string, SolverChainShape>> = Object.freeze({
  ik3d: Object.freeze({ kind: "unbranched", members: 2, memberPlugin: "fk3d" }),
});

function dedicatedPluginOf(shape: SolverChainShape): string | undefined {
  switch (shape.kind) {
    case "any":
      return undefined;
    case "unbranched":
      return shape.memberPlugin;
    default:
      return unreachable(shape);
  }
}

const DEDICATED_MEMBER_PLUGINS: readonly string[] = Object.freeze(
  [
    ...new Set(
      Object.values(SOLVER_CHAIN_SHAPES).flatMap((shape): readonly string[] => {
        const plugin = dedicatedPluginOf(shape);
        return plugin === undefined ? [] : [plugin];
      }),
    ),
  ].sort(),
);

/**
 * The requirement slot an authored pole binds, and the one owner of which solver plugins bend a
 * chain toward one (ADR-118).
 *
 * A pole is a slot rather than a key, so the registry already refuses it by name under a plugin
 * that does not declare it (`plugin-unknown-requirement`). The graph holds no registry (ADR-044),
 * and its own pole rule, `ik-pole-without-chain`, asks a narrower question that only means
 * something under a plugin that does declare the slot: whether the group that bound it also bound
 * the chain's `root`. This set is how the graph knows where that question applies, so a pole under
 * `fk3d` is the registry's unknown requirement and never the graph's misplaced pole. It is stated
 * as a set beside the chain-shape table rather than as a field of it, because which slots a solver
 * reads is not a shape of the chain it solves, and `TH-47` holds it equal to the plugin
 * definitions that declare `pole`.
 */
export const POLE_SLOT = "pole" as const;

const POLE_SOLVERS: readonly string[] = Object.freeze(["ik3d"]);

/** Whether `plugin` is a solver that declares the `pole` slot. */
export function declaresPole(plugin: string): boolean {
  return POLE_SOLVERS.includes(plugin);
}

/** The chain shape `plugin` declares, `any` when it declares none. */
export function solverChainShape(plugin: string): SolverChainShape {
  return SOLVER_CHAIN_SHAPES[plugin] ?? ANY;
}

/**
 * Whether the members derived under one solver describe a chain `shape` accepts. A depth is the
 * number of `base` hops from a member to the root, so `members` members form one unbranched path
 * exactly when their depths are `1` through `members`, each once.
 */
export function acceptsChain(
  shape: SolverChainShape,
  members: readonly DerivedChainMember[],
): boolean {
  switch (shape.kind) {
    case "any":
      return members.every(({ plugins }) =>
        plugins.every((plugin) => !DEDICATED_MEMBER_PLUGINS.includes(plugin)),
      );
    case "unbranched": {
      if (members.length !== shape.members) return false;
      const bound = members.every(({ plugins }) =>
        plugins.every((plugin) => plugin === shape.memberPlugin),
      );
      if (!bound) return false;
      const seen = new Set(members.map(({ depth }) => depth));
      for (let depth = 1; depth <= shape.members; depth += 1) if (!seen.has(depth)) return false;
      return true;
    }
    default:
      return unreachable(shape);
  }
}

/** What `shape` accepts, in the words the refusal message uses. */
export function describeChainShape(shape: SolverChainShape): string {
  switch (shape.kind) {
    case "any":
      return `any chain without ${DEDICATED_MEMBER_PLUGINS.join(" or ")} members`;
    case "unbranched":
      return `exactly ${String(shape.members)} unbranched ${shape.memberPlugin} members`;
    default:
      return unreachable(shape);
  }
}

/** The derived members as the refusal message names them: `fk3d at depth 1, fk at depth 2`. */
export function describeDerivedChain(members: readonly DerivedChainMember[]): string {
  return members
    .map(({ depth, plugins }) => `${plugins.join("+")} at depth ${String(depth)}`)
    .join(", ");
}
