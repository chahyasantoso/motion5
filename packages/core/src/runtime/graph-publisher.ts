import type { Diagnostic } from "../contract/v5";
import {
  compareEdges,
  describeEdge,
  type GraphEdge,
  type GraphIR,
  type GraphNode,
} from "../graph/ir";
import { firstPendingEdge } from "../graph/references";
import { CompositionOutputError } from "../domain/track";
import type { RequirementInputs } from "../domain/plugins";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE, type PatchBatch } from "./patch-registry";

export interface PublisherComposition {
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
}
export interface PublisherNode extends GraphNode {
  /**
   * Composes the node against its scoped requirement inputs: one record per plugin, one entry per
   * requirement slot the track bound.
   *
   * One parameter, and deliberately only one. There is no flat bag beside it, so there is no code
   * path by which an upstream value can enter the node's authored value namespace. That is a
   * stronger guarantee than "no caller merges one": no parameter exists to merge one with.
   * See ADR-044 and ADR-047.
   */
  readonly compose: (requirementInputs: RequirementInputs) => PublisherComposition;
}
export interface PublisherSnapshot extends GraphIR {
  readonly nodes: readonly PublisherNode[];
}
export interface PublisherFailure {
  readonly nodeId: string;
  readonly error: unknown;
}

class InputObservationError extends Error {
  constructor(
    readonly ruleId: "observation-input-shape" | "observation-missing-upstream",
    message: string,
  ) {
    super(message);
    this.name = ruleId;
  }
}
class OutputObservationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "observation-output-shape";
  }
  readonly ruleId = "observation-output-shape" as const;
}
function diagnostic(nodeId: string, error: unknown): Diagnostic {
  const ruleId =
    error instanceof InputObservationError ||
    error instanceof OutputObservationError ||
    error instanceof CompositionOutputError
      ? error.ruleId
      : "composition-failure";
  return Object.freeze({
    ruleId,
    path: nodeId,
    message: error instanceof Error ? error.message : String(error),
    severity: "error",
    ids: Object.freeze([nodeId]),
  });
}
/**
 * A node's edges of one role in canonical order. `compareEdges` in `graph/ir.ts` is the only
 * ordering owner, so which source wins an output merge is never authored-order dependent and
 * never a property of how an id encodes.
 *
 * `role` names the composition phase: inputs are collected before `node.compose`, outputs are
 * merged after it. Every input edge now carries a requirement, so this split is also the split
 * between derived dependencies and authored `observes` entries. See ADR-047.
 */
function edgesByRole(node: PublisherNode, role: GraphEdge["role"]): readonly GraphEdge[] {
  return node.edges.filter((edge) => edge.role === role).sort(compareEdges);
}
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function isRendererNeutral(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null) return true;
  if (typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.every((item) => isRendererNeutral(item, seen));
  if (!isRecord(value)) return false;
  return Object.entries(value).every(
    ([key, item]) => !key.startsWith("_") && isRendererNeutral(item, seen),
  );
}
function validateComposition(values: unknown): asserts values is Readonly<Record<string, unknown>> {
  if (!isRecord(values) || !isRendererNeutral(values))
    throw new CompositionOutputError(
      "Composition output must contain only renderer-neutral values.",
    );
}
function mergeValues(
  base: Readonly<Record<string, unknown>>,
  overlay: Readonly<Record<string, unknown>> | undefined,
): Readonly<Record<string, unknown>> {
  return overlay === undefined ? base : Object.freeze({ ...base, ...overlay });
}
/**
 * Freezes the collected scoped inputs one level down, so a composer cannot reach back into the
 * publisher's accumulator. There is no projection step: the slot is the scope, so the source's
 * values arrive whole and under their own names. See ADR-044.
 */
function freezeRequirementInputs(
  collected: Readonly<Record<string, Record<string, unknown>>>,
): RequirementInputs {
  const scoped: Record<string, Readonly<Record<string, unknown>>> = {};
  for (const [plugin, slots] of Object.entries(collected))
    scoped[plugin] = Object.freeze({ ...slots });
  return Object.freeze(scoped) as RequirementInputs;
}

