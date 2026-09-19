import type { IdentifiedRuleId } from "../contract/rule";
import type { Diagnostic, Patch } from "../contract/v5";
import { describeEdge, type GraphEdge } from "../graph/ir";
import { unreachable } from "../domain/exhaustive";
import type { PublisherComposition } from "./graph-publisher";

/**
 * What one flush decided about one node, what one source contributes to it, and how one publication
 * failed.
 *
 * `GraphPublisher.flush` stored the first of those across three Sets and a Map, so "what happened to
 * node X" was answered by asking four collections in an order written out by hand at the top of the
 * loop, as `failed.has(id) || blocked.has(id) || pending.has(id)`. That precedence was a comment plus a
 * boolean expression: a fifth outcome would have been a fifth collection and a fourth term, and
 * nothing would have said where the term belonged. One map of one closed value answers it now, and the
 * precedence is a switch that names every variant.
 *
 * The second was `readSourceValues` answering `unknown`, guarded by `isRecord` at four call sites that
 * each threw a slightly different error. It is resolved once per source here, so the guard is a read
 * of a union rather than four copies of one type test, and which failure each caller owes is stated by
 * which reader it calls.
 *
 * The third was three error classes and a plain `Error`, where `ruleId` was a field on two of them and
 * absent on the third, so classification was an `instanceof` chain and three of the seven failures had
 * no name at all. Every failure this publisher raises is data now, and the rule id it publishes under
 * is a total function of that data. What a consumer reads is unchanged: every message and every rule
 * id is byte-identical to the one it replaces, including the three that publish as
 * `composition-failure`, because giving those their own ids is a change to published diagnostics and
 * therefore its own deliberate commit.
 *
 * Issue #443, phase B step 9. See ADR-016, ADR-044, ADR-047 and ADR-051.
 */
declare const OUTCOME_BRAND: unique symbol;

/**
 * The mint mark that keeps the three unions below closed as well as discriminated, for the reason
 * issue #387 gave: a variant declaring only its discriminant is not closed, because TypeScript's
 * excess-property check reads a fresh object literal rather than a value arriving through a variable.
 *
 * One mark for three unions, on `results.ts`'s precedent: they are minted in one module and none of
 * them is assignable to another, since their discriminants are disjoint.
 */
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

/**
 * A node this flush never reached, which is the answer a lookup gives for a node it holds nothing for.
 *
 * A variant rather than absence, because absence is what made the precedence above a conjunction over
 * four collections: every reader had to know which collection to ask and what a miss in all four
 * meant. Interned, because it carries nothing to differ in.
 */
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

/**
 * Whether a node in this state stops the nodes that read it from composing.
 *
 * The precedence, as one total switch. Three of the five stop a reader and two do not, and a sixth
 * outcome would fail `typecheck` here rather than being left out of a disjunction nobody re-read.
 */
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

/**
 * The first source, in canonical edge order, whose outcome stops this node, or `undefined`.
 *
 * The comparator is injected for the reason `firstPendingEdge` injects one: `compareEdges` in
 * `graph/ir.ts` is the only ordering owner, so which blocking source a node's diagnostic names never
 * depends on authored edge order or on how an id encodes. See ADR-034.
 */
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

/** Nothing published, which carries nothing, so nothing has to be built to say so. */
export const ABSENT: SourceValues = mint<AbsentShape>({ kind: "absent" });

/**
 * Whether a value is a plain record, and the one owner of that test in this folder.
 *
 * Moved here because the union above is what every caller of it was building by hand. `null`, arrays
 * and class instances are all refused: a renderer-neutral record is what a composer may read, and a
 * prototype nobody in this process owns is not one.
 */
export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function valuesOf(value: unknown): SourceValues {
  if (isRecord(value)) return mint<RecordValuesShape>({ kind: "record", values: value });
  return mint<NotARecordShape>({ kind: "not-a-record", value });
}

/**
 * The values a source contributes: its composition when this flush already produced one, and its
 * retained patch otherwise.
 *
 * One function rather than three copies of one precedence rule. The input collection, the output merge
 * and the goal a solver joins onto a chain leaf all have to agree about which of the two wins, and a
 * solver reading the retained patch where the other two read the composition would solve against last
 * tick's goal with no error and no diagnostic. See issue #195.
 */
export function sourceValues(outcome: NodeOutcome, patch: Patch | undefined): SourceValues {
  switch (outcome.kind) {
    case "composed":
      return valuesOf(outcome.composition.values);
    // Every other outcome falls back to what the node last published, which is exactly what an
    // absent memo entry did. A failed node keeps its retained values, and that is deliberate: the
    // precedence above stops its readers before they can read them.
    case "blocked-upstream":
    case "pending-upstream":
    case "failed":
    case "not-affected":
      return patch === undefined ? ABSENT : valuesOf(patch.values);
    default:
      return unreachable(outcome);
  }
}

/**
 * Whether a source has published anything at all, which is the pending question and nothing more.
 *
 * A record and a value that is not one are both published; only absence is not. That is what the
 * retired conjunction said, and stating it here keeps `graph/references.ts` the one owner of what
 * pending means while this module owns what published means.
 */
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

