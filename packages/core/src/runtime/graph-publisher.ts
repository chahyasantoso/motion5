import type { Diagnostic } from "../contract/v5";
import type { GraphIR, GraphNode } from "../graph/ir";
import { PatchRegistry, type PatchBatch } from "./patch-registry";

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
          for (const edge of node.edges) {
            if (edge.role !== "input") continue;
            inputs[edge.target ?? ""] =
              memo.get(edge.sourceId)?.values ?? this.#registry.get(edge.sourceId)?.values;
          }
          const composed = node.compose(inputs);
          memo.set(id, composed);
          this.#registry.publish({
            nodeId: id,
            values: composed.values,
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
      this.#registry.closeBatch();
      throw error;
    }
  }
}