export class GraphPublisher {
  readonly #registry: PatchRegistry;
  constructor(registry: PatchRegistry) {
    this.#registry = registry;
  }
  flush(snapshot: PublisherSnapshot, seeds: readonly string[], tick: number): PatchBatch {
    if (this.#registry.notifying) throw new Error(REENTRANT_BATCH_MESSAGE);
    const byId = new Map(snapshot.nodes.map((node) => [node.id, node]));
    const dependents = new Map<string, string[]>();
    for (const node of snapshot.nodes) dependents.set(node.id, []);
    for (const node of snapshot.nodes)
      for (const edge of node.edges) dependents.get(edge.sourceId)?.push(node.id);
    const affected = new Set<string>();
    const queue = [...seeds];
    for (let index = 0; index < queue.length; index += 1) {
      const id = queue[index];
      if (id === undefined || affected.has(id)) continue;
      affected.add(id);
      queue.push(...(dependents.get(id) ?? []));
    }
    const failed = new Map<string, Diagnostic>();
    const blocked = new Set<string>();
    const pending = new Set<string>();
    const memo = new Map<string, PublisherComposition>();
    const hasValue = (sourceId: string) =>
      memo.has(sourceId) || this.#registry.get(sourceId) !== undefined;
    this.#registry.beginBatch(tick, seeds);
    try {
      for (const id of snapshot.order) {
        if (!affected.has(id)) continue;
        const node = byId.get(id);
        if (node === undefined) continue;
        const sourceFailure = node.edges
          .filter(
            (edge) =>
              failed.has(edge.sourceId) || blocked.has(edge.sourceId) || pending.has(edge.sourceId),
          )
          .sort(compareEdges)[0]?.sourceId;
        if (sourceFailure !== undefined) {
          blocked.add(id);
          this.#registry.publish({
            nodeId: id,
            sourceProgress: 0,
            status: "blocked",
            diagnostics: [
              Object.freeze({
                ruleId: "blocked-upstream",
                path: id,
                message: `Blocked by upstream state at ${sourceFailure}.`,
                severity: "error",
                ids: Object.freeze([sourceFailure, id]),
              }),
            ],
          });
          continue;
        }
        // A source that graph construction already accepted but that has not published a
        // value yet (typically because it is not currently a member) is pending, not failed.
        // Classified up front, before composition is attempted, so this is never decided by
        // catching an exception. graph/references.ts is the single owner of this decision.
        const pendingMatch = firstPendingEdge(node.edges, compareEdges, hasValue);
        if (pendingMatch !== undefined) {
          pending.add(id);
          this.#registry.publish({
            nodeId: id,
            sourceProgress: 0,
            status: "blocked",
            diagnostics: [pendingMatch.diagnostic],
          });
          continue;
        }
        try {
          const collected: Record<string, Record<string, unknown>> = {};
          const sourceRevisions: Record<string, number> = {};
          for (const edge of edgesByRole(node, "input")) {
            const sourcePatch = this.#registry.get(edge.sourceId);
            const sourceValues = memo.get(edge.sourceId)?.values ?? sourcePatch?.values;
            // Unreachable in normal flow: the pending pre-check above already classified every
            // edge as resolved before this loop runs. Kept as a defensive invariant guard only.
            if (sourceValues === undefined)
              throw new InputObservationError(
                "observation-missing-upstream",
                `Input observation source "${edge.sourceId}" has no published value.`,
              );
            if (!isRecord(sourceValues))
              throw new InputObservationError(
                "observation-input-shape",
                `Input observation source "${edge.sourceId}" must be a record.`,
              );
            if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
            const requirement = edge.requirement;
            // Unreachable by construction now that `observes` is output-only: every input edge is
            // derived from a binding and carries its scope. Thrown rather than skipped, because an
            // edge in the input phase with nothing to scope it has no destination at all, and a
            // silent skip would drop a dependency graph construction accepted. Same shape as the
            // two guards above. See ADR-047.
            if (requirement === undefined)
              throw new InputObservationError(
                "observation-input-shape",
                `Input observation edge ${describeEdge(edge)} carries no requirement.`,
              );
            // The slot is the scope, so the source's values arrive whole and under their own names.
            // Nothing is projected and nothing is flat-merged, so there is no key left to collide
            // with and no collision guard left to reach. See ADR-044.
            (collected[requirement.plugin] ??= {})[requirement.slot] = sourceValues;
          }
          const composed = node.compose(freezeRequirementInputs(collected));
          validateComposition(composed.values);
          let values = composed.values;
          for (const edge of edgesByRole(node, "output")) {
            const sourcePatch = this.#registry.get(edge.sourceId);
            const sourceValues = memo.get(edge.sourceId)?.values ?? sourcePatch?.values;
            // Unreachable in normal flow, same reasoning as the input-side guard above.
            if (sourceValues === undefined)
              throw new InputObservationError(
                "observation-missing-upstream",
                `Output observation source "${edge.sourceId}" has no published value.`,
              );
            if (!isRecord(sourceValues) || !isRendererNeutral(sourceValues))
              throw new OutputObservationError(
                `Output observation source "${edge.sourceId}" must publish a renderer-neutral record.`,
              );
            if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
            values = mergeValues(values, sourceValues);
          }
          const finalComposition = {
            ...composed,
            values,
            sourceRevisions: { ...composed.sourceRevisions, ...sourceRevisions },
          };
          memo.set(id, finalComposition);
          this.#registry.publish({
            nodeId: id,
            values,
            sourceProgress: composed.sourceProgress,
            sourceRevisions: finalComposition.sourceRevisions,
            status: "ready",
            diagnostics: [],
          });
        } catch (error) {
          const failure = diagnostic(id, error);
          failed.set(id, failure);
          this.#registry.publish({
            nodeId: id,
            sourceProgress: 0,
            status: "error",
            diagnostics: [failure],
          });
        }
      }
      return this.#registry.closeBatch();
    } catch (error) {
      try {
        this.#registry.closeBatch();
      } catch {
        /* preserve original flush failure */
      }
      throw error;
    }
  }
}