/** Which side of a composition an observation edge is on, which is half of two messages. */
export type ObservationRole = "input" | "output";

const OBSERVATION_ROLE = { input: "Input", output: "Output" } as const;

interface MissingUpstreamShape {
  readonly kind: "missing-upstream";
  readonly role: ObservationRole;
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

interface OutputShapeFailure {
  readonly kind: "output-shape";
  readonly sourceId: string;
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
  | InputRequirementShape
  | OutputShapeFailure
  | SolverScopeShape
  | MemberStateShape
  | GoalShapeFailure;

/** One publication failure, minted, and the whole set of them. */
export type PublishFailure =
  | Minted<MissingUpstreamShape>
  | Minted<InputShapeFailure>
  | Minted<InputRequirementShape>
  | Minted<OutputShapeFailure>
  | Minted<SolverScopeShape>
  | Minted<MemberStateShape>
  | Minted<GoalShapeFailure>;

/** The message one failure renders to. Every arm is byte-identical to what it replaces. */
export function describePublishFailure(failure: PublishFailure): string {
  switch (failure.kind) {
    case "missing-upstream":
      return `${OBSERVATION_ROLE[failure.role]} observation source "${failure.sourceId}" has no published value.`;
    case "input-shape":
      return `Input observation source "${failure.sourceId}" must be a record.`;
    case "input-requirement":
      return `Input observation edge ${describeEdge(failure.edge)} carries no requirement.`;
    case "output-shape":
      return `Output observation source "${failure.sourceId}" must publish a renderer-neutral record.`;
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

/**
 * The rule id one failure publishes under, and the read that replaces an `instanceof` chain.
 *
 * Three of the seven answer `composition-failure`, which is what they answered as plain `Error`s, and
 * that is preserved rather than improved: a rule id is what a consumer branches on, so naming those
 * three is a change to published diagnostics and owes its own commit. What this buys today is that the
 * three are named in the type, so the commit that gives them ids has one place to edit and a compiler
 * that will not let it forget one. See ADR-016.
 *
 * The return type is `IdentifiedRuleId` rather than `string`, which is the other half of that. This
 * function is a producer of rule ids, so it is held to the closed set like every other producer, and
 * the three arms answering `composition-failure` are provably members rather than strings that
 * happen to match one. It was the last producer left open, and the publisher forwarding its answer
 * into a `Diagnostic` is where the build said so: a union closed at the field and open at the
 * function that computes the field is closed nowhere.
 *
 * It says more than `RuleId` would, and the extra is true of all seven: every failure a publication
 * reports names the node it happened at, so every one of these rules always carries ids. That is
 * what lets `graph-publisher.ts` construct its diagnostic directly rather than asserting the
 * correlation, because the group the rule id belongs to is already decided here. See ADR-097.
 */
export function publishFailureRule(failure: PublishFailure): IdentifiedRuleId {
  switch (failure.kind) {
    case "missing-upstream":
      return "observation-missing-upstream";
    case "input-shape":
    case "input-requirement":
      return "observation-input-shape";
    case "output-shape":
      return "observation-output-shape";
    case "solver-scope":
    case "member-interpolation":
    case "goal-shape":
      return "composition-failure";
    default:
      return unreachable(failure);
  }
}

/**
 * The error one publication failure is thrown as, carrying the failure it was built from.
 *
 * One class where there were two plus a bare `Error`, and `name` is the rule id for all seven rather
 * than for four of them. Nothing observes that: every one of these is thrown inside the per-node
 * boundary that turns it into a diagnostic, so the class never leaves this publisher.
 */
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

/**
 * The record an input observation must be, or the failure that edge owes.
 *
 * Two outcomes, two failures, and which is which stated once: a source with nothing published is a
 * missing upstream, and a source that published something else is a shape failure. Both were
 * unreachable in normal flow before the pending pre-check, and both stay as defensive invariant
 * guards rather than as decisions.
 */
export function expectInputRecord(
  values: SourceValues,
  sourceId: string,
): Readonly<Record<string, unknown>> {
  switch (values.kind) {
    case "record":
      return values.values;
    case "absent":
      return failPublication({ kind: "missing-upstream", role: "input", sourceId });
    case "not-a-record":
      return failPublication({ kind: "input-shape", sourceId });
    default:
      return unreachable(values);
  }
}

/** The record an output observation must be, whose shape failure names renderer neutrality. */
export function expectOutputRecord(
  values: SourceValues,
  sourceId: string,
): Readonly<Record<string, unknown>> {
  switch (values.kind) {
    case "record":
      return values.values;
    case "absent":
      return failPublication({ kind: "missing-upstream", role: "output", sourceId });
    case "not-a-record":
      return failPublication({ kind: "output-shape", sourceId });
    default:
      return unreachable(values);
  }
}

/**
 * The record a source must be, or one failure whichever way it is not one.
 *
 * The goal a solver joins onto a chain leaf is the caller: it answered one message for an absent
 * source and for a source that published something else, because a plugin holding no graph cannot act
 * on the difference. See issue #195.
 */
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
