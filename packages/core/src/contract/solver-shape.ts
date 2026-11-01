import { unreachable } from "../lang/exhaustive";

/** Closed chain-capability union: which derived chains a solver plugin answers.
 * `any` = any chain graph derives; `tree` = every member via `memberPlugin`, dedicated to that shape. */
export type SolverChainShape =
  | Readonly<{ kind: "any" }>
  | Readonly<{ kind: "tree"; memberPlugin: string }>;

/** Member as graph derived it under a solver.
 * `depth` hops to root; `plugins` bind solver's `solver` slot, sorted, usually one; `constrained` authored 3D joint constrains solve. */
export type DerivedChainMember = Readonly<{
  depth: number;
  plugins: readonly string[];
  constrained: boolean;
}>;

export const ANY_CHAIN: SolverChainShape = Object.freeze({ kind: "any" });

/** Requirement slot an authored pole binds.
 * `ik-pole-without-chain` asks whether that group also bound `root`; port derives the slot from admitted requirements. */
export const POLE_SLOT = "pole" as const;

/** Whether derived `members` are a chain `shape` accepts.
 * `any`: no member binds a plugin another shape dedicates; `tree`: all bind `memberPlugin` only; count, branching unread. */
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

/** Which strategy a solver of `shape` answers `members` with, at load.
 * `closed-form`: exactly two unconstrained members, depths 1 and 2; `iterative`: all else, `any` included. */
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

/** Whether solve of `shape` reads each member's authored rest orientation.
 * 3D tree solve reconstructs roll from it: live input, true; closed form and 2D solve: only via `weight`, false. */
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

/** Whether a pole over `members` bends anything: some member at depth 2 or deeper.
 * Every member off root = fan of straight segments; pole there refused at load as `ik-pole-without-bend`. */
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
