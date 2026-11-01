import { unreachable } from "../lang/exhaustive";
import type { Diagnostic, TrackDefinition, ProjectDefinition } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import {
  acceptsChain,
  describeChainShape,
  describeDerivedChain,
  poleBends,
  POLE_SLOT,
  readsMemberRest,
} from "../contract/solver-shape";
import { readOutcome } from "../lang/outcome";

import { compareCodeUnits } from "./compare";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import {
  assertAuthoredMotionId,
  assertAuthoredTrackId,
  qualifyFreeTrack,
  qualifyMotionTrack,
} from "./ids";
import { collectDependencyEdges, qualifySource } from "./dependency-edges";
import { deriveCommittedContract, type CommittedContract } from "./committed-contract";
import { orderGraph } from "./order";
import { checkDependencyBindings } from "./dependency-check";
import { checkSlotFit } from "./slot-check";

interface ScalarEdgeRequirement {
  readonly plugin: string;
  readonly slot: string;
  readonly memberKey?: never;
}

interface DictEdgeRequirement {
  readonly plugin: string;
  readonly slot: string;
  /** Authored key of this binding inside a dict-valued slot; edge identity, not a label. */
  readonly memberKey: string;
}

/** Scalar slots carry no member key, dict slots carry one; the union stops one optional field from representing both. */
export type EdgeRequirement = ScalarEdgeRequirement | DictEdgeRequirement;

export interface GraphEdge {
  readonly observerId: string;
  readonly sourceId: string;
  readonly requirement: EdgeRequirement;
}

export interface GraphNode {
  readonly id: string;
  readonly owner: "motion" | "free";
  readonly authoredIndex: number;
  readonly track: TrackDefinition;
  readonly edges: readonly GraphEdge[];
  /** Committed contract; absent when nothing answers for it (unknown plugin, refused track); attached before any check reads one. */
  readonly contract?: CommittedContract;
}
export interface GraphIR {
  readonly nodes: readonly GraphNode[];
  readonly nodeById: Readonly<Record<string, GraphNode>>;
  /** Reverse topology: per node id, ids reading it through edges; total, so an unread node carries `[]` rather than no key. */
  readonly dependants: Readonly<Record<string, readonly string[]>>;
  readonly order: readonly string[];
  readonly diagnostics: readonly Diagnostic[];
}
export interface GraphBuildResult {
  readonly graph?: GraphIR;
  readonly diagnostics: readonly Diagnostic[];
}

function field(value: string): string {
  return `${value.length}:${value}`;
}

function requirementIdentity(edge: GraphEdge): string {
  const requirement = edge.requirement;
  const member = field(requirement.memberKey ?? "");
  return `${field(requirement.plugin)}${field(requirement.slot)}${member}`;
}

/** Injective edge identity: every part length-prefixed, so no authored string forges a field boundary; prefixed `memberKey` keeps dict-slot entries from colliding as `edge-duplicate`. */
export function edgeKey(edge: GraphEdge): string {
  return [field(edge.observerId), field(edge.sourceId), field(requirementIdentity(edge))].join("");
}

export function compareEdges(a: GraphEdge, b: GraphEdge): number {
  return (
    compareCodeUnits(a.observerId, b.observerId) ||
    compareCodeUnits(a.sourceId, b.sourceId) ||
    compareCodeUnits(a.requirement.plugin, b.requirement.plugin) ||
    compareCodeUnits(a.requirement.slot, b.requirement.slot) ||
    compareCodeUnits(a.requirement.memberKey ?? "", b.requirement.memberKey ?? "")
  );
}

