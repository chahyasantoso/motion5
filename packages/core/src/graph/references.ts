import { diagnostic } from "../contract/diagnostics";
import type { RuleId } from "../contract/rule-id";
import type { Diagnostic } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";
import type { GraphEdge } from "./ir";

/** Diagnostic rule for an edge whose source is a known node with no published value. */
export const PENDING_REFERENCE_RULE_ID = "source-pending" satisfies RuleId;

export type ReferenceStatus = "resolved" | "pending";

export type ReferenceResolution =
  | { readonly status: "resolved" }
  | { readonly status: "pending"; readonly diagnostic: Diagnostic };

/** A pending edge with the diagnostic that blocks its publication. */
export interface PendingEdge {
  readonly edge: GraphEdge;
  readonly diagnostic: Diagnostic;
}

/** Deterministic diagnostic for a pending edge. */
export function pendingReferenceDiagnostic(edge: GraphEdge): Diagnostic {
  return diagnostic(
    PENDING_REFERENCE_RULE_ID,
    edge.observerId,
    `Source "${edge.sourceId}" is a known node with no published value yet.`,
    [edge.sourceId, edge.observerId],
  );
}

/**
 * Classifies a constructed edge as resolved or pending against `hasValue`.
 * A source id missing from the authored project was rejected at load, so it never arrives. */
export function classifyReference(
  edge: GraphEdge,
  hasValue: (sourceId: string) => boolean,
): ReferenceResolution {
  if (hasValue(edge.sourceId)) return Object.freeze({ status: "resolved" });
  return Object.freeze({ status: "pending", diagnostic: pendingReferenceDiagnostic(edge) });
}

/**
 * First edge in canonical order whose source is pending, else `undefined`.
 * `compareEdges` owns the order, so authored order or identity encoding never decides. */
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
