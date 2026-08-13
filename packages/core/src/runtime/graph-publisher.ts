import type { Diagnostic } from "../contract/v5";
import { edgeKey, type GraphEdge, type GraphIR, type GraphNode } from "../graph/ir";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE, type PatchBatch } from "./patch-registry";

export interface PublisherComposition {
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
}

export interface PublisherNode extends GraphNode {
  readonly compose: (inputs: Readonly<Record<string, unknown>>) => PublisherComposition;
}

export interface PublisherSnapshot extends GraphIR {
  readonly nodes: readonly PublisherNode[];
}

export interface PublisherFailure {
  readonly nodeId: string;
  readonly error: unknown;
}

function diagnostic(nodeId: string, error: unknown): Diagnostic {
  return Object.freeze({
    ruleId: "composition-failure",
    path: nodeId,
    message: error instanceof Error ? error.message : String(error),
    severity: "error",
    ids: Object.freeze([nodeId]),
  });
}

function compareEdgeKeys(a: GraphEdge, b: GraphEdge): number {
  const left = edgeKey(a);
  const right = edgeKey(b);
  return left < right ? -1 : left > right ? 1 : 0;
}

function mergeValues(
  base: Readonly<Record<string, unknown>>,
  overlay: Readonly<Record<string, unknown>> | undefined,
): Readonly<Record<string, unknown>> {
  if (overlay === undefined) return base;
  return Object.freeze({ ...base, ...overlay });
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * One-way publication over an immutable, validated snapshot. It owns traversal and failure
 * containment, but exposes no topology mutation methods. Dirty composition is memoized per
 * flush, and a failure blocks only the downstream closure of that node.
 */
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
    const memo = new Map<string, PublisherComposition>();
    this.#registry.beginBatch(tick, seeds);
    try {
      for (const id of snapshot.order) {
        if (!affected.has(id)) continue;
        const node = byId.get(id);
        if (node === undefined) continue;
        const sourceFailure = node.edges
          .map((edge) => edge.sourceId)
          .find((sourceId) => failed.has(sourceId) || blocked.has(sourceId));
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
                message: `Blocked by upstream failure at ${sourceFailure}.`,
                severity: "error",
                ids: Object.freeze([sourceFailure, id]),
              }),
            ],
          });
          continue;
        }
        try {
          const inputs: Record<string, unknown> = {};
          for (const edge of node.edges
            .filter(({ role }) => role === "input")
            .sort(compareEdgeKeys)) {
            const sourceValues =
              memo.get(edge.sourceId)?.values ?? this.#registry.get(edge.sourceId)?.values;
            if (sourceValues === undefined) continue;
            if (!isRecord(sourceValues))
              throw new TypeError(`Input observation source "${edge.sourceId}" must be a record.`);
            Object.assign(inputs, sourceValues);
          }
          const composed = node.compose(inputs);
          let values = composed.values;
          for (const edge of node.edges
            .filter(({ role }) => role === "output")
            .sort(compareEdgeKeys)) {
            const sourceValues =
              memo.get(edge.sourceId)?.values ?? this.#registry.get(edge.sourceId)?.values;
            values = mergeValues(values, sourceValues);
          }
          memo.set(id, { ...composed, values });
          this.#registry.publish({
            nodeId: id,
            values,
            sourceProgress: composed.sourceProgress,
            sourceRevisions: composed.sourceRevisions,
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
        // Preserve the original flush failure.
      }
      throw error;
    }
  }
}
