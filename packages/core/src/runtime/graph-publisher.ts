import type { Diagnostic, InputProjection } from "../contract/v5";
import { edgeKey, type GraphEdge, type GraphIR, type GraphNode } from "../graph/ir";
import { CompositionOutputError } from "../domain/track";
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
    readonly ruleId:
      | "observation-input-shape"
      | "observation-input-collision"
      | "observation-missing-upstream",
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
function compareEdgeKeys(a: GraphEdge, b: GraphEdge): number {
  const left = edgeKey(a),
    right = edgeKey(b);
  return left < right ? -1 : left > right ? 1 : 0;
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
          .filter((edge) => failed.has(edge.sourceId) || blocked.has(edge.sourceId))
          .sort(compareEdgeKeys)[0]?.sourceId;
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
          const sourceRevisions: Record<string, number> = {};
          for (const edge of node.edges
            .filter(({ role }) => role === "input")
            .sort(compareEdgeKeys)) {
            const sourcePatch = this.#registry.get(edge.sourceId);
            const sourceValues = memo.get(edge.sourceId)?.values ?? sourcePatch?.values;
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
          validateComposition(composed.values);
          let values = composed.values;
          for (const edge of node.edges
            .filter(({ role }) => role === "output")
            .sort(compareEdgeKeys)) {
            const sourcePatch = this.#registry.get(edge.sourceId);
            const sourceValues = memo.get(edge.sourceId)?.values ?? sourcePatch?.values;
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
