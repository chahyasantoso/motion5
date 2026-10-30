import type { IdentifiedRuleId } from "../contract/rule";
import type { Diagnostic, ReadyPatch } from "../contract/v5";
import { describeEdge, type GraphEdge } from "../graph/ir";
import { unreachable } from "../lang/exhaustive";
import type { PublisherComposition } from "./graph-publisher";

/** Node outcome, source contribution, publication failure: three closed unions for one flush, read by exhaustive switch, not by collection order or an instanceof chain. */
declare const OUTCOME_BRAND: unique symbol;

/** Keeps the three unions closed as well as discriminated: the excess-property check reads a fresh literal, not a value through a variable, so a discriminant-only variant is not closed. */
interface OutcomeBrand {
  readonly [OUTCOME_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & OutcomeBrand;

function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

interface ComposedShape {
  readonly kind: "composed";
  readonly composition: PublisherComposition;
}

interface BlockedUpstreamShape {
  readonly kind: "blocked-upstream";
  readonly source: string;
}

interface PendingUpstreamShape {
  readonly kind: "pending-upstream";
  readonly diagnostic: Diagnostic;
}

interface FailedShape {
  readonly kind: "failed";
  readonly diagnostic: Diagnostic;
}

interface NotAffectedShape {
  readonly kind: "not-affected";
}

/** What one flush decided about one node, and the whole set of those decisions. */
export type NodeOutcome =
  | Minted<ComposedShape>
  | Minted<BlockedUpstreamShape>
  | Minted<PendingUpstreamShape>
  | Minted<FailedShape>
  | Minted<NotAffectedShape>;

/** A node this flush never reached: what a lookup answers for a node holding nothing. A variant, not absence, so no reader asks four collections. Interned; it carries nothing to differ in. */
export const NOT_AFFECTED: NodeOutcome = mint<NotAffectedShape>({ kind: "not-affected" });

/** The outcome of a node that composed, carrying the composition every downstream reader wants. */
export function composedOutcome(composition: PublisherComposition): NodeOutcome {
  return mint<ComposedShape>({ kind: "composed", composition });
}

/** The outcome of a node whose upstream is failed, blocked or pending, naming the source. */
export function blockedOutcome(source: string): NodeOutcome {
  return mint<BlockedUpstreamShape>({ kind: "blocked-upstream", source });
}

/** The outcome of a node reading a source graph construction accepted and nothing has published. */
export function pendingOutcome(diagnostic: Diagnostic): NodeOutcome {
  return mint<PendingUpstreamShape>({ kind: "pending-upstream", diagnostic });
}

/** The outcome of a node whose own composition threw. */
export function failedOutcome(diagnostic: Diagnostic): NodeOutcome {
  return mint<FailedShape>({ kind: "failed", diagnostic });
}

/** The outcome recorded for `nodeId`, and the one place a miss becomes an answer. */
export function outcomeOf(outcomes: ReadonlyMap<string, NodeOutcome>, nodeId: string): NodeOutcome {
  return outcomes.get(nodeId) ?? NOT_AFFECTED;
}

/** Whether a node in this state stops readers from composing: 3 of 5 do, 2 do not. One total switch, so a sixth outcome fails `typecheck` here rather than a disjunction nobody re-read. */
export function blocksDownstream(outcome: NodeOutcome): boolean {
  switch (outcome.kind) {
    case "blocked-upstream":
    case "pending-upstream":
    case "failed":
      return true;
    case "composed":
    case "not-affected":
      return false;
    default:
      return unreachable(outcome);
  }
}

/** First source in canonical edge order that blocks this node, else undefined. Comparator injected: `compareEdges` owns ordering, so the source named never rides authored order or id encoding. */
export function firstBlockingSource(
  edges: readonly GraphEdge[],
  compare: (a: GraphEdge, b: GraphEdge) => number,
  outcome: (sourceId: string) => NodeOutcome,
): string | undefined {
  return edges.filter((edge) => blocksDownstream(outcome(edge.sourceId))).sort(compare)[0]
    ?.sourceId;
}

interface RecordValuesShape {
  readonly kind: "record";
  readonly values: Readonly<Record<string, unknown>>;
}

interface AbsentShape {
  readonly kind: "absent";
}

interface NotARecordShape {
  readonly kind: "not-a-record";
  readonly value: unknown;
}

/** What one source contributes to this flush, resolved once rather than guarded at four sites. */
export type SourceValues =
  | Minted<RecordValuesShape>
  | Minted<AbsentShape>
  | Minted<NotARecordShape>;

/** Nothing published; carries nothing, so nothing has to be built to say so. `sourceValues` reads a never-ready source ABSENT, so its readers go pending, not composed against `{}`. */
export const ABSENT: SourceValues = mint<AbsentShape>({ kind: "absent" });

/** The plain-record test, and its only owner here. Refuses `null`, arrays and class instances: a composer may read a renderer-neutral record, not a prototype this process does not own. */
export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function valuesOf(value: unknown): SourceValues {
  if (value === undefined) return ABSENT;
  if (isRecord(value)) return mint<RecordValuesShape>({ kind: "record", values: value });
  return mint<NotARecordShape>({ kind: "not-a-record", value });
}

/** Values a source contributes: the composition this flush made, else the last ready patch. Collection, merge and solver join must share it or a solver reads last tick's goal. */
export function sourceValues(outcome: NodeOutcome, patch: ReadyPatch | undefined): SourceValues {
  switch (outcome.kind) {
    case "composed":
      return valuesOf(outcome.composition.outputs.values);
    // Fallback is `PatchRegistry.lastReady`, not `get`: a blocked patch owns no values, so a failed
    // node keeps its last good pose. The precedence stops its readers before they read it.
    case "blocked-upstream":
    case "pending-upstream":
    case "failed":
    case "not-affected":
      return patch === undefined ? ABSENT : valuesOf(patch.outputs.values);
    default:
      return unreachable(outcome);
  }
}

/** Whether a source published anything at all, and nothing more: a record and a non-record both count, only absence does not. `graph/references.ts` owns pending; this owns published. */
export function hasValue(values: SourceValues): boolean {
  switch (values.kind) {
    case "record":
    case "not-a-record":
      return true;
    case "absent":
      return false;
    default:
      return unreachable(values);
  }
}

interface MissingUpstreamShape {
  readonly kind: "missing-upstream";
  readonly sourceId: string;
}

interface InputShapeFailure {
  readonly kind: "input-shape";
  readonly sourceId: string;
}

interface InputRequirementShape {
  readonly kind: "input-requirement";
  readonly edge: GraphEdge;
}

interface SolverScopeShape {
  readonly kind: "solver-scope";
  readonly nodeId: string;
}

interface MemberStateShape {
  readonly kind: "member-interpolation";
  readonly memberId: string;
}

interface GoalShapeFailure {
  readonly kind: "goal-shape";
  readonly nodeId: string;
  readonly memberId: string;
  readonly goalId: string;
}

/** What a caller hands `failPublication`: one failure, before it is minted. */
export type PublishFailureShape =
  | MissingUpstreamShape
  | InputShapeFailure
  | SolverScopeShape
  | MemberStateShape
  | GoalShapeFailure;

/** One publication failure, minted, and the whole set of them. */
export type PublishFailure =
  | Minted<MissingUpstreamShape>
  | Minted<InputShapeFailure>
  | Minted<SolverScopeShape>
  | Minted<MemberStateShape>
  | Minted<GoalShapeFailure>;

/** The message one failure renders to. Every arm is byte-identical to what it replaces. */
export function describePublishFailure(failure: PublishFailure): string {
  switch (failure.kind) {
    case "missing-upstream":
      return `Input source "${failure.sourceId}" has no published value.`;
    case "input-shape":
      return `Input source "${failure.sourceId}" must be a record.`;
    case "solver-scope":
      return `Solver "${failure.nodeId}" has no root requirement to scope its members.`;
    case "member-interpolation":
      return `Solver member "${failure.memberId}" exposes no interpolated function.`;
    case "goal-shape":
      return `Solver "${failure.nodeId}" member "${failure.memberId}" goal "${failure.goalId}" published no record.`;
    default:
      return unreachable(failure);
  }
}

/** Rule id a failure publishes under. 3 of 7 answer `composition-failure` and keep it: consumers branch on ids, so naming those three is a diagnostics change owing its own commit. */
export function publishFailureRule(failure: PublishFailure): IdentifiedRuleId {
  switch (failure.kind) {
    case "missing-upstream":
      return "upstream-missing";
    case "input-shape":
      return "input-source-shape";
    // All 7 name their node, so the group is decided here and `IdentifiedRuleId` holds: a producer of
    // the closed set, not a string that happens to match one.
    case "solver-scope":
    case "member-interpolation":
    case "goal-shape":
      return "composition-failure";
    default:
      return unreachable(failure);
  }
}

/** Error one publication failure is thrown as, carrying it. `name` is the rule id for all 7. Thrown inside the per-node boundary that builds a diagnostic, so the class never leaves here. */
export class PublishFailureError extends Error {
  readonly failure: PublishFailure;
  constructor(failure: PublishFailure) {
    super(describePublishFailure(failure));
    this.failure = failure;
    this.name = publishFailureRule(failure);
  }
}

/** Fails one node's publication, and is the only expression that throws one of these. */
export function failPublication(shape: PublishFailureShape): never {
  throw new PublishFailureError(mint(shape) as PublishFailure);
}

/** The record an input observation must be, else the failure that edge owes: absent -> missing-upstream, non-record -> input-shape. Both stay guards; the pending pre-check answers first. */
export function expectInputRecord(
  values: SourceValues,
  sourceId: string,
): Readonly<Record<string, unknown>> {
  switch (values.kind) {
    case "record":
      return values.values;
    case "absent":
      return failPublication({ kind: "missing-upstream", sourceId });
    case "not-a-record":
      return failPublication({ kind: "input-shape", sourceId });
    default:
      return unreachable(values);
  }
}

/** The record a source must be, else one failure either way: an absent source and a non-record share a message, since a plugin holding no graph cannot act on the difference. */
export function expectRecord(
  values: SourceValues,
  failure: PublishFailureShape,
): Readonly<Record<string, unknown>> {
  switch (values.kind) {
    case "record":
      return values.values;
    case "absent":
    case "not-a-record":
      return failPublication(failure);
    default:
      return unreachable(values);
  }
}
