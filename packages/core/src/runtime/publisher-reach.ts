import type { GraphEdge } from "../graph/ir";

/**
 * Which nodes one publication runs over: seeds and readers, then the sources those need.
 * Pure walks over the reverse topology `finalizeGraph` derives; ids and edges only, no publisher. */

/** The least this walk needs of a node: which edges it reads. */
export interface EdgeReader {
  readonly edges: readonly GraphEdge[];
}

/**
 * Every node a publication reaches from `seeds`, following reverse topology.
 * `dependants` is total per id: a node nothing reads answers empty; cost stays O(affected). */
export function reachable(
  dependants: Readonly<Record<string, readonly string[]>>,
  seeds: readonly string[],
): Set<string> {
  const affected = new Set<string>();
  const queue = [...seeds];
  for (let index = 0; index < queue.length; index += 1) {
    const id = queue[index];
    if (id === undefined || affected.has(id)) continue;
    affected.add(id);
    queue.push(...(dependants[id] ?? []));
  }
  return affected;
}

/**
 * Widens `affected` with every unpublished source a reached node reads.
 * Mutates and returns that set; its queue seeds from it, so a copy answers nothing new. */
export function closeUpstream(
  affected: Set<string>,
  nodeById: Readonly<Record<string, EdgeReader>>,
  published: (sourceId: string) => boolean,
  isMember: (nodeId: string) => boolean,
): Set<string> {
  const queue = [...affected];
  for (let index = 0; index < queue.length; index += 1) {
    const id = queue[index];
    if (id === undefined) continue;
    const node = nodeById[id];
    if (!node) continue;
    for (const edge of node.edges) {
      if (published(edge.sourceId) || !isMember(edge.sourceId)) continue;
      if (affected.has(edge.sourceId)) continue;
      affected.add(edge.sourceId);
      queue.push(edge.sourceId);
    }
  }
  return affected;
}
