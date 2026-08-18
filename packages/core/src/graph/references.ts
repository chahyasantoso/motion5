import type { Diagnostic } from "../contract/v5";
import type { GraphEdge } from "./ir";

/**
 * Rule id for a diagnostic reported when an observation edge's source is a known graph node
 * whose value is not currently available for publication.
 */
export const PENDING_REFERENCE_RULE_ID = "observation-pending-reference";

export type ReferenceStatus = "resolved" | "pending";

export interface ReferenceResolution {
  readonly status: ReferenceStatus;
  readonly diagnostic?: Diagnostic;
}

/** The deterministic diagnostic for a pending observation edge. */
export function pendingReferenceDiagnostic(edge: GraphEdge): Diagnostic {
  return Object.freeze({
    ruleId: PENDING_REFERENCE_RULE_ID,
    path: edge.observerId,
    message: `Observation source "${edge.sourceId}" is a known node with no published value yet.`,
    severity: "warning",
    ids: Object.freeze([edge.sourceId, edge.observerId]),
  });
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
): { readonly edge: GraphEdge; readonly diagnostic: Diagnostic } | undefined {
  for (const edge of [...edges].sort(compareEdges)) {
    const resolution = classifyReference(edge, hasValue);
    if (resolution.status === "pending" && resolution.diagnostic !== undefined)
      return { edge, diagnostic: resolution.diagnostic };
  }
  return undefined;
}
