import { unreachable } from "../lang/exhaustive";
import {
  authoredSpellings,
  BEND_KEY,
  classifyBend,
  classifyInspect,
  classifyLimit,
  FLIP_KEY,
  INSPECT_KEY,
  LIMIT_KEYS,
  type AuthoredSpelling,
  type LimitKey,
  type SolverKey,
} from "../contract/solver-constraints";
import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic } from "../contract/v5";
import type { GraphNode } from "./ir";

/**
 * The load rules of the solver's authored constraints: the six of constrained 2D solving (ADR-108)
 * and the inspection switch's one (ADR-109).
 *
 * **Every spelling, because the solve reads the flat bag.** A member's limits reach `ik` through
 * the member's flattened values, where a flat `minRotation` and one grouped under any plugin are
 * the same key (ADR-043). Each rule therefore reads every spelling through `authoredSpellings`,
 * never only `fk.values`: a rule narrower than the reader it guards passes the other spelling to the
 * runtime unvalidated, which is how a keyframed bound would become an animated constraint.
 *
 * **Limit keys are solver vocabulary.** A limit is read by the solve and by nothing else, so a
 * limit anywhere a solve cannot reach it is a field accepted and ignored (ADR-033 rule 6). Grouped,
 * it must sit under a group that bound a `solver` slot, which is the scope `ik-weight-without-solver`
 * already reads; flat, the node must bind a solver somewhere. `fk` is the one core claimant, so a
 * second plugin claiming the name would already make the flat spelling ambiguous at the registry.
 *
 * **Solver keys belong to the node that bound `root`.** `bend`, `flip` and `inspect` are read by
 * the `ik` composer of the node that bound `root`, flat or under the group that bound it, and by
 * nothing else, so the rules read exactly those spellings through `solverSpellings`. The first
 * revision read `bend` and `flip` under any group on any node, which refused a third-party plugin's
 * own `spring.values.bend` on a node that is no solver at all; phase 4's first draft repeated that
 * for `inspect`, and routing it through the same reader is what keeps the scope one decision.
 */

/** The plugins under which this node bound `slot`, read from its derived edges. */
function slotBinders(node: GraphNode, slot: "root" | "solver"): ReadonlySet<string> {
  return new Set(
    node.edges.flatMap((edge) => {
      const requirement = edge.role === "input" ? edge.requirement : undefined;
      return requirement?.slot === slot ? [requirement.plugin] : [];
    }),
  );
}

function reachesSolve(spelling: AuthoredSpelling, binders: ReadonlySet<string>): boolean {
  return spelling.group === undefined ? binders.size > 0 : binders.has(spelling.group);
}

/**
 * The spellings of one solver key that a solve reads, refusing the ones it reads from elsewhere.
 *
 * A solver key belongs to the node that bound `root`, flat or under the group that bound it. On a
 * node that bound no `root` the key is not solver vocabulary at all, it is some other plugin's own
 * key, so nothing is read and nothing is refused. On a solver node a spelling under any other group
 * still reaches the solve, because the solve reads the flattened bag (ADR-043), so it is refused as
 * `ik-solver-key-misgrouped` rather than steering the solve from a group that does not own it.
 */
function solverSpellings(
  node: GraphNode,
  key: SolverKey,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): readonly AuthoredSpelling[] {
  if (roots.size === 0) return [];
  const spellings = authoredSpellings(node.track.keyframes, key);
  for (const spelling of spellings) {
    if (reachesSolve(spelling, roots)) continue;
    diagnostics.push(
      diagnostic(
        "ik-solver-key-misgrouped",
        `${node.id}.keyframes.${spelling.path}`,
        `Solver "${node.id}" authors ${key} under ${spelling.group}, which did not bind its root; author it flat or under ${[...roots].join(", ")}.`,
        [node.id],
      ),
    );
  }
  return spellings.filter((spelling) => reachesSolve(spelling, roots));
}

