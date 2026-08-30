import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../contract/v5";
import {
  collectTrack,
  diag,
  finalizeGraph,
  type GraphBuildResult,
  type GraphNode,
} from "../../graph/ir";
import { assertAuthoredMotionId } from "../../graph/ids";

/**
 * The caching graph builder the runtime binds, and the owner of its own cache residency rule.
 *
 * Residency rule: once a build completes, the cache holds an entry for exactly the tracks that
 * build walked, and nothing else. `build` receives the whole project, so the resident set is a pure
 * function of the last project handed in, and nothing outside this class has to know the cache
 * exists. That is why eviction is a sweep here rather than an `evict(nodeId)` method on the
 * `GraphBuilder` port: `ProjectRuntime.#removeTrack`, the `destroyMotion` hook and `dispose` would
 * each have had to call one, forever, with a key only this class can build, and three call sites
 * that must stay in step is the bug class the sweep deletes. See ADR-058.
 *
 * Ownership: one builder instance per project. Sharing one across two projects stays correct and
 * stops being fast, because each build sweeps the other project's entries and both thrash to a
 * permanent miss. `Engine.load` constructs one builder per loaded project, which is that shape.
 */
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
   * How many nodes the cache currently holds.
   *
   * The observable the residency rule is asserted through, and deliberately not on the
   * `GraphBuilder` port, which keeps its one `build` method: a caller has no use for it, and the
   * only other way to test eviction is GC probing, which is flaky and not worth owning.
   */
  get cachedNodeCount(): number {
    return this.#trackCache.size;
  }

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
   *
   * Every key this reaches is recorded in `visited`, whether it hit, missed, or was rejected, so
   * "the build never walked this track" and "the build walked it and refused to cache it" stay two
   * different answers with two different owners. See `#sweep`.
   */
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

    this.#trackCache.set(key, node);
    return node;
  }

  /**
   * Drops every entry the build that just finished did not walk.
   *
   * Reached from the completion path only, and never from a `finally`. A build that throws leaves
   * `visited` partial, and a partial set says nothing about residency: sweeping against it would
   * evict live entries and cost hits with no correctness gain, so a thrown build leaves the cache
   * exactly as it was.
   *
   * Not merged with the reject-path `delete` in `#collect`. That one answers "walked, but
   * incomplete"; this one answers "not walked at all". Collapsing the two into one condition is how
   * the leak this exists to close comes back.
   */
  #sweep(visited: ReadonlySet<string>): void {
    for (const key of [...this.#trackCache.keys()])
      if (!visited.has(key)) this.#trackCache.delete(key);
  }

  build(project: ProjectDefinition): GraphBuildResult {
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
        const node = this.#collect(track, "motion", motion.id, trackIndex, diagnostics, visited);

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
      const node = this.#collect(track, "free", "~", trackIndex, diagnostics, visited);

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

    // Both loops are done, so `visited` is the residency set for this project. Here rather than in
    // a `finally`, and before `finalizeGraph`, which owns the result and not the cache.
    this.#sweep(visited);
    return finalizeGraph(nodes, diagnostics);
  }
}
