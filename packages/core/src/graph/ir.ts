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
  /** The key this binding was authored under inside this dict-valued slot. */
  readonly memberKey: string;
}

/**
 * The requirement shape identifies the slot's arity: scalar slots have no member key, while dict
 * slots carry one. The union changes no runtime field or diagnostic; it only prevents a scalar and
 * a dict requirement from being represented by one optional field at the type boundary.
 *
 * `memberKey` remains part of edge identity rather than a label. Two entries of one slot are two
 * dependencies, and the slot alone cannot tell them apart once the key stopped being formatted into
 * it, so an edge per entry survives only because this field is length-prefixed into
 * `requirementIdentity` alongside the plugin and the slot. See ADR-057.
 */
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
  /**
   * What this node committed to, absent only when nothing can answer for it.
   *
   * Attached by `finalizeGraph` from the carried map of the rebuild or derived from the track, so a
   * reader never has to decide when a contract is fresh. A plugin id the catalog does not admit and
   * a track the parser refuses have no contract, and dependency admission names both.
   */
  readonly contract?: CommittedContract;
}
export interface GraphIR {
  readonly nodes: readonly GraphNode[];
  readonly nodeById: Readonly<Record<string, GraphNode>>;
  /**
   * Reverse topology: for every node id, the ids that read it.
   *
   * Derived here rather than by every consumer, because it is a pure function of the node set and
   * this file already walks every edge of every node twice over. `GraphPublisher` recomputed it on
   * every tick, over a graph that changes at most once between ticks, which made steady-state
   * ticking O(V+E) in graph shape for a graph whose shape had not moved.
   *
   * Total, so a node nothing reads carries an empty list rather than no entry: a missing key and an
   * empty one are the same answer to a consumer that spells `?? []`, and only one of them makes the
   * map's own shape depend on the rig. Not recoverable from `edges` alone either, which is the whole
   */
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

/**
 * The injective identity encoding for an edge.
 *
 * Every part is length-prefixed, so no authored string can forge a field boundary. The requirement
 * plugin, slot and member key are the only authored strings left inside it, now that the canonical
 * projection is gone with the primitive it encoded.
 *
 * The member key is prefixed like the others rather than joined into the slot, and that is what
 * keeps two entries of one dict-valued slot distinct. They were distinguished by the encoded slot
 * while a goal's identity was `targets[<memberId>]`; with the slot carrying the authored name, two
 * goals reaching for one node encode identically without this field and `finalizeGraph` reports
 * `edge-duplicate` on a rig that loads clean. `DV-4` pins it. See ADR-034, ADR-046, ADR-047,
 * and ADR-057.
 */
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
  // Derived from the authored form, with no plugin registry in reach. `input.requires` names the
  // slot and the source, and the plugin id comes from the track. One edge per bound source; a map
  // slot expands one edge per member key, with the key carried as data rather than folded into the
  // slot. Whether the source is a node, is not this node, and introduces no cycle is this layer's.
  // See ADR-044.
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

/**
 * Reverse topology for one node set: per node id, the ids that read it.
 *
 * Both kinds of reader, because both are real dependencies and only one of them is an edge. A node
 * reads every source it names an edge for, and a solver reads every member `resolveSolvers` derived
 * onto its `solves`, which no edge points at. A reverse walk over edges alone would therefore miss
 * every member of every chain, and a member's own value would stop marking its solver dirty.
 *
 * Nodes in the given order, each node's edges before its members, and an entry pushed only for a
 * source this node set contains: an edge naming an unknown source is `finalizeGraph`'s refusal, and
 * a direct publisher caller may hand over a partial node set. Duplicates are kept rather than
 * collapsed, because a consumer walking this guards on its own visited set, and collapsing them
 * would be a second decision inside a function whose only job is to state what the graph says.
 */
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

/**
 * Validates collected nodes and diagnostics, linearizes them, and freezes the result.
 *
 * The one owner of the graph-building tail, so `buildGraphIR` and the incremental builder cannot
 * drift about duplicate/unknown/self-reference edges, diagnostic ordering, cycle rejection, or the
 * frozen result shape. Any solver derivation (issue #195, slice C2) lands here and is therefore
 * reached by both load-time validation and the runtime through one call site.
 *
 * The committed contract is attached here, before any check reads one, so slot and dependency
 * admission never derive a producer's contract from its current authored values.
 */
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
  // The bail happens here rather than after the derivation. `resolveSolvers` walks `base` edges and
  // reads the nodes they name, so over a graph whose sources may not resolve it answers about a
  // chain that was never valid: an unknown `base` source yields `ik-solver-unreachable-root` beside
  // `edge-unknown-source`, naming a member for a typo one node up. One cause, one
  // diagnostic, and a derivation that only ever runs over resolved references. `RS-10` pins it.
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
      // Derived here, after `resolveSolvers` returned, because the solver fan-in is half the answer
      // and it does not exist until then. One owner, in the file that already owns `compareEdges`
      // and delegates to `orderGraph`, so every consumer reads reverse topology instead of walking
      // for it.
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
