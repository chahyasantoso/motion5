import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../contract/v5";
import {
  collectTrack,
  compareDiagnostics,
  diag,
  edgeKey,
  type GraphBuildResult,
  type GraphNode,
} from "../../graph/ir";
import { assertAuthoredMotionId } from "../../graph/ids";
import { orderGraph } from "../../graph/order";

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export class IncrementalGraphBuilder {
  readonly #trackCache = new WeakMap<TrackDefinition, GraphNode | undefined>();

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
        let node: GraphNode | undefined;
        if (this.#trackCache.has(track)) {
          node = this.#trackCache.get(track);
        } else {
          node = collectTrack(track, "motion", motion.id, trackIndex, diagnostics);
          this.#trackCache.set(track, node);
        }

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
      let node: GraphNode | undefined;
      if (this.#trackCache.has(track)) {
        node = this.#trackCache.get(track);
      } else {
        node = collectTrack(track, "free", "~", trackIndex, diagnostics);
        this.#trackCache.set(track, node);
      }

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

    const known = new Set(nodes.map((node) => node.id));
    const edgeKeys = new Set<string>();
    for (const node of nodes)
      for (const edge of node.edges) {
        const key = edgeKey(edge);
        if (edgeKeys.has(key))
          diagnostics.push(
            diag("observation-duplicate", edge.observerId, `Duplicate observation edge "${key}".`, [
              edge.observerId,
              edge.sourceId,
            ]),
          );
        edgeKeys.add(key);
        if (!known.has(edge.sourceId))
          diagnostics.push(
            diag(
              "observation-unknown-source",
              edge.observerId,
              `Unknown observation source "${edge.sourceId}".`,
              [edge.sourceId],
            ),
          );
        if (edge.sourceId === edge.observerId)
          diagnostics.push(
            diag(
              "observation-self-reference",
              edge.observerId,
              "Observation cannot reference itself.",
              [edge.observerId],
            ),
          );
      }

    diagnostics.sort(compareDiagnostics);
    if (diagnostics.some(({ severity }) => severity === "error"))
      return { diagnostics: Object.freeze(diagnostics) };

    const ordering = orderGraph(nodes);
    if (ordering.order === undefined)
      return {
        diagnostics: Object.freeze(
          [...diagnostics, ...ordering.diagnostics].sort(compareDiagnostics),
        ),
      };

    const nodeById: Record<string, GraphNode> = {};
    for (const node of nodes) nodeById[node.id] = node;

    return {
      graph: freeze({
        nodes: freeze(nodes),
        nodeById: freeze(nodeById),
        order: ordering.order,
        diagnostics: freeze(diagnostics),
      }),
      diagnostics: freeze(diagnostics),
    };
  }
}