function validateMemberLimits(node: GraphNode, diagnostics: Diagnostic[]): void {
  const binders = slotBinders(node, "solver");
  const values: Partial<Record<LimitKey, unknown>> = {};
  const paths: Partial<Record<LimitKey, string>> = {};
  for (const key of LIMIT_KEYS) {
    for (const spelling of authoredSpellings(node.track.keyframes, key)) {
      if (!reachesSolve(spelling, binders)) {
        const where = spelling.group === undefined ? "flat" : `under ${spelling.group}`;
        diagnostics.push(
          diagnostic(
            "ik-limit-without-solver",
            `${node.id}.keyframes.${spelling.path}`,
            `Node "${node.id}" authors ${key} ${where} without binding a solver there; no solve reads it.`,
            [node.id],
          ),
        );
        continue;
      }
      // `keyframes-duplicate-key` refuses a second spelling of one key, so the first is the one.
      if (Object.hasOwn(values, key)) continue;
      values[key] = spelling.value;
      paths[key] = spelling.path;
    }
  }
  const limit = classifyLimit(values);
  switch (limit.kind) {
    case "free":
    case "range":
      return;
    case "malformed":
      diagnostics.push(
        diagnostic(
          "ik-limit-malformed",
          `${node.id}.keyframes.${paths[limit.key] ?? limit.key}`,
          `Member "${node.id}" has a malformed ${limit.key}; use one static number in [-180, 180].`,
          [node.id],
        ),
      );
      return;
    case "empty":
      diagnostics.push(
        diagnostic(
          "ik-limit-empty",
          `${node.id}.keyframes.${paths.minRotation ?? paths.maxRotation ?? ""}`,
          `Member "${node.id}" has an empty angle limit range [${limit.min}, ${limit.max}].`,
          [node.id],
        ),
      );
      return;
    default:
      return unreachable(limit);
  }
}

function validateSolverInspect(
  node: GraphNode,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): void {
  for (const spelling of solverSpellings(node, INSPECT_KEY, roots, diagnostics)) {
    const inspect = classifyInspect(spelling.value);
    switch (inspect.kind) {
      case "valid":
        break;
      case "malformed":
        diagnostics.push(
          diagnostic(
            "ik-inspect-malformed",
            `${node.id}.keyframes.${spelling.path}`,
            `Solver "${node.id}" has a malformed inspect switch; use one static boolean.`,
            [node.id],
          ),
        );
        break;
      default:
        unreachable(inspect);
    }
  }
}

function validateSolverBend(
  node: GraphNode,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): void {
  const bends = solverSpellings(node, BEND_KEY, roots, diagnostics);
  const flips = solverSpellings(node, FLIP_KEY, roots, diagnostics);
  for (const spelling of bends) {
    const bend = classifyBend(spelling.value);
    switch (bend.kind) {
      case "absent":
      case "bend":
        break;
      case "malformed":
        diagnostics.push(
          diagnostic(
            "ik-bend-malformed",
            `${node.id}.keyframes.${spelling.path}`,
            `Solver "${node.id}" has a malformed bend hint; use "positive" or "negative".`,
            [node.id],
          ),
        );
        break;
      default:
        unreachable(bend);
    }
  }
  const [bend] = bends;
  if (bend !== undefined && flips.length > 0) {
    diagnostics.push(
      diagnostic(
        "ik-bend-conflicts-flip",
        `${node.id}.keyframes.${bend.path}`,
        `Solver "${node.id}" authors both "bend" and "flip"; use one bend spelling.`,
        [node.id],
      ),
    );
  }
}

export function validateSolverConstraints(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
): void {
  for (const node of nodes) {
    validateMemberLimits(node, diagnostics);
    const roots = slotBinders(node, "root");
    validateSolverBend(node, roots, diagnostics);
    validateSolverInspect(node, roots, diagnostics);
  }
}
