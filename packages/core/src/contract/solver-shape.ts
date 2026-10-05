import { unreachable } from "../lang/exhaustive";

/**
 * A solver plugin's declared chain capability, and the one owner of which derived chains a solver
 * can answer. The graph derives membership and depth for every solver alike (ADR-051), then asks
 * this module whether the chain it derived is one the solver's plugin declares, so a plugin's
 * supported shape is a contract fact read at load rather than a throw at composition. The registry
 * derives immutable capabilities at admission and the graph reads only the port (ADR-136, ADR-044).
 *
 * The union is closed. `tree` is any chain the graph derives, of any member count and any
 * branching, whose every member binds the solver through `memberPlugin` alone. `any` makes no
 * promise narrower than the graph's own topology rules. An admitted definition with no declaration
 * has that shape; an unknown plugin has no capability and is not judged, rather than assumed `any`.
 *
 * A member plugin a `tree` shape names is dedicated to that shape: it publishes nothing a solver of
 * another shape reads. Dedication is derived registry-wide from admitted tree declarations, not
 * from the members used in one project. The port supplies a sorted frozen array, never a mutable Set.
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

export const ANY_CHAIN: SolverChainShape = Object.freeze({ kind: "any" });

/**
 * The requirement slot an authored pole binds (ADR-118).
 *
 * A pole is a slot rather than a key, so the registry already refuses it by name under a plugin
 * that does not declare it (`plugin-unknown-requirement`). The graph holds no registry (ADR-044),
 * and its own pole rule, `ik-pole-without-chain`, asks a narrower question that only means
 * something under a plugin that does declare the slot: whether the group that bound it also bound
 * the chain's `root`. The capabilities port supplies that fact, derived from the admitted
 * requirements record rather than a second spelling in core (ADR-136).
 */
export const POLE_SLOT = "pole" as const;

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
  dedicated: readonly string[],
): boolean {
  switch (shape.kind) {
    case "any":
      return members.every(({ plugins }) => plugins.every((plugin) => !dedicated.includes(plugin)));
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
export function describeChainShape(shape: SolverChainShape, dedicated: readonly string[]): string {
  switch (shape.kind) {
    case "any":
      return `any chain without ${dedicated.join(" or ")} members`;
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
