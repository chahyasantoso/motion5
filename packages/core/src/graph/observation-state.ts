import { compareCodeUnits } from "./compare";
import type { GraphEdge } from "./ir";
import { compareEdges, describeEdge, edgeKey } from "./ir";

/** A read-only structural view of live state, used for evidence and inspection. */
export interface ObservationStateSnapshot {
  readonly nodes: readonly string[];
  readonly edges: readonly GraphEdge[];
}

/** Each entry names the action that undoes one applied mutation. */
type JournalEntry =
  | { readonly undo: "add-node"; readonly id: string }
  | { readonly undo: "remove-node"; readonly id: string }
  | { readonly undo: "add-edge"; readonly edge: GraphEdge }
  | { readonly undo: "remove-edge"; readonly edge: GraphEdge };

/** Drop an explicit `undefined` target/projection so edge identity has exactly one representation. */
function normalizeEdge(edge: GraphEdge): GraphEdge {
  const base: {
    observerId: string;
    sourceId: string;
    role: "input" | "output";
    target?: string;
    projection?: import("../contract/v5").InputProjection;
  } = { observerId: edge.observerId, sourceId: edge.sourceId, role: edge.role };
  if (edge.target !== undefined) base.target = edge.target;
  if (edge.projection !== undefined) base.projection = edge.projection;
  return Object.freeze(base) as GraphEdge;
}

/**
 * The one long-lived live-state object per loaded project.
 *
 * Live nodes and edges are mutated in place and never rebuilt, so a reference held by a
 * subscriber before a commit is still authoritative after it. Every mutation records the
 * action that undoes it; `rollback` replays that journal in reverse and `commit` releases
 * it. There is deliberately no method that reconstructs this object from a graph snapshot:
 * population is the transaction coordinator's job, and a rebuild seam would destroy the
 * identity that makes an undo journal meaningful.
 *
 * Identity, ordering, and labels all come from `graph/ir.ts`: `edgeKey` indexes, `compareEdges`
 * orders every snapshot and adjacency read, and `describeEdge` writes the error text. A private
 * comparator here would be a second ordering owner that could silently disagree with the
 * publisher about which edge comes first.
 *
 * Implements I-1 and ADR-006. Satisfies FR-8, TR-G-08, and TR-G-12.
 */
export class ObservationState {
  readonly #nodes = new Set<string>();
  readonly #edges = new Map<string, GraphEdge>();
  readonly #byObserver = new Map<string, Set<string>>();
  readonly #bySource = new Map<string, Set<string>>();
  #journal: JournalEntry[] = [];
  #replaying = false;

  /** Number of applied mutations that are still reversible. */
  get journalLength(): number {
    return this.#journal.length;
  }

  hasNode(id: string): boolean {
    return this.#nodes.has(id);
  }

  hasEdge(edge: GraphEdge): boolean {
    return this.#edges.has(edgeKey(edge));
  }

  /** Live edges whose observer is `observerId`, in canonical order. */
  sourcesOf(observerId: string): readonly GraphEdge[] {
    return this.#collect(this.#byObserver.get(observerId));
  }

  /** Live edges whose source is `sourceId`, in canonical order. */
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
    const live = normalizeEdge(edge);
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

  /** Accept every applied mutation and release the journal. Live identity is untouched. */
  commit(): void {
    this.#journal = [];
  }

  /** Replay the journal in reverse, then release it. Live identity is untouched. */
  rollback(): void {
    this.#replaying = true;
    const errors: { index: number; undo: string; error: unknown }[] = [];
    try {
      for (let index = this.#journal.length - 1; index >= 0; index -= 1) {
        const entry = this.#journal[index];
        if (entry === undefined) continue;
        try {
          if (entry.undo === "add-node") this.addNode(entry.id);
          else if (entry.undo === "remove-node") this.removeNode(entry.id);
          else if (entry.undo === "add-edge") this.addEdge(entry.edge);
          else this.removeEdge(entry.edge);
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
