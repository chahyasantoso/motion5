import { unreachable } from "../lang/exhaustive";

/**
 * A solver plugin's declared chain capability, and the one owner of which derived chains a solver
 * can answer. The graph derives membership and depth for every solver alike (ADR-051), then asks
 * this module whether the chain it derived is one the solver's plugin declares, so a plugin's
 * supported shape is a contract fact read at load rather than a throw at composition. See ADR-114.
 *
 * The union is closed. `tree` is any chain the graph derives, of any member count and any
 * branching, whose every member binds the solver through `memberPlugin` alone: the 3D-dedicated
 * shape `ik3d` declares since issue #500's fifth phase, whose dispatcher answers a parent and its
 * addressed child with the closed form and every other chain with 3D FABRIK (ADR-122). It replaced
 * `unbranched`, the exactly-two-members-on-one-path shape of the ADR-114 prototype, which is deleted
 * rather than kept beside it, because no solver declares it any more and a union member nobody
 * declares is a branch nobody can test. `any` is every other solver, the 2D `ik` among them, which
 * dispatches on the derived shape and so refuses no count or branching (issue #195 deleted the arity
 * rule that used to). A plugin missing from the table is `any`, because a solver that declares
 * nothing has promised nothing narrower than the graph's own rules.
 *
 * A member plugin a `tree` shape names is dedicated to that shape: it publishes nothing a solver of
 * another shape reads, so an `fk3d` member under a 2D `ik` solver would compose identity on every
 * tick without a symptom. The dedicated set is derived from the table rather than stated beside it,
 * so declaring a new dedicated member plugin is one table entry.
 */
export type SolverChainShape =
  | Readonly<{ kind: "any" }>
  | Readonly<{ kind: "tree"; memberPlugin: string }>;

/**
 * One member as the graph derived it under a solver: its `base` hop count to the root, every plugin
 * through which it binds that solver's `solver` slot, sorted, normally exactly one, and whether it
 * authored a 3D joint that constrains the solve under one of those plugins (ADR-123), read through
 * `authorsConstrainingJoint`.
 */
export type DerivedChainMember = Readonly<{
  depth: number;
  plugins: readonly string[];
  constrained: boolean;
}>;

const ANY: SolverChainShape = Object.freeze({ kind: "any" });

const SOLVER_CHAIN_SHAPES: Readonly<Record<string, SolverChainShape>> = Object.freeze({
  ik3d: Object.freeze({ kind: "tree", memberPlugin: "fk3d" }),
});

function dedicatedPluginOf(shape: SolverChainShape): string | undefined {
  switch (shape.kind) {
    case "any":
      return undefined;
    case "tree":
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
 * Whether the members derived under one solver describe a chain `shape` accepts: for `any`, no
 * member binds through a plugin some other shape dedicates, and for `tree`, every member binds
 * through the shape's own plugin and nothing else. Count and branching are not read by either,
 * because both strategies behind `tree` answer every count and branching the graph derives; the
 * graph's own rules (`ik-solver-no-members`, `ik-goal-not-leaf`, `ik-target-not-single-leaf`) still
 * refuse the shapes no solve can answer.
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
    case "tree":
      return members.every(({ plugins }) =>
        plugins.every((plugin) => plugin === shape.memberPlugin),
      );
    default:
      return unreachable(shape);
  }
}

/**
 * Which strategy a solver of `shape` answers the derived members with, read at load (ADR-122).
 *
 * `closed-form` is a parent and its one child: exactly two members, one at depth 1 and one at depth
 * 2, neither constrained, which on a chain that loads is the closed form's parent and addressed
 * child, because the graph refuses a goal on the parent (`ik-goal-not-leaf`) and a leaf with none
 * (`ik-leaf-without-goal`, `ik-solver-no-goal`). `iterative` is every other chain a `tree` shape
 * accepts, a constrained two-member chain among them, because the runtime sends any chain with a
 * constraining joint to 3D FABRIK before it looks for a pair (ADR-123). `any` shapes answer
 * `iterative` too: the 2D solve reads no member rest orientation on either of its paths, so the one
 * question this is asked for has the same answer there. It restates at load, from depths alone, the
 * runtime proof `packages/plugins/src/ik-topology.ts`'s `twoBonePair` makes from ids and goals,
 * because the graph holds no plugin and a plugin holds no graph; `TH-76` holds the two readings
 * equal over every derived shape up to five members, constrained and not.
 */
export type DerivedStrategy = "closed-form" | "iterative";

export function derivedStrategy(
  shape: SolverChainShape,
  members: readonly DerivedChainMember[],
): DerivedStrategy {
  switch (shape.kind) {
    case "any":
      return "iterative";
    case "tree": {
      if (members.some(({ constrained }) => constrained)) return "iterative";
      const depths = members.map(({ depth }) => depth).sort((a, b) => a - b);
      return depths.length === 2 && depths[0] === 1 && depths[1] === 2
        ? "closed-form"
        : "iterative";
    }
    default:
      return unreachable(shape);
  }
}

/**
 * Whether a solve of `shape` over `members` reads each member's authored rest orientation, which is
 * what decides whether `ik-solved-rotation-dead` may call that orientation dead.
 *
 * The 3D tree solve reconstructs every member's roll as the minimal swing from its rest orientation
 * under its solved parent (ADR-122), so under it the rest is live input at every weight, and a
 * refusal would reject a rig whose authored value changes the pose. The closed form publishes its
 * triples outright and the 2D solve replaces the rotation it solves, so under either one the rest
 * orientation still reaches the output only through a `weight`.
 */
export function readsMemberRest(
  shape: SolverChainShape,
  members: readonly DerivedChainMember[],
): boolean {
  switch (shape.kind) {
    case "any":
      return false;
    case "tree": {
      const strategy = derivedStrategy(shape, members);
      switch (strategy) {
        case "closed-form":
          return false;
        case "iterative":
          return true;
        default:
          return unreachable(strategy);
      }
    }
    default:
      return unreachable(shape);
  }
}

/**
 * Whether a pole bound on a solver over `members` can bend anything: some member sits at depth 2 or
 * deeper, so at least one root-to-leaf path has an interior joint whose plane the pole picks. A
 * chain whose every member hangs from the root is a fan of single segments, each of which points
 * straight at its goal in either strategy, and a pole bound there is refused at load as
 * `ik-pole-without-bend` rather than accepted and ignored (ADR-122).
 */
export function poleBends(members: readonly DerivedChainMember[]): boolean {
  return members.some(({ depth }) => depth >= 2);
}

/** What `shape` accepts, in the words the refusal message uses. */
export function describeChainShape(shape: SolverChainShape): string {
  switch (shape.kind) {
    case "any":
      return `any chain without ${DEDICATED_MEMBER_PLUGINS.join(" or ")} members`;
    case "tree":
      return `any chain of ${shape.memberPlugin} members only`;
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
