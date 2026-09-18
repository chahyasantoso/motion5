import type { GraphEdge } from "../graph/ir";

/**
 * Which nodes one publication runs over: the seeds and their readers, then the sources those need.
 *
 * Two named steps out of the top of `GraphPublisher.flush`, where they were two `for` loops over two
 * hand-managed queues inside a 200-line method. Neither reads the registry, the snapshot's composers
 * or `this`, so neither belongs to the class: both are questions about graph shape, answered from the
 * reverse topology `finalizeGraph` derives once per graph and from predicates the caller supplies.
 *
 * Structural in their parameters rather than naming `PublisherSnapshot`, so this module depends on
 * edges and ids and on nothing that can compose. That is also what keeps it free of the publisher it
 * was cut out of. Issue #443, phase B step 9, and see ADR-058.
 */

/** The least this walk needs of a node: which edges it reads. */
export interface EdgeReader {
  readonly edges: readonly GraphEdge[];
}

/**
 * Every node a publication reaches from `seeds`, following reverse topology.
 *
 * Read rather than derived: `dependants` is total per id, so a node nothing reads answers an empty
 * list rather than a missing key, and this walk costs O(affected) instead of O(V+E). See ADR-058.
 */
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
 * Widens `affected` with every source a reached node reads that has published nothing yet.
 *
 * A member that has never published is composed in this flush rather than reported pending by every
 * node that reads it, which is what makes a first publication of a whole chain one flush. `published`
 * and `isMember` are the caller's, because where published values live and how membership is tracked
 * are the runtime's questions and not this walk's.
 *
 * Mutates and answers the same set, deliberately: the queue it walks is seeded from it, so a copy
 * would be a second collection answering one question.
 */
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
