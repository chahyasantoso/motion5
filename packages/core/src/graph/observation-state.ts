import { unreachable } from "../lang/exhaustive";
import { compareCodeUnits } from "./compare";
import type { GraphEdge } from "./ir";
import { compareEdges, describeEdge, edgeKey } from "./ir";

/** Read-only structural view of live state for evidence and inspection. */
export interface ObservationStateSnapshot {
  readonly nodes: readonly string[];
  readonly edges: readonly GraphEdge[];
}

// Undo per applied mutation. Closed union: a new verb fails typecheck at rollback's exhaustive switch.
type JournalEntry =
  | { readonly undo: "add-node"; readonly id: string }
  | { readonly undo: "remove-node"; readonly id: string }
  | { readonly undo: "add-edge"; readonly edge: GraphEdge }
  | { readonly undo: "remove-edge"; readonly edge: GraphEdge };

/** One live-state object per loaded project; nodes and edges mutate in place, so held references stay valid.
 * Each mutation journals its inverse; `rollback` replays it, `commit` releases it. */
export class ObservationState {
  readonly #nodes = new Set<string>();
  readonly #edges = new Map<string, GraphEdge>();
  readonly #byObserver = new Map<string, Set<string>>();
  readonly #bySource = new Map<string, Set<string>>();
  #journal: JournalEntry[] = [];
  #replaying = false;

  /** Applied mutations that are still reversible. */
  get journalLength(): number {
    return this.#journal.length;
  }

  hasNode(id: string): boolean {
    return this.#nodes.has(id);
  }

  hasEdge(edge: GraphEdge): boolean {
    return this.#edges.has(edgeKey(edge));
  }

  /** Live edges observed by `observerId`, in canonical order. */
  sourcesOf(observerId: string): readonly GraphEdge[] {
    return this.#collect(this.#byObserver.get(observerId));
  }

  /** Live edges sourced by `sourceId`, in canonical order. */
  observersOf(sourceId: string): readonly GraphEdge[] {
    return this.#collect(this.#bySource.get(sourceId));
  }

  addNode(id: string): void {
    if (this.#nodes.has(id)) throw new TypeError(`Node "${id}" is already live.`);
    this.#nodes.add(id);
    this.#byObserver.set(id, new Set());
    this.#bySource.set(id, new Set());
    this.#record({ undo: "remove-node", id });
  }

  removeNode(id: string): void {
    if (!this.#nodes.has(id)) throw new TypeError(`Node "${id}" is not live.`);
    if ((this.#byObserver.get(id)?.size ?? 0) > 0 || (this.#bySource.get(id)?.size ?? 0) > 0)
      throw new TypeError(`Node "${id}" still has live edges. Remove them first.`);
    this.#nodes.delete(id);
    this.#byObserver.delete(id);
    this.#bySource.delete(id);
    this.#record({ undo: "add-node", id });
  }

  addEdge(edge: GraphEdge): void {
    const live = Object.freeze({ ...edge });
    const key = edgeKey(live);
    if (this.#edges.has(key)) throw new TypeError(`Edge ${describeEdge(live)} is already live.`);
    if (!this.#nodes.has(live.observerId))
      throw new TypeError(`Edge observer "${live.observerId}" is not live.`);
    if (!this.#nodes.has(live.sourceId))
      throw new TypeError(`Edge source "${live.sourceId}" is not live.`);
    this.#edges.set(key, live);
    this.#byObserver.get(live.observerId)?.add(key);
    this.#bySource.get(live.sourceId)?.add(key);
    this.#record({ undo: "remove-edge", edge: live });
  }

  removeEdge(edge: GraphEdge): void {
    const key = edgeKey(edge);
    const live = this.#edges.get(key);
    if (live === undefined) throw new TypeError(`Edge ${describeEdge(edge)} is not live.`);
    this.#edges.delete(key);
    this.#byObserver.get(live.observerId)?.delete(key);
    this.#bySource.get(live.sourceId)?.delete(key);
    this.#record({ undo: "add-edge", edge: live });
  }

  /** Keep applied mutations and release the journal. Live identity untouched. */
  commit(): void {
    this.#journal = [];
  }

  /** Replay the journal in reverse, then release it. Live identity untouched. */
  rollback(): void {
    this.#replaying = true;
    const errors: { index: number; undo: string; error: unknown }[] = [];
    try {
      for (let index = this.#journal.length - 1; index >= 0; index -= 1) {
        const entry = this.#journal[index];
        if (entry === undefined) continue;
        try {
          switch (entry.undo) {
            case "add-node":
              this.addNode(entry.id);
              break;
            case "remove-node":
              this.removeNode(entry.id);
              break;
            case "add-edge":
              this.addEdge(entry.edge);
              break;
            case "remove-edge":
              this.removeEdge(entry.edge);
              break;
            default:
              unreachable(entry);
          }
        } catch (error) {
          errors.push({ index, undo: entry.undo, error });
        }
      }
    } finally {
      this.#journal = [];
      this.#replaying = false;
    }
    if (errors.length > 0) {
      const first = errors[0]!;
      throw new Error(
        `Rollback incomplete: ${errors.length} entries failed. ` +
          `First: journal[${first.index}] (${first.undo}): ` +
          (first.error instanceof Error ? first.error.message : String(first.error)),
      );
    }
  }

  snapshot(): ObservationStateSnapshot {
    return Object.freeze({
      nodes: Object.freeze([...this.#nodes].sort(compareCodeUnits)),
      edges: Object.freeze([...this.#edges.values()].sort(compareEdges)),
    });
  }

  #record(entry: JournalEntry): void {
    if (!this.#replaying) this.#journal.push(Object.freeze(entry));
  }

  #collect(keys: ReadonlySet<string> | undefined): readonly GraphEdge[] {
    if (keys === undefined) return Object.freeze([]);
    const edges: GraphEdge[] = [];
    for (const key of keys) {
      const edge = this.#edges.get(key);
      if (edge !== undefined) edges.push(edge);
    }
    return Object.freeze(edges.sort(compareEdges));
  }
}
