import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../contract/v5";
import {
  collectTrack,
  diag,
  finalizeGraph,
  type GraphBuildResult,
  type GraphNode,
} from "../../graph/ir";
import { assertAuthoredMotionId } from "../../graph/ids";

export class IncrementalGraphBuilder {
  /**
   * Built nodes, keyed by the inputs their id is derived from.
   *
   * Not keyed by the `TrackDefinition` object alone: `collectTrack` derives the node id from
   * the owner (`~/trackId` for a free track, `motionId/trackId` for a motion track), so one
   * definition object legitimately backs two different nodes when it is shared across motions.
   * Object identity is still checked on every hit, so replacing a track with a new object at
   * the same node id remains a miss and rebuilds.
   */
  readonly #trackCache = new Map<string, GraphNode>();

  /**
   * `owner` and `ownerId` can never contain `/` -- owner is a literal, and `ownerId` is either
   * `"~"` or a motion id already through `assertAuthoredMotionId`. The prefix up to the second
   * separator is therefore unambiguous even though `track.id` has not been validated yet.
   */
  #cacheKey(owner: "motion" | "free", ownerId: string, trackId: unknown): string {
    return `${owner}/${ownerId}/${String(trackId)}`;
  }

  /**
   * Collect one track, caching only results that were produced without complaint.
   *
   * `collectTrack` reports problems exclusively on the path that computes the node, so a cached
   * result carries the node but not the reasons it is incomplete. Caching a failure therefore
   * makes it permanently silent: the next build gets a hit, emits no diagnostic, and succeeds
   * with content the author declared either missing (bad track id, node omitted) or partial
   * (bad observation edge, that edge dropped). Recomputing a rejected track is cheap and rare.
   */
  #collect(
    track: TrackDefinition,
    owner: "motion" | "free",
    ownerId: string,
    authoredIndex: number,
    diagnostics: Diagnostic[],
  ): GraphNode | undefined {
    const key = this.#cacheKey(owner, ownerId, track.id);
    const cached = this.#trackCache.get(key);
    if (cached !== undefined && cached.track === track) return cached;

    const collected: Diagnostic[] = [];
    const node = collectTrack(track, owner, ownerId, authoredIndex, collected);
    diagnostics.push(...collected);

    if (node === undefined || collected.length > 0) {
      this.#trackCache.delete(key);
      return node;
    }

    this.#trackCache.set(key, node);
    return node;
  }

  build(project: ProjectDefinition): GraphBuildResult {
    const diagnostics: Diagnostic[] = [];
    const nodes: GraphNode[] = [];
    const seen = new Set<string>();
    const motionIds = new Set<string>();

    for (const [motionIndex, motion] of project.motions.entries()) {
      try {
        assertAuthoredMotionId(motion.id);
      } catch (error) {
        diagnostics.push(
          diag(
            "motion-id",
            `motions[${motionIndex}].id`,
            String(error instanceof Error ? error.message : error),
          ),
        );
        continue;
      }
      if (motionIds.has(motion.id)) {
        diagnostics.push(
          diag(
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
        const node = this.#collect(track, "motion", motion.id, trackIndex, diagnostics);

        if (node) {
          if (seen.has(node.id))
            diagnostics.push(
              diag(
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
      const node = this.#collect(track, "free", "~", trackIndex, diagnostics);

      if (node) {
        if (seen.has(node.id))
          diagnostics.push(
            diag(
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

    return finalizeGraph(nodes, diagnostics);
  }
}
