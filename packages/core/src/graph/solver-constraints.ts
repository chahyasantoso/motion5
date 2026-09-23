import { unreachable } from "../lang/exhaustive";
import {
  authoredSpellings,
  BEND_KEY,
  classifyBend,
  classifyLimit,
  FLIP_KEY,
  LIMIT_KEYS,
  type AuthoredSpelling,
  type LimitKey,
} from "../contract/solver-constraints";
import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic } from "../contract/v5";
import type { GraphNode } from "./ir";

/**
 * The five load rules of constrained 2D solving. See ADR-108.
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
 */

/** The plugins under which this node bound a `solver` slot, read from its derived edges. */
function solverGroups(node: GraphNode): ReadonlySet<string> {
  return new Set(
    node.edges.flatMap((edge) => {
      const requirement = edge.role === "input" ? edge.requirement : undefined;
      return requirement?.slot === "solver" ? [requirement.plugin] : [];
    }),
  );
}

function reachesSolve(spelling: AuthoredSpelling, binders: ReadonlySet<string>): boolean {
  return spelling.group === undefined ? binders.size > 0 : binders.has(spelling.group);
}

function validateMemberLimits(node: GraphNode, diagnostics: Diagnostic[]): void {
  const binders = solverGroups(node);
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

function validateSolverBend(node: GraphNode, diagnostics: Diagnostic[]): void {
  const bends = authoredSpellings(node.track.keyframes, BEND_KEY);
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
  if (bend !== undefined && authoredSpellings(node.track.keyframes, FLIP_KEY).length > 0) {
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
    validateSolverBend(node, diagnostics);
  }
}
