import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../contract/v5";
import { collectTrack, finalizeGraph, type GraphBuildResult, type GraphNode } from "../ir";
import type { CommittedContract } from "../committed-contract";
import { deriveCommittedContract } from "../committed-contract";
import { diagnostic } from "../../contract/diagnostics";
import { assertAuthoredMotionId } from "../ids";
import type { PluginCapabilities } from "../../ports/plugin-capabilities";

/**
 * Caching graph builder; resident set = exactly the tracks the last completed build walked.
 * One builder per project; eviction is a sweep here, not a port method, keeping one owner. */
export class IncrementalGraphBuilder {
  readonly #capabilities: PluginCapabilities;

  constructor(capabilities: PluginCapabilities) {
    this.#capabilities = capabilities;
  }
  // Keyed by owner/ownerId/track.id: the node id embeds the owner, so one definition can back two nodes; a hit also needs the same object.
  readonly #trackCache = new Map<string, GraphNode>();

  /** Nodes the cache holds; the observable residency is asserted through. */
  get cachedNodeCount(): number {
    return this.#trackCache.size;
  }

  // owner is a literal and ownerId is "~" or a validated motion id, so neither holds "/"; the key prefix is unambiguous.
  #cacheKey(owner: "motion" | "free", ownerId: string, trackId: unknown): string {
    return `${owner}/${ownerId}/${String(trackId)}`;
  }

  /** Cache clean results only: collectTrack reports while computing, so a cached failure would stay silent; rejected keys still enter visited. */
  #collect(
    track: TrackDefinition,
    owner: "motion" | "free",
    ownerId: string,
    authoredIndex: number,
    diagnostics: Diagnostic[],
    visited: Set<string>,
  ): GraphNode | undefined {
    const key = this.#cacheKey(owner, ownerId, track.id);
    visited.add(key);
    const cached = this.#trackCache.get(key);
    if (cached !== undefined && cached.track === track) return cached;

    const collected: Diagnostic[] = [];
    const node = collectTrack(track, owner, ownerId, authoredIndex, collected);
    diagnostics.push(...collected);

    if (node === undefined || collected.length > 0) {
      this.#trackCache.delete(key);
      return node;
    }

    // Contract cached with the node, so a rebuild on the same track object returns the same object; deriving it outside would freeze a fresh node each build.
    const contract = deriveCommittedContract(track, node.id, this.#capabilities);
    const committed =
      contract === undefined ? node : Object.freeze({ ...node, contract } satisfies GraphNode);

    this.#trackCache.set(key, committed);
    return committed;
  }

  // Completion path only, never finally: a thrown build leaves visited partial, sweeping it would evict live entries.
  // Reject-path delete = walked but incomplete; this = not walked at all.
  #sweep(visited: ReadonlySet<string>): void {
    for (const key of [...this.#trackCache.keys()])
      if (!visited.has(key)) this.#trackCache.delete(key);
  }

  build(
    project: ProjectDefinition,
    carried?: ReadonlyMap<string, CommittedContract>,
  ): GraphBuildResult {
    const diagnostics: Diagnostic[] = [];
    const nodes: GraphNode[] = [];
    const seen = new Set<string>();
    const motionIds = new Set<string>();
    const visited = new Set<string>();

    for (const [motionIndex, motion] of project.motions.entries()) {
      try {
        assertAuthoredMotionId(motion.id);
      } catch (error) {
        diagnostics.push(
          diagnostic(
            "motion-id",
            `motions[${motionIndex}].id`,
            String(error instanceof Error ? error.message : error),
          ),
        );
        continue;
      }
      if (motionIds.has(motion.id)) {
        diagnostics.push(
          diagnostic(
            "motion-duplicate",
            `motions[${motionIndex}].id`,
            `Duplicate motion id "${motion.id}".`,
            [motion.id],
          ),
        );
        continue;
      }
      motionIds.add(motion.id);
      for (const [trackIndex, track] of motion.tracks.entries()) {
        const node = this.#collect(track, "motion", motion.id, trackIndex, diagnostics, visited);

        if (node) {
          if (seen.has(node.id))
            diagnostics.push(
              diagnostic(
                "node-duplicate",
                `motions[${motionIndex}].tracks[${trackIndex}].id`,
                `Duplicate node id "${node.id}".`,
                [node.id],
              ),
            );
          else {
            seen.add(node.id);
            nodes.push(node);
          }
        }
      }
    }

    for (const [trackIndex, track] of (project.freeTracks ?? []).entries()) {
      const node = this.#collect(track, "free", "~", trackIndex, diagnostics, visited);

      if (node) {
        if (seen.has(node.id))
          diagnostics.push(
            diagnostic(
              "node-duplicate",
              `freeTracks[${trackIndex}].id`,
              `Duplicate node id "${node.id}".`,
              [node.id],
            ),
          );
        else {
          seen.add(node.id);
          nodes.push(node);
        }
      }
    }

    // Both loops done: visited is this project's residency set. Swept before finalizeGraph, which owns the result, not the cache.
    this.#sweep(visited);
    return finalizeGraph(nodes, diagnostics, this.#capabilities, carried);
  }
}
