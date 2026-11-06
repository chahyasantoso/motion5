import type { TrackDefinition } from "../contract/v5";
import type { CommittedContract } from "./committed-contract";
import { compareCodeUnits } from "./compare";

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