export function describeEdge(edge: GraphEdge): string {
  const requirement = edge.requirement;
  const member = requirement.memberKey === undefined ? "" : `.${requirement.memberKey}`;
  return `${edge.observerId} <- ${edge.sourceId} [${requirement.plugin}.${requirement.slot}${member}]`;
}

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function compareDiagnostics(a: Diagnostic, b: Diagnostic): number {
  return compareCodeUnits(a.ruleId, b.ruleId) || compareCodeUnits(a.path, b.path);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function collectTrack(
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
      diagnostic(
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
  // Source qualification and edge expansion belong to collectDependencyEdges; this layer owns node identity.
  collectDependencyEdges(track, id, ownerId, edges, diagnostics);
  return Object.freeze({ id, owner, authoredIndex, track, edges: Object.freeze(edges) });
}

export function buildGraphIR(
  project: ProjectDefinition,
  capabilities: PluginCapabilities,
  carried?: ReadonlyMap<string, CommittedContract>,
): GraphBuildResult {
  const diagnostics: Diagnostic[] = [];
  const nodes: GraphNode[] = [];
  const seen = new Set<string>();
  const motionIds = new Set<string>();
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
      const node = collectTrack(track, "motion", motion.id, trackIndex, diagnostics);
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
    const node = collectTrack(track, "free", "~", trackIndex, diagnostics);
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
  return finalizeGraph(nodes, diagnostics, capabilities, carried);
}

/** Reverse topology for one node set: per node id, ids reading its edges; total over the set, outside sources skipped, duplicates kept. */
export function deriveDependants(
  nodes: readonly GraphNode[],
): Readonly<Record<string, readonly string[]>> {
  const collected = new Map<string, string[]>();
  for (const node of nodes) collected.set(node.id, []);
  for (const node of nodes) {
    for (const edge of node.edges) collected.get(edge.sourceId)?.push(node.id);
  }
  const dependants: Record<string, readonly string[]> = {};
  for (const [id, readers] of collected) dependants[id] = freeze(readers);
  return freeze(dependants);
}

function withContract(
  node: GraphNode,
  capabilities: PluginCapabilities,
  carried: ReadonlyMap<string, CommittedContract> | undefined,
): GraphNode {
  const stored = carried?.get(node.id);
  if (stored !== undefined && stored.plugin === node.track.plugin)
    return node.contract === stored ? node : freeze({ ...node, contract: stored });
  if (node.contract !== undefined) return node;
  const derived = deriveCommittedContract(node.track, node.id, capabilities);
  return derived === undefined ? node : freeze({ ...node, contract: derived });
}

/** Sole tail owner: attach contracts before checks, refuse duplicate/unknown/self edges and cycles, sort diagnostics, linearize, freeze. */
export function finalizeGraph(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
  capabilities: PluginCapabilities,
  carried?: ReadonlyMap<string, CommittedContract>,
): GraphBuildResult {
  const committed = nodes.map((node) => withContract(node, capabilities, carried));
  const known = new Set(committed.map((node) => node.id));
  const edgeKeys = new Set<string>();
  for (const node of committed)
    for (const edge of node.edges) {
      const key = edgeKey(edge);
      if (edgeKeys.has(key))
        diagnostics.push(
          diagnostic(
            "edge-duplicate",
            edge.observerId,
            `Duplicate dependency edge ${describeEdge(edge)}.`,
            [edge.observerId, edge.sourceId],
          ),
        );
      edgeKeys.add(key);
      if (!known.has(edge.sourceId))
        diagnostics.push(
          diagnostic(
            "edge-unknown-source",
            edge.observerId,
            `Unknown edge source "${edge.sourceId}".`,
            [edge.sourceId],
          ),
        );
      if (edge.sourceId === edge.observerId)
        diagnostics.push(
          diagnostic(
            "edge-self-reference",
            edge.observerId,
            "An edge cannot reference its own node.",
            [edge.observerId],
          ),
        );
    }
  // Linearize only after every reference was admitted: cycle diagnostics never mix with edge errors.
  diagnostics.push(...checkDependencyBindings(committed, capabilities));
  diagnostics.push(...checkSlotFit(committed));
  diagnostics.sort(compareDiagnostics);
  if (diagnostics.some(({ severity }) => severity === "error"))
    return { diagnostics: Object.freeze(diagnostics) };
  const resolvedNodes = committed;
  diagnostics.sort(compareDiagnostics);
  if (diagnostics.some(({ severity }) => severity === "error"))
    return { diagnostics: Object.freeze(diagnostics) };
  const ordering = orderGraph(resolvedNodes);
  return readOutcome(
    ordering,
    (order) => {
      const nodeById: Record<string, GraphNode> = {};
      for (const node of resolvedNodes) nodeById[node.id] = node;
      return {
        graph: freeze({
          nodes: freeze(resolvedNodes),
          nodeById: freeze(nodeById),
          dependants: deriveDependants(resolvedNodes),
          order,
          diagnostics: freeze(diagnostics),
        }),
        diagnostics: freeze(diagnostics),
      };
    },
    (orderingDiagnostics) => ({
      diagnostics: Object.freeze([...diagnostics, ...orderingDiagnostics].sort(compareDiagnostics)),
    }),
  );
}
