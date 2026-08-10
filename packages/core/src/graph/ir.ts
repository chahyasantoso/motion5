import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../contract/v5";
import { compareCodeUnits } from "./compare";
import {
  assertAuthoredMotionId,
  assertAuthoredTrackId,
  qualifyFreeTrack,
  qualifyMotionTrack,
} from "./ids";
import { orderGraph } from "./order";

export interface GraphEdge {
  readonly observerId: string;
  readonly sourceId: string;
  readonly role: "input" | "output";
  readonly target?: string;
}

export interface GraphNode {
  readonly id: string;
  readonly owner: "motion" | "free";
  readonly authoredIndex: number;
  readonly track: TrackDefinition;
  readonly edges: readonly GraphEdge[];
}

export interface GraphIR {
  readonly nodes: readonly GraphNode[];
  readonly nodeById: Readonly<Record<string, GraphNode>>;
  /** Canonical topological order. Sources precede observers. */
  readonly order: readonly string[];
  readonly diagnostics: readonly Diagnostic[];
}

export interface GraphBuildResult {
  readonly graph?: GraphIR;
  readonly diagnostics: readonly Diagnostic[];
}

/**
 * The single spelling of edge identity: source, role, and target, scoped to the observer.
 * Every duplicate check and every live-state index keys off this and nothing else.
 */
export function edgeKey(edge: GraphEdge): string {
  return `${edge.observerId}|${edge.sourceId}|${edge.role}|${edge.target ?? ""}`;
}

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function diag(ruleId: string, path: string, message: string, ids?: readonly string[]): Diagnostic {
  return { ruleId, path, message, severity: "error", ...(ids ? { ids } : {}) };
}

function compareDiagnostics(a: Diagnostic, b: Diagnostic): number {
  return compareCodeUnits(a.ruleId, b.ruleId) || compareCodeUnits(a.path, b.path);
}

function qualifySource(source: string, motionId: string): string {
  if (source.startsWith("~/")) return qualifyFreeTrack(source.slice(2)).value;
  if (source.includes("/"))
    return qualifyMotionTrack(
      source.slice(0, source.indexOf("/")),
      source.slice(source.indexOf("/") + 1),
    ).value;
  return qualifyMotionTrack(motionId, source).value;
}

function collectTrack(
  track: TrackDefinition,
  owner: "motion" | "free",
  ownerId: string,
  authoredIndex: number,
  diagnostics: Diagnostic[],
): GraphNode | undefined {
  try {
    assertAuthoredTrackId(track.id);
  } catch (error) {
    diagnostics.push(
      diag(
        "track-id",
        `${owner === "free" ? "freeTracks" : `motions[${authoredIndex}]`}.id`,
        String(error instanceof Error ? error.message : error),
      ),
    );
    return undefined;
  }
  const id =
    owner === "free"
      ? qualifyFreeTrack(track.id).value
      : qualifyMotionTrack(ownerId, track.id).value;
  const edges: GraphEdge[] = [];
  for (const [index, observation] of (track.observes ?? []).entries()) {
    const path = `${owner === "free" ? `freeTracks[${authoredIndex}]` : `motions[${authoredIndex}]`}.tracks[${index}].observes`;
    const role = observation.role ?? "output";
    if (role !== "input" && role !== "output") {
      diagnostics.push(diag("observation-role", path, "Observation role must be input or output."));
      continue;
    }
    if (typeof observation.source !== "string" || observation.source.length === 0) {
      diagnostics.push(diag("observation-source", path, "Observation source must be non-empty."));
      continue;
    }
    if (
      role === "input" &&
      (typeof observation.target !== "string" || observation.target.length === 0)
    ) {
      diagnostics.push(
        diag("observation-input-target", path, "Input observations require a non-empty target."),
      );
      continue;
    }
    if (role === "output" && observation.target !== undefined) {
      diagnostics.push(
        diag("observation-output-target", path, "Output observations cannot define a target."),
      );
      continue;
    }
    let sourceId: string;
    try {
      sourceId = qualifySource(observation.source, ownerId);
    } catch (error) {
      diagnostics.push(
        diag("observation-source", path, String(error instanceof Error ? error.message : error), [
          observation.source,
        ]),
      );
      continue;
    }
    edges.push(
      Object.freeze({
        observerId: id,
        sourceId,
        role,
        ...(observation.target === undefined ? {} : { target: observation.target }),
      }),
    );
  }
  return Object.freeze({ id, owner, authoredIndex, track, edges: Object.freeze(edges) });
}

export function buildGraphIR(project: ProjectDefinition): GraphBuildResult {
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
      const node = collectTrack(track, "motion", motion.id, trackIndex, diagnostics);
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
    const node = collectTrack(track, "free", "~", trackIndex, diagnostics);
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
            `Observation cannot reference itself.`,
            [edge.observerId],
          ),
        );
    }

  diagnostics.sort(compareDiagnostics);
  if (diagnostics.some(({ severity }) => severity === "error"))
    return { diagnostics: Object.freeze(diagnostics) };

  const ordering = orderGraph(nodes);
  if (ordering.order === undefined) {
    const rejected = [...diagnostics, ...ordering.diagnostics].sort(compareDiagnostics);
    return { diagnostics: Object.freeze(rejected) };
  }

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
