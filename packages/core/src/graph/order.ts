import type { Diagnostic } from "../contract/v5";
import type { GraphNode } from "./ir";

/** Rule id reported when the observation graph cannot be linearized. */
export const CYCLE_RULE_ID = "graph-cycle";

export interface GraphOrderResult {
  /** Canonical topological order. Absent when the graph contains at least one cycle. */
  readonly order?: readonly string[];
  readonly diagnostics: readonly Diagnostic[];
}

interface OrderSlot {
  readonly id: string;
  readonly authoredIndex: number;
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareSlots(a: OrderSlot, b: OrderSlot): number {
  return compareIds(a.id, b.id) || a.authoredIndex - b.authoredIndex;
}

function comparePaths(a: readonly string[], b: readonly string[]): number {
  if (a.length !== b.length) return a.length - b.length;
  for (let index = 0; index < a.length; index += 1) {
    const compared = compareIds(a[index] ?? "", b[index] ?? "");
    if (compared !== 0) return compared;
  }
  return 0;
}

/** Keep the ready set ascending so emission never depends on discovery order. */
function insertReady(ready: OrderSlot[], slot: OrderSlot): void {
  let low = 0;
  let high = ready.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    const candidate = ready[middle];
    if (candidate !== undefined && compareSlots(candidate, slot) <= 0) low = middle + 1;
    else high = middle;
  }
  ready.splice(low, 0, slot);
}

/** Rotate a cycle so the lexicographically smallest id starts it. */
function canonicalCycle(path: readonly string[]): readonly string[] {
  let start = 0;
  for (let index = 1; index < path.length; index += 1)
    if (compareIds(path[index] ?? "", path[start] ?? "") < 0) start = index;
  return [...path.slice(start), ...path.slice(0, start)];
}

/** Iterative breadth-first search for the shortest path from a node back to itself. */
function shortestCycleFrom(
  start: string,
  live: ReadonlySet<string>,
  dependents: ReadonlyMap<string, readonly string[]>,
): readonly string[] | undefined {
  const previous = new Map<string, string>();
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (current === undefined) continue;
    for (const next of dependents.get(current) ?? []) {
      if (next === start) {
        const path: string[] = [current];
        let cursor = current;
        while (cursor !== start) {
          const parent = previous.get(cursor);
          if (parent === undefined) break;
          cursor = parent;
          path.push(cursor);
        }
        return path.reverse();
      }
      if (!live.has(next) || visited.has(next)) continue;
      visited.add(next);
      previous.set(next, current);
      queue.push(next);
    }
  }
  return undefined;
}

function cycleDiagnostic(cycle: readonly string[]): Diagnostic {
  const entry = cycle[0] ?? "";
  const diagnostic: Diagnostic = {
    ruleId: CYCLE_RULE_ID,
    path: entry,
    message: `Observation cycle detected: ${[...cycle, entry].join(" -> ")}.`,
    severity: "error",
    ids: Object.freeze([...cycle]),
  };
  return Object.freeze(diagnostic);
}

/**
 * Linearize an observation graph so every source is emitted before its observers.
 *
 * Order is a pure function of qualified ids and authored order: the ready set is kept
 * sorted by qualified id and then by authored index, so no `Map` insertion order and no
 * runtime event can influence the result. A graph that cannot be fully emitted reports one
 * error diagnostic per distinct cycle, each naming a minimal participating path.
 */
export function orderGraph(nodes: readonly GraphNode[]): GraphOrderResult {
  const slots = new Map<string, OrderSlot>();
  const dependents = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  for (const node of nodes) {
    slots.set(node.id, { id: node.id, authoredIndex: node.authoredIndex });
    dependents.set(node.id, []);
    indegree.set(node.id, 0);
  }

  for (const node of nodes)
    for (const edge of node.edges) {
      const downstream = dependents.get(edge.sourceId);
      if (downstream === undefined) continue;
      downstream.push(node.id);
      indegree.set(node.id, (indegree.get(node.id) ?? 0) + 1);
    }
  for (const downstream of dependents.values()) downstream.sort(compareIds);

  const ready: OrderSlot[] = [];
  for (const node of nodes) {
    const slot = slots.get(node.id);
    if (slot !== undefined && indegree.get(node.id) === 0) insertReady(ready, slot);
  }

  const order: string[] = [];
  while (ready.length > 0) {
    const next = ready.shift();
    if (next === undefined) break;
    order.push(next.id);
    for (const dependent of dependents.get(next.id) ?? []) {
      const remaining = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, remaining);
      const slot = slots.get(dependent);
      if (remaining === 0 && slot !== undefined) insertReady(ready, slot);
    }
  }

  if (order.length === slots.size)
    return { order: Object.freeze(order), diagnostics: Object.freeze([]) };

  const emitted = new Set(order);
  const live = new Set<string>();
  for (const node of nodes) if (!emitted.has(node.id)) live.add(node.id);

  const cycles = new Map<string, readonly string[]>();
  for (const start of [...live].sort(compareIds)) {
    const path = shortestCycleFrom(start, live, dependents);
    if (path === undefined) continue;
    const cycle = canonicalCycle(path);
    const key = cycle.join(" -> ");
    if (!cycles.has(key)) cycles.set(key, cycle);
  }

  const diagnostics = [...cycles.values()].sort(comparePaths).map((cycle) => cycleDiagnostic(cycle));
  return { diagnostics: Object.freeze(diagnostics) };
}
