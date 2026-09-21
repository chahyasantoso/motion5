import { diagnostic } from "../contract/diagnostics";
import type { RuleId } from "../contract/rule-id";
import type { Diagnostic } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";
import type { GraphEdge } from "./ir";

/**
 * Rule id for a diagnostic reported when an observation edge's source is a known graph node
 * whose value is not currently available for publication.
 */
export const PENDING_REFERENCE_RULE_ID = "observation-pending-reference" satisfies RuleId;

export type ReferenceStatus = "resolved" | "pending";

export type ReferenceResolution =
  | { readonly status: "resolved" }
  | { readonly status: "pending"; readonly diagnostic: Diagnostic };

/** A pending edge together with the diagnostic that blocks its publication. */
export interface PendingEdge {
  readonly edge: GraphEdge;
  readonly diagnostic: Diagnostic;
}

/**
 * The deterministic diagnostic for a pending observation edge.
 *
 * `observation-pending-reference` is one of the six warning rules, and this was one of the four raw
 * literals that spelled a severity for itself. It reaches the one constructor now, so the
 * `"warning"` it used to hand-write is read from `contract/rule.ts` instead. This producer is the
 * reason that mattered most: a raw literal naming a warning rule is the one shape where a later
 * edit could have silently disagreed with the registry in the quieter direction and published an
 * error where the rule asks for a warning. See ADR-097 and issue #449.
 */
export function pendingReferenceDiagnostic(edge: GraphEdge): Diagnostic {
  return diagnostic(
    PENDING_REFERENCE_RULE_ID,
    edge.observerId,
    `Observation source "${edge.sourceId}" is a known node with no published value yet.`,
    [edge.sourceId, edge.observerId],
  );
}

/**
 * The single owner of pending-versus-resolved classification for an observation edge.
 *
 * An edge whose source id does not exist anywhere in the authored project is already
 * rejected as a load-time error by `graph/ir.ts`, before a `GraphEdge` referencing it is ever
 * constructed: this function is never reached for that case. Given an edge that graph
 * construction has already accepted, there are exactly two outcomes: the source currently has
 * a published value (`resolved`), or it does not (`pending`). There is no third state, and a
 * pending reference carries a diagnostic but never a fabricated value.
 *
 * `hasValue` is supplied by the caller so this module stays free of any dependency on the
 * patch registry, the publisher, or the runtime: it only knows how to classify an edge, not
 * where published values live or how membership is tracked.
 */
export function classifyReference(
  edge: GraphEdge,
  hasValue: (sourceId: string) => boolean,
): ReferenceResolution {
  if (hasValue(edge.sourceId)) return Object.freeze({ status: "resolved" });
  return Object.freeze({ status: "pending", diagnostic: pendingReferenceDiagnostic(edge) });
}

/**
 * The first edge (in canonical edge order) among `edges` whose source is pending, or
 * `undefined` if every source is currently resolved. The comparator is injected, and
 * `compareEdges` in `graph/ir.ts` owns it, so which pending source is named in a node's
 * diagnostic never depends on authored edge order or on an identity encoding.
 */
export function firstPendingEdge(
  edges: readonly GraphEdge[],
  compareEdges: (a: GraphEdge, b: GraphEdge) => number,
  hasValue: (sourceId: string) => boolean,
): PendingEdge | undefined {
  for (const edge of [...edges].sort(compareEdges)) {
    const resolution = classifyReference(edge, hasValue);
    switch (resolution.status) {
      case "resolved":
        break;
      case "pending":
        return { edge, diagnostic: resolution.diagnostic };
      default:
        return unreachable(resolution);
    }
  }
  return undefined;
}
