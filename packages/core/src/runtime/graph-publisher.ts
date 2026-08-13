import type { Diagnostic, InputProjection } from "../contract/v5";
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

class InputObservationError extends Error {
  constructor(
    readonly ruleId: "observation-input-shape" | "observation-input-collision",
    message: string,
  ) {
    super(message);
    this.name = ruleId;
  }
}
function diagnostic(nodeId: string, error: unknown): Diagnostic {
  const ruleId = error instanceof InputObservationError ? error.ruleId : "composition-failure";
  return Object.freeze({
    ruleId,
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
  return overlay === undefined ? base : Object.freeze({ ...base, ...overlay });
}
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function projectValues(
  source: Readonly<Record<string, unknown>>,
  projection: InputProjection | undefined,
): Readonly<Record<string, unknown>> {
  if (projection === undefined) return source;
  if (projection.pick !== undefined)
    return Object.fromEntries(
      projection.pick.filter((key) => key in source).map((key) => [key, source[key]]),
    );
  if (projection.map !== undefined)
    return Object.fromEntries(
      Object.entries(projection.map)
        .filter(([sourceKey]) => sourceKey in source)
        .map(([sourceKey, targetKey]) => [targetKey, source[sourceKey]]),
    );
  throw new InputObservationError(
    "observation-input-shape",
    "Input projection must define pick or map.",
  );
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
          const inputKeys = new Map<string, string>();
          for (const edge of node.edges
            .filter(({ role }) => role === "input")
            .sort(compareEdgeKeys)) {
            const sourceValues =
              memo.get(edge.sourceId)?.values ?? this.#registry.get(edge.sourceId)?.values;
            if (sourceValues === undefined) continue;
            if (!isRecord(sourceValues))
              throw new InputObservationError(
                "observation-input-shape",
                `Input observation source "${edge.sourceId}" must be a record.`,
              );
            const projected = projectValues(sourceValues, edge.projection);
            for (const [key, value] of Object.entries(projected)) {
              const previous = inputKeys.get(key);
              if (previous !== undefined)
                throw new InputObservationError(
                  "observation-input-collision",
                  `Input key "${key}" from ${edgeKey(edge)} collides with ${previous}.`,
                );
              inputKeys.set(key, edgeKey(edge));
              inputs[key] = value;
            }
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
        /* Preserve the original flush failure. */
      }
      throw error;
    }
  }
}
